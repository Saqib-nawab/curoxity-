import json
import re
from dataclasses import dataclass, field
from enum import Enum
from ollama import Client

client = Client(host="127.0.0.1")
MODEL = "gpt-oss:20b"

# _LOCATION_SEP_RE = re.compile(r"[|;/]|(?:\s+\band\b\s+)|(?:\s+\bor\b\s+)|,")
# _LOCATION_CLEAN_RE = re.compile(r"[^a-z0-9\s\-']")
#
# _COUNTRY_CANONICAL_ALIASES = {
#     "united kingdom": {"uk", "u.k.", "great britain", "britain", "gb", "england", "scotland", "wales", "northern ireland"},
#     "united states": {"us", "u.s.", "usa", "u.s.a.", "america", "united states of america"},
#     "united arab emirates": {"uae", "u.a.e."},
# }
#
# _LOCATION_TO_COUNTRY = {
#     "england": "united kingdom",
#     "scotland": "united kingdom",
#     "wales": "united kingdom",
#     "northern ireland": "united kingdom",
#     "great britain": "united kingdom",
#     "britain": "united kingdom",
# }
#
# _CITY_PARENT_HINTS = {
#     "london": {"country": "united kingdom", "region": "england"},
#     "manchester": {"country": "united kingdom", "region": "england"},
#     "birmingham": {"country": "united kingdom", "region": "england"},
#     "glasgow": {"country": "united kingdom", "region": "scotland"},
#     "edinburgh": {"country": "united kingdom", "region": "scotland"},
#     "cardiff": {"country": "united kingdom", "region": "wales"},
#     "belfast": {"country": "united kingdom", "region": "northern ireland"},
# }

_TRIAL_STATUS_ALLOWED = {
    "ACTIVE_NOT_RECRUITING",
    "COMPLETED",
    "ENROLLING_BY_INVITATION",
    "NOT_YET_RECRUITING",
    "RECRUITING",
    "SUSPENDED",
    "TERMINATED",
    "WITHDRAWN",
    "AVAILABLE",
    "NO_LONGER_AVAILABLE",
    "TEMPORARILY_NOT_AVAILABLE",
    "APPROVED_FOR_MARKETING",
    "WITHHELD",
    "UNKNOWN",
}

_TRIAL_STATUS_PATTERN_MAP = [
    (r"\bactive\s*(?:\(\s*not\s*recruiting\s*\)|-\s*not\s*recruiting|not\s*recruiting)\b", "ACTIVE_NOT_RECRUITING"),
    (r"\bcompleted\b", "COMPLETED"),
    (r"\benrolling\s*(?:by\s*)?invitation\b", "ENROLLING_BY_INVITATION"),
    (r"\bnot\s*yet\s*recruiting\b", "NOT_YET_RECRUITING"),
    (r"\brecruiting\b", "RECRUITING"),
    (r"\bsuspended\b", "SUSPENDED"),
    (r"\bterminated\b", "TERMINATED"),
    (r"\bwithdrawn\b", "WITHDRAWN"),
    (r"\bavailable\b", "AVAILABLE"),
    (r"\bno\s*longer\s*available\b", "NO_LONGER_AVAILABLE"),
    (r"\btemporarily\s*not\s*available\b", "TEMPORARILY_NOT_AVAILABLE"),
    (r"\bapproved\s*(?:for\s*)?marketing\b", "APPROVED_FOR_MARKETING"),
    (r"\bwithheld\b", "WITHHELD"),
    (r"\bunknown\b", "UNKNOWN"),
]


# def _normalize_location_token(token: str) -> str:
#     lowered = token.lower().strip()
#     cleaned = _LOCATION_CLEAN_RE.sub(" ", lowered)
#     return re.sub(r"\s+", " ", cleaned).strip()
#

def _dedupe_preserve_order(items: list) -> list:
    seen = set()
    out = []
    for item in items:
        if not item or item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def _normalize_trial_status(value) -> str | None:
    if value is None:
        return None

    if isinstance(value, str):
        candidate = value.strip().upper()
        if candidate in _TRIAL_STATUS_ALLOWED:
            return candidate

        normalized = re.sub(r"[^A-Z0-9]+", "_", candidate).strip("_")
        if normalized in _TRIAL_STATUS_ALLOWED:
            return normalized

        lowered = value.strip().lower()
        for pattern, canonical in _TRIAL_STATUS_PATTERN_MAP:
            if re.search(pattern, lowered):
                return canonical

    return None


def _sanitize_slots(slots: dict) -> dict:
    sanitized = dict(slots or {})
    if "trial_status" in sanitized:
        sanitized["trial_status"] = _normalize_trial_status(sanitized.get("trial_status"))
    return sanitized


# def _location_alias_map() -> dict:
#     alias_to_canonical = {}
#     for canonical, aliases in _COUNTRY_CANONICAL_ALIASES.items():
#         alias_to_canonical[canonical] = canonical
#         for alias in aliases:
#             alias_to_canonical[alias] = canonical
#     return alias_to_canonical


