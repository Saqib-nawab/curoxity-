"""
retrieval.py — chunk-level RAG retrieval for clinical trials, driven by PICOT intent.

Philosophy
----------
NO hard filters. Every slot — condition, phase, trial_status, location, dates —
contributes as a SOFT scoring signal. Documents that match more slots score higher;
documents that match fewer still appear but rank lower.

This is achieved by building one rich query text from all PICOT slots and running
a single kNN against the pre-computed chunk embeddings. The chunk_text field already
contains a metadata header (Status, Phase, Condition, Source, Title) so the embedding
naturally encodes those signals. A chunk whose metadata + content both match the query
scores higher than one where only the content matches.

Optional content_type boosts (also soft, via ES should-clauses on top of kNN) reward
chunks whose section type is most relevant to the populated PICOT dimensions.

Results are aggregated from chunk level → trial level by keeping the best-scoring
chunk per trial, then returning the top-k trials.

Real PICOT output contract
--------------------------
    status           : str
    specificity_score: float
    slots            : flat dict  field_name → value
                       NOTE: age_range may arrive as {"gte": N, "lte": N} dict
    slot_quality     : flat dict  field_name → float 0-1
    es_fields        : flat dict  field_name → str or list[str]
    match_types      : flat dict  field_name → "text"|"keyword"|"range"|"checkbox"
                       (may be absent — falls back to _MATCH_TYPE_FALLBACK)
    dismissed_fields : list[str]  — may be dim-prefixed e.g. "I.intervention_name"
                       OR plain e.g. "intervention_name" — both handled
    raw_query        : str
"""

import json
import logging
import os
import sys
from pathlib import Path

import torch
from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer

load_dotenv(Path(__file__).parent / ".env")

log = logging.getLogger(__name__)


# Config

def _load_config(path: Path) -> dict:
    if not path.exists():
        raise FileNotFoundError(f"Retrieval config not found: {path}")
    with open(path) as f:
        return json.load(f)

_CFG = _load_config(Path(__file__).parent / "retrieval_config.json")

CHUNK_INDEX    = os.environ.get("CHUNK_INDEX", _CFG.get("chunk_index", "clinical_trials_chunks"))
BGEM3_MODEL_ID = _CFG["model_id"]
DEVICE         = "cuda" if torch.cuda.is_available() else "cpu"
DEFAULT_K      = _CFG.get("default_k", 10)
DEFAULT_CANDS  = _CFG.get("default_candidates", 200)
MIN_SLOT_QUAL  = _CFG.get("min_slot_quality", 0.20)

_SRC_FIELDS = _CFG.get("chunk_source_fields", [
    "primary_trial_id", "source", "brief_title", "phase",
    "trial_status", "condition_name", "content_type",
    "chunk_text", "chunk_index", "chunk_total",
])

CONTENT_TYPE_BOOST = _CFG.get("content_type_boost", 1.2)

# variant maps to the canonical name used in _SLOT_LABELS and _SLOT_TO_DIM.
_SLOT_ALIASES: dict[str, str] = {
    "healthy_volunteers":          "healthy_volunteers_involved",
    "healthy_volunteers_involved": "healthy_volunteers_involved",
}

def _canonical_slot(slot: str) -> str:
    return _SLOT_ALIASES.get(slot, slot)


# Dismissed fields normalisation

def _normalise_dismissed(dismissed_fields: list) -> set[str]:
    result = set()
    for entry in dismissed_fields:
        s = str(entry)
        # Strip dim prefix if present: "I.intervention_name" → "intervention_name"
        if "." in s:
            s = s.split(".", 1)[1]
        result.add(s)
        result.add(_canonical_slot(s))
    return result


# Age range dict → readable string
def _age_range_to_text(value) -> str:
    """
    Convert an age_range value to a human-readable string suitable for embedding.
    Handles both dict form {"gte": 18, "lte": 65} and already-stringified form.
    """
    if isinstance(value, dict):
        gte = value.get("gte") or value.get("gt")
        lte = value.get("lte") or value.get("lt")
        if gte is not None and lte is not None:
            return f"ages {int(gte)} to {int(lte)}"
        if gte is not None:
            return f"age {int(gte)}+"
        if lte is not None:
            return f"up to age {int(lte)}"
        return str(value)
    return str(value).strip()


