from __future__ import annotations

import json
import logging
import os
import re
from dataclasses import dataclass, field
from enum import Enum
from functools import lru_cache
from typing import Any

from dotenv import load_dotenv
from openai import APIConnectionError, APITimeoutError, OpenAI

load_dotenv()

log = logging.getLogger(__name__)


def _get_llm_base_url() -> str | None:
    return os.getenv("OPENAI_API_BASE")


def _get_llm_api_key() -> str | None:
    return os.getenv("OPENAI_API_KEY")


def _get_llm_timeout() -> float:
    return float(os.getenv("OPENAI_TIMEOUT", "30"))


@lru_cache(maxsize=1)
def get_client() -> OpenAI:
    base_url = _get_llm_base_url()
    api_key = _get_llm_api_key()
    timeout = _get_llm_timeout()
    log.info("PICOT client using base_url=%s timeout=%ss", base_url, timeout)
    return OpenAI(api_key=api_key, base_url=base_url, timeout=timeout)


@lru_cache(maxsize=1)
def get_model_id() -> str:
    model = os.getenv("OPENAI_MODEL")
    if model:
        return model

    try:
        models = get_client().models.list()
        if not getattr(models, "data", None):
            raise RuntimeError("No models returned by API at /v1/models")
        return models.data[0].id
    except (APITimeoutError, APIConnectionError, Exception) as exc:
        fallback = "openai/gpt-oss-20b"
        log.exception("PICOT model resolution failed, using fallback=%s: %s", fallback, exc)
        return fallback


PICO_REGISTRY = {
    "P": {
        "label": "Population / Patient",
        "mandatory": True,
        "weight": 0.40,
        "fields": {
            "condition": {
                "weight": 0.50,
                "es_field": ["condition_name", "condition_information.therapeutic_area"],
                "match": "text",
                "description": "Medical condition or disease being studied",
                "hint": (
                    "Vague disease names (bare 'cancer', bare 'diabetes') score low. "
                    "Sub-type is required. For cancers, stage or receptor status further "
                    "improves the score. For non-cancer conditions, sub-type alone is sufficient."
                ),
            },
            "population_details": {
                "weight": 0.25,
                "es_field": ["inclusion_criteria", "exclusion_criteria"],
                "match": "text",
                "description": "Patient profile — prior history, comorbidities, prior treatments",
                "hint": (
                    "Extract age, gender, diagnosis stage, prior treatments, comorbidities. "
                    "E.g. '65-year-old male with no prior insulin use'."
                ),
            },
            "age_range": {
                "weight": 0.10,
                "es_field": ["population_breakdown.age_range.min", "population_breakdown.age_range.max"],
                "match": "range",
                "description": "Age range of the target patient population",
                "hint": (
                    "Extract as natural language only (no JSON ranges). "
                    "Examples: 'ages 2 to 11', 'age 65+', 'around 65 years'."
                ),
            },
            "gender": {
                "weight": 0.10,
                "es_field": "population_breakdown.gender",
                "match": "keyword",
                "description": "Target gender (Male / Female / All)",
                "hint": "Normalise to Male, Female, or All.",
            },
            "healthy_volunteers_involved": {
                "weight": 0.05,
                "es_field": "population_breakdown.healthy_volunteers_involved",
                "match": "keyword",
                "description": "Whether healthy volunteers are accepted (Yes / No)",
                "hint": "Normalise to Yes or No.",
            },
        },
    },
    "I": {
        "label": "Intervention",
        "mandatory": True,
        "weight": 0.30,
        "fields": {
            "intervention_name": {
                "weight": 0.70,
                "es_field": ["investigational_Product.name", "periods.arms.arm_imp.imp_name"],
                "match": "text",
                "description": "Drug, biological, device, or procedure being studied",
                "hint": (
                    "Extract the INN or brand name exactly as stated. "
                    "Drug class alone ('SGLT2 inhibitor') scores 0.35; "
                    "known INN ('metformin') scores 0.90."
                ),
            },
            "phase": {
                "weight": 0.20,
                "es_field": "phase",
                "match": "keyword",
                "description": "Clinical trial phase (Phase I / II / III / IV)",
                "hint": "Extract phase label e.g. 'Phase III'.",
            },
            "intervention_model": {
                "weight": 0.10,
                "es_field": "intervention_model",
                "match": "checkbox",
                "description": "Structure of the intervention arms",
                "checkbox_options": ["Parallel", "Crossover", "Factorial", "Sequential", "Single group"],
                "hint": "Present as checkbox options.",
            },
        },
    },
    "C": {
        "label": "Comparison",
        "mandatory": True,
        "weight": 0.15,
        "fields": {
            "comparator": {
                "weight": 0.50,
                "es_field": ["periods.arms.description", "periods.arms.arm_imp.imp_name"],
                "match": "text",
                "description": "Comparator arm — placebo, standard of care, another drug",
                "hint": (
                    "Extract what the intervention is being compared against. "
                    "E.g. 'placebo', 'standard chemotherapy', 'metformin'."
                ),
            },
            "controlled": {
                "weight": 0.20,
                "es_field": "controlled",
                "match": "checkbox",
                "description": "Whether the trial is controlled",
                "checkbox_options": ["Yes", "No", "N/A"],
                "hint": "Present as checkbox options.",
            },
            "allocation": {
                "weight": 0.15,
                "es_field": "allocation",
                "match": "checkbox",
                "description": "How participants are assigned to arms",
                "checkbox_options": ["Randomised", "Non-randomised", "None (single group)"],
                "hint": "Present as checkbox options.",
            },
            "masking": {
                "weight": 0.15,
                "es_field": "masking",
                "match": "checkbox",
                "description": "Blinding strategy",
                "checkbox_options": ["Open", "Single blind", "Double blind", "Triple blind", "Quadruple blind"],
                "hint": "Present as checkbox options.",
            },
        },
    },
    "T": {
        "label": "Time / Trial Period",
        "mandatory": True,
        "weight": 0.05,
        "fields": {
            "start_date": {
                "weight": 0.50,
                "es_field": "date_of_start_trial",
                "match": "range",
                "description": "Date or period when the trial started (or should have started)",
                "hint": (
                    "Extract as natural language only (no JSON ranges). "
                    "Keep clear phrases like 'after 2020', 'last 5 years', "
                    "'in 2022', 'from 2019 to 2022'."
                ),
            },
            "end_date": {
                "weight": 0.50,
                "es_field": "date_of_end_trial",
                "match": "range",
                "description": "Date or period when the trial ended (or should end)",
                "hint": (
                    "Extract as natural language only (no JSON ranges). "
                    "Keep clear phrases like 'before 2023', 'completed by 2022', "
                    "'ended last year'."
                ),
            },
        },
    },
    "O": {
        "label": "Outcome",
        "mandatory": True,
        "weight": 0.15,
        "fields": {
            "primary_outcome": {
                "weight": 0.50,
                "es_field": ["primary_objective", "endpoints.title", "endpoints.description"],
                "match": "text",
                "description": "Primary endpoint or outcome being measured",
                "hint": (
                    "E.g. 'overall survival', 'HbA1c reduction', "
                    "'time to disease progression'."
                ),
            },
            "secondary_outcome": {
                "weight": 0.20,
                "es_field": ["secondary_objective", "endpoints.title"],
                "match": "text",
                "description": "Secondary endpoints or outcomes",
                "hint": "E.g. 'quality of life', 'adverse event rate'.",
            },
            "adverse_events": {
                "weight": 0.15,
                "es_field": ["adverse_events.serious_adverse_events", "adverse_events.non-serious_adverse_events"],
                "match": "text",
                "description": "Adverse events or side effects of interest",
                "hint": (
                    "Extract only if the user explicitly asks about side effects "
                    "or adverse events."
                ),
            },
            "trial_status": {
                "weight": 0.15,
                "es_field": "trial_status",
                "match": "keyword",
                "description": "Current recruitment status of the trial",
                "hint": (
                    "Known values: Recruiting | Active (not recruiting) | "
                    "Completed | Terminated | Withdrawn | Suspended."
                ),
            },
        },
    },
}