# def _expand_locations(raw_location) -> dict:
#     if raw_location is None:
#         return {
#             "raw": None,
#             "normalized_input": [],
#             "countries": [],
#             "regions": [],
#             "cities": [],
#             "free_text": [],
#             "query_terms": [],
#         }
#
#     if isinstance(raw_location, str):
#         raw_tokens = [part.strip() for part in _LOCATION_SEP_RE.split(raw_location) if part and part.strip()]
#     elif isinstance(raw_location, list):
#         raw_tokens = [str(part).strip() for part in raw_location if str(part).strip()]
#     else:
#         raw_tokens = [str(raw_location).strip()]
#
#     alias_to_canonical = _location_alias_map()
#     normalized_input = []
#     countries = []
#     regions = []
#     cities = []
#     free_text = []
#     query_terms = []
#
#     for raw_token in raw_tokens:
#         token = _normalize_location_token(raw_token)
#         if not token:
#             continue
#         normalized_input.append(token)
#         query_terms.extend([raw_token.lower().strip(), token])
#
#         if token in _CITY_PARENT_HINTS:
#             city_meta = _CITY_PARENT_HINTS[token]
#             cities.append(token)
#             regions.append(city_meta["region"])
#             countries.append(city_meta["country"])
#             query_terms.extend([token, city_meta["region"], city_meta["country"]])
#             continue
#
#         if token in _LOCATION_TO_COUNTRY:
#             regions.append(token)
#             canonical_country = _LOCATION_TO_COUNTRY[token]
#             countries.append(canonical_country)
#             query_terms.extend([token, canonical_country])
#             continue
#
#         canonical_country = alias_to_canonical.get(token)
#         if canonical_country:
#             countries.append(canonical_country)
#             query_terms.extend([token, canonical_country])
#             query_terms.extend(list(_COUNTRY_CANONICAL_ALIASES.get(canonical_country, set())))
#             continue
#
#         free_text.append(token)
#
#     countries = _dedupe_preserve_order(countries)
#     regions = _dedupe_preserve_order(regions)
#     cities = _dedupe_preserve_order(cities)
#     free_text = _dedupe_preserve_order(free_text)
#     query_terms = _dedupe_preserve_order([
#         _normalize_location_token(x) for x in query_terms
#     ])
#     query_terms = [x for x in query_terms if x]
#
#     return {
#         "raw": raw_location,
#         "normalized_input": _dedupe_preserve_order(normalized_input),
#         "countries": countries,
#         "regions": regions,
#         "cities": cities,
#         "free_text": free_text,
#         "query_terms": query_terms,
#     }
#

