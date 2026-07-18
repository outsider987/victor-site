import type { Metadata } from "next";
import { Nav, Footer, Row, SectionTitle, EMAIL, GITHUB, LINKEDIN } from "@/components/site";

export const metadata: Metadata = {
  title: "Work — Victor Chang",
  description:
    "Case studies: real-time trading console for a wagering exchange, insurance claims platform, and Web3 product work.",
};

const caseStudies = [
  {
    meta: "2026 —\ntrading",
    title: "Live trading console for a sports wagering exchange",
    role: "Full-stack engineer · #1 contributor to the trader console (400+ PRs)",
    stack: "React 18 · TypeScript · Go · NATS · gRPC · WebSocket · Redis · GKE",
    points: [
      "Live odds grids over WebSocket: row-level re-render isolation, throttled frame invalidation, graceful WS-to-poll degradation.",
      "Go BFF real-time infrastructure — cross-pod WebSocket fan-out on Kubernetes with sequence-guarded event consistency.",
      "Maker-checker approval workflow: idempotent command gate, field-level before/after audit diffs for high-risk operations.",
    ],
  },
  {
    meta: "2022 – 2026\ninsurtech",
    title: "Claims platform used daily by clinics across Hong Kong",
    role: "Senior full-stack engineer · technical lead across HK / Taiwan / Vietnam",
    stack: "TypeScript · React · NestJS · PostgreSQL · Redis · AWS",
    points: [
      "Led claim-processing platforms and NestJS microservices: eligibility verification, copayment calculation, OCR orchestration, insurer integrations.",
      "System performance improved 150% through query optimization, caching, and rendering work.",
      "End-to-end automated OCR pipeline cut manual workload and operational delays by 40%.",
    ],
  },
  {
    meta: "2021 —\nweb3",
    title: "Crypto product work, employment and freelance",
    role: "Frontend / full-stack",
    stack: "Vue · Nuxt · TypeScript · TON",
    points: [
      "Frontend lead for government-grade crypto management systems and enterprise platforms.",
      "Freelance delivery for a crypto gaming platform; ongoing experiments with TON Connect, wallet flows, and on-chain tracking.",
    ],
  },
];

export default function WorkPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-16">
          <p className="font-mono text-[13px] text-ink-3">For hiring teams</p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.6rem]">
            Seven years of systems where correctness costs money.
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-ink-2">
            Currently a full-stack engineer on a real-time sports wagering
            exchange in Hong Kong. Before that, four years on a
            health-insurance claims platform. Open to senior remote roles —
            APAC timezone or global async.
          </p>
          <p className="tnum mt-5 font-mono text-[13px] leading-6 text-ink-3">
            <a className="text-red-ink hover:underline" href={`mailto:${EMAIL}`}>
              email
            </a>{" "}
            ·{" "}
            <a className="hover:text-red-ink" href={GITHUB} target="_blank" rel="noreferrer">
              github
            </a>{" "}
            ·{" "}
            <a className="hover:text-red-ink" href={LINKEDIN} target="_blank" rel="noreferrer">
              linkedin
            </a>{" "}
            · resume on request
          </p>
        </section>

        <section>
          <SectionTitle>Case studies</SectionTitle>
          <div className="border-b border-rule">
            {caseStudies.map((cs) => (
              <div
                key={cs.title}
                className="grid gap-2 border-t border-rule py-6 sm:grid-cols-[9.5rem_1fr] sm:gap-6"
              >
                <div className="tnum whitespace-pre-line font-mono text-xs leading-5 text-ink-3">
                  {cs.meta}
                </div>
                <div>
                  <h3 className="font-serif text-[1.35rem] font-medium leading-snug">
                    {cs.title}
                  </h3>
                  <p className="mt-1 text-[15px] italic text-ink-2">{cs.role}</p>
                  <ul className="mt-3 space-y-2 text-[15.5px] leading-relaxed">
                    {cs.points.map((p) => (
                      <li key={p} className="flex gap-2.5">
                        <span className="select-none text-ink-3">—</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="tnum mt-3 font-mono text-xs text-ink-3">{cs.stack}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-xs leading-relaxed text-ink-3">
            Full write-ups with architecture diagrams are in progress;
            de-identified live demos will be linked here.
          </p>
        </section>

        <section>
          <SectionTitle>How I work remotely</SectionTitle>
          <div className="border-b border-rule">
            <Row meta="async-first">
              <p className="text-[15.5px] leading-relaxed">
                Written specs, decision logs, PRs that explain themselves.
                Four years bridging Hong Kong, Taiwan, and Vietnam teams.
              </p>
            </Row>
            <Row meta="ai-augmented">
              <p className="text-[15.5px] leading-relaxed">
                Daily agentic workflow with Claude Code — 650 PRs shipped in
                20 weeks on a production trading platform, with the test
                coverage to survive it.
              </p>
            </Row>
            <Row meta="overlap">
              <p className="text-[15.5px] leading-relaxed">
                Taipei (UTC+8). Comfortable overlapping APAC business hours
                and EU mornings / US evenings.
              </p>
            </Row>
          </div>
        </section>

        <section className="mt-14">
          <p className="leading-relaxed text-ink-2">
            Want the resume, references, or a conversation? Write to{" "}
            <a
              className="underline decoration-rule-mid underline-offset-4 hover:text-red-ink hover:decoration-red-ink"
              href={`mailto:${EMAIL}`}
            >
              {EMAIL}
            </a>
            <span className="tnum font-mono text-xs text-ink-3"> — replies within 24h, UTC+8.</span>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