# Content-type soft boost maps

_PICO_DIM_TO_CONTENT_TYPES: dict[str, list[str]] = _CFG.get(
    "pico_to_content_types",
    {
        "P": ["Population", "Eligibility_Criteria"],
        "I": ["Investigational_Product", "Protocol_Design"],
        "C": ["Investigational_Product", "Reporting_Groups"],
        "O": ["Endpoints", "Reporting_Group_Values"],
    },
)

_SLOT_TO_DIM: dict[str, str] = {
    "condition":                    "P",
    "population_details":           "P",
    "age_range":                    "P",
    "gender":                       "P",
    "healthy_volunteers_involved":  "P",
    "intervention_name":            "I",
    "phase":                        "I",
    "intervention_model":           "I",
    "comparator":                   "C",
    "controlled":                   "C",
    "allocation":                   "C",
    "masking":                      "C",
    "primary_outcome":              "O",
    "secondary_outcome":            "O",
    "adverse_events":               "O",
    "trial_status":                 "I",
    "start_date":                   "T",
    "end_date":                     "T",
}

# Query text labels
_SLOT_LABELS: dict[str, str] = {
    "condition":                   "condition",
    "population_details":          "patient profile",
    "age_range":                   "age",
    "gender":                      "gender",
    "healthy_volunteers_involved": "healthy volunteers",
    "intervention_name":           "intervention",
    "phase":                       "phase",
    "intervention_model":          "study design",
    "comparator":                  "comparator",
    "controlled":                  "controlled",
    "allocation":                  "allocation",
    "masking":                     "masking",
    "primary_outcome":             "primary outcome",
    "secondary_outcome":           "secondary outcome",
    "adverse_events":              "adverse events",
    "trial_status":                "status",
    "start_date":                  "started",
    "end_date":                    "ended",
}


# ES + model

def build_es() -> Elasticsearch:
    url    = os.environ.get("ES_URL")
    user   = os.environ.get("ES_USER")
    passwd = os.environ.get("ES_PASS")
    verify = os.environ.get("ES_VERIFY_CERTS", "true").lower() != "false"
    ca     = os.environ.get("ES_CA_CERT")

    missing = [k for k, v in [("ES_URL", url), ("ES_USER", user), ("ES_PASS", passwd)] if not v]
    if missing:
        log.error("Missing env vars: %s", ", ".join(missing))
        sys.exit(1)
    if verify and not ca:
        log.error("ES_VERIFY_CERTS=true but ES_CA_CERT not set")
        sys.exit(1)
    if verify and not os.path.exists(ca):
        log.error("CA cert file not found: %s", ca)
        sys.exit(1)

    return Elasticsearch(
        hosts=[url],
        basic_auth=(user, passwd),
        verify_certs=verify,
        ca_certs=ca if verify else None,
        request_timeout=120,
        retry_on_timeout=True,
    )


def load_model() -> SentenceTransformer:
    log.info("Loading BGE-M3 (%s) on %s …", BGEM3_MODEL_ID, DEVICE)
    model = SentenceTransformer(BGEM3_MODEL_ID, device=DEVICE)
    if DEVICE == "cuda":
        model = model.half()
    return model


# Query text construction

