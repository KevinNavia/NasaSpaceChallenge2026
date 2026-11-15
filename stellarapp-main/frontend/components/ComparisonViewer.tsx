"use client";

import React, { useState } from "react";
import { Scale, Layers, Wind, Thermometer, ShieldAlert, Check } from "lucide-react";

export default function ComparisonViewer() {
  const [selectedMaterial, setSelectedMaterial] = useState<"PMMA" | "Nomex" | "Cotton">("PMMA");

  const comparisonData = {
    PMMA: {
      name: "PMMA (Plexiglas)",
      type: "Termoplástico estructural en ventanas y componentes de naves",
      earth: {
        shape: "Cónica alargada (lágrima convectiva)",
        spread: "0.88 mm/s",
        temp: "1820 K",
        mechanism: "Convección natural violenta: empuje de Arquímedes evacúa gases calientes y alimenta aire continuamente.",
        soot: "Alto (humo denso visible)",
        risk: "Moderado (detección inmediata por sensores ópticos terrestres)",
      },
      space: {
        shape: "Domo semiesférico difuso",
        spread: "2.85 mm/s (en atmósfera de exploración 26% O₂)",
        temp: "1420 - 1650 K",
        mechanism: "Sin convección natural. La llama se adhiere a la superficie y eyecta gotas fundidas incandescentes flotantes.",
        soot: "Bajo a moderado (núcleo azul tenue de difícil detección)",
        risk: "Extremo (gotas flotantes propagan el fuego en cadena)",
      },
      suppression: "Corte de ventilación del módulo Cygnus/ISS a < 1.0 cm/s + Purga de gas inerte (N₂).",
    },
    Nomex: {
      name: "Nomex Aramid Fabric",
      type: "Fibra de aramida de trajes de tripulación y aislamiento térmico",
      earth: {
        shape: "Llama pequeña vertical oscilante",
        spread: "0.20 mm/s",
        temp: "1100 K",
        mechanism: "Formación rápida de capa carbonizada (charring) facilitada por la corriente convectiva.",
        soot: "Bajo",
        risk: "Bajo",
      },
      space: {
        shape: "Micropluma tenue esférica auto-extinguible",
        spread: "0.12 mm/s",
        temp: "980 K",
        mechanism: "Pérdida radiativa masiva al ser esférica. Sin flujo forzado > 2 cm/s, se auto-asfixia por falta de renovación de O₂.",
        soot: "Nulo / Mínimo",
        risk: "Bajo (Material de máxima seguridad pasiva para tripulación)",
      },
      suppression: "Auto-extinción pasiva al aislar el conducto de ventilación.",
    },
    Cotton: {
      name: "Algodón / Celulosa (NASA Std 1)",
      type: "Fibras de toallas, ropa interior y embalajes",
      earth: {
        shape: "Llama amarilla brillante con penacho de hollín",
        spread: "1.10 mm/s",
        temp: "1400 K",
        mechanism: "Combustión rápida con llama abierta y posterior brasa incandescente.",
        soot: "Medio",
        risk: "Moderado",
      },
      space: {
        shape: "Domo azul pálido con transición a fuego latente ('smoldering')",
        spread: "0.62 mm/s",
        temp: "1150 K",
        mechanism: "Pasa a combustión interna sin llama ni humo detectable. Puede reavivarse horas después si se reanuda la ventilación.",
        soot: "Invisible / Sin humo óptico",
        risk: "Crítico (Fuego fantasma indetectable por cámaras convencionales)",
      },
      suppression: "Inspección térmica infrarroja + Inyección directa localizada de CO₂.",
    },
  };

  const current = comparisonData[selectedMaterial];

  return (
    <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      {/* Corner Square */}
      <div className="corner-square" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#333333] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
            <Scale className="h-4 w-4" />
            <span>ESPECIFICACIÓN FÍSICA COMPARATIVA</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
            Gravedad Terrestre (1.0g) vs. Microgravedad Espacial (0g)
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">
            Análisis diferencial de la transferencia de calor y masa en ausencia de flotabilidad convectiva.
          </p>
        </div>

        {/* NVIDIA-style Pill Tabs */}
        <div className="flex bg-black p-1 border border-[#333333]">
          {(["PMMA", "Nomex", "Cotton"] as const).map((mat) => (
            <button
              key={mat}
              onClick={() => setSelectedMaterial(mat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedMaterial === mat
                  ? "bg-[#76b900] text-black"
                  : "text-[#898989] hover:text-white"
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* Material Metadata Bar */}
      <div className="my-6 p-4 bg-black border border-[#333333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-[#76b900] uppercase">{current.name}:</span>
          <span className="text-xs text-[#cccccc]">{current.type}</span>
        </div>
        <span className="text-[11px] font-mono text-[#898989] uppercase tracking-wider">
          DATA SOURCE: NASA PHYSICAL SCIENCES INFORMATICS
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earth Column */}
        <div className="bg-black border border-[#333333] p-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#333333] mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              CONDICIÓN TERRESTRE (1.0 G)
            </span>
            <span className="text-[11px] font-mono text-[#898989]">NASA Glenn Lab</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-bold text-[#898989] uppercase block">Geometría de Llama</span>
              <p className="text-white font-bold mt-0.5">{current.earth.shape}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#262626]">
              <div>
                <span className="text-[11px] font-bold text-[#898989] uppercase block">Tasa de Propagación</span>
                <p className="text-white font-mono font-bold mt-0.5">{current.earth.spread}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#898989] uppercase block">Temperatura Estimada</span>
                <p className="text-white font-mono font-bold mt-0.5">{current.earth.temp}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#262626]">
              <span className="text-[11px] font-bold text-[#898989] uppercase block">Mecanismo Convectivo</span>
              <p className="text-[#a7a7a7] mt-1 leading-relaxed">{current.earth.mechanism}</p>
            </div>
          </div>
        </div>

        {/* Space Column */}
        <div className="bg-black border border-[#76b900] p-5 relative">
          <div className="flex items-center justify-between pb-4 border-b border-[#333333] mb-4">
            <span className="text-xs font-bold text-[#76b900] uppercase tracking-wider flex items-center space-x-1.5">
              <span>MICROGRAVEDAD ORBITAL (0.0001 G)</span>
            </span>
            <span className="text-[11px] font-mono text-[#76b900]">Saffire & BASS-II</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-bold text-[#898989] uppercase block">Geometría de Llama</span>
              <p className="text-white font-bold mt-0.5">{current.space.shape}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#262626]">
              <div>
                <span className="text-[11px] font-bold text-[#898989] uppercase block">Tasa de Propagación</span>
                <p className="text-[#76b900] font-mono font-bold mt-0.5">{current.space.spread}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#898989] uppercase block">Temperatura Estimada</span>
                <p className="text-white font-mono font-bold mt-0.5">{current.space.temp}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#262626]">
              <span className="text-[11px] font-bold text-[#898989] uppercase block">Física de Difusión Pura</span>
              <p className="text-[#cccccc] mt-1 leading-relaxed">{current.space.mechanism}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suppression Protocol Callout */}
      <div className="mt-6 p-4 bg-black border-l-2 border-[#76b900] border-t border-r border-b border-[#333333] flex items-start space-x-3">
        <ShieldAlert className="h-5 w-5 text-[#76b900] shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            PROTOCOLO OPERATIVO ECLSS RECOMENDADO
          </span>
          <p className="text-xs text-[#cccccc] mt-1 leading-relaxed">
            {current.suppression}
          </p>
        </div>
      </div>
    </div>
  );
}
