"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "./en.json";
import es from "./es.json";

export type Language = "es" | "en";
const STORAGE_KEY = "stellarapp-language";

type LanguageAPI = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageAPI | null>(null);
const english = en as Record<string, string>;
const spanish = es as Record<string, string>;

// Spanish strings are the source keys; new UI text can be translated by adding
// the Spanish-to-English pair to i18n/en.json. No external translation API needed.
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "en") {
        setLanguageState("en");
      }
    } catch { /* Local storage is optional */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try { window.localStorage.setItem(STORAGE_KEY, language); } catch { /* Optional */ }
  }, [language]);

  const setLanguage = useCallback((selected: Language) => setLanguageState(selected), []);
  const t = useCallback((text: string): string => {
    if (!text) return "";
    // JSX entity text moved to a JS expression must be decoded explicitly.
    const decoded = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    if (language === "es") return spanish[decoded.trim()] || decoded;
    const trimmed = decoded.trim();
    const translated = english[trimmed];
    if (!translated) return decoded; // new strings remain legible until translated
    const leading = decoded.match(/^\s*/)?.[0] || "";
    const trailing = decoded.match(/\s*$/)?.[0] || "";
    return leading + translated + trailing;
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageAPI {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used under LanguageProvider");
  return context;
}
