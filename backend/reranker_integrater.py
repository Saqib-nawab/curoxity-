import json
import logging
import os
from typing import Any

from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from openai import APIConnectionError, APITimeoutError, OpenAI

from reranker import BGEReranker

log = logging.getLogger(__name__)

load_dotenv()

CARD_SOURCE_FIELDS = [
    "population_breakdown",
    "adverse_events",
    "phase",
    "investigational_Product.name",
    "masking",
    "controlled",
    "sponsors.name",
    "allocation",
    "full_title",
    "locations.country",
    "date_of_end_trial",
    "date_of_start_trial",
    "primary_id",
]


def create_es_client_from_env() -> tuple[Elasticsearch, str]:
    url = os.getenv("ES_URL")
    password = os.getenv("ES_PASS")
    user = os.getenv("ES_USER")
    index = os.getenv("ES_INDEX")
    verify = os.environ.get("ES_VERIFY_CERTS", "true").lower() != "false"
    ca_cert = os.environ.get("ES_CA_CERT")

    missing = [
        k
        for k, v in [
            ("ES_URL", url),
            ("ES_USER", user),
            ("ES_PASS", password),
            ("ES_INDEX", index),
        ]
        if not v
    ]
    if missing:
        raise RuntimeError(f"Missing env vars: {', '.join(missing)}")

    es = Elasticsearch(
        hosts=[url],
        basic_auth=(user, password),
        verify_certs=verify,
        ca_certs=ca_cert if verify else None,
        request_timeout=float(os.getenv("ES_REQUEST_TIMEOUT", "3000")),
    )
    return es, index


def _get_llm_base_url() -> str:
    return (
        os.getenv("OPENAI_API_BASE")
    )


def _get_llm_api_key() -> str:
    return (
        "EMPTY"
    )


def _get_env_model_name() -> str | None:
    return (
        os.getenv("OPENAI_MODEL")
    )


def create_openai_client_from_env() -> OpenAI:
    base_url = _get_llm_base_url()
    api_key = _get_llm_api_key()

    log.info("Creating OpenAI-compatible client with base_url=%s ", base_url)
    return OpenAI(
        api_key="EMPTY",
        base_url=base_url,
    )


def resolve_model_id(client: OpenAI) -> str:
    model = _get_env_model_name()
    if model:
        log.info("Using configured model from environment: %s", model)
        return model

    log.info("No model configured in env; resolving via /v1/models")
    models = client.models.list()
    if not models.data:
        raise RuntimeError("No models returned by API at /v1/models")
    model_id = models.data[0].id
    log.info("Resolved model from API: %s", model_id)
    return model_id


def safe_resolve_model_id(client: OpenAI, fallback: str | None = None) -> str:
    env_model = _get_env_model_name()
    if env_model:
        return env_model

    fallback_model = fallback or "openai/gpt-oss-20b"
    try:
        return resolve_model_id(client)
    except (APITimeoutError, APIConnectionError, RuntimeError, Exception) as exc:
        log.exception("Falling back to default model because model resolution failed: %s", exc)
        return fallback_model


def build_chat_messages(trial_fields: dict[str, Any], chunks: list[str]) -> list[dict[str, str]]:
    system_prompt = (
        "You are a clinical-trial summarization assistant. "
        "Return valid JSON only. No explanation, no markdown. "
        "For each field: if the text is longer than one sentence, summarize it. "
        "Also provide 'chunks_summary' as a concise 2-3 sentence summary of retrieved chunks."
    )

    user_payload = {
        "trial_fields": trial_fields,
        "retrieved_chunks": chunks,
        "required_output_format": {
            "field1": "summarized_value",
            "field2": "summarized_value2",
            "chunks_summary": "summarized_value",
        },
    }

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": json.dumps(user_payload, ensure_ascii=False)},
    ]


def _extract_trial_id(chunk: dict[str, Any]) -> str | None:
    metadata = chunk.get("metadata", {}) if isinstance(chunk, dict) else {}
    if not isinstance(metadata, dict):
        metadata = {}
    return (
        metadata.get("primary_id")
        or metadata.get("primary_trial_id")
        or metadata.get("parent_id")
    )


