"""NASA challenge reference library.

Exposes the Resources tab of the "Flame in Freefall" challenge as structured data
so the dashboard can show sources, the investigation map, facilities and the
verified facts used across the app.
"""
import json
import os
from typing import Any, Dict

from i18n import normalize_lang

_PATH = os.path.join(os.path.dirname(__file__), "data", "nasa_resources.json")

try:
    with open(_PATH, "r", encoding="utf-8") as _f:
        DATA: Dict[str, Any] = json.load(_f)
except Exception as _err:  # pragma: no cover
    print(f"Error loading NASA resources: {_err}")
    DATA = {"resources": [], "investigations": [], "facilities": [], "facts": {}}


def _localize(value: Any, lang: str) -> Any:
    if isinstance(value, dict):
        return value.get(lang) or value.get("es") or ""
    return value


def get_resources(lang: str = "es") -> Dict[str, Any]:
    lang = normalize_lang(lang)

    resources = [
        {
            **resource,
            "description": _localize(resource.get("description"), lang),
        }
        for resource in DATA.get("resources", [])
    ]

    investigations = [
        {
            **item,
            "class": _localize(item.get("class"), lang),
            "note": _localize(item.get("note"), lang),
        }
        for item in DATA.get("investigations", [])
    ]

    facilities = [
        {
            **facility,
            "detail": _localize(facility.get("detail"), lang),
        }
        for facility in DATA.get("facilities", [])
    ]

    facts = {
        key: _localize(value, lang)
        for key, value in DATA.get("facts", {}).items()
    }

    return {
        "resources": resources,
        "investigations": investigations,
        "facilities": facilities,
        "facts": facts,
    }
