"""Backend localization (ES/EN) for generated content.

The API accepts a ``lang`` parameter; this module centralizes every string the
backend generates so the frontend never has to translate server-side prose.
"""
import json
import os
from typing import Any, Dict, List

SUPPORTED = ("es", "en")


def normalize_lang(value: Any) -> str:
    """Return a supported language code; Spanish is the default."""
    if not value:
        return "es"
    code = str(value).strip().lower().replace("_", "-").split("-")[0]
    return code if code in SUPPORTED else "es"


# ---------------------------------------------------------------------------
# Experiment dataset localization (narratives are stored in English)
# ---------------------------------------------------------------------------
_EXPERIMENTS_I18N_PATH = os.path.join(
    os.path.dirname(__file__), "data", "experiments_i18n.json"
)

try:
    with open(_EXPERIMENTS_I18N_PATH, "r", encoding="utf-8") as _f:
        EXPERIMENTS_ES: Dict[str, Dict[str, str]] = json.load(_f)
except Exception as _err:  # pragma: no cover - data file is shipped with the repo
    print(f"Error loading experiments i18n: {_err}")
    EXPERIMENTS_ES = {}

_EXPERIMENT_FIELDS = (
    "material_type",
    "environment",
    "flame_shape",
    "soot_production",
    "spacecraft_implication",
    "recommended_suppression",
)


def localize_experiment(experiment: Dict[str, Any], lang: str) -> Dict[str, Any]:
    if normalize_lang(lang) != "es":
        return experiment

    translated = EXPERIMENTS_ES.get(experiment.get("id", ""))
    if not translated:
        return experiment

    result = dict(experiment)
    for field in _EXPERIMENT_FIELDS:
        if field in translated:
            result[field] = translated[field]
    return result


def localize_experiments(experiments: List[Dict[str, Any]], lang: str) -> List[Dict[str, Any]]:
    if normalize_lang(lang) != "es":
        return experiments
    return [localize_experiment(exp, lang) for exp in experiments]


# ---------------------------------------------------------------------------
# AI assistant
# ---------------------------------------------------------------------------
GUARDRAIL_EN = (
    "⚠️ **MISSION DOMAIN CONTROL & NASA STELLARAPP GUARDRAILS:**\n\n"
    "This artificial intelligence terminal is **strictly restricted to the project's technical perimeter**:\n"
    "• Microgravity combustion physics (0g, Lunar, Martian).\n"
    "• NASA spaceflight missions: Saffire, BASS-II, FLEX-2, ACME and SAME.\n"
    "• Space exploration atmospheres and O₂ enrichment (Artemis 26% O₂).\n"
    "• Toxic gas sensor noise filtering (Kalman Filter for CO).\n"
    "• Radiative correlation between terrestrial fires (NASA FIRMS) and spacecraft.\n\n"
    "**Suggested queries you can run:**\n"
    "1. *'Why are flames spherical and blue in microgravity?'*\n"
    "2. *'What hazard does the 26% O₂ atmosphere pose on Artemis?'*\n"
    "3. *'How does the SAME experiment detect agglomerated smoke particles on the ISS?'*\n"
    "4. *'What are the thermal limits for the astronaut and the hull?'*"
)

