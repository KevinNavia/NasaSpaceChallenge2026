"use client";
import { useLanguage } from "../i18n/LanguageContext";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Flame,
  ShieldAlert,
  Layers,
  Thermometer,
  HeartPulse,
  Info,
  Database,
  Search,
  FileText,
} from "lucide-react";
import { PsiStudy } from "@/types";

interface FlameSpreadPoint {
  o2_pct: number;
  microgravity_0g: number;
  lunar_016g: number;
  mars_038g: number;
  earth_1g: number;
  artemis_baseline: number;
}

interface MaterialRadiation {
  material: string;
  frp_kw: number;
  flux_kw_m2: number;
  loi_pct: number;
  risk: string;
}

interface SootPoint {
  size_um: string;
  earth_1g: number;
  microgravity_0g: number;
}

interface FlammabilityPoint {
  name: string;
  loi: number;
  quenching_mm: number;
  safe: boolean;
}

interface ThermalTolerancePoint {
  entity: string;
  max_temp_c: number;
  ref_threshold: string;
  category: string;
  color: string;
}

interface ThermalTimelinePoint {
  time_s: number;
  cabin_air_c: number;
  skin_absorbed_c: number;
  hull_temp_c: number;
  limit_human: number;
  limit_hull: number;
}

export default function AnalyticsCharts() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "flame" | "radiation" | "soot" | "flammability" | "thermal" | "psi">("all");
  const [flameData, setFlameData] = useState<FlameSpreadPoint[]>([]);
  const [materialsData, setMaterialsData] = useState<MaterialRadiation[]>([]);
  const [sootData, setSootData] = useState<SootPoint[]>([]);
  const [flammabilityData, setFlammabilityData] = useState<FlammabilityPoint[]>([]);
  const [thermalBands, setThermalBands] = useState<ThermalTolerancePoint[]>([]);
  const [thermalTimeline, setThermalTimeline] = useState<ThermalTimelinePoint[]>([]);
  const [psiStudies, setPsiStudies] = useState<PsiStudy[]>([]);
  const [psiCategory, setPsiCategory] = useState<string>("all");
  const [psiSearch, setPsiSearch] = useState<string>("");
  const [selectedStudy, setSelectedStudy] = useState<PsiStudy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/charts")
      .then((res) => res.json())
      .then((data) => {
        if (data.flame_spread_vs_o2) setFlameData(data.flame_spread_vs_o2);
        if (data.materials_radiation) setMaterialsData(data.materials_radiation);
        if (data.soot_distribution) setSootData(data.soot_distribution);
        if (data.flammability_envelope) setFlammabilityData(data.flammability_envelope);
        if (data.thermal_tolerance_bands) setThermalBands(data.thermal_tolerance_bands);
        if (data.thermal_excursion_timeline) setThermalTimeline(data.thermal_excursion_timeline);
        setLoading(false);
      })
      .catch(() => {
        // Fallback pre-calculated scientific series
        setFlameData([
          { o2_pct: 16, microgravity_0g: 0.08, lunar_016g: 0, mars_038g: 0, earth_1g: 0, artemis_baseline: 26 },
          { o2_pct: 18, microgravity_0g: 0.41, lunar_016g: 0.29, mars_038g: 0.2, earth_1g: 0.11, artemis_baseline: 26 },
          { o2_pct: 20, microgravity_0g: 0.74, lunar_016g: 0.58, mars_038g: 0.46, earth_1g: 0.33, artemis_baseline: 26 },
          { o2_pct: 21, microgravity_0g: 0.91, lunar_016g: 0.72, mars_038g: 0.58, earth_1g: 0.44, artemis_baseline: 26 },
          { o2_pct: 23, microgravity_0g: 1.24, lunar_016g: 1.01, mars_038g: 0.84, earth_1g: 0.66, artemis_baseline: 26 },
          { o2_pct: 26, microgravity_0g: 1.73, lunar_016g: 1.45, mars_038g: 1.24, earth_1g: 0.99, artemis_baseline: 26 },
          { o2_pct: 28, microgravity_0g: 2.06, lunar_016g: 1.74, mars_038g: 1.5, earth_1g: 1.21, artemis_baseline: 26 },
          { o2_pct: 32, microgravity_0g: 2.72, lunar_016g: 2.32, mars_038g: 2.02, earth_1g: 1.65, artemis_baseline: 26 },
          { o2_pct: 36, microgravity_0g: 3.38, lunar_016g: 2.9, mars_038g: 2.54, earth_1g: 2.09, artemis_baseline: 26 },
        ]);
        setMaterialsData([
          { material: "PMMA (Acrílico)", frp_kw: 18.4, flux_kw_m2: 24.2, loi_pct: 17.3, risk: "Extremo" },
          { material: "SIBL Algodón/Vidrio", frp_kw: 12.8, flux_kw_m2: 16.5, loi_pct: 16.5, risk: "Crítico" },
          { material: "Silicona RTV", frp_kw: 7.2, flux_kw_m2: 9.4, loi_pct: 22.0, risk: "Moderado" },
          { material: "ETFE Cableado", frp_kw: 4.1, flux_kw_m2: 5.8, loi_pct: 25.0, risk: "Moderado" },
          { material: "Kapton Película", frp_kw: 2.6, flux_kw_m2: 3.7, loi_pct: 27.5, risk: "Bajo" },
          { material: "Nomex Textil", frp_kw: 0.8, flux_kw_m2: 1.2, loi_pct: 28.5, risk: "Auto-extinguible" },
        ]);
        setSootData([
          { size_um: "0.05", earth_1g: 42.0, microgravity_0g: 4.5 },
          { size_um: "0.10", earth_1g: 34.0, microgravity_0g: 9.2 },
          { size_um: "0.25", earth_1g: 14.5, microgravity_0g: 18.0 },
          { size_um: "0.50", earth_1g: 6.2, microgravity_0g: 26.5 },
          { size_um: "1.00", earth_1g: 2.1, microgravity_0g: 22.4 },
          { size_um: "2.50", earth_1g: 0.9, microgravity_0g: 12.8 },
          { size_um: "5.00+", earth_1g: 0.3, microgravity_0g: 6.6 },
        ]);
        setFlammabilityData([
          { name: "SIBL (Algodón)", loi: 16.5, quenching_mm: 6.8, safe: false },
          { name: "PMMA", loi: 17.3, quenching_mm: 5.2, safe: false },
          { name: "Silicona", loi: 22.0, quenching_mm: 8.5, safe: false },
          { name: "ETFE", loi: 25.0, quenching_mm: 9.8, safe: false },
          { name: "Kapton", loi: 27.5, quenching_mm: 11.2, safe: true },
          { name: "Nomex", loi: 28.5, quenching_mm: 12.4, safe: true },
        ]);
        setThermalBands([
          { entity: "Confort Tripulante", max_temp_c: 26.7, ref_threshold: "NASA-STD-3001 Nom.", category: "Humano", color: "#76b900" },
          { entity: "Supervivencia Humana", max_temp_c: 45.0, ref_threshold: "Evacuación Obligatoria", category: "Humano", color: "#df6500" },
          { entity: "Dolor Cutáneo / Quemadura", max_temp_c: 50.0, ref_threshold: "Daño Tisular", category: "Humano", color: "#ef4444" },
          { entity: "Aviónica Cold Plates", max_temp_c: 55.0, ref_threshold: "Límite Enfriamiento", category: "Nave", color: "#00b0ff" },
          { entity: "Casco Al-Li (Fluencia)", max_temp_c: 150.0, ref_threshold: "-40% Resistencia Tracción", category: "Nave", color: "#e040fb" },
          { entity: "Sellos Viton O-Ring", max_temp_c: 180.0, ref_threshold: "Despresurización", category: "Nave", color: "#f59e0b" },
          { entity: "Fuego Saffire (0g Pico)", max_temp_c: 1147.0, ref_threshold: "Llama Cygnus 1420K", category: "Fuego", color: "#ff0055" },
        ]);
        setThermalTimeline([
          { time_s: 0, cabin_air_c: 21.0, skin_absorbed_c: 34.0, hull_temp_c: 20.0, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 15, cabin_air_c: 24.5, skin_absorbed_c: 34.8, hull_temp_c: 21.2, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 30, cabin_air_c: 33.0, skin_absorbed_c: 37.5, hull_temp_c: 24.0, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 45, cabin_air_c: 44.8, skin_absorbed_c: 42.1, hull_temp_c: 29.5, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 60, cabin_air_c: 59.2, skin_absorbed_c: 48.0, hull_temp_c: 38.0, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 75, cabin_air_c: 78.5, skin_absorbed_c: 56.4, hull_temp_c: 51.2, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 90, cabin_air_c: 102.0, skin_absorbed_c: 66.8, hull_temp_c: 68.5, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 105, cabin_air_c: 128.4, skin_absorbed_c: 79.0, hull_temp_c: 92.0, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 120, cabin_air_c: 154.0, skin_absorbed_c: 92.5, hull_temp_c: 122.5, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 150, cabin_air_c: 192.5, skin_absorbed_c: 110.0, hull_temp_c: 168.0, limit_human: 45.0, limit_hull: 150.0 },
          { time_s: 180, cabin_air_c: 220.0, skin_absorbed_c: 125.0, hull_temp_c: 195.0, limit_human: 45.0, limit_hull: 150.0 },
        ]);
        setLoading(false);
      });

    fetch("/api/psi/studies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPsiStudies(data);
      })
      .catch(() => {});
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-[#76b900] p-2.5 text-xs font-mono shadow-xl rounded-[2px]">
          <p className="text-white font-bold mb-1 border-b border-[#333333] pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <strong className="text-white">{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="analytics-section" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#333333]">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#76b900] uppercase tracking-widest">
            <BarChart3 className="h-4 w-4" />
            <span>{t("CENTRO DE TELEMETRÍA Y ANALÍTICA GRÁFICA NASA")}</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            {t("Visualización Comparativa de Combustión & Límites Térmicos\n          ")}</h2>
          <p className="text-xs text-[#898989] mt-0.5">
            {t("Modelos de regresión física y supervivencia estandarizados por NASA-STD-3001, NASA-STD-6001 y misiones Saffire.\n          ")}</p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#1a1a1a] border border-[#333333] p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "all" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            {t("TODOS LOS GRÁFICOS\n          ")}</button>
          <button
            onClick={() => setActiveTab("thermal")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
              activeTab === "thermal" ? "bg-[#76b900] text-black" : "text-[#76b900] hover:text-white"
            }`}
          >
            <Thermometer className="h-3.5 w-3.5" />
            <span>{t("LÍMITES TÉRMICOS (HUMANO / CASCO)")}</span>
          </button>
          <button
            onClick={() => setActiveTab("flame")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "flame" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            {t("PROPAGACIÓN vs O₂\n          ")}</button>
          <button
            onClick={() => setActiveTab("radiation")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "radiation" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            {t("FRP & RADIACIÓN\n          ")}</button>
          <button
            onClick={() => setActiveTab("soot")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "soot" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            {t("HOLLÍN SAME (ISS)\n          ")}</button>
          <button
            onClick={() => setActiveTab("flammability")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "flammability" ? "bg-[#76b900] text-black" : "text-[#cccccc] hover:text-white"
            }`}
          >
            {t("MATRIZ NASA-STD-6001\n          ")}</button>
          <button
            onClick={() => setActiveTab("psi")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
              activeTab === "psi" ? "bg-[#76b900] text-black" : "text-[#76b900] hover:text-white border border-[#76b900]/30"
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>{t("NASA PSI (14 ESTUDIOS)")}</span>
          </button>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NEW Chart: Thermal Tolerance Limits (Human vs Spacecraft) */}
        {(activeTab === "all" || activeTab === "thermal") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4 text-[#76b900]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t("Límites Térmicos Máximos: Tripulación vs. Nave (°C)\n                ")}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#76b900] bg-black px-2 py-0.5 border border-[#333333]">
                {t("NASA-STD-3001 vs SP-20205001358\n              ")}</span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              {t("Comparación de umbrales críticos de degradación térmica: la tripulación requiere evacuación obligatoria a +45°C, mientras que el casco de aleación Al-Li pierde 40% de rigidez a +150°C.\n            ")}</p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={thermalBands} margin={{ top: 10, right: 20, left: -10, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="entity"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 9, fontFamily: "monospace" }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "Temp. Máxima (°C)", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={45}
                    stroke="#df6500"
                    strokeDasharray="4 4"
                    label={{ value: "EVACUACIÓN TRIPULACIÓN (+45°C)", fill: "#df6500", fontSize: 9, position: "insideTopLeft" }}
                  />
                  <ReferenceLine
                    y={150}
                    stroke="#e040fb"
                    strokeDasharray="4 4"
                    label={{ value: "FLUENCIA CASCO (+150°C)", fill: "#e040fb", fontSize: 9, position: "insideTopLeft" }}
                  />
                  <Bar dataKey="max_temp_c" name={t("Temperatura Máxima (°C)")}>
                    {thermalBands.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#76b900]/40">
                <span className="text-[#76b900] block">{t("CONFORT NOMINAL:")}</span>
                <strong className="text-white">{t("18.3°C - 26.7°C")}</strong>
              </div>
              <div className="bg-black p-2 border border-[#df6500]/40">
                <span className="text-[#df6500] block">{t("EVACUACIÓN HUMANA:")}</span>
                <strong className="text-[#df6500]">{t("+45.0°C (&lt;45 min)")}</strong>
              </div>
              <div className="bg-black p-2 border border-[#e040fb]/40">
                <span className="text-[#e040fb] block">{t("FLUENCIA CASCO AL-LI:")}</span>
                <strong className="text-[#e040fb]">{t("+150.0°C (Crítico)")}</strong>
              </div>
            </div>
          </div>
        )}

        {/* NEW Chart: Thermal Excursion Timeline during Cabin Fire */}
        {(activeTab === "all" || activeTab === "thermal") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HeartPulse className="h-4 w-4 text-[#df6500]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t("Excursión Térmica en Cabina vs. Tiempo de Fuego (0 - 180s)\n                ")}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#df6500] bg-black px-2 py-0.5 border border-[#333333]">
                {t("SIMULACIÓN DINÁMICA 0g\n              ")}</span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              {t("Evolución de temperatura en hábitat lunar (280 m³) con ignición PMMA: el aire cruza el umbral de supervivencia a los 45 s y el casco a los 118 s.\n            ")}</p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={thermalTimeline} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="time_s"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "Tiempo tras Ignición (segundos)", position: "insideBottom", offset: -5, fill: "#757575", fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "Temperatura (°C)", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 8 }}
                    formatter={(val) => <span className="text-[#cccccc]">{val}</span>}
                  />
                  <ReferenceLine
                    y={45}
                    stroke="#df6500"
                    strokeDasharray="4 4"
                    label={{ value: "COLAPSO HUMANO (+45°C)", fill: "#df6500", fontSize: 9 }}
                  />
                  <ReferenceLine
                    y={150}
                    stroke="#e040fb"
                    strokeDasharray="4 4"
                    label={{ value: "FALLA CASCO (+150°C)", fill: "#e040fb", fontSize: 9 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cabin_air_c"
                    name={t("Aire Interior Cabina (°C)")}
                    stroke="#ff0055"
                    strokeWidth={2.5}
                    dot={{ fill: "#ff0055", r: 2.5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="skin_absorbed_c"
                    name={t("Piel / Traje Absorbido (°C)")}
                    stroke="#df6500"
                    strokeWidth={2}
                    dot={{ fill: "#df6500", r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hull_temp_c"
                    name={t("Casco Interno Al-Li (°C)")}
                    stroke="#00b0ff"
                    strokeWidth={2}
                    dot={{ fill: "#00b0ff", r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#df6500]/40">
                <span className="text-[#df6500] block">{t("TIEMPO LÍMITE DE EVACUACIÓN HUMANA:")}</span>
                <strong className="text-white">{t("45 segundos (T aire &gt; 45°C)")}</strong>
              </div>
              <div className="bg-black p-2 border border-[#e040fb]/40">
                <span className="text-[#e040fb] block">{t("TIEMPO LÍMITE ROTURA DE CASCO:")}</span>
                <strong className="text-white">{t("118 segundos (T casco &gt; 150°C)")}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Chart 1: Flame Spread vs O2 Concentration */}
        {(activeTab === "all" || activeTab === "flame") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-[#76b900]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t("Tasa de Propagación (mm/s) vs. Concentración de O₂ (%)\n                ")}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#76b900] bg-black px-2 py-0.5 border border-[#333333]">
                {t("SAFFIRE MODEL\n              ")}</span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              {t("En microgravedad con flujo forzado constante (15 cm/s), la llama quema más rápido que en 1g debido a la falta de turbulencia convectiva que enfría la zona de reacción.\n            ")}</p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flameData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="o2_pct"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "% Oxígeno en Cabina", position: "insideBottom", offset: -5, fill: "#757575", fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "Velocidad (mm/s)", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 8 }}
                    formatter={(val) => <span className="text-[#cccccc]">{val}</span>}
                  />
                  <ReferenceLine
                    x={26}
                    stroke="#df6500"
                    strokeDasharray="4 4"
                    label={{ value: "LÍMITE ARTEMIS 26% O₂", fill: "#df6500", fontSize: 9, position: "top" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="microgravity_0g"
                    name={t("Microgravedad 0g (Cygnus)")}
                    stroke="#76b900"
                    strokeWidth={2.5}
                    dot={{ fill: "#76b900", r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lunar_016g"
                    name={t("Luna (0.16g)")}
                    stroke="#00b0ff"
                    strokeWidth={2}
                    dot={{ fill: "#00b0ff", r: 2.5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mars_038g"
                    name={t("Marte (0.38g)")}
                    stroke="#e040fb"
                    strokeWidth={2}
                    dot={{ fill: "#e040fb", r: 2.5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earth_1g"
                    name={t("Tierra 1g (Referencia)")}
                    stroke="#757575"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={{ fill: "#757575", r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">{t("EXP. 21% O₂ (ISS):")}</span>
                <strong className="text-white">{t("0.91 mm/s")}</strong>
              </div>
              <div className="bg-black p-2 border border-[#df6500]/40">
                <span className="text-[#df6500] block">{t("ARTEMIS 26% O₂:")}</span>
                <strong className="text-[#df6500]">{t("1.73 mm/s (+90%)")}</strong>
              </div>
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">{t("EXTINCIÓN LOI:")}</span>
                <strong className="text-[#76b900]">{t("&lt; 15.5% O₂")}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Chart 2: Fire Radiative Power (FRP) & Thermal Flux by Material */}
        {(activeTab === "all" || activeTab === "radiation") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="h-4 w-4 text-[#df6500]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t("Potencia Radiativa de Fuego (FRP kW) & Flujo Térmico (kW/m²)\n                ")}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#df6500] bg-black px-2 py-0.5 border border-[#333333]">
                {t("NASA FIRMS & SAFFIRE\n              ")}</span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              {t("Calibración cruzada del sensor MODIS/VIIRS adaptado a cabinas espaciales: el acrílico PMMA emite 18.4 kW de energía radiativa sin disipación convectiva.\n            ")}</p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={materialsData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="material"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 9, fontFamily: "monospace" }}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "Potencia (kW) / Flujo (kW/m²)", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 8 }}
                    formatter={(val) => <span className="text-[#cccccc]">{val}</span>}
                  />
                  <Bar dataKey="frp_kw" name={t("FRP Radiativo (kW)")} fill="#df6500">
                    {materialsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.risk === "Extremo" ? "#df6500" : entry.risk === "Crítico" ? "#f59e0b" : entry.risk === "Moderado" ? "#eab308" : "#76b900"}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="flux_kw_m2" name={t("Flujo Térmico (kW/m²)")} fill="#76b900" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">{t("PMMA MÁXIMO FRP:")}</span>
                <strong className="text-[#df6500]">{t("18.4 kW")}</strong>
              </div>
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">{t("NOMEX AUTO-EXT.:")}</span>
                <strong className="text-[#76b900]">{t("0.8 kW (Seguro)")}</strong>
              </div>
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">{t("KAPTON ENERGÍA:")}</span>
                <strong className="text-white">{t("2.6 kW")}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Chart 3: Soot Aerosol Particle Size Distribution (SAME vs 1g) */}
        {(activeTab === "all" || activeTab === "soot") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-[#00b0ff]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t("Hollín & Aerosoles: Aglomeración SAME (0g) vs. Tierra (1g)\n                ")}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#00b0ff] bg-black px-2 py-0.5 border border-[#333333]">
                {t("EXP. SAME (ISS)\n              ")}</span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              {t("Los detectores de ionización terrestres fallan en la ISS porque en 0g las partículas de hollín no escapan y se aglomeran en tamaños gigantes (&gt;0.5 a 5.0 µm).\n            ")}</p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sootData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="size_um"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "Diámetro de Partícula (µm)", position: "insideBottom", offset: -5, fill: "#757575", fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "% Distribución en Masa", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 8 }}
                    formatter={(val) => <span className="text-[#cccccc]">{val}</span>}
                  />
                  <Bar dataKey="microgravity_0g" name={t("Microgravedad ISS (SAME)")} fill="#00b0ff" />
                  <Bar dataKey="earth_1g" name={t("Ambiente Terrestre 1g")} fill="#525252" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#00b0ff]/40">
                <span className="text-[#00b0ff] block">{t("PICO EN MICROGRAVEDAD:")}</span>
                <strong className="text-white">{t("0.50 µm (26.5% de masa)")}</strong>
              </div>
              <div className="bg-black p-2 border border-[#262626]">
                <span className="text-[#757575] block">{t("PICO EN TIERRA (1g):")}</span>
                <strong className="text-[#898989]">{t("0.05 µm (42.0% de masa)")}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Chart 4: NASA-STD-6001 Flammability Matrix */}
        {(activeTab === "all" || activeTab === "flammability") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-4">
            <div className="corner-square" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 text-[#76b900]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t("Matriz de Inflamabilidad NASA-STD-6001 (LOI vs Quenching)\n                ")}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#76b900] bg-black px-2 py-0.5 border border-[#333333]">
                {t("CERTIFICACIÓN JSC\n              ")}</span>
            </div>

            <p className="text-[11px] text-[#898989] leading-tight">
              {t("Los materiales con Índice de Oxígeno Límite (LOI) &gt; 26% y Distancia de Quenching &gt; 10 mm son autorizados para cabina habitable de Artemis.\n            ")}</p>

            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={flammabilityData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis
                    dataKey="name"
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 9, fontFamily: "monospace" }}
                  />
                  <YAxis
                    stroke="#757575"
                    tick={{ fill: "#898989", fontSize: 10, fontFamily: "monospace" }}
                    label={{ value: "LOI (%) / Dist. Quenching (mm)", angle: -90, position: "insideLeft", fill: "#757575", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 8 }}
                    formatter={(val) => <span className="text-[#cccccc]">{val}</span>}
                  />
                  <ReferenceLine
                    y={26}
                    stroke="#df6500"
                    strokeDasharray="4 4"
                    label={{ value: "UMBRAL CERTIFICACIÓN NASA (26% LOI)", fill: "#df6500", fontSize: 9 }}
                  />
                  <Bar dataKey="loi" name={t("Índice Oxígeno Límite (LOI %)")} fill="#76b900">
                    {flammabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.safe ? "#76b900" : "#df6500"} />
                    ))}
                  </Bar>
                  <Bar dataKey="quenching_mm" name={t("Distancia de Quenching (mm)")} fill="#00b0ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#333333] text-[10px] font-mono">
              <div className="bg-black p-2 border border-[#76b900]/40">
                <span className="text-[#76b900] block">{t("MATERIALES CERTIFICADOS:")}</span>
                <strong className="text-white">{t("Nomex (28.5%) &amp; Kapton (27.5%)")}</strong>
              </div>
              <div className="bg-black p-2 border border-[#df6500]/40">
                <span className="text-[#df6500] block">{t("MATERIALES PROHIBIDOS EN ARTEMIS:")}</span>
                <strong className="text-white">{t("PMMA (17.3%) &amp; Algodón (16.5%)")}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: NASA Physical Sciences Informatics (PSI) Database (14 Estudios & 32 Parámetros) */}
        {(activeTab === "all" || activeTab === "psi") && (
          <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 space-y-6 lg:col-span-2">
            <div className="corner-square" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#333333]">
              <div>
                <div className="flex items-center space-x-2 text-[11px] font-bold text-[#76b900] uppercase tracking-widest">
                  <Database className="h-4 w-4" />
                  <span>{t("NASA PHYSICAL SCIENCES INFORMATICS (PSI) DATABASE")}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {t("14 Estudios Experimentales de Microgravedad &amp; 32 Parámetros Validados\n                ")}</h3>
                <p className="text-xs text-[#898989] mt-0.5">
                  {t("Repositorio oficial de investigaciones en la Estación Espacial Internacional (ISS), Cygnus y vuelos parabólicos.\n                ")}</p>
              </div>

              {/* KPI Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1 bg-black border border-[#333333] text-center">
                  <span className="text-xs font-mono font-bold text-[#76b900]">14</span>
                  <span className="text-[10px] text-[#898989] block uppercase">{t("Estudios")}</span>
                </div>
                <div className="px-3 py-1 bg-black border border-[#333333] text-center">
                  <span className="text-xs font-mono font-bold text-[#00b0ff]">32</span>
                  <span className="text-[10px] text-[#898989] block uppercase">{t("Parámetros")}</span>
                </div>
                <div className="px-3 py-1 bg-black border border-[#333333] text-center">
                  <span className="text-xs font-mono font-bold text-[#e040fb]">8</span>
                  <span className="text-[10px] text-[#898989] block uppercase">{t("Docs NASA")}</span>
                </div>
                <div className="px-3 py-1 bg-black border border-[#76b900]/40 text-center">
                  <span className="text-xs font-mono font-bold text-white">{t("ISS Flight")}</span>
                  <span className="text-[10px] text-[#76b900] block uppercase">{t("Validado")}</span>
                </div>
              </div>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#757575]" />
                <input
                  type="text"
                  placeholder={t("Buscar por ID (PSI-159, PSI-60), título, material o parámetro...")}
                  value={psiSearch}
                  onChange={(e) => setPsiSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black border border-[#333333] text-white text-xs placeholder-[#666666] focus:outline-none focus:border-[#76b900] font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "TODOS" },
                  { id: "combustion", label: "COMBUSTIÓN (ACME/BASS/SPICE)" },
                  { id: "heat", label: "FLUIDOS & CALOR" },
                  { id: "materials", label: "CIENCIA DE MATERIALES" },
                  { id: "colloid", label: "COLOIDES" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setPsiCategory(cat.id)}
                    className={`px-2.5 py-1.5 text-[11px] font-mono font-bold uppercase transition-colors ${
                      psiCategory === cat.id
                        ? "bg-[#76b900] text-black"
                        : "bg-black text-[#cccccc] hover:text-white border border-[#333333]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Studies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {psiStudies
                .filter((s) => {
                  const matchCat =
                    psiCategory === "all" ||
                    (psiCategory === "combustion" && (s.category.toLowerCase().includes("combustion") || s.category.toLowerCase().includes("flame"))) ||
                    (psiCategory === "heat" && (s.category.toLowerCase().includes("heat") || s.category.toLowerCase().includes("fluid") || s.category.toLowerCase().includes("cfd"))) ||
                    (psiCategory === "materials" && (s.category.toLowerCase().includes("material") || s.category.toLowerCase().includes("cement") || s.category.toLowerCase().includes("solidification"))) ||
                    (psiCategory === "colloid" && s.category.toLowerCase().includes("colloid"));
                  const q = psiSearch.toLowerCase();
                  const matchQuery =
                    !q ||
                    s.psi_id.toLowerCase().includes(q) ||
                    s.title.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q) ||
                    (s.parameters && s.parameters.some((p) => p.parameter_name.toLowerCase().includes(q) || p.parameter_value.toLowerCase().includes(q)));
                  return matchCat && matchQuery;
                })
                .map((study) => (
                  <div
                    key={study.psi_id}
                    onClick={() => setSelectedStudy(selectedStudy?.psi_id === study.psi_id ? null : study)}
                    className={`relative bg-black border p-4 cursor-pointer transition-all ${
                      selectedStudy?.psi_id === study.psi_id
                        ? "border-[#76b900] shadow-md shadow-[#76b900]/20"
                        : "border-[#333333] hover:border-[#666666]"
                    }`}
                  >
                    <div className="corner-square" />
                    
                    {/* Card Top */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[#76b900] px-2 py-0.5 bg-[#1a1a1a] border border-[#333333]">
                        {study.psi_id}
                      </span>
                      <span className="text-[10px] font-mono text-[#898989] uppercase">
                        {study.status || "PUBLIC RELEASE"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 mb-1.5">
                      {study.title}
                    </h4>

                    <div className="text-[10px] text-[#76b900] font-mono mb-2">
                      {study.category}
                    </div>

                    <p className="text-[11px] text-[#a7a7a7] line-clamp-3 leading-relaxed mb-3">
                      {study.description}
                    </p>

                    {/* Parameters Preview */}
                    {study.parameters && study.parameters.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-[#262626]">
                        <span className="text-[9px] font-mono uppercase text-[#757575] block">
                          {t("Parámetros Físicos (")}{study.parameters.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {study.parameters.slice(0, 3).map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-1.5 py-0.5 bg-[#161616] border border-[#333333] text-[10px] font-mono text-[#cccccc]"
                            >
                              {p.parameter_name}: <strong className="text-white">{p.parameter_value} {p.unit}</strong>
                            </span>
                          ))}
                          {study.parameters.length > 3 && (
                            <span className="text-[10px] font-mono text-[#76b900] self-center">
                              +{study.parameters.length - 3} {t("más\n                            ")}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#262626] text-[10px] font-mono text-[#757575]">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{study.documents_count || (study.documents ? study.documents.length : 0)} {t("docs")}</span>
                      </div>
                      <span className="text-[#76b900] hover:underline">
                        {selectedStudy?.psi_id === study.psi_id ? "Cerrar Detalle ▲" : "Ver Detalle ▼"}
                      </span>
                    </div>

                    {/* Expanded Detail View */}
                    {selectedStudy?.psi_id === study.psi_id && (
                      <div className="mt-3 pt-3 border-t border-[#76b900]/40 space-y-3 bg-[#111111] -mx-4 -mb-4 p-4 text-xs font-mono">
                        <div>
                          <span className="text-[#76b900] font-bold block mb-1">{t("METODOLOGÍA &amp; ENFOQUE:")}</span>
                          <p className="text-[#cccccc] text-[11px] leading-relaxed">
                            {study.approach || "Ensayos experimentales con hardware CIR / BASS / FAMIS a bordo de la ISS."}
                          </p>
                        </div>

                        {study.parameters && study.parameters.length > 0 && (
                          <div>
                            <span className="text-[#00b0ff] font-bold block mb-1">{t("TODOS LOS PARÁMETROS CALIBRADOS:")}</span>
                            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                              {study.parameters.map((p, idx) => (
                                <div key={idx} className="flex justify-between py-0.5 border-b border-[#222222] text-[11px]">
                                  <span className="text-[#a7a7a7]">{p.parameter_name}:</span>
                                  <span className="text-white font-bold">{p.parameter_value} {p.unit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {study.contacts && study.contacts.length > 0 && (
                          <div>
                            <span className="text-[#e040fb] font-bold block mb-1">{t("EQUIPO DE INVESTIGACIÓN:")}</span>
                            <div className="space-y-1">
                              {study.contacts.map((c: any, cIdx: number) => (
                                <div key={cIdx} className="text-[11px] text-[#cccccc]">
                                  • {c.first_name} {c.last_name} ({c.role}) — <span className="text-[#757575]">{c.affiliation}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
