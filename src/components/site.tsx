import Link from "next/link";

export const EMAIL = "t790219520@gmail.com";
export const GITHUB = "https://github.com/outsider987";
export const LINKEDIN = "https://linkedin.com/in/yao-hsien-chang";

const BUILD_DATE = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function Nav() {
  return (
    <header className="border-b border-rule">
      <nav className="mx-auto flex max-w-3xl items-baseline justify-between px-5 py-4 font-mono text-[13px] text-ink-2">
        <Link href="/" className="text-ink hover:text-red-ink">
          victor chang
        </Link>
        <div className="flex gap-5">
          <Link href="/work" className="hover:text-red-ink">
            work
          </Link>
          <Link href="/services" className="hover:text-red-ink">
            services
          </Link>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-red-ink">
            github
          </a>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-3xl space-y-1.5 px-5 py-8 font-mono text-xs leading-relaxed text-ink-3">
        <p>
          Taipei, Taiwan · UTC+8 ·{" "}
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
          Set in Newsreader &amp; IBM Plex Mono on Flexoki paper. Built with
          Next.js — deployed {BUILD_DATE}.{" "}
          <a
            className="hover:text-red-ink"
            href={`${GITHUB}/victor-site`}
            target="_blank"
            rel="noreferrer"
          >
            Source
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
    <div className="grid gap-1 border-t border-rule py-4 sm:grid-cols-[9.5rem_1fr] sm:gap-6">
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
  const base = `block border border-ink bg-paper p-6 shadow-[4px_4px_0_0_#100f0f] ${className}`;
  if (href) {
    return (
      <Link
        href={href}
        className={`${base} transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#100f0f]`}
      >
        {children}
      </Link>
    );
  }
  return <div className={base}>{children}</div>;
}
