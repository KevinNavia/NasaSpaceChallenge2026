"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Scale, Layers, Wind, Thermometer, ShieldAlert, Check } from "lucide-react";

type MaterialKey = "PMMA" | "Nomex" | "Cotton";

const MATERIALS: MaterialKey[] = ["PMMA", "Nomex", "Cotton"];

export default function ComparisonViewer() {
  const t = useTranslations("comparison");
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialKey>("PMMA");

  const field = (name: string) => t(`materials.${selectedMaterial}.${name}`);

  return (
    <div className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      {/* Corner Square */}
      <div className="corner-square" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#333333] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
            <Scale className="h-4 w-4" />
            <span>{t("eyebrow")}</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
            {t("title")}
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">
            {t("subtitle")}
          </p>
        </div>

        {/* NVIDIA-style Pill Tabs */}
        <div className="flex bg-black p-1 border border-[#333333]">
          {MATERIALS.map((mat) => (
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
          <span className="text-xs font-bold text-[#76b900] uppercase">{field("name")}:</span>
          <span className="text-xs text-[#cccccc]">{field("type")}</span>
        </div>
        <span className="text-[11px] font-mono text-[#898989] uppercase tracking-wider">
          {t("dataSource")}
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earth Column */}
        <div className="bg-black border border-[#333333] p-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#333333] mb-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {t("earthColumn")}
            </span>
            <span className="text-[11px] font-mono text-[#898989]">{t("glennLab")}</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-bold text-[#898989] uppercase block">{t("labels.shape")}</span>
              <p className="text-white font-bold mt-0.5">{field("earthShape")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#262626]">
              <div>
                <span className="text-[11px] font-bold text-[#898989] uppercase block">{t("labels.spread")}</span>
                <p className="text-white font-mono font-bold mt-0.5">{field("earthSpread")}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#898989] uppercase block">{t("labels.temperature")}</span>
                <p className="text-white font-mono font-bold mt-0.5">{field("earthTemp")}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#262626]">
              <span className="text-[11px] font-bold text-[#898989] uppercase block">{t("labels.mechanismEarth")}</span>
              <p className="text-[#a7a7a7] mt-1 leading-relaxed">{field("earthMechanism")}</p>
            </div>
          </div>
        </div>

        {/* Space Column */}
        <div className="bg-black border border-[#76b900] p-5 relative">
          <div className="flex items-center justify-between pb-4 border-b border-[#333333] mb-4">
            <span className="text-xs font-bold text-[#76b900] uppercase tracking-wider flex items-center space-x-1.5">
              <span>{t("spaceColumn")}</span>
            </span>
            <span className="text-[11px] font-mono text-[#76b900]">{t("saffireBass")}</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-bold text-[#898989] uppercase block">{t("labels.shape")}</span>
              <p className="text-white font-bold mt-0.5">{field("spaceShape")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#262626]">
              <div>
                <span className="text-[11px] font-bold text-[#898989] uppercase block">{t("labels.spread")}</span>
                <p className="text-[#76b900] font-mono font-bold mt-0.5">{field("spaceSpread")}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#898989] uppercase block">{t("labels.temperature")}</span>
                <p className="text-white font-mono font-bold mt-0.5">{field("spaceTemp")}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#262626]">
              <span className="text-[11px] font-bold text-[#898989] uppercase block">{t("labels.mechanismSpace")}</span>
              <p className="text-[#cccccc] mt-1 leading-relaxed">{field("spaceMechanism")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Suppression Protocol Callout */}
      <div className="mt-6 p-4 bg-black border-l-2 border-[#76b900] border-t border-r border-b border-[#333333] flex items-start space-x-3">
        <ShieldAlert className="h-5 w-5 text-[#76b900] shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {t("suppressionTitle")}
          </span>
          <p className="text-xs text-[#cccccc] mt-1 leading-relaxed">
            {field("suppression")}
          </p>
        </div>
      </div>
    </div>
  );
}
