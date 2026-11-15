"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, Radio, Cpu, ShieldAlert, CheckCircle2, AlertOctagon, Zap, Thermometer } from "lucide-react";

interface Esp32CockpitMirrorProps {
  hardwareData?: {
    is_live: boolean;
    chip_temp_c: number;
    o2_raw: number;
    o2_kalman: number;
    co_ppm: number;
    k_gain: number;
    status: string;
    device?: string;
  } | null;
  onTriggerPurge?: () => void;
}

export default function Esp32CockpitMirror({ hardwareData, onTriggerPurge }: Esp32CockpitMirrorProps) {
  const t = useTranslations("cockpit");
  const [touchPressed, setTouchPressed] = useState(false);
  const [simulatedCritical, setSimulatedCritical] = useState<boolean | null>(null);

  // Values from live hardware or defaults
  const isLive = hardwareData?.is_live ?? false;
  const chipTemp = hardwareData?.chip_temp_c ?? 38.5;
  const o2Kalman = hardwareData?.o2_kalman ?? 21.0;
  const o2Raw = hardwareData?.o2_raw ?? 21.0;
  const coPpm = hardwareData?.co_ppm ?? 22.0;
  const kGain = hardwareData?.k_gain ?? 0.167;
  const statusStr = hardwareData?.status ?? "NOMINAL";

  // Critical condition check
  const actualCritical =
    statusStr.includes("CRITICO") || chipTemp >= 42.0 || o2Kalman >= 27.5 || coPpm >= 70.0;
  const isCritical = simulatedCritical !== null ? simulatedCritical : actualCritical;

  const handleTouchButton = () => {
    setTouchPressed(true);
    setTimeout(() => setTouchPressed(false), 250);

    // Toggle simulation override if in preview or trigger callback
    setSimulatedCritical(prev => (prev === null ? !actualCritical : !prev));
    if (onTriggerPurge) {
      onTriggerPurge();
    }
  };

  // Oxygen bar calculation (18% - 35%)
  const barPercent = Math.max(0, Math.min(100, ((o2Kalman - 15) / (35 - 15)) * 100));

  return (
    <div className="w-full flex flex-col items-center">
      {/* Outer Hardware Chassis (Sunton ESP32-8048S043 Bezel) */}
      <div className="relative w-full max-w-[860px] p-4 sm:p-6 bg-[#0a0c10] border-2 border-[#2b3547] rounded-2xl shadow-2xl shadow-black/80 font-mono select-none">
        {/* PCB Screws in 4 corners */}
        <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-[#1c2230] border border-[#d4af37]/60 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-[#d4af37]/80 rotate-45" />
        </div>
        <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-[#1c2230] border border-[#d4af37]/60 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-[#d4af37]/80 -rotate-45" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 rounded-full bg-[#1c2230] border border-[#d4af37]/60 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-[#d4af37]/80 -rotate-45" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-[#1c2230] border border-[#d4af37]/60 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-[#d4af37]/80 rotate-45" />
        </div>

        {/* Chassis Silkscreen Header */}
        <div className="flex items-center justify-between px-2 mb-2 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#7a889b] uppercase">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37]/80 inline-block" />
            <span className="font-bold text-[#b5c2d4]">ESP32-8048S043 // 4.3&quot; IPS 800x480</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-[#58687d]">
            <span>GT911 TOUCH</span>
            <span>•</span>
            <span>8MB OPI PSRAM</span>
            <span>•</span>
            <span className={isLive ? "text-[#76b900] font-bold" : "text-[#888888]"}>
              {isLive ? t("linked") : t("offline")}
            </span>
          </div>
        </div>

        {/* Inner LCD Panel Display (800x480 Exact Representation) */}
        <div className="relative w-full aspect-[800/480] bg-[#0b0f19] border border-[#1e2738] rounded-lg overflow-hidden flex flex-col justify-between p-3 sm:p-5 shadow-inner">
          {/* Subtle IPS Screen Glare */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05]" />

          {/* Top LCD Header Bar */}
          <div className="relative z-10 flex items-center justify-between pb-2 sm:pb-3 border-b border-[#2a344a]">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-sm sm:text-xl font-black text-[#76b900] tracking-wider">
                STELLARAPP
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-white tracking-wide hidden xs:inline">
                {t("astronautDeck")}
              </span>
            </div>

            <div className="flex items-center space-x-2 bg-[#0f1420] px-2.5 py-1 border border-[#2a344a] rounded">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCritical ? "bg-[#e52020] animate-ping" : isLive ? "bg-[#76b900] animate-pulse" : "bg-[#555555]"
                }`}
              />
              <span
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                  isCritical ? "text-[#e52020]" : isLive ? "text-[#76b900]" : "text-[#777777]"
                }`}
              >
                {isCritical ? t("critical") : isLive ? t("online") : t("standby")}
              </span>
            </div>
          </div>

          {/* Middle 3 Main Telemetry Cards */}
          <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 my-auto">
            {/* Card 1: Oxígeno */}
            <div className="bg-[#141926] border border-[#2a344a] rounded-md p-2 sm:p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[9px] sm:text-[11px] font-bold text-[#8892b0] uppercase tracking-wider block">
                  {t("oxygen")}
                </span>
                <div className="mt-1 flex items-baseline space-x-1">
                  <span
                    className={`text-xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
                      isCritical ? "text-[#e52020]" : "text-[#00d2ff]"
                    }`}
                  >
                    {o2Kalman.toFixed(1)}
                  </span>
                  <span className="text-xs sm:text-lg font-bold text-[#8892b0]">%</span>
                </div>
              </div>

              <div className="mt-2 space-y-1.5">
                <div className="flex justify-between text-[8px] sm:text-[10px] text-[#8892b0]">
                  <span>{t("rawSensor")}</span>
                  <span className="text-white font-bold">{o2Raw.toFixed(1)}%</span>
                </div>

                {/* Oxygen Progress Bar */}
                <div className="w-full h-2.5 sm:h-3 bg-[#0b0f19] border border-[#2a344a] rounded-sm overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-sm transition-all duration-300 ${
                      isCritical ? "bg-[#e52020]" : "bg-[#76b900]"
                    }`}
                    style={{ width: `${barPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[7px] sm:text-[8px] text-[#5c6882]">
                  <span>{t("o2Ticks.sub")}</span>
                  <span>{t("o2Ticks.nominal")}</span>
                  <span>{t("o2Ticks.high")}</span>
                </div>
              </div>
            </div>

            {/* Card 2: CO & Filtro de Kalman */}
            <div className="bg-[#141926] border border-[#2a344a] rounded-md p-2 sm:p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[9px] sm:text-[11px] font-bold text-[#8892b0] uppercase tracking-wider block">
                  {t("kalmanFilter")}
                </span>
                <div className="mt-1 flex items-baseline space-x-1">
                  <span
                    className={`text-xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
                      isCritical ? "text-[#e52020]" : "text-[#76b900]"
                    }`}
                  >
                    {coPpm.toFixed(0)}
                  </span>
                  <span className="text-xs sm:text-lg font-bold text-[#8892b0]">ppm</span>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-[8px] sm:text-[10px]">
                <div className="flex justify-between text-[#8892b0]">
                  <span>{t("filterActive")}</span>
                  <span className="text-white font-bold">{t("active")}</span>
                </div>
                <div className="flex justify-between text-[#8892b0]">
                  <span>{t("gain")}</span>
                  <span className="text-white font-bold">{kGain.toFixed(3)}</span>
                </div>
                <div
                  className={`mt-1 font-bold text-[9px] sm:text-[11px] uppercase ${
                    isCritical ? "text-[#e52020]" : "text-[#76b900]"
                  }`}
                >
                  {isCritical ? t("toxicityHigh") : t("stable")}
                </div>
              </div>
            </div>

            {/* Card 3: Sonda Térmica RP2040 */}
            <div className="bg-[#141926] border border-[#2a344a] rounded-md p-2 sm:p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[9px] sm:text-[11px] font-bold text-[#8892b0] uppercase tracking-wider block">
                  {t("rp2040Probe")}
                </span>
                <div className="mt-1 flex items-baseline space-x-1">
                  <span
                    className={`text-xl sm:text-4xl lg:text-5xl font-black tracking-tight ${
                      chipTemp >= 42.0 ? "text-[#e52020]" : "text-[#00d2ff]"
                    }`}
                  >
                    {chipTemp.toFixed(1)}
                  </span>
                  <span className="text-xs sm:text-lg font-bold text-[#8892b0]">°C</span>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-[8px] sm:text-[10px]">
                <div className="flex justify-between text-[#8892b0]">
                  <span>{t("hardware")}</span>
                  <span className="text-white font-bold">Pico W (COM6)</span>
                </div>
                <div className="flex justify-between text-[#8892b0]">
                  <span>{t("evacuation")}</span>
                  <span
                    className={`font-black uppercase ${
                      isCritical ? "text-[#e52020] animate-pulse" : "text-[#76b900]"
                    }`}
                  >
                    {isCritical ? "< 3 MIN" : t("nominal")}
                  </span>
                </div>
                <div className="text-[7px] sm:text-[9px] text-[#5c6882]">
                  {isCritical ? t("thermalTrigger") : t("continuousMonitoring")}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Interactive Touch Button */}
          <div className="relative z-10 pt-1">
            <button
              onClick={handleTouchButton}
              className={`w-full py-2.5 sm:py-3.5 px-4 rounded-lg font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-2 text-xs sm:text-sm ${
                touchPressed ? "scale-[0.98] brightness-125" : ""
              } ${
                isCritical
                  ? "bg-[#e52020] text-white border-2 border-white shadow-lg shadow-[#e52020]/50 animate-pulse"
                  : "bg-[#141926] text-white border-2 border-[#00d2ff] hover:bg-[#00d2ff]/10 shadow-md shadow-[#00d2ff]/20"
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>
                {isCritical
                  ? t("purgeCritical")
                  : t("purgeNormal")}
              </span>
            </button>
          </div>
        </div>

        {/* Chassis Footer Caption */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between text-[10px] text-[#58687d] px-2 font-mono">
          <div className="flex items-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#76b900]" />
            <span>{t("syncCaption")}</span>
          </div>
          <span className="text-[#8892b0] hover:text-white cursor-pointer" onClick={() => setSimulatedCritical(null)}>
            {t("reset")}
          </span>
        </div>
      </div>
    </div>
  );
}