def _all_fields():
    for dim, dim_meta in PICO_REGISTRY.items():
        for fname, fmeta in dim_meta["fields"].items():
            yield dim, fname, fmeta


SPECIFICITY_THRESHOLD = 0.6
MAX_CLARIFICATION_QUESTIONS = 5
ENABLE_FOLLOW_UP_QUESTIONS = False

_STATUS_MAP = {
    "recruiting": "Recruiting",
    "active": "Active (not recruiting)",
    "active, not recruiting": "Active (not recruiting)",
    "active (not recruiting)": "Active (not recruiting)",
    "not recruiting": "Active (not recruiting)",
    "completed": "Completed",
    "terminated": "Terminated",
    "withdrawn": "Withdrawn",
    "suspended": "Suspended",
}
_GENDER_MAP = {
    "male": "Male",
    "female": "Female",
    "all": "All",
    "both": "All",
    "any": "All",
}
_AGE_GROUPS = {
    "neonate": {"gte": 0, "lte": 0},
    "infant": {"gte": 0, "lte": 1},
    "child": {"gte": 2, "lte": 11},
    "children": {"gte": 2, "lte": 11},
    "adolescent": {"gte": 12, "lte": 17},
    "adult": {"gte": 18, "lte": 64},
    "adults": {"gte": 18, "lte": 64},
    "elderly": {"gte": 65},
    "older": {"gte": 65},
    "senior": {"gte": 65},
    "paediatric": {"gte": 0, "lte": 17},
    "pediatric": {"gte": 0, "lte": 17},
}


def _normalise_pico(pico: dict[str, Any]) -> dict[str, Any]:
    p = pico.get("P", {})
    i = pico.get("I", {})
    o = pico.get("O", {})

    if p.get("gender"):
        p["gender"] = _GENDER_MAP.get(str(p["gender"]).strip().lower(), p["gender"])

    def _compact_text(value: Any) -> str | None:
        if value is None:
            return None
        cleaned = re.sub(r"\s+", " ", str(value)).strip()
        return cleaned or None

    def _as_int(value: Any) -> int | None:
        try:
            return int(float(value))
        except (TypeError, ValueError):
            return None

    def _age_range_to_text(value: Any) -> str | None:
        if value is None:
            return None
        if isinstance(value, dict):
            gte = _as_int(value.get("gte", value.get("gt")))
            lte = _as_int(value.get("lte", value.get("lt")))
            if gte is not None and lte is not None:
                if gte == lte:
                    return f"age {gte}"
                return f"ages {gte} to {lte}"
            if gte is not None:
                return f"age {gte}+"
            if lte is not None:
                return f"up to age {lte}"
            return None

        text = _compact_text(value)
        if not text:
            return None
        lowered = text.lower()
        if lowered in _AGE_GROUPS:
            return _age_range_to_text(_AGE_GROUPS[lowered])

        digits_only = _as_int(lowered)
        if digits_only is not None:
            return f"around {digits_only} years old"
        return text

    def _time_range_to_text(value: Any) -> str | None:
        if value is None:
            return None
        if isinstance(value, dict):
            gte = _compact_text(value.get("gte", value.get("gt")))
            lte = _compact_text(value.get("lte", value.get("lt")))
            if gte and lte:
                if gte == lte:
                    return f"on {gte}"
                return f"from {gte} to {lte}"
            if gte:
                return f"after {gte}"
            if lte:
                return f"before {lte}"
            return None
        return _compact_text(value)

    if p.get("age_range") is not None:
        p["age_range"] = _age_range_to_text(p.get("age_range"))

    if p.get("healthy_volunteers_involved"):
        raw = str(p["healthy_volunteers_involved"]).strip().lower()
        if raw in ("yes", "true", "accepted"):
            p["healthy_volunteers_involved"] = "Yes"
        elif raw in ("no", "false", "not accepted", "excluded"):
            p["healthy_volunteers_involved"] = "No"

    if o.get("trial_status"):
        raw = str(o["trial_status"]).strip().lower()
        o["trial_status"] = _STATUS_MAP.get(raw, o["trial_status"])

    t = pico.get("T", {})
    for tfield in ("start_date", "end_date"):
        val = t.get(tfield)
        if val is None:
            continue
        t[tfield] = _time_range_to_text(val)

    pico["T"] = t
    pico["P"] = p
    pico["I"] = i
    pico["O"] = o
    return pico


class IntentStatus(Enum):
    COLLECTING = "collecting"
    READY = "ready"
    DEGRADED = "degraded"
    MAX_REACHED = "max_reached"


