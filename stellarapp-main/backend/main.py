import os
import json
import time
import httpx
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from ai_service import CombustionAIService
from physics_engine import engine, SCENARIOS
from firms_service import firms_bridge
import telegram_service

load_dotenv()

app = FastAPI(
    title="NASA StellarApp - Microgravity Fire Safety & Combustion Intelligence API",
    description="Backend API interpreting NASA microgravity flame experiments (Saffire, BASS, FLEX) with AI assistance.",
    version="1.0.0"
)

# CORS configuration for Frontend (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "nasa_combustion_data.json"
PSI_DB_PATH = Path(__file__).parent / "data" / "database.json"
if not PSI_DB_PATH.exists():
    PSI_DB_PATH = Path(__file__).parent.parent / "database.json"

PSI_FULL_DB_PATH = Path(__file__).parent / "data" / "nasa_psi_database.json"
if not PSI_FULL_DB_PATH.exists():
    PSI_FULL_DB_PATH = Path(__file__).parent.parent / "nasa_psi_database.json"

ai_service = CombustionAIService(str(DATA_PATH))

def load_data() -> List[Dict[str, Any]]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def load_psi_database() -> Dict[str, Any]:
    try:
        with open(PSI_DB_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error cargando base de datos PSI-159: {e}")
        return {}

def load_psi_full_database() -> Dict[str, Any]:
    try:
        with open(PSI_FULL_DB_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error cargando base de datos completa NASA PSI: {e}")
        return {"metadata": {}, "tables": {}}

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000, description="Consulta del astronauta o ingeniero")

class SimulationRequest(BaseModel):
    material: str = Field(default="PMMA", max_length=100)
    gravity_g: float = Field(default=0.0001, ge=0.0, le=10.0, description="Nivel de gravedad (g)")
    oxygen_concentration_pct: float = Field(default=21.0, ge=0.0, le=100.0, description="Concentración de O2 (%)")
    pressure_kpa: float = Field(default=101.3, ge=0.1, le=500.0, description="Presión atmosférica (kPa)")
    air_flow_velocity_cms: float = Field(default=5.0, ge=0.0, le=200.0, description="Flujo de aire forzado (cm/s)")

class MaterialEvalRequest(BaseModel):
    material: str = Field(default="Nomex", max_length=100)
    oxygen_pct: float = Field(default=21.0, ge=0.0, le=100.0)
    gravity_g: float = Field(default=0.0001, ge=0.0, le=10.0)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "NASA Microgravity Fire Safety Intelligence Engine",
        "team": "StellarApp",
        "challenge": "NASA Space Apps Challenge 2026",
        "endpoints": ["/api/experiments", "/api/metrics", "/api/comparison", "/api/ai/ask", "/api/ai/simulate", "/health"]
    }

@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "stellarapp-backend",
        "version": "1.0.0",
        "database_connected": bool(load_psi_database()),
        "dataset_loaded": len(load_data()) > 0
    }

@app.get("/api/metrics")
def get_metrics():
    data = load_data()
    total_experiments = len(data)
    materials = list(set(d["material"] for d in data))
    cool_flame_cases = len([d for d in data if d.get("cool_flame_observed")])
    max_spread = max(d.get("flame_spread_rate_mms", 0.0) for d in data)
    critical_risks = len([d for d in data if d.get("safety_risk_level") in ["Critical", "Extreme"]])

    return {
        "total_experiments": total_experiments,
        "unique_materials_count": len(materials),
        "materials": materials,
        "cool_flame_detections": cool_flame_cases,
        "max_flame_spread_rate_mms": max_spread,
        "critical_risk_count": critical_risks,
        "missions_covered": list(set(d["mission"] for d in data))
    }

@app.get("/api/experiments")
def get_experiments(
    material: Optional[str] = Query(None, description="Filtro por material"),
    environment: Optional[str] = Query(None, description="Filtro por entorno (0g, 1g, Lunar, Marte)"),
    risk: Optional[str] = Query(None, description="Filtro por nivel de riesgo"),
    search: Optional[str] = Query(None, description="Búsqueda libre")
):
    items = load_data()

    if material:
        items = [i for i in items if material.lower() in i["material"].lower()]
    if environment:
        items = [i for i in items if environment.lower() in i["environment"].lower()]
    if risk:
        items = [i for i in items if risk.lower() in i["safety_risk_level"].lower()]
    if search:
        s = search.lower()
        items = [
            i for i in items
            if s in i["material"].lower()
            or s in i["mission"].lower()
            or s in i["spacecraft_implication"].lower()
            or s in i["flame_shape"].lower()
        ]

    return items

