"use client";

import React, { useState } from "react";
import { Experiment } from "../types";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, BookOpen, Shield } from "lucide-react";

interface ExperimentCardProps {
  experiment: Experiment;
}

const RISK_KEYS = ["extreme", "critical", "moderate", "low"];

export default function ExperimentCard({ experiment }: ExperimentCardProps) {
  const t = useTranslations("experimentCard");
  const [expanded, setExpanded] = useState(false);

  const riskKey = experiment.safety_risk_level.toLowerCase();
  const riskLabel = RISK_KEYS.includes(riskKey)
    ? t(`risk.${riskKey}`)
    : experiment.safety_risk_level;

  const getRiskBorder = (level: string) => {
    switch (level) {
      case "Extreme":
        return "border-[#e52020] text-[#e52020]";
      case "Critical":
        return "border-[#df6500] text-[#df6500]";
      case "Moderate":
        return "border-[#bff230] text-[#bff230]";
      default:
        return "border-[#76b900] text-[#76b900]";
    }
  };

  return (
    <div className="relative bg-[#1a1a1a] border border-[#333333] p-5 hover:border-[#76b900] transition-colors flex flex-col justify-between">
      {/* NVIDIA Corner Square */}
      <div className="corner-square" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 bg-black border border-[#333333] text-[#76b900]">
            {experiment.id}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${getRiskBorder(experiment.safety_risk_level)}`}>
            {riskLabel}
          </span>
        </div>

        {/* Title */}
        <div className="mt-3">
          <div className="text-[11px] font-bold text-[#898989] uppercase tracking-wider">{experiment.mission}</div>
          <h3 className="text-base font-bold text-white mt-0.5">{experiment.material}</h3>
          <p className="text-xs text-[#a7a7a7] mt-0.5">{experiment.material_type} • {experiment.facility}</p>
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2 bg-black border border-[#262626]">
            <div className="text-[10px] uppercase font-bold text-[#757575]">{t("gravity")}</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">
              {experiment.gravity_g < 0.001 ? "0g" : `${experiment.gravity_g}g`}
            </div>
          </div>
          <div className="p-2 bg-black border border-[#262626]">
            <div className="text-[10px] uppercase font-bold text-[#757575]">{t("oxygen")}</div>
            <div className="text-xs font-mono font-bold text-[#76b900] mt-0.5">
              {experiment.oxygen_concentration_pct}%
            </div>
          </div>
          <div className="p-2 bg-black border border-[#262626]">
            <div className="text-[10px] uppercase font-bold text-[#757575]">{t("flameVelocity")}</div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">
              {experiment.flame_spread_rate_mms} mm/s
            </div>
          </div>
        </div>

        {/* Flame Morphology Tag */}
        <div className="mt-3 text-xs bg-black p-2.5 border border-[#262626]">
          <span className="text-[10px] font-bold uppercase text-[#898989] block">{t("morphology")}</span>
          <span className="text-white font-medium text-xs mt-0.5 block">{experiment.flame_shape}</span>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-[#333333] space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#76b900] block">{t("implication")}</span>
              <p className="text-[#cccccc] mt-0.5 text-xs leading-relaxed">{experiment.spacecraft_implication}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-white block">{t("suppression")}</span>
              <p className="text-[#cccccc] mt-0.5 text-xs leading-relaxed">{experiment.recommended_suppression}</p>
            </div>
            <div className="pt-1 text-[10px] text-[#757575] font-mono flex items-center space-x-1 uppercase">
              <BookOpen className="h-3 w-3 text-[#76b900] shrink-0" />
              <span>{experiment.nasa_reference}</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 pt-2 border-t border-[#333333] flex items-center justify-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-[#898989] hover:text-[#76b900] transition-colors w-full"
      >
        <span>{expanded ? t("hideSpec") : t("showSpec")}</span>
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
    </div>
  );
}