def build_query_text(intent: dict) -> str:
    """
    Build a single pipe-delimited query string from all active PICOT slots.

    Format mirrors the chunk_text metadata header for maximum BGE-M3 alignment:
        "condition: androgenetic alopecia | phase: Phase III | age: ages 18 to 65"

    Slots are ordered by slot_quality descending — highest-signal terms first.

    Inclusion rules per slot:
        - Not in dismissed_fields (after normalising dim-prefixed entries)
        - Value is non-null and non-empty
        - slot_quality >= MIN_SLOT_QUAL
    """
    slots        = intent.get("slots", {})
    slot_quality = intent.get("slot_quality", {})
    dismissed    = intent.get("_dismissed_set", set())  # pre-normalised by clean_intent

    active = []
    for raw_slot, value in slots.items():
        slot = _canonical_slot(raw_slot)

        if slot in dismissed or raw_slot in dismissed:
            log.debug("  [dismissed] %s", slot)
            continue
        if value is None or str(value).strip() == "":
            continue

        q = float(slot_quality.get(raw_slot, slot_quality.get(slot, 0.0)))
        if q < MIN_SLOT_QUAL:
            log.debug("  [skip] slot=%s  quality=%.2f < %.2f", slot, q, MIN_SLOT_QUAL)
            continue

        active.append((slot, raw_slot, value, q))

    # Highest quality first
    active.sort(key=lambda x: x[3], reverse=True)

    parts = []
    for slot, raw_slot, value, _ in active:
        label = _SLOT_LABELS.get(slot, slot.replace("_", " "))

        # Format value based on type
        if slot == "age_range" or (isinstance(value, dict) and ("gte" in value or "lte" in value)):
            formatted = _age_range_to_text(value)
        elif isinstance(value, dict):
            # Generic dict fallback
            formatted = " ".join(f"{k}: {v}" for k, v in value.items() if v is not None)
        elif isinstance(value, list):
            formatted = ", ".join(str(v) for v in value)
        else:
            formatted = str(value).strip()

        if formatted:
            parts.append(f"{label}: {formatted}")

    query = " | ".join(parts)
    if not query:
        query = intent.get("raw_query", "")
        log.info("No slots passed threshold — using raw_query: %s", query[:200])
    else:
        log.info("Query text (%d slots): %s", len(parts), query[:300])

    return query


# Content-type soft boosts
def _build_content_type_boosts(intent: dict) -> list[dict]:
    """
    Soft ES should-clauses that boost chunks whose content_type aligns with
    active PICOT dimensions. Strictly additive — nothing is ever excluded.
    """
    slots        = intent.get("slots", {})
    slot_quality = intent.get("slot_quality", {})
    dismissed    = intent.get("_dismissed_set", set())

    dims_active: set[str] = set()
    for raw_slot in slots:
        slot = _canonical_slot(raw_slot)
        if slot in dismissed or raw_slot in dismissed:
            continue
        q = float(slot_quality.get(raw_slot, slot_quality.get(slot, 0.0)))
        if q < MIN_SLOT_QUAL:
            continue
        dim = _SLOT_TO_DIM.get(slot)
        if dim:
            dims_active.add(dim)

    seen_types: set[str] = set()
    boosts: list[dict] = []
    for dim in sorted(dims_active):
        for ct in _PICO_DIM_TO_CONTENT_TYPES.get(dim, []):
            if ct not in seen_types:
                boosts.append({
                    "term": {
                        "content_type": {
                            "value": ct,
                            "boost": CONTENT_TYPE_BOOST,
                        }
                    }
                })
                seen_types.add(ct)

    if seen_types:
        log.info(
            "Content-type boosts: %s  (boost=%.2f)",
            sorted(seen_types), CONTENT_TYPE_BOOST,
        )
    return boosts


# Trial-level aggregation

def _aggregate_to_trials(hits: list[dict], k: int) -> list[dict]:
    """
    Group chunk hits by primary_trial_id.
    Keep the highest-scoring chunk per trial as the representative snippet.
    Return top-k trials sorted by score descending.
    """
    trials: dict[str, dict] = {}

    for hit in hits:
        src   = hit.get("_source", {})
        tid   = src.get("primary_trial_id") or hit["_id"]
        score = float(hit.get("_score") or 0.0)

        if tid not in trials or score > trials[tid]["score"]:
            trials[tid] = {
                "trial_id":   tid,
                "score":      score,
                "source":     src.get("source", ""),
                "title":      src.get("brief_title", ""),
                "phase":      src.get("phase", ""),
                "status":     src.get("trial_status", ""),
                "condition":  src.get("condition_name", ""),
                "best_chunk": {
                    "content_type": src.get("content_type", ""),
                    "chunk_index":  src.get("chunk_index", 0),
                    "chunk_total":  src.get("chunk_total", 0),
                    "chunk_text":   src.get("chunk_text", ""),
                },
            }

    ranked = sorted(trials.values(), key=lambda x: x["score"], reverse=True)
    log.info(
        "Aggregated %d chunk hits → %d unique trials → returning top %d",
        len(hits), len(ranked), k,
    )
    return ranked[:k]