@dataclass
class PicoState:
    raw_query: str
    conversation_history: list[dict[str, str]] = field(default_factory=list)
    pico: dict[str, dict[str, Any]] = field(
        default_factory=lambda: {"P": {}, "I": {}, "C": {}, "O": {}, "T": {}}
    )
    quality: dict[str, float] = field(default_factory=dict)
    field_source: dict[str, str] = field(default_factory=dict)
    specificity_score: float = 0.0
    questions_asked: int = 0
    status: IntentStatus = IntentStatus.COLLECTING
    impatience_detected: bool = False
    dismissed_fields: set[str] = field(default_factory=set)
    last_asked_dim: str = ""
    last_asked_fields: list[str] = field(default_factory=list)
    preferred_dim: str = ""


def llm(system: str, user: str, history: list[dict[str, str]] | None = None) -> str:
    messages: list[dict[str, str]] = []
    if system:
        messages.append({"role": "system", "content": system})
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": user})

    try:
        response = get_client().chat.completions.create(
            model=get_model_id(),
            messages=messages,
            stream=False,
        )
        content = response.choices[0].message.content if response.choices else None
        return (content or "").strip()
    except (APITimeoutError, APIConnectionError, Exception) as exc:
        log.exception("PICOT llm() failed: %s", exc)
        return "{}"


def llm_json(system: str, user: str, history: list[dict[str, str]] | None = None) -> dict[str, Any]:
    raw = llm(system, user, history)
    clean = re.sub(r"```(?:json)?|```", "", raw).strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        return {"_raw": raw, "_parse_error": True}


def _safe_q(state: PicoState, dim: str, fname: str) -> float:
    key = f"{dim}.{fname}"
    val = state.quality.get(key, 0.0)
    try:
        return float(val) if val is not None else 0.0
    except (TypeError, ValueError):
        return 0.0


def _dim_score(state: PicoState, dim: str) -> tuple[float, float]:
    dim_meta = PICO_REGISTRY[dim]
    achieved = 0.0
    possible = 0.0
    for fname, fmeta in dim_meta["fields"].items():
        key = f"{dim}.{fname}"
        if key in state.dismissed_fields:
            continue
        possible += fmeta["weight"]
        achieved += fmeta["weight"] * _safe_q(state, dim, fname)
    return achieved, possible


def _compute_specificity(state: PicoState) -> float:
    total_achieved = 0.0
    total_weight = 0.0
    for dim, dim_meta in PICO_REGISTRY.items():
        achieved, possible = _dim_score(state, dim)
        if possible == 0.0:
            continue
        dim_completeness = achieved / possible
        total_achieved += dim_meta["weight"] * dim_completeness
        total_weight += dim_meta["weight"]
    if total_weight == 0.0:
        return 0.0
    return min(round(total_achieved / total_weight, 3), 1.0)


_PICO_SCHEMA = json.dumps(
    {dim: {fname: "<value or null>" for fname in PICO_REGISTRY[dim]["fields"]} for dim in PICO_REGISTRY},
    indent=4,
)

EXTRACTION_VALUES_SYSTEM = f"""
You are a clinical trial field query extractor.
Read the user's message and extract values into my fields.
Return ONLY valid JSON — no explanation, no markdown fences.
Use null for any field not mentioned. Do not invent values.

Return EXACTLY this schema:
{_PICO_SCHEMA}

Extraction rules per field:

condition          : specific disease sub-type (e.g. "Type 2 Diabetes",
                       "HER2+ breast cancer"). Generic terms score low.
population_details : free-text patient profile — age, gender, prior history,
                       comorbidities, prior treatments.
age_range          : natural-language age constraint (no JSON dicts).
                       Use natural language only (no range dicts).
                       "65 year old" -> "around 65 years old"
                       "children"    -> "ages 2 to 11"
                       "elderly"     -> "age 65+"
gender             : "Male" | "Female" | "All"
healthy_volunteers_involved : "Yes" | "No"

intervention_name  : INN or brand drug name exactly as stated, or procedure name.
phase              : "Phase I" | "Phase II" | "Phase III" | "Phase IV"
intervention_model : one of the checkbox options or null

comparator         : what the intervention is compared against (placebo,
                       standard of care, another drug name). null if not mentioned.
controlled         : "Yes" | "No" | "N/A" | null
allocation         : one of the checkbox options or null
masking            : one of the checkbox options or null

primary_outcome    : primary endpoint described in user's words
                       (e.g. "overall survival", "HbA1c reduction")
secondary_outcome  : secondary endpoints if mentioned
adverse_events     : specific adverse event of interest — ONLY if user
                       explicitly asks about side effects; otherwise null
trial_status       : extract the recruitment status word(s) used by the user

start_date         : when the trial started or should have started.
                       Return natural-language constraints only (never JSON dicts).
                       Keep user phrasing concise and clear.
                       "after 2020"        -> "after 2020"
                       "last 5 years"      -> "last 5 years"
                       "recent"/"recently" -> "recent"
                       "in 2022"           -> "in 2022"
                       "2019 to 2022"      -> "from 2019 to 2022"
                       "started last year" -> "started last year"
                       null if no start-date constraint mentioned.

end_date           : when the trial ended or should end.
                       Return natural-language constraints only (never JSON dicts).
                       "before 2023"        -> "before 2023"
                       "completed by 2022"  -> "completed by 2022"
                       "ended last year"    -> "ended last year"
                       null if no end-date constraint mentioned.
"""

