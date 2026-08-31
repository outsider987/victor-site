"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import type { Lang } from "@/data/projects";

const LanguageContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: "en",
  setLang: () => undefined,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("victor-language");
    if (saved !== "zh") return;
    const timer = window.setTimeout(() => setLang("zh"), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    window.localStorage.setItem("victor-language", lang);
  }, [lang]);

  return (
    <LanguageContext value={{ lang, setLang }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LanguageContext>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
