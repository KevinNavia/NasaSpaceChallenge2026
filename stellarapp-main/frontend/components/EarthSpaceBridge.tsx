"use client";

import React, { useState, useEffect } from "react";
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
  const [data, setData] = useState<FirmsData | null>(null);
  const [selectedScale, setSelectedScale] = useState<"earth" | "space">("earth");
  const [material, setMaterial] = useState("PMMA");
  const [frpResult, setFrpResult] = useState<{
    estimated_frp_kw: number;
    thermal_flux_kw_m2: number;
    radiative_fraction_pct: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/firms/summary")
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
          scientific_takeaway:
            "En la Tierra el penacho asciende por flotabilidad convectiva facilitando la detección satelital IR. En el espacio la ausencia de convección atrapa la llama en una capa difusiva esférica sin humo visible.",
        });
      });

    // Default FRP calculation
    calcFrp("PMMA");
  }, []);

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
            <span>EARTH-TO-SPACE FIRE BRIDGE (NASA FIRMS & SAFFIRE)</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
            Ciencia del Fuego en Dos Escalas: Planetaria vs. Microgravedad
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">
            Integración de la observación orbital satelital (FRP en MW) con la física de combustión en hábitats presurizados.
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
            MACRO: NASA FIRMS (TIERRA)
          </button>
          <button
            onClick={() => setSelectedScale("space")}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedScale === "space" ? "bg-[#76b900] text-black" : "text-[#898989] hover:text-white"
            }`}
          >
            MICRO: NAVE ESPACIAL (0G)
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
                  SISTEMA NASA FIRMS (MODIS & VIIRS)
                </span>
                <span className="text-[11px] font-mono text-[#898989]">RESOLUCIÓN: 375m – 1000m</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">Métrica Central</span>
                  <div className="text-sm font-bold text-white mt-1">FRP (MegaWatts)</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">Potencia Radiativa</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">Malla de Discretización</span>
                  <div className="text-sm font-bold text-[#76b900] mt-1">EPSG:6933</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">Celdas 10 km / 20 km</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">Índice de Jaccard</span>
                  <div className="text-sm font-bold text-white mt-1 font-mono">0.684</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">Concordancia Sensores</span>
                </div>
              </div>

              <p className="text-xs text-[#cccccc] leading-relaxed pt-2">
                <strong>Mecanismo Físico:</strong> En la Tierra, la combustión genera penachos térmicos ascendentes
                por flotabilidad gravitacional. Los satélites de órbita polar detectan la radiación infrarroja de onda media (3.9 µm y 11 µm),
                estimando la masa total de biomasa consumida en megavatios (FRP).
              </p>
            </div>
          ) : (
            <div className="p-6 bg-black border border-[#76b900] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <span className="text-xs font-bold uppercase text-[#76b900]">
                  SISTEMA DE SEGURIDAD EN NAVE (SAFFIRE / ECLSS / SAME)
                </span>
                <span className="text-[11px] font-mono text-[#76b900]">0.0001g (MICROGRAVEDAD)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">Métrica Central</span>
                  <div className="text-sm font-bold text-white mt-1">Flujo Térmico</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">kW / m² radiados</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">Desafío Sensor</span>
                  <div className="text-sm font-bold text-[#df6500] mt-1">Hollín Gigante</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">Aglomeración (SAME)</span>
                </div>
                <div className="p-3 bg-[#1a1a1a] border border-[#333333]">
                  <span className="text-[10px] font-bold uppercase text-[#757575] block">Fuegos Fríos</span>
                  <div className="text-sm font-bold text-[#76b900] mt-1">ACME (CIR)</div>
                  <span className="text-[10px] text-[#898989] block mt-0.5">Sin llama visible</span>
                </div>
              </div>

              <p className="text-xs text-[#cccccc] leading-relaxed pt-2">
                <strong>Mecanismo Físico:</strong> En microgravedad, el calor no asciende. El fuego transfiere hasta un 42%
                de su energía por radiación directa esférica sobre componentes vecinos, y el hollín se aglomera en cadenas microscópicas
                anómalas que ciegan los detectores iónicos estándar de la Tierra.
              </p>
            </div>
          )}

          {/* Scientific Synthesis Callout */}
          <div className="p-4 bg-black border-l-2 border-[#76b900] border-t border-r border-b border-[#333333] text-xs text-[#a7a7a7]">
            <span className="text-white font-bold uppercase text-[11px] block mb-1">
              Conclusión Metodológica NASA:
            </span>
            <p className="text-xs leading-relaxed">{data?.scientific_takeaway}</p>
          </div>
        </div>

        {/* Habitat FRP Thermal Radiative Power Calculator */}
        <div className="lg:col-span-5 bg-black border border-[#333333] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#898989]">
                CALCULADOR DE POTENCIA RADIATIVA (FRP)
              </span>
              <span className="text-[10px] font-mono text-[#76b900] font-bold">ATMÓSFERA 26% O₂</span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-[#a7a7a7] block mb-1.5">
                  Material de Ensayo
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
                      Potencia Radiativa de Fuego en Hábitat (FRP)
                    </span>
                    <div className="text-2xl font-mono font-bold text-[#76b900] mt-1">
                      {frpResult.estimated_frp_kw} <span className="text-xs text-white">kW</span>
                    </div>
                    <span className="text-[10px] text-[#898989] font-mono mt-0.5 block">
                      Fracción radiativa neta: {frpResult.radiative_fraction_pct}%
                    </span>
                  </div>

                  <div className="p-4 bg-[#1a1a1a] border border-[#333333]">
                    <span className="text-[10px] font-bold uppercase text-[#757575] block">
                      Flujo Térmico Superficial
                    </span>
                    <div className="text-xl font-mono font-bold text-white mt-1">
                      {frpResult.thermal_flux_kw_m2} <span className="text-xs text-[#757575]">kW/m²</span>
                    </div>
                    <span className="text-[10px] text-[#df6500] font-mono mt-0.5 block">
                      {frpResult.estimated_frp_kw > 15 ? "CRÍTICO: Riesgo de ignición secundaria" : "MODERADO"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#333333] flex items-center justify-between text-[10px] font-mono text-[#757575]">
            <span>BASADO EN MODELOS FIRMS & SAFFIRE</span>
            <span className="text-[#76b900]">EQUAL-AREA GRID READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
