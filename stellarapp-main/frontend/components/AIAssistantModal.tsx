"use client";
import { useLanguage } from "../i18n/LanguageContext";

import React, { useState } from "react";
import { X, Send, Sparkles, Terminal, BookOpen } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export default function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Especialista de IA de la NASA para Seguridad contra Incendios en Microgravedad activo. " +
        "Indexación completa de las misiones Saffire, BASS-II y FLEX-2. ¿Qué parámetro físico o protocolo de extinción para Artemis/Marte deseas consultar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sampleQuestions = language === "en" ? [
    "Why can flames become spherical in microgravity?",
    "How does oxygen concentration affect flame propagation?",
    "What changes in smoke transport without buoyancy?",
    "What did FLEX discover about cool flames?",
  ] : [
    "¿Por qué las llamas son esféricas en microgravedad?",
    "¿Qué peligro representa el 26% de O2 en Artemis?",
    "¿Cómo actúa el protocolo de extinción en la ISS si no hay convección?",
    "¿Qué descubrió FLEX-2 sobre el fenómeno de 'Cool Flames'?",
  ];

  if (!isOpen) return null;

  const sendMessage = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const newMsgs: ChatMessage[] = [...messages, { role: "user", content: q }];
    setMessages(newMsgs);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, language }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setMessages([
          ...newMsgs,
          {
            role: "assistant",
            content: data.answer,
            sources: data.sources,
          },
        ]);
      } else {
        throw new Error("Error backend");
      }
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          content:
            "**DIAGNÓSTICO DE SEGURIDAD OPERACIONAL (FALLBACK LOCAL):**\n\n" +
            "1. **Mecanismo Físico:** En microgravedad (0g), la ausencia de flotabilidad convectiva elimina las corrientes ascendentes. El oxígeno se transfiere únicamente por difusión lenta.\n" +
            "2. **Peligro en Cabina:** La combustión latente ('smoldering') puede no emitir humo negro ni luz visible, liberando monóxido de carbono sin activar detectores convencionales.\n" +
            "3. **Protocolo:** Detener la ventilación del módulo afectado por debajo de 1.2 cm/s e inundar con gas nitrógeno.",
          sources: ["EXP-SAFFIRE-001", "EXP-BASS-011"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-none">
      <div className="relative w-full max-w-2xl bg-black border border-[#76b900] shadow-2xl flex flex-col h-[600px] max-h-[92dvh] overflow-hidden">
        {/* Corner Square */}
        <div className="corner-square" />

        {/* Header */}
        <div className="p-4 border-b border-[#333333] flex items-center justify-between bg-[#1a1a1a]">
          <div className="flex items-center space-x-2.5">
            <Terminal className="h-5 w-5 text-[#76b900]" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {t("AGENTE DE INTELIGENCIA DE COMBUSTIÓN NASA\n              ")}</h3>
              <p className="text-[10px] text-[#898989] font-mono">{t("GROUNDING EN PAPERS SAFFIRE & BASS")}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#898989] hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#76b900] text-black font-bold"
                    : "bg-[#1a1a1a] border border-[#333333] text-[#cccccc] whitespace-pre-wrap"
                }`}
              >
                {m.role === "assistant" ? (
                  <MarkdownRenderer content={idx === 0 && m.role === "assistant" && language === "en" ? "StellarApp mission assistant: ask about microgravity combustion, NASA experiments, oxygen, ventilation, smoke and spacecraft safety. This is a research demo, not a certified crew system." : m.content} />
                ) : (
                  m.content
                )}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#333333] flex items-center space-x-1.5 text-[10px] text-[#76b900] font-mono">
                    <BookOpen className="h-3 w-3" />
                    <span>{t("REF: ")}{m.sources.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-[#76b900] text-xs font-mono py-2">
              <span className="animate-pulse">{t("PROCESANDO CONSULTA CON MOTOR GEMINI...")}</span>
            </div>
          )}
        </div>

        {/* Suggestion Pills */}
        <div className="px-4 py-2 bg-[#1a1a1a] border-t border-[#333333] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-[10px] font-bold text-[#898989] uppercase tracking-wider shrink-0">{t("PROMPTS:")}</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              className="shrink-0 px-2.5 py-1 bg-black hover:border-[#76b900] border border-[#333333] text-[#cccccc] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-black border-t border-[#333333] flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t("Introduce tu consulta técnica sobre fuego en microgravedad...")}
            className="flex-1 bg-[#1a1a1a] border border-[#333333] px-4 py-2.5 text-xs text-white placeholder-[#757575] focus:outline-none focus:border-[#76b900]"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-[#76b900] text-black font-bold uppercase tracking-wider text-xs hover:bg-[#5a8d00] disabled:opacity-40 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
