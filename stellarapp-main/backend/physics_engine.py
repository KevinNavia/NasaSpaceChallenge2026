import random
from typing import Dict, Tuple, List, Any

from i18n import KALMAN, normalize_lang

class ScenarioConfig:
    def __init__(self, id: str, name: str, gravity: float, volume_m3: float, ventilation_factor: float, co_multiplier: float, evac_time_scale: float, description: str):
        self.id = id
        self.name = name
        self.gravity = gravity
        self.volume_m3 = volume_m3
        self.ventilation_factor = ventilation_factor
        self.co_multiplier = co_multiplier
        self.evac_time_scale = evac_time_scale
        self.description = description

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "gravity": self.gravity,
            "volume_m3": self.volume_m3,
            "ventilation_factor": self.ventilation_factor,
            "co_multiplier": self.co_multiplier,
            "evac_time_scale": self.evac_time_scale,
            "description": self.description,
        }

SCENARIOS: Dict[str, ScenarioConfig] = {
    "iss": ScenarioConfig(
        id="iss",
        name="ISS / Módulo Orbital",
        gravity=0.0,
        volume_m3=916.0,
        ventilation_factor=1.0,
        co_multiplier=1.0,
        evac_time_scale=1.0,
        description="Microgravedad total (0g). Combustión difusiva pura sin ascensión térmica."
    ),
    "lunar": ScenarioConfig(
        id="lunar",
        name="Base Lunar Presurizada (Artemis)",
        gravity=0.166,
        volume_m3=280.0,
        ventilation_factor=1.3,
        co_multiplier=1.45,
        evac_time_scale=0.8,
        description="Gravedad lunar reducida (0.166g). Convección parcial y riesgo por polvo de regolito."
    ),
    "rover": ScenarioConfig(
        id="rover",
        name="Rover Lunar Presurizado",
        gravity=0.166,
        volume_m3=42.0,
        ventilation_factor=0.6,
        co_multiplier=2.8,
        evac_time_scale=0.35,
        description="Volumen hiperconfinado (42 m³). Rápida saturación tóxica de monóxido de carbono."
    )
}

class KalmanGasFilter:
    """Filtro de Kalman unidimensional para estimar concentración real de CO filtrando ruido IoT."""
    def __init__(self, q: float = 0.25, r: float = 4.0, initial_x: float = 12.0):
        self.x = initial_x
        self.p = 1.0
        self.q = q
        self.r = r
        self.k = 0.0

    def update(self, measurement: float) -> Tuple[float, float]:
        self.p = self.p + self.q
        self.k = self.p / (self.p + self.r)
        self.x = self.x + self.k * (measurement - self.x)
        self.p = (1.0 - self.k) * self.p
        return round(float(self.x), 2), round(float(self.k), 3)

class FireSafetyEngine:
    def __init__(self):
        self.filters: Dict[str, KalmanGasFilter] = {
            k: KalmanGasFilter() for k in SCENARIOS.keys()
        }

    def compute_telemetry(self, scenario_id: str, o2_pct: float, lang: str = "es") -> Dict[str, Any]:
        lang = normalize_lang(lang)
        texts = KALMAN[lang]
        scen = SCENARIOS.get(scenario_id, SCENARIOS["iss"])
        kf = self.filters[scen.id]

        scenario_data = scen.to_dict()
        localized_scenario = texts["scenarios"].get(scen.id)
        if localized_scenario:
            scenario_data["name"] = localized_scenario["name"]
            scenario_data["description"] = localized_scenario["description"]

        # Validación y restricción física (Límites de atmósfera espacial 0.0% a 100.0%)
        o2_pct = max(0.0, min(100.0, float(o2_pct)))

        # Simulación de lectura con ruido gaussiano del sensor IoT
        base_co = max(0.0, (o2_pct - 16.5) * 5.8 * scen.co_multiplier)
        noise = random.gauss(0, 3.5)
        raw_reading = max(0.0, base_co + noise)

        filtered_co, kalman_gain = kf.update(raw_reading)

        # Matriz de Contingencia y Seguridad de Tripulación
        if filtered_co >= 140.0 or o2_pct >= 36.0:
            code = "critical"
            color = "#e52020"
            time_crit = texts["times"]["critical_short"] if scen.evac_time_scale < 0.5 else texts["times"]["critical_long"]
        elif filtered_co >= 60.0 or o2_pct >= 26.0:
            code = "alert"
            color = "#df6500"
            time_crit = texts["times"]["alert_short"] if scen.evac_time_scale < 0.5 else texts["times"]["alert_long"]
        elif filtered_co >= 25.0 or o2_pct >= 22.5:
            code = "caution"
            color = "#bff230"
            time_crit = texts["times"]["caution"]
        else:
            code = "nominal"
            color = "#76b900"
            time_crit = texts["times"]["nominal"]

        scenario_name = scenario_data["name"]

        return {
            "scenario": scenario_data,
            "o2_percentage": o2_pct,
            "raw_co_ppm": round(raw_reading, 2),
            "filtered_co_ppm": filtered_co,
            "kalman_gain": kalman_gain,
            "safety_level": texts["levels"][code],
            "safety_code": code,
            "alert_color": color,
            "alert_title": texts["titles"][code],
            "diagnosis": texts["messages"][code].format(scenario=scenario_name),
            "required_actions": list(texts["actions"][code]),
            "critical_evac_time": time_crit,
        }

engine = FireSafetyEngine()
