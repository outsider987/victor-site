"use client";

import Link from "next/link";
import type { Locale } from "@/i18n";

/**
 * Manual language switch. Persists the choice so the middleware's
 * auto-detection defers to it on the next bare-domain visit.
 */
export function LangSwitch({ locale, path }: { locale: Locale; path: string }) {
  const other: Locale = locale === "en" ? "zh" : "en";
  return (
    <Link
      href={`/${other}${path}`}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="border border-line px-1.5 py-0.5 text-ink-2 hover:border-ink hover:text-red-ink"
      aria-label={other === "zh" ? "切換到中文" : "Switch to English"}
    >
      {other === "zh" ? "中文" : "EN"}
    </Link>
  );
}