INSTANT_EN = {
    "sphere": (
        "🔥 **Microgravity Flame Morphology (0g) • Saffire & BASS-II Missions:**\n\n"
        "1. **Absence of Natural Convection:** On Earth (1g), hot gases rise due to buoyancy, elongating the flame upward into a teardrop shape. In microgravity (g ≈ 10⁻⁴), there is no hydrostatic thrust; oxidizer transport is governed only by **isotropic molecular diffusion**, forming a **perfectly spherical flame**.\n\n"
        "2. **Blue Chemiluminescence:** With no rising currents to drag incandescent soot toward the tip, the dominant visible emission comes from the chemiluminescence of C₂ and CH radicals (430-515 nm), producing faint blue light at 1200-1450 K.\n\n"
        "3. **Operational Protocol:** Without forced ventilation flow, the flame self-extinguishes by asphyxiation in its own products (CO₂). The ECLSS directive during a cabin fire is to **immediately stop recirculation below 1.2 cm/s**."
    ),
    "artemis": (
        "⚠️ **Critical Hazard in the Artemis Exploration Atmosphere (26% O₂ • 56.5 kPa):**\n\n"
        "1. **Drastic Flame Acceleration:** To shorten pre-EVA decompression protocols, Artemis uses a 26% O₂ atmosphere at 56.5 kPa (8.2 psi). Experiments on Cygnus (**Saffire-IV**) showed that flame spread over structural polymers such as PMMA increases from 0.91 mm/s to **1.73 mm/s (+90% faster)**.\n\n"
        "2. **Reduced Quenching Distance:** The thermal extinction distance drops from 10.5 mm to <5.2 mm, allowing fire to penetrate narrow avionics gaps and control panels.\n\n"
        "3. **NASA-STD-6001B Requirement:** No material with a Limiting Oxygen Index (LOI) below 26.0% is authorized in the habitable cabin of the Orion spacecraft or the lunar base."
    ),
    "cool": (
        "❄️ **'Cool Flames' Phenomenon • FLEX-2 Mission (ISS):**\n\n"
        "1. **Low-Temperature Chemical Kinetics:** FLEX-2 discovered on the ISS that after the apparent extinction of the hot flame over hydrocarbon droplets (n-heptane), combustion remains active at much lower temperatures (600-800 K versus 1400-1800 K) with no visible radiation.\n\n"
        "2. **Invisible Crew Hazard:** This slow reaction continuously releases carbon monoxide and volatile hydrocarbons, with a critical risk of **sudden violent reignition** when module fans are restarted.\n\n"
        "3. **Monitoring and Extinction:** Mandatory detection through broadband infrared radiometry and continuous nitrogen (N₂) inerting until the temperature is below 350 K."
    ),
    "same": (
        "🌫️ **Soot Agglomeration and Detector Failure • SAME Experiment (ISS):**\n\n"
        "1. **Agglomeration Mechanism:** On Earth, rising convection disperses soot as fine particles (0.05-0.10 µm). In microgravity, particles remain trapped in the thermal zone and agglomerate into **giant soot chains of 0.50 to 5.0 µm** (SAME experiment in the Destiny module).\n\n"
        "2. **Blindness of Conventional Detectors:** Terrestrial ionization detectors cannot see particles >1.0 µm. A smoldering fire could fill the cabin with toxic gases before the alarm triggers.\n\n"
        "3. **StellarApp Solution:** Incorporates optical calibration based on modified Rayleigh scattering for SAME agglomerated particles."
    ),
    "kalman": (
        "📈 **Kalman Filter for Carbon Monoxide (CO) Telemetry • StellarApp:**\n\n"
        "1. **Real-Time Stochastic Filtering:** In sealed cabins without convection currents, electrochemical CO sensors record Gaussian stochastic noise (σ = 8.5 ppm). StellarApp applies a two-state linear Kalman filter that estimates the true concentration and the generation rate d[CO]/dt.\n\n"
        "2. **State Equations:**\n"
        "   • x̂(k|k-1) = A·x̂(k-1), P(k|k-1) = A·P(k-1)·Aᵀ + Q\n"
        "   • K(k) = P(k|k-1)·Hᵀ·(H·P(k|k-1)·Hᵀ + R)⁻¹\n"
        "   • x̂(k) = x̂(k|k-1) + K(k)·(z(k) - H·x̂(k|k-1))\n\n"
        "3. **Operational Alert Thresholds:** Early warning at 50 ppm and **critical module evacuation alarm at 140 ppm** on the ISS (916 m³), Lunar Habitat (280 m³) and Rover (42 m³)."
    ),
    "thermal": (
        "🌡️ **Maximum Thermal Limits: Crew vs. Spacecraft Hull (NASA-STD-3001 & NASA-SP-20205001358):**\n\n"
        "1. **Human Crew Tolerance:**\n"
        "   • *Nominal Comfort:* 18.3 °C to 26.7 °C (291.5-299.8 K).\n"
        "   • *Mandatory Evacuation (Hyperthermia):* **+45.0 °C** (318.1 K) with a maximum exposure time of 45 minutes.\n"
        "   • *Tissue Damage / Pain Threshold:* +50.0 °C or incident radiative flux >1.4 kW/m².\n\n"
        "2. **Spacecraft Hull Structural Resistance:**\n"
        "   • *Avionics (Cold Plates):* +55.0 °C (loss of cooling).\n"
        "   • *Al-Li 2195 Hull Critical Creep:* **+150.0 °C**, losing 40% stiffness with imminent risk of rupture from differential pressurization.\n"
        "   • *Viton Elastomer Seal Failure:* +180.0 °C (catastrophic depressurization).\n\n"
        "3. **Fire Timeline:** In a 280 m³ lunar cabin, the air reaches human collapse (+45 °C) at **45 seconds**, and the hull reaches failure (+150 °C) at **118 seconds**."
    ),
    "materials": (
        "🧱 **Spacecraft Material Flammability Matrix (NASA-STD-6001B):**\n\n"
        "1. **Nomex (Aramid - LOI 28.5%):** Self-extinguishing in 0g with 21% O₂. Minimal radiative power (0.8 kW). Standard material for flight suits and IVA garments.\n"
        "2. **PMMA (Clear Acrylic - LOI 17.3%):** Highly hazardous in microgravity. Emits **18.4 kW of radiative FRP** and a thermal flux of 24.2 kW/m². Prohibited without fireproof encapsulation.\n"
        "3. **Kapton (Polyimide - LOI 27.5%):** Quenching distance of 11.2 mm. Withstands up to 400 °C before pyrolysis; certified for multi-layer insulation (MLI).\n"
        "4. **SIBL (Cotton-Glass - LOI 16.5%):** Reference material in Saffire-I for continuous spread in ventilated ducts.\n\n"
        "5. **NASA Criterion:** For Artemis missions, Test 1 flammability testing requires LOI >26% to authorize presence in a pressurized cabin."
    ),
    "firms": (
        "🌍🚀 **Earth-to-Space Bridge: NASA FIRMS to Saffire in Microgravity:**\n\n"
        "1. **Planetary Scale (NASA FIRMS):** Uses orbiting MODIS and VIIRS satellite sensors to measure **Fire Radiative Power (FRP)** at territorial scale on an EPSG:6933 grid.\n\n"
        "2. **Physical Translation to the Cabin (StellarApp):** Adapts the Stefan-Boltzmann equation Φ = ε·σ·A·T⁴ to model radiative heat from materials in Cygnus spacecraft (Saffire), where the absence of convection concentrates up to 40% of the energy into direct radiation onto module walls.\n\n"
        "3. **Operational Application:** Connects terrestrial wildfire observation with thermal damage prediction in pressurized lunar and Martian habitats."
    ),
    "psi": (
        "🔬 **Official NASA Physical Sciences Informatics (PSI) Repository:**\n\n"
        "StellarApp integrates the official NASA PSI database with **14 spaceflight studies and 32 validated experimental parameters**:\n\n"
        "• **PSI-159 (Cool Flames / ACME):** Spherical gaseous diffusion flames on the ISS. Calibration of PMT1 (gain 10.0), PMT2 (8.0), PMT3 (10.0) photomultipliers, radiometers and MFCA1 static flow control (0.50) for invisible cool-flame detection.\n"
        "• **PSI-60 (SPICE / Dobbins et al. 2022):** Soot formation and agglomeration in microgravity through two-color pyrometry, analyzing over 1600 ISS flame images.\n"
        "• **PSI-62 (BASS / Flamelet Generated Manifolds):** Numerical modeling of concurrent flame spread over solid surfaces in 0g compared with experimental tomography on the ISS.\n"
        "• **PSI-138 & PSI-189:** Boiling heat transfer and gas-liquid two-phase dynamics for reactors and ECLSS life-support systems.\n\n"
        "You can query these studies directly at `/api/psi/studies` and `/api/psi/parameters`."
    ),
}