INFERENCE_SYSTEM = """
You are a clinical research expert with deep knowledge of medical conditions,
standard-of-care treatments, and clinical trial design.

Given a partially filled field struct (from explicit user statements), your job is
to INFER plausible values for empty fields using clinical reasoning.
These are educated guesses — not facts stated by the user.

You will receive the explicit field state. Return a JSON object describing
your inferences. Only infer fields that are currently null. Do not re-state
fields that already have values.

Return ONLY valid JSON with this schema:
{
  "inferences": {
    "field_name": {
      "value":      "<inferred value>",
      "confidence": <0.0-1.0>,
      "reasoning":  "<one sentence of clinical justification>"
    },
    ...
  }
}

Confidence guide:
  0.75-0.85 : Very strong clinical association (near-certain)
  0.60-0.74 : Plausible and common, but not universal
  0.40-0.59 : Possible, but speculative

Only include inferences with confidence >= 0.40.
Never infer intervention_name — drug choice is user-specific.

Clinical reasoning examples (use your full medical knowledge, not just these):

Condition-based outcome inference examples:
  obesity / overweight           → primary_outcome = "weight loss or BMI reduction"          (0.82)
  type 2 diabetes / T2DM         → primary_outcome = "HbA1c reduction or glycaemic control"  (0.80)
  type 1 diabetes                → primary_outcome = "hypoglycaemia prevention or TIR"        (0.75)
  hypertension                   → primary_outcome = "systolic blood pressure reduction"       (0.80)
  heart failure                  → primary_outcome = "hospitalisation or mortality reduction"  (0.78)
  COPD                           → primary_outcome = "FEV1 improvement or exacerbation rate"  (0.75)
  lung cancer / NSCLC            → primary_outcome = "overall survival or PFS"                (0.82)
  breast cancer                  → primary_outcome = "disease-free survival or OS"            (0.80)
  Alzheimer's / dementia         → primary_outcome = "cognitive function (MMSE/ADAS-cog)"     (0.78)
  Parkinson's                    → primary_outcome = "motor function (UPDRS)"                 (0.75)
  rheumatoid arthritis           → primary_outcome = "ACR response or joint function"        (0.76)
  COVID-19 / SARS-CoV-2          → primary_outcome = "viral clearance or hospitalisation"     (0.72)
  HIV / AIDS                     → primary_outcome = "viral load reduction or CD4 count"      (0.78)
  depression / MDD               → primary_outcome = "HAMD score or remission rate"           (0.75)
  schizophrenia                  → primary_outcome = "PANSS score reduction"                  (0.74)

Population inferences:
  obesity / metabolic syndrome   → healthy_volunteers_involved = "No"                         (0.80)
  oncology conditions            → healthy_volunteers_involved = "No"                         (0.85)
  paediatric condition           → age_range = "ages 0 to 17"                                 (0.80)
  geriatric / elderly condition  → age_range = "age 65+"                                      (0.75)

Time inferences:
  NOTE: Only infer T fields when the user gives a temporal signal.
  Do NOT infer T fields from condition alone — absence of a time constraint
  is meaningful and should not be guessed.

  "latest trials" / "most recent" / "current"
    -> start_date = "recent"                                                                   (0.65)
  "ongoing trials" / "currently recruiting"
    -> start_date = "ongoing"                                                                  (0.55)
"""


def _infer_pico_values(explicit_pico: dict[str, dict[str, Any]]) -> dict[str, Any]:
    filled_explicit = {
        dim: {k: v for k, v in vals.items() if v is not None}
        for dim, vals in explicit_pico.items()
    }
    if not any(filled_explicit.values()):
        return {}

    result = llm_json(
        INFERENCE_SYSTEM,
        f"Explicit PICO fields extracted so far:\n{json.dumps(filled_explicit, indent=2)}\n\n"
        f"What can you clinically infer for the empty fields?",
    )
    if result.get("_parse_error"):
        print(f"[DEBUG] Inference parse error:\n{result.get('_raw', '')}\n")
        return {}
    return result.get("inferences", {})


def _merge_inferences_into_pico(
    explicit_pico: dict[str, dict[str, Any]],
    inferences: dict[str, Any],
    state: PicoState,
) -> dict[str, dict[str, Any]]:
    merged = {dim: dict(vals) for dim, vals in explicit_pico.items()}

    for key, inference in inferences.items():
        if "." not in key:
            continue
        dim, fname = key.split(".", 1)
        if dim not in merged:
            continue
        if fname not in PICO_REGISTRY.get(dim, {}).get("fields", {}):
            continue

        confidence = float(inference.get("confidence", 0.0))
        if confidence < 0.40:
            continue

        if merged[dim].get(fname) is not None:
            continue

        value = inference.get("value")
        if not value:
            continue

        merged[dim][fname] = value
        quality_key = key
        inferred_quality = min(confidence * 0.85, 0.65)

        current_q = state.quality.get(quality_key, 0.0) or 0.0
        if inferred_quality > current_q:
            state.quality[quality_key] = round(inferred_quality, 3)
        state.field_source[quality_key] = "inferred"
        print(
            f"[Inference] {key} = '{value}' "
            f"(confidence={confidence:.2f}, reason: {inference.get('reasoning', '')})"
        )

    for dim, vals in explicit_pico.items():
        for fname, value in vals.items():
            if value is not None:
                state.field_source[f"{dim}.{fname}"] = "explicit"

    return merged


EXTRACTION_QUALITY_SYSTEM = f"""
You are scoring how useful clinical query field values are for searching
a database of 1,000,000 clinical trials.

A score close to 1.0 means the value would meaningfully narrow results.
A score close to 0.0 means the value is missing or too vague to help.

You will receive a field JSON object. Return ONLY a flat JSON object with keys
in the format "DIM.field_name" and float values 0.0–1.0.
Example keys: "P.condition", "I.intervention_name", "O.trial_status"

Return EXACTLY these keys:
{json.dumps({f"{dim}.{fname}": 0.0 for dim in PICO_REGISTRY for fname in PICO_REGISTRY[dim]["fields"]}, indent=4)}

Scoring rules
=============

null -> 0.0 for any field.
condition:
  IMPORTANT: A recognised disease name always scores AT LEAST 0.20, even if vague.
  Never return 0.0 for a real disease name — 0.0 is reserved for null only.

  null                                                 -> 0.0
  Generic single word — applies to many sub-types:
    "cancer", "diabetes", "arthritis", "Diabetes"      -> 0.20
    (capitalisation does not change the score)
  NON-CANCER sub-type ("Type 2 Diabetes",
    "Rheumatoid Arthritis", "Alzheimer's Disease",
    "Diabetes Type 2", "T2DM")                         -> 0.85
    (sub-type is sufficient — no stage needed for non-cancer)
  CANCER sub-type without stage ("breast cancer")      -> 0.50
  CANCER sub-type WITH stage/receptor
    ("HER2+ Stage III breast cancer")                  -> 0.95
  Known infectious disease ("COVID-19", "HIV", "TB")   -> 0.85
population_details:
  Age + gender + at least one clinical detail          -> 0.85
  Age + gender only                                    -> 0.60
  Only one of age or gender                            -> 0.35
  Vague / empty string                                 -> 0.10
age_range:
  Specific bounded phrase ("ages 18 to 65")            -> 0.90
  Single bound phrase ("age 65+", "up to age 18")      -> 0.70
  Vague phrase ("adults", "older patients")            -> 0.40
gender:
  "Male" | "Female" | "All"                            -> 1.0
  Un-normalised clear value ("male")                   -> 0.90
healthy_volunteers_involved:
  "Yes" | "No"                                         -> 1.0
intervention_name:
  Generic ("drug", "medicine", "treatment")            -> 0.10
  Drug class only ("SGLT2 inhibitor")                  -> 0.35
  Known INN name ("metformin", "pembrolizumab")        -> 0.90
  INN + dose / formulation                             -> 0.95
phase:
  "Phase III" | "Phase II/III"                         -> 0.90
  "Phase I" | "Phase II"                               -> 0.85
  "early phase" | "late phase"                         -> 0.30
intervention_model:
  Recognised checkbox value                            -> 0.90
comparator:
  Named comparator ("placebo", "metformin")            -> 0.85
  Vague ("standard care")                              -> 0.50
controlled | allocation | masking:
  Recognised checkbox value                            -> 0.90
  Vague                                                -> 0.30
primary_outcome:
  Specific measurable endpoint                         -> 0.85
  Vague ("get better", "improve")                      -> 0.30
secondary_outcome:
  Specific endpoint                                    -> 0.80
adverse_events:
  Specific event named                                 -> 0.85
  Generic "adverse events" / "side effects"            -> 0.50

trial_status:
  Exact known keyword (Recruiting, Completed, etc.)    -> 1.0
  Near-match ("recruiting")                            -> 0.90
  Vague ("active", "open")                             -> 0.40
start_date:
  null                                                 -> 0.0
  Exact bounded phrase ("from 2019-01-01 to 2022-12-31")-> 0.90
  Clear relative/year phrase ("last 5 years", "after 2020", "in 2022") -> 0.75
  Vague temporal phrase ("recent", "old trials")       -> 0.40
end_date:
  null                                                 -> 0.0
  Exact bounded phrase ("before 2023-12-31")           -> 0.90
  Clear relative/year phrase ("before 2023", "completed by 2022") -> 0.75
  Vague temporal phrase                                -> 0.40
"""


