import type { Metadata } from "next";
import Link from "next/link";
import { Nav, Footer, Row, SectionTitle, EMAIL } from "@/components/site";

export const metadata: Metadata = {
  title: "Case study: insurance claims platform — Victor Chang",
  description:
    "Architecture and engineering decisions behind a health-insurance claims platform used daily by clinics across Hong Kong: NestJS microservices, OCR automation, insurer integrations.",
};

const INK = "#100f0f";
const INK2 = "#575653";
const INK3 = "#878580";
const WASH = "#f2f0e5";
const RULE = "#dad8ce";
const RED = "#af3029";

function ArchDiagram() {
  const services = [
    { x: 20, label: "eligibility", sub: "verification" },
    { x: 200, label: "copayment", sub: "calculation" },
    { x: 380, label: "OCR", sub: "orchestration" },
    { x: 560, label: "insurer", sub: "adapters" },
  ];
  return (
    <svg
      viewBox="0 0 760 330"
      role="img"
      aria-label="Architecture: clinic portal calls a claims BFF, which orchestrates NestJS microservices for eligibility, copayment, OCR, and insurer integrations"
      className="w-full"
    >
      <defs>
        <marker id="ca" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={INK2} strokeWidth="1.4" />
        </marker>
        <marker id="cr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={RED} strokeWidth="1.4" />
        </marker>
      </defs>

      {/* clinic portal */}
      <rect x="20" y="26" width="150" height="50" fill="#fffcf0" stroke={INK} strokeWidth="1.4" />
      <text x="95" y="47" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">clinic portal</text>
      <text x="95" y="62" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">React · used daily</text>

      {/* insurer portal-ish */}
      <rect x="590" y="26" width="150" height="50" fill="#fffcf0" stroke={INK} strokeDasharray="4 3" />
      <text x="665" y="47" textAnchor="middle" fontSize="11" fill={INK2} className="font-mono">insurer systems</text>
      <text x="665" y="62" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">external APIs</text>

      {/* BFF */}
      <line x1="170" y1="51" x2="296" y2="51" stroke={INK2} strokeWidth="1.2" markerEnd="url(#ca)" />
      <rect x="300" y="26" width="170" height="50" fill={WASH} stroke={INK} />
      <text x="385" y="47" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">claims BFF / API</text>
      <text x="385" y="62" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">NestJS · REST</text>

      {/* fan to services */}
      {services.map((s) => (
        <g key={s.label}>
          <line
            x1="385"
            y1="76"
            x2={s.x + 90}
            y2="136"
            stroke={INK2}
            strokeWidth="1.1"
            markerEnd="url(#ca)"
          />
          <rect x={s.x} y="140" width="180" height="48" fill="#fffcf0" stroke={INK} />
          <text x={s.x + 90} y="160" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">{s.label}</text>
          <text x={s.x + 90} y="175" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">{s.sub}</text>
        </g>
      ))}
      <text x="20" y="122" fontSize="10" fill={INK3} className="font-mono">NestJS microservices</text>

      {/* docs into OCR */}
      <rect x="330" y="242" width="120" height="56" fill="#fffcf0" stroke={INK} />
      <line x1="342" y1="256" x2="426" y2="256" stroke={RULE} />
      <line x1="342" y1="268" x2="426" y2="268" stroke={RULE} />
      <line x1="342" y1="280" x2="406" y2="280" stroke={RULE} />
      <text x="390" y="316" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">paper claim documents</text>
      <line x1="435" y1="242" x2="462" y2="192" stroke={RED} strokeWidth="1.2" markerEnd="url(#cr)" />
      <text x="510" y="228" fontSize="10" fill={RED} className="font-mono">automated pipeline:</text>
      <text x="510" y="241" fontSize="10" fill={RED} className="font-mono">−40% manual workload</text>

      {/* insurer adapters to external */}
      <line x1="650" y1="140" x2="665" y2="80" stroke={INK2} strokeWidth="1.1" strokeDasharray="4 3" markerEnd="url(#ca)" />

      {/* datastore */}
      <rect x="20" y="242" width="240" height="26" fill={WASH} stroke={INK} />
      <text x="140" y="259" textAnchor="middle" fontSize="10" fill={INK} className="font-mono">PostgreSQL · Redis cache</text>
      <line x1="110" y1="188" x2="120" y2="238" stroke={INK3} strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#ca)" />
      <line x1="290" y1="188" x2="200" y2="238" stroke={INK3} strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#ca)" />
    </svg>
  );
}

