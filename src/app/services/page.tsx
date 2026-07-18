import type { Metadata } from "next";
import { Nav, Footer, Row, SectionTitle, Card, EMAIL } from "@/components/site";

export const metadata: Metadata = {
  title: "Services — Victor Chang",
  description:
    "Freelance full-stack delivery: real-time dashboards, product platforms, and AI-accelerated development. English / 中文.",
};

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-16">
          <p className="font-mono text-[13px] text-ink-3">For clients · 接案</p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.6rem]">
            Systems that touch money, built to be trusted.
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-ink-2">
            Seven years on insurance claims, live wagering markets, and
            crypto products — software where bugs cost real money. That is
            the standard your project gets, whatever its size.
          </p>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink-2">
            中文合作無障礙——需求訪談、報價、交付文件皆可全中文進行。
          </p>
        </section>

        <section>
          <SectionTitle>What I take on</SectionTitle>
          <div className="mt-4 grid gap-5 lg:grid-cols-3">
            <Card>
              <p className="font-mono text-xs text-ink-3">platforms</p>
              <p className="mt-2 font-serif text-lg font-medium leading-snug">
                Full-stack product delivery
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                A feature, a module, or a whole platform — React/Next.js
                front, Node or Go behind, deployed and documented. For teams
                that need senior hands without a hiring cycle.
              </p>
            </Card>
            <Card>
              <p className="font-mono text-xs text-ink-3">real-time</p>
              <p className="mt-2 font-serif text-lg font-medium leading-snug">
                Real-time systems &amp; dashboards
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                WebSocket feeds, live consoles, event-driven backends —
                built to stay smooth under thousands of updates a minute.
                Trading, gaming, logistics, monitoring.
              </p>
            </Card>
            <Card>
              <p className="font-mono text-xs text-ink-3">velocity</p>
              <p className="mt-2 font-serif text-lg font-medium leading-snug">
                AI-accelerated delivery
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                I run a production-grade agentic workflow (Claude Code). You
                get senior-quality output at a pace one engineer is not
                supposed to have. Best for MVPs and deadline-bound builds.
              </p>
            </Card>
          </div>
        </section>

        <section>
          <SectionTitle>Track record</SectionTitle>
          <div className="border-b border-rule">
            <Row meta="2026 —">
              <p className="text-[15.5px] leading-relaxed">
                Real-time sports wagering exchange: live odds consoles,
                event-driven Go services.
              </p>
            </Row>
            <Row meta="freelance">
              <p className="text-[15.5px] leading-relaxed">
                Delivery for a leading crypto gaming platform — frontend
                architecture and features.
              </p>
            </Row>
            <Row meta="2022 – 26">
              <p className="text-[15.5px] leading-relaxed">
                Health-insurance claims platform used daily by clinics
                across Hong Kong.
              </p>
            </Row>
            <Row meta="earlier">
              <p className="text-[15.5px] leading-relaxed">
                Custom CMS platforms that let non-technical teams run
                content independently.
              </p>
            </Row>
          </div>
        </section>

        <section>
          <SectionTitle>How it works</SectionTitle>
          <div className="max-w-xl space-y-3 text-[15.5px] leading-relaxed text-ink-2">
            <p>
              We start with a free 30–60 minute scope call, in English or
              中文, and define what done looks like. You get a fixed-scope
              proposal in writing — deliverables, timeline, price.
            </p>
            <p>
              Then a weekly demo cadence: working software every week, async
              written updates in between. At the end, handover — docs,
              tests, deploy pipeline — so your team can run it without me.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <p className="leading-relaxed text-ink-2">
            Have a project in mind? Tell me what you&apos;re building —{" "}
            <a
              className="underline decoration-rule-mid underline-offset-4 hover:text-red-ink hover:decoration-red-ink"
              href={`mailto:${EMAIL}?subject=Project inquiry`}
            >
              {EMAIL}
            </a>
            <span className="tnum font-mono text-xs text-ink-3"> — EN / 中文, replies within 24h.</span>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
