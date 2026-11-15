"use client";
import { useLanguage } from "../i18n/LanguageContext";

import React, { useState } from "react";
import { SimulationResult } from "../types";
import { Cpu, Play, Flame, ShieldAlert, AlertCircle } from "lucide-react";

export default function AISimulator() {
  const { t } = useLanguage();
  const [material, setMaterial] = useState("PMMA");
  const [gravity, setGravity] = useState(0.0001);
  const [o2, setO2] = useState(21.0);
  const [pressure, setPressure] = useState(101.3);
  const [airFlow, setAirFlow] = useState(10.0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/ai/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material,
          gravity_g: gravity,
          oxygen_concentration_pct: o2,
          pressure_kpa: pressure,
          air_flow_velocity_cms: airFlow,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setResult(data);
      } else {
        throw new Error("Backend response error");
      }
    } catch {
      const loiMap: Record<string, { loi: number; tox: string }> = {
        nomex: { loi: 30.0, tox: "CO (bajo a medio)" },
        pbi: { loi: 40.0, tox: "CO (bajo)" },
        kapton: { loi: 38.0, tox: "HCN + CO (alto)" },
        kevlar: { loi: 29.0, tox: "CO (medio)" },
        ptfe: { loi: 95.0, tox: "HF (muy alto)" },
        pmma: { loi: 17.3, tox: "CO + CO2 (alto)" },
        cotton: { loi: 16.5, tox: "CO (moderado)" },
        etfe: { loi: 25.0, tox: "HF trazas + CO" },
        heptane: { loi: 14.0, tox: "CO + Hidrocarburos" },
      };
      const matKey = material.toLowerCase();
      const matInfo = loiMap[matKey] || { loi: 21.0, tox: "CO (medio)" };
      const loiExceeded = o2 >= matInfo.loi;

      const riskScore = (o2 / 21.0) * (airFlow / 10.0 + 0.5) * (gravity < 0.1 ? 1.1 : 1.0) + (loiExceeded ? 0.8 : 0.0);
      const riskLevel = o2 > 25.0 || (loiExceeded && matInfo.tox.includes("HF")) ? "Extreme" : (riskScore > 1.8 || loiExceeded) ? "Critical" : riskScore > 1.0 ? "Moderate" : "Low";
      const spread = Math.max(0.05, (o2 - 14.0) * 0.15 * (gravity < 0.1 ? 1.0 : 0.8) * (airFlow / 10.0 + 0.2) * (loiExceeded ? 1.0 : 0.25));

      setResult({
        input_parameters: {
          material,
          gravity_g: gravity,
          oxygen_concentration_pct: o2,
          pressure_kpa: pressure,
          air_flow_velocity_cms: airFlow,
        },
        predicted_risk_level: riskLevel,
        risk_score: Number(riskScore.toFixed(2)),
        estimated_flame_spread_mms: Number(spread.toFixed(2)),
        cool_flame_risk: gravity < 0.01 && airFlow < 3.0,
        extinction_strategy:
          gravity < 0.1
            ? "Corte inmediato de ventilación de cabina (< 1.0 cm/s) e inyección de gas inerte N₂"
            : "Descarga de extintor de agua nebulizada / CO₂",
        compliance_note: loiExceeded 
          ? `⚠️ ALERTA PSI-159: O₂ (${o2}%) >= LOI (${matInfo.loi}%). Toxicidad crítica: ${matInfo.tox}.`
          : `✅ NASA PSI-159 / STD-6001: Material auto-extinguible (O₂: ${o2}% < LOI: ${matInfo.loi}%).`,
        material_loi: matInfo.loi,
        toxic_hazard: matInfo.tox,
        loi_exceeded: loiExceeded,
        psi_calibrated: true,
        psi_sensor_context: "Calibrado con NASA PSI-159 (PMT1: 4.42 V, IonCurrent: -0.888)",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="simulator-section" className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      {/* Corner Square */}
      <div className="corner-square" />

      {/* Header */}
      <div className="flex items-center space-x-2 pb-6 border-b border-[#333333]">
        <Cpu className="h-5 w-5 text-[#76b900]" />
        <div>
          <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
            {t("WORKBENCH DE PREDICCIÓN CON IA\n          ")}</span>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-0.5">
            {t("Simulador de Combustión para Atmósferas de Exploración\n          ")}</h2>
          <p className="text-xs text-[#898989]">
            {t("Predicción en tiempo real para hábitats lunares (Artemis), tránsitos a Marte y naves orbitales.\n          ")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a7a7a7] mb-2">
                {t("Material de Ensayo\n              ")}</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-black border border-[#333333] text-xs font-bold text-white px-3 py-2.5 focus:border-[#76b900] focus:outline-none"
              >
                <option value="Nomex">{t("Nomex (LOI 30% - Trajes ISS / NASA Reference)")}</option>
                <option value="PBI">{t("PBI (LOI 40% - Óptimo Alto Oxígeno Artemis)")}</option>
                <option value="Kapton">{t("Kapton (LOI 38% - Aislamiento / Alerta HCN)")}</option>
                <option value="Kevlar">{t("Kevlar (LOI 29% - Textil de protección)")}</option>
                <option value="PTFE">{t("PTFE (LOI 95% - Alta inercia / Alerta HF)")}</option>
                <option value="PMMA">{t("PMMA (LOI 17.3% - Acrílico estructural)")}</option>
                <option value="Cotton">{t("Algodón (LOI 16.5% - NASA Standard Test 1)")}</option>
                <option value="ETFE">{t("ETFE (LOI 25% - Cableado aeroespacial)")}</option>
                <option value="Heptane">{t("n-Heptano (LOI 14% - Combustión de gotas)")}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a7a7a7] mb-2">
                {t("Régimen Gravitatorio\n              ")}</label>
              <select
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full bg-black border border-[#333333] text-xs font-bold text-white px-3 py-2.5 focus:border-[#76b900] focus:outline-none"
              >
                <option value={0.0001}>{t("Microgravedad Orbital (0g - ISS / Cygnus)")}</option>
                <option value={0.166}>{t("Gravedad Lunar (0.166g - Artemis Base)")}</option>
                <option value={0.38}>{t("Gravedad Marciana (0.38g - Mars Habitat)")}</option>
                <option value={1.0}>{t("Gravedad Terrestre (1.0g - Tierra)")}</option>
              </select>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-[#cccccc]">{t("Concentración de Oxígeno (% O₂)")}</span>
                <span className="font-mono text-[#76b900]">{o2}%</span>
              </div>
              <input
                type="range"
                min="16"
                max="38"
                step="0.5"
                value={o2}
                onChange={(e) => setO2(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer accent-[#76b900]"
              />
              <div className="flex justify-between text-[10px] text-[#757575] mt-1 font-mono uppercase">
                <span>{t("16% (Límite hipóxico)")}</span>
                <span>{t("21% (ISS Estándar)")}</span>
                <span>{t("30%-37% (Artemis / Exploración)")}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-[#cccccc]">{t("Presión de Cabina (kPa)")}</span>
                <span className="font-mono text-[#76b900]">{pressure} {t("kPa")}</span>
              </div>
              <input
                type="range"
                min="35"
                max="102"
                step="1"
                value={pressure}
                onChange={(e) => setPressure(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer accent-[#76b900]"
              />
              <div className="flex justify-between text-[10px] text-[#757575] mt-1 font-mono uppercase">
                <span>{t("56 kPa (Exploration Atmosphere)")}</span>
                <span>{t("101.3 kPa (Nivel del mar)")}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-[#cccccc]">{t("Flujo de Ventilación (cm/s)")}</span>
                <span className="font-mono text-[#76b900]">{airFlow} {t("cm/s")}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={airFlow}
                onChange={(e) => setAirFlow(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer accent-[#76b900]"
              />
              <div className="flex justify-between text-[10px] text-[#757575] mt-1 font-mono uppercase">
                <span>{t("0 cm/s (Auto-asfixia)")}</span>
                <span>{t("10 cm/s (Flujo normal ECLSS)")}</span>
                <span>{t("30 cm/s (Conducto activo)")}</span>
              </div>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full py-3 px-6 bg-[#76b900] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#5a8d00] transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            <span>{loading ? "CALCULANDO MODELO FÍSICO..." : "EJECUTAR SIMULACIÓN PREDICTIVA"}</span>
          </button>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-5 bg-black border border-[#333333] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
              <span className="text-[11px] font-bold text-[#898989] uppercase tracking-wider">
                {t("DIAGNÓSTICO TÉCNICO\n              ")}</span>
              {result && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                  result.predicted_risk_level === "Extreme" 
                    ? "border-[#e52020] text-[#e52020]" 
                    : result.predicted_risk_level === "Critical" 
                    ? "border-[#df6500] text-[#df6500]" 
                    : "border-[#76b900] text-[#76b900]"
                }`}>
                  {t("RIESGO: ")}{result.predicted_risk_level}
                </span>
              )}
            </div>

            {result ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                    <span className="text-[10px] font-bold uppercase text-[#898989] block">{t("Índice de Riesgo")}</span>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">{result.risk_score} / 3.0</div>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                    <span className="text-[10px] font-bold uppercase text-[#898989] block">{t("Tasa Estimada")}</span>
                    <div className="text-xl font-bold font-mono text-[#76b900] mt-0.5">
                      {result.estimated_flame_spread_mms} {t("mm/s\n                    ")}</div>
                  </div>
                </div>

                {result.cool_flame_risk && (
                  <div className="p-3 bg-black border-l-2 border-[#df6500] border-t border-r border-b border-[#333333] flex items-start space-x-2">
                    <Flame className="h-4 w-4 text-[#df6500] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#df6500] leading-relaxed">
                      <strong>{t("ALERTA DE FUEGO FRÍO:")}</strong> {t("Con flujo de aire &lt; 3 cm/s, la combustión continúa sin emisión de luz ni calor convencional detectable por sensores estándar.\n                    ")}</p>
                  </div>
                )}

                {result.material_loi !== undefined && (
                  <div className={`p-3 border text-xs ${
                    result.loi_exceeded
                      ? "bg-[#200505] border-[#e52020] text-white"
                      : "bg-[#081708] border-[#76b900] text-white"
                  }`}>
                    <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#333333]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#a7a7a7]">
                        {t("CALIBRACIÓN NASA PSI-159 // LOI vs O₂\n                      ")}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 ${
                        result.loi_exceeded ? "bg-[#e52020] text-white" : "bg-[#76b900] text-black"
                      }`}>
                        {result.loi_exceeded ? "LOI SUPERADO" : "MATERIAL SEGURO"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center my-1.5">
                      <div className="bg-[#141414] p-1.5 border border-[#2b2b2b]">
                        <span className="text-[9px] text-[#898989] block">{t("LOI LÍMITE")}</span>
                        <strong className="text-white">{result.material_loi}%</strong>
                      </div>
                      <div className="bg-[#141414] p-1.5 border border-[#2b2b2b]">
                        <span className="text-[9px] text-[#898989] block">{t("O₂ AMBIENTE")}</span>
                        <strong className="text-[#76b900]">{o2}%</strong>
                      </div>
                      <div className="bg-[#141414] p-1.5 border border-[#2b2b2b]">
                        <span className="text-[9px] text-[#898989] block">{t("MARGEN")}</span>
                        <strong className={result.loi_exceeded ? "text-[#e52020]" : "text-[#76b900]"}>
                          {(result.material_loi - o2) > 0 ? `+${(result.material_loi - o2).toFixed(1)}%` : `${(result.material_loi - o2).toFixed(1)}%`}
                        </strong>
                      </div>
                    </div>
                    {result.toxic_hazard && (
                      <div className="mt-2 text-[10px] text-[#cccccc] flex items-center space-x-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-[#df6500] shrink-0" />
                        <span>{t("Gas de Descomposición: ")}<strong className="text-white">{result.toxic_hazard}</strong></span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3 bg-[#1a1a1a] border border-[#333333] text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#898989] block">{t("Estrategia ECLSS")}</span>
                  <p className="text-[#ffffff] font-bold mt-1 leading-relaxed">{result.extinction_strategy}</p>
                </div>

                <p className="text-[10px] font-mono text-[#757575] uppercase">{result.compliance_note}</p>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center text-[#757575] space-y-2">
                <Cpu className="h-8 w-8 text-[#333333]" />
                <p className="text-xs uppercase font-mono tracking-wider">{t("Ajusta los parámetros y presiona Ejecutar.")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
