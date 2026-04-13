import argparse
import json
import logging
import sys
from contextlib import nullcontext
from typing import List, Dict, Any

import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

_DEFAULT_MODEL = "BAAI/bge-reranker-v2-m3"
_DEFAULT_DEVICE = "cuda"
_DEFAULT_FP16 = True
_DEFAULT_BATCH = 32
_DEFAULT_TOP_K = 5

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s — %(message)s",
    datefmt="%H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger("reranker")


class BGEReranker:
    def __init__(
            self,
            model_id: str = _DEFAULT_MODEL,
            device: str = _DEFAULT_DEVICE,
            fp16: bool = _DEFAULT_FP16,
            batch: int = _DEFAULT_BATCH,
    ) -> None:

        if device == "cuda" and not torch.cuda.is_available():
            logger.warning("CUDA not available — falling back to CPU.")
            device = "cpu"
            fp16 = False

        logger.info("Loading BGE reranker: %s  [device=%s  fp16=%s]", model_id, device, fp16)
        self._tokenizer = AutoTokenizer.from_pretrained(model_id, use_fast=True)
        self._model = AutoModelForSequenceClassification.from_pretrained(model_id)
        self._model.to(device)
        self._model.eval()
        self._device = device
        self._fp16 = bool(fp16 and device == "cuda")
        self._supports_autocast = hasattr(torch, "autocast")
        if self._fp16 and not self._supports_autocast:
            logger.warning("AMP autocast is unavailable in this PyTorch build — using fp32.")
            self._fp16 = False
        self._max_length = 512
        self._batch = batch
        logger.info("Reranker ready.")

    def rerank(
            self,
            query: str,
            chunks: List[Dict[str, Any]],
            top_k: int = _DEFAULT_TOP_K,
    ) -> List[Dict[str, Any]]:

        if not chunks:
            logger.warning("rerank() called with an empty chunk list — returning [].")
            return []

        if not query.strip():
            raise ValueError("query must be a non-empty string.")

        top_k = min(top_k, len(chunks))
        pairs = [[query, self._get_text(c)] for c in chunks]

        logger.info("Scoring %d chunks …", len(pairs))
        scores = []
        for i in range(0, len(pairs), self._batch):
            batch_pairs = pairs[i:i + self._batch]
            queries = [p[0] for p in batch_pairs]
            docs = [p[1] for p in batch_pairs]
            encoded = self._tokenizer(
                queries,
                docs,
                padding=True,
                truncation=True,
                max_length=self._max_length,
                return_tensors="pt",
            )
            encoded = {k: v.to(self._device) for k, v in encoded.items()}

            amp_ctx = (
                torch.autocast(device_type="cuda", dtype=torch.float16)
                if self._fp16 and self._supports_autocast
                else nullcontext()
            )
            with torch.inference_mode():
                with amp_ctx:
                    logits = self._model(**encoded).logits

            scores.extend(logits.view(-1).float().cpu().tolist())

        scored = []
        for chunk, score in zip(chunks, scores):
            entry = {k: v for k, v in chunk.items() if k != "embedding"}
            entry["rerank_score"] = float(score)
            scored.append(entry)

        ranked = sorted(scored, key=lambda x: x["rerank_score"], reverse=True)
        return ranked[:top_k]

    @staticmethod
    def _get_text(chunk: Dict[str, Any]) -> str:
        text = chunk.get("text") or chunk.get("chunk_text") or ""
        if not text:
            logger.warning("Chunk id=%s has no text — will score as empty string.", chunk.get("id", "?"))
        return str(text)


def _load_chunks_from_file(path: str) -> tuple[str | None, List[Dict[str, Any]]]:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, list):
        return None, data

    query_from_file = data.get("query")
    chunks = data.get("chunks", [])
    return query_from_file, chunks


def _main_cli() -> None:
    parser = argparse.ArgumentParser(description="BGE Reranker")
    parser.add_argument("--input", "-i", default="retrieved_chunks.json")
    parser.add_argument("--output", "-o", default="reranked_results.json")
    parser.add_argument("--query", "-q", default=None)
    parser.add_argument("--top_k", "-k", type=int, default=_DEFAULT_TOP_K)
    parser.add_argument("--device", default=_DEFAULT_DEVICE, choices=["cuda", "cpu"])
    args = parser.parse_args()

    logger.info("Loading chunks from: %s", args.input)
    try:
        query_from_file, chunks = _load_chunks_from_file(args.input)
    except FileNotFoundError:
        logger.error("File not found: %s", args.input)
        sys.exit(1)

    if not chunks:
        logger.error("No chunks found in %s", args.input)
        sys.exit(1)

    query = (args.query or query_from_file or "").strip()
    if not query:
        logger.error("No query provided in CLI or JSON file.")
        sys.exit(1)

    reranker = BGEReranker(device=args.device)
    top_results = reranker.rerank(query=query, chunks=chunks, top_k=args.top_k)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(top_results, f, indent=4, ensure_ascii=False)

    logger.info("Successfully saved top %d results to: %s", len(top_results), args.output)


if __name__ == "__main__":
    _main_cli()