FIELD_REGISTRY = {
    "primary_id": {
        "weight":      1.0,
        "es_field":    "primary_id",
        "match":       "keyword",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Unique trial identifier (e.g. EudraCT number, NCT number)",
        "hint":        "Ask for the exact trial ID if the user seems to know it.",
    },
    "condition_name": {
        "weight":      0.30,
        "es_field":    ["condition_name", "condition_information.therapeutic_area"],
        "match":       "text, keyword",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Medical condition or disease being studied",
        "hint": (
            "If the value is a generic disease name without a type (e.g. bare 'cancer' "
            "or bare 'diabetes'), ask for the specific sub-type. "
            "Do NOT ask for a stage for non-cancer conditions like diabetes."
        ),
    },
    "imp_name": {
        "weight":      0.30,
        "es_field":    [
            "investigational_Product.name",
            "periods.arms.arm_imp.imp_name",
        ],
        "match":       "text, keyword",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Investigational medicinal product (drug / intervention) name",
        "hint": (
            "Ask for the INN or brand name of the drug. "
            "If the user mentions a drug class, ask them to name the specific compound."
        ),
    },
    "endpoints":{
        "weight":      0.15,
        "es_field":    ["endpoints.description"],
        "match":       "text",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Primary or secondary endpoints/outcomes measured in the trial",
        "hint": (
            "Ask for the specific outcomes or endpoints the user is interested in, "
            "e.g. 'overall survival', 'HbA1c reduction', 'progression-free survival'."
        ),
    },
    "trial_status": {
        "weight":      0.15,
        "es_field":    "trial_status",
        "match":       "keyword",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Current recruitment / operational status of the trial",
        "hint": (
            "Offer known values: Recruiting | Active (not recruiting) | Completed | "
            "Terminated | Withdrawn | Suspended."
        ),
    },
    "phase": {
        "weight":        0.10,
        "es_field":      "phase",
        "match":         "keyword",
        "depends_on":    None,
        "question_tier": 1,
        "description":   "Clinical trial phase (I, II, III, IV)",
        "hint":          "Ask which phase(s) the user is interested in.",
    },
    "allocation": {
        "weight":           0.05,
        "es_field":         "allocation",
        "match":            "checkbox",
        "depends_on":       None,
        "question_tier":    2,
        "description":      "How participants are assigned to arms",
        "checkbox_options": ["Randomised", "Non-randomised", "None (single group)"],
        "hint":             "Present as checkbox options.",
    },
    "masking": {
        "weight":           0.05,
        "es_field":         "masking",
        "match":            "checkbox",
        "depends_on":       None,
        "question_tier":    2,
        "description":      "Blinding strategy",
        "checkbox_options": ["Open", "Single blind", "Double blind", "Triple blind", "Quadruple Blind"],
        "hint":             "Present as checkbox options.",
    },
    "intervention_model": {
        "weight":           0.05,
        "es_field":         "intervention_model",
        "match":            "checkbox",
        "depends_on":       None,
        "question_tier":    2,
        "description":      "Structure of the intervention",
        "checkbox_options": ["Parallel", "Crossover", "Factorial", "Sequential", "Single group"],
        "hint":             "Present as checkbox options.",
    },
    "controlled": {
        "weight":           0.05,
        "es_field":         "controlled",
        "match":            "checkbox",
        "depends_on":       None,
        "question_tier":    2,
        "description":      "Whether the trial is controlled",
        "checkbox_options": ["Yes", "No", "N/A"],
        "hint":             "Present as checkbox options.",
    },

    "locations": {
        "weight":      0.05,
        "es_field":    ["locations.country", "locations.city", "locations.facility"],
        "match":       "text",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Geographic location(s) of the trial sites",
        "hint": (
            "Ask for country first; if still vague, ask for city or facility name. "
            "Country alone scores 0.6; city or facility scores 0.9."
        ),
    },
    "eligibility": {
        "weight":      0.15,
        "es_field":    ["inclusion_criteria", "exclusion_criteria"],
        "match":       "text",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Patient eligibility — inclusion or exclusion criteria",
        "hint": (
            "Extract diagnosis stage, prior treatments, comorbidities "
            "from natural language. E.g. '65-year-old male with Stage II CLL, "
            "no prior chemotherapy'."
        ),
    },
    "population_gender": {
        "weight":      0.05,
        "es_field":    "population_breakdown.gender",
        "match":       "keyword",
        "depends_on":  None,
        "question_tier":  2,
        "checkbox_options": ["Male", "Female", "Both", "Other"],
        "description": "Target gender of the trial population",
        "hint":        "Ask if the user mentions gender-specific conditions or preferences.",
    },
    "population_age": {
        "weight":      0.05,
        "es_field":    [
            "population_breakdown.age_range.min",
            "population_breakdown.age_range.max",
        ],
        "match":       "range",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Age range of the trial population",
        "hint": (
            "Extract as {gte: <min_age>, lte: <max_age>}. "
            "Phrases like 'children', 'elderly', 'adults' should be resolved to "
            "approximate numeric ranges."
        ),
    },
    "healthy_volunteers": {
        "weight":      0.05,
        "es_field":    "population_breakdown.healthy_volunteers",
        "match":       "keyword",
        "depends_on":  None,
        "question_tier":  2,
        "checkbox_options": ["Yes","No"],
        "description": "Whether healthy volunteers are accepted",
        "hint":        "Ask if the user mentions they are healthy or not a patient.",
    },
    "sponsors": {
        "weight":      0.1,
        "es_field":    "sponsors.name",
        "match":       "text",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Sponsor organisation name",
        "hint":        "Ask for the sponsoring company or institution name.",
    },
    "collaborators": {
        "weight":      0.1,
        "es_field":    "collaborators.name",
        "match":       "text",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Collaborating organisation name",
        "hint":        "Ask only if the user mentions a specific collaborating institution.",
    },
    "central_contact": {
        "weight":      0.1,
        "es_field":    "central_contact.name",
        "match":       "text",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Central contact person or organisation for the trial",
        "hint":        "Ask only if the user is looking for a specific contact.",
    },
    "adverse_events": {
        "weight":      0.15,
        "es_field":    [
            "adverse_events.serious_adverse_events",
            "adverse_events.non-serious_adverse_events",
        ],
        "match":       "text",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Adverse events/side effects associated with the investigational product or a trial on a particular condition",
        "hint": (
            "It is preferable to ask about adverse_events if imp_name(drug name) is known. "
            "However, it is still possible that the user asks about adverse events without naming the drug."
        ),
    },
    "population_count": {
        "weight":      0.05,
        "es_field":    ["actual_population_count", "estimated_population_count"],
        "match":       "range",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Number of trial participants (actual or estimated)",
        "hint": (
            "Extract as a range dict e.g. {gte: 100} for 'at least 100 participants'. "
            "Ask only if the user mentions trial size."
        ),
    },
    "date_range": {
        "weight":      0.05,
        "es_field":    ["date_of_start_trial", "date_of_end_trial"],
        "match":       "range",
        "depends_on":  None,
        "question_tier":  1,
        "description": "Trial start or end date range",
        "hint": (
            "Resolve relative language: 'recent' -> last 2 years, "
            "'after 2020' -> {gte: '2020-01-01'}. Return as ISO date strings."
        ),
    },
}

SPECIFICITY_THRESHOLD        = 0.6
MAX_CLARIFICATION_QUESTIONS  = 5

_SLOT_KEYS     = list(FIELD_REGISTRY.keys())
_SLOT_SCHEMA   = json.dumps({k: "<value or null>" for k in _SLOT_KEYS}, indent=4)
_QUALITY_SCHEMA= json.dumps({k: "<0.0-1.0>"       for k in _SLOT_KEYS}, indent=4)


class IntentStatus(Enum):
    COLLECTING  = "collecting"
    REFINING    = "refining"
    READY       = "ready"
    DEGRADED    = "degraded"
    MAX_REACHED = "max_reached"


@dataclass
class IntentState:
    raw_query:                  str
    conversation_history:       list  = field(default_factory=list)
    slots:                      dict  = field(default_factory=dict)
    slot_quality:               dict  = field(default_factory=dict)
    specificity_score:          float = 0.0
    questions_asked:            int   = 0
    status:                     IntentStatus = IntentStatus.COLLECTING
    impatience_detected:        bool  = False
    checkbox_refinement_asked:  bool  = False
    dismissed_fields:           set   = field(default_factory=set)
    last_asked_field:           str   = ""
    requested_output_fields:    list  = field(default_factory=list)

