"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Activity, ShieldAlert, Cpu, AlertTriangle, ArrowRight, Gauge, Send, Radio, Thermometer, Zap, Monitor, Usb } from "lucide-react";
import Esp32CockpitMirror from "./Esp32CockpitMirror";
import HardwareConnectModal from "./HardwareConnectModal";
import { subscribeHardwareTelemetry, isWebSerialConnected } from "../lib/webSerial";

interface Scenario {
  id: string;
  name: string;
  gravity: number;
  volume_m3: number;
  ventilation_factor: number;
  description: string;
}

interface TelemetryResult {
  scenario: Scenario;
  o2_percentage: number;
  raw_co_ppm: number;
  filtered_co_ppm: number;
  kalman_gain: number;
  safety_level: string;
  alert_color: string;
  alert_title: string;
  diagnosis: string;
  required_actions: string[];
  critical_evac_time: string;
}

interface HardwareState {
  active: boolean;
  is_live: boolean;
  device: string;
  chip_temp_c: number;
  o2_raw: number;
  o2_kalman: number;
  co_ppm: number;
  k_gain: number;
  status: string;
  seconds_ago?: number;
}

export default function KalmanTelemetry() {
  const t = useTranslations("kalman");
  const locale = useLocale();
  const [scenarioId, setScenarioId] = useState("rover");
  const [o2Pct, setO2Pct] = useState(26.0);
  const [data, setData] = useState<TelemetryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  // Hardware-in-the-loop state
  const [hardware, setHardware] = useState<HardwareState | null>(null);
  const [useHardwareSync, setUseHardwareSync] = useState(true);
  const [viewMode, setViewMode] = useState<"dual" | "mirror" | "analytics">("dual");
  const [showHardwareModal, setShowHardwareModal] = useState(false);

  // Poll hardware telemetry every 1.2s & listen to direct Web Serial stream
  useEffect(() => {
    let isMounted = true;
    const checkHardware = async () => {
      try {
        const resp = await fetch("/api/telemetry/hardware");
        if (resp.ok) {
          const hw: HardwareState = await resp.json();
          if (isMounted) {
            setHardware(hw);
            if (hw.is_live && useHardwareSync && hw.o2_kalman) {
              setO2Pct(parseFloat(hw.o2_kalman.toFixed(1)));
            }
          }
        }
      } catch {
        // Fallback or ignore
      }
    };

    checkHardware();
    const interval = setInterval(checkHardware, 1200);

    const unsubTele = subscribeHardwareTelemetry((hwData) => {
      if (isMounted) {
        setHardware({
          active: true,
          is_live: true,
          device: hwData.device || "Raspberry Pi Pico W",
          chip_temp_c: hwData.chip_temp_c,
          o2_raw: hwData.o2_raw,
          o2_kalman: hwData.o2_kalman,
          co_ppm: hwData.co_ppm,
          k_gain: hwData.k_gain,
          status: hwData.status,
        });
        if (useHardwareSync && hwData.o2_kalman) {
          setO2Pct(parseFloat(hwData.o2_kalman.toFixed(1)));
        }
      }
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
      unsubTele();
    };
  }, [useHardwareSync]);

  const broadcastToAudience = async () => {
    if (!data) return;
    setBroadcasting(true);
    try {
      const resp = await fetch("/api/telegram/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Alerta Telemetría // ${data.scenario.name}`,
          message: `Estado: ${data.alert_title}\nDiagnóstico: ${data.diagnosis}`,
          severity: data.safety_level === "CRÍTICO" ? "CRITICAL" : "WARNING",
          details: {
            "Oxígeno O₂": `${data.o2_percentage}%`,
            "CO Crudo": `${data.raw_co_ppm} ppm`,
            "CO Filtrado (Kalman)": `${data.filtered_co_ppm} ppm`,
            "Ganancia Kalman": `${data.kalman_gain}`,
            "Tiempo Evacuación": data.critical_evac_time
          }
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        setBroadcastStatus(t("broadcast.success", { count: json.recipients_sent }));
      } else {
        setBroadcastStatus(t("broadcast.error"));
      }
    } catch {
      setBroadcastStatus(t("broadcast.offline"));
    } finally {
      setBroadcasting(false);
      setTimeout(() => setBroadcastStatus(null), 6000);
    }
  };

  const fetchTelemetry = async (scen = scenarioId, o2 = o2Pct) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/telemetry/kalman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: scen, o2_pct: o2, lang: locale }),
      });
      if (resp.ok) {
        const json = await resp.json();
        setData(json);
      }
    } catch {
      // Fallback local
      setData({
        scenario: {
          id: scen,
          name: scen === "rover" ? t("fallback.rover") : scen === "lunar" ? t("fallback.lunar") : t("fallback.iss"),
          gravity: scen === "iss" ? 0 : 0.166,
          volume_m3: scen === "rover" ? 42 : scen === "lunar" ? 280 : 916,
          ventilation_factor: 1,
          description: t("fallback.description"),
        },
        o2_percentage: o2,
        raw_co_ppm: Math.round((o2 - 16) * 7.5 + (Math.random() * 8 - 4)),
        filtered_co_ppm: Math.round((o2 - 16) * 6.8),
        kalman_gain: 0.238,
        safety_level: o2 > 28 ? "CRÍTICO" : o2 > 24 ? "ALERTA" : "PRECAUCIÓN",
        alert_color: o2 > 28 ? "#e52020" : o2 > 24 ? "#df6500" : "#bff230",
        alert_title: o2 > 28 ? t("fallback.alertTitleRed") : t("fallback.alertTitleOrange"),
        diagnosis: t("fallback.diagnosis"),
        required_actions: [
          t("fallback.actions.hatches"),
          t("fallback.actions.extraction"),
          t("fallback.actions.masks"),
        ],
        critical_evac_time: scen === "rover" ? t("fallback.evacShort") : t("fallback.evacLong"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [scenarioId, o2Pct, locale]);

  const isLiveHardware = hardware?.is_live ?? false;

  return (
    <div id="kalman-section" className="relative bg-[#1a1a1a] border border-[#333333] p-6 lg:p-8">
      {/* Corner Square */}
      <div className="corner-square" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#333333] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#76b900] uppercase tracking-widest">
            <Activity className="h-4 w-4" />
            <span>{t("eyebrow")}</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
            {t("title")}
          </h2>
          <p className="text-xs text-[#898989] mt-0.5">
            {t("subtitle")}
          </p>
        </div>

        {/* Habitat Selector Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap gap-1 bg-black p-1 border border-[#333333]">
          {[
            { id: "iss", label: t("habitats.iss") },
            { id: "lunar", label: t("habitats.lunar") },
            { id: "rover", label: t("habitats.rover") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setScenarioId(tab.id);
                fetchTelemetry(tab.id, o2Pct);
              }}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                scenarioId === tab.id
                  ? "bg-[#76b900] text-black"
                  : "text-[#898989] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hardware-in-the-Loop Status Bar */}
      <div className="mt-4 p-3 bg-black border border-[#333333] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className={`h-2.5 w-2.5 rounded-full ${isLiveHardware ? "bg-[#76b900] animate-pulse" : "bg-[#555555]"}`} />
          <div className="text-xs">
            <span className="font-bold uppercase tracking-wider text-white">
              {isLiveHardware ? t("hardwareStatus.live") : t("hardwareStatus.synthetic")}
            </span>
            <span className="text-[#888888] ml-2 font-mono">
              {isLiveHardware
                ? t("hardwareStatus.deviceSuffix", { device: hardware?.device || "Raspberry Pi Pico W" })
                : t("hardwareStatus.hint")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hardware Connect / Status Trigger */}
          <button
            onClick={() => setShowHardwareModal(true)}
            className={`h-7 px-2.5 text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center space-x-1.5 transition-colors border ${
              isLiveHardware
                ? "bg-[#14230b] text-[#76b900] border-[#76b900] hover:bg-[#1f3711]"
                : "bg-[#161616] text-[#cccccc] border-[#444444] hover:border-[#76b900] hover:text-[#76b900]"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>{isLiveHardware ? "Pico W En Vivo" : "Conectar Pico W"}</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center space-x-1 bg-[#111111] p-1 border border-[#333333]">
            <button
              onClick={() => setViewMode("dual")}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase font-bold transition-colors ${
                viewMode === "dual" ? "bg-[#76b900] text-black" : "text-[#888888] hover:text-white"
              }`}
            >
              {t("viewModes.dual")}
            </button>
            <button
              onClick={() => setViewMode("mirror")}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase font-bold transition-colors ${
                viewMode === "mirror" ? "bg-[#76b900] text-black" : "text-[#888888] hover:text-white"
              }`}
            >
              {t("viewModes.mirror")}
            </button>
            <button
              onClick={() => setViewMode("analytics")}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase font-bold transition-colors ${
                viewMode === "analytics" ? "bg-[#76b900] text-black" : "text-[#888888] hover:text-white"
              }`}
            >
              {t("viewModes.analytics")}
            </button>
          </div>
        </div>

        {isLiveHardware && (
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-1.5 bg-[#111111] px-2.5 py-1 border border-[#333333] text-xs font-mono">
              <Thermometer className="h-3.5 w-3.5 text-[#ff8800]" />
              <span className="text-[#888888]">{t("chipSensor")}</span>
              <span className={`font-bold ${hardware && hardware.chip_temp_c >= 40 ? "text-[#e52020]" : "text-[#76b900]"}`}>
                {hardware?.chip_temp_c.toFixed(1)}°C
              </span>
            </div>

            <button
              onClick={() => setUseHardwareSync(!useHardwareSync)}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase font-bold border transition-colors ${
                useHardwareSync
                  ? "border-[#76b900] bg-[#76b900]/20 text-[#76b900]"
                  : "border-[#444444] text-[#888888] hover:text-white"
              }`}
            >
              {useHardwareSync ? t("syncOn") : t("syncOff")}
            </button>
          </div>
        )}
      </div>

      {/* ESP32 Cockpit Digital Twin Mirror */}
      {(viewMode === "dual" || viewMode === "mirror") && (
        <div className="mt-6 mb-8">
          <Esp32CockpitMirror hardwareData={hardware} onTriggerPurge={broadcastToAudience} />
        </div>
      )}

      {/* Main Grid */}
      {(viewMode === "dual" || viewMode === "analytics") && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-black border border-[#333333]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t("o2Control", { value: o2Pct })}
              </span>
              <span className="text-xs font-mono text-[#76b900] font-bold">
                {isLiveHardware && useHardwareSync
                  ? t("controlledBy")
                  : o2Pct >= 26 ? t("artemisEva") : t("issStandard")}
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="35"
              step="0.5"
              value={o2Pct}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setO2Pct(val);
                if (useHardwareSync) setUseHardwareSync(false);
                fetchTelemetry(scenarioId, val);
              }}
              className="w-full h-1 bg-[#1a1a1a] appearance-none cursor-pointer accent-[#76b900]"
            />
            <div className="flex justify-between text-[10px] text-[#757575] font-mono mt-1 uppercase">
              <span>{t("o2Ticks.sub")}</span>
              <span>{t("o2Ticks.nominal")}</span>
              <span>{t("o2Ticks.enriched")}</span>
            </div>
          </div>

          {/* Sensor Comparison: Raw vs Filtered */}
          {data && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-black border border-[#333333]">
                <span className="text-[10px] font-bold uppercase text-[#757575] block">
                  {isLiveHardware ? t("rawSensorLive") : t("rawSensorSim")}
                </span>
                <div className="text-xl font-mono font-bold text-white mt-1">
                  {isLiveHardware && hardware ? hardware.co_ppm.toFixed(1) : data.raw_co_ppm}{" "}
                  <span className="text-xs text-[#757575]">ppm</span>
                </div>
                <span className="text-[10px] text-[#df6500] font-mono mt-1 block">
                  {isLiveHardware && hardware ? t("rawO2", { value: hardware.o2_raw.toFixed(1) }) : t("oscillation")}
                </span>
              </div>
              <div className="p-4 bg-black border border-[#76b900]">
                <span className="text-[10px] font-bold uppercase text-[#76b900] block">
                  {t("kalmanEstimate", { mode: isLiveHardware ? t("estimateModes.hardware") : t("estimateModes.real") })}
                </span>
                <div className="text-xl font-mono font-bold text-[#76b900] mt-1">
                  {data.filtered_co_ppm} <span className="text-xs text-[#76b900]">ppm</span>
                </div>
                <span className="text-[10px] text-[#898989] font-mono mt-1 block">
                  {t("kGain", { value: isLiveHardware && hardware ? hardware.k_gain : data.kalman_gain })}
                </span>
              </div>
            </div>
          )}

          <div className="p-3 bg-black border border-[#333333] text-xs text-[#a7a7a7]">
            <span className="text-white font-bold block uppercase text-[11px] mb-1">{t("volumeDynamics")}</span>
            <p className="text-xs leading-relaxed">{data?.scenario.description}</p>
          </div>
        </div>

        {/* Telemetry Output Status */}
        <div className="lg:col-span-7 bg-black border border-[#333333] p-6 flex flex-col justify-between">
          {data ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
                <div>
                  <span className="text-[10px] font-bold text-[#898989] uppercase tracking-wider block">
                    {t("contingency")}
                  </span>
                  <h3 className="text-base font-bold uppercase mt-0.5" style={{ color: data.alert_color }}>
                    {data.alert_title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#898989] uppercase tracking-wider block">
                    {t("criticalTime")}
                  </span>
                  <span className="text-base font-mono font-bold text-white">
                    {data.critical_evac_time}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-white block mb-1">{t("physicalDiagnosis")}</span>
                <p className="text-xs text-[#cccccc] leading-relaxed">{data.diagnosis}</p>
                <div className="mt-2 p-2 bg-[#121212] border border-[#262626] text-[10px] font-mono text-[#8da2c0] flex items-start space-x-2">
                  <span className="text-[#76b900] font-bold shrink-0">[NASA EMPIRICAL]</span>
                  <span>{t("calibrationNote")}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-[#76b900] block mb-2">
                  {t("protocols")}
                </span>
                <ul className="space-y-1.5 text-xs text-[#a7a7a7]">
                  {data.required_actions.map((act, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 bg-[#76b900] shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Telegram Audience Broadcast Action */}
              <div className="pt-3 border-t border-[#333333] space-y-2">
                {/* Mini QR card for Audience Sync */}
                <div className="flex items-center space-x-3 p-2.5 bg-black/90 border border-[#0088cc]/50">
                  <div className="bg-white p-1 shrink-0 border border-[#0088cc]">
                    <img
                      src="/images/telegram-bot-qr.png"
                      alt="QR Telegram"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#76b900] animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0088cc]">
                        {t("audience.question")}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#cccccc] leading-tight">
                      {t("audience.desc")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <button
                    onClick={broadcastToAudience}
                    disabled={broadcasting}
                    className="inline-flex items-center justify-center space-x-2 px-3.5 py-2.5 bg-[#e52020] hover:bg-[#c51818] text-white text-xs font-bold uppercase tracking-wider transition-all border border-[#ff4444] shadow-md shadow-[#e52020]/40 hover:shadow-[#e52020]/70 disabled:opacity-50 rounded-[2px]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{broadcasting ? t("audience.broadcasting") : t("audience.broadcast")}</span>
                  </button>
                  <a
                    href="https://t.me/Stellar_App_bot"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-[#0088cc] hover:underline flex items-center space-x-1 justify-center sm:justify-start"
                  >
                    <Radio className="h-3 w-3" />
                    <span>{t("audience.channel")}</span>
                  </a>
                </div>
                {broadcastStatus && (
                  <p className="text-[11px] font-mono text-[#76b900] bg-black/60 p-1.5 border border-[#76b900]/40">
                    {broadcastStatus}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-xs font-mono text-[#757575]">
              {t("computing")}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Hardware Connection Modal */}
      <HardwareConnectModal
        isOpen={showHardwareModal}
        onClose={() => setShowHardwareModal(false)}
      />
    </div>
  );
}
