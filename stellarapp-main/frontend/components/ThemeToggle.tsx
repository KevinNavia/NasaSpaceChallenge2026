"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const t = useTranslations("themeToggle");
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("stellar_theme") as "dark" | "light" | null;
      if (stored === "light") {
        setThemeState("light");
        document.documentElement.classList.add("light");
      } else {
        setThemeState("dark");
        document.documentElement.classList.remove("light");
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setThemeState(nextTheme);
    try {
      localStorage.setItem("stellar_theme", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    } catch (e) {}
  };

  if (!mounted) {
    return (
      <div
        className={`h-8 w-8 border border-[#333333] bg-[#111111] opacity-60 box-border rounded-[2px] ${className}`}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("switchToDay") : t("switchToNight")}
      title={isDark ? t("switchToDay") : t("switchToNight")}
      className={`h-8 w-8 inline-flex items-center justify-center border border-[#333333] hover:border-white bg-[#111111] hover:bg-[#1a1a1a] text-white rounded-[2px] box-border transition-colors ${className}`}
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-[#76b900]" />
      ) : (
        <Sun className="h-4 w-4 text-[#f59e0b]" />
      )}
    </button>
  );
}
