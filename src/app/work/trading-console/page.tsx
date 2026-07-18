import type { Metadata } from "next";
import Link from "next/link";
import { Nav, Footer, Row, SectionTitle, EMAIL } from "@/components/site";

export const metadata: Metadata = {
  title: "Case study: live trading console — Victor Chang",
  description:
    "Architecture and engineering decisions behind a real-time trading console for a sports wagering exchange: WebSocket fan-out, render isolation, maker-checker controls.",
};

const INK = "#100f0f";
const INK2 = "#575653";
const INK3 = "#878580";
const WASH = "#f2f0e5";
const RULE = "#dad8ce";
const RED = "#af3029";

function ArchDiagram() {
  return (
    <svg
      viewBox="0 0 760 350"
      role="img"
      aria-label="Architecture: vendor odds feeds flow through a normalizer onto an event bus, fan out across Go BFF pods, and reach the React trader console over WebSocket with a poll fallback"
      className="w-full"
    >
      <defs>
        <marker id="ta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={INK2} strokeWidth="1.4" />
        </marker>
        <marker id="tr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={RED} strokeWidth="1.4" />
        </marker>
      </defs>

      {/* vendor feeds */}
      <rect x="28" y="38" width="128" height="46" fill={WASH} stroke={INK} />
      <rect x="20" y="30" width="128" height="46" fill="#fffcf0" stroke={INK} />
      <text x="84" y="50" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">vendor odds</text>
      <text x="84" y="64" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">feeds (n)</text>

      {/* normalizer */}
      <line x1="156" y1="53" x2="216" y2="53" stroke={INK2} strokeWidth="1.2" markerEnd="url(#ta)" />
      <rect x="220" y="30" width="140" height="46" fill="#fffcf0" stroke={INK} />
      <text x="290" y="50" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">feed normalizer</text>
      <text x="290" y="64" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">one standard schema</text>

      {/* event bus */}
      <line x1="290" y1="76" x2="290" y2="112" stroke={INK2} strokeWidth="1.2" markerEnd="url(#ta)" />
      <rect x="120" y="116" width="460" height="22" fill={WASH} stroke={INK} />
      <text x="350" y="131" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">event bus (NATS) — sequence-stamped odds frames</text>

      {/* BFF pods */}
      <line x1="290" y1="138" x2="290" y2="172" stroke={INK2} strokeWidth="1.2" markerEnd="url(#ta)" />
      <rect x="246" y="192" width="160" height="56" fill={WASH} stroke={INK} />
      <rect x="238" y="184" width="160" height="56" fill={WASH} stroke={INK} />
      <rect x="230" y="176" width="160" height="56" fill="#fffcf0" stroke={INK} />
      <text x="310" y="198" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">real-time BFF (Go)</text>
      <text x="310" y="213" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">pods ×3 on k8s</text>
      <text x="310" y="226" textAnchor="middle" fontSize="10" fill={RED} className="font-mono">cross-pod fan-out</text>

      {/* fan-out annotation */}
      <text x="96" y="196" fontSize="10" fill={INK3} className="font-mono">every pod delivers</text>
      <text x="96" y="209" fontSize="10" fill={INK3} className="font-mono">every event —</text>
      <text x="96" y="222" fontSize="10" fill={INK3} className="font-mono">seq high-water</text>
      <text x="96" y="235" fontSize="10" fill={INK3} className="font-mono">dedupe</text>

      {/* WS to console */}
      <line x1="406" y1="204" x2="536" y2="204" stroke={RED} strokeWidth="1.3" markerEnd="url(#tr)" />
      <text x="470" y="196" textAnchor="middle" fontSize="10" fill={RED} className="font-mono">WebSocket</text>

      <rect x="540" y="170" width="190" height="70" fill="#fffcf0" stroke={INK} strokeWidth="1.4" />
      <text x="635" y="196" textAnchor="middle" fontSize="12" fill={INK} className="font-mono">trader console</text>
      <text x="635" y="212" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">React 18 · live odds grid</text>
      <text x="635" y="226" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">row-level re-render</text>

      {/* poll fallback */}
      <path d="M 560 240 C 500 292, 400 292, 340 244" fill="none" stroke={INK3} strokeWidth="1.1" strokeDasharray="4 4" markerEnd="url(#ta)" />
      <text x="450" y="300" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">poll fallback when WS degrades — silent background refetch</text>

      {/* ops plane */}
      <rect x="620" y="30" width="110" height="46" fill="#fffcf0" stroke={INK} strokeDasharray="4 3" />
      <text x="675" y="50" textAnchor="middle" fontSize="10" fill={INK2} className="font-mono">ops actions</text>
      <text x="675" y="63" textAnchor="middle" fontSize="10" fill={INK2} className="font-mono">maker-checker</text>
      <line x1="675" y1="76" x2="647" y2="166" stroke={INK3} strokeWidth="1.1" strokeDasharray="4 3" markerEnd="url(#ta)" />
    </svg>
  );
}