FALLBACK_LABELS = {
    "es": {
        "title": "**Análisis de Seguridad Espacial NASA (Basado en {mission})**",
        "mechanism": "1. **Mecanismo Físico:** En microgravedad ({environment}), la ausencia de convección natural impide que los gases calientes asciendan. La combustión pasa a ser dominada por difusión molecular y ventilación forzada ({flow} cm/s).",
        "material": "2. **Comportamiento del Material ({material}):** Presenta una tasa de propagación de llama de {spread} mm/s con forma de llama '{shape}'. Índice de Oxígeno Límite (LOI): {loi}%.",
        "risk": "3. **Riesgo Operacional en Nave:** {implication}",
        "protocol": "4. **Protocolo de Supresión Recomendado:** {suppression}.",
    },
    "en": {
        "title": "**NASA Space Safety Analysis (Based on {mission})**",
        "mechanism": "1. **Physical Mechanism:** In microgravity ({environment}), the absence of natural convection prevents hot gases from rising. Combustion becomes dominated by molecular diffusion and forced ventilation ({flow} cm/s).",
        "material": "2. **Material Behavior ({material}):** It shows a flame spread rate of {spread} mm/s with a '{shape}' flame shape. Limiting Oxygen Index (LOI): {loi}%.",
        "risk": "3. **Spacecraft Operational Risk:** {implication}",
        "protocol": "4. **Recommended Suppression Protocol:** {suppression}.",
    },
}