def llm(system: str, user: str, history: list = None) -> str:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": user})
    response = client.chat(model=MODEL, messages=messages, stream=False)
    return response["message"]["content"].strip()


def llm_json(system: str, user: str, history: list = None) -> dict:
    raw   = llm(system, user, history)
    clean = re.sub(r"```(?:json)?|```", "", raw).strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        return {"_raw": raw, "_parse_error": True}


def _safe_quality(state: IntentState, field_name: str) -> float:
    val = state.slot_quality.get(field_name, 0.0)
    try:
        return float(val) if val is not None else 0.0
    except (TypeError, ValueError):
        return 0.0


def _coerce_bool(value, default: bool = False) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return default
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized in {"true", "t", "yes", "y", "1"}:
            return True
        if normalized in {"false", "f", "no", "n", "0", ""}:
            return False
    return default


def _compute_specificity(state: IntentState) -> float:
    score        = 0.0
    max_possible = 0.0
    for field_name, meta in FIELD_REGISTRY.items():
        dep = meta.get("depends_on")
        if dep and _safe_quality(state, dep) == 0.0:
            continue
        max_possible += meta["weight"]
        score += meta["weight"] * _safe_quality(state, field_name)
    if max_possible == 0.0:
        return 0.0
    return score


_REQUESTED_OUTPUT_FIELD_PATTERNS = {
    "population_age": [
        r"\bage\b",
        r"\bmean age\b",
        r"\bmedian age\b",
        r"\bage distribution\b",
    ],
    "population_gender": [
        r"\bgender\b",
        r"\bsex\b",
        r"\bmale\b",
        r"\bfemale\b",
        r"\bmen\b",
        r"\bwomen\b",
    ],
    "population_count": [
        r"\benrollment\b",
        r"\benrolment\b",
        r"\bpopulation count\b",
        r"\bsample size\b",
        r"\bnumber of patients\b",
        r"\bnumber of participants\b",
    ],
    "adverse_events": [
        r"\badverse event",
        r"\bside effect",
        r"\bsafety profile\b",
    ],
    "endpoints": [
        r"\bendpoint",
        r"\boutcome",
        r"\bresponse rate\b",
        r"\bremission\b",
        r"\bprogression\b",
    ],
}


def _detect_requested_output_fields(query: str) -> list:
    text = (query or "").strip().lower()
    requested = []

    for field_name, patterns in _REQUESTED_OUTPUT_FIELD_PATTERNS.items():
        if any(re.search(pattern, text) for pattern in patterns):
            requested.append(field_name)

    # "demographic distribution" usually implies age and gender breakdowns.
    if re.search(r"\bdemographic", text):
        requested.extend(["population_age", "population_gender"])

    return _dedupe_preserve_order(requested)


EXTRACTION_VALUES_SYSTEM = f"""
You are a clinical trial data extractor. Read the user's query and extract
values for the fields below. Return ONLY valid JSON — no explanation, no markdown.

Use null for any field not mentioned. Do not invent values.

Return EXACTLY this schema:
{_SLOT_SCHEMA}

Extraction rules:
- condition_name   : extract the specific disease sub-type if mentioned
                     (e.g. "Type 2 Diabetes", "HER2+ breast cancer")
- imp_name         : extract the INN or brand drug name exactly as stated
- endpoints        : extract the specific outcomes/endpoints of interest
                     (e.g. "overall survival", "HbA1c reduction",
                     "radiographic progression by Sharp/van der Heijde")
- trial_status     : extract the recruitment status word(s) used by the user
- phase            : extract the phase of clinical trial (e.g. "Phase III")
- locations        : extract country, city, or facility as a plain string
- population_age   : extract as a JSON object {{\"gte\": <int>, \"lte\": <int>}}
                     A single age like "65 year old" -> {{\"gte\": 60, \"lte\": None}}
                     Words like "children" -> {{\"gte\": 2, \"lte\": 11}}
                     Words like "elderly"  -> {{\"gte\": 65}}
- population_gender: extract as "Male", "Female", or "All"
- population_count : extract as a JSON object {{\"gte\": <int>}} or
                     {{\"gte\": <int>, \"lte\": <int>}}
- date_range       : extract as {{\"gte\": \"YYYY-MM-DD\"}} or
                     {{\"lte\": \"YYYY-MM-DD\"}} — resolve relative language
                     ("last 2 years", "after 2020") to ISO dates
- eligibility      : write a concise free-text patient profile summary from
                     any eligibility hints in the query (age, gender, prior
                     treatments, diagnosis details, comorbidities)
- adverse_events   : extract only if the user explicitly asks about side
                     effects or adverse events; otherwise null
- impatience_detected is NOT part of this response — omit it entirely
"""


