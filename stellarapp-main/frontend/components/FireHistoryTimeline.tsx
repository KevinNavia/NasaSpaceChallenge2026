"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { History, ExternalLink } from "lucide-react";

const EVENTS = [
  {
    key: "apollo1",
    color: "#e52020",
    href: "https://sma.nasa.gov/sma-disciplines/accllp/apollo-1",
  },
  {
    key: "apollo13",
    color: "#df6500",
    href: "https://sma.nasa.gov/sma-disciplines/accllp/apollo-13",
  },
  {
    key: "mir",
    color: "#ff0055",
    href: "https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/",
  },
  {
    key: "saffire",
    color: "#76b900",
    href: "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },
  {
    key: "artemis2",
    color: "#00b0ff",
    href: "https://www.nasa.gov/humans-in-space/artemis/",
  },
  {
    key: "next",
    color: "#e040fb",
    href: "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
  },
] as const;

export default function FireHistoryTimeline() {
  const t = useTranslations("timeline");

  return (
    <section id="timeline-section" className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      <div className="corner-square" />

      <div className="pb-6 border-b border-[#333333]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
          <History className="h-4 w-4" />
          <span>{t("eyebrow")}</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">{t("title")}</h2>
        <p className="text-xs text-[#898989] mt-0.5 max-w-3xl">{t("subtitle")}</p>
      </div>

      <ol className="mt-6 relative border-l border-[#333333] ml-3 space-y-6">
        {EVENTS.map((event) => (
          <li key={event.key} className="pl-6 relative">
            <span
              className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-black"
              style={{ backgroundColor: event.color }}
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-black border border-[#333333]" style={{ color: event.color }}>
                {t(`${event.key}Year`)}
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {t(`${event.key}Title`)}
              </h3>
            </div>
            <p className="text-[11px] text-[#a7a7a7] leading-relaxed mt-1 max-w-3xl">
              {t(`${event.key}Desc`)}
            </p>
            <a
              href={event.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-[9px] font-mono uppercase tracking-wider text-[#76b900] hover:underline mt-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>{t("source")}</span>
            </a>
          </li>
        ))}
      </ol>

      <p className="mt-5 text-[10px] font-mono text-[#757575] border-t border-[#262626] pt-3">
        {t("disclaimer")}
      </p>
    </section>
  );
}