@app.get("/api/experiments/{exp_id}")
def get_experiment_detail(exp_id: str):
    data = load_data()
    for item in data:
        if item["id"].lower() == exp_id.lower():
            return item
    raise HTTPException(status_code=404, detail="Experimento no encontrado")

@app.get("/api/comparison")
def get_gravity_comparison(material: str = "PMMA"):
    data = load_data()
    matches = [d for d in data if material.lower() in d["material"].lower()]
    return {
        "target_material": material,
        "comparison_data": matches
    }

@app.post("/api/ai/ask")
async def ask_ai(req: QueryRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="La consulta no puede estar vacía")
    result = await ai_service.ask_safety_assistant(req.query)
    return result

@app.post("/api/ai/simulate")
async def simulate_risk(req: SimulationRequest):
    result = await ai_service.simulate_combustion(req.model_dump())
    frp_data = firms_bridge.compute_frp_radiation(
        req.material,
        result.get("estimated_flame_spread_mms", 1.0),
        req.oxygen_concentration_pct,
        req.gravity_g
    )
    result["frp_radiation_analysis"] = frp_data
    return result

class FrpRequest(BaseModel):
    material: str = Field(default="PMMA", max_length=100)
    spread_rate_mms: float = Field(default=1.45, ge=0.0, le=100.0)
    oxygen_concentration_pct: float = Field(default=21.0, ge=0.0, le=100.0)
    gravity_g: float = Field(default=0.0001, ge=0.0, le=10.0)

@app.get("/api/firms/summary")
def get_firms_summary():
    return firms_bridge.get_firms_summary()

@app.post("/api/firms/frp")
def calculate_frp(req: FrpRequest):
    return firms_bridge.compute_frp_radiation(
        req.material,
        req.spread_rate_mms,
        req.oxygen_concentration_pct,
        req.gravity_g
    )

class KalmanRequest(BaseModel):
    scenario_id: str = Field(default="iss", max_length=50)
    o2_pct: float = Field(default=21.0, ge=0.0, le=100.0)
    broadcast_to_telegram: Optional[bool] = Field(default=False)

class TelegramBroadcastRequest(BaseModel):
    title: str = Field(..., max_length=150)
    message: str = Field(..., max_length=1000)
    severity: str = Field(default="CRITICAL", max_length=20)
    details: Optional[Dict[str, Any]] = None

class HardwareTelemetryRequest(BaseModel):
    device: str = Field(default="Raspberry Pi Pico W", max_length=80)
    chip_temp_c: float = 25.0
    o2_raw: float = 21.0
    o2_kalman: float = 21.0
    co_ppm: float = 25.0
    k_gain: float = 0.167
    status: str = Field(default="NOMINAL", max_length=60)
    scenario_id: str = Field(default="rover", max_length=50)
    broadcast_to_telegram: Optional[bool] = False

_latest_hardware: Dict[str, Any] = {
    "active": False,
    "device": "Raspberry Pi Pico W",
    "chip_temp_c": 0.0,
    "o2_raw": 21.0,
    "o2_kalman": 21.0,
    "co_ppm": 0.0,
    "k_gain": 0.167,
    "status": "OFFLINE",
    "scenario_id": "rover",
    "last_seen": 0.0
}

@app.get("/api/scenarios")
def get_scenarios():
    return [s.to_dict() for s in SCENARIOS.values()]

