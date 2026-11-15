"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Terminal,
  X,
  Minimize2,
  Maximize2,
  Send,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  isGuardrailBlocked?: boolean;
}

export default function FloatingAIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👨‍🚀 **¡HOLA! SOY TU ASISTENTE DE MISIÓN EN MICROGRAVEDAD (STELLARAPP)**\n\n" +
        "Estoy indexado con los experimentos de vuelo **Saffire (I-IV)**, **BASS-II**, **FLEX-2**, **SAME** y los estándares de fuego **NASA-STD-6001** / **NASA-STD-3001**.\n\n" +
        "Tengo **guardrails activos**: solo respondo consultas sobre seguridad espacial, combustión en 0g/Luna/Marte y protección de la tripulación. ¿Qué parámetro deseas evaluar?",
      sources: ["NASA-STD-6001B", "Saffire-I"],
    },
  ]);

  const quickQuestions = [
    "¿Por qué las llamas son esféricas y azules en 0g?",
    "¿Qué peligro tiene el 26% de O₂ en Artemis?",
    "¿Cómo detecta SAME el humo aglomerado en la ISS?",
    "¿Cuáles son los límites térmicos del astronauta y del casco?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener("open-floating-ai", handleOpen);
    return () => window.removeEventListener("open-floating-ai", handleOpen);
  }, []);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      if (resp.ok) {
        const data = await resp.json();
        const isBlocked = data.model === "NASA-Domain-Guardrails";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            sources: data.sources,
            isGuardrailBlocked: isBlocked,
          },
        ]);
      } else {
        throw new Error("Error en servidor backend");
      }
    } catch {
      // Local fallback in case network issues
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "**DIAGNÓSTICO TÉCNICO LOCAL (FALLBACK EN RED LOCAL):**\n\n" +
            "1. **Mecanismo Físico:** En microgravedad no existe empuje convectivo natural. El frente de llama depende únicamente del flujo forzado de ventilación en cabina.\n" +
            "2. **Mitigación Operacional:** Detener recirculación de aire bajo 1.2 cm/s para inducir apagado por radiación (radiative quenching) e inyectar nitrógeno N₂.",
          sources: ["EXP-SAFFIRE-001"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "👨‍🚀 **COMUNICACIÓN REINICIADA:**\n\n" +
          "Guardrails activos. Realiza cualquier consulta técnica sobre microgravedad, Saffire, FIRMS o seguridad en Artemis/Marte.",
        sources: ["NASA-STD-6001B"],
      },
    ]);
  };

  return (
    <aside aria-label="Asistente de IA Flotante" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* 1. Closed state: Floating Astronaut Widget (Option 1: 100% Transparent / Hologram) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 p-1 bg-transparent border-0 shadow-none hover:scale-105 text-white transition-transform duration-300 cursor-pointer select-none"
        >
          {/* Animated Astronaut on Rocket */}
          <div className="relative w-14 h-14 flex-shrink-0 animate-bounce" style={{ animationDuration: "2.5s" }}>
            <img
              src="/images/astronaut-agent.png"
              alt="Astronauta Asistente NASA"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(118,185,0,0.85)] group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col text-left drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold tracking-wider uppercase text-white group-hover:text-[#76b900] transition-colors">
                ASISTENTE NASA
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#a7a7a7] group-hover:text-white transition-colors">
              ASTRONAUTA • EN ÓRBITA
            </span>
          </div>
        </button>
      )}

      {/* 2. Open state: Floating HUD Terminal Window */}
      {isOpen && (
        <div
          className={`relative bg-black border border-[#76b900] shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex flex-col rounded-[2px] transition-all duration-200 overflow-hidden ${
            isMinimized
              ? "w-[300px] sm:w-[360px] h-[52px]"
              : "w-[calc(100vw-32px)] sm:w-[420px] md:w-[450px] h-[580px] max-h-[85dvh]"
          }`}
        >
          {/* Corner Square */}
          <div className="corner-square" />

          {/* HUD Header */}
          <div className="p-3 bg-[#1a1a1a] border-b border-[#333333] flex items-center justify-between select-none">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-8 h-8 rounded-full bg-black border border-[#76b900] p-0.5 overflow-hidden flex items-center justify-center flex-shrink-0">
                <img
                  src="/images/astronaut-agent.png"
                  alt="Avatar Astronauta"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-white">
                    ASTRONAUTA ASISTENTE NASA
                  </h3>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#76b900] animate-pulse" />
                </div>
                <div className="flex items-center space-x-1 text-[9px] font-mono text-[#76b900]">
                  <ShieldCheck className="h-3 w-3" />
                  <span>GUARDRAILS ACTIVOS • COMBUSTIÓN EN 0G</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-[#898989]">
              <button
                onClick={resetChat}
                title="Reiniciar chat"
                className="p-1 hover:text-white hover:bg-[#262626] rounded-[2px] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Maximizar" : "Minimizar"}
                className="p-1 hover:text-white hover:bg-[#262626] rounded-[2px] transition-colors"
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar ventana"
                className="p-1 hover:text-[#df6500] hover:bg-[#262626] rounded-[2px] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Quick suggestion chips */}
              <div className="bg-[#141414] border-b border-[#262626] p-2 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="whitespace-nowrap px-2.5 py-1 bg-black border border-[#333333] hover:border-[#76b900] text-[10px] text-[#cccccc] hover:text-[#76b900] font-mono transition-colors rounded-[2px]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto bg-black text-xs">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#757575] mb-1">
                      {msg.role === "assistant" ? (
                        <>
                          <img
                            src="/images/astronaut-agent.png"
                            alt="Avatar"
                            className="w-3.5 h-3.5 object-contain inline-block"
                          />
                          <span className="text-[#76b900] font-bold">ASTRONAUTA STELLARAPP</span>
                        </>
                      ) : (
                        <span>INGENIERO DE MISIÓN</span>
                      )}
                    </div>

                    <div
                      className={`max-w-[90%] p-3 rounded-[2px] leading-relaxed text-[11px] ${
                        msg.role === "user"
                          ? "bg-[#262626] text-white border border-[#444444]"
                          : msg.isGuardrailBlocked
                          ? "bg-[#1a1111] text-[#fca5a5] border border-[#ef4444]/50"
                          : "bg-[#1a1a1a] text-[#cccccc] border border-[#333333]"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : (
                        <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                      )}

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-[#333333] flex flex-wrap items-center gap-1.5 text-[9px] font-mono">
                          <span className="text-[#898989] flex items-center">
                            <BookOpen className="h-3 w-3 mr-1 text-[#76b900]" />
                            CITAS NASA:
                          </span>
                          {msg.sources.map((src, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-1.5 py-0.5 bg-black border border-[#444444] text-[#76b900]"
                            >
                              {src}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#76b900] bg-[#1a1a1a] p-2.5 border border-[#333333] rounded-[2px]">
                    <div className="h-3 w-3 border-2 border-[#76b900] border-t-transparent animate-spin rounded-full" />
                    <span>EL ASTRONAUTA ESTÁ CONSULTANDO LA TELEMETRÍA Y NORMAS NASA...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-[#1a1a1a] border-t border-[#333333]">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder="Pregúntale al astronauta sobre microgravedad o fuego..."
                    className="flex-1 bg-black border border-[#333333] px-3 py-2 text-xs text-white placeholder-[#757575] focus:outline-none focus:border-[#76b900] rounded-[2px]"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="p-2 bg-[#76b900] text-black hover:bg-[#5a8d00] disabled:bg-[#333333] disabled:text-[#757575] transition-colors rounded-[2px]"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-[#757575] mt-1.5 px-0.5">
                  <span>GROUNDING: Saffire • BASS • FLEX • FIRMS</span>
                  <span className="text-[#76b900]">GUARDRAIL: 100% CIENTÍFICO</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
