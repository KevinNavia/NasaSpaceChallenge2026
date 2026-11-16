"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "../../../navigation";
import KalmanTelemetry from "../../../components/KalmanTelemetry";
import LocaleSwitcher from "../../../components/LocaleSwitcher";
import ThemeToggle from "../../../components/ThemeToggle";
import FireHistoryTimeline from "../../../components/FireHistoryTimeline";
import EarthImpact from "../../../components/EarthImpact";
import { 
  Flame, 
  Database, 
  ChevronRight, 
  Check, 
  Sparkles, 
  AlertTriangle,
  Award,
  Terminal,
  ShieldCheck,
  Cpu,
  Activity,
  CheckCircle2,
  Zap,
  Send,
  Radio,
  QrCode,
  Menu,
  X,
  Play,
  Film,
  ZoomIn,
  ExternalLink,
  Presentation
} from "lucide-react";

export default function PitchLanding() {
  const t = useTranslations("pitch");
  const tf = useTranslations("footage");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    badge: string;
    badgeColor: string;
    desc: string;
    nasaId: string;
    nasaUrl: string;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
        setShowQRModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nasaPhotos = [
    {
      src: "/media/nasa/saffire-iv-pmma-flame.jpg",
      title: tf("photos.pmma.title"),
      badge: tf("photos.pmma.badge"),
      badgeColor: "text-[#76b900] border-[#76b900]/40",
      desc: tf("photos.pmma.desc"),
      nasaId: "jsc2023e046631",
      nasaUrl: "https://images.nasa.gov/details/jsc2023e046631"
    },
    {
      src: "/media/nasa/saffire-iv-fabric-flame.jpg",
      title: tf("photos.fabric.title"),
      badge: tf("photos.fabric.badge"),
      badgeColor: "text-[#df6500] border-[#df6500]/40",
      desc: tf("photos.fabric.desc"),
      nasaId: "jsc2023e046375",
      nasaUrl: "https://images.nasa.gov/details/jsc2023e046375"
    },
    {
      src: "/media/nasa/bass-ii-acrylic-flame.jpg",
      title: tf("photos.sphere.title"),
      badge: tf("photos.sphere.badge"),
      badgeColor: "text-[#00b0ff] border-[#00b0ff]/40",
      desc: tf("photos.sphere.desc"),
      nasaId: "iss040e072900",
      nasaUrl: "https://images.nasa.gov/details/iss040e072900"
    },
    {
      src: "/media/nasa/bass-ii-reduced-o2-flame.jpg",
      title: tf("photos.reducedO2.title"),
      badge: tf("photos.reducedO2.badge"),
      badgeColor: "text-[#e040fb] border-[#e040fb]/40",
      desc: tf("photos.reducedO2.desc"),
      nasaId: "iss040e086481",
      nasaUrl: "https://images.nasa.gov/details/iss040e086481"
    }
  ];

  const problems = [
    {
      title: t("problem.data.title"),
      desc: t("problem.data.desc"),
      icon: Database,
    },
    {
      title: t("problem.physics.title"),
      desc: t("problem.physics.desc"),
      icon: Flame,
    },
    {
      title: t("problem.artemis.title"),
      desc: t("problem.artemis.desc"),
      icon: AlertTriangle,
    },
    {
      title: t("problem.bridge.title"),
      desc: t("problem.bridge.desc"),
      icon: Terminal,
    },
  ];

  const valueProps = [
    {
      title: t("value.science.title"),
      desc: t("value.science.desc"),
    },
    {
      title: t("value.twin.title"),
      desc: t("value.twin.desc"),
    },
    {
      title: t("value.certification.title"),
      desc: t("value.certification.desc"),
    },
    {
      title: t("value.copilot.title"),
      desc: t("value.copilot.desc"),
    },
  ];

  const pitchQuestions = [1, 2, 3, 4, 5, 6].map((i) => ({
    q: t(`defense.q${i}.q`),
    a: t(`defense.q${i}.a`),
  }));

  const ralphLoopInnovations = [
    {
      title: t("innovations.tests.title"),
      desc: t("innovations.tests.desc"),
      metric: t("innovations.tests.metric"),
      icon: ShieldCheck,
      color: "text-[#76b900]",
      badge: t("innovations.tests.badge")
    },
    {
      title: t("innovations.psi.title"),
      desc: t("innovations.psi.desc"),
      metric: t("innovations.psi.metric"),
      icon: Database,
      color: "text-[#e040fb]",
      badge: t("innovations.psi.badge")
    },
    {
      title: t("innovations.engine.title"),
      desc: t("innovations.engine.desc"),
      metric: t("innovations.engine.metric"),
      icon: Zap,
      color: "text-[#00b0ff]",
      badge: t("innovations.engine.badge")
    },
    {
      title: t("innovations.thermal.title"),
      desc: t("innovations.thermal.desc"),
      metric: t("innovations.thermal.metric"),
      icon: Activity,
      color: "text-[#df6500]",
      badge: t("innovations.thermal.badge")
    },
    {
      title: t("innovations.assistant.title"),
      desc: t("innovations.assistant.desc"),
      metric: t("innovations.assistant.metric"),
      icon: Cpu,
      color: "text-[#76b900]",
      badge: t("innovations.assistant.badge")
    }
  ];

  return (
    <div className="min-h-screen bg-black text-[#cccccc] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-[#333333] bg-black sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="h-7 w-7 bg-[#76b900] flex items-center justify-center">
              <Flame className="h-4 w-4 text-black fill-black" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-base sm:text-lg tracking-wider text-white">
                STELLAR<span className="text-[#76b900]">APP</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#898989] uppercase border-l border-[#333333] pl-2 hidden xs:inline">
                {t("nav.badge")}
              </span>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle className="rounded-[2px]" />
            <LocaleSwitcher className="rounded-[2px]" />

            <a
              href="/pitch-deck.html"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 inline-flex items-center space-x-1.5 px-3 text-xs font-bold uppercase tracking-wider bg-[#76b900] hover:bg-[#5a8d00] text-black rounded-[2px] box-border transition-colors shadow-sm shadow-[#76b900]/20"
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>{t("nav.deck3d")}</span>
            </a>

            <a
              href="#kalman"
              className="h-8 inline-flex items-center space-x-1.5 px-3 text-xs font-bold uppercase tracking-wider bg-black hover:bg-[#111111] text-[#76b900] border border-[#76b900] rounded-[2px] box-border transition-colors"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>{t("nav.hardware")}</span>
            </a>

            <button
              onClick={() => setShowQRModal(true)}
              className="h-8 inline-flex items-center space-x-1.5 px-3 text-xs font-bold uppercase tracking-wider bg-[#0088cc] hover:bg-[#0077b5] text-white border border-[#0099e6] rounded-[2px] box-border transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{t("nav.bot")}</span>
            </button>

            <Link
              href="/"
              className="h-8 inline-flex items-center space-x-1.5 px-3.5 text-xs font-bold uppercase tracking-wider bg-[#76b900] text-black hover:bg-[#5a8d00] rounded-[2px] box-border transition-colors"
            >
              <span>{t("nav.workbench")}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Hamburger & Actions */}
          <div className="flex sm:hidden items-center space-x-2">
            <ThemeToggle className="rounded-[2px]" />
            <LocaleSwitcher className="rounded-[2px]" />
            <button
              onClick={() => setShowQRModal(true)}
              className="p-1.5 bg-[#0088cc] text-white rounded-[2px] border border-[#0099e6]"
              aria-label={t("nav.openQr")}
            >
              <Send className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-white hover:text-[#76b900] border border-[#333333] bg-[#111111] transition-colors rounded-[2px]"
              aria-label={t("nav.openMenu")}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-[#0d0d0d] border-b border-[#333333] px-5 py-4 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
            <a
              href="/pitch-deck.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#76b900] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#5a8d00] transition-colors rounded-[2px]"
            >
              <div className="flex items-center space-x-2">
                <Presentation className="h-4 w-4" />
                <span>{t("nav.deck3d")}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>

            <a
              href="#kalman"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-black border border-[#76b900] text-[#76b900] text-xs font-bold uppercase tracking-wider hover:bg-[#111111] transition-colors rounded-[2px]"
            >
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>{t("nav.hardwareShort")}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </a>

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#76b900] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#5a8d00] transition-colors rounded-[2px]"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 fill-black" />
                <span>{t("nav.openWorkbench")}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setShowQRModal(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-[2px]"
            >
              <div className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>{t("nav.connectBot")}</span>
              </div>
              <QrCode className="h-4 w-4" />
            </button>

            <Link
              href="/#kalman-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center space-x-2 px-3.5 py-2.5 border border-[#333333] text-white text-xs font-bold uppercase tracking-wider bg-black/60 hover:border-white transition-colors rounded-[2px]"
            >
              <Radio className="h-4 w-4 text-[#76b900]" />
              <span>{t("nav.kalman")}</span>
            </Link>
          </div>
        )}
      </header>

      {/* Telegram Audience QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#111111] border-2 border-[#0088cc] shadow-2xl p-6 text-center space-y-4">
            <div className="corner-square border-[#0088cc]" />
            <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
              <div className="flex items-center space-x-2 text-[#0088cc]">
                <Send className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">{t("qr.title")}</span>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-[#888888] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 bg-white border border-[#0088cc]/50 inline-block shadow-lg">
              <Image
                src="/images/telegram-bot-qr.png"
                alt={t("qr.alt")}
                width={200}
                height={200}
                className="mx-auto"
                priority
              />
            </div>

            <div className="space-y-1.5 font-mono">
              <p className="text-xs text-white font-bold">@Stellar_App_bot</p>
              <p className="text-[11px] text-[#aaaaaa] leading-relaxed">
                {t("qr.desc")}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://t.me/Stellar_App_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-block text-center"
              >
                {t("qr.open")}
              </a>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-1.5 bg-black border border-[#333333] hover:border-white text-xs text-[#aaaaaa] uppercase tracking-wider transition-colors"
              >
                {t("qr.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for NASA Photo Enlargement */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#111111] border-2 border-[#76b900] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[94vh] overflow-hidden rounded-[2px]"
          >
            <div className="corner-square border-[#76b900]" />

            {/* Modal Header */}
            <div className="p-3 sm:p-4 bg-[#1a1a1a] border-b border-[#333333] flex items-center justify-between select-none">
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className={`text-[10px] font-mono px-2 py-0.5 bg-black border shrink-0 ${selectedImage.badgeColor}`}>
                  {selectedImage.badge}
                </span>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
                  {selectedImage.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={selectedImage.src}
                  target="_blank"
                  rel="noreferrer"
                  title={t("lightbox.open")}
                  className="p-1.5 text-[#898989] hover:text-[#76b900] hover:bg-black transition-colors border border-[#333333]"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 text-[#898989] hover:text-white hover:bg-[#262626] transition-colors border border-[#333333]"
                  title={t("lightbox.closeEsc")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Enlarged Image Display */}
            <div className="flex-1 bg-black p-2 sm:p-4 flex items-center justify-center overflow-hidden min-h-[300px]">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[60vh] sm:max-h-[68vh] w-auto max-w-full object-contain border border-[#222222] shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 bg-[#141414] border-t border-[#333333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-[#cccccc] text-[11px] sm:text-xs leading-relaxed max-w-2xl">
                  {selectedImage.desc}
                </p>
                <div className="flex items-center space-x-3 text-[10px] font-mono text-[#898989]">
                  <span>NASA ID: <strong className="text-[#76b900]">{selectedImage.nasaId}</strong></span>
                  <span>•</span>
                  <span>{t("lightbox.publicDomain")}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-end">
                <a
                  href={selectedImage.nasaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-[#76b900] hover:text-white border border-[#76b900]/40 text-[11px] font-mono font-bold uppercase transition-colors"
                >
                  <span>NASA.gov</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-3.5 py-1.5 bg-[#76b900] hover:bg-[#5a8d00] text-black font-bold uppercase text-[11px] tracking-wider transition-colors"
                >
                  {t("lightbox.close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-12 space-y-16">
        {/* Pitch Hero */}
        <div className="relative bg-[#1a1a1a] border border-[#333333] p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6">
          {/* Corner Square */}
          <div className="corner-square" />

          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-black border border-[#76b900] text-[#76b900] text-xs font-bold uppercase tracking-widest">
            <Award className="h-3.5 w-3.5" />
            <span>{t("hero.challenge")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {t("hero.title")}
          </h1>

          <p className="text-sm sm:text-base text-[#a7a7a7] max-w-2xl mx-auto leading-relaxed">
            {t.rich("hero.subtitle", { b: (chunks) => <strong>{chunks}</strong> })}
          </p>

          {/* Mission Objective Callout */}
          <div className="bg-black/90 border border-[#76b900]/60 p-4 sm:p-5 text-left font-mono space-y-1.5 shadow-lg shadow-black">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#76b900] tracking-wider">
                {t("hero.objectiveLabel")}
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-[#76b900]/10 border border-[#76b900]/40 text-[#76b900]">
                {t("hero.missionBadge")}
              </span>
            </div>
            <p className="text-xs text-white leading-relaxed">
              {t.rich("hero.objective", { b: (chunks) => <strong>{chunks}</strong> })}
            </p>
          </div>

          {/* KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-black border border-[#333333] text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#76b900]">{t("hero.kpiYears")}</div>
              <div className="text-[10px] uppercase font-mono text-[#898989]">{t("hero.kpiYearsLabel")}</div>
            </div>
            <div className="p-3 bg-black border border-[#333333] text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#00b0ff]">{t("hero.kpiStudies")}</div>
              <div className="text-[10px] uppercase font-mono text-[#898989]">{t("hero.kpiStudiesLabel")}</div>
            </div>
            <div className="p-3 bg-black border border-[#333333] text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#e040fb]">{t("hero.kpiLatency")}</div>
              <div className="text-[10px] uppercase font-mono text-[#898989]">{t("hero.kpiLatencyLabel")}</div>
            </div>
            <div className="p-3 bg-black border border-[#76b900]/40 text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">{t("hero.kpiTests")}</div>
              <div className="text-[10px] uppercase font-mono text-[#76b900]">{t("hero.kpiTestsLabel")}</div>
            </div>
          </div>

          {/* Interactive 3D Pitch Deck Card */}
          <div className="relative bg-[#0b101d] border-2 border-[#76b900] p-6 sm:p-7 text-left space-y-4 shadow-2xl shadow-[#76b900]/15">
            <div className="corner-square border-[#76b900]" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#76b900]/30 pb-3">
              <div className="flex items-center space-x-2 text-[#76b900]">
                <Presentation className="h-5 w-5 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  {t("hero.deckBadge")}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#76b900]/20 text-[#76b900] border border-[#76b900]/50 rounded-[2px] w-fit">
                8 SLIDES · 0g THREE.JS · HIL TELEMETRY
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {t("hero.deckTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-[#a7a7a7] leading-relaxed">
                {t("hero.deckDesc")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="/pitch-deck.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#76b900] hover:bg-[#5a8d00] text-black font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center space-x-2 rounded-[2px]"
              >
                <Play className="h-4 w-4 fill-black" />
                <span>{t("hero.ctaDeck")}</span>
              </a>
              <a
                href="/pitch-deck.html"
                className="px-4 py-2.5 bg-black hover:bg-[#111111] text-white border border-[#333333] hover:border-[#76b900] font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center space-x-1.5 rounded-[2px]"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#76b900]" />
                <span>{t("hero.ctaDeckWindow")}</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="px-6 py-3 bg-[#76b900] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#5a8d00] transition-colors flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4 fill-black" />
              <span>{t("hero.ctaDashboard")}</span>
            </Link>
            <a
              href="#defensa"
              className="px-6 py-3 bg-black text-white border border-[#333333] hover:border-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              {t("hero.ctaDefense")}
            </a>
          </div>
        </div>

        {/* 1. El Problema */}
        <section className="space-y-6">
          <div>
            <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
              {t("problem.eyebrow")}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {t("problem.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {problems.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="relative bg-[#1a1a1a] border border-[#333333] p-6">
                  <div className="corner-square" />
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon className="h-4 w-4 text-[#76b900]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{p.title}</h3>
                  </div>
                  <p className="text-xs text-[#a7a7a7] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. ¿Para qué sirve y cómo ayuda a la NASA? */}
        <section className="bg-[#1a1a1a] border border-[#333333] p-8 sm:p-12 relative">
          <div className="corner-square" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
                {t("value.eyebrow")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {t("value.title")}
              </h2>
              <p className="text-xs sm:text-sm text-[#a7a7a7] leading-relaxed">
                {t("value.intro")}
              </p>
              <div className="space-y-3 pt-2">
                {valueProps.map((vp, idx) => (
                  <div key={idx} className="p-4 bg-black border border-[#333333]">
                    <h4 className="text-xs font-bold text-[#76b900] uppercase tracking-wider">{vp.title}</h4>
                    <p className="text-xs text-[#cccccc] mt-1 leading-relaxed">{vp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-[#76b900]">95%</div>
                <div className="text-[11px] font-bold uppercase text-white">{t("value.rateTitle")}</div>
                <p className="text-[10px] text-[#757575]">{t("value.rateDesc")}</p>
              </div>
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-white">0.0001g</div>
                <div className="text-[11px] font-bold uppercase text-white">{t("value.microTitle")}</div>
                <p className="text-[10px] text-[#757575]">{t("value.microDesc")}</p>
              </div>
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-[#76b900]">&lt; 1.2 cm/s</div>
                <div className="text-[11px] font-bold uppercase text-white">{t("value.extinctionTitle")}</div>
                <p className="text-[10px] text-[#757575]">{t("value.extinctionDesc")}</p>
              </div>
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-white">STD-6001</div>
                <div className="text-[11px] font-bold uppercase text-white">{t("value.standardTitle")}</div>
                <p className="text-[10px] text-[#757575]">{t("value.standardDesc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Innovaciones Técnicas y Mejoras Ralph Loop */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
                {t("innovations.eyebrow")}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {t("innovations.title")}
              </h2>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1a1a1a] border border-[#333333] text-xs font-mono text-[#76b900]">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t("innovations.badge")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ralphLoopInnovations.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative bg-[#1a1a1a] border border-[#333333] p-6 flex flex-col justify-between">
                  <div className="corner-square" />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-5 w-5 ${item.color}`} />
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-black border border-[#333333] text-white">
                          {item.badge}
                        </span>
                      </div>
                      <span className={`text-sm font-mono font-bold ${item.color}`}>
                        {item.metric}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.title}</h3>
                    <p className="text-xs text-[#a7a7a7] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Showcase: Astronaut Mascot & Floating HUD */}
          <div className="relative bg-gradient-to-r from-[#111111] via-[#161616] to-[#111111] border border-[#333333] p-6 sm:p-8">
            <div className="corner-square" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-3 flex justify-center">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-[#0a0a0a] border border-[#333333] p-2 flex items-center justify-center shadow-lg shadow-black/80">
                  <Image
                    src="/images/astronaut-agent.png"
                    alt={t("assistant.alt")}
                    width={140}
                    height={140}
                    className="object-contain filter drop-shadow-[0_0_12px_rgba(118,185,0,0.3)]"
                  />
                  <div className="absolute -bottom-2 px-2 py-0.5 bg-[#76b900] text-black font-mono text-[9px] font-bold uppercase">
                    {t("assistant.hudBadge")}
                  </div>
                </div>
              </div>

              <div className="md:col-span-9 space-y-3">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-black border border-[#76b900] text-[#76b900] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>{t("assistant.badge")}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {t("assistant.title")}
                </h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  {t.rich("assistant.body", { b: (chunks) => <strong>{chunks}</strong> })}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2 py-1 bg-black border border-[#333333] text-[11px] font-mono text-[#a7a7a7]">
                    {t("assistant.tagOffline")}
                  </span>
                  <span className="px-2 py-1 bg-black border border-[#333333] text-[11px] font-mono text-[#a7a7a7]">
                    {t("assistant.tagGuardrails")}
                  </span>
                  <span className="px-2 py-1 bg-black border border-[#333333] text-[11px] font-mono text-[#a7a7a7]">
                    {t("assistant.tagThermal")}
                  </span>
                  <span className="px-2 py-1 bg-black border border-[#76b900]/40 text-[11px] font-mono text-[#76b900]">
                    {t("assistant.tagPsi")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Showcase 2: Live Audience Telegram Bot & QR Code */}
          <div className="relative bg-gradient-to-r from-[#0d1b2a] via-[#102030] to-[#0d1b2a] border border-[#0088cc]/60 p-6 sm:p-8 mt-6">
            <div className="corner-square border-[#0088cc]" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* QR Code Column */}
              <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3">
                <div className="relative bg-white p-3 border-2 border-[#0088cc] shadow-xl shadow-[#0088cc]/20">
                  <Image
                    src="/images/telegram-bot-qr.png"
                    alt={t("telegram.alt")}
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#0088cc] text-white font-mono text-[9px] font-bold uppercase whitespace-nowrap">
                    {t("telegram.scan")}
                  </div>
                </div>
                <a
                  href="https://t.me/Stellar_App_bot"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>@Stellar_App_bot</span>
                </a>
              </div>

              {/* Pitch & Instructions Column */}
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-black border border-[#0088cc] text-[#0088cc] text-[10px] font-bold uppercase tracking-wider">
                  <Radio className="h-3 w-3 animate-pulse" />
                  <span>{t("telegram.badge")}</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-white">
                  {t("telegram.title")}
                </h3>

                <p className="text-xs sm:text-sm text-[#cccccc] leading-relaxed">
                  {t.rich("telegram.body", { b: (chunks) => <strong>{chunks}</strong> })}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-black/60 border border-[#333333] space-y-1">
                    <span className="text-[10px] font-bold text-[#0088cc] uppercase block">
                      {t("telegram.step1Title")}
                    </span>
                    <p className="text-[11px] text-[#a7a7a7]">
                      {t.rich("telegram.step1Desc", { b: (chunks) => <strong>{chunks}</strong> })}
                    </p>
                  </div>

                  <div className="p-3 bg-black/60 border border-[#333333] space-y-1">
                    <span className="text-[10px] font-bold text-[#76b900] uppercase block">
                      {t("telegram.step2Title")}
                    </span>
                    <p className="text-[11px] text-[#a7a7a7]">
                      {t.rich("telegram.step2Desc", { b: (chunks) => <strong>{chunks}</strong> })}
                    </p>
                  </div>

                  <div className="p-3 bg-black/60 border border-[#333333] space-y-1">
                    <span className="text-[10px] font-bold text-[#ffb703] uppercase block">
                      {t("telegram.step3Title")}
                    </span>
                    <p className="text-[11px] text-[#a7a7a7]">
                      {t("telegram.step3Desc")}
                    </p>
                  </div>

                  <div className="p-3 bg-black/60 border border-[#333333] space-y-1">
                    <span className="text-[10px] font-bold text-[#ff0055] uppercase block">
                      {t("telegram.step4Title")}
                    </span>
                    <p className="text-[11px] text-[#a7a7a7]">
                      {t.rich("telegram.step4Desc", { b: (chunks) => <strong>{chunks}</strong> })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hardware-in-the-Loop & Algoritmo Filtro de Kalman */}
        <section id="kalman" className="space-y-4">
          <KalmanTelemetry />
        </section>

        {/* Evidencia en Video y Fotografía Oficial NASA */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#333333] pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-black border border-[#76b900] text-[#76b900] text-[10px] font-bold uppercase tracking-wider mb-2">
                <Film className="h-3 w-3" />
                <span>{tf("eyebrow")}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {tf("title")}
              </h2>
              <p className="text-xs text-[#a7a7a7] mt-1">
                {tf.rich("subtitle", { b: (chunks) => <strong>{chunks}</strong> })}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#898989] shrink-0">
              {tf("archive")}
            </span>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video 1: Saffire-V */}
            <div className="bg-[#1a1a1a] border border-[#333333] p-4 space-y-3 relative">
              <div className="corner-square" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-[#76b900]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {tf("video1Title")}
                  </h3>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-black border border-[#76b900]/40 text-[#76b900]">
                  {tf("officialVideo")}
                </span>
              </div>
              <div className="relative rounded overflow-hidden bg-black border border-[#222222]">
                <video
                  src="/media/nasa/saffire-v-pmma-flame.mp4"
                  controls
                  preload="metadata"
                  className="w-full aspect-video object-cover"
                />
              </div>
              <div className="space-y-1 font-sans">
                <p className="text-[11px] text-[#cccccc] leading-relaxed">
                  {tf("video1Desc")}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#757575] pt-1 border-t border-[#2a2a2a]">
                  <span>ID: GRC-2021-CN-00008</span>
                  <a
                    href="https://images.nasa.gov/details/GRC-2021-CN-00008"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#76b900] hover:underline"
                  >
                    {tf("viewOnNasa")}
                  </a>
                </div>
              </div>
            </div>

            {/* Video 2: SoFIE-GEL */}
            <div className="bg-[#1a1a1a] border border-[#333333] p-4 space-y-3 relative">
              <div className="corner-square" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-[#00b0ff]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {tf("video2Title")}
                  </h3>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-black border border-[#00b0ff]/40 text-[#00b0ff]">
                  {tf("officialVideo")}
                </span>
              </div>
              <div className="relative rounded overflow-hidden bg-black border border-[#222222]">
                <video
                  src="/media/nasa/sofie-flame-extinction.mp4"
                  controls
                  preload="metadata"
                  className="w-full aspect-video object-cover"
                />
              </div>
              <div className="space-y-1 font-sans">
                <p className="text-[11px] text-[#cccccc] leading-relaxed">
                  {tf("video2Desc")}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#757575] pt-1 border-t border-[#2a2a2a]">
                  <span>ID: SoFIE-GEL</span>
                  <a
                    href="https://images.nasa.gov/details/SoFIE-GEL"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00b0ff] hover:underline"
                  >
                    {tf("viewOnNasa")}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* High-Res Photo Gallery (Clickable / Expandable Lightbox) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {nasaPhotos.map((photo, pIdx) => (
              <div
                key={pIdx}
                onClick={() => setSelectedImage(photo)}
                className="group bg-[#141414] hover:bg-[#1a1a1a] border border-[#333333] hover:border-[#76b900] p-2.5 space-y-2 cursor-pointer transition-all duration-200 select-none"
              >
                <div className="relative aspect-video sm:aspect-square bg-black overflow-hidden border border-[#2a2a2a] group-hover:border-[#76b900]/60">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Hover Overlay with Zoom Indicator */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="px-2 py-1 bg-black/90 border border-[#76b900] text-[#76b900] text-[10px] font-mono font-bold flex items-center space-x-1 shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <ZoomIn className="h-3.5 w-3.5" />
                      <span>{tf("enlarge")}</span>
                    </span>
                  </div>
                  <span className={`absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/85 text-[9px] font-mono border ${photo.badgeColor}`}>
                    {photo.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white group-hover:text-[#76b900] transition-colors uppercase leading-snug">
                    {photo.title}
                  </h4>
                  <p className="text-[10px] text-[#898989] leading-tight mt-0.5 line-clamp-2">
                    {photo.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Defensa ante Jueces */}
        <FireHistoryTimeline />

        <EarthImpact />

        <section id="defensa" className="space-y-6">
          <div>
            <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
              {t("defense.eyebrow")}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {t("defense.title")}
            </h2>
          </div>

          <div className="space-y-4">
            {pitchQuestions.map((item, idx) => (
              <div key={idx} className="p-6 bg-[#1a1a1a] border border-[#333333] space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-black border border-[#76b900] text-[#76b900] font-mono text-xs font-bold">
                    Q{idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase">{item.q}</h3>
                </div>
                <p className="text-xs text-[#cccccc] pl-7 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-8 bg-[#1a1a1a] border border-[#76b900] text-center space-y-4 relative">
          <div className="corner-square" />
          <h3 className="text-xl font-bold text-white uppercase">{t("cta.title")}</h3>
          <p className="text-xs text-[#a7a7a7] max-w-xl mx-auto">
            {t("cta.body")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#76b900] text-black font-bold uppercase tracking-wider text-xs hover:bg-[#5a8d00] transition-colors"
          >
            <span>{t("cta.button")}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#333333] bg-black py-8 text-center text-xs text-[#757575]">
        <p>{t("footer")}</p>
        <p className="mt-2 text-[10px] font-mono text-[#5c5c5c] flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <a href="https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/" target="_blank" rel="noreferrer" className="hover:text-[#76b900] underline-offset-2 hover:underline">
            Flame in Freefall
          </a>
          <span>·</span>
          <a href="https://psi.nasa.gov/physci/repo/search?q=combustion" target="_blank" rel="noreferrer" className="hover:text-[#76b900] underline-offset-2 hover:underline">
            NASA PSI
          </a>
          <span>·</span>
          <a href="https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/" target="_blank" rel="noreferrer" className="hover:text-[#76b900] underline-offset-2 hover:underline">
            NASA Combustion Science
          </a>
          <span>·</span>
          <a href="https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/" target="_blank" rel="noreferrer" className="hover:text-[#76b900] underline-offset-2 hover:underline">
            Researcher&apos;s Guide (2015)
          </a>
        </p>
      </footer>
    </div>
  );
}