function ConsoleSketch() {
  const gridRows = [104, 140, 176, 212, 248, 284];
  return (
    <svg
      viewBox="0 0 760 400"
      role="img"
      aria-label="Stylized sketch of the trader console: market list on the left, live odds grid in the center with one updating cell, approval queue on the right"
      className="w-full"
    >
      {/* window */}
      <rect x="20" y="16" width="720" height="360" fill="#fffcf0" stroke={INK} strokeWidth="1.4" />
      <line x1="20" y1="52" x2="740" y2="52" stroke={INK} strokeWidth="1" />
      <circle cx="42" cy="34" r="5" fill="none" stroke={INK2} />
      <circle cx="60" cy="34" r="5" fill="none" stroke={INK2} />
      <circle cx="78" cy="34" r="5" fill="none" stroke={INK2} />
      <rect x="600" y="27" width="120" height="14" fill={WASH} />

      {/* left market list */}
      <line x1="200" y1="52" x2="200" y2="376" stroke={RULE} />
      {[78, 108, 138, 198, 228, 258, 288, 318].map((y) => (
        <rect key={y} x="36" y={y} width={y % 60 === 18 ? 120 : 140} height="10" fill={WASH} />
      ))}
      {/* selected row */}
      <rect x="28" y="164" width="164" height="24" fill={WASH} />
      <rect x="28" y="164" width="3" height="24" fill={RED} />
      <rect x="40" y="171" width="110" height="10" fill={RULE} />

      {/* odds grid */}
      <line x1="580" y1="52" x2="580" y2="376" stroke={RULE} />
      {["", "", "", ""].map((_, i) => (
        <rect key={i} x={296 + i * 70} y={72} width="44" height="9" fill={WASH} />
      ))}
      <rect x="220" y="72" width="56" height="9" fill={WASH} />
      {gridRows.map((y) => (
        <g key={y}>
          <rect x="220" y={y + 6} width="56" height="9" fill={WASH} />
          {[0, 1, 2, 3].map((c) => (
            <rect
              key={c}
              x={296 + c * 70}
              y={y}
              width="52"
              height="22"
              fill="#fffcf0"
              stroke={RULE}
            />
          ))}
        </g>
      ))}
      {/* the one cell that just updated */}
      <rect x="366" y="176" width="52" height="22" fill={RED} fillOpacity="0.1" stroke={RED} strokeWidth="1.3" />
      <text x="392" y="191" textAnchor="middle" fontSize="10" fill={RED} className="font-mono">2.04</text>
      <text x="430" y="168" fontSize="9" fill={RED} className="font-mono">← only this row re-renders</text>

      {/* right approval queue */}
      <rect x="596" y="72" width="128" height="9" fill={WASH} />
      {[96, 156, 216].map((y) => (
        <g key={y}>
          <rect x="596" y={y} width="128" height="48" fill="#fffcf0" stroke={RULE} />
          <rect x="604" y={y + 8} width="80" height="8" fill={WASH} />
          <rect x="604" y={y + 22} width="56" height="8" fill={WASH} />
          <rect x="604" y={y + 34} width="26" height="9" fill="none" stroke={RED} />
          <rect x="636" y={y + 34} width="26" height="9" fill="none" stroke={INK3} />
        </g>
      ))}
      <text x="596" y="290" fontSize="9" fill={INK3} className="font-mono">maker-checker queue:</text>
      <text x="596" y="302" fontSize="9" fill={INK3} className="font-mono">approve / reject with</text>
      <text x="596" y="314" fontSize="9" fill={INK3} className="font-mono">field-level audit diff</text>
    </svg>
  );
}

