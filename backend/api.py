"""
api.py — FastAPI endpoint for clinical trial RAG pipeline.

Flow:
  POST /userquery
    → PICOT intent extraction
    → BGE-M3 embed + ES kNN retrieval
    → BGE reranker
    → trial-level enrichment + LLM summaries
    → return retrieved chunks and final cards
"""
import logging
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import Request

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

sys.path.insert(0, str(Path(__file__).parent.parent))

from PICOT import run_intent_elicitation_pipeline
from retrieval import build_es, load_model, retrieve_raw_chunks, clean_intent, DEFAULT_CANDS
from reranker import BGEReranker
from reranker_integrater import (
    build_trial_cards,
    create_openai_client_from_env,
    safe_resolve_model_id,
)

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

DEFAULT_RERANK_TOP_K = 5
DEFAULT_OPENAI_MODEL = os.getenv("OPENAI_MODEL")

_state: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Loading retrieval model and connecting to Elasticsearch...")
    _state["es"] = build_es()
    _state["model"] = load_model()

    log.info("Loading reranker and OpenAI-compatible client...")
    _state["reranker"] = BGEReranker(device=os.getenv("RERANKER_DEVICE", "cpu"))
    _state["openai_client"] = create_openai_client_from_env()
    _state["default_openai_model"] = safe_resolve_model_id(
        _state["openai_client"],
        fallback=DEFAULT_OPENAI_MODEL,
    )

    _state["trial_index"] = os.getenv("ES_INDEX")
    if not _state["trial_index"]:
        raise RuntimeError("ES_INDEX env var is required for trial-level enrichment.")

    log.info(
        "Startup ready. trial_index=%s model=%s",
        _state["trial_index"],
        _state["default_openai_model"],
    )
    yield
    _state.clear()


app = FastAPI(title="Clinical Trial RAG API", lifespan=lifespan)


class QueryRequest(BaseModel):
    query: str
    candidates: int = DEFAULT_CANDS
    rerank_top_k: int = DEFAULT_RERANK_TOP_K
    include_cards: bool = True
    openai_model: str | None = None
    ollama_model: str | None = None


class ChunkResult(BaseModel):
    id: str
    es_score: float
    text: str
    metadata: dict


class QueryResponse(BaseModel):
    query: str
    intent_status: str
    specificity_score: float
    slots: dict
    chunk_count: int
    chunks: list[ChunkResult]
    reranked_count: int
    reranked_chunks: list[dict]
    card_count: int
    cards: list[dict]

@app.get("/health")
def health(request: Request):
    client_host = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    origin = request.headers.get("origin", "unknown")
    referer = request.headers.get("referer", "unknown")

    log.info(
        "GET /health hit | ip=%s | origin=%s | referer=%s | user_agent=%s",
        client_host,
        origin,
        referer,
        user_agent,
    )

    return {
        "ok": True,
        "message": "Health endpoint reached successfully",
        "client_ip": client_host,
        "origin": origin,
        "referer": referer,
        "trial_index": _state.get("trial_index"),
        "default_openai_model": _state.get("default_openai_model"),
    }


@app.post("/userquery", response_model=QueryResponse)
def user_query(req: QueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="query must not be empty")
    if req.candidates <= 0:
        raise HTTPException(status_code=400, detail="candidates must be > 0")
    if req.rerank_top_k <= 0:
        raise HTTPException(status_code=400, detail="rerank_top_k must be > 0")

    try:
        log.info("Entered /userquery query=%r candidates=%d rerank_top_k=%d include_cards=%s",
                 req.query[:200], req.candidates, req.rerank_top_k, req.include_cards)

        log.info("Step 1/4: extracting PICOT intent")
        raw_intent = run_intent_elicitation_pipeline(req.query)
        intent = clean_intent(raw_intent)

        log.info(
            "Intent ready: status=%s specificity=%.3f slots=%s",
            intent.get("status"),
            float(intent.get("specificity_score", 0)),
            list(intent.get("slots", {}).keys()),
        )

        log.info("Step 2/4: retrieving raw chunks from Elasticsearch")
        chunks = retrieve_raw_chunks(
            intent,
            _state["es"],
            _state["model"],
            candidates=req.candidates,
        )
        chunks = chunks[:100]
        log.info("Retrieved %d chunks", len(chunks))

        log.info("Step 3/4: reranking chunks")
        reranked_chunks = _state["reranker"].rerank(
            query=req.query,
            chunks=chunks,
            top_k=req.rerank_top_k,
        )
        log.info("Reranked down to %d chunks", len(reranked_chunks))

        cards = []
        if req.include_cards and reranked_chunks:
            log.info("Step 4/4: building trial cards")
            selected_model = (
                DEFAULT_OPENAI_MODEL
            )
            log.info("Using model=%s for card summaries", selected_model)

            cards = build_trial_cards(
                chunks=chunks,
                reranked_chunks=reranked_chunks,
                es=_state["es"],
                index_name=_state["trial_index"],
                openai_client=_state["openai_client"],
                openai_model=selected_model,
            )
            log.info("Built %d cards", len(cards))
        else:
            log.info("Skipping card generation")

        log.info("Returning response for /userquery")
        return QueryResponse(
            query=req.query,
            intent_status=intent.get("status", ""),
            specificity_score=float(intent.get("specificity_score", 0)),
            slots=intent.get("slots", {}),
            chunk_count=len(chunks),
            chunks=[ChunkResult(**c) for c in chunks],
            reranked_count=len(reranked_chunks),
            reranked_chunks=reranked_chunks,
            card_count=len(cards),
            cards=cards,
        )

    except HTTPException:
        raise
    except Exception as exc:
        log.exception("Unhandled error in /userquery: %s", exc)
        raise HTTPException(status_code=500, detail=f"/userquery failed: {exc}")
