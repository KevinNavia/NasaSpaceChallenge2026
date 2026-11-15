"""Backend localization (ES/EN) regression tests."""
import sys
import os

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app  # noqa: E402
from i18n import normalize_lang  # noqa: E402


@pytest.fixture
def client():
    return TestClient(app)


@pytest.mark.parametrize(
    "value,expected",
    [
        ("es", "es"),
        ("ES", "es"),
        ("es-ES", "es"),
        ("en", "en"),
        ("en-US", "en"),
        ("EN_us", "en"),
        ("fr", "es"),
        (None, "es"),
        ("", "es"),
    ],
)
def test_normalize_lang(value, expected):
    assert normalize_lang(value) == expected


def test_ai_ask_instant_answer_languages(client):
    es = client.post("/api/ai/ask", json={"query": "¿por qué las llamas son esféricas?", "lang": "es"})
    en = client.post("/api/ai/ask", json={"query": "why are flames spherical?", "lang": "en"})

    assert es.status_code == 200 and en.status_code == 200
    assert "esféric" in es.json()["answer"].lower()
    assert "spherical flame" in en.json()["answer"].lower()


def test_ai_guardrail_languages(client):
    es = client.post("/api/ai/ask", json={"query": "receta de tacos", "lang": "es"}).json()["answer"]
    en = client.post("/api/ai/ask", json={"query": "best pizza topping", "lang": "en"}).json()["answer"]

    assert "Consultas sugeridas" in es
    assert "Suggested queries" in en
    assert "NASA-Domain-Guardrails" == client.post(
        "/api/ai/ask", json={"query": "receta de tacos", "lang": "en"}
    ).json()["model"]


def test_simulate_localized_output(client):
    es = client.post(
        "/api/ai/simulate",
        json={"material": "PMMA", "oxygen_concentration_pct": 26, "lang": "es"},
    ).json()
    en = client.post(
        "/api/ai/simulate",
        json={"material": "PMMA", "oxygen_concentration_pct": 26, "lang": "en"},
    ).json()

    assert "ALERTA CRÍTICA" in es["compliance_note"]
    assert "CRITICAL ALERT" in en["compliance_note"]
    assert es["extinction_strategy"] != en["extinction_strategy"]
    assert es["toxic_hazard"] == "CO + CO2 (alto)"
    assert en["toxic_hazard"] == "CO + CO2 (high)"

    # Risk levels stay as stable codes for the UI to translate
    assert es["predicted_risk_level"] == "Extreme"


def test_kalman_localized_output(client):
    es = client.post("/api/telemetry/kalman", json={"scenario_id": "rover", "o2_pct": 30, "lang": "es"}).json()
    en = client.post("/api/telemetry/kalman", json={"scenario_id": "rover", "o2_pct": 30, "lang": "en"}).json()

    assert es["safety_level"] == "ALERTA"
    assert en["safety_level"] == "ALERT"
    assert es["scenario"]["name"] == "Rover Lunar Presurizado"
    assert en["scenario"]["name"] == "Pressurized Lunar Rover"
    assert "NIVEL NARANJA" in es["alert_title"]
    assert "ORANGE LEVEL" in en["alert_title"]
    assert es["safety_code"] == en["safety_code"] == "alert"
    assert en["required_actions"] != es["required_actions"]


def test_experiments_narratives_localized(client):
    en = client.get("/api/experiments?lang=en").json()
    es = client.get("/api/experiments?lang=es").json()
    default = client.get("/api/experiments").json()

    assert en[0]["spacecraft_implication"].startswith("Flames in microgravity")
    assert es[0]["spacecraft_implication"].startswith("En microgravedad")
    assert es[0]["flame_shape"] == "Domo difuso alargado"
    # Default language is Spanish
    assert default[0]["spacecraft_implication"] == es[0]["spacecraft_implication"]

    # Search runs against the localized narrative
    matches = client.get("/api/experiments?lang=es&search=flotabilidad").json()
    assert len(matches) > 0


def test_firms_summary_localized(client):
    en = client.get("/api/firms/summary?lang=en").json()
    es = client.get("/api/firms/summary?lang=es").json()

    assert "Spherical Radiative Power" in en["spacecraft_monitoring"]["key_metric"]
    assert "Potencia Radiativa Esférica" in es["spacecraft_monitoring"]["key_metric"]
    assert en["scientific_takeaway"].startswith("While on Earth")
    assert es["scientific_takeaway"].startswith("Mientras que en la Tierra")


def test_scenarios_localized(client):
    en = client.get("/api/scenarios?lang=en").json()
    es = client.get("/api/scenarios?lang=es").json()

    assert en[0]["name"] == "ISS / Orbital Module"
    assert es[0]["name"] == "ISS / Módulo Orbital"
