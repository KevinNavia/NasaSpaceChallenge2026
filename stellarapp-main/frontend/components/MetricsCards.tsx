"use client";

import React from "react";
import { MetricsData } from "../types";
import { useTranslations } from "next-intl";
import { Database, AlertTriangle, Flame, ShieldCheck } from "lucide-react";

interface MetricsCardsProps {
  metrics: MetricsData | null;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const t = useTranslations("metrics");

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-[#1a1a1a] border border-[#333333]" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: t("experiments.title"),
      value: metrics.total_experiments,
      subtitle: t("experiments.subtitle", { count: metrics.unique_materials_count }),
      icon: Database,
    },
    {
      title: t("coolFlames.title"),
      value: metrics.cool_flame_detections,
      subtitle: t("coolFlames.subtitle"),
      icon: Flame,
    },
    {
      title: t("maxSpread.title"),
      value: `${metrics.max_flame_spread_rate_mms} mm/s`,
      subtitle: t("maxSpread.subtitle"),
      icon: AlertTriangle,
    },
    {
      title: t("criticalProfiles.title"),
      value: metrics.critical_risk_count,
      subtitle: t("criticalProfiles.subtitle"),
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="relative bg-[#1a1a1a] border border-[#333333] p-5 transition-colors hover:border-[#76b900]"
          >
            {/* NVIDIA Corner Square */}
            <div className="corner-square" />

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#898989] uppercase tracking-wider">{c.title}</span>
              <Icon className="h-4 w-4 text-[#76b900]" />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold tracking-tight text-white">{c.value}</div>
              <p className="mt-1.5 text-xs text-[#a7a7a7] leading-relaxed">{c.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
