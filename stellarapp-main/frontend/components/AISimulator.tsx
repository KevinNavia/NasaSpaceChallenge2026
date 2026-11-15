"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SimulationResult } from "../types";
import { Cpu, Play, Flame, ShieldAlert, AlertCircle } from "lucide-react";

export default function AISimulator() {
  const t = useTranslations("simulator");
  const locale = useLocale();
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
          lang: locale,
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
        nomex: { loi: 30.0, tox: t("fallback.tox.nomex") },
        pbi: { loi: 40.0, tox: t("fallback.tox.pbi") },
        kapton: { loi: 38.0, tox: t("fallback.tox.kapton") },
        kevlar: { loi: 29.0, tox: t("fallback.tox.kevlar") },
        ptfe: { loi: 95.0, tox: t("fallback.tox.ptfe") },
        pmma: { loi: 17.3, tox: t("fallback.tox.pmma") },
        cotton: { loi: 16.5, tox: t("fallback.tox.cotton") },
        etfe: { loi: 25.0, tox: t("fallback.tox.etfe") },
        heptane: { loi: 14.0, tox: t("fallback.tox.heptane") },
      };
      const matKey = material.toLowerCase();
      const matInfo = loiMap[matKey] || { loi: 21.0, tox: t("fallback.tox.default") };
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
            ? t("fallback.strategySpace")
            : t("fallback.strategyEarth"),
        compliance_note: loiExceeded 
          ? t("fallback.alert", { o2, loi: matInfo.loi, tox: matInfo.tox })
          : t("fallback.safe", { o2, loi: matInfo.loi }),
        material_loi: matInfo.loi,
        toxic_hazard: matInfo.tox,
        loi_exceeded: loiExceeded,
        psi_calibrated: true,
        psi_sensor_context: t("fallback.sensorContext"),
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
            {t("eyebrow")}
          </span>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-0.5">
            {t("title")}
          </h2>
          <p className="text-xs text-[#898989]">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a7a7a7] mb-2">
                {t("materialLabel")}
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-black border border-[#333333] text-xs font-bold text-white px-3 py-2.5 focus:border-[#76b900] focus:outline-none"
              >
                <option value="Nomex">{t("materials.nomex")}</option>
                <option value="PBI">{t("materials.pbi")}</option>
                <option value="Kapton">{t("materials.kapton")}</option>
                <option value="Kevlar">{t("materials.kevlar")}</option>
                <option value="PTFE">{t("materials.ptfe")}</option>
                <option value="PMMA">{t("materials.pmma")}</option>
                <option value="Cotton">{t("materials.cotton")}</option>
                <option value="ETFE">{t("materials.etfe")}</option>
                <option value="Heptane">{t("materials.heptane")}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a7a7a7] mb-2">
                {t("gravityLabel")}
              </label>
              <select
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full bg-black border border-[#333333] text-xs font-bold text-white px-3 py-2.5 focus:border-[#76b900] focus:outline-none"
              >
                <option value={0.0001}>{t("gravities.micro")}</option>
                <option value={0.166}>{t("gravities.lunar")}</option>
                <option value={0.38}>{t("gravities.mars")}</option>
                <option value={1.0}>{t("gravities.earth")}</option>
              </select>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-[#cccccc]">{t("o2Label")}</span>
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
                <span>{t("o2Ticks.hypoxic")}</span>
                <span>{t("o2Ticks.iss")}</span>
                <span>{t("o2Ticks.artemis")}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-[#cccccc]">{t("pressureLabel")}</span>
                <span className="font-mono text-[#76b900]">{pressure} kPa</span>
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
                <span>{t("pressureTicks.exploration")}</span>
                <span>{t("pressureTicks.seaLevel")}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-[#cccccc]">{t("flowLabel")}</span>
                <span className="font-mono text-[#76b900]">{airFlow} cm/s</span>
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
                <span>{t("flowTicks.zero")}</span>
                <span>{t("flowTicks.normal")}</span>
                <span>{t("flowTicks.active")}</span>
              </div>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading}
            className="w-full py-3 px-6 bg-[#76b900] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#5a8d00] transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="h-3.5 w-3.5 fill-black" />
            <span>{loading ? t("calculating") : t("run")}</span>
          </button>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-5 bg-black border border-[#333333] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
              <span className="text-[11px] font-bold text-[#898989] uppercase tracking-wider">
                {t("diagnosis")}
              </span>
              {result && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                  result.predicted_risk_level === "Extreme" 
                    ? "border-[#e52020] text-[#e52020]" 
                    : result.predicted_risk_level === "Critical" 
                    ? "border-[#df6500] text-[#df6500]" 
                    : "border-[#76b900] text-[#76b900]"
                }`}>
                  {t("risk", { level: t(`riskLevels.${result.predicted_risk_level}`) })}
                </span>
              )}
            </div>

            {result ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                    <span className="text-[10px] font-bold uppercase text-[#898989] block">{t("riskIndex")}</span>
                    <div className="text-xl font-bold font-mono text-white mt-0.5">{result.risk_score} / 3.0</div>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                    <span className="text-[10px] font-bold uppercase text-[#898989] block">{t("estimatedRate")}</span>
                    <div className="text-xl font-bold font-mono text-[#76b900] mt-0.5">
                      {result.estimated_flame_spread_mms} mm/s
                    </div>
                  </div>
                </div>

                {result.cool_flame_risk && (
                  <div className="p-3 bg-black border-l-2 border-[#df6500] border-t border-r border-b border-[#333333] flex items-start space-x-2">
                    <Flame className="h-4 w-4 text-[#df6500] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#df6500] leading-relaxed">
                      <strong>{t("coolFlameTitle")}</strong> {t("coolFlameBody")}
                    </p>
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
                        {t("calibration")}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 ${
                        result.loi_exceeded ? "bg-[#e52020] text-white" : "bg-[#76b900] text-black"
                      }`}>
                        {result.loi_exceeded ? t("loiExceeded") : t("materialSafe")}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center my-1.5">
                      <div className="bg-[#141414] p-1.5 border border-[#2b2b2b]">
                        <span className="text-[9px] text-[#898989] block">{t("loiLimit")}</span>
                        <strong className="text-white">{result.material_loi}%</strong>
                      </div>
                      <div className="bg-[#141414] p-1.5 border border-[#2b2b2b]">
                        <span className="text-[9px] text-[#898989] block">{t("o2Ambient")}</span>
                        <strong className="text-[#76b900]">{o2}%</strong>
                      </div>
                      <div className="bg-[#141414] p-1.5 border border-[#2b2b2b]">
                        <span className="text-[9px] text-[#898989] block">{t("margin")}</span>
                        <strong className={result.loi_exceeded ? "text-[#e52020]" : "text-[#76b900]"}>
                          {(result.material_loi - o2) > 0 ? `+${(result.material_loi - o2).toFixed(1)}%` : `${(result.material_loi - o2).toFixed(1)}%`}
                        </strong>
                      </div>
                    </div>
                    {result.toxic_hazard && (
                      <div className="mt-2 text-[10px] text-[#cccccc] flex items-center space-x-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-[#df6500] shrink-0" />
                        <span>{t("decompositionGas")} <strong className="text-white">{result.toxic_hazard}</strong></span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-3 bg-[#1a1a1a] border border-[#333333] text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#898989] block">{t("eclssStrategy")}</span>
                  <p className="text-[#ffffff] font-bold mt-1 leading-relaxed">{result.extinction_strategy}</p>
                </div>

                <p className="text-[10px] font-mono text-[#757575] uppercase">{result.compliance_note}</p>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center text-[#757575] space-y-2">
                <Cpu className="h-8 w-8 text-[#333333]" />
                <p className="text-xs uppercase font-mono tracking-wider">{t("placeholder")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