export default function TradingConsolePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-14">
          <p className="font-mono text-[13px] text-ink-3">
            <Link href="/work" className="hover:text-red-ink">work</Link> / case study
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.4rem]">
            A trading console that keeps up with the market.
          </h1>
          <p className="tnum mt-4 font-mono text-xs leading-6 text-ink-3">
            2026 — present · sports wagering exchange · full-stack engineer
            <br />
            React 18 · TypeScript · Go · NATS · gRPC · WebSocket · Redis · PostgreSQL · GKE
          </p>
        </section>

        <section className="mt-10 max-w-xl space-y-4 leading-relaxed">
          <p>
            A wagering exchange runs on numbers that change by the second.
            Traders watch a grid of live odds across hundreds of markets and
            intervene — suspending a market, overriding a price — where every
            action moves real money. I was the #1 contributor to this console
            (400+ PRs) and a top contributor to the Go backend feeding it.
          </p>
          <p className="text-ink-2">
            The problem in one line: <em>thousands of odds updates per minute,
            one browser tab, and an operations team that must never see stale
            data without knowing it&apos;s stale.</em>
          </p>
        </section>

        <section>
          <SectionTitle>Architecture</SectionTitle>
          <figure className="border-y border-rule py-6">
            <ArchDiagram />
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
              Data plane, de-identified. Vendor feeds are normalized into one
              schema, published as sequence-stamped frames on NATS, fanned out
              across BFF pods so every WebSocket client gets every event, and
              rendered by the React console. Ops actions flow through a
              maker-checker gate.
            </figcaption>
          </figure>
        </section>

        <section>
          <SectionTitle>The interesting problems</SectionTitle>
          <div className="border-b border-rule">
            <Row meta="render economics">
              <p className="text-[15.5px] leading-relaxed">
                A naive React grid re-renders everything on every frame. I
                isolated re-renders to the single changed row: stable context
                values, memoized leaf cells, and throttled frame invalidation.
                The grid stays smooth while the market is moving — and there is
                a render-count overlay in dev builds to prove it stays that way.
              </p>
            </Row>
            <Row meta="consistency">
              <p className="text-[15.5px] leading-relaxed">
                Kubernetes runs several BFF pods; a client connects to one, but
                events arrive on all of them. I built the cross-pod fan-out so
                every pod delivers every relevant event, with engine sequence
                numbers as high-water marks — an out-of-order frame can never
                overwrite fresher state, and a 60-second poll can never regress
                what the socket already knew.
              </p>
            </Row>
            <Row meta="human-in-the-loop">
              <p className="text-[15.5px] leading-relaxed">
                High-risk operations (price overrides, market suspension) go
                through a maker-checker workflow: one person proposes, another
                approves, every write carries a reason and an idempotency key,
                and the audit trail shows field-level before/after diffs.
                Trust is a feature you build, not a policy you write.
              </p>
            </Row>
          </div>
        </section>

        <section>
          <SectionTitle>The console, abstracted</SectionTitle>
          <figure className="border-y border-rule py-6">
            <ConsoleSketch />
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
              Stylized sketch — the real interface stays behind the NDA.
              Market list, live odds grid with row-isolated updates, and the
              maker-checker approval queue.
            </figcaption>
          </figure>
          <p className="mt-4 font-mono text-xs">
            <Link href="/demos/live-desk" className="text-red-ink hover:underline">
              → see the render-isolation technique running live: the trading desk demo
            </Link>
          </p>
        </section>

        <section>
          <SectionTitle>In numbers</SectionTitle>
          <div className="border-b border-rule">
            <Row meta="~650 PRs">
              <p className="text-[15.5px] leading-relaxed">
                merged in the first 20 weeks — frontend console, legacy Go BFF,
                and its greenfield successor — in a team that institutionalized
                AI-assisted development (Claude Code, agent-driven E2E).
              </p>
            </Row>
            <Row meta="3 services">
              <p className="text-[15.5px] leading-relaxed">
                touched daily: the React console, the legacy real-time BFF
                (+57k lines of Go), and the v2 BFF with the batched
                odds-override pipeline.
              </p>
            </Row>
          </div>
          <p className="mt-4 font-mono text-xs leading-relaxed text-ink-3">
            Company name, partners, and internal identifiers withheld.
            Happy to go deeper in a conversation —{" "}
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
