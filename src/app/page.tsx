import { Nav, Footer, Row, SectionTitle, EMAIL } from "@/components/site";

const ledger = [
  {
    meta: "2026 —",
    what: "Live trading console & Go real-time services for a sports wagering exchange",
    figure: "650 PRs / 20 wks",
  },
  {
    meta: "2022 – 2026",
    what: "Health-insurance claims platform used daily by clinics across Hong Kong",
    figure: "+150% perf · −40% ops delay",
  },
  {
    meta: "2021 – 2022",
    what: "Government-grade crypto management systems, frontend lead",
    figure: "Vue · Nuxt SSR",
  },
  {
    meta: "2018 – 2021",
    what: "Industrial image-recognition systems and desktop–web hybrids",
    figure: "C++ · OpenCV",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-16 sm:pt-24">
          <h1 className="max-w-2xl font-serif text-4xl font-medium leading-[1.12] tracking-tight sm:text-[3.4rem]">
            I build real-time, <em>real-money</em> systems.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            Senior full-stack engineer, seven years in. Insurance claims,
            live wagering markets, crypto products — software where a bug is
            a ledger entry, not a log line. React &amp; TypeScript on the
            front, Node and Go behind, distributed teams across APAC.
          </p>
          <p className="tnum mt-6 font-mono text-[13px] text-ink-3">
            Taipei · UTC+8 · open to remote roles &amp; scoped freelance work
          </p>
        </section>

        <section>
          <SectionTitle>The record</SectionTitle>
          <div className="border-b border-rule">
            {ledger.map((r) => (
              <Row key={r.meta} meta={r.meta}>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-6">
                  <p className="leading-snug">{r.what}</p>
                  <p className="tnum shrink-0 font-mono text-xs leading-6 text-ink-3">
                    {r.figure}
                  </p>
                </div>
              </Row>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Start here</SectionTitle>
          <div className="border-b border-rule">
            <Row meta="hiring?" href="/work">
              <p className="leading-snug">
                Case studies &amp; how I work with distributed teams
                <span className="ml-2 font-mono text-xs text-red-ink">
                  → work
                </span>
              </p>
            </Row>
            <Row meta="building?" href="/services">
              <p className="leading-snug">
                Scoped freelance delivery, English or 中文
                <span className="ml-2 font-mono text-xs text-red-ink">
                  → services
                </span>
              </p>
            </Row>
            <Row meta="neither?" href={undefined}>
              <p className="leading-snug">
                Say hello anyway —{" "}
                <a
                  className="underline decoration-rule-mid underline-offset-4 hover:decoration-red-ink hover:text-red-ink"
                  href={`mailto:${EMAIL}`}
                >
                  {EMAIL}
                </a>
              </p>
            </Row>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
