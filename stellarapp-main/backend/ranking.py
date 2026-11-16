"""Explainable ranking of combustion investigations for habitat profiles.

The NASA challenge asks for a dashboard that summarizes, ranks and interprets
investigations for the fire-safety needs of habitable crew environments. This
module scores every experiment against a selected atmosphere profile and returns
the factor contributions so the UI can explain the ranking.
"""
from typing import Any, Dict, List

from i18n import RANKING_PROFILES, normalize_lang

# Atmosphere profiles. The Moon base and suit values follow the challenge brief:
# suits use 100% O2 at 4.3 psi; the lunar base is expected at >=30% O2 and
# <=10.2 psi. Artemis 26% / 56.5 kPa is kept as the reference exploration profile.
PROFILES: Dict[str, Dict[str, float]] = {
    "iss": {"o2_pct": 21.0, "pressure_kpa": 101.3, "gravity_g": 0.0001},
    "artemis": {"o2_pct": 26.0, "pressure_kpa": 56.5, "gravity_g": 0.166},
    "lunar": {"o2_pct": 30.0, "pressure_kpa": 70.3, "gravity_g": 0.166},
    "rover": {"o2_pct": 30.0, "pressure_kpa": 70.3, "gravity_g": 0.166},
    "suit": {"o2_pct": 100.0, "pressure_kpa": 29.6, "gravity_g": 0.0001},
}

WEIGHTS = {
    "flammability": 45,
    "spread": 25,
    "detectability": 15,
    "environment": 15,
}

_SOOT_SCORE = {
    "high": 1.0,
    "medium": 0.6,
    "moderate": 0.6,
    "low": 0.3,
    "none": 0.1,
}


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def _soot_score(soot: str) -> float:
    if not soot:
        return 0.1
    text = str(soot).lower()
    for key, score in _SOOT_SCORE.items():
        if text.startswith(key) or key in text:
            return score
    return 0.1


def _gravity_match(experiment_g: float, profile_g: float) -> float:
    if profile_g < 0.01:  # microgravity habitat / suit
        if experiment_g < 0.01:
            return 1.0
        return 0.5 if experiment_g < 1.0 else 0.1
    if profile_g < 1.0:  # partial gravity (Moon / Mars)
        if experiment_g < 0.01:
            return 0.75
        return max(0.2, 1.0 - abs(experiment_g - profile_g) / 0.6)
    return 1.0 if experiment_g >= 0.9 else 0.5


def score_experiment(experiment: Dict[str, Any], profile_id: str) -> Dict[str, Any]:
    profile = PROFILES.get(profile_id, PROFILES["lunar"])
    o2 = profile["o2_pct"]

    loi = float(experiment.get("limiting_oxygen_index_pct", 21.0))
    margin = round(loi - o2, 2)

    # 1. Flammability: how far the ambient O2 exceeds the material's LOI.
    if margin <= 0:
        flammability = 1.0
    else:
        flammability = _clamp(1.0 - margin / 12.0)

    # 2. Flame spread rate normalized against the dataset maximum (~3 mm/s).
    spread_rate = float(experiment.get("flame_spread_rate_mms", 0.0))
    spread = _clamp(spread_rate / 3.0)

    # 3. Detectability challenge: heavy soot plus invisible cool flames.
    soot = _soot_score(experiment.get("soot_production", ""))
    cool_flame = bool(experiment.get("cool_flame_observed", False))
    detectability = _clamp(soot * 0.6 + (0.5 if cool_flame else 0.0))

    # 4. Environment relevance: does the experiment's gravity match the habitat?
    environment = _gravity_match(float(experiment.get("gravity_g", 0.0)), profile["gravity_g"])

    contributions = {
        "flammability": round(flammability * WEIGHTS["flammability"], 1),
        "spread": round(spread * WEIGHTS["spread"], 1),
        "detectability": round(detectability * WEIGHTS["detectability"], 1),
        "environment": round(environment * WEIGHTS["environment"], 1),
    }
    score = round(sum(contributions.values()), 1)

    return {
        "id": experiment.get("id"),
        "mission": experiment.get("mission"),
        "material": experiment.get("material"),
        "environment": experiment.get("environment"),
        "gravity_g": experiment.get("gravity_g"),
        "oxygen_concentration_pct": experiment.get("oxygen_concentration_pct"),
        "flame_spread_rate_mms": spread_rate,
        "limiting_oxygen_index_pct": loi,
        "safety_risk_level": experiment.get("safety_risk_level"),
        "cool_flame_observed": cool_flame,
        "soot_production": experiment.get("soot_production"),
        "nasa_reference": experiment.get("nasa_reference"),
        "score": score,
        "contributions": contributions,
        "factors": {
            "loi_margin_pct": margin,
            "spread_mms": spread_rate,
            "soot": experiment.get("soot_production"),
            "cool_flame": cool_flame,
            "gravity_match": round(environment, 2),
        },
    }


def rank_experiments(
    experiments: List[Dict[str, Any]], profile_id: str, lang: str = "es"
) -> Dict[str, Any]:
    lang = normalize_lang(lang)
    profile_id = profile_id if profile_id in PROFILES else "lunar"
    profile_meta = RANKING_PROFILES[lang][profile_id]

    results = [score_experiment(exp, profile_id) for exp in experiments]
    results.sort(key=lambda item: item["score"], reverse=True)
    for index, item in enumerate(results, start=1):
        item["rank"] = index

    return {
        "profile": {
            "id": profile_id,
            "name": profile_meta["name"],
            "description": profile_meta["description"],
            **PROFILES[profile_id],
        },
        "weights": WEIGHTS,
        "results": results,
    }
