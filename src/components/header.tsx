"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./language";

export function Header() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const isHome = pathname === "/";
  const languageSwitch = <span className="language-switch" aria-label={lang === "en" ? "Language" : "語言"}>
    <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
    <button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")} aria-pressed={lang === "zh"}>中</button>
  </span>;

  if (isHome) return (
    <nav className="home-language home-tools" aria-label={lang === "en" ? "Homepage utilities" : "首頁工具列"}>
      <a href="#about">{lang === "en" ? "About" : "關於"}</a>
      <Link href="/resume" target="_blank">{lang === "en" ? "Resume ↗" : "履歷 ↗"}</Link>
      {languageSwitch}
    </nav>
  );

  return (
    <header className="site-header">
      <Link href="/" className="identity" aria-label="Victor Chang — home">
        <strong>VICTOR CHANG</strong>
        <span>{lang === "en" ? "Software Engineer" : "軟體工程師"}</span>
      </Link>
      <nav aria-label={lang === "en" ? "Primary navigation" : "主要導覽"}>
        <Link href={isHome ? "#about" : "/#about"}>{lang === "en" ? "About" : "關於"}</Link>
        <Link href="/resume" target="_blank">{lang === "en" ? "Resume ↗" : "履歷 ↗"}</Link>
        {languageSwitch}
      </nav>
    </header>
  );
}