# --- NASA Physical Sciences Informatics (PSI) Full Database Endpoints ---
@app.get("/api/psi/overview")
def get_psi_overview():
    """
    Retorna resumen general del repositorio oficial Physical Sciences Informatics (PSI) de la NASA:
    total de estudios, documentos, parámetros experimentales y publicaciones científicas.
    """
    db = load_psi_full_database()
    tables = db.get("tables", {})
    studies = tables.get("studies", [])
    combustion_studies = [s for s in studies if "combustion" in s.get("category", "").lower() or "flame" in s.get("category", "").lower()]
    return {
        "metadata": db.get("metadata", {}),
        "total_studies": len(studies),
        "total_experimental_parameters": len(tables.get("experimental_parameters", [])),
        "total_documents": len(tables.get("documents", [])),
        "total_contacts": len(tables.get("contacts", [])),
        "total_publications": len(tables.get("publications", [])),
        "combustion_studies_count": len(combustion_studies),
        "combustion_studies": combustion_studies
    }

@app.get("/api/psi/studies")
def get_psi_studies(
    category: Optional[str] = Query(None, description="Filtro por categoría (Combustion, Heat Transfer, Materials)"),
    search: Optional[str] = Query(None, description="Búsqueda por texto libre")
):
    """
    Retorna la lista de estudios de la base de datos NASA PSI con sus parámetros y documentos asociados.
    """
    db = load_psi_full_database()
    tables = db.get("tables", {})
    studies = tables.get("studies", [])
    params = tables.get("experimental_parameters", [])
    docs = tables.get("documents", [])
    contacts = tables.get("contacts", [])

    results = []
    for s in studies:
        psi_id = s.get("psi_id", "")
        if category and category.lower() not in s.get("category", "").lower():
            continue
        if search:
            query = search.lower()
            match_title = query in s.get("title", "").lower()
            match_desc = query in s.get("description", "").lower()
            match_id = query in psi_id.lower()
            if not (match_title or match_desc or match_id):
                continue

        study_params = [p for p in params if p.get("psi_id") == psi_id]
        study_docs = [d for d in docs if d.get("psi_id") == psi_id]
        study_contacts = [c for c in contacts if c.get("psi_id") == psi_id]
        results.append({
            **s,
            "parameters": study_params,
            "documents_count": len(study_docs),
            "documents": study_docs,
            "contacts": study_contacts
        })
    return results

@app.get("/api/psi/studies/{psi_id}")
def get_psi_study_detail(psi_id: str):
    """
    Retorna el detalle completo de un estudio específico de NASA PSI (ej. PSI-159, PSI-60, PSI-62).
    """
    db = load_psi_full_database()
    tables = db.get("tables", {})
    studies = tables.get("studies", [])
    target = None
    for s in studies:
        if s.get("psi_id", "").lower() == psi_id.lower():
            target = s
            break
    if not target:
        raise HTTPException(status_code=404, detail=f"Estudio {psi_id} no encontrado en NASA PSI")

    p_id = target.get("psi_id")
    params = [p for p in tables.get("experimental_parameters", []) if p.get("psi_id") == p_id]
    docs = [d for d in tables.get("documents", []) if d.get("psi_id") == p_id]
    contacts = [c for c in tables.get("contacts", []) if c.get("psi_id") == p_id]
    pubs = [pb for pb in tables.get("publications", []) if pb.get("psi_id") == p_id]
    raw = [r for r in tables.get("raw_data", []) if r.get("psi_id") == p_id]

    return {
        "study": target,
        "parameters": params,
        "documents": docs,
        "contacts": contacts,
        "publications": pubs,
        "raw_data_manifest": raw
    }

@app.get("/api/psi/parameters")
def get_psi_parameters(psi_id: Optional[str] = Query(None, description="Filtro por ID de estudio PSI")):
    """
    Retorna la lista de parámetros físicos experimentales validados por la NASA.
    """
    db = load_psi_full_database()
    params = db.get("tables", {}).get("experimental_parameters", [])
    if psi_id:
        params = [p for p in params if p.get("psi_id", "").lower() == psi_id.lower()]
    return params

@app.get("/api/psi/publications")
def get_psi_publications():
    """
    Retorna publicaciones científicas asociadas a los estudios NASA PSI.
    """
    db = load_psi_full_database()
    return db.get("tables", {}).get("publications", [])

# --- NASA PSI-159 & Microgravity Combustion Standards ---
@app.get("/api/psi159/database")
def get_psi159_database():
    """Retorna la base de datos completa de parámetros y sensores PSI-159 / ISS."""
    return load_psi_database()

