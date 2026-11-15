import pytest
from pathlib import Path
from ai_service import CombustionAIService

DATA_PATH = Path(__file__).parent.parent / "data" / "nasa_combustion_data.json"

@pytest.fixture
def ai_service():
    return CombustionAIService(str(DATA_PATH))

def test_guardrails_rejection(ai_service):
    # Query completely unrelated to spaceflight fire safety
    out_of_domain_query = "Dame una receta para preparar tacos de bistec"
    assert not ai_service._is_query_in_domain(out_of_domain_query)

def test_guardrails_acceptance(ai_service):
    # Relevant spaceflight queries
    assert ai_service._is_query_in_domain("¿Por qué las llamas son esféricas en microgravedad?")
    assert ai_service._is_query_in_domain("Misión Saffire y límites de O2")
    assert ai_service._is_query_in_domain("Filtro de Kalman para CO")
    assert ai_service._is_query_in_domain("Límites térmicos de la tripulación y casco")

@pytest.mark.anyio
async def test_ask_safety_assistant_guardrail_block(ai_service):
    result = await ai_service.ask_safety_assistant("¿Quién ganó el mundial de fútbol?")
    assert "CONTROL DE DOMINIO Y GUARDRAILS DE MISIÓN" in result["answer"]
    assert result["grounded"] is True

@pytest.mark.anyio
async def test_instant_response_flame_spherical(ai_service):
    result = await ai_service.ask_safety_assistant("¿Por qué las llamas son esféricas en microgravedad?")
    assert "esférica" in result["answer"].lower()
    assert "difusión" in result["answer"].lower()
    assert "StellarApp" in result["model"]

@pytest.mark.anyio
async def test_instant_response_artemis(ai_service):
    result = await ai_service.ask_safety_assistant("Explícame la atmósfera al 26% de O2 en Artemis")
    assert "26%" in result["answer"] or "artemis" in result["answer"].lower()
    assert "StellarApp" in result["model"]

@pytest.mark.anyio
async def test_instant_response_thermal_limits(ai_service):
    result = await ai_service.ask_safety_assistant("¿Cuáles son los límites térmicos del casco de la nave y los astronautas?")
    assert "nasa-std-3001" in result["answer"].lower() or "150°c" in result["answer"].lower() or "45°c" in result["answer"].lower()
    assert "StellarApp" in result["model"]

@pytest.mark.anyio
async def test_instant_response_psi_repository(ai_service):
    result = await ai_service.ask_safety_assistant("¿Qué investigaciones contiene el repositorio NASA PSI?")
    assert "14 estudios" in result["answer"] or "psi-159" in result["answer"].lower()
    assert "StellarApp" in result["model"]

@pytest.mark.anyio
async def test_simulate_combustion_model(ai_service):
    params = {
        "material": "PMMA",
        "gravity_g": 0.0,
        "oxygen_concentration_pct": 21.0,
        "pressure_kpa": 101.3,
        "air_flow_velocity_cms": 5.0
    }
    result = await ai_service.simulate_combustion(params)
    assert "estimated_flame_spread_mms" in result
    assert "predicted_risk_level" in result
    assert "compliance_note" in result
    assert result["predicted_risk_level"] in ["Extreme", "Critical", "Moderate", "Low"]
