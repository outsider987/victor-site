import type { Metadata } from "next";
import { Nav, Footer, Eyebrow, Chip, EMAIL } from "@/components/site";

export const metadata: Metadata = {
  title: "Services — Victor Chang",
  description:
    "Freelance full-stack delivery: real-time dashboards, product platforms, and AI-accelerated development. English / 中文.",
};

const offers = [
  {
    h: "Full-stack product delivery",
    p: "A feature, a module, or a whole platform — React/Next.js frontend to Node/Go backend, deployed and documented.",
    fit: "Best for: teams that need senior hands without a hiring cycle.",
  },
  {
    h: "Real-time systems & dashboards",
    p: "WebSocket data feeds, live-updating consoles, event-driven backends — built to stay smooth under thousands of updates per minute.",
    fit: "Best for: trading, gaming, logistics, monitoring products.",
  },
  {
    h: "AI-accelerated delivery",
    p: "I run a production-grade agentic workflow (Claude Code). You get senior-quality output at a pace one engineer isn't supposed to have.",
    fit: "Best for: MVPs and deadline-bound builds.",
  },
];

const steps = [
  ["01", "Scope call", "30–60 min, free. We define what done looks like. (EN / 中文)"],
  ["02", "Fixed-scope proposal", "Deliverables, timeline, price — in writing."],
  ["03", "Weekly demo cadence", "Working software every week, async updates in between."],
  ["04", "Handover", "Docs, tests, deploy pipeline — your team can run it without me."],
];

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-5 pb-4 pt-16">
          <Eyebrow>For clients · 接案</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Systems that touch money,{" "}
            <span className="text-accent">built to be trusted</span>.
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            I&apos;ve spent seven years on insurance claims, live wagering
            markets, and crypto products — the kind of software where bugs cost
            real money. That&apos;s the standard your project gets.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            中文合作無障礙——需求訪談、報價、交付文件皆可全中文進行。
          </p>
        </section>

        {/* Offers */}
        <section className="mx-auto w-full max-w-5xl px-5 py-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            What I take on
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {offers.map((o) => (
              <div key={o.h} className="rounded-xl border border-line bg-panel p-6">
                <h3 className="text-lg font-semibold">{o.h}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{o.p}</p>
                <p className="mt-4 font-mono text-xs leading-relaxed text-accent">
                  {o.fit}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Track record */}
        <section className="mx-auto w-full max-w-5xl px-5 py-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Track record
          </h2>
          <div className="mt-5 rounded-xl border border-line bg-panel p-6 sm:p-7">
            <ul className="space-y-2.5 text-[15px] leading-relaxed text-foreground/90">
              {[
                "Freelance delivery for a leading crypto gaming platform — frontend architecture and feature delivery.",
                "4 years shipping a health-insurance claims platform used daily by clinics across Hong Kong.",
                "Currently building a real-time sports wagering exchange: live odds consoles, event-driven Go services.",
                "Custom CMS platforms enabling non-technical teams to run content independently.",
              ].map((b) => (
                <li key={b} className="flex gap-2.5">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {["React / Next.js", "Vue / Nuxt", "Node.js / NestJS", "Go", "PostgreSQL", "AWS / GCP", "Docker"].map(
                (s) => (
                  <Chip key={s}>{s}</Chip>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto w-full max-w-5xl px-5 py-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            How it works
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            {steps.map(([n, h, p]) => (
              <div key={n} className="rounded-xl border border-line bg-panel p-5">
                <p className="font-mono text-xs text-accent">{n}</p>
                <h3 className="mt-2 font-semibold">{h}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-5xl px-5 py-16 text-center">
          <p className="text-lg text-muted">
            Have a project in mind? Tell me what you&apos;re building.
          </p>
          <a
            className="mt-4 inline-block rounded-md border border-accent-dim bg-panel px-6 py-3 font-mono text-accent transition-colors hover:bg-panel-2"
            href={`mailto:${EMAIL}?subject=Project inquiry`}
          >
            {EMAIL}
          </a>
          <p className="mt-3 font-mono text-xs text-muted">
            EN / 中文 · Replies within 24h · UTC+8
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