def fallback_answer(experiment: Dict[str, Any], lang: str) -> str:
    lang = normalize_lang(lang)
    labels = FALLBACK_LABELS[lang]
    exp = localize_experiment(experiment, lang)
    return "\n\n".join([
        labels["title"].format(mission=exp.get("mission", "NASA")),
        labels["mechanism"].format(
            environment=exp.get("environment", ""),
            flow=exp.get("air_flow_velocity_cms", ""),
        ),
        labels["material"].format(
            material=exp.get("material", ""),
            spread=exp.get("flame_spread_rate_mms", ""),
            shape=exp.get("flame_shape", ""),
            loi=exp.get("limiting_oxygen_index_pct", ""),
        ),
        labels["risk"].format(implication=exp.get("spacecraft_implication", "")),
        labels["protocol"].format(suppression=exp.get("recommended_suppression", "")),
    ])


def guardrail_message(lang: str) -> str:
    return GUARDRAIL_EN if normalize_lang(lang) == "en" else None  # None => keep Spanish literal


# ---------------------------------------------------------------------------
# AI prompt
# ---------------------------------------------------------------------------
def assistant_prompt(lang: str, context_summary: str, query: str, experiment_ids: str) -> str:
    if normalize_lang(lang) == "en":
        return f"""You are the NASA AI Specialist for Microgravity Fire Safety (ISS, Artemis, Mars).
Answer the astronaut's or engineer's query technically, rigorously and concisely (in 2 paragraphs) in English.
Base your answer on this NASA experimental evidence:
{context_summary}

USER QUERY:
{query}

KEY INSTRUCTIONS:
1. Explain the exact physical mechanism (lack of natural convection and hydrostatic thrust in 0g, slow diffusive transport, spherical/blue flame or cool-flame phenomena).
2. Detail the implications for the spacecraft atmosphere and the operational suppression recommendation for the crew (ECLSS).
3. Always answer in formal English, citing at least one experiment ({experiment_ids})."""

    return f"""Eres el Especialista de IA de la NASA para Seguridad contra Incendios en Microgravedad (ISS, Artemis, Marte).
Responde a la consulta del astronauta o ingeniero de forma técnica, rigurosa y concisa (en 2 párrafos) en español.
Básate en esta evidencia experimental de la NASA:
{context_summary}

CONSULTA DEL USUARIO:
{query}

INSTRUCCIONES CLAVE:
1. Explica el mecanismo físico exacto (falta de convección natural y empuje hidrostático en 0g, transporte por difusión lenta, llama esférica/azul o fenómenos de llama fría).
2. Detalla las implicaciones para la atmósfera de la nave y la recomendación operacional de supresión para la tripulación (ECLSS).
3. Responde siempre en español formal, citando al menos un experimento ({experiment_ids})."""


# ---------------------------------------------------------------------------
# Combustion simulator
# ---------------------------------------------------------------------------
SIMULATE = {
    "es": {
        "compliance_alert": "⚠️ ALERTA CRÍTICA PSI-159: O₂ ({o2}%) >= LOI ({loi}%). El material sostendrá llama. Emisión tóxica: {tox}.",
        "compliance_safe": "✅ NASA PSI-159 / STD-6001: Material auto-extinguible en este régimen (O₂: {o2}% < LOI: {loi}%). Emisión esperada: {tox}.",
        "strategy_space": "Cortar flujo de ventilación a < 1.0 cm/s de inmediato e inyectar N2/CO2",
        "strategy_earth": "Uso de extintor de agua nebulizada / CO2",
        "sensor_ctx": "Calibrado con NASA PSI-159 (PMT1: 4.42 V, IonCurrent: -0.888, MFC Max: 4.92 V)",
    },
    "en": {
        "compliance_alert": "⚠️ PSI-159 CRITICAL ALERT: O₂ ({o2}%) >= LOI ({loi}%). The material will sustain flame. Toxic emission: {tox}.",
        "compliance_safe": "✅ NASA PSI-159 / STD-6001: Self-extinguishing material in this regime (O₂: {o2}% < LOI: {loi}%). Expected emission: {tox}.",
        "strategy_space": "Immediately cut ventilation flow below 1.0 cm/s and inject N2/CO2",
        "strategy_earth": "Use water mist / CO2 extinguisher",
        "sensor_ctx": "Calibrated with NASA PSI-159 (PMT1: 4.42 V, IonCurrent: -0.888, MFC Max: 4.92 V)",
    },
}

