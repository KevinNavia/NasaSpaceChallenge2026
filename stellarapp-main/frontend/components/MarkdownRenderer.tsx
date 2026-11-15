"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function cleanLatexMath(text: string): string {
  if (!text) return "";
  return text
    // Replace raw LaTeX percentages
    .replace(/\\%/g, "%")
    // Replace micro symbols
    .replace(/\\mu\s*m/g, "µm")
    .replace(/\\,/g, " ")
    // Process $math$ patterns
    .replace(/\$([^$]+)\$/g, (_, math) => {
      return math
        .replace(/\\text\{\s*([^}]+)\s*\}/g, "$1")
        .replace(/\\%/g, "%")
        .replace(/O_2/g, "O₂")
        .replace(/CO_2/g, "CO₂")
        .replace(/N_2/g, "N₂")
        .replace(/C_2/g, "C₂")
        .replace(/10\^\{-4\}/g, "10⁻⁴")
        .replace(/10\^-4/g, "10⁻⁴")
        .replace(/\\approx/g, "≈")
        .replace(/\\Delta\s*\\rho/g, "Δρ")
        .replace(/\\le/g, "≤")
        .replace(/\\ge/g, "≥")
        .replace(/\\times/g, "×")
        .replace(/\\,/g, " ");
    })
    // Extra cleanup for leftover brackets or escaped text
    .replace(/\\text\{\s*([^}]+)\s*\}/g, "$1");
}

function parseFormattedText(text: string): React.ReactNode[] {
  // Regex splitting by:
  // 1. **bold**
  // 2. `code`
  // 3. *italic*
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-white bg-[#76b900]/10 px-1 py-0.5 rounded border border-[#76b900]/30">
          {inner}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={index}
          className="bg-black/80 px-1.5 py-0.5 rounded text-[#76b900] font-mono text-[11px] border border-[#333333]"
        >
          {inner}
        </code>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic text-[#d0d0d0]">
          {inner}
        </em>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const cleaned = cleanLatexMath(content);
  // Split into paragraphs by double newlines or single newlines
  const paragraphs = cleaned.split(/\n\n+/);

  return (
    <div className="space-y-2.5 text-xs sm:text-[13px] leading-relaxed font-sans text-[#cccccc]">
      {paragraphs.map((p, pIdx) => {
        const trimmed = p.trim();
        if (!trimmed) return null;

        // Numbered list item check (e.g. "1. **Title:** text")
        const listMatch = trimmed.match(/^(\d+)\.\s+([\s\S]+)$/);
        if (listMatch) {
          const num = listMatch[1];
          const rest = listMatch[2];
          return (
            <div key={pIdx} className="flex items-start space-x-2 bg-black/40 p-2.5 border border-[#2a2a2a] rounded-[2px]">
              <span className="shrink-0 h-5 w-5 bg-black border border-[#76b900] text-[#76b900] text-[10px] font-mono font-bold flex items-center justify-center rounded-[1px] mt-0.5">
                {num}
              </span>
              <div className="flex-1 leading-relaxed">
                {parseFormattedText(rest)}
              </div>
            </div>
          );
        }

        // Bullet list item check (e.g. "• text" or "- text")
        const bulletMatch = trimmed.match(/^([•\-])\s+([\s\S]+)$/);
        if (bulletMatch) {
          const rest = bulletMatch[2];
          return (
            <div key={pIdx} className="flex items-start space-x-2 pl-1">
              <span className="shrink-0 h-1.5 w-1.5 bg-[#76b900] rounded-full mt-2" />
              <div className="flex-1 leading-relaxed">
                {parseFormattedText(rest)}
              </div>
            </div>
          );
        }

        // Header / Alert check (e.g. starts with ⚠️ or **Title**)
        if (trimmed.startsWith("⚠️") || trimmed.startsWith("🚨") || trimmed.startsWith("ℹ️")) {
          return (
            <div key={pIdx} className="p-2.5 bg-black/60 border border-[#76b900]/40 text-white font-medium">
              {parseFormattedText(trimmed)}
            </div>
          );
        }

        // Standard paragraph (render line breaks within it)
        const lines = trimmed.split("\n");
        return (
          <p key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => (
              <span key={lIdx} className="block">
                {parseFormattedText(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