@app.get("/api/psi159/materials")
def get_psi159_materials():
    """Retorna los materiales aeroespaciales caracterizados por LOI y toxicidad de gases."""
    db = load_psi_database()
    return db.get("materiales", [])

@app.post("/api/psi159/recommend")
def evaluate_material_flammability(req: MaterialEvalRequest):
    """
    Evalúa la compatibilidad de un material frente a la atmósfera de la nave (LOI vs O2)
    según la regla de oro de la NASA: Si O2 >= LOI, la combustión se auto-sostiene.
    """
    db = load_psi_database()
    materials = db.get("materiales", [])
    
    # Buscar material por id o coincidencia en nombre
    target = None
    query = req.material.lower().strip()
    for m in materials:
        if m.get("id", "").lower() == query or query in m.get("nombre", "").lower():
            target = m
            break
            
    if not target:
        # Fallbacks conocidos de NASA STD-6001
        defaults = {
            "pmma": {"id": "pmma", "nombre": "PMMA", "loi": 17.3, "toxicidad": "CO + CO2 (alto)", "notas": "Acrílico estructural"},
            "cotton": {"id": "cotton", "nombre": "Algodón", "loi": 16.5, "toxicidad": "CO (moderado)", "notas": "NASA Standard Test 1"},
            "etfe": {"id": "etfe", "nombre": "ETFE", "loi": 25.0, "toxicidad": "HF trazas + CO", "notas": "Aislante cableado"}
        }
        target = defaults.get(query, {"id": query, "nombre": req.material, "loi": 21.0, "toxicidad": "CO (medio)", "notas": "Material no clasificado"})

    loi = float(target.get("loi", 21.0))
    margin = round(loi - req.oxygen_pct, 2)
    is_safe = req.oxygen_pct < loi
    
    # Alternativas seguras si el material es vulnerable
    safer = []
    if not is_safe:
        for m in materials:
            if float(m.get("loi", 0)) > req.oxygen_pct:
                safer.append({
                    "id": m.get("id"),
                    "nombre": m.get("nombre"),
                    "loi": m.get("loi"),
                    "toxicidad": m.get("toxicidad"),
                    "seguridad_margin": round(float(m.get("loi", 0)) - req.oxygen_pct, 1)
                })

    psi_stats = db.get("datos_psi159", {}).get("sensores", {}).get("estadisticas_muestra", {})

    return {
        "material_evaluado": target,
        "oxygen_concentration_pct": req.oxygen_pct,
        "loi_limit_pct": loi,
        "safety_margin_pct": margin,
        "is_safe": is_safe,
        "combustion_state": "Auto-extinguible / Pasivo" if is_safe else "Ignición y propagación sostenida",
        "toxic_hazard": target.get("toxicidad", "CO"),
        "safer_alternatives": safer,
        "sensor_calibration": {
            "fuente": db.get("metadata", {}).get("fuente_principal", "NASA PSI-159"),
            "ion_current_mean": psi_stats.get("IonCurrent", {}).get("media", -0.8885),
            "pmt1_mean_v": psi_stats.get("PMT1", {}).get("media", 4.4225),
            "mfc_max_voltage": db.get("constantes_codigo", {}).get("mfcMaxVoltage", 4.92)
        }
    }

@app.post("/api/telemetry/kalman")
async def get_kalman_telemetry(req: KalmanRequest):
    result = engine.compute_telemetry(req.scenario_id, req.o2_pct)
    if req.broadcast_to_telegram:
        await telegram_service.broadcast_alert(
            title=f"Telemetría en Vivo: {result['scenario']['name']}",
            message=f"Alerta: {result['alert_title']}\nDiagnóstico: {result['diagnosis']}",
            severity="CRITICAL" if result["safety_level"] == "CRÍTICO" else "WARNING",
            details={
                "Oxígeno": f"{result['o2_percentage']}%",
                "CO Crudo": f"{result['raw_co_ppm']} ppm",
                "CO Filtrado (Kalman)": f"{result['filtered_co_ppm']} ppm",
                "Ganancia Kalman": f"{result['kalman_gain']}",
                "Evacuación Límite": result["critical_evac_time"]
            }
        )
    return result

