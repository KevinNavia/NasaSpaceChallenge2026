"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  BookOpen,
  Building2,
  Database,
  ExternalLink,
  FileText,
  History,
  Library,
  Map,
  Play,
  Recycle,
} from "lucide-react";

const VIDEO_ID = "W1oXykoz9zg";
const GUIDE_PDF =
  "https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf";
const GUIDE_EPUB =
  "https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity.epub";

type Category = "data" | "science" | "history" | "spinoff";

interface Resource {
  id: string;
  category: Category;
  title: string;
  publisher: string;
  url: string;
  description: string;
  usedIn: string[];
}

interface Investigation {
  id: string;
  name: string;
  class: string;
  gravity: string;
  hardware: string;
  facility: string;
  status: "dataset" | "brief" | "current" | "future";
  inDataset: boolean;
  note: string;
}

interface Facility {
  id: string;
  name: string;
  detail: string;
}

interface Facts {
  energySharePct: number;
  flameTempK: number;
  ambientTempK: number;
  densityRatio: number;
  moonO2Pct: number;
  moonPressurePsi: number;
  moonO2IncreasePct: number;
  suitO2Pct: number;
  suitPressurePsi: number;
  suitPrebreathe: string;
  cfiMaxO2Pct: number;
  partialGravityGap: string;
}

interface ResourcesResponse {
  resources: Resource[];
  investigations: Investigation[];
  facilities: Facility[];
  facts: Facts;
}

const CATEGORY_ORDER: Category[] = ["data", "science", "history", "spinoff"];
const CATEGORY_ICONS: Record<Category, typeof Database> = {
  data: Database,
  science: BookOpen,
  history: History,
  spinoff: Recycle,
};

const STATUS_STYLES: Record<string, string> = {
  dataset: "border-[#76b900] text-[#76b900]",
  brief: "border-[#00b0ff] text-[#00b0ff]",
  current: "border-[#df6500] text-[#df6500]",
  future: "border-[#e040fb] text-[#e040fb]",
};

