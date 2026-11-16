"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, ExternalLink, Scale, Trophy } from "lucide-react";

type Profile = "iss" | "artemis" | "lunar" | "rover" | "suit";

const PROFILES: Profile[] = ["iss", "artemis", "lunar", "rover", "suit"];

interface RankingResult {
  id: string;
  mission: string;
  material: string;
  environment: string;
  gravity_g: number;
  flame_spread_rate_mms: number;
  limiting_oxygen_index_pct: number;
  safety_risk_level: string;
  cool_flame_observed: boolean;
  soot_production: string;
  nasa_reference: string;
  score: number;
  rank: number;
  contributions: {
    flammability: number;
    spread: number;
    detectability: number;
    environment: number;
  };
  factors: {
    loi_margin_pct: number;
    spread_mms: number;
    soot: string;
    cool_flame: boolean;
    gravity_match: number;
  };
}

interface RankingResponse {
  profile: {
    id: string;
    name: string;
    description: string;
    o2_pct: number;
    pressure_kpa: number;
    gravity_g: number;
  };
  weights: Record<string, number>;
  results: RankingResult[];
}

const RISK_KEYS = ["extreme", "critical", "moderate", "low"];

function scoreColor(score: number) {
  if (score >= 75) return "#e52020";
  if (score >= 50) return "#df6500";
  return "#76b900";
}