@app.post("/api/telemetry/hardware")
async def post_hardware_telemetry(req: HardwareTelemetryRequest):
    global _latest_hardware
    now = time.time()
    _latest_hardware = {
        "active": True,
        "device": req.device,
        "chip_temp_c": req.chip_temp_c,
        "o2_raw": req.o2_raw,
        "o2_kalman": req.o2_kalman,
        "co_ppm": req.co_ppm,
        "k_gain": req.k_gain,
        "status": req.status,
        "scenario_id": req.scenario_id,
        "last_seen": now
    }
    result = engine.compute_telemetry(req.scenario_id, req.o2_kalman)
    result["hardware"] = {
        "device": req.device,
        "chip_temp_c": req.chip_temp_c,
        "live": True,
        "last_seen": now
    }
    if req.broadcast_to_telegram:
        await telegram_service.broadcast_alert(
            title=f"🚨 ALERTA HARDWARE // {req.device}",
            message=f"Estado Sensor: {req.status}\nDiagnóstico: {result['diagnosis']}",
            severity="CRITICAL" if result["safety_level"] == "CRÍTICO" else "WARNING",
            details={
                "Temp Chip": f"{req.chip_temp_c} °C",
                "O₂ Kalman": f"{req.o2_kalman} %",
                "CO Sensor": f"{req.co_ppm} ppm",
                "Ganancia K": f"{req.k_gain}",
                "Evacuación": result["critical_evac_time"]
            }
        )
    return result

@app.get("/api/telemetry/hardware")
def get_hardware_telemetry():
    now = time.time()
    last_seen = _latest_hardware.get("last_seen", 0.0)
    is_live = (now - last_seen) < 30.0
    return {
        **_latest_hardware,
        "is_live": is_live,
        "seconds_ago": round(now - last_seen, 1) if last_seen > 0 else None
    }

