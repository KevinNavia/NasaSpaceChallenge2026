"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Flame, Compass, Sparkles, Presentation, Radio, Globe2, BarChart3, Send, X, QrCode, Menu } from "lucide-react";
import { Link } from "../navigation";
import LocaleSwitcher from "./LocaleSwitcher";

interface NavbarProps {
  onOpenSimulator: () => void;
  onOpenAnalytics?: () => void;
  onOpenAI?: () => void;
}

interface ISSTelemetry {
  latitude: number;
  longitude: number;
  altitude_km: number;
  velocity_kmh: number;
  is_live: boolean;
}

export default function Navbar({ onOpenAI, onOpenSimulator, onOpenAnalytics }: NavbarProps) {
  const t = useTranslations("nav");
  const [iss, setIss] = useState<ISSTelemetry | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [subCount, setSubCount] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchSubscribers = () => {
    fetch("/api/telegram/status")
      .then((res) => res.json())
      .then((data) => setSubCount(data.subscribers_count))
      .catch(() => {});
  };

  useEffect(() => {
    const fetchISS = () => {
      fetch("/api/iss/live")
        .then((res) => res.json())
        .then((data) => setIss(data))
        .catch(() => {});
    };
    fetchISS();
    const interval = setInterval(fetchISS, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-[#333333]">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-7 w-7 bg-[#76b900] flex items-center justify-center">
            <Flame className="h-4 w-4 text-black fill-black" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-base sm:text-lg tracking-wider text-white">
              STELLAR<span className="text-[#76b900]">APP</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#898989] uppercase border-l border-[#333333] pl-2 hidden sm:inline">
              {t("brandSuffix")}
            </span>
          </div>
        </Link>

        {/* Live ISS Orbital Telemetry Widget */}
        <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 bg-[#1a1a1a] border border-[#333333] text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-[#76b900]">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">{t("issLive")}</span>
          </div>
          {iss ? (
            <div className="flex items-center space-x-2 text-[#cccccc]">
              <span>{t("alt")}: <strong className="text-white">{iss.altitude_km} km</strong></span>
              <span className="text-[#333333]">|</span>
              <span>{t("vel")}: <strong className="text-white">{iss.velocity_kmh} km/h</strong></span>
              <span className="text-[#333333]">|</span>
              <span className="text-[10px] text-[#76b900] font-bold">{t("orbiting")}</span>
            </div>
          ) : (
            <span className="text-[#757575]">{t("connecting")}</span>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
          <LocaleSwitcher className="rounded-[2px]" />

          <button
            onClick={() => {
              setShowQRModal(true);
              fetchSubscribers();
            }}
            className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#0088cc] hover:bg-[#0077b5] text-white border border-[#0099e6] shadow-sm shadow-[#0088cc]/30 transition-colors"
          >
            <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{t("telegramLive")}</span>
          </button>

          <Link
            href="/pitch"
            className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#76b900] border border-[#76b900] hover:bg-[#76b900] hover:text-black transition-colors"
          >
            <Presentation className="h-3.5 w-3.5" />
            <span>{t("pitch")}</span>
          </Link>

          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-[#333333] hover:border-white transition-colors"
            >
              <BarChart3 className="h-3.5 w-3.5 text-[#76b900]" />
              <span>{t("charts")}</span>
            </button>
          )}

          <button
            onClick={onOpenSimulator}
            className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-[#333333] hover:border-white transition-colors"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>{t("simulator")}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={() => {
              setShowQRModal(true);
              fetchSubscribers();
            }}
            className="p-1.5 bg-[#0088cc] text-white rounded-[2px] border border-[#0099e6]"
            aria-label={t("openQr")}
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-white hover:text-[#76b900] border border-[#333333] bg-[#111111] transition-colors rounded-[2px]"
            aria-label={t("openMenu")}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#0d0d0d] border-b border-[#333333] px-5 py-4 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setShowQRModal(true);
              fetchSubscribers();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-[2px]"
          >
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>{t("connectBot")}</span>
            </div>
            <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded">
              {subCount !== null ? t("crew", { count: subCount }) : t("live")}
            </span>
          </button>

          <Link
            href="/pitch"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 border border-[#76b900] text-[#76b900] text-xs font-bold uppercase tracking-wider bg-black/60 rounded-[2px]"
          >
            <Presentation className="h-4 w-4" />
            <span>{t("pitchDeck")}</span>
          </Link>

          {onOpenAnalytics && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAnalytics();
              }}
              className="w-full flex items-center space-x-2 px-3.5 py-2.5 border border-[#333333] text-white text-xs font-bold uppercase tracking-wider bg-black/60 hover:border-white transition-colors rounded-[2px]"
            >
              <BarChart3 className="h-4 w-4 text-[#76b900]" />
              <span>{t("chartsCenter")}</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenSimulator();
            }}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 border border-[#333333] text-white text-xs font-bold uppercase tracking-wider bg-black/60 hover:border-white transition-colors rounded-[2px]"
          >
            <Compass className="h-4 w-4 text-white" />
            <span>{t("simulator0g")}</span>
          </button>

          {/* Language toggle (mobile) */}
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#898989]">
              {t("brandSuffix")}
            </span>
            <LocaleSwitcher className="rounded-[2px]" />
          </div>

          {iss && (
            <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-[10px] font-mono text-[#898989]">
              <span className="flex items-center text-[#76b900]">
                <Radio className="h-3 w-3 mr-1 animate-pulse" />
                {t("issOrbital")}
              </span>
              <span>{t("alt")}: {iss.altitude_km} km | {t("vel")}: {iss.velocity_kmh} km/h</span>
            </div>
          )}
        </div>
      )}

      {/* Live Telegram Audience QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#111111] border border-[#0088cc] p-6 space-y-4 shadow-2xl shadow-[#0088cc]/30">
            <div className="corner-square border-[#0088cc]" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <div className="flex items-center space-x-2 text-white">
                <div className="h-6 w-6 bg-[#0088cc] flex items-center justify-center text-white">
                  <Send className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    {t("qrTitle")}
                  </h3>
                  <span className="text-[10px] font-mono text-[#0088cc]">
                    {t("qrSubtitle")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-1 text-[#898989] hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* QR Center */}
            <div className="flex flex-col items-center justify-center space-y-3 py-2">
              <div className="relative bg-white p-3 border-2 border-[#0088cc] shadow-lg shadow-[#0088cc]/20">
                <Image
                  src="/images/telegram-bot-qr.png"
                  alt="QR Telegram Bot"
                  width={220}
                  height={220}
                  className="object-contain"
                />
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#0088cc] text-white font-mono text-[9px] font-bold uppercase whitespace-nowrap">
                  {t("qrScan")}
                </div>
              </div>

              {/* Status pill */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-black border border-[#333333] text-[11px] font-mono">
                <span className="h-2 w-2 rounded-full bg-[#76b900] animate-pulse" />
                <span className="text-[#a7a7a7]">
                  {subCount !== null ? t("linked", { count: subCount }) : t("webhookActive")}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5 text-xs text-[#cccccc] bg-black/60 p-3 border border-[#333333]">
              <div className="flex items-start space-x-2">
                <span className="text-[#0088cc] font-bold">1.</span>
                <span>{t("step1")}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#0088cc] font-bold">2.</span>
                <span>{t.rich("step2", { b: (chunks) => <strong>{chunks}</strong> })}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#0088cc] font-bold">3.</span>
                <span>{t("step3")}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href="https://t.me/Stellar_App_bot"
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>{t("openTelegram")}</span>
              </a>
              <button
                onClick={() => setShowQRModal(false)}
                className="px-4 py-2.5 bg-black border border-[#333333] hover:border-white text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