# Core retrieval

def retrieve(
    intent: dict,
    es: Elasticsearch,
    model: SentenceTransformer,
    k: int = DEFAULT_K,
    candidates: int = DEFAULT_CANDS,
) -> list[dict]:
    """
    Retrieve top-k clinical trials matching the PICOT intent.
    """
    query_text = build_query_text(intent)
    if not query_text.strip():
        log.warning("Empty query — no usable slots. Returning empty results.")
        return []

    # Encode
    vector = model.encode(
        [query_text],
        normalize_embeddings=True,
        show_progress_bar=False,
    ).tolist()[0]

    # Soft content-type boosts
    should_clauses = _build_content_type_boosts(intent)

    # Over-fetch: a trial has ~5-30 chunks; fetch enough for k*10 candidate trials
    fetch = max(candidates * 5, k * 30)

    body: dict = {
        "knn": {
            "field":          "embedding",
            "query_vector":   vector,
            "k":              fetch,
            "num_candidates": fetch * 2,
        },
        "size":    fetch,
        "_source": _SRC_FIELDS,
    }

    if should_clauses:
        # should without minimum_should_match = every doc eligible,
        # matching docs get a score bonus
        body["query"] = {
            "bool": {
                "should": should_clauses,
            }
        }

    log.info(
        "ES kNN → field=embedding  k=%d  num_candidates=%d  soft_boosts=%d",
        fetch, fetch * 2, len(should_clauses),
    )

    try:
        resp = es.search(index=CHUNK_INDEX, **body)
    except Exception as exc:
        log.error("ES search failed: %s", exc)
        return []

    hits = resp["hits"]["hits"]
    log.info("Raw chunk hits: %d", len(hits))

    return _aggregate_to_trials(hits, k)


# Intent cleaning

_PLACEHOLDER = "<value or null>"


def clean_intent(raw: dict) -> dict:
    """
    Sanitise a real PICOT intent dict before passing to retrieve().

    """
    raw_slots    = raw.get("slots", {})
    match_types  = raw.get("match_types", {})
    es_fields    = raw.get("es_fields", {})
    slot_quality = raw.get("slot_quality", {})

    # Normalise dismissed_fields to plain slot names
    dismissed_set = _normalise_dismissed(raw.get("dismissed_fields", []))

    # Clean slots: drop nulls, placeholders, empty strings
    clean_slots: dict = {}
    for k, v in raw_slots.items():
        if v is None or v == _PLACEHOLDER:
            continue
        # Keep dict values (age_range) — stringify check only for strings
        if isinstance(v, str) and v.strip() == "":
            continue
        clean_slots[k] = v

    # Normalise match_types
    clean_match_types = {
        k: match_types.get(k, "text").split(",")[0].strip()
        for k in clean_slots
    }

    # Keep es_fields for reference (not used in soft-only retrieval but useful for debug)
    clean_es_fields = {k: v for k, v in es_fields.items() if k in clean_slots}

    # Coerce slot_quality to float
    clean_quality: dict[str, float] = {}
    for k in clean_slots:
        v = slot_quality.get(k)
        try:
            clean_quality[k] = float(v) if v is not None else 0.0
        except (TypeError, ValueError):
            clean_quality[k] = 0.0

    return {
        **raw,
        "slots":          clean_slots,
        "match_types":    clean_match_types,
        "es_fields":      clean_es_fields,
        "slot_quality":   clean_quality,
        # Internal: pre-normalised dismissed set for O(1) lookup
        "_dismissed_set": dismissed_set,
    }


# Raw chunk retrieval (reranker format)