EXTRACTION_QUALITY_SYSTEM = """
You are scoring how useful extracted clinical trial search field values are.
A high score (close to 1.0) means the value would meaningfully narrow a
database of 1,000,000 trials. A low score means the value is too vague to help.

You will receive a JSON object of extracted slot values.
Return ONLY a valid JSON object scoring each field from 0.0 to 1.0.
Do not add explanation. Do not add new keys.

Scoring rules
=============

null -> 0.0 for any field.

condition_name:
  The key question is: does this narrow to a specific disease entity?
  - Generic single word ("cancer", "diabetes", "arthritis") -> 0.20
    (if these apply to dozens of sub-types — too broad)
  - NON-CANCER sub-type specified ("Type 2 Diabetes",
    "Rheumatoid Arthritis", "Alzheimer's Disease",
    "Parkinson's Disease", "Multiple Sclerosis") -> 0.85
    (sub-type IS sufficient — no stage needed for non-cancer conditions)
  - CANCER sub-type without stage ("breast cancer",
    "lung cancer") -> 0.50  (ask for stage / receptor status)
  - CANCER sub-type WITH stage or receptor
    ("HER2+ Stage III breast cancer",
     "Stage IV non-small cell lung cancer") -> 0.95

imp_name:
  - Generic ("drug", "medicine", "treatment") -> 0.10
  - Drug class only ("SGLT2 inhibitor", "GLP-1 agonist") -> 0.35
  - Known INN name ("metformin", "pembrolizumab",
    "ibuprofen") -> 0.90
  - INN + dose / formulation -> 0.95

trial_status:
  - Exact known keyword (Recruiting, Completed, etc.) -> 1.0
  - Near-match (recruiting, RECRUITING) -> 0.90
    (will be normalised in code)
  - Vague ("active", "open") -> 0.40
  - Very vague ("ongoing", "current") -> 0.20

phase:
  - "Phase III", "Phase II/III" -> 0.90
  - "Phase I", "Phase II" -> 0.85
  - "early phase", "late phase" -> 0.30
  - Roman numeral only ("III") -> 0.70

locations:
  - Country name only -> 0.60
  - Country + city -> 0.80
  - Country + city + facility -> 0.95
  - Continent / region only ("Europe", "Asia") -> 0.20

population_gender:
  - "Male", "Female", "All" (normalised) -> 1.0
  - Un-normalised but clear ("male", "MALE") -> 0.90

population_age (range object):
  - Valid dict with gte/lte -> 0.90
  - Single bound only (gte or lte) -> 0.70
  - String not yet converted to dict -> 0.10

eligibility (free-text profile):
  - Contains age + gender + at least one clinical detail
    (prior treatment, diagnosis stage, comorbidity) -> 0.85
  - Contains age + gender only -> 0.60
  - Contains only one of age or gender -> 0.35
  - Vague / empty -> 0.10

adverse_events:
  - Side effects of a drug or clinical trial intervention for a particular disease mentioned explicitly -> 0.90
  - Otherwise -> 0.0

sponsors / collaborators / central_contact:
  - Named organisation or person -> 0.85
  - Partial / vague name -> 0.40

population_count (range object):
  - Valid dict -> 0.80
  - String number -> 0.40

date_range (range object with ISO dates):
  - Exact ISO date -> 0.90
  - Year only ("2020") -> 0.70
  - Relative resolved ("last 2 years") -> 0.50

endpoints:
  - Explicit, measurable endpoint with assessment method
    ("radiographic progression by Sharp/van der Heijde",
     "change in DAS28 at week 24") -> 0.90
  - Specific endpoint but no method/timepoint
    ("joint damage progression", "remission rate") -> 0.70
  - Broad intent only ("outcomes", "efficacy") -> 0.25

All other fields (allocation, masking, intervention_model,
controlled, phase, healthy_volunteers):
  - Specific recognised value -> 0.90
  - Vague -> 0.30
"""


def _extract_values(query: str, history: list) -> dict:
    result = llm_json(EXTRACTION_VALUES_SYSTEM, query, history)
    if result.get("_parse_error"):
        print(f"[DEBUG] Value extraction parse error. Raw output:\n{result.get('_raw','')}\n")
        return {k: None for k in _SLOT_KEYS}
    return _sanitize_slots(result)


def _score_quality(slots: dict, quality_floor: dict = None) -> dict:
    prompt = f"Score the quality of these extracted clinical trial search slots:\n\n{json.dumps(slots, indent=2)}"
    result = llm_json(EXTRACTION_QUALITY_SYSTEM, prompt)
    if result.get("_parse_error"):
        print(f"[DEBUG] Quality scoring parse error. Raw output:\n{result.get('_raw','')}\n")
        return {k: 0.0 for k in _SLOT_KEYS}

    scored = {}
    for field_name in _SLOT_KEYS:
        current = result.get(field_name)
        try:
            val = float(current) if current is not None else 0.0
        except (TypeError, ValueError):
            val = 0.0
        scored[field_name] = max(0.0, min(1.0, val))

    if quality_floor:
        for field_name, floor_val in quality_floor.items():
            try:
                floor = float(floor_val) if floor_val is not None else 0.0
            except (TypeError, ValueError):
                floor = 0.0
            current = scored.get(field_name, 0.0)
            scored[field_name] = max(current, floor)

    return scored


def extract_and_score(query: str, history: list) -> IntentState:
    slots = _extract_values(query, history)
    slot_quality = _score_quality(slots)
    requested_output_fields = _detect_requested_output_fields(query)

    impatience = _detect_impatience(query, history)

    state = IntentState(
        raw_query=query,
        conversation_history=history,
        slots=slots,
        slot_quality=slot_quality,
        impatience_detected=impatience,
        requested_output_fields=requested_output_fields,
    )
    state.specificity_score = _compute_specificity(state)

    print(f"\n[DEBUG] Extracted slots    : "
          f"{json.dumps({k: v for k, v in slots.items() if v is not None}, indent=2)}")
    print(f"[DEBUG] Slot quality scores: "
          f"{json.dumps({k: round(float(v), 2) for k, v in slot_quality.items() if v}, indent=2)}\n")

    return state