export default function RankingTable() {
  const t = useTranslations("ranking");
  const tr = useTranslations("experimentCard");
  const locale = useLocale();

  const [profile, setProfile] = useState<Profile>("lunar");
  const [data, setData] = useState<RankingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/ranking?profile=${profile}&lang=${locale}`)
      .then((res) => res.json())
      .then((json) => {
        if (active) setData(json);
      })
      .catch(() => {
        if (active) setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [profile, locale]);

  const riskLabel = (level: string) => {
    const key = level.toLowerCase();
    return RISK_KEYS.includes(key) ? tr(`risk.${key}`) : level;
  };

  return (
    <div id="ranking-section" className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      <div className="corner-square" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#333333]">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
            <Trophy className="h-4 w-4" />
            <span>{t("eyebrow")}</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">{t("title")}</h2>
          <p className="text-xs text-[#898989] mt-0.5 max-w-3xl">{t("subtitle")}</p>
        </div>

        {/* Section Toggle Button */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
          className="self-start sm:self-center shrink-0 flex items-center space-x-2 px-3 py-1.5 border border-[#333333] hover:border-[#76b900] bg-black text-xs font-bold uppercase tracking-wider text-[#cccccc] hover:text-[#76b900] transition-colors"
        >
          <span>{isCollapsed ? t("expand") : t("collapse")}</span>
          {isCollapsed ? <ChevronDown className="h-4 w-4 text-[#76b900]" /> : <ChevronUp className="h-4 w-4 text-[#76b900]" />}
        </button>
      </div>

      {/* Collapsed summary preview */}
      {isCollapsed && (
        <div
          onClick={() => setIsCollapsed(false)}
          className="mt-4 p-3.5 bg-black border border-[#333333] hover:border-[#76b900] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
        >
          <div className="text-xs font-mono text-[#898989] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#76b900] animate-pulse" />
            <span>{t("collapsedSummary", { total: data?.results?.length || 14, profile: t(`profiles.${profile}`) })}</span>
          </div>
          <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-wider flex items-center gap-1">
            {t("expand")} <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </div>
      )}

      {!isCollapsed && (
        <>
          {/* Profile selector */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#757575] mr-1">
              {t("profileLabel")}
            </span>
            {PROFILES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setProfile(item)}
                aria-pressed={profile === item}
                className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                  profile === item
                    ? "bg-[#76b900] text-black border-[#76b900]"
                    : "bg-black text-[#cccccc] border-[#333333] hover:border-white"
                }`}
              >
                {t(`profiles.${item}`)}
              </button>
            ))}
          </div>

          {/* Profile metadata + weights */}
          {data && (
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-black border border-[#333333] p-3">
              <div className="text-[11px] text-[#a7a7a7]">
                <strong className="text-white uppercase tracking-wider mr-2">{data.profile.name}</strong>
                <span className="font-mono text-[#76b900]">
                  {t("profileAtmosphere", {
                    o2: data.profile.o2_pct,
                    pressure: data.profile.pressure_kpa,
                    gravity: data.profile.gravity_g,
                  })}
                </span>
                <p className="text-[10px] text-[#757575] mt-0.5">{data.profile.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#757575] mr-1">
                  {t("weights")}
                </span>
                {(["flammability", "spread", "detectability", "environment"] as const).map((key) => (
                  <span
                    key={key}
                    className="px-1.5 py-0.5 bg-[#111111] border border-[#333333] text-[10px] font-mono text-[#cccccc]"
                  >
                    {t(`factor.${key}`)}: <strong className="text-[#76b900]">{data.weights[key]}%</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Loading / empty */}
          {loading && (
            <div className="mt-6 h-40 flex items-center justify-center text-xs font-mono text-[#757575] uppercase tracking-wider">
              {t("loading")}
            </div>
          )}
          {!loading && !data && (
            <div className="mt-6 h-40 flex items-center justify-center text-xs font-mono text-[#757575]">
              {t("empty")}
            </div>
          )}

          {/* Ranking list */}
          {!loading && data && (
            <div className="mt-4 space-y-2">
              {(showAll ? data.results : data.results.slice(0, 3)).map((item) => {
                const isOpen = expanded === item.id;
                const color = scoreColor(item.score);
                return (
                  <div key={item.id} className="bg-black border border-[#333333]">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 p-3">
                      {/* Rank */}
                      <div className="flex items-center space-x-3 md:w-16 shrink-0">
                        <span
                          className="h-7 w-7 flex items-center justify-center font-mono text-xs font-bold border"
                          style={{ color, borderColor: color }}
                        >
                          {item.rank}
                        </span>
                        <Trophy className="h-3.5 w-3.5 md:hidden" style={{ color }} />
                      </div>

                      {/* Investigation */}
                      <div className="min-w-0 md:flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#898989]">
                          {item.mission}
                        </div>
                        <div className="text-xs font-bold text-white truncate">{item.material}</div>
                        <div className="text-[10px] text-[#757575] font-mono">{item.id}</div>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-3 md:w-72 shrink-0">
                        <div className="flex-1">
                          <div className="h-2 bg-[#141414] border border-[#262626] overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{ width: `${Math.min(100, item.score)}%`, backgroundColor: color }}
                            />
                          </div>
                          <div className="mt-0.5 flex justify-between text-[9px] font-mono text-[#757575]">
                            <span>{t("score")}</span>
                            <span style={{ color }}>{item.score.toFixed(1)} / 100</span>
                          </div>
                        </div>
                      </div>

                      {/* Risk + toggle */}
                      <div className="flex items-center justify-between md:justify-end gap-2 md:w-56 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#333333] text-[#cccccc]">
                          {riskLabel(item.safety_risk_level)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : item.id)}
                          aria-expanded={isOpen}
                          className="inline-flex items-center space-x-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#76b900] border border-[#76b900]/40 hover:bg-[#76b900] hover:text-black transition-colors"
                        >
                          <Scale className="h-3 w-3" />
                          <span>{isOpen ? t("hideWhy") : t("why")}</span>
                          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Explanation */}
                    {isOpen && (
                      <div className="border-t border-[#262626] p-4 space-y-3 bg-[#0d0d0d]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {/* Factor bars */}
                          {(["flammability", "spread", "detectability", "environment"] as const).map((key) => {
                            const value = item.contributions[key];
                            const max = data.weights[key];
                            return (
                              <div key={key}>
                                <div className="flex justify-between text-[10px] text-[#a7a7a7]">
                                  <span>{t(`factor.${key}`)}</span>
                                  <span className="font-mono text-[#76b900]">
                                    {value.toFixed(1)} / {max}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-[#141414] border border-[#262626] mt-1">
                                  <div
                                    className="h-full bg-[#76b900]"
                                    style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-[#a7a7a7]">
                          <span className="px-1.5 py-0.5 bg-black border border-[#333333]">
                            {t("loiMargin", { value: item.factors.loi_margin_pct })}
                          </span>
                          <span className="px-1.5 py-0.5 bg-black border border-[#333333]">
                            {t("spreadFactor", { value: item.factors.spread_mms })}
                          </span>
                          <span className="px-1.5 py-0.5 bg-black border border-[#333333]">
                            {t("sootFactor", { value: item.factors.soot })}
                          </span>
                          <span className="px-1.5 py-0.5 bg-black border border-[#333333]">
                            {t("environmentMatch", { value: Math.round(item.factors.gravity_match * 100) })}
                          </span>
                          {item.factors.cool_flame && (
                            <span className="px-1.5 py-0.5 bg-[#1a1111] border border-[#ef4444]/50 text-[#fca5a5]">
                              {t("coolFlame")}
                            </span>
                          )}
                        </div>

                        {item.nasa_reference && (
                          <a
                            href={`https://ntrs.nasa.gov/search?q=${encodeURIComponent(item.nasa_reference)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-[#76b900] hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>
                              {t("source")}: {item.nasa_reference}
                            </span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Show more / show less toggle */}
              {data.results.length > 3 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="w-full py-2.5 px-4 bg-black border border-[#333333] hover:border-[#76b900] text-[#cccccc] hover:text-[#76b900] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <span>
                      {showAll
                        ? t("showLess")
                        : t("showAll", { total: data.results.length })}
                    </span>
                    {showAll ? <ChevronUp className="h-4 w-4 text-[#76b900]" /> : <ChevronDown className="h-4 w-4 text-[#76b900]" />}
                  </button>
                </div>
              )}
            </div>
          )}

          <p className="mt-4 text-[10px] font-mono text-[#757575] leading-relaxed">{t("weightsNote")}</p>
        </>
      )}
    </div>
  );
}