def _extract_pico_values(query: str, history: list[dict[str, str]]) -> dict[str, Any]:
    result = llm_json(EXTRACTION_VALUES_SYSTEM, query, history)
    if result.get("_parse_error"):
        print(f"[DEBUG] PICO extraction error:\n{result.get('_raw', '')}\n")
        return {"P": {}, "I": {}, "C": {}, "O": {}, "T": {}}
    return result


def _coerce_quality_value(value: Any) -> float:
    if isinstance(value, str):
        value = value.strip().rstrip("%")
    try:
        score = float(value) if value is not None else 0.0
    except (TypeError, ValueError):
        return 0.0
    if 1.0 < score <= 100.0:
        score = score / 100.0
    return max(0.0, min(1.0, score))


def _normalise_quality_result(raw_result: dict[str, Any]) -> dict[str, float]:
    expected = {
        f"{dim}.{fname}": 0.0
        for dim in PICO_REGISTRY
        for fname in PICO_REGISTRY[dim]["fields"]
    }
    short_to_full = {}
    for dim in PICO_REGISTRY:
        for fname in PICO_REGISTRY[dim]["fields"]:
            short_to_full[fname] = f"{dim}.{fname}"

    for key, value in raw_result.items():
        if key in expected:
            expected[key] = _coerce_quality_value(value)
            continue

        if key in short_to_full:
            expected[short_to_full[key]] = _coerce_quality_value(value)
            continue

        if key in PICO_REGISTRY and isinstance(value, dict):
            for fname, nested_value in value.items():
                full_key = f"{key}.{fname}"
                if full_key in expected:
                    expected[full_key] = _coerce_quality_value(nested_value)

    return expected


def _score_pico_quality(pico: dict[str, Any], quality_floor: dict[str, float] | None = None) -> dict[str, float]:
    prompt = "Score the quality of these clinical trial search fields:\n\n" + json.dumps(pico, indent=2)
    result = llm_json(EXTRACTION_QUALITY_SYSTEM, prompt)
    if result.get("_parse_error"):
        print(f"[DEBUG] Quality scoring error:\n{result.get('_raw', '')}\n")
        return {
            f"{dim}.{fname}": 0.0
            for dim in PICO_REGISTRY
            for fname in PICO_REGISTRY[dim]["fields"]
        }

    scored = _normalise_quality_result(result)

    if quality_floor:
        for key, floor_val in quality_floor.items():
            try:
                floor = float(floor_val) if floor_val is not None else 0.0
            except (TypeError, ValueError):
                floor = 0.0
            current = scored.get(key)
            try:
                current = float(current) if current is not None else 0.0
            except (TypeError, ValueError):
                current = 0.0
            scored[key] = max(current, floor)

    return scored


def _apply_minimum_quality(pico: dict[str, Any], quality: dict[str, float]) -> dict[str, float]:
    for dim in PICO_REGISTRY:
        for fname, fmeta in PICO_REGISTRY[dim]["fields"].items():
            key = f"{dim}.{fname}"
            value = pico.get(dim, {}).get(fname)
            if value is None:
                continue
            current = quality.get(key, 0.0) or 0.0
            try:
                current = float(current)
            except (TypeError, ValueError):
                current = 0.0
            minimum = 0.30 if fmeta["match"] == "range" else 0.20
            if current < minimum:
                quality[key] = minimum
    return quality


IMPATIENCE_SYSTEM = """
You are detecting whether a user message shows impatience, frustration, or
unwillingness to answer more clarifying questions about a clinical trial search.

Reply with ONLY valid JSON: {"impatience_detected": true} or {"impatience_detected": false}

Signs of impatience: "just search", "forget it", "whatever", "stop asking",
"just show me results", expressions of frustration, or explicit refusal to
provide more details.
"""

DISMISSAL_SYSTEM = """
You are detecting whether a user message indicates they do not know, do not have,
or do not care about the PICO dimension they were just asked about.

You will receive JSON with:
  asked_dimension : the PICO dimension label that was just asked (e.g. "Intervention")
  user_message    : what the user replied

Reply with ONLY valid JSON: {"dismissed": true} or {"dismissed": false}

dismissed=true: user says they don't know or don't care about this dimension.
  Examples: "I don't know", "no preference", "any is fine", "not really",
            "I'm fine with anything", "doesn't matter", "no specific one"

dismissed=false: user provided any information (even partial).
  Examples: "metformin", "Phase III", "placebo-controlled", "overall survival"
"""

FIELD_DISMISSAL_SYSTEM = """
You are detecting which specific fields the user dismissed from the most recent clarifying question.

You will receive JSON with:
  asked_dimension : human-readable dimension label (e.g. "Intervention")
  fields_asked    : list of objects with keys:
                    - field
                    - description
                    - hint
  user_message    : what the user replied

Reply with ONLY valid JSON using this schema:
  {"dismissed_fields": ["field_name_1", "field_name_2"]}

Rules:
  - Include a field only if the user explicitly indicates no preference,
    no constraint, unknown, or "doesn't matter" for that field.
  - If the user provides a value for a field (even partial), do NOT mark it dismissed.
  - Return only field names that exist in fields_asked.
  - If none are dismissed, return {"dismissed_fields": []}.
"""


