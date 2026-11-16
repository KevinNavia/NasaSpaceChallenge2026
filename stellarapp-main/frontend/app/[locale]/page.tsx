"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import MetricsCards from "../../components/MetricsCards";
import ComparisonViewer from "../../components/ComparisonViewer";
import NASAOfficialFootage from "../../components/NASAOfficialFootage";
import AISimulator from "../../components/AISimulator";
import KalmanTelemetry from "../../components/KalmanTelemetry";
import EarthSpaceBridge from "../../components/EarthSpaceBridge";
import ExperimentCard from "../../components/ExperimentCard";
import AIAssistantModal from "../../components/AIAssistantModal";
import AnalyticsCharts from "../../components/AnalyticsCharts";
import FloatingAIAgent from "../../components/FloatingAIAgent";
import RankingTable from "../../components/RankingTable";
import EarthImpact from "../../components/EarthImpact";
import FireHistoryTimeline from "../../components/FireHistoryTimeline";
import ResourcesSection from "../../components/ResourcesSection";
import DemoVideoModal from "../../components/DemoVideoModal";
import { Experiment, MetricsData } from "../../types";
import { useLocale, useTranslations } from "next-intl";
import { Search, Sparkles, Terminal, ChevronRight, AlertTriangle, Play } from "lucide-react";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [selectedEnv, setSelectedEnv] = useState("all");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/metrics")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => {
        setMetrics({
          total_experiments: 11,
          unique_materials_count: 10,
          materials: ["PMMA", "Nomex", "Cotton", "ETFE", "n-Heptane"],
          cool_flame_detections: 3,
          max_flame_spread_rate_mms: 2.85,
          critical_risk_count: 6,
          missions_covered: ["Saffire-I", "Saffire-II", "Saffire-IV", "BASS-II", "FLEX-2", "ACME", "SAME"],
        });
      });

    fetch(`/api/experiments?lang=${locale}`)
      .then((res) => res.json())
      .then((data) => setExperiments(data))
      .catch(() => {
        fetch("/data/fallback_experiments.json")
          .then((r) => r.json())
          .then((d) => setExperiments(d))
          .catch(() => {});
      });
  }, [locale]);

  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch =
      exp.material.toLowerCase().includes(search.toLowerCase()) ||
      exp.mission.toLowerCase().includes(search.toLowerCase()) ||
      exp.flame_shape.toLowerCase().includes(search.toLowerCase());

    const matchesRisk = selectedRisk === "all" || exp.safety_risk_level.toLowerCase() === selectedRisk.toLowerCase();
    const matchesEnv =
      selectedEnv === "all" ||
      (selectedEnv === "0g" && exp.gravity_g < 0.01) ||
      (selectedEnv === "partial" && exp.gravity_g >= 0.01 && exp.gravity_g < 1.0) ||
      (selectedEnv === "1g" && exp.gravity_g >= 1.0);

    return matchesSearch && matchesRisk && matchesEnv;
  });

  const scrollToSimulator = () => {
    const el = document.getElementById("simulator-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAnalytics = () => {
    const el = document.getElementById("analytics-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openFloatingAI = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-floating-ai"));
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#cccccc] flex flex-col font-sans">
      <Navbar
        onOpenSimulator={scrollToSimulator}
        onOpenAnalytics={scrollToAnalytics}
      />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-10 space-y-16">
        {/* ========================================================
            FASE 1: EL RETO Y LA FÍSICA EN 0G (EL PROBLEMA)
           ======================================================== */}
        {/* 1.1 NVIDIA Hero Chapter */}
        <section className="relative bg-[#1a1a1a] border border-[#333333] p-8 sm:p-12">
          {/* Corner Square */}
          <div className="corner-square" />

          <div className="max-w-3xl space-y-5">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
              <Terminal className="h-4 w-4" />
              <span>{t("hero.eyebrow")}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              {t("hero.title")}
            </h1>

            <p className="text-sm sm:text-base text-[#a7a7a7] leading-relaxed">
              {t.rich("hero.body", {
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="px-6 py-3 bg-[#76b900] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#5a8d00] transition-colors flex items-center space-x-2 shadow-lg shadow-[#76b900]/20"
              >
                <Play className="h-4 w-4 fill-black" />
                <span>{t("hero.ctaDemo")}</span>
              </button>

              <button
                onClick={openFloatingAI}
                className="px-6 py-3 bg-black text-white border border-[#333333] hover:border-[#76b900] font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4 text-[#76b900]" />
                <span>{t("hero.ctaAI")}</span>
              </button>

              <button
                onClick={scrollToSimulator}
                className="px-6 py-3 bg-black text-white border border-[#333333] hover:border-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {t("hero.ctaSimulator")}
              </button>

              <button
                onClick={scrollToAnalytics}
                className="px-6 py-3 bg-black text-[#76b900] border border-[#76b900] hover:bg-[#76b900] hover:text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {t("hero.ctaCharts")}
              </button>
            </div>
          </div>
        </section>

        {/* 1.2 Lecciones Aprendidas & Antecedentes Históricos */}
        <FireHistoryTimeline />

        {/* 1.3 Comparativa Física Fundamental (1g vs 0g) */}
        <section>
          <ComparisonViewer />
        </section>

        {/* 1.4 Metraje y Evidencia Oficial de Video NASA */}
        <NASAOfficialFootage />

        {/* ========================================================
            FASE 2: DATOS CIENTÍFICOS Y CLASIFICACIÓN (LA EVIDENCIA)
           ======================================================== */}
        {/* 2.1 KPIs & Métricas Globales */}
        <section>
          <MetricsCards metrics={metrics} />
        </section>

        {/* 2.2 Catálogo Filtrable de Experimentos y Materiales */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#333333]">
            <div>
              <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
                {t("catalog.eyebrow")}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {t("catalog.title", { count: filteredExperiments.length })}
              </h2>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#757575]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("catalog.search")}
                  className="bg-black border border-[#333333] pl-9 pr-3 py-2 text-xs text-white placeholder-[#757575] focus:outline-none focus:border-[#76b900] w-52 sm:w-64"
                />
              </div>

              <select
                value={selectedEnv}
                onChange={(e) => setSelectedEnv(e.target.value)}
                className="bg-black border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#76b900]"
              >
                <option value="all">{t("catalog.allGravities")}</option>
                <option value="0g">{t("catalog.microgravity")}</option>
                <option value="partial">{t("catalog.partial")}</option>
                <option value="1g">{t("catalog.terrestrial")}</option>
              </select>

              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="bg-black border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#76b900]"
              >
                <option value="all">{t("catalog.allRisks")}</option>
                <option value="extreme">{t("catalog.extreme")}</option>
                <option value="critical">{t("catalog.critical")}</option>
                <option value="moderate">{t("catalog.moderate")}</option>
                <option value="low">{t("catalog.low")}</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredExperiments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiments.map((exp) => (
                <ExperimentCard key={exp.id} experiment={exp} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#1a1a1a] border border-[#333333] text-[#757575] space-y-2">
              <AlertTriangle className="h-8 w-8 mx-auto text-[#df6500]" />
              <p className="text-xs uppercase tracking-wider font-mono">{t("catalog.empty")}</p>
            </div>
          )}
        </section>

        {/* 2.3 Ranking Explicable de Hábitats Espaciales */}
        <section>
          <RankingTable />
        </section>

        {/* ========================================================
            FASE 3: INTELIGENCIA PREDICTIVA Y MODELADO (LA SOLUCIÓN)
           ======================================================== */}
        {/* 3.1 Simulador Atmosférico IA */}
        <section>
          <AISimulator />
        </section>

        {/* 3.2 Dashboard de Gráficos & Analítica Científica */}
        <section>
          <AnalyticsCharts />
        </section>

        {/* ========================================================
            FASE 4: HARDWARE-IN-THE-LOOP Y AVIÓNICA (VALIDACIÓN EN VIVO)
           ======================================================== */}
        {/* 4.1 Telemetría Kalman HIL (Pico W + Sunton ESP32 + Bot Telegram) */}
        <section>
          <KalmanTelemetry />
        </section>

        {/* ========================================================
            FASE 5: IMPACTO TERRESTRE Y RESPALDO DOCUMENTAL (EL SPINOFF)
           ======================================================== */}
        {/* 5.1 Puente Satelital Tierra-Espacio (NASA FIRMS & FRP) */}
        <section>
          <EarthSpaceBridge />
        </section>

        {/* 5.2 Transferencia Tecnológica & Spinoffs Terrestres */}
        <EarthImpact />

        {/* 5.3 Biblioteca Oficial y Recursos de la NASA (NASA PSI / NTRS) */}
        <section>
          <ResourcesSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333333] bg-black py-8 text-xs text-[#757575] mt-16">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            <strong>StellarApp</strong> • {t("footer.credit")}
          </p>
          <p className="text-[11px] font-mono">
            {t("footer.standard")}
          </p>
        </div>
      </footer>

      <AIAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
      <DemoVideoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <FloatingAIAgent />
    </div>
  );
}
