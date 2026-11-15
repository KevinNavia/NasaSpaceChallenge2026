"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import KalmanTelemetry from "../../../components/KalmanTelemetry";
import LocaleSwitcher from "../../../components/LocaleSwitcher";
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
  ExternalLink
} from "lucide-react";

export default function PitchLanding() {
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
      title: "Combustión de Acrílico (PMMA) en Cygnus",
      badge: "PMMA • SAFFIRE-IV",
      badgeColor: "text-[#76b900] border-[#76b900]/40",
      desc: "Frente de llama extendido sobre polímero estructural en el carguero Cygnus a presión y concentración controlada. Evidencia empírica de avance de llama sin corrientes convectivas.",
      nasaId: "jsc2023e046631",
      nasaUrl: "https://images.nasa.gov/details/jsc2023e046631"
    },
    {
      src: "/media/nasa/saffire-iv-fabric-flame.jpg",
      title: "Propagación de Llama en Tejido de Nave",
      badge: "TEJIDO • SAFFIRE-IV",
      badgeColor: "text-[#df6500] border-[#df6500]/40",
      desc: "Muestra de tejido ardiendo bajo flujo forzado de 20 cm/s en atmósfera enriquecida con oxígeno. Demuestra que los tejidos estructurales arden con alta violencia en microgravedad.",
      nasaId: "jsc2023e046375",
      nasaUrl: "https://images.nasa.gov/details/jsc2023e046375"
    },
    {
      src: "/media/nasa/bass-ii-acrylic-flame.jpg",
      title: "Llama Esférica en la Estación Espacial (0G)",
      badge: "BASS-II • ISS",
      badgeColor: "text-[#00b0ff] border-[#00b0ff]/40",
      desc: "Placa acrílica de 4 mm quemada en el Microgravity Science Glovebox a bordo de la ISS. Muestra la esfericidad isotrópica y la emisión azul tenue por radicales C2/CH.",
      nasaId: "iss040e072900",
      nasaUrl: "https://images.nasa.gov/details/iss040e072900"
    },
    {
      src: "/media/nasa/bass-ii-reduced-o2-flame.jpg",
      title: "Combustión en Presión Parcial Reducida de O₂",
      badge: "ATMÓSFERA SUB-NOMINAL",
      badgeColor: "text-[#e040fb] border-[#e040fb]/40",
      desc: "Ensayo card 15 bajo presiones y concentraciones de oxígeno equivalentes a atmósferas de exploración espacial de próxima generación (Artemis / Marte).",
      nasaId: "iss040e086481",
      nasaUrl: "https://images.nasa.gov/details/iss040e086481"
    }
  ];

  const problems = [
    {
      title: "40 AÑOS DE DATOS INACCESIBLES",
      desc: "Miles de experimentos de combustión (Saffire, BASS, FLEX) dispersos en reportes técnicos estáticos (PDFs en NTRS) y videos sin indexar ni comparar.",
      icon: Database,
    },
    {
      title: "LA FÍSICA CAMBIA RADICALMENTE EN 0G",
      desc: "Sin flotabilidad gravitacional, las llamas se vuelven esféricas, casi invisibles ('Cool Flames') y los protocolos terrestres de extinción fallan de inmediato.",
      icon: Flame,
    },
    {
      title: "NUEVO RIESGO EN ARTEMIS Y MARTE",
      desc: "Las atmósferas de exploración espacial operarán a 26%-34% de O₂ y 56 kPa. Los materiales arden hasta un 95% más rápido con gotas encendidas flotantes.",
      icon: AlertTriangle,
    },
    {
      title: "FALTA DE UN PUENTE TIERRA–ESPACIO",
      desc: "La ciencia del fuego de la NASA estaba fragmentada: observación satelital macro en la Tierra (NASA FIRMS) separada de la combustión micro en naves espaciales (Saffire).",
      icon: Terminal,
    },
  ];

  const valueProps = [
    {
      title: "1. DESBLOQUEO DE 40 AÑOS DE CIENCIA NASA & REPOSITORIO PSI",
      desc: "Indexa y correlaciona misiones de vuelo espacial real (Saffire, BASS-II, FLEX-2, SAME, ACME) y 14 estudios oficiales de NASA Physical Sciences Informatics con 32 parámetros calibrados.",
    },
    {
      title: "2. GEMELO DIGITAL DE MORFOLOGÍA Y PROPAGACIÓN EN 0G",
      desc: "Modela la física sin flotabilidad (llamas esféricas isotrópicas, 'Cool Flames' invisibles y transferencia de calor radiativo hasta 42% a las paredes del hábitat).",
    },
    {
      title: "3. CERTIFICACIÓN DE RIESGO EN ATMÓSFERAS ARTEMIS (26%–34% O₂)",
      desc: "Evalúa materiales estructurales bajo la norma NASA-STD-6001B frente a la aceleración de hasta +90% en la velocidad de llama en presiones reducidas (56.5 kPa).",
    },
    {
      title: "4. COPILOTO AUTÓNOMO AIR-GAPPED (<1 ms) PARA EL ECLSS",
      desc: "Guía a la tripulación ante incendios súbitos sin depender de la Tierra (corte de ventilación forzada a <1.2 cm/s para auto-asfixia pasiva y aislamiento de mamparos).",
    },
  ];

  const pitchQuestions = [
    {
      q: "¿Cuál es el objetivo primordial del proyecto StellarApp?",
      a: "Proteger la vida de los astronautas y la integridad estructural de las naves en misiones de exploración profunda (Artemis en la Luna y hábitats en Marte), donde la física del fuego cambia drásticamente respecto a la Tierra, los métodos convencionales de extinción fallan y la evacuación es imposible.",
    },
    {
      q: "¿Por qué esto es vital para la NASA hoy y no hace 20 años?",
      a: "Porque la ISS opera a 101 kPa y 21% de O₂ (igual que en la Tierra). Pero el programa Artemis (Luna) y los hábitats de Marte usarán 26%-32% de O₂ para permitir paseos espaciales (EVAs) sin descompresión. En este nuevo régimen, los materiales se queman con una violencia extrema que nunca se vio en la Tierra.",
    },
    {
      q: "¿Por qué se implementó un motor dual con inferencia sub-milisegundo y LLM local (Qwen-2.5)?",
      a: "En una misión a la Luna o Marte, la latencia de comunicación con la Tierra es de varios segundos a minutos (hasta 20 minutos en Marte). Un sistema de contingencia contra incendios no puede depender de APIs en la nube: debe operar 100% offline (air-gapped) dentro de la aviónica de la nave con respuestas deterministas instantáneas (<1 ms).",
    },
    {
      q: "¿Cómo se integra la base de datos oficial NASA Physical Sciences Informatics (PSI)?",
      a: "StellarApp incorpora 14 investigaciones en órbita y 32 parámetros experimentales validados de la NASA (PSI-159, PSI-60, PSI-62, PSI-138), incluyendo ganancias de fotomultiplicadores PMT (8.0-10.0), flujos masivos estáticos MFCA1 y análisis pirométrico de más de 1600 imágenes de flama en la ISS.",
    },
    {
      q: "¿Cómo ayuda directamente a los astronautas y directores de vuelo ante un fuego?",
      a: "Si ocurre un fuego en 0g, un extintor convencional puede esparcir gotas de polímero fundido por toda la cabina. StellarApp indica qué material arde, su umbral de extinción por asfixia (cortando el flujo de ventilación ECLSS a <1.2 cm/s) y los minutos exactos antes del colapso térmico humano (45°C) y del casco de Al-Li (150°C).",
    },
    {
      q: "¿Cómo garantiza el equipo la exactitud técnica y la ausencia de fallos de software?",
      a: "A través del ciclo autónomo de calidad Ralph Loop: 35 pruebas automatizadas (100% aprobadas en 0.74s) verifican las ecuaciones de transporte difusivo sin convección, los límites de inflamabilidad (LOI) de NASA-STD-6001B y la calibración empírica con datos de Cygnus Saffire.",
    },
  ];

  const ralphLoopInnovations = [
    {
      title: "Suite de Calidad Ralph Loop (35/35 Tests Automatizados)",
      desc: "Pruebas continuas de unidad e integración que cubren modelos de microgravedad, guardrails aeroespaciales, convergencia del filtro de Kalman y validación Pydantic estricta.",
      metric: "35 / 35 PASS",
      icon: ShieldCheck,
      color: "text-[#76b900]",
      badge: "100% APROBADO"
    },
    {
      title: "Repositorio Oficial NASA PSI (14 Estudios & 32 Parámetros)",
      desc: "Integración de la base de datos oficial NASA Physical Sciences Informatics: 14 estudios espaciales, calibración de sensores ópticos PMT, flujo estático MFCA1 y más de 1600 imágenes pirométricas en la ISS.",
      metric: "14 Estudios / 32 Parámetros",
      icon: Database,
      color: "text-[#e040fb]",
      badge: "CALIBRADO EN VUELO"
    },
    {
      title: "Motor Híbrido AeroEngine Dual (Sub-Milisegundo + Qwen 2.5 3B)",
      desc: "Inferencia instantánea (<0.02ms) para telemetría crítica de vuelo espacial combinada con LLM local Qwen 2.5 3B en el servidor orbital, eliminando dependencias de la nube para naves aisladas (air-gapped).",
      metric: "< 1 ms",
      icon: Zap,
      color: "text-[#00b0ff]",
      badge: "AIR-GAPPED READY"
    },
    {
      title: "Límites Térmicos NASA-STD-3001 vs Casco NASA-SP-20205001358",
      desc: "Curvas de supervivencia dinámica en cabina durante un fuego de 180s: monitorea umbrales tisulares de dolor/evacuación (45°C–50°C) versus pérdida de fluencia en aleación Al-Li del casco (150°C).",
      metric: "180s Dinámicos",
      icon: Activity,
      color: "text-[#df6500]",
      badge: "SUPERVIVENCIA"
    },
    {
      title: "Asistente Virtual Astronauta Flotante con HUD Espacial",
      desc: "Agente HUD con avatar orbital que acompaña al astronauta en cualquier pantalla, dotado de aislamiento estricto de dominio aeroespacial y RAG inteligente sobre experimentos de la ISS.",
      metric: "Aero HUD",
      icon: Cpu,
      color: "text-[#76b900]",
      badge: "INTERFAZ TRIPULACIÓN"
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
                PITCH 2026
              </span>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <LocaleSwitcher className="rounded-[2px]" />

            <a
              href="#kalman"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-black hover:bg-[#111111] text-[#76b900] border border-[#76b900]/40 transition-colors"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>SONDA HARDWARE</span>
            </a>

            <button
              onClick={() => setShowQRModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#0088cc] hover:bg-[#0077b5] text-white border border-[#0099e6] shadow-sm shadow-[#0088cc]/30 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>BOT EN VIVO</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#76b900] text-black hover:bg-[#5a8d00] transition-colors"
            >
              <span>WORKBENCH</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Hamburger & Actions */}
          <div className="flex sm:hidden items-center space-x-2">
            <LocaleSwitcher className="rounded-[2px]" />
            <button
              onClick={() => setShowQRModal(true)}
              className="p-1.5 bg-[#0088cc] text-white rounded-[2px] border border-[#0099e6]"
              aria-label="Abrir QR Telegram"
            >
              <Send className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-white hover:text-[#76b900] border border-[#333333] bg-[#111111] transition-colors rounded-[2px]"
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-[#0d0d0d] border-b border-[#333333] px-5 py-4 space-y-2.5 animate-in slide-in-from-top-2 duration-200">
            <a
              href="#kalman"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-black border border-[#76b900] text-[#76b900] text-xs font-bold uppercase tracking-wider hover:bg-[#111111] transition-colors rounded-[2px]"
            >
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>SONDA HARDWARE (COM6)</span>
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
                <span>ABRIR WORKBENCH EN VIVO</span>
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
                <span>CONECTAR BOT TELEGRAM</span>
              </div>
              <QrCode className="h-4 w-4" />
            </button>

            <Link
              href="/#kalman-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center space-x-2 px-3.5 py-2.5 border border-[#333333] text-white text-xs font-bold uppercase tracking-wider bg-black/60 hover:border-white transition-colors rounded-[2px]"
            >
              <Radio className="h-4 w-4 text-[#76b900]" />
              <span>TELEMETRÍA FILTRO DE KALMAN</span>
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
                <span className="text-xs font-bold uppercase tracking-wider text-white">RED TELEMETRÍA TELEGRAM</span>
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
                alt="QR Bot Telegram @Stellar_App_bot"
                width={200}
                height={200}
                className="mx-auto"
                priority
              />
            </div>

            <div className="space-y-1.5 font-mono">
              <p className="text-xs text-white font-bold">@Stellar_App_bot</p>
              <p className="text-[11px] text-[#aaaaaa] leading-relaxed">
                Escanea el código con tu celular para unirte a la red de alertas de vuelo del auditorio.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://t.me/Stellar_App_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-block text-center"
              >
                ABRIR EN TELEGRAM
              </a>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-1.5 bg-black border border-[#333333] hover:border-white text-xs text-[#aaaaaa] uppercase tracking-wider transition-colors"
              >
                CERRAR
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
                  title="Abrir imagen original"
                  className="p-1.5 text-[#898989] hover:text-[#76b900] hover:bg-black transition-colors border border-[#333333]"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 text-[#898989] hover:text-white hover:bg-[#262626] transition-colors border border-[#333333]"
                  title="Cerrar (Esc)"
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
                  <span>DOMINIO PÚBLICO OFICIAL</span>
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
                  CERRAR
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
            <span>CHALLENGE: FLAME &amp; FIRE BEHAVIOR IN MICROGRAVITY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Seguridad contra Incendios para la Exploración Humana en la Luna y Marte
          </h1>

          <p className="text-sm sm:text-base text-[#a7a7a7] max-w-2xl mx-auto leading-relaxed">
            StellarApp es la primera plataforma de <strong>inteligencia de combustión espacial</strong> que desbloquea, clasifica y modela con IA cuatro décadas de investigación de la NASA en microgravedad.
          </p>

          {/* Mission Objective Callout */}
          <div className="bg-black/90 border border-[#76b900]/60 p-4 sm:p-5 text-left font-mono space-y-1.5 shadow-lg shadow-black">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#76b900] tracking-wider">
                // OBJETIVO PRIMORDIAL DE MISIÓN STELLARAPP
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-[#76b900]/10 border border-[#76b900]/40 text-[#76b900]">
                ARTEMIS &amp; MARS READY
              </span>
            </div>
            <p className="text-xs text-white leading-relaxed">
              Proteger la vida de los astronautas y la integridad estructural de la nave en <strong>bases lunares y hábitats marcianos</strong>, donde el fuego se comporta de forma radicalmente distinta a la Tierra, los extintores convencionales fallan y la evacuación es físicamente imposible.
            </p>
          </div>

          {/* KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-black border border-[#333333] text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#76b900]">40 Años</div>
              <div className="text-[10px] uppercase font-mono text-[#898989]">Ciencia NASA</div>
            </div>
            <div className="p-3 bg-black border border-[#333333] text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#00b0ff]">14 Estudios</div>
              <div className="text-[10px] uppercase font-mono text-[#898989]">NASA PSI Repositorio</div>
            </div>
            <div className="p-3 bg-black border border-[#333333] text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#e040fb]">&lt; 1 ms</div>
              <div className="text-[10px] uppercase font-mono text-[#898989]">Inferencia Air-Gapped</div>
            </div>
            <div className="p-3 bg-black border border-[#76b900]/40 text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">35 / 35</div>
              <div className="text-[10px] uppercase font-mono text-[#76b900]">Tests Ralph Loop</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="px-6 py-3 bg-[#76b900] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#5a8d00] transition-colors flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4 fill-black" />
              <span>PROBAR DASHBOARD EN VIVO</span>
            </Link>
            <a
              href="#defensa"
              className="px-6 py-3 bg-black text-white border border-[#333333] hover:border-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              DEFENSA ANTE LOS JUECES
            </a>
          </div>
        </div>

        {/* 1. El Problema */}
        <section className="space-y-6">
          <div>
            <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
              DIAGNÓSTICO DEL PROBLEMA
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              El Fuego en Microgravedad Desafía los Estándares Terrestres
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
                VALOR ESTRATÉGICO PARA LA NASA
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                ¿Por Qué StellarApp es Indispensable para Artemis?
              </h2>
              <p className="text-xs sm:text-sm text-[#a7a7a7] leading-relaxed">
                En el espacio profundo la evacuación es imposible. La plataforma asiste directamente a la NASA en tres áreas prioritarias:
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
                <div className="text-[11px] font-bold uppercase text-white">Aumento en Tasa</div>
                <p className="text-[10px] text-[#757575]">En 26% O₂ (Atmósfera Artemis).</p>
              </div>
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-white">0.0001g</div>
                <div className="text-[11px] font-bold uppercase text-white">Microgravedad Real</div>
                <p className="text-[10px] text-[#757575]">Datos de Cygnus Saffire.</p>
              </div>
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-[#76b900]">&lt; 1.2 cm/s</div>
                <div className="text-[11px] font-bold uppercase text-white">Extinción Pasiva</div>
                <p className="text-[10px] text-[#757575]">Auto-asfixia al apagar flujo.</p>
              </div>
              <div className="p-5 bg-black border border-[#333333] text-center space-y-1">
                <div className="text-3xl font-bold font-mono text-white">STD-6001</div>
                <div className="text-[11px] font-bold uppercase text-white">Norma NASA</div>
                <p className="text-[10px] text-[#757575]">Ensayos de inflamabilidad.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Innovaciones Técnicas y Mejoras Ralph Loop */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
                INGENIERÍA DE ALTA RESILIENCIA
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Innovaciones Implementadas con el Ciclo Autónomo Ralph Loop
              </h2>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1a1a1a] border border-[#333333] text-xs font-mono text-[#76b900]">
              <CheckCircle2 className="h-4 w-4" />
              <span>TEST SUITE: 35 / 35 PASANDO (100% VERIFICADO)</span>
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
                    alt="Astronauta Asistente StellarApp"
                    width={140}
                    height={140}
                    className="object-contain filter drop-shadow-[0_0_12px_rgba(118,185,0,0.3)]"
                  />
                  <div className="absolute -bottom-2 px-2 py-0.5 bg-[#76b900] text-black font-mono text-[9px] font-bold uppercase">
                    HUD FLOTANTE
                  </div>
                </div>
              </div>

              <div className="md:col-span-9 space-y-3">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-black border border-[#76b900] text-[#76b900] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>ASISTENTE VIRTUAL DE TRIPULACIÓN CON GROUNDING NASA</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Copiloto Táctico Siempre Accesible para Emergencias en Vuelo
                </h3>
                <p className="text-xs text-[#cccccc] leading-relaxed">
                  A diferencia de interfaces estáticas, el asistente de StellarApp flota de manera no intrusiva sobre cualquier panel de la aplicación. Integra un motor dual: resuelve consultas prioritarias en <strong>&lt;0.02 ms</strong> y ejecuta razonamiento RAG local con <strong>Qwen-2.5-3B</strong> sin enviar telemetría a servidores externos.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2 py-1 bg-black border border-[#333333] text-[11px] font-mono text-[#a7a7a7]">
                    • 100% Offline Air-Gapped
                  </span>
                  <span className="px-2 py-1 bg-black border border-[#333333] text-[11px] font-mono text-[#a7a7a7]">
                    • Guardrails NASA-STD-6001B
                  </span>
                  <span className="px-2 py-1 bg-black border border-[#333333] text-[11px] font-mono text-[#a7a7a7]">
                    • Límite Térmico Humano (45°C) & Casco Al-Li (150°C)
                  </span>
                  <span className="px-2 py-1 bg-black border border-[#76b900]/40 text-[11px] font-mono text-[#76b900]">
                    • 14 Estudios & 32 Parámetros NASA PSI Validados
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
                    alt="QR Bot Telegram StellarApp"
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#0088cc] text-white font-mono text-[9px] font-bold uppercase whitespace-nowrap">
                    ESCANEAR CON LA CÁMARA
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
                  <span>DEMOSTRACIÓN INTERACTIVA EN VIVO CON EL AUDITORIO Y JUECES</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-white">
                  Conecta tu Teléfono a la Red de Alerta Temprana ECLSS
                </h3>

                <p className="text-xs sm:text-sm text-[#cccccc] leading-relaxed">
                  Para que los evaluadores de la NASA y el público experimenten la velocidad de respuesta en primera persona, hemos habilitado un <strong>Webhook en tiempo real con Telegram</strong>. Cualquier persona en la sala puede suscribirse en 5 segundos sin instalar ninguna aplicación adicional.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-black/60 border border-[#333333] space-y-1">
                    <span className="text-[10px] font-bold text-[#0088cc] uppercase block">
                      1. ESCANEAR & SUSCRIBIRSE
                    </span>
                    <p className="text-[11px] text-[#a7a7a7]">
                      Apunta tu cámara al código QR y pulsa <strong>/start</strong> en Telegram para autenticar tu credencial de tripulante.
                    </p>
                  </div>

                  <div className="p-3 bg-black/60 border border-[#333333] space-y-1">
                    <span className="text-[10px] font-bold text-[#76b900] uppercase block">
                      2. ALARMA SIMULTÁNEA DE CABINA
                    </span>
                    <p className="text-[11px] text-[#a7a7a7]">
                      Cuando simulamos una fuga crítica de CO o fuego difusivo en el escenario, <strong>todos los teléfonos vibran al mismo milisegundo</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-black/60 border border-[#333333] space-y-1">
                    <span className="text-[10px] font-bold text-[#ffb703] uppercase block">
                      3. BOTONES DE TELEMETRÍA IOT
                    </span>
                    <p className="text-[11px] text-[#a7a7a7]">
                      Consulta el estado del Filtro de Kalman, la concentración de O₂ y el tiempo límite de evacuación directamente en el bot.
                    </p>
                  </div>

                  <div className="p-3 bg-black/60 border border-[#333333] space-y-1">
                    <span className="text-[10px] font-bold text-[#ff0055] uppercase block">
                      4. SIMULADOR DE MATERIALES
                    </span>
                    <p className="text-[11px] text-[#a7a7a7]">
                      Envía <code>/simular nomex</code> o pulsa el botón para ver cómo un material ignífugo en la Tierra se vuelve reactivo en Artemis.
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
                <span>EVIDENCIA OFICIAL DE VUELO ESPACIAL (DOMINIO PÚBLICO NASA)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Metraje de Video y Fotografía de Combustión en Microgravedad
              </h2>
              <p className="text-xs text-[#a7a7a7] mt-1">
                Archivos oficiales obtenidos de <strong>images.nasa.gov</strong> de las misiones de fuego real Saffire (carguero Cygnus) e ISS (BASS-II y SoFIE).
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#898989] shrink-0">
              NASA GLENN &amp; JSC ARCHIVES
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
                    Experimento Saffire-V (Cygnus) // Fuego Real
                  </h3>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-black border border-[#76b900]/40 text-[#76b900]">
                  VIDEO OFICIAL
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
                  Combustión sobre una muestra de PMMA (plexiglás) con ventilación forzada en el interior del carguero Cygnus tras desacoplarse de la ISS. Muestra cómo el fuego se ancla y avanza sin corrientes ascendentes.
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#757575] pt-1 border-t border-[#2a2a2a]">
                  <span>ID: GRC-2021-CN-00008</span>
                  <a
                    href="https://images.nasa.gov/details/GRC-2021-CN-00008"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#76b900] hover:underline"
                  >
                    Ver en NASA.gov ↗
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
                    Experimento SoFIE-GEL (ISS) // Llama Esférica
                  </h3>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-black border border-[#00b0ff]/40 text-[#00b0ff]">
                  VIDEO OFICIAL
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
                  Ignición y extinción de combustible sólido en microgravedad. Se observa la llama esférica girando sobre sí misma hasta alcanzar el límite crítico de autoextinción por asfixia radiativa.
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#757575] pt-1 border-t border-[#2a2a2a]">
                  <span>ID: SoFIE-GEL</span>
                  <a
                    href="https://images.nasa.gov/details/SoFIE-GEL"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00b0ff] hover:underline"
                  >
                    Ver en NASA.gov ↗
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
                      <span>AMPLIAR</span>
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
        <section id="defensa" className="space-y-6">
          <div>
            <span className="text-[11px] font-bold text-[#76b900] uppercase tracking-widest block">
              DEFENSA TÉCNICA DEL PROYECTO
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Preguntas Clave de los Evaluadores de la NASA
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
          <h3 className="text-xl font-bold text-white uppercase">Acceso al Panel de Control de Vuelo</h3>
          <p className="text-xs text-[#a7a7a7] max-w-xl mx-auto">
            Explora el catálogo de experimentos, ejecuta la simulación predictiva de atmósferas y consulta al agente IA.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#76b900] text-black font-bold uppercase tracking-wider text-xs hover:bg-[#5a8d00] transition-colors"
          >
            <span>LANZAR WORKBENCH STELLARAPP</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#333333] bg-black py-8 text-center text-xs text-[#757575]">
        <p>Equipo StellarApp • NASA Space Apps Challenge 2026</p>
      </footer>
    </div>
  );
}
