"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Droplets, Radar, Shirt, Wind, ExternalLink, Globe2 } from "lucide-react";

const ITEMS = [
  {
    key: "water",
    href: "https://spinoff.nasa.gov/",
    icon: Droplets,
    tag: "tagExtinction",
    color: "#00b0ff",
  },
  {
    key: "detector",
    href: "https://spinoff.nasa.gov/node/9407",
    icon: Radar,
    tag: "tagDetection",
    color: "#76b900",
  },
  {
    key: "tanks",
    href: "https://spinoff.nasa.gov/node/9582",
    icon: Wind,
    tag: "tagBreathing",
    color: "#df6500",
  },
  {
    key: "attire",
    href: "https://spinoff.nasa.gov/node/9918",
    icon: Shirt,
    tag: "tagProtection",
    color: "#e040fb",
  },
] as const;

export default function EarthImpact() {
  const t = useTranslations("impact");

  return (
    <section id="impact-section" className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      <div className="corner-square" />

      <div className="pb-6 border-b border-[#333333]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
          <Globe2 className="h-4 w-4" />
          <span>{t("eyebrow")}</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">{t("title")}</h2>
        <p className="text-xs text-[#898989] mt-0.5 max-w-3xl">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group bg-black border border-[#333333] hover:border-[#76b900] p-5 space-y-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5" style={{ color: item.color }} />
                <span
                  className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 border"
                  style={{ color: item.color, borderColor: `${item.color}66` }}
                >
                  {t(item.tag)}
                </span>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#76b900] transition-colors leading-snug">
                {t(`${item.key}Title`)}
              </h3>
              <p className="text-[11px] text-[#a7a7a7] leading-relaxed">{t(`${item.key}Desc`)}</p>
              <span className="inline-flex items-center space-x-1 text-[9px] font-mono text-[#898989] group-hover:text-[#76b900]">
                <ExternalLink className="h-3 w-3" />
                <span>{t("sourceLink")}</span>
              </span>
            </a>
          );
        })}
      </div>

      <p className="mt-4 text-[10px] font-mono text-[#757575]">{t("source")}</p>
    </section>
  );
}
