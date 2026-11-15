import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["team"] == "StellarApp"

def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True
    assert data["dataset_loaded"] is True

    # Also test /api/health
    response_api = client.get("/api/health")
    assert response_api.status_code == 200

def test_metrics_endpoint(client):
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_experiments"] > 0
    assert "materials" in data
    assert len(data["materials"]) > 0

def test_experiments_endpoint(client):
    response = client.get("/api/experiments")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_experiments_filter_material(client):
    response = client.get("/api/experiments?material=PMMA")
    assert response.status_code == 200
    data = response.json()
    assert all("pmma" in item["material"].lower() for item in data)

def test_experiments_detail_not_found(client):
    response = client.get("/api/experiments/non-existent-id")
    assert response.status_code == 404

def test_scenarios_endpoint(client):
    response = client.get("/api/scenarios")
    assert response.status_code == 200
    data = response.json()
    scenario_ids = [s["id"] for s in data]
    assert "iss" in scenario_ids
    assert "lunar" in scenario_ids
    assert "rover" in scenario_ids

def test_kalman_telemetry_endpoint(client):
    response = client.post("/api/telemetry/kalman", json={"scenario_id": "iss", "o2_pct": 21.0})
    assert response.status_code == 200
    data = response.json()
    assert "raw_co_ppm" in data
    assert "filtered_co_ppm" in data
    assert "safety_level" in data

def test_analytics_charts_endpoint(client):
    response = client.get("/api/analytics/charts")
    assert response.status_code == 200
    data = response.json()
    assert "flame_spread_vs_o2" in data
    assert "materials_radiation" in data
    assert "soot_distribution" in data
    assert "flammability_envelope" in data
    assert "thermal_tolerance_bands" in data
    assert "thermal_excursion_timeline" in data

def test_ai_ask_instant_endpoint(client):
    response = client.post("/api/ai/ask", json={"query": "¿Por qué las llamas son esféricas en microgravedad?"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "esférica" in data["answer"].lower()

def test_simulate_endpoint(client):
    payload = {
        "material": "PMMA",
        "gravity_g": 0.0001,
        "oxygen_concentration_pct": 21.0,
        "pressure_kpa": 101.3,
        "air_flow_velocity_cms": 5.0
    }
    response = client.post("/api/ai/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "estimated_flame_spread_mms" in data
    assert "frp_radiation_analysis" in data

def test_psi159_recommend_endpoint(client):
    response = client.post("/api/psi159/recommend", json={"material": "PMMA", "oxygen_pct": 21.0, "gravity_g": 0.0001})
    assert response.status_code == 200
    data = response.json()
    assert "loi_limit_pct" in data
    assert data["loi_limit_pct"] == 17.3
    assert data["is_safe"] is False  # 21% O2 > 17.3 LOI

def test_firms_summary_endpoint(client):
    response = client.get("/api/firms/summary")
    assert response.status_code == 200
    data = response.json()
    assert "planetary_monitoring" in data
    assert "spacecraft_monitoring" in data

def test_thermal_limits_endpoint(client):
    response = client.get("/api/thermal-limits")
    assert response.status_code == 200
    data = response.json()
    assert "thermal_tolerance_bands" in data
    assert "thermal_excursion_timeline" in data
    assert data["human_critical_temp_c"] == 45.0
    assert data["hull_yield_temp_c"] == 150.0

def test_simulation_validation_errors(client):
    # O2 > 100% must return HTTP 422 Unprocessable Entity
    invalid_payload = {
        "material": "PMMA",
        "oxygen_concentration_pct": 150.0
    }
    response = client.post("/api/ai/simulate", json=invalid_payload)
    assert response.status_code == 422

def test_psi_overview_endpoint(client):
    response = client.get("/api/psi/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_studies"] == 14
    assert data["total_experimental_parameters"] == 32
    assert data["combustion_studies_count"] >= 3

def test_psi_studies_endpoint(client):
    response = client.get("/api/psi/studies")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 14

    # Test filtering by category
    resp_comb = client.get("/api/psi/studies?category=Combustion")
    assert resp_comb.status_code == 200
    data_comb = resp_comb.json()
    assert len(data_comb) >= 3

def test_psi_study_detail_endpoint(client):
    response = client.get("/api/psi/studies/PSI-159")
    assert response.status_code == 200
    data = response.json()
    assert data["study"]["psi_id"] == "PSI-159"
    assert len(data["parameters"]) > 0
    assert len(data["documents"]) > 0

def test_psi_parameters_endpoint(client):
    response = client.get("/api/psi/parameters")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 32

    resp_single = client.get("/api/psi/parameters?psi_id=PSI-159")
    assert resp_single.status_code == 200
    assert len(resp_single.json()) > 0

def test_psi_publications_endpoint(client):
    response = client.get("/api/psi/publications")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
