"""Tests for the NASA reference library endpoint."""
import sys
import os

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app  # noqa: E402


@pytest.fixture
def client():
    return TestClient(app)


def test_resources_endpoint_structure(client):
    data = client.get("/api/resources?lang=es").json()

    assert len(data["resources"]) == 10
    assert len(data["investigations"]) >= 15
    assert len(data["facilities"]) == 4
    assert data["facts"]["energySharePct"] == 85
    assert data["facts"]["densityRatio"] == 8


def test_all_resource_urls_are_https(client):
    resources = client.get("/api/resources").json()["resources"]
    assert all(item["url"].startswith("https://") for item in resources)
    ids = {item["id"] for item in resources}
    assert {"psi", "glenn", "sciencecasts", "guide", "apollo1", "apollo13", "mir", "airtanks", "detector", "attire"} == ids


def test_resources_are_localized(client):
    es = client.get("/api/resources?lang=es").json()
    en = client.get("/api/resources?lang=en").json()

    es_psi = next(item for item in es["resources"] if item["id"] == "psi")
    en_psi = next(item for item in en["resources"] if item["id"] == "psi")

    assert "fuente primaria" in es_psi["description"]
    assert "primary source" in en_psi["description"]
    assert es["facts"]["partialGravityGap"] != en["facts"]["partialGravityGap"]


def test_investigation_map_covers_brief_and_dataset(client):
    data = client.get("/api/resources?lang=en").json()
    investigations = {item["id"]: item for item in data["investigations"]}

    assert investigations["saffire"]["inDataset"] is True
    assert investigations["cfi"]["status"] == "brief"
    assert investigations["fm2"]["status"] == "current"
    assert investigations["luci"]["status"] == "future"


def test_facility_details_are_localized(client):
    es = client.get("/api/resources?lang=es").json()["facilities"]
    en = client.get("/api/resources?lang=en").json()["facilities"]

    es_cir = next(item for item in es if item["id"] == "cir")
    en_cir = next(item for item in en if item["id"] == "cir")

    assert "100 litros" in es_cir["detail"]
    assert "100-liter" in en_cir["detail"]