def group_chunks_by_trial(chunks: list[dict[str, Any]]) -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = {}
    for chunk in chunks:
        trial_id = _extract_trial_id(chunk)
        if not trial_id:
            continue
        grouped.setdefault(trial_id, []).append(str(chunk.get("text", "")))
    return grouped


def get_ordered_trial_ids(reranked_chunks: list[dict[str, Any]]) -> list[str]:
    seen: set[str] = set()
    ordered_trial_ids: list[str] = []
    for chunk in reranked_chunks:
        trial_id = _extract_trial_id(chunk)
        if not trial_id or trial_id in seen:
            continue
        seen.add(trial_id)
        ordered_trial_ids.append(trial_id)
    return ordered_trial_ids


def fetch_ordered_trial_docs(
    es: Elasticsearch,
    index_name: str,
    ordered_trial_ids: list[str],
    source_fields: list[str] | None = None,
) -> list[dict[str, Any]]:
    if not ordered_trial_ids:
        return []

    es_response = es.search(
        index=index_name,
        body={
            "size": len(ordered_trial_ids),
            "_source": source_fields or CARD_SOURCE_FIELDS,
            "query": {
                "terms": {
                    "primary_id": ordered_trial_ids
                }
            },
        },
    )

    hits_map = {
        hit.get("_source", {}).get("primary_id"): hit
        for hit in es_response.get("hits", {}).get("hits", [])
        if hit.get("_source", {}).get("primary_id")
    }
    return [hits_map[pid] for pid in ordered_trial_ids if pid in hits_map]


def _try_parse_json(text: str) -> dict[str, Any]:
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass
    return {"raw_summary": text}


def build_trial_cards(
    *,
    chunks: list[dict[str, Any]],
    reranked_chunks: list[dict[str, Any]],
    es: Elasticsearch,
    index_name: str,
    openai_client: OpenAI,
    openai_model: str,
) -> list[dict[str, Any]]:
    grouped_chunks = group_chunks_by_trial(chunks)
    ordered_trial_ids = get_ordered_trial_ids(reranked_chunks)
    ordered_results = fetch_ordered_trial_docs(es, index_name, ordered_trial_ids)

    all_cards: list[dict[str, Any]] = []
    for result in ordered_results:
        trial_fields = result.get("_source", {})
        primary_id = trial_fields.get("primary_id")
        if not primary_id:
            continue

        all_chunks = grouped_chunks.get(primary_id, [])
        log.info("Building summary card for primary_id=%s chunk_count=%d", primary_id, len(all_chunks))

        try:
            chat_response = openai_client.chat.completions.create(
                model=openai_model,
                messages=build_chat_messages(trial_fields, all_chunks),
                stream=False,
            )
            content = (chat_response.choices[0].message.content).strip()
            all_cards.append(
                {
                    "primary_id": primary_id,
                    "trial_fields": trial_fields,
                    "summary": _try_parse_json(content),
                    "summary_raw": content,
                }
            )
        except (APITimeoutError, APIConnectionError, Exception) as exc:
            log.exception("Failed to build card summary for primary_id=%s: %s", primary_id, exc)
            all_cards.append(
                {
                    "primary_id": primary_id,
                    "trial_fields": trial_fields,
                    "summary": {"error": str(exc)},
                    "summary_raw": "",
                }
            )

    return all_cards


def run_integration_test():
    input_file = "retrieved_chunks.json"
    es, index = create_es_client_from_env()
    client = create_openai_client_from_env()
    openai_model = safe_resolve_model_id(client)

    print(f"--> Loading data from {input_file}...")
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    query = data.get("query", "")
    chunks = data.get("chunks", [])

    print("--> Initializing BGE Reranker...")
    reranker = BGEReranker(device=os.getenv("RERANKER_DEVICE"))

    print("--> Reranking chunks...")
    top_5_results = reranker.rerank(query=query, chunks=chunks, top_k=5)
    all_cards = build_trial_cards(
        chunks=chunks,
        reranked_chunks=top_5_results,
        es=es,
        index_name=index,
        openai_client=client,
        openai_model=openai_model,
    )
    print(json.dumps(all_cards, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    run_integration_test()