@app.get("/api/analytics/charts")
def get_analytics_charts():
    """
    Returns pre-computed scientific chart series for microgravity fire safety dashboard.
    """
    # 1. Flame spread rate vs O2 concentration across gravities
    o2_levels = [16.0, 18.0, 20.0, 21.0, 23.0, 26.0, 28.0, 32.0, 36.0]
    flame_spread_vs_o2 = []
    for o2 in o2_levels:
        # Physical modeling:
        # Microgravity 0g with Cygnus ventilation (15 cm/s): steady flame anchoring
        spread_0g = round(max(0.0, (o2 - 15.5) * 0.165), 2)
        spread_lunar = round(max(0.0, (o2 - 16.0) * 0.145), 2)
        spread_mars = round(max(0.0, (o2 - 16.5) * 0.13), 2)
        spread_1g = round(max(0.0, (o2 - 17.0) * 0.11), 2)
        flame_spread_vs_o2.append({
            "o2_pct": o2,
            "microgravity_0g": spread_0g,
            "lunar_016g": spread_lunar,
            "mars_038g": spread_mars,
            "earth_1g": spread_1g,
            "artemis_baseline": 26.0
        })

    # 2. Materials FRP and thermal radiative flux comparison
    materials_radiation = [
        {"material": "PMMA (Acrílico)", "frp_kw": 18.4, "flux_kw_m2": 24.2, "loi_pct": 17.3, "risk": "Extremo"},
        {"material": "SIBL Algodón/Vidrio", "frp_kw": 12.8, "flux_kw_m2": 16.5, "loi_pct": 16.5, "risk": "Crítico"},
        {"material": "Silicona RTV", "frp_kw": 7.2, "flux_kw_m2": 9.4, "loi_pct": 22.0, "risk": "Moderado"},
        {"material": "ETFE Cableado", "frp_kw": 4.1, "flux_kw_m2": 5.8, "loi_pct": 25.0, "risk": "Moderado"},
        {"material": "Kapton Película", "frp_kw": 2.6, "flux_kw_m2": 3.7, "loi_pct": 27.5, "risk": "Bajo"},
        {"material": "Nomex Textil", "frp_kw": 0.8, "flux_kw_m2": 1.2, "loi_pct": 28.5, "risk": "Auto-extinguible"}
    ]

    # 3. Aerosol Soot Particle Size Distribution (SAME Experiment vs 1g Earth)
    soot_distribution = [
        {"size_um": "0.05", "earth_1g": 42.0, "microgravity_0g": 4.5},
        {"size_um": "0.10", "earth_1g": 34.0, "microgravity_0g": 9.2},
        {"size_um": "0.25", "earth_1g": 14.5, "microgravity_0g": 18.0},
        {"size_um": "0.50", "earth_1g": 6.2, "microgravity_0g": 26.5},
        {"size_um": "1.00", "earth_1g": 2.1, "microgravity_0g": 22.4},
        {"size_um": "2.50", "earth_1g": 0.9, "microgravity_0g": 12.8},
        {"size_um": "5.00+", "earth_1g": 0.3, "microgravity_0g": 6.6}
    ]

    # 4. Flammability Matrix: LOI vs Quenching Distance
    flammability_envelope = [
        {"name": "SIBL (Algodón)", "loi": 16.5, "quenching_mm": 6.8, "safe": False},
        {"name": "PMMA", "loi": 17.3, "quenching_mm": 5.2, "safe": False},
        {"name": "Silicona", "loi": 22.0, "quenching_mm": 8.5, "safe": False},
        {"name": "ETFE", "loi": 25.0, "quenching_mm": 9.8, "safe": False},
        {"name": "Kapton", "loi": 27.5, "quenching_mm": 11.2, "safe": True},
        {"name": "Nomex", "loi": 28.5, "quenching_mm": 12.4, "safe": True}
    ]

    # 5. Thermal Limits & Survivability (NASA-STD-3001 vs. NASA-SP-20205001358)
    thermal_tolerance_bands = [
        {"entity": "Confort Tripulante", "max_temp_c": 26.7, "ref_threshold": "NASA-STD-3001 Nom.", "category": "Humano", "color": "#76b900"},
        {"entity": "Supervivencia Humana", "max_temp_c": 45.0, "ref_threshold": "Evacuación Obligatoria", "category": "Humano", "color": "#df6500"},
        {"entity": "Dolor Cutáneo / Quemadura", "max_temp_c": 50.0, "ref_threshold": "Daño Tisular", "category": "Humano", "color": "#ef4444"},
        {"entity": "Aviónica Cold Plates", "max_temp_c": 55.0, "ref_threshold": "Límite Enfriamiento", "category": "Nave", "color": "#00b0ff"},
        {"entity": "Casco Al-Li (Fluencia)", "max_temp_c": 150.0, "ref_threshold": "-40% Resistencia Tracción", "category": "Nave", "color": "#e040fb"},
        {"entity": "Sellos Viton O-Ring", "max_temp_c": 180.0, "ref_threshold": "Despresurización", "category": "Nave", "color": "#f59e0b"},
        {"entity": "Fuego Saffire (0g Pico)", "max_temp_c": 1147.0, "ref_threshold": "Llama Cygnus 1420K", "category": "Fuego", "color": "#ff0055"}
    ]

    # 6. Thermal Excursion Timeline during Cabin Fire (0 to 180s)
    thermal_excursion_timeline = [
        {"time_s": 0, "cabin_air_c": 21.0, "skin_absorbed_c": 34.0, "hull_temp_c": 20.0, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 15, "cabin_air_c": 24.5, "skin_absorbed_c": 34.8, "hull_temp_c": 21.2, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 30, "cabin_air_c": 33.0, "skin_absorbed_c": 37.5, "hull_temp_c": 24.0, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 45, "cabin_air_c": 44.8, "skin_absorbed_c": 42.1, "hull_temp_c": 29.5, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 60, "cabin_air_c": 59.2, "skin_absorbed_c": 48.0, "hull_temp_c": 38.0, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 75, "cabin_air_c": 78.5, "skin_absorbed_c": 56.4, "hull_temp_c": 51.2, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 90, "cabin_air_c": 102.0, "skin_absorbed_c": 66.8, "hull_temp_c": 68.5, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 105, "cabin_air_c": 128.4, "skin_absorbed_c": 79.0, "hull_temp_c": 92.0, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 120, "cabin_air_c": 154.0, "skin_absorbed_c": 92.5, "hull_temp_c": 122.5, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 150, "cabin_air_c": 192.5, "skin_absorbed_c": 110.0, "hull_temp_c": 168.0, "limit_human": 45.0, "limit_hull": 150.0},
        {"time_s": 180, "cabin_air_c": 220.0, "skin_absorbed_c": 125.0, "hull_temp_c": 195.0, "limit_human": 45.0, "limit_hull": 150.0}
    ]

    return {
        "flame_spread_vs_o2": flame_spread_vs_o2,
        "materials_radiation": materials_radiation,
        "soot_distribution": soot_distribution,
        "flammability_envelope": flammability_envelope,
        "thermal_tolerance_bands": thermal_tolerance_bands,
        "thermal_excursion_timeline": thermal_excursion_timeline
    }