IMPATIENCE_SYSTEM = """
You are detecting whether a user message shows impatience, frustration, or
unwillingness to answer more clarifying questions about a clinical trial search.

Reply with ONLY the JSON: {"impatience_detected": true} or {"impatience_detected": false}

Signs of impatience: "just search", "forget it", "whatever", "stop asking",
"I don't know", "just show me results", expressions of frustration, urgency,
or explicit refusal to provide more details.
"""


def _detect_impatience(query: str, history: list) -> bool:
    result = llm_json(IMPATIENCE_SYSTEM, query, history)
    return _coerce_bool(result.get("impatience_detected"), default=False)


DISMISSAL_SYSTEM = """
You are detecting whether a user message indicates they do not know, do not have,
or do not care about the value of a specific field they were just asked about.

You will receive JSON with two keys:
  asked_field  : the field that was just asked
  user_message : what the user replied

Reply with ONLY valid JSON: {"dismissed": true} or {"dismissed": false}

dismissed=true means the user is saying they don\'t know, don\'t have, or don\'t
care about that specific field. Examples:
  "I don\'t know", "not sure", "no preference", "doesn\'t matter",
  "I don\'t really have one", "not really", "any is fine", "I\'m fine with any",
  "no specific one", "whatever", "doesn\'t matter to me", "I have no idea",
  "not really, i am fine with any of the drug classes"

dismissed=false means the user provided any information (even partial) OR
changed the subject to a different field. Examples:
  "Phase III please", "preferably randomised", "metformin", "the Netherlands",
  "patients with history of tuberculosis"
"""


def _detect_dismissal(asked_field: str, user_message: str) -> bool:
    payload = json.dumps({"asked_field": asked_field, "user_message": user_message})
    result  = llm_json(DISMISSAL_SYSTEM, payload)
    return _coerce_bool(result.get("dismissed"), default=False)


QUESTION_SYSTEM = """
You are a warm, concise medical information assistant helping a user narrow down
a clinical trial database search.

Your job: ask ONE clarifying question that will most improve search precision.

You will receive a JSON context object containing:
  - current_slots        : what has been extracted so far (non-null only)
  - slot_quality         : quality score for each slot (0-1)
  - specificity_score    : current normalised score
  - target_field         : the slot you should ask about
  - field_description    : what that slot represents
  - field_hint           : guidance on how to phrase the question
  - field_match_type     : "keyword" | "text" | "range"

Phrasing rules by match type:
  keyword -> offer the known valid values as a short list of options
  range   -> ask for numeric bounds or a date range
  text    -> ask an open-ended but focused question

Additional rules:
  - Never ask about a field with quality >= 0.85 (already well-filled).
  - If condition_name quality < 0.5, prioritise asking for sub-type.
    For non-cancer conditions, sub-type alone is sufficient — do NOT ask for stage.
  - Be warm — this may be a patient or caregiver.
  - ONE question only, 1-3 sentences. Do NOT output JSON.
"""


def _tier1_fields():
    return {k: v for k, v in FIELD_REGISTRY.items() if v.get("question_tier", 1) == 1}


def _tier2_fields():
    return {k: v for k, v in FIELD_REGISTRY.items() if v.get("question_tier") == 2}


def _highest_gain_field(state: IntentState) -> str:
    for field_name, meta in _tier1_fields().items():
        if field_name in state.dismissed_fields:
            continue
        dep = meta.get("depends_on")
        if dep and state.slots.get(field_name) and _safe_quality(state, dep) == 0.0:
            return dep

    best_field = None
    best_gain  = -1.0

    for field_name, meta in _tier1_fields().items():
        if field_name in state.dismissed_fields or field_name == "primary_id":
            continue
        current_quality = _safe_quality(state, field_name)
        if current_quality >= 0.85:
            continue
        dep = meta.get("depends_on")
        if dep and _safe_quality(state, dep) == 0.0:
            continue
        gain = meta["weight"] * (1.0 - current_quality)
        if gain > best_gain:
            best_gain  = gain
            best_field = field_name

    return best_field or "condition_name"


def generate_checkbox_refinement_question(state: IntentState) -> str:
    tier2 = _tier2_fields()
    groups = []
    for field_name, meta in tier2.items():
        options = meta.get("checkbox_options", [])
        groups.append({
            "field":       field_name,
            "description": meta["description"],
            "options":     options,
        })

    CHECKBOX_SYSTEM = """
You are a warm medical information assistant.

The user has already provided enough information to search for clinical trials.
You want to offer them optional refinements to narrow results further.

You will receive a list of refinement fields, each with a description and valid options.
Present ALL of them in a single friendly message as a set of optional filter questions.
For each field, list the options clearly so the user can pick one or more, or skip.

Format example:
  "Would you like to refine your search further? These are optional:
   • Allocation – how participants are assigned: Randomised / Non-randomised
   • Masking – blinding level: Open / Single blind / Double blind / Triple blind
   ...
   You can answer any or all of these, or type 'skip' to proceed with your current results."

Keep it friendly and make clear everything is optional. Do NOT output JSON.
"""
    context = {
        "refinement_fields": groups,
        "current_slots": {k: v for k, v in state.slots.items() if v is not None},
    }
    return llm(
        CHECKBOX_SYSTEM,
        "Generate the refinement question.\n\nContext:\n" + json.dumps(context, indent=2),
        state.conversation_history,
    )