def _detect_impatience(query: str, history: list[dict[str, str]]) -> bool:
    result = llm_json(IMPATIENCE_SYSTEM, query, history)
    return bool(result.get("impatience_detected", False))


def _detect_dismissal(asked_dim_label: str, user_message: str) -> bool:
    payload = json.dumps({
        "asked_dimension": asked_dim_label,
        "user_message": user_message,
    })
    result = llm_json(DISMISSAL_SYSTEM, payload)
    return bool(result.get("dismissed", False))


def _detect_field_dismissals(asked_dim_label: str, fields_asked: list[dict[str, Any]], user_message: str) -> set[str]:
    if not fields_asked:
        return set()

    payload = json.dumps({
        "asked_dimension": asked_dim_label,
        "fields_asked": fields_asked,
        "user_message": user_message,
    })
    result = llm_json(FIELD_DISMISSAL_SYSTEM, payload)
    raw = result.get("dismissed_fields", [])
    if not isinstance(raw, list):
        return set()

    valid = {f["field"] for f in fields_asked if isinstance(f, dict) and "field" in f}
    return {name for name in raw if isinstance(name, str) and name in valid}


def _apply_field_level_dismissals(state: PicoState, user_message: str) -> None:
    if not state.last_asked_dim or not state.last_asked_fields:
        return

    dim = state.last_asked_dim
    dim_label = PICO_REGISTRY[dim]["label"]
    fields_asked = []
    for fname in state.last_asked_fields:
        meta = PICO_REGISTRY.get(dim, {}).get("fields", {}).get(fname)
        if not meta:
            continue
        fields_asked.append({
            "field": fname,
            "description": meta["description"],
            "hint": meta.get("hint", ""),
        })

    dismissed = _detect_field_dismissals(dim_label, fields_asked, user_message)
    if not dismissed:
        return

    for fname in dismissed:
        key = f"{dim}.{fname}"
        if key in state.dismissed_fields:
            continue
        state.dismissed_fields.add(key)
        print(f"[Pipeline] Field '{key}' dismissed — will not ask again.")


def _dim_gain(state: PicoState, dim: str) -> float:
    if state.last_asked_dim == dim and dim in {k.split(".")[0] for k in state.dismissed_fields}:
        return 0.0

    achieved, possible = _dim_score(state, dim)
    if possible == 0.0:
        return 0.0
    completeness = achieved / possible
    return PICO_REGISTRY[dim]["weight"] * (1.0 - completeness)


def _highest_gain_dim(state: PicoState) -> str:
    best_dim = None
    best_gain = -1.0
    for dim in PICO_REGISTRY:
        if all(f"{dim}.{fname}" in state.dismissed_fields for fname in PICO_REGISTRY[dim]["fields"]):
            continue
        gain = _dim_gain(state, dim)
        if gain > best_gain:
            best_gain = gain
            best_dim = dim
    return best_dim or "P"


_DIMENSION_KEYWORDS = {
    "P": (
        "population", "patient", "participants", "people", "age", "gender",
        "female", "male", "comorbidity", "comorbid", "history", "prior treatment",
        "condition", "diagnosis", "subtype", "class",
    ),
    "I": (
        "intervention", "treatment", "drug", "medication", "therapy", "device",
        "procedure", "dose", "phase", "arm",
    ),
    "C": (
        "comparison", "comparator", "compare", "versus", "vs", "placebo", "control",
        "controlled", "randomized", "randomised", "allocation", "masking", "blinding",
    ),
    "O": (
        "outcome", "endpoint", "efficacy", "safety", "side effect", "adverse",
        "trial status", "recruiting", "completed", "terminated",
    ),
    "T": (
        "time", "period", "date", "year", "years", "month", "months",
        "started", "start", "began", "ended", "end", "completed",
        "recent", "recently", "latest", "last", "after", "before",
        "since", "between", "from", "until", "ongoing", "current",
    ),
}


def _detect_user_preferred_dim(user_message: str) -> str:
    text = str(user_message or "").strip().lower()
    if not text:
        return ""

    scores = {}
    for dim, keywords in _DIMENSION_KEYWORDS.items():
        hits = sum(1 for keyword in keywords if keyword in text)
        if hits > 0:
            scores[dim] = hits

    if not scores:
        return ""

    max_hits = max(scores.values())
    winners = [dim for dim, score in scores.items() if score == max_hits]
    if len(winners) != 1:
        return ""
    return winners[0]


def extract_and_score(query: str, history: list[dict[str, str]]) -> PicoState:
    explicit_pico = _extract_pico_values(query, history)
    explicit_pico = _normalise_pico(explicit_pico)

    state = PicoState(
        raw_query=query,
        conversation_history=history,
        pico=explicit_pico,
        quality={},
        impatience_detected=_detect_impatience(query, history),
        preferred_dim=_detect_user_preferred_dim(query),
    )

    for dim, vals in explicit_pico.items():
        for fname, value in vals.items():
            if value is not None:
                state.field_source[f"{dim}.{fname}"] = "explicit"

    inferences = _infer_pico_values(explicit_pico)
    if inferences:
        merged_pico = _merge_inferences_into_pico(explicit_pico, inferences, state)
        state.pico = merged_pico

    quality = _score_pico_quality(state.pico)
    quality = _apply_minimum_quality(state.pico, quality)

    for key, src in state.field_source.items():
        if src == "inferred":
            existing = state.quality.get(key, 0.0) or 0.0
            scored = quality.get(key, 0.0) or 0.0
            quality[key] = min(max(existing, scored), 0.65)

    state.quality = quality
    state.specificity_score = _compute_specificity(state)

    _debug_print(state)
    return state