export default function ResourcesSection() {
  const t = useTranslations("resources");
  const locale = useLocale();
  const [data, setData] = useState<ResourcesResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setError(false);
    fetch(`/api/resources?lang=${locale}`)
      .then((res) => res.json())
      .then((json) => {
        if (active) setData(json);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [locale]);

  const facts = data?.facts;

  return (
    <section id="resources-section" className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      <div className="corner-square" />

      {/* Header */}
      <div className="pb-6 border-b border-[#333333]">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
          <Library className="h-4 w-4" />
          <span>{t("eyebrow")}</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">{t("title")}</h2>
        <p className="text-xs text-[#898989] mt-0.5 max-w-3xl">{t("subtitle")}</p>
      </div>

      {error && (
        <p className="mt-6 text-xs font-mono text-[#df6500]">{t("note")}</p>
      )}

      {data && (
        <>
          {/* Video + facts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-5 bg-black border border-[#333333] p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4 text-[#76b900]" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-white">
                  {t("videoTitle")}
                </h3>
              </div>
              <div className="aspect-video w-full bg-black border border-[#222222]">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
                  title={t("videoTitle")}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#898989] mb-3">
                {t("factsTitle")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                <FactCard value={`${facts?.energySharePct}%`} label={t("factEnergy")} color="#76b900" />
                <FactCard
                  value={`${facts?.flameTempK} K`}
                  label={`${t("factTemp")} (${facts?.ambientTempK} K)`}
                  color="#df6500"
                />
                <FactCard value={`${facts?.densityRatio}×`} label={t("factDensity")} color="#00b0ff" />
                <FactCard
                  value={`${facts?.moonO2Pct}% O₂`}
                  label={`${t("factMoon")} (${facts?.moonPressurePsi} psi)`}
                  color="#e040fb"
                />
                <FactCard
                  value={`+${facts?.moonO2IncreasePct}%`}
                  label={t("factMoonIncrease")}
                  color="#e040fb"
                />
                <FactCard
                  value={`${facts?.suitO2Pct}% O₂`}
                  label={`${t("factSuit")} (${facts?.suitPressurePsi} psi)`}
                  color="#ff0055"
                />
                <FactCard
                  value={`${facts?.cfiMaxO2Pct}% O₂`}
                  label={t("factCfi")}
                  color="#76b900"
                />
              </div>
              <p className="text-[10px] text-[#898989] leading-relaxed mt-3 border-t border-[#262626] pt-2">
                {facts?.suitPrebreathe}
              </p>
            </div>
          </div>

          {/* Resource catalog */}
          <div className="mt-8">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#898989] mb-3">
              {t("sourcesTitle")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORY_ORDER.map((category) => {
                const items = data.resources.filter((item) => item.category === category);
                if (items.length === 0) return null;
                const Icon = CATEGORY_ICONS[category];
                return (
                  <div key={category} className="bg-black border border-[#333333] p-4 space-y-3">
                    <div className="flex items-center space-x-2 text-[#76b900]">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {t(`category.${category}`)}
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {items.map((item) => (
                        <div key={item.id} className="border-t border-[#262626] pt-2.5 first:border-t-0 first:pt-0">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-start space-x-1.5 text-xs font-bold text-white hover:text-[#76b900] transition-colors"
                          >
                            <span>{item.title}</span>
                            <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 opacity-70" />
                          </a>
                          <div className="text-[9px] font-mono uppercase tracking-wider text-[#757575] mt-0.5">
                            {item.publisher}
                          </div>
                          <p className="text-[11px] text-[#a7a7a7] leading-relaxed mt-1">
                            {item.description}
                          </p>
                          {item.id === "guide" && (
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <a
                                href={GUIDE_PDF}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1 text-[10px] font-mono text-[#76b900] hover:underline"
                              >
                                <FileText className="h-3 w-3" />
                                <span>{t("downloadGuide")}</span>
                              </a>
                              <a
                                href={GUIDE_EPUB}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1 text-[10px] font-mono text-[#76b900] hover:underline"
                              >
                                <FileText className="h-3 w-3" />
                                <span>{t("guideEpub")}</span>
                              </a>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-1 mt-1.5">
                            <span className="text-[8px] font-mono uppercase text-[#5c5c5c]">
                              {t("usedIn")}:
                            </span>
                            {item.usedIn.map((usage) => (
                              <span
                                key={usage}
                                className="px-1 py-0.5 bg-[#111111] border border-[#2a2a2a] text-[8px] font-mono text-[#898989]"
                              >
                                {t(`usedInLabels.${usage}`)}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Investigation map */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-1">
              <Map className="h-4 w-4 text-[#76b900]" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-white">
                {t("mapTitle")}
              </h3>
            </div>
            <p className="text-[11px] text-[#898989] mb-3">{t("mapSubtitle")}</p>

            <div className="overflow-x-auto border border-[#333333]">
              <table className="w-full min-w-[820px] text-left">
                <thead className="bg-black text-[9px] uppercase tracking-wider text-[#898989]">
                  <tr>
                    <th className="p-2.5">{t("investigation")}</th>
                    <th className="p-2.5">{t("gravity")}</th>
                    <th className="p-2.5">{t("hardware")}</th>
                    <th className="p-2.5">{t("facility")}</th>
                    <th className="p-2.5">{t("statusLabel")}</th>
                    <th className="p-2.5">{t("inDataset")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.investigations.map((item) => (
                    <tr key={item.id} className="border-t border-[#262626] align-top">
                      <td className="p-2.5">
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-[#898989]">{item.class}</div>
                        <div className="text-[10px] text-[#757575] mt-0.5 max-w-md">{item.note}</div>
                      </td>
                      <td className="p-2.5 text-[10px] font-mono text-[#cccccc] whitespace-nowrap">
                        {item.gravity}
                      </td>
                      <td className="p-2.5 text-[10px] font-mono text-[#a7a7a7]">{item.hardware}</td>
                      <td className="p-2.5 text-[10px] font-mono text-[#a7a7a7]">{item.facility}</td>
                      <td className="p-2.5">
                        <span
                          className={`inline-block px-1.5 py-0.5 border text-[9px] font-bold uppercase tracking-wider ${
                            STATUS_STYLES[item.status] || "border-[#333333] text-[#cccccc]"
                          }`}
                        >
                          {t(`status.${item.status}`)}
                        </span>
                      </td>
                      <td className="p-2.5 text-[10px] font-mono whitespace-nowrap">
                        <span className={item.inDataset ? "text-[#76b900]" : "text-[#757575]"}>
                          {item.inDataset ? t("inDataset") : t("noDataset")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Facilities */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-3">
              <Building2 className="h-4 w-4 text-[#76b900]" />
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-white">
                {t("facilitiesTitle")}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {data.facilities.map((facility) => (
                <div key={facility.id} className="bg-black border border-[#333333] p-3 space-y-1">
                  <div className="text-xs font-bold text-[#76b900]">{facility.name}</div>
                  <p className="text-[10px] text-[#a7a7a7] leading-relaxed">{facility.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partial-gravity gap */}
          <div className="mt-8 p-4 bg-black border-l-2 border-[#e040fb] border-t border-r border-b border-[#333333] flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-[#e040fb] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t("gapTitle")}
              </span>
              <p className="text-[11px] text-[#cccccc] mt-1 leading-relaxed">
                {facts?.partialGravityGap}
              </p>
            </div>
          </div>

          <p className="mt-5 text-[10px] font-mono text-[#757575] border-t border-[#262626] pt-3">
            {t("note")}
          </p>
        </>
      )}
    </section>
  );
}

function FactCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="bg-black border border-[#333333] p-3">
      <div className="text-lg font-bold font-mono" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-[#a7a7a7] leading-tight mt-0.5">{label}</div>
    </div>
  );
}