def _parse_checkbox_response(user_message: str) -> dict:
    tier2 = _tier2_fields()
    options_map = {
        k: v.get("checkbox_options", []) for k, v in tier2.items()
    }

    CHECKBOX_PARSE_SYSTEM = f"""
You are extracting checkbox selections from a user's message.
The user was presented with these fields and their valid options:
{json.dumps(options_map, indent=2)}

From the user's message, extract which options they selected for each field.
If the user skipped a field or said nothing relevant, use null for that field.
If the user said "skip" or "no thanks" for everything, return all nulls.

Return ONLY valid JSON with this exact schema:
{json.dumps({k: "<selected value or null>" for k in tier2}, indent=2)}
"""
    result = llm_json(CHECKBOX_PARSE_SYSTEM, f"User message: {user_message}")
    if result.get("_parse_error"):
        return {k: None for k in tier2}
    return result


def generate_next_question(state: IntentState) -> tuple:
    target = _highest_gain_field(state)
    meta   = FIELD_REGISTRY.get(target, {})

    context = {
        "current_slots":     {k: v for k, v in state.slots.items() if v is not None},
        "dismissed_fields":  list(state.dismissed_fields),
        "slot_quality":      state.slot_quality,
        "specificity_score": state.specificity_score,
        "questions_asked":   state.questions_asked,
        "target_field":      target,
        "field_description": meta.get("description", ""),
        "field_hint":        meta.get("hint", ""),
        "field_match_type":  meta.get("match", "text"),
    }

    question = llm(
        QUESTION_SYSTEM,
        f"Generate a clarifying question.\n\nContext:\n{json.dumps(context, indent=2)}",
        state.conversation_history,
    )
    return question, target


def _merge_values(existing_slots: dict, user_message: str, history: list) -> dict:
    MERGE_VALUES_SYSTEM = f"""
You are updating extracted clinical trial search fields based on a new user message.

You will receive the EXISTING slot values and the user's new message.
Extract any NEW or CORRECTED values from the new message only.
Return the COMPLETE updated slot object — preserve existing non-null values
unless the new message explicitly overrides them.

Return ONLY valid JSON using this schema:
{_SLOT_SCHEMA}

Apply the same extraction rules as before:
- population_age  : return as a JSON object {{\"gte\": <int>, \"lte\": <int>}}
- population_count: return as a JSON object {{\"gte\": <int>}} or {{\"gte\": <int>, \"lte\": <int>}}
- date_range      : return as {{\"gte\": \"YYYY-MM-DD\"}} or {{\"lte\": \"YYYY-MM-DD\"}}
- trial_status    : extract the status words used by the user
- population_gender: extract as "Male", "Female", or "All"
"""
    payload = (
        f"Existing slots:\n{json.dumps(existing_slots, indent=2)}\n\n"
        f"User's new message:\n{user_message}"
    )
    result = llm_json(MERGE_VALUES_SYSTEM, payload, history)
    if result.get("_parse_error"):
        print(f"[DEBUG] Merge value parse error. Raw:\n{result.get('_raw','')}\n")
        return existing_slots
    return _sanitize_slots(result)


def merge_user_response(state: IntentState, user_message: str) -> IntentState:
    state.slots = _sanitize_slots(state.slots)
    if state.last_asked_field:
        if _detect_dismissal(state.last_asked_field, user_message):
            print(f"[Pipeline] Field \'{state.last_asked_field}\' dismissed by user — will not ask again.")
            state.dismissed_fields.add(state.last_asked_field)
            state.conversation_history.append({"role": "user", "content": user_message})
            state.impatience_detected = _detect_impatience(user_message, state.conversation_history)
            # Score, slots, and quality are all unchanged
            return state

    pre_merge_values = {k: v for k, v in state.slots.items() if v is not None}

    updated_slots = _merge_values(state.slots, user_message, state.conversation_history)

    for slot_name, pre_value in pre_merge_values.items():
        if updated_slots.get(slot_name) is None:
            updated_slots[slot_name] = pre_value

    updated_quality = _score_quality(updated_slots, quality_floor=state.slot_quality)

    for dismissed in state.dismissed_fields:
        updated_quality[dismissed] = 0.0

    impatience = _detect_impatience(user_message, state.conversation_history)

    state.slots               = updated_slots
    state.slot_quality        = updated_quality
    state.impatience_detected = impatience
    state.conversation_history.append({"role": "user", "content": user_message})
    state.specificity_score   = _compute_specificity(state)
    return state

def _evaluate_status(state: IntentState) -> IntentStatus:
    if state.impatience_detected:
        print(f"[Pipeline] Impatience detected. Degraded search (score={state.specificity_score:.3f}).")
        return IntentStatus.DEGRADED

    if state.questions_asked >= MAX_CLARIFICATION_QUESTIONS:
        print(f"[Pipeline] Question cap reached. Degraded search (score={state.specificity_score:.3f}).")
        return IntentStatus.MAX_REACHED

    if state.specificity_score >= SPECIFICITY_THRESHOLD:
        if not state.checkbox_refinement_asked:
            print(f"[Pipeline] Threshold met (score={state.specificity_score:.3f}). Offering refinements.")
            return IntentStatus.REFINING
        print(f"[Pipeline] Refinement complete. Proceeding to search.")
        return IntentStatus.READY

    return IntentStatus.COLLECTING