TOXICITY = {
    "nomex": {"es": "CO (bajo a medio)", "en": "CO (low to medium)"},
    "pbi": {"es": "CO (bajo)", "en": "CO (low)"},
    "kapton": {"es": "HCN + CO (alto)", "en": "HCN + CO (high)"},
    "kevlar": {"es": "CO (medio)", "en": "CO (medium)"},
    "ptfe": {"es": "HF (muy alto)", "en": "HF (very high)"},
    "pmma": {"es": "CO + CO2 (alto)", "en": "CO + CO2 (high)"},
    "cotton": {"es": "CO (moderado)", "en": "CO (moderate)"},
    "etfe": {"es": "HF trazas + CO", "en": "HF traces + CO"},
    "heptane": {"es": "CO + Hidrocarburos no quemados", "en": "CO + unburned hydrocarbons"},
    "default": {"es": "CO (moderado)", "en": "CO (moderate)"},
}


# ---------------------------------------------------------------------------
# Kalman telemetry scenarios and diagnostics
# ---------------------------------------------------------------------------
KALMAN = {
    "es": {
        "scenarios": {
            "iss": {
                "name": "ISS / Módulo Orbital",
                "description": "Microgravedad total (0g). Combustión difusiva pura sin ascensión térmica.",
            },
            "lunar": {
                "name": "Base Lunar Presurizada (Artemis)",
                "description": "Gravedad lunar reducida (0.166g). Convección parcial y riesgo por polvo de regolito.",
            },
            "rover": {
                "name": "Rover Lunar Presurizado",
                "description": "Volumen hiperconfinado (42 m³). Rápida saturación tóxica de monóxido de carbono.",
            },
        },
        "levels": {
            "critical": "CRÍTICO",
            "alert": "ALERTA",
            "caution": "PRECAUCIÓN",
            "nominal": "NOMINAL",
        },
        "titles": {
            "critical": "NIVEL ROJO // EVACUACIÓN INMEDIATA",
            "alert": "NIVEL NARANJA // ALERTA TÓXICA",
            "caution": "NIVEL AMARILLO // PRECAUCIÓN",
            "nominal": "NIVEL VERDE // PARÁMETROS NOMINALES",
        },
        "messages": {
            "critical": "Toxicidad letal inminente por CO en {scenario}.",
            "alert": "Acumulación sostenida de monóxido de carbono detectada en {scenario}.",
            "caution": "Elevación anómala en la tasa de oxidación de materiales de cabina.",
            "nominal": "Atmósfera estable y balance de gases dentro del estándar NASA.",
        },
        "actions": {
            "critical": [
                "Ponerse máscaras de respiración autónoma (O2 al 100%)",
                "Aislar compuertas herméticas del módulo afectado",
                "Activar supresión por dilución de gas inerte N2",
                "Iniciar despresurización de emergencia / evacuación a nave de retorno",
            ],
            "alert": [
                "Aumentar extracción forzada del sistema ECLSS",
                "Verificar sensores redundantes en esclusa",
                "Detener experimentos de combustión activos",
            ],
            "caution": [
                "Aumentar frecuencia de muestreo del filtro Kalman a 10 Hz",
                "Inspeccionar visualmente panel de potencia y racks de aviónica",
            ],
            "nominal": ["Mantener ciclo estándar de reciclaje de aire ECLSS"],
        },
        "times": {
            "critical_short": "< 3 min",
            "critical_long": "< 7 min",
            "alert_short": "8–12 min",
            "alert_long": "15–25 min",
            "caution": "60+ min",
            "nominal": "Estable",
        },
    },
    "en": {
        "scenarios": {
            "iss": {
                "name": "ISS / Orbital Module",
                "description": "Total microgravity (0g). Pure diffusive combustion with no thermal rise.",
            },
            "lunar": {
                "name": "Pressurized Lunar Base (Artemis)",
                "description": "Reduced lunar gravity (0.166g). Partial convection and regolith dust hazard.",
            },
            "rover": {
                "name": "Pressurized Lunar Rover",
                "description": "Hyper-confined volume (42 m³). Rapid toxic carbon monoxide saturation.",
            },
        },
        "levels": {
            "critical": "CRITICAL",
            "alert": "ALERT",
            "caution": "CAUTION",
            "nominal": "NOMINAL",
        },
        "titles": {
            "critical": "RED LEVEL // IMMEDIATE EVACUATION",
            "alert": "ORANGE LEVEL // TOXIC ALERT",
            "caution": "YELLOW LEVEL // CAUTION",
            "nominal": "GREEN LEVEL // NOMINAL PARAMETERS",
        },
        "messages": {
            "critical": "Imminent lethal CO toxicity in {scenario}.",
            "alert": "Sustained carbon monoxide accumulation detected in {scenario}.",
            "caution": "Anomalous increase in cabin material oxidation rate.",
            "nominal": "Stable atmosphere and gas balance within NASA standards.",
        },
        "actions": {
            "critical": [
                "Put on self-contained breathing masks (100% O2)",
                "Isolate the affected module's pressure hatches",
                "Activate inert N2 dilution suppression",
                "Begin emergency depressurization / evacuation to the return vehicle",
            ],
            "alert": [
                "Increase forced extraction from the ECLSS system",
                "Verify redundant sensors in the airlock",
                "Stop active combustion experiments",
            ],
            "caution": [
                "Increase Kalman filter sampling rate to 10 Hz",
                "Visually inspect the power panel and avionics racks",
            ],
            "nominal": ["Maintain the standard ECLSS air recycling cycle"],
        },
        "times": {
            "critical_short": "< 3 min",
            "critical_long": "< 7 min",
            "alert_short": "8–12 min",
            "alert_long": "15–25 min",
            "caution": "60+ min",
            "nominal": "Stable",
        },
    },
}


