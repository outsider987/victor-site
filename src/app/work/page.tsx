import type { Metadata } from "next";
import { Nav, Footer, Eyebrow, Chip, EMAIL, GITHUB, LINKEDIN } from "@/components/site";

export const metadata: Metadata = {
  title: "Work — Victor Chang",
  description:
    "Case studies: real-time trading console for a wagering exchange, insurance claims platform, and Web3 product work.",
};

const caseStudies = [
  {
    tag: "REAL-TIME TRADING",
    period: "2026 — present",
    title: "Live trading console for a sports wagering exchange",
    role: "Full-Stack Engineer — #1 contributor to the trader console (400+ PRs)",
    stack: ["React 18", "TypeScript", "Go", "NATS", "gRPC", "WebSocket", "Redis", "GKE"],
    bullets: [
      "Live odds grids over WebSocket with row-level re-render isolation, throttled frame invalidation, and graceful WS-to-poll degradation.",
      "Go BFF real-time infrastructure: cross-pod WebSocket fan-out on Kubernetes with sequence-guarded event consistency.",
      "Maker-checker approval workflow with an idempotent command gate and field-level before/after audit diffs for high-risk operations.",
    ],
  },
  {
    tag: "INSURTECH",
    period: "2022 — 2026",
    title: "Health-insurance claims platform used daily by clinics across Hong Kong",
    role: "Senior Full-Stack Engineer — technical lead across HK / Taiwan / Vietnam teams",
    stack: ["TypeScript", "React", "NestJS", "PostgreSQL", "Redis", "AWS"],
    bullets: [
      "Led claim-processing platforms and NestJS microservices: eligibility verification, copayment calculation, OCR orchestration, insurer integrations.",
      "Improved system performance by 150% via query optimization, caching, and rendering work; automated OCR pipeline cut operational delays by 40%.",
      "Served as the cross-country bridge for a distributed engineering org — standards, review practices, reliable delivery.",
    ],
  },
  {
    tag: "WEB3 / CRYPTO",
    period: "2021 — present",
    title: "Crypto product work — from government-grade systems to gaming platforms",
    role: "Frontend / Full-Stack — employment & freelance",
    stack: ["Vue", "Nuxt", "TypeScript", "Solidity (basics)", "TON"],
    bullets: [
      "Frontend lead for government-grade crypto management systems and enterprise platforms.",
      "Freelance delivery for a crypto gaming platform; personal experiments with TON Connect, wallet flows, and on-chain tracking (see GitHub).",
    ],
  },
];

export default function WorkPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-5 pb-4 pt-16">
          <Eyebrow>For hiring teams</Eyebrow>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Seven years of systems where{" "}
            <span className="text-accent">correctness costs money</span>.
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            Insurance claims, live wagering markets, crypto products. Currently a
            full-stack engineer on a real-time sports wagering exchange (HK) —
            open to senior remote roles, APAC timezone or global async.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 font-mono text-sm">
            <a
              className="rounded-md border border-accent-dim bg-panel px-4 py-2 text-accent transition-colors hover:bg-panel-2"
              href={`mailto:${EMAIL}`}
            >
              Get in touch
            </a>
            <a
              className="rounded-md border border-line bg-panel px-4 py-2 text-muted transition-colors hover:text-foreground"
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="rounded-md border border-line bg-panel px-4 py-2 text-muted transition-colors hover:text-foreground"
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </section>

        {/* Case studies */}
        <section className="mx-auto w-full max-w-5xl px-5 py-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Case studies
          </h2>
          <div className="mt-5 space-y-5">
            {caseStudies.map((cs) => (
              <article
                key={cs.title}
                className="rounded-xl border border-line bg-panel p-6 sm:p-7"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-mono text-xs tracking-[0.18em] text-accent">
                    {cs.tag}
                  </p>
                  <p className="font-mono text-xs text-muted">{cs.period}</p>
                </div>
                <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
                  {cs.title}
                </h3>
                <p className="mt-1.5 text-sm italic text-muted">{cs.role}</p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-foreground/90">
                  {cs.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {cs.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 font-mono text-xs text-muted">
            Full write-ups with architecture diagrams — in progress. Live,
            de-identified demos landing here soon.
          </p>
        </section>

        {/* How I work */}
        <section className="mx-auto w-full max-w-5xl px-5 py-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            How I work remotely
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              {
                h: "Async-first",
                p: "Written specs, decision logs, and PRs that explain themselves. 4 years bridging HK / Taiwan / Vietnam teams.",
              },
              {
                h: "AI-augmented",
                p: "Daily agentic workflow (Claude Code): ~650 PRs shipped in 20 weeks on a production trading platform.",
              },
              {
                h: "Overlap-friendly",
                p: "Based in Taiwan (UTC+8). Comfortable overlapping APAC business hours and EU mornings / US evenings.",
              },
            ].map((x) => (
              <div key={x.h} className="rounded-xl border border-line bg-panel p-6">
                <h3 className="font-semibold">{x.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{x.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-5xl px-5 py-16 text-center">
          <p className="text-lg text-muted">
            Want the resume, references, or a conversation?
          </p>
          <a
            className="mt-4 inline-block rounded-md border border-accent-dim bg-panel px-6 py-3 font-mono text-accent transition-colors hover:bg-panel-2"
            href={`mailto:${EMAIL}`}
          >
            {EMAIL}
          </a>
          <p className="mt-3 font-mono text-xs text-muted">
            Replies within 24h · UTC+8
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