def build_intent_output(state: IntentState) -> dict:
    state.slots = _sanitize_slots(state.slots)
    filled_slots   = {k: v for k, v in state.slots.items() if v is not None}
    filled_quality = {
        k: round(_safe_quality(state, k), 3)
        for k in filled_slots
    }
    es_fields   = {k: FIELD_REGISTRY[k]["es_field"]  for k in filled_slots if k in FIELD_REGISTRY}
    match_types = {k: FIELD_REGISTRY[k]["match"]     for k in filled_slots if k in FIELD_REGISTRY}

    conversation_summary = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in state.conversation_history
        if msg["role"] in ("assistant", "user")
    ]

    require_non_null_fields = []
    for field_name in state.requested_output_fields:
        field_meta = FIELD_REGISTRY.get(field_name, {})
        es_field = field_meta.get("es_field")
        if isinstance(es_field, list):
            require_non_null_fields.extend(es_field)
        elif isinstance(es_field, str):
            require_non_null_fields.append(es_field)
    require_non_null_fields = _dedupe_preserve_order(require_non_null_fields)

    # location_expansion = _expand_locations(filled_slots.get("locations"))

    return {
        "status":                state.status.value,
        "specificity_score":     round(state.specificity_score, 3),
        "questions_asked":       state.questions_asked,
        "slots":                 filled_slots,
        "slot_quality":          filled_quality,
        "dismissed_fields":      list(state.dismissed_fields),
        "es_fields":             es_fields,
        "match_types":           match_types,
        "requested_output_fields": state.requested_output_fields,
        "retrieval_hints": {
            "query_mode": "field_value_request" if state.requested_output_fields else "trial_search",
            "require_non_null_fields": require_non_null_fields,
            "requested_field_es_fields": {
                field_name: FIELD_REGISTRY[field_name]["es_field"]
                for field_name in state.requested_output_fields
                if field_name in FIELD_REGISTRY
            },
        },
        "raw_query":             state.raw_query,
        "conversation_summary":  conversation_summary,
        # "location_expansion":    location_expansion,
    }


def _print_summary(state: IntentState) -> None:
    sep = "=" * 60
    print(f"\n{sep}\nPIPELINE COMPLETE\n{sep}")
    print(f"  Status            : {state.status.value}")
    print(f"  Specificity Score : {state.specificity_score:.3f}")
    print(f"  Questions Asked   : {state.questions_asked}")
    print("  Filled Slots      :")
    for k, v in state.slots.items():
        if v is not None:
            q = _safe_quality(state, k)
            print(f"    {k:<30} = {str(v):<40} (quality={q:.2f})")
    print(f"{sep}\n")


def run_intent_elicitation_pipeline(initial_query: str) -> dict:
    print("\n[Pipeline] Starting intent elicitation...\n")

    history = [{"role": "user", "content": initial_query}]
    state   = extract_and_score(initial_query, history)

    print(f"[Pipeline] Initial specificity score : {state.specificity_score:.3f}\n")

    state.status = _evaluate_status(state)

    while state.status in (IntentStatus.COLLECTING, IntentStatus.REFINING):

        if state.status == IntentStatus.REFINING:
            question = generate_checkbox_refinement_question(state)
            print(f"\n[Agent] {question}\n")

            state.questions_asked += 1
            state.checkbox_refinement_asked = True
            state.conversation_history.append({"role": "assistant", "content": question})

            user_response = input("[User] ").strip()

            checkbox_selections = _parse_checkbox_response(user_response)
            for slot_name, value in checkbox_selections.items():
                if value is not None:
                    state.slots[slot_name] = value
                    meta = FIELD_REGISTRY.get(slot_name, {})
                    valid_options = [o.lower() for o in meta.get("checkbox_options", [])]
                    if value.lower() in valid_options:
                        state.slot_quality[slot_name] = 0.9
                    else:
                        state.slot_quality[slot_name] = 0.5

            state.conversation_history.append({"role": "user", "content": user_response})
            state.specificity_score = _compute_specificity(state)
            state.impatience_detected = _detect_impatience(user_response, state.conversation_history)

            print(f"[Pipeline] Updated specificity score : {state.specificity_score:.3f}")

        else:
            question, asked_field = generate_next_question(state)
            state.last_asked_field = asked_field  # needed by dismissal detector
            print(f"\n[Agent] {question}\n")

            state.questions_asked += 1
            state.conversation_history.append({"role": "assistant", "content": question})

            user_response = input("[User] ").strip()

            state = merge_user_response(state, user_response)

            print(f"[Pipeline] Updated specificity score : {state.specificity_score:.3f}")
            if state.dismissed_fields:
                print(f"[Pipeline] Dismissed fields          : {state.dismissed_fields}")

        state.status = _evaluate_status(state)
    _print_summary(state)
    intent_output = build_intent_output(state)
    return intent_output


if __name__ == "__main__":
    print("Clinical Trial Search Assistant")
    print("--------------------------------")
    user_query    = input("How can I help you today? ").strip()
    intent_output = run_intent_elicitation_pipeline(user_query)
    print("\n[Intent Output]")
    print(json.dumps(intent_output, indent=2, default=str))
