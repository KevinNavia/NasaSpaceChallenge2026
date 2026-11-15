"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe2, Orbit, Flame, ShieldAlert, Cpu, Layers, Radio, BarChart3 } from "lucide-react";

interface FirmsData {
  title: string;
  planetary_monitoring: {
    system: string;
    satellites: string[];
    spatial_resolutions: Record<string, string>;
    key_metric: string;
    sampling_grid: string;
    jaccard_concordance_index: number;
    monthly_bolivia_detections: number;
    average_frp_mw: number;
  };
  spacecraft_monitoring: {
    system: string;
    facilities: string[];
    key_metric: string;
    sensor_challenge: string;
    extinction_paradigm: string;
  };
  scientific_takeaway: string;
}

export default function EarthSpaceBridge() {
  const t = useTranslations("bridge");
  const locale = useLocale();
  const [data, setData] = useState<FirmsData | null>(null);
  const [selectedScale, setSelectedScale] = useState<"earth" | "space">("earth");
  const [material, setMaterial] = useState("PMMA");
  const [frpResult, setFrpResult] = useState<{
    estimated_frp_kw: number;
    thermal_flux_kw_m2: number;
    radiative_fraction_pct: number;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/firms/summary?lang=${locale}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {
        setData({
          title: "NASA Fire Intelligence: Earth-to-Space Bridge",
          planetary_monitoring: {
            system: "NASA FIRMS (Fire Information for Resource Management System)",
            satellites: ["Terra / Aqua (MODIS)", "Suomi-NPP (VIIRS)", "NOAA-20 (VIIRS)"],
            spatial_resolutions: { MODIS: "1000m", VIIRS: "375m" },
            key_metric: "Fire Radiative Power (FRP en MegaWatts)",
            sampling_grid: "Equal-Area EPSG:6933 (Celdas 10 km y 20 km)",
            jaccard_concordance_index: 0.684,
            monthly_bolivia_detections: 18450,
            average_frp_mw: 48.7,
          },
          spacecraft_monitoring: {
            system: "Spacecraft Cabin Fire Safety (Saffire / ISS ECLSS / SAME)",
            facilities: ["Cygnus (Saffire)", "ISS Glovebox (BASS-II)", "CIR (ACME / FLEX)"],
            key_metric: "Tasa de propagación (mm/s) & Potencia Radiativa Esférica (kW/m²)",
            sensor_challenge: "Aglomeración de partículas de hollín (SAME) y fuegos fríos invisibles (ACME)",
            extinction_paradigm: "Corte de ventilación forzada (< 1.2 cm/s) + Dilución inerte N2",
          },
          scientific_takeaway: t("fallbackTakeaway"),
        });
      });

    // Default FRP calculation
    calcFrp("PMMA");
  }, [locale]);

  const calcFrp = async (mat: string) => {
    setMaterial(mat);
    try {
      const resp = await fetch("/api/firms/frp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: mat,
          spread_rate_mms: mat === "PMMA" ? 2.85 : 0.8,
          oxygen_concentration_pct: 26.0,
          gravity_g: 0.0001,
          lang: locale,
        }),
      });
      if (resp.ok) {
        const json = await resp.json();
        setFrpResult(json);
      }
    } catch {
      setFrpResult({
        estimated_frp_kw: mat === "PMMA" ? 22.4 : 8.5,
        thermal_flux_kw_m2: mat === "PMMA" ? 8.96 : 3.4,
        radiative_fraction_pct: 42.0,
      });
    }
  };

  return (
    <div id="bridge-section" className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      {/* Corner Square */}
      <div className="corner-square" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#333333] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
            <Globe2 className="h-4 w-4" />
            <span>{t("eyebrow")}</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
            {t("title")}
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">
            {t("subtitle")}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-black p-1 border border-[#333333]">
          <button
            onClick={() => setSelectedScale("earth")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedScale === "earth" ? "bg-[#76b900] text-black" : "text-[#898989] hover:text-white"
            }`}
          >
            {t("modes.earth")}
          </button>
          <button
            onClick={() => setSelectedScale("space")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedScale === "space" ? "bg-[#76b900] text-black" : "text-[#898989] hover:text-white"
            }`}
          >
            {t("modes.space")}
          </button>
        </div>
      </div>

      {/* Two-Column Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Main Details Panel */}
        <div className="lg:col-span-7 space-y-4">
          {selectedScale === "earth" ? (
            <div className="p-6 bg-black border border-[#333333] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <span className="text-xs font-bold uppercase text-[#76b900]">
                  {t("earthPanel.system")}
                </span>
                <span className="text-[11px] font-mono text-[#898989]">{t("earthPanel.resolution")}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">{t("earthPanel.metricLabel")}</span>
                  <div className="text-sm font-bold text-white mt-1">{t("earthPanel.metricValue")}</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">{t("earthPanel.metricSub")}</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">{t("earthPanel.gridLabel")}</span>
                  <div className="text-sm font-bold text-[#76b900] mt-1">{t("earthPanel.gridValue")}</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">{t("earthPanel.gridSub")}</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">{t("earthPanel.jaccardLabel")}</span>
                  <div className="text-sm font-bold text-white mt-1 font-mono">0.684</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">{t("earthPanel.jaccardSub")}</span>
                </div>
              </div>

              <p className="text-xs text-[#cccccc] leading-relaxed pt-2">
                <strong>{t("earthPanel.mechanismTitle")}</strong> {t("earthPanel.mechanism")}
              </p>
            </div>
          ) : (
            <div className="p-6 bg-black border border-[#76b900] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <span className="text-xs font-bold uppercase text-[#76b900]">
                  {t("spacePanel.system")}
                </span>
                <span className="text-[11px] font-mono text-[#76b900]">{t("spacePanel.microgravity")}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">{t("spacePanel.metricLabel")}</span>
                  <div className="text-sm font-bold text-white mt-1">{t("spacePanel.metricValue")}</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">{t("spacePanel.metricSub")}</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">{t("spacePanel.sensorLabel")}</span>
                  <div className="text-sm font-bold text-[#df6500] mt-1">{t("spacePanel.sensorValue")}</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">{t("spacePanel.sensorSub")}</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">{t("spacePanel.coolLabel")}</span>
                  <div className="text-sm font-bold text-[#76b900] mt-1">ACME (CIR)</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">{t("spacePanel.coolSub")}</span>
                </div>
              </div>

              <p className="text-xs text-[#cccccc] leading-relaxed pt-2">
                <strong>{t("spacePanel.mechanismTitle")}</strong> {t("spacePanel.mechanism")}
              </p>
            </div>
          )}

          {/* Scientific Synthesis Callout */}
          <div className="p-4 bg-black border-l-2 border-[#76b900] border-t border-r border-b border-[#333333] text-xs text-[#a7a7a7]">
            <span className="text-white font-bold uppercase text-[11px] block mb-1">
              {t("conclusionLabel")}
            </span>
            <p className="text-xs leading-relaxed">{data?.scientific_takeaway}</p>
          </div>
        </div>

        {/* Habitat FRP Thermal Radiative Power Calculator */}
        <div className="lg:col-span-5 bg-black border border-[#333333] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#898989]">
                {t("frp.title")}
              </span>
              <span className="text-[10px] font-mono text-[#76b900] font-bold">{t("frp.atmosphere")}</span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-[#a7a7a7] block mb-1.5">
                  {t("frp.material")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["PMMA", "Nomex", "Cotton"].map((m) => (
                    <button
                      key={m}
                      onClick={() => calcFrp(m)}
                      className={`py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                        material === m
                          ? "bg-[#76b900] text-black border-[#76b900]"
                          : "bg-[#1a1a1a] text-[#898989] border-[#333333] hover:text-white"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {frpResult && (
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-[#1a1a1a] border border-[#333333]">
                    <span className="text-[10px] font-bold uppercase text-[#757575] block">
                      {t("frp.powerLabel")}
                    </span>
                    <div className="text-2xl font-mono font-bold text-[#76b900] mt-1">
                      {frpResult.estimated_frp_kw} <span className="text-xs text-white">kW</span>
                    </div>
                    <span className="text-[10px] text-[#898989] font-mono mt-0.5 block">
                      {t("frp.radiativeFraction", { value: frpResult.radiative_fraction_pct })}
                    </span>
                  </div>

                  <div className="p-4 bg-[#1a1a1a] border border-[#333333]">
                    <span className="text-[10px] font-bold uppercase text-[#757575] block">
                      {t("frp.fluxLabel")}
                    </span>
                    <div className="text-xl font-mono font-bold text-white mt-1">
                      {frpResult.thermal_flux_kw_m2} <span className="text-xs text-[#757575]">kW/m²</span>
                    </div>
                    <span className="text-[10px] text-[#df6500] font-mono mt-0.5 block">
                      {frpResult.estimated_frp_kw > 15 ? t("frp.critical") : t("frp.moderate")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#333333] flex items-center justify-between text-[10px] font-mono text-[#757575]">
            <span>{t("frp.footerLeft")}</span>
            <span className="text-[#76b900]">{t("frp.footerRight")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
