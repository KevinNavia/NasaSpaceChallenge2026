"""Tests for the explainable investigation ranking."""
import sys
import os

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app  # noqa: E402
from ranking import score_experiment, WEIGHTS  # noqa: E402


@pytest.fixture
def client():
    return TestClient(app)


def test_ranking_endpoint_structure(client):
    response = client.get("/api/ranking?profile=lunar&lang=es")
    assert response.status_code == 200
    data = response.json()

    assert data["profile"]["id"] == "lunar"
    assert data["profile"]["o2_pct"] == 30.0
    assert data["weights"] == WEIGHTS
    assert len(data["results"]) == 11

    scores = [item["score"] for item in data["results"]]
    assert scores == sorted(scores, reverse=True)
    assert [item["rank"] for item in data["results"]] == list(range(1, 12))


def test_contributions_add_up_to_score(client):
    results = client.get("/api/ranking?profile=lunar").json()["results"]
    for item in results:
        total = sum(item["contributions"].values())
        assert round(total, 1) == pytest.approx(item["score"], abs=0.1)


def test_lunar_profile_ranks_flammable_material_first(client):
    results = client.get("/api/ranking?profile=lunar&lang=en").json()["results"]
    assert results[0]["material"].startswith("PMMA")
    # PMMA's LOI (17.3%) is far below the 30% lunar atmosphere
    assert results[0]["factors"]["loi_margin_pct"] < 0


def test_environment_factor_penalizes_terrestrial_experiment(client):
    results = client.get("/api/ranking?profile=lunar&lang=en").json()["results"]
    earth = next(item for item in results if item["id"] == "EXP-REF-EARTH-001")
    assert earth["contributions"]["environment"] <= 3.5


def test_suit_profile_marks_everything_flammable(client):
    results = client.get("/api/ranking?profile=suit").json()["results"]
    assert all(item["factors"]["loi_margin_pct"] < 0 for item in results)


def test_profile_labels_localized(client):
    es = client.get("/api/ranking?profile=suit&lang=es").json()["profile"]
    en = client.get("/api/ranking?profile=suit&lang=en").json()["profile"]
    assert es["name"] == "Traje EVA"
    assert en["name"] == "EVA suit"


def test_invalid_profile_returns_400(client):
    assert client.get("/api/ranking?profile=spaceship").status_code == 400


def test_score_is_bounded():
    experiment = {
        "id": "TEST",
        "gravity_g": 0.0001,
        "limiting_oxygen_index_pct": 10.0,
        "flame_spread_rate_mms": 9.0,
        "soot_production": "High",
        "cool_flame_observed": True,
    }
    scored = score_experiment(experiment, "lunar")
    assert 0 <= scored["score"] <= 100