def retrieve_raw_chunks(
    intent: dict,
    es: Elasticsearch,
    model: SentenceTransformer,
    candidates: int = DEFAULT_CANDS,
) -> list[dict]:
    """
    Same kNN as retrieve() but returns every chunk hit in the flat format
    the reranker expects:
        { id, es_score, text, metadata: { all stored fields } }

    No trial-level aggregation — the reranker handles ranking.
    """
    query_text = build_query_text(intent)
    if not query_text.strip():
        log.warning("Empty query — no usable slots. Returning empty results.")
        return []

    vector = model.encode(
        [query_text],
        normalize_embeddings=True,
        show_progress_bar=False,
    ).tolist()[0]

    should_clauses = _build_content_type_boosts(intent)
    fetch = max(candidates * 5, 1000)

    body: dict = {
        "knn": {
            "field":          "embedding",
            "query_vector":   vector,
            "k":              fetch,
            "num_candidates": fetch * 2,
        },
        "size":    fetch,
        "_source": _SRC_FIELDS,
    }

    if should_clauses:
        body["query"] = {"bool": {"should": should_clauses}}

    log.info(
        "ES kNN (raw chunks) → k=%d  num_candidates=%d  soft_boosts=%d",
        fetch, fetch * 2, len(should_clauses),
    )

    try:
        resp = es.search(index=CHUNK_INDEX, **body)
    except Exception as exc:
        log.error("ES search failed: %s", exc)
        return []

    chunks = []
    for hit in resp["hits"]["hits"]:
        src = hit.get("_source", {})
        chunks.append({
            "id":       src.get("chunk_uuid") or hit["_id"],
            "es_score": float(hit.get("_score") or 0.0),
            "text":     src.get("chunk_text", ""),
            "metadata": src,
        })

    log.info("Raw chunk hits returned: %d", len(chunks))
    return chunks


# Input parsing

def parse_intent_json(raw: str) -> dict:
    try:
        data, _ = json.JSONDecoder().raw_decode(raw.strip())
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON: {exc}") from exc
    if isinstance(data, list):
        data = data[0] if data else {}
    if not isinstance(data, dict):
        raise ValueError("Intent JSON must be a JSON object.")
    if "slots" not in data and "pico" not in data:
        raise ValueError("Intent JSON must contain 'slots' or 'pico'.")
    return data


def load_intent_json(args) -> dict:
    if getattr(args, "input", None):
        raw = Path(args.input).read_text(encoding="utf-8")
        log.info("Loaded intent from file: %s", args.input)
    elif getattr(args, "json", None):
        raw = args.json
        log.info("Loaded intent from --json.")
    else:
        if sys.stdin.isatty():
            print("Paste intent JSON then press Ctrl-D:")
        raw = sys.stdin.read()
    return clean_intent(parse_intent_json(raw))


# Entry point

def main() -> None:
    import argparse
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )

    parser = argparse.ArgumentParser(
        description="Clinical trial PICOT-driven chunk-level RAG retrieval."
    )
    grp = parser.add_mutually_exclusive_group()
    grp.add_argument("--input", "-i", metavar="FILE")
    grp.add_argument("--json",  "-j", metavar="JSON")
    parser.add_argument("--k",          type=int, default=DEFAULT_K)
    parser.add_argument("--candidates", type=int, default=DEFAULT_CANDS)
    parser.add_argument("--out",        metavar="FILE")
    args = parser.parse_args()

    intent = load_intent_json(args)
    log.info("Status            : %s", intent.get("status", "n/a"))
    log.info("Specificity score : %.3f", float(intent.get("specificity_score", 0)))
    log.info("Slots             : %s", list(intent.get("slots", {}).keys()))
    log.info("Dismissed         : %s", intent.get("_dismissed_set", set()))

    es    = build_es()
    model = load_model()

    results = retrieve(intent, es, model, k=args.k, candidates=args.candidates)

    output = json.dumps({
        "query":   intent.get("raw_query", ""),
        "k":       args.k,
        "count":   len(results),
        "results": results,
    }, indent=2, default=str)

    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
        log.info("Results written to %s", args.out)
    else:
        print(output)


if __name__ == "__main__":
    main()