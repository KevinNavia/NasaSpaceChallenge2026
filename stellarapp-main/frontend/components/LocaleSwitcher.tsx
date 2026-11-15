"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe2 } from "lucide-react";
import { usePathname, useRouter } from "../navigation";
import { locales, type Locale } from "../locales";

interface LocaleSwitcherProps {
  className?: string;
}

export default function LocaleSwitcher({ className = "" }: LocaleSwitcherProps) {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`h-8 inline-flex items-center border border-[#333333] bg-[#111111] box-border ${
        isPending ? "opacity-60" : ""
      } ${className}`}
    >
      <Globe2 className="h-3.5 w-3.5 text-[#76b900] mx-2 shrink-0" aria-hidden="true" />
      {locales.map((item) => {
        const isActive = item === locale;
        return (
          <button
            key={item}
            type="button"
            onClick={() => switchTo(item)}
            aria-pressed={isActive}
            aria-label={item === "es" ? "Español" : "English"}
            className={`h-full px-2.5 flex items-center justify-center text-[11px] font-bold uppercase tracking-wider transition-colors ${
              isActive
                ? "bg-[#76b900] text-black"
                : "text-[#a7a7a7] hover:text-white hover:bg-[#1f1f1f]"
            }`}
          >
            {t(item)}
          </button>
        );
      })}
    </div>
  );
}