# ---------------------------------------------------------------------------
# NASA FIRMS bridge
# ---------------------------------------------------------------------------
FIRMS = {
    "es": {
        "title": "NASA Fire Intelligence: Earth-to-Space Bridge",
        "key_metric_planetary": "Fire Radiative Power (FRP en MegaWatts)",
        "sampling_grid": "Equal-Area EPSG:6933 (Celdas 10 km y 20 km)",
        "key_metric_spacecraft": "Tasa de propagación (mm/s) & Potencia Radiativa Esférica (kW/m²)",
        "sensor_challenge": "Aglomeración de hollín (estudio SAME) y fuegos fríos invisibles (ACME)",
        "extinction_paradigm": "Corte de ventilación forzada (< 1.2 cm/s) + Dilución inerte N2/CO2",
        "takeaway": (
            "Mientras que en la Tierra el penacho térmico convectivo asciende y es detectado por satélites "
            "por su emisión de radiación infrarroja (FRP), en el espacio la ausencia de flotabilidad atrapa los "
            "productos de combustión en una capa límite difusiva, requiriendo espectroscopía de absorción láser "
            "y filtros de Kalman en lugar de sensores ópticos estándar."
        ),
        "hazard_critical": "Crítico: Elevada emisión radiativa superficial sin penacho de escape",
        "hazard_moderate": "Moderado / Manejable por ECLSS",
        "firms_equivalent": "{value} MW (Equivalente FIRMS)",
    },
    "en": {
        "title": "NASA Fire Intelligence: Earth-to-Space Bridge",
        "key_metric_planetary": "Fire Radiative Power (FRP in MegaWatts)",
        "sampling_grid": "Equal-Area EPSG:6933 (10 km and 20 km cells)",
        "key_metric_spacecraft": "Spread rate (mm/s) & Spherical Radiative Power (kW/m²)",
        "sensor_challenge": "Soot agglomeration (SAME study) and invisible cool flames (ACME)",
        "extinction_paradigm": "Forced ventilation cutoff (< 1.2 cm/s) + inert N2/CO2 dilution",
        "takeaway": (
            "While on Earth the convective thermal plume rises and is detected by satellites through its "
            "infrared radiation emission (FRP), in space the absence of buoyancy traps combustion products "
            "in a diffusive boundary layer, requiring laser absorption spectroscopy and Kalman filters "
            "instead of standard optical sensors."
        ),
        "hazard_critical": "Critical: High surface radiative emission without an escape plume",
        "hazard_moderate": "Moderate / Manageable by ECLSS",
        "firms_equivalent": "{value} MW (FIRMS equivalent)",
    },
}