QUESTION_SYSTEM = """
You are a warm, concise medical information assistant helping a user find
relevant clinical trials.

Your job: ask ONE focused, intelligent question about ONE field only.
Do not bundle multiple asks in the same turn.

You will receive a JSON context with:
  - fields_so_far          : all currently filled fields (explicit + inferred)
  - explicit_fields      : fields the user directly stated (do NOT re-ask these)
  - target_dim           : the PICO dimension to ask about
  - target_label         : human-readable label
  - fields_needed        : exactly one field to clarify. It has:
      • field            : field name
      • description      : what this field means
      • status           : "unknown" OR "inferred_low_confidence"
      • current_value    : the inferred value (if status = inferred_low_confidence)
      • match            : "text" | "keyword" | "checkbox" | "range"
      • options          : valid values for checkbox/keyword fields
  - dim_completeness     : 0–1, how complete this dimension is

Composing your question — follow this style:

1. If status is "inferred_low_confidence":
   Briefly confirm that single inferred value.

2. If status is "unknown":
   Ask directly and naturally for that one field.

3. For keyword/checkbox fields: list the valid options inline.
4. For range fields: ask for bounds naturally ("e.g. 18–65").
5. Be concise — 1–2 sentences maximum.
6. Be warm — this could be a patient, caregiver, or clinical researcher.
7. Do NOT output JSON. Plain natural language only.
8. Do NOT re-ask about fields listed in explicit_fields.
"""


def _fields_needed_for_dim(state: PicoState, dim: str) -> list[dict[str, Any]]:
    needed = []
    for fname, fmeta in PICO_REGISTRY[dim]["fields"].items():
        key = f"{dim}.{fname}"
        source = state.field_source.get(key)
        quality = _safe_q(state, dim, fname)

        if key in state.dismissed_fields:
            continue

        if source == "explicit" and quality >= 0.50:
            continue

        if source == "inferred" and quality >= 0.65:
            continue

        if source == "inferred":
            field_status = "inferred_low_confidence"
            current_value = state.pico.get(dim, {}).get(fname)
        else:
            field_status = "unknown"
            current_value = None

        needed.append({
            "field": fname,
            "description": fmeta["description"],
            "hint": fmeta.get("hint", ""),
            "match": fmeta["match"],
            "options": fmeta.get("checkbox_options", []),
            "status": field_status,
            "current_value": current_value,
            "quality": round(quality, 2),
            "weight": fmeta["weight"],
        })
    return needed


def _select_focus_field(dim: str, fields_needed: list[dict[str, Any]]) -> dict[str, Any]:
    if not fields_needed:
        return {}

    def _key(field: dict[str, Any]) -> tuple[int, float]:
        is_unknown = field.get("status") == "unknown"
        return (1 if is_unknown else 0, float(field.get("weight", 0.0)))

    return max(fields_needed, key=_key)


def _select_target_dim_and_fields(state: PicoState) -> tuple[str, list[dict[str, Any]]]:
    dims_by_gain = sorted(
        PICO_REGISTRY.keys(),
        key=lambda d: _dim_gain(state, d),
        reverse=True,
    )

    candidate_dims = []
    if state.preferred_dim in PICO_REGISTRY:
        candidate_dims.append(state.preferred_dim)
    candidate_dims.extend([d for d in dims_by_gain if d not in candidate_dims])

    for dim in candidate_dims:
        fields_needed = _fields_needed_for_dim(state, dim)
        if fields_needed:
            return dim, fields_needed

    return "P", []


def generate_next_question(state: PicoState) -> tuple[str, str, list[str]]:
    target_dim, fields_needed = _select_target_dim_and_fields(state)
    dim_meta = PICO_REGISTRY[target_dim]
    achieved, possible = _dim_score(state, target_dim)
    completeness = (achieved / possible) if possible > 0 else 0.0
    focus_field = _select_focus_field(target_dim, fields_needed)
    prompt_fields = [focus_field] if focus_field else []

    explicit_fields = [
        fname
        for fname, src in [
            (k.split(".", 1)[1], v)
            for k, v in state.field_source.items()
            if k.startswith(target_dim + ".")
        ]
        if src == "explicit"
    ]

    context = {
        "pico_so_far": {
            d: {k: v for k, v in vals.items() if v is not None}
            for d, vals in state.pico.items()
        },
        "explicit_fields": explicit_fields,
        "target_dim": target_dim,
        "target_label": dim_meta["label"],
        "fields_needed": prompt_fields,
        "dim_completeness": round(completeness, 2),
    }

    question = llm(
        QUESTION_SYSTEM,
        "Generate a clarifying question.\n\nContext:\n" + json.dumps(context, indent=2),
        state.conversation_history,
    )
    asked_fields = [f["field"] for f in prompt_fields]
    return question, target_dim, asked_fields


def _build_merge_system() -> str:
    return f"""
You are updating a PICO clinical trial search state based on a new user message.

You will receive:
  1. The existing PICO state (JSON)
  2. The user's latest message

Extract any NEW or IMPROVED information from the user's message.
Return the COMPLETE updated PICO object — preserve all existing non-null values
unless the new message explicitly overrides them.

Return ONLY valid JSON using this schema:
{_PICO_SCHEMA}

Apply the same extraction rules as the initial extraction.
"""


def _merge_pico_values(existing_pico: dict[str, Any], user_message: str, history: list[dict[str, str]]) -> dict[str, Any]:
    payload = (
        f"Existing PICO state:\n{json.dumps(existing_pico, indent=2)}\n\n"
        f"User's new message:\n{user_message}"
    )
    result = llm_json(_build_merge_system(), payload, history)
    if result.get("_parse_error"):
        print(f"[DEBUG] Merge parse error:\n{result.get('_raw', '')}\n")
        return existing_pico
    return result


def _restore_pico(pre: dict[str, Any], post: dict[str, Any]) -> dict[str, Any]:
    for dim in pre:
        for fname, val in pre[dim].items():
            if val is not None and post.get(dim, {}).get(fname) is None:
                post.setdefault(dim, {})[fname] = val
    return post


def merge_user_response(state: PicoState, user_message: str) -> PicoState:
    _apply_field_level_dismissals(state, user_message)

    pre_pico = {dim: dict(vals) for dim, vals in state.pico.items()}

    updated_pico = _merge_pico_values(state.pico, user_message, state.conversation_history)
    updated_pico = _normalise_pico(updated_pico)
    updated_pico = _restore_pico(pre_pico, updated_pico)

    for dim, vals in updated_pico.items():
        for fname, value in vals.items():
            key = f"{dim}.{fname}"
            if value is not None and state.field_source.get(key) != "explicit":
                pre_val = pre_pico.get(dim, {}).get(fname)
                if pre_val is None:
                    state.field_source[key] = "explicit"

    new_inferences = _infer_pico_values(updated_pico)
    if new_inferences:
        updated_pico = _merge_inferences_into_pico(updated_pico, new_inferences, state)

    updated_quality = _score_pico_quality(updated_pico, quality_floor=state.quality)
    updated_quality = _apply_minimum_quality(updated_pico, updated_quality)

    for key, src in state.field_source.items():
        if src == "inferred":
            updated_quality[key] = min(updated_quality.get(key, 0.0) or 0.0, 0.65)

    for key in state.dismissed_fields:
        updated_quality[key] = 0.0

    state.pico = updated_pico
    state.quality = updated_quality
    state.impatience_detected = _detect_impatience(user_message, state.conversation_history)
    preferred_dim = _detect_user_preferred_dim(user_message)
    if preferred_dim:
        state.preferred_dim = preferred_dim
    state.conversation_history.append({"role": "user", "content": user_message})
    state.specificity_score = _compute_specificity(state)
    return state


