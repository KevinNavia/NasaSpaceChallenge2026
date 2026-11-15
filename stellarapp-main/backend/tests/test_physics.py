import pytest
from physics_engine import SCENARIOS, ScenarioConfig, KalmanGasFilter, FireSafetyEngine

def test_scenario_configs():
    assert "iss" in SCENARIOS
    assert "lunar" in SCENARIOS
    assert "rover" in SCENARIOS

    iss = SCENARIOS["iss"]
    assert iss.gravity == 0.0
    assert iss.volume_m3 == 916.0
    d = iss.to_dict()
    assert d["id"] == "iss"
    assert d["gravity"] == 0.0

def test_kalman_gas_filter():
    kf = KalmanGasFilter(q=0.25, r=4.0, initial_x=12.0)
    assert kf.x == 12.0
    
    # Update with several measurements and verify convergence
    measurements = [20.0, 22.0, 21.0, 21.5, 20.8]
    for m in measurements:
        filtered_val, gain = kf.update(m)
        assert isinstance(filtered_val, float)
        assert isinstance(gain, float)
        assert 0.0 <= gain <= 1.0

    # Filtered value should be close to 21
    assert 18.0 <= kf.x <= 23.0

def test_fire_safety_engine_nominal():
    engine = FireSafetyEngine()
    result = engine.compute_telemetry("iss", o2_pct=20.9)
    assert result["scenario"]["id"] == "iss"
    assert result["o2_percentage"] == 20.9
    assert result["safety_level"] == "NOMINAL"
    assert result["alert_color"] == "#76b900"
    assert "NOMINAL" in result["alert_title"]

def test_fire_safety_engine_alert():
    engine = FireSafetyEngine()
    # High oxygen triggers ALERTA or CRÍTICO
    result = engine.compute_telemetry("iss", o2_pct=28.0)
    assert result["safety_level"] in ["ALERTA", "CRÍTICO"]
    assert result["critical_evac_time"] != "Estable"

def test_fire_safety_engine_critical():
    engine = FireSafetyEngine()
    result = engine.compute_telemetry("rover", o2_pct=38.0)
    assert result["safety_level"] == "CRÍTICO"
    assert result["alert_color"] == "#e52020"
    assert len(result["required_actions"]) > 0

def test_fire_safety_engine_unknown_scenario_fallback():
    engine = FireSafetyEngine()
    result = engine.compute_telemetry("non_existent_module", o2_pct=21.0)
    assert result["scenario"]["id"] == "iss"

def test_fire_safety_engine_boundary_clamping():
    engine = FireSafetyEngine()
    # Negative O2 should clamp to 0.0
    res_neg = engine.compute_telemetry("iss", o2_pct=-15.0)
    assert res_neg["o2_percentage"] == 0.0
    assert res_neg["safety_level"] == "NOMINAL"

    # Excess O2 should clamp to 100.0
    res_excess = engine.compute_telemetry("iss", o2_pct=150.0)
    assert res_excess["o2_percentage"] == 100.0
    assert res_excess["safety_level"] == "CRÍTICO"
