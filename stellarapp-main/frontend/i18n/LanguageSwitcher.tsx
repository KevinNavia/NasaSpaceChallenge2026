"use client";
import React from "react";
import { useLanguage } from "./LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div role="group" aria-label={language === "es" ? "Idioma de la página" : "Page language"}
      className="inline-flex shrink-0 border border-[#555] bg-[#101010] rounded-sm p-0.5">
      {(["es", "en"] as const).map((locale) => (
        <button key={locale} type="button" lang={locale} onClick={() => setLanguage(locale)}
          aria-label={locale === "es" ? "Español" : "English"}
          aria-pressed={language === locale}
          className={`min-w-9 px-2 py-1 text-xs font-bold rounded-sm transition-colors ${language === locale ? "bg-[#76b900] text-black" : "text-[#dddddd] hover:text-white hover:bg-[#333]"}`}>
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
