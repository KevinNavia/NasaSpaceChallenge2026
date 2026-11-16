"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  FileText,
  ShieldCheck,
  ExternalLink,
  Flame,
  Activity,
  Radio,
  Cpu,
  Zap,
} from "lucide-react";

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoVideoModal({ isOpen, onClose }: DemoVideoModalProps) {
  const t = useTranslations("demoModal");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#0c0c0c] border border-[#333333] shadow-2xl p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto">
        {/* NVIDIA Corner accents */}
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#76b900]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#76b900]" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#222222] pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-[#76b900]/15 text-[#76b900] border border-[#76b900]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                {t("badge")}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase">
                {t("title")}
              </h3>
            </div>
            <p className="text-xs text-[#888888] font-mono">
              {t("subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-white border border-[#333333] hover:border-white transition-colors"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Grid: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Left Column: 9:16 Vertical Video Frame (Zero Black Bars) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] bg-black border border-[#2a2a2a] rounded-[3px] overflow-hidden shadow-2xl">
              {/* Corner brackets */}
              <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#76b900] z-10 pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#76b900] z-10 pointer-events-none" />
              <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#76b900] z-10 pointer-events-none" />
              <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#76b900] z-10 pointer-events-none" />

              {/* Status pill overlay */}
              <div className="absolute top-2.5 left-3 z-10 flex items-center space-x-1.5 px-2 py-0.5 bg-black/80 backdrop-blur border border-[#76b900]/40 text-[9px] font-mono text-[#76b900]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#76b900] animate-pulse" />
                <span>HIL LIVE · 60 FPS</span>
              </div>

              <video
                ref={videoRef}
                src="/media/STELLARAPP_Demo.mp4"
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2 text-[10px] font-mono text-[#666666] uppercase tracking-wider text-center">
              RP2040 (PICO W) ➔ SUNTON ESP32
            </div>
          </div>

          {/* Right Column: Step-by-Step Explanation & Specs & PDFs */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            {/* Step-by-step pipeline */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#76b900] font-bold flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4" />
                <span>{t("pipelineTitle")}</span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {/* Step 1 */}
                <div className="p-2.5 bg-[#121212] border border-[#222222] rounded-[2px] flex items-start space-x-2.5">
                  <div className="p-1.5 bg-[#221508] border border-[#ff6600]/40 text-[#ff8833] rounded shrink-0 mt-0.5">
                    <Flame className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">{t("step1Title")}</h4>
                    <p className="text-[11px] text-[#999999] leading-relaxed mt-0.5">{t("step1Desc")}</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-2.5 bg-[#121212] border border-[#222222] rounded-[2px] flex items-start space-x-2.5">
                  <div className="p-1.5 bg-[#0f1f14] border border-[#76b900]/40 text-[#76b900] rounded shrink-0 mt-0.5">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">{t("step2Title")}</h4>
                    <p className="text-[11px] text-[#999999] leading-relaxed mt-0.5">{t("step2Desc")}</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-2.5 bg-[#121212] border border-[#222222] rounded-[2px] flex items-start space-x-2.5">
                  <div className="p-1.5 bg-[#0e1726] border border-[#0088cc]/40 text-[#6ec8ff] rounded shrink-0 mt-0.5">
                    <Radio className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">{t("step3Title")}</h4>
                    <p className="text-[11px] text-[#999999] leading-relaxed mt-0.5">{t("step3Desc")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Specs Grid */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#777777]">
                {t("specsTitle")}
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 bg-[#101010] border border-[#222222] flex items-center space-x-2">
                  <Cpu className="h-3.5 w-3.5 text-[#76b900] shrink-0" />
                  <span className="truncate text-[#cccccc]">{t("specMcu")}</span>
                </div>
                <div className="p-2 bg-[#101010] border border-[#222222] flex items-center space-x-2">
                  <Zap className="h-3.5 w-3.5 text-[#76b900] shrink-0" />
                  <span className="truncate text-[#cccccc]">{t("specDisplay")}</span>
                </div>
                <div className="p-2 bg-[#101010] border border-[#222222] flex items-center space-x-2">
                  <Radio className="h-3.5 w-3.5 text-[#6ec8ff] shrink-0" />
                  <span className="truncate text-[#cccccc]">{t("specBaud")}</span>
                </div>
                <div className="p-2 bg-[#101010] border border-[#222222] flex items-center space-x-2">
                  <Activity className="h-3.5 w-3.5 text-[#6ec8ff] shrink-0" />
                  <span className="truncate text-[#cccccc]">{t("specLatency")}</span>
                </div>
              </div>
            </div>

            {/* Official PDF Downloads */}
            <div className="pt-2 border-t border-[#222222] space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                {t("dossierTitle")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {/* 1. Main NASA Report in English */}
                <a
                  href="/STELLARAPP_NASA_INGLES.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#14230b] hover:bg-[#1f3711] text-[#76b900] border border-[#76b900] rounded-[2px] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="font-bold text-[11px] truncate">{t("downloadEn")}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
                </a>

                {/* 2. Hardware & Software Technical Sheet */}
                <a
                  href="/StellarApp_Ficha_Tecnica_Hardware_Software.pdf?v=2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-black hover:bg-[#161616] text-white border border-[#444444] hover:border-white rounded-[2px] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="font-bold text-[11px] truncate">{t("downloadTech")}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 shrink-0 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