function OcrSketch() {
  return (
    <svg
      viewBox="0 0 760 300"
      role="img"
      aria-label="Stylized sketch: a scanned claim document passes through OCR and becomes structured, validated form fields, with low-confidence fields flagged for human review"
      className="w-full"
    >
      <defs>
        <marker id="oa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={INK2} strokeWidth="1.4" />
        </marker>
      </defs>

      {/* document */}
      <rect x="48" y="28" width="200" height="244" fill="#fffcf0" stroke={INK} strokeWidth="1.4" />
      {[52, 70, 88, 106, 148, 166, 184, 222, 240].map((y, i) => (
        <line key={y} x1="64" y1={y} x2={i % 3 === 2 ? 180 : 232} y2={y} stroke={RULE} strokeWidth="6" />
      ))}
      {/* scan band */}
      <rect x="40" y="118" width="216" height="26" fill={RED} fillOpacity="0.08" stroke={RED} strokeDasharray="5 4" />
      <text x="148" y="135" textAnchor="middle" fontSize="10" fill={RED} className="font-mono">OCR pass</text>

      {/* arrow */}
      <line x1="260" y1="150" x2="420" y2="150" stroke={INK2} strokeWidth="1.3" markerEnd="url(#oa)" />
      <text x="340" y="130" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">extract · classify</text>
      <text x="340" y="172" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">· validate</text>

      {/* form */}
      <rect x="428" y="28" width="284" height="244" fill="#fffcf0" stroke={INK} strokeWidth="1.4" />
      {[
        { y: 56, ok: true },
        { y: 108, ok: true },
        { y: 160, ok: true },
        { y: 212, ok: false },
      ].map((f) => (
        <g key={f.y}>
          <rect x="446" y={f.y - 14} width="90" height="8" fill={WASH} />
          <rect x="446" y={f.y} width="200" height="24" fill="#fffcf0" stroke={f.ok ? RULE : RED} strokeWidth={f.ok ? 1 : 1.3} />
          <rect x="454" y={f.y + 8} width="120" height="8" fill={WASH} />
          {f.ok ? (
            <path d={`M 656 ${f.y + 6} l 5 7 l 10 -13`} fill="none" stroke={INK2} strokeWidth="1.6" />
          ) : (
            <text x="656" y={f.y + 17} fontSize="10" fill={RED} className="font-mono">review</text>
          )}
        </g>
      ))}
      <text x="428" y="292" fontSize="9" fill={INK3} className="font-mono">low-confidence fields route to humans — the rest never wait</text>
    </svg>
  );
}

export default function ClaimsPlatformPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-14">
          <p className="font-mono text-[13px] text-ink-3">
            <Link href="/work" className="hover:text-red-ink">work</Link> / case study
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.4rem]">
            Claims processing that clinics run their day on.
          </h1>
          <p className="tnum mt-4 font-mono text-xs leading-6 text-ink-3">
            2022 – 2026 · health-insurance claims platform, Hong Kong · senior
            full-stack engineer, technical lead
            <br />
            TypeScript · React · NestJS · PostgreSQL · Redis · AWS (EC2, ECS, S3) · Docker
          </p>
        </section>

        <section className="mt-10 max-w-xl space-y-4 leading-relaxed">
          <p>
            When a patient walks out of a clinic, someone has to verify their
            policy, calculate the copayment, file the claim, and get the
            insurer to pay — for years, largely by hand. This platform put
            that flow into software used daily by clinics and insurers across
            Hong Kong. I spent four years on it as senior engineer and
            technical lead, bridging teams in Hong Kong, Taiwan, and Vietnam.
          </p>
        </section>

        <section>
          <SectionTitle>Architecture</SectionTitle>
          <figure className="border-y border-rule py-6">
            <ArchDiagram />
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
              De-identified overview. A React clinic portal talks to a NestJS
              BFF, which orchestrates microservices for eligibility,
              copayment, OCR, and insurer API integrations over PostgreSQL
              and Redis.
            </figcaption>
          </figure>
        </section>

        <section>
          <SectionTitle>The interesting problems</SectionTitle>
          <div className="border-b border-rule">
            <Row meta="ocr pipeline">
              <p className="text-[15.5px] leading-relaxed">
                Claims arrive as paper — scanned forms, receipts, referral
                letters. I built the end-to-end OCR orchestration: extraction,
                classification, validation, and confidence-based routing, so
                only genuinely ambiguous fields reach a human. Manual workload
                and operational delays dropped by 40%.
              </p>
            </Row>
            <Row meta="performance">
              <p className="text-[15.5px] leading-relaxed">
                The platform grew faster than its queries. Query optimization,
                a Redis caching layer, and frontend rendering work improved
                overall system performance by 150% — measured on the flows
                clinics actually wait on.
              </p>
            </Row>
            <Row meta="integrations">
              <p className="text-[15.5px] leading-relaxed">
                Every insurer speaks a different dialect. The adapter services
                normalized eligibility checks and claim submission across
                insurer APIs, so a new integration was a bounded project, not
                a re-architecture.
              </p>
            </Row>
            <Row meta="distributed team">
              <p className="text-[15.5px] leading-relaxed">
                Engineering spanned Hong Kong, Taiwan, and Vietnam. As the
                cross-country bridge I drove the technical standards and
                review practices that let three offices ship one product —
                written specs over meetings, by necessity first and conviction
                later.
              </p>
            </Row>
          </div>
        </section>

        <section>
          <SectionTitle>The pipeline, abstracted</SectionTitle>
          <figure className="border-y border-rule py-6">
            <OcrSketch />
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
              Stylized sketch — real documents and UI stay confidential. Paper
              in, structured and validated claim data out; humans only where
              judgment is needed.
            </figcaption>
          </figure>
        </section>

        <section>
          <SectionTitle>In numbers</SectionTitle>
          <div className="border-b border-rule">
            <Row meta="daily use">
              <p className="text-[15.5px] leading-relaxed">
                by clinics and insurers across Hong Kong — the operational
                system of record for claim processing.
              </p>
            </Row>
            <Row meta="+150% / −40%">
              <p className="text-[15.5px] leading-relaxed">
                system performance improvement; reduction in manual workload
                and operational delays from the automated OCR pipeline.
              </p>
            </Row>
            <Row meta="4 years">
              <p className="text-[15.5px] leading-relaxed">
                of ownership across system design, delivery, and a
                three-country engineering organization.
              </p>
            </Row>
          </div>
          <p className="mt-4 font-mono text-xs leading-relaxed text-ink-3">
            A deeper write-up of the v2 clinic platform is in progress.
            Questions welcome —{" "}
            <a className="text-red-ink hover:underline" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
