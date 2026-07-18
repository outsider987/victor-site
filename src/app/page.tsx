import Link from "next/link";
import { Nav, Footer, Eyebrow, Chip, EMAIL } from "@/components/site";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-5 pb-16 pt-20 sm:pt-28">
          <Eyebrow>Taiwan · UTC+8 · Remote</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            I build real-time,{" "}
            <span className="text-accent">real-money</span> systems.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Senior full-stack engineer — 7+ years shipping insurance claims
            platforms, live trading consoles, and crypto products with
            distributed teams across APAC.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["React", "TypeScript", "Node.js", "Go", "NATS", "PostgreSQL", "AWS / GCP"].map(
              (t) => (
                <Chip key={t}>{t}</Chip>
              ),
            )}
          </div>
        </section>

        {/* Fork */}
        <section className="mx-auto w-full max-w-5xl px-5 pb-24">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/work"
              className="group rounded-xl border border-line bg-panel p-7 transition-colors hover:border-accent-dim"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                For hiring teams
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Hiring for your team?
              </h2>
              <p className="mt-3 leading-relaxed text-muted">
                Case studies from InsurTech, a live wagering exchange, and Web3 —
                plus how I work with distributed, async-first teams.
              </p>
              <p className="mt-5 font-mono text-sm text-accent">
                View work{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>

            <Link
              href="/services"
              className="group rounded-xl border border-line bg-panel p-7 transition-colors hover:border-accent-dim"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                For clients
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Need something built?
              </h2>
              <p className="mt-3 leading-relaxed text-muted">
                Freelance delivery for product teams — from real-time dashboards
                to full platforms, shipped with an AI-accelerated workflow.
              </p>
              <p className="mt-5 font-mono text-sm text-accent">
                View services{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          </div>

          <p className="mt-10 text-center text-sm text-muted">
            Or just say hi —{" "}
            <a
              className="text-foreground underline decoration-line underline-offset-4 hover:decoration-accent"
              href={`mailto:${EMAIL}`}
            >
              {EMAIL}
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