@app.get("/api/thermal-limits")
def get_thermal_limits():
    """
    Returns NASA-STD-3001 (Human Tolerance) and NASA-SP-20205001358 (Spacecraft Hull Integrity) limits
    along with dynamic 180s cabin fire thermal excursion timeline.
    """
    charts = get_analytics_charts()
    return {
        "thermal_tolerance_bands": charts["thermal_tolerance_bands"],
        "thermal_excursion_timeline": charts["thermal_excursion_timeline"],
        "standards_referenced": ["NASA-STD-3001 Vol 2 Rev B", "NASA-SP-20205001358", "NASA-STD-6001B"],
        "human_critical_temp_c": 45.0,
        "hull_yield_temp_c": 150.0
    }

@app.get("/api/iss/live")
async def get_iss_telemetry():
    url = "https://api.wheretheiss.at/v1/satellites/25544"
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                d = resp.json()
                return {
                    "latitude": round(float(d["latitude"]), 2),
                    "longitude": round(float(d["longitude"]), 2),
                    "altitude_km": round(float(d["altitude"]), 1),
                    "velocity_kmh": round(float(d["velocity"]), 1),
                    "visibility": d.get("visibility", "daylight"),
                    "is_live": True
                }
    except Exception:
        pass
    return {
        "latitude": 51.64,
        "longitude": 12.45,
        "altitude_km": 420.5,
        "velocity_kmh": 27580.0,
        "visibility": "daylight",
        "is_live": False
    }

# ==========================================
# TELEGRAM BOT & AUDIENCE ALERT ENDPOINTS
# ==========================================

@app.get("/api/telegram/status")
async def get_telegram_status():
    """
    Retorna el estado de conexión del bot de Telegram, cantidad de suscriptores del auditorio y estado del webhook.
    """
    subs = telegram_service.get_subscribers()
    wh_info = await telegram_service.get_webhook_info()
    return {
        "bot_username": "Stellar_App_bot",
        "bot_link": "https://t.me/Stellar_App_bot",
        "subscribers_count": len(subs),
        "subscribers": subs,
        "webhook_info": wh_info.get("result", wh_info)
    }

@app.post("/api/telegram/webhook")
async def telegram_webhook(update: Dict[str, Any]):
    """
    Punto de entrada para actualizaciones enviadas por Telegram Webhook.
    Procesa /start, /telemetria, callbacks de botones y mensajes de la audiencia.
    """
    return await telegram_service.handle_update(update)

@app.post("/api/telegram/broadcast")
async def broadcast_to_telegram(req: TelegramBroadcastRequest):
    """
    Emite una alerta de emergencia en vivo a todos los teléfonos del auditorio conectados al bot.
    """
    sent = await telegram_service.broadcast_alert(
        title=req.title,
        message=req.message,
        severity=req.severity,
        details=req.details
    )
    return {
        "status": "success",
        "recipients_sent": sent,
        "total_subscribers": len(telegram_service.get_subscribers())
    }

@app.post("/api/telegram/set-webhook")
async def set_telegram_webhook(url: Optional[str] = None):
    """
    Configura el webhook de Telegram hacia la URL de producción de StellarApp.
    """
    target_url = url or "https://stellarapp.nerosystem.solutions/api/telegram/webhook"
    res = await telegram_service.set_webhook(target_url)
    return {
        "webhook_url": target_url,
        "telegram_response": res
    }


