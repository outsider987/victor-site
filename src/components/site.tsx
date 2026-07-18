import Link from "next/link";

export const EMAIL = "t790219520@gmail.com";
export const GITHUB = "https://github.com/outsider987";
export const LINKEDIN = "https://linkedin.com/in/yao-hsien-chang";

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="font-mono text-sm tracking-widest text-foreground">
          <span className="text-accent">▲</span> VICTOR CHANG
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted">
          <Link href="/work" className="transition-colors hover:text-foreground">
            Work
          </Link>
          <Link href="/services" className="transition-colors hover:text-foreground">
            Services
          </Link>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs tracking-wide">
          TAIWAN · UTC+8 · REMOTE-READY
        </p>
        <p className="flex gap-4">
          <a className="hover:text-foreground" href={`mailto:${EMAIL}`}>
            Email
          </a>
          <a className="hover:text-foreground" href={GITHUB} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="hover:text-foreground" href={LINKEDIN} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-panel-2 px-2.5 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{children}</p>
  );
}