def build_intent_output(state: PicoState) -> dict[str, Any]:
    flat_slots = {}
    flat_quality = {}
    flat_es = {}

    for dim, dim_meta in PICO_REGISTRY.items():
        for fname, fmeta in dim_meta["fields"].items():
            value = state.pico.get(dim, {}).get(fname)
            if value is None:
                continue
            q = _safe_q(state, dim, fname)
            if q == 0.0:
                continue
            flat_slots[fname] = value
            flat_quality[fname] = round(q, 3)
            flat_es[fname] = fmeta["es_field"]

    clean_pico = {
        PICO_REGISTRY[dim]["label"]: {k: v for k, v in vals.items() if v is not None}
        for dim, vals in state.pico.items()
    }

    conversation_summary = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in state.conversation_history
        if msg["role"] in ("assistant", "user")
    ]

    explicit_sources = {
        k.split(".", 1)[1] if "." in k else k
        for k, v in state.field_source.items()
        if v == "explicit"
    }
    inferred_sources = {
        k.split(".", 1)[1] if "." in k else k
        for k, v in state.field_source.items()
        if v == "inferred"
    }

    return {
        "status": state.status.value,
        "specificity_score": round(state.specificity_score, 3),
        "questions_asked": state.questions_asked,
        "pico": clean_pico,
        "slots": flat_slots,
        "slot_quality": flat_quality,
        "es_fields": flat_es,
        "dismissed_fields": list(state.dismissed_fields),
        "explicit_fields": sorted(explicit_sources),
        "inferred_fields": sorted(inferred_sources),
        "raw_query": state.raw_query,
        "conversation_summary": conversation_summary,
    }


def _evaluate_status(state: PicoState) -> IntentStatus:
    if state.impatience_detected:
        print(f"[Pipeline] Impatience detected (score={state.specificity_score:.3f}). Degraded search.")
        return IntentStatus.DEGRADED

    if state.questions_asked >= MAX_CLARIFICATION_QUESTIONS:
        print(f"[Pipeline] Question cap reached (score={state.specificity_score:.3f}). Degraded search.")
        return IntentStatus.MAX_REACHED

    if state.specificity_score >= SPECIFICITY_THRESHOLD:
        print(f"[Pipeline] Threshold met (score={state.specificity_score:.3f}). Proceeding to search.")
        return IntentStatus.READY

    return IntentStatus.COLLECTING


def _debug_print(state: PicoState) -> None:
    explicit, inferred = {}, {}
    for d, vals in state.pico.items():
        for k, v in vals.items():
            if v is None:
                continue
            dim_key = f"{d}.{k}"
            src = state.field_source.get(dim_key, "explicit")
            q = round(state.quality.get(dim_key, 0.0) or 0.0, 2)
            entry = f"{v!r} (q={q})"
            if src == "inferred":
                inferred[k] = entry
            else:
                explicit[k] = entry

    scores = {
        k.split(".", 1)[1] if "." in k else k: round(v, 2)
        for k, v in state.quality.items()
        if v and float(v) > 0
    }
    print(f"\n[DEBUG] Explicit fields: {json.dumps(explicit, indent=2, default=str)}")
    print(f"[DEBUG] Inferred fields: {json.dumps(inferred, indent=2, default=str)}")
    print(f"[DEBUG] Quality scores: {json.dumps(scores, indent=2)}")
    print("[DEBUG] Dim scores: ", end="")
    for dim in PICO_REGISTRY:
        a, p = _dim_score(state, dim)
        label = PICO_REGISTRY[dim]["label"]
        print(f"{label}={a / p:.2f}" if p else f"{label}=n/a", end="  ")
    print()


def _print_summary(state: PicoState) -> None:
    sep = "=" * 60
    print(f"\n{sep}\nPIPELINE COMPLETE\n{sep}")
    print(f"Status: {state.status.value}")
    print(f"Specificity Score: {state.specificity_score:.3f}")
    print(f"Questions Asked: {state.questions_asked}")
    print("  PICOT Fields:")
    for dim, vals in state.pico.items():
        filled = {k: v for k, v in vals.items() if v is not None}
        if not filled:
            continue
        label = PICO_REGISTRY[dim]["label"]
        print(f"{label}:")
        for fname, value in filled.items():
            key = f"{dim}.{fname}"
            q = _safe_q(state, dim, fname)
            src = state.field_source.get(key, "explicit")
            tag = " [inferred]" if src == "inferred" else ""
            print(f"      {fname:<25} = {str(value):<35} (q={q:.2f}){tag}")
    if state.dismissed_fields:
        print(f"  Dismissed         : {state.dismissed_fields}")
    print(f"{sep}\n")


def run_intent_elicitation_pipeline(initial_query: str) -> dict[str, Any]:
    print("\n[Pipeline] Starting PICO intent elicitation...\n")

    history = [{"role": "user", "content": initial_query}]
    state = extract_and_score(initial_query, history)
    print(f"[Pipeline] Initial specificity score : {state.specificity_score:.3f}\n")

    state.status = _evaluate_status(state)
    if state.status == IntentStatus.COLLECTING and not ENABLE_FOLLOW_UP_QUESTIONS:
        print(
            f"[Pipeline] Follow-up questions disabled "
            f"(score={state.specificity_score:.3f}). Proceeding with inferred fields."
        )
        state.status = IntentStatus.DEGRADED

    _print_summary(state)
    intent_output = build_intent_output(state)

    print("\n[Intent Output]")
    print(json.dumps(intent_output, indent=2, default=str))
    return intent_output


if __name__ == "__main__":
    print("Clinical Trial Search Assistant (PICOT)")
    print("---------------------------------------")
    user_query = input("How can I help you today? ").strip()
    intent_output = run_intent_elicitation_pipeline(user_query)
    print(intent_output.get("slots"))
