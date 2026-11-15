"use client";
import { useLanguage } from "../i18n/LanguageContext";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MetricsCards from "../components/MetricsCards";
import ComparisonViewer from "../components/ComparisonViewer";
import NASAOfficialFootage from "../components/NASAOfficialFootage";
import AISimulator from "../components/AISimulator";
import KalmanTelemetry from "../components/KalmanTelemetry";
import EarthSpaceBridge from "../components/EarthSpaceBridge";
import ExperimentCard from "../components/ExperimentCard";
import AIAssistantModal from "../components/AIAssistantModal";
import AnalyticsCharts from "../components/AnalyticsCharts";
import FloatingAIAgent from "../components/FloatingAIAgent";
import { Experiment, MetricsData } from "../types";
import { Search, Sparkles, Terminal, ChevronRight, AlertTriangle } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [selectedEnv, setSelectedEnv] = useState("all");
  const [aiModalOpen, setAiModalOpen] = useState(false);

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

    fetch("/api/experiments")
      .then((res) => res.json())
      .then((data) => setExperiments(data))
      .catch(() => {
        fetch("/data/fallback_experiments.json")
          .then((r) => r.json())
          .then((d) => setExperiments(d))
          .catch(() => {});
      });
  }, []);

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
        {/* NVIDIA Hero Chapter */}
        <section className="relative bg-[#1a1a1a] border border-[#333333] p-8 sm:p-12">
          {/* Corner Square */}
          <div className="corner-square" />

          <div className="max-w-3xl space-y-5">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
              <Terminal className="h-4 w-4" />
              <span>{t("SISTEMA DE INTELIGENCIA DE SEGURIDAD CONTRA INCENDIOS")}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              {t("Combustión en Microgravedad: Predicción y Seguridad para Artemis & Marte\n            ")}</h1>

            <p className="text-sm sm:text-base text-[#a7a7a7] leading-relaxed">
              {t("La NASA ha recopilado cuatro décadas de datos experimentales en la ISS y naves Cygnus (Saffire, BASS, FLEX). \n              ")}<strong> {t("StellarApp")}</strong> {t("sintetiza, clasifica e interpreta esta física con IA para salvaguardar a la tripulación en hábitats presurizados lunares y marcianos.\n            ")}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={openFloatingAI}
                className="px-6 py-3 bg-[#76b900] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#5a8d00] transition-colors flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4 fill-black" />
                <span>{t("CONSULTAR AGENTE IA NASA")}</span>
              </button>

              <button
                onClick={scrollToSimulator}
                className="px-6 py-3 bg-black text-white border border-[#333333] hover:border-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {t("WORKBENCH DE SIMULACIÓN\n              ")}</button>

              <button
                onClick={scrollToAnalytics}
                className="px-6 py-3 bg-black text-[#76b900] border border-[#76b900] hover:bg-[#76b900] hover:text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {t("DASHBOARD DE GRÁFICOS\n              ")}</button>
            </div>
          </div>
        </section>

        {/* 1. KPIs & Metrics */}
        <section>
          <MetricsCards metrics={metrics} />
        </section>

        {/* 2. Physical Comparison (1g vs 0g) */}
        <section>
          <ComparisonViewer />
        </section>

        {/* 2.5 Official NASA Video & Photo Evidence */}
        <NASAOfficialFootage />

        {/* 3. AI Atmospheric Simulator */}
        <section>
          <AISimulator />
        </section>

        {/* 4. Kalman Filter Gas Toxicity Telemetry */}
        <section>
          <KalmanTelemetry />
        </section>

        {/* 5. Earth-to-Space Fire Bridge (NASA FIRMS & FRP) */}
        <section>
          <EarthSpaceBridge />
        </section>

        {/* 6. Scientific Analytics & Charts Dashboard */}
        <section>
          <AnalyticsCharts />
        </section>

        {/* 7. Filterable Experiment Catalog */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#333333]">
            <div>
              <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
                {t("CATÁLOGO DE EXPERIMENTOS OFICIALES\n              ")}</span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {t("Datos de Vuelo: Saffire, BASS-II & FLEX-2 (")}{filteredExperiments.length} {t("registrados)\n              ")}</h2>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#757575]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("Buscar material o misión...")}
                  className="bg-black border border-[#333333] pl-9 pr-3 py-2 text-xs text-white placeholder-[#757575] focus:outline-none focus:border-[#76b900] w-52 sm:w-64"
                />
              </div>

              <select
                value={selectedEnv}
                onChange={(e) => setSelectedEnv(e.target.value)}
                className="bg-black border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#76b900]"
              >
                <option value="all">{t("Todas las Gravedades")}</option>
                <option value="0g">{t("Microgravedad (0g)")}</option>
                <option value="partial">{t("Parcial (Luna / Marte)")}</option>
                <option value="1g">{t("Terrestre (1g)")}</option>
              </select>

              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="bg-black border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#76b900]"
              >
                <option value="all">{t("Todos los Riesgos")}</option>
                <option value="extreme">{t("Extremo (Artemis 26% O₂)")}</option>
                <option value="critical">{t("Crítico")}</option>
                <option value="moderate">{t("Moderado")}</option>
                <option value="low">{t("Bajo (Auto-extinguible)")}</option>
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
              <p className="text-xs uppercase tracking-wider font-mono">{t("No se encontraron experimentos coincidentes.")}</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333333] bg-black py-8 text-xs text-[#757575] mt-16">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            <strong>{t("StellarApp")}</strong> {t("• NASA International Space Apps Challenge 2026.\n          ")}</p>
          <p className="text-[11px] font-mono">
            {t("ESTÁNDAR: NASA-STD-6001 | DATOS: NASA PSI & NTRS\n          ")}</p>
        </div>
      </footer>

      <AIAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
      <FloatingAIAgent />
    </div>
  );
}
