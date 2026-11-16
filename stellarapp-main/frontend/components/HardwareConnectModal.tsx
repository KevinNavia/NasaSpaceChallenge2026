"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Cpu,
  X,
  Usb,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Copy,
  Check,
  Radio,
  ExternalLink,
} from "lucide-react";
import {
  isWebSerialSupported,
  isWebSerialConnected,
  connectWebSerial,
  disconnectWebSerial,
  subscribeHardwareTelemetry,
  subscribeHardwareStatus,
  HardwareTelemetryData,
  SerialStatus,
} from "../lib/webSerial";

interface HardwareConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HardwareConnectModal({ isOpen, onClose }: HardwareConnectModalProps) {
  const t = useTranslations("hardwareModal");
  const [supported, setSupported] = useState(true);
  const [serialStatus, setSerialStatus] = useState<SerialStatus>({
    connected: false,
    mode: "none",
    error: null,
    baudRate: 115200,
  });
  const [telemetry, setTelemetry] = useState<HardwareTelemetryData | null>(null);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backendLive, setBackendLive] = useState(false);

  useEffect(() => {
    setSupported(isWebSerialSupported());

    const unsubTele = subscribeHardwareTelemetry((data) => {
      setTelemetry(data);
      const logEntry = `[RX 115200] ${JSON.stringify({
        device: data.device || "RP2040",
        temp: `${data.chip_temp_c.toFixed(1)}°C`,
        o2: `${data.o2_kalman.toFixed(2)}%`,
        status: data.status,
      })}`;
      setLogLines((prev) => [logEntry, ...prev.slice(0, 7)]);
    });

    const unsubStatus = subscribeHardwareStatus((status) => {
      setSerialStatus(status);
      setIsConnecting(false);
    });

    // Check if backend already has active telemetry from the Python bridge
    const checkBackend = async () => {
      try {
        const res = await fetch("/api/telemetry/hardware");
        if (res.ok) {
          const json = await res.json();
          setBackendLive(Boolean(json.is_live));
          if (json.is_live && !isWebSerialConnected()) {
            setTelemetry(json);
          }
        }
      } catch {}
    };

    checkBackend();
    const interval = setInterval(checkBackend, 2000);

    return () => {
      unsubTele();
      unsubStatus();
      clearInterval(interval);
    };
  }, []);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setIsConnecting(true);
    const result = await connectWebSerial();
    setIsConnecting(false);
    if (!result.success && result.error) {
      setSerialStatus((prev) => ({ ...prev, error: result.error }));
    }
  };

  const handleDisconnect = async () => {
    await disconnectWebSerial();
    setTelemetry(null);
  };

  const copyScriptCommand = () => {
    navigator.clipboard.writeText(".\\backend\\.venv\\Scripts\\python.exe scripts\\bridge_pico.py");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isConnected = serialStatus.connected || backendLive;
  const isWebSerial = serialStatus.connected && serialStatus.mode === "webserial";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-[#333333] shadow-2xl p-6 sm:p-7 space-y-6">
        {/* NVIDIA Corner Tag */}
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#76b900]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#76b900]" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#222222] pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-[#76b900]" />
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

        {/* Link Status Overview Card */}
        <div className="p-4 bg-[#141414] border border-[#2a2a2a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#888888]">
              {t("status")}
            </span>
            <div className="flex items-center space-x-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isConnected ? "bg-[#76b900] animate-pulse" : "bg-[#555555]"
                }`}
              />
              <span
                className={`text-xs font-bold font-mono uppercase ${
                  isConnected ? "text-[#76b900]" : "text-[#888888]"
                }`}
              >
                {isWebSerial
                  ? t("webSerialActive")
                  : backendLive
                  ? t("bridgeActive")
                  : t("disconnected")}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar if connected */}
          {telemetry && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#222222] font-mono text-xs">
              <div className="bg-black/60 p-2 border border-[#222222]">
                <div className="text-[10px] text-[#777777] uppercase">{t("chipTemp")}</div>
                <div className="font-bold text-[#76b900] text-sm mt-0.5">
                  {telemetry.chip_temp_c.toFixed(1)} °C
                </div>
              </div>
              <div className="bg-black/60 p-2 border border-[#222222]">
                <div className="text-[10px] text-[#777777] uppercase">{t("o2Kalman")}</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {telemetry.o2_kalman.toFixed(2)} %
                </div>
              </div>
              <div className="bg-black/60 p-2 border border-[#222222]">
                <div className="text-[10px] text-[#777777] uppercase">{t("coPpm")}</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {telemetry.co_ppm.toFixed(1)} ppm
                </div>
              </div>
              <div className="bg-black/60 p-2 border border-[#222222]">
                <div className="text-[10px] text-[#777777] uppercase">{t("kGain")}</div>
                <div className="font-bold text-[#76b900] text-sm mt-0.5">
                  {telemetry.k_gain.toFixed(3)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {serialStatus.error && (
          <div className="p-3 bg-[#260e0e] border border-[#e52020] text-xs text-[#ff8888] flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#e52020]" />
            <span>{serialStatus.error}</span>
          </div>
        )}

        {/* Connection Action Buttons */}
        <div className="space-y-3">
          {supported ? (
            <div className="flex flex-wrap items-center gap-3">
              {!isWebSerial ? (
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="flex-1 min-w-[200px] h-10 px-4 bg-[#76b900] hover:bg-[#5a8d00] text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Usb className="h-4 w-4" />
                  <span>{isConnecting ? t("connecting") : t("connectBtn")}</span>
                </button>
              ) : (
                <button
                  onClick={handleDisconnect}
                  className="flex-1 min-w-[200px] h-10 px-4 bg-[#260e0e] hover:bg-[#401212] text-[#ff6666] border border-[#e52020] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>{t("disconnectBtn")}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 bg-[#1c1c1c] border border-[#444444] text-xs text-[#a7a7a7]">
              ⚠️ {t("browserNotice")}
            </div>
          )}
        </div>

        {/* Live Stream Terminal Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#888888] uppercase">
            <span className="flex items-center space-x-1.5">
              <Terminal className="h-3.5 w-3.5 text-[#76b900]" />
              <span>{t("liveConsole")}</span>
            </span>
            <span>115200 BAUD // USB CDC</span>
          </div>
          <div className="h-28 overflow-y-auto bg-black border border-[#222222] p-2.5 font-mono text-[11px] text-[#76b900] space-y-1">
            {logLines.length > 0 ? (
              logLines.map((line, idx) => (
                <div key={idx} className="opacity-90 leading-tight">
                  {line}
                </div>
              ))
            ) : (
              <div className="text-[#555555] italic">
                {isConnected ? t("waitingData") : "Puerto serie inactivo. Pulsa conectar para iniciar la transmisión."}
              </div>
            )}
          </div>
        </div>

        {/* Fallback CLI Bridge Box */}
        <div className="p-3 bg-[#111111] border border-[#222222] space-y-2 text-xs">
          <div className="text-[10px] font-mono uppercase text-[#777777]">
            {t("fallbackTitle")}
          </div>
          <div className="flex items-center justify-between bg-black p-2 border border-[#2a2a2a] font-mono text-[11px] text-[#cccccc]">
            <span className="truncate pr-2">.\backend\.venv\Scripts\python.exe scripts\bridge_pico.py</span>
            <button
              onClick={copyScriptCommand}
              className="px-2 py-1 bg-[#222222] hover:bg-[#333333] text-white text-[10px] uppercase font-bold flex items-center space-x-1 shrink-0 transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-[#76b900]" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? t("copied") : t("copy")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
