import Link from "next/link";
import type { Locale } from "@/i18n";
import { LangSwitch } from "./lang-switch";
import { ThemeToggle } from "./theme-toggle";

export const EMAIL = "t790219520@gmail.com";
export const GITHUB = "https://github.com/outsider987";
export const LINKEDIN = "https://linkedin.com/in/yao-hsien-chang";

const BUILD_DATE = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const navLabels = {
  en: { work: "work", services: "services" },
  zh: { work: "作品", services: "服務" },
} as const;

/** `path` is the current path without the locale prefix, e.g. "/work" */
export function Nav({ locale, path }: { locale: Locale; path: string }) {
  const t = navLabels[locale];
  return (
    <header className="border-b border-rule">
      <div className="scroll-progress" aria-hidden />
      <nav className="mx-auto flex max-w-3xl items-baseline justify-between px-5 py-4 font-mono text-[13px] text-ink-2">
        <Link href={`/${locale}`} className="text-ink hover:text-red-ink">
          victor chang
        </Link>
        <div className="flex items-baseline gap-5">
          <Link href={`/${locale}/work`} className="hover:text-red-ink">
            {t.work}
          </Link>
          <Link href={`/${locale}/services`} className="hover:text-red-ink">
            {t.services}
          </Link>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-red-ink">
            github
          </a>
          <LangSwitch locale={locale} path={path} />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

const footerLabels = {
  en: {
    place: "Taipei, Taiwan · UTC+8",
    colophon: (
      <>
        Set in Bricolage Grotesque &amp; IBM Plex Mono, black on white. Built
        with Next.js — deployed {BUILD_DATE}.
      </>
    ),
    source: "Source",
  },
  zh: {
    place: "台北 · UTC+8",
    colophon: (
      <>
        字體 Bricolage Grotesque、Noto Sans TC 與 IBM Plex
        Mono，黑白單色。以 Next.js 構建——部署於 {BUILD_DATE}。
      </>
    ),
    source: "原始碼",
  },
} as const;

export function Footer({ locale }: { locale: Locale }) {
  const t = footerLabels[locale];
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-3xl space-y-1.5 px-5 py-8 font-mono text-xs leading-relaxed text-ink-3">
        <p>
          {t.place} ·{" "}
          <a className="hover:text-red-ink" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>{" "}
          ·{" "}
          <a className="hover:text-red-ink" href={GITHUB} target="_blank" rel="noreferrer">
            github
          </a>{" "}
          ·{" "}
          <a className="hover:text-red-ink" href={LINKEDIN} target="_blank" rel="noreferrer">
            linkedin
          </a>
        </p>
        <p>
          {t.colophon}{" "}
          <a
            className="hover:text-red-ink"
            href={`${GITHUB}/victor-site`}
            target="_blank"
            rel="noreferrer"
          >
            {t.source}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}

/** A ledger row: hairline top rule, mono meta column, content column. */
export function Row({
  meta,
  children,
  href,
}: {
  meta: string;
  children: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <div className="reveal grid gap-1 border-t border-rule py-4 sm:grid-cols-[9.5rem_1fr] sm:gap-6">
      <div className="tnum font-mono text-xs leading-6 text-ink-3">{meta}</div>
      <div>{children}</div>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="group block hover:bg-wash">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-14 mb-2 font-mono text-[13px] text-ink-2">{children}</h2>
  );
}

/** Index-card: square corners, ink hairline, hard offset shadow — a physical card, not a UI card. */
export function Card({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const base = `reveal block border border-ink bg-paper p-6 card-shadow ${className}`;
  if (href) {
    return (
      <Link
        href={href}
        className={`${base} card-hover transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5`}
      >
        {children}
      </Link>
    );
  }
  return <div className={base}>{children}</div>;
}
