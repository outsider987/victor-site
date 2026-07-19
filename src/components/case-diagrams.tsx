/**
 * De-identified case-study diagrams. Labels stay in English in both
 * locales — they are engineering artifacts, like code.
 */

const INK = "#100f0f";
const INK2 = "#575653";
const INK3 = "#878580";
const WASH = "#f2f0e5";
const RULE = "#dad8ce";
const RED = "#af3029";

export function TradingArchDiagram() {
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

export function ConsoleSketch() {
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

export function ClaimsArchDiagram() {
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

      {/* insurer systems */}
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

export function DeliveryPipelineDiagram() {
  return (
    <svg
      viewBox="0 0 760 400"
      role="img"
      aria-label="Delivery pipeline: requirement to key-point analysis to grill-me design interrogation, then skill agents (frontend and backend) with a codebase sitemap take the work to a pull request, verified by an E2E harness and a human gate; recurring judgments accumulate as skills"
      className="w-full"
    >
      <defs>
        <marker id="pa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={INK2} strokeWidth="1.4" />
        </marker>
      </defs>

      {/* row 1: requirement -> analysis -> grill-me */}
      <rect x="20" y="24" width="120" height="44" fill="#fffcf0" stroke={INK} />
      <text x="80" y="50" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">requirement</text>

      <line x1="140" y1="46" x2="164" y2="46" stroke={INK2} strokeWidth="1.2" markerEnd="url(#pa)" />

      <rect x="170" y="24" width="150" height="44" fill="#fffcf0" stroke={INK} />
      <text x="245" y="43" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">key-point</text>
      <text x="245" y="58" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">analysis</text>

      <line x1="320" y1="46" x2="344" y2="46" stroke={INK2} strokeWidth="1.2" markerEnd="url(#pa)" />

      <rect x="350" y="24" width="170" height="44" fill="#fffcf0" stroke={RED} strokeWidth="1.4" />
      <text x="435" y="43" textAnchor="middle" fontSize="11" fill={RED} className="font-mono">grill-me</text>
      <text x="435" y="58" textAnchor="middle" fontSize="9.5" fill={INK3} className="font-mono">design interrogation</text>

      {/* elbow grill -> agents */}
      <path d="M 435 68 V 92 H 410 V 108" fill="none" stroke={INK2} strokeWidth="1.2" markerEnd="url(#pa)" />

      {/* row 2: skills -> agents -> PR */}
      <rect x="48" y="124" width="180" height="48" fill={WASH} stroke={INK} />
      <rect x="40" y="116" width="180" height="48" fill="#fffcf0" stroke={INK} />
      <text x="130" y="136" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">skills library</text>
      <text x="130" y="151" textAnchor="middle" fontSize="9.5" fill={INK3} className="font-mono">auto-invoked · verified</text>

      <line x1="228" y1="140" x2="294" y2="140" stroke={INK2} strokeWidth="1.2" markerEnd="url(#pa)" />
      <text x="261" y="132" textAnchor="middle" fontSize="9" fill={INK3} className="font-mono">loads</text>

      <rect x="300" y="116" width="220" height="48" fill="#fffcf0" stroke={INK} strokeWidth="1.4" />
      <text x="410" y="136" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">skill agents</text>
      <text x="410" y="151" textAnchor="middle" fontSize="9.5" fill={INK3} className="font-mono">frontend · backend</text>

      <line x1="520" y1="140" x2="544" y2="140" stroke={INK2} strokeWidth="1.2" markerEnd="url(#pa)" />

      <rect x="550" y="116" width="170" height="48" fill="#fffcf0" stroke={INK} />
      <text x="635" y="145" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">pull request</text>

      {/* codebase sitemap */}
      <rect x="300" y="196" width="220" height="26" fill={WASH} stroke={INK} strokeDasharray="4 3" />
      <text x="410" y="213" textAnchor="middle" fontSize="10" fill={INK2} className="font-mono">codebase sitemap</text>
      <line x1="410" y1="196" x2="410" y2="168" stroke={INK2} strokeWidth="1.1" strokeDasharray="4 3" markerEnd="url(#pa)" />
      <text x="530" y="213" fontSize="9.5" fill={INK3} className="font-mono">reuse before rebuild</text>

      {/* connector PR -> harness */}
      <path d="M 635 164 V 240 H 150 V 262" fill="none" stroke={INK2} strokeWidth="1.2" markerEnd="url(#pa)" />

      {/* row 3: harness -> gate -> merged */}
      <rect x="40" y="268" width="220" height="52" fill="#fffcf0" stroke={INK} />
      <text x="150" y="289" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">E2E harness</text>
      <text x="150" y="304" textAnchor="middle" fontSize="9.5" fill={INK3} className="font-mono">Playwright · replayable · asserts</text>

      <line x1="260" y1="294" x2="294" y2="294" stroke={INK2} strokeWidth="1.2" markerEnd="url(#pa)" />

      <rect x="300" y="268" width="150" height="52" fill={WASH} stroke={INK} strokeWidth="1.4" />
      <text x="375" y="289" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">human gate</text>
      <text x="375" y="304" textAnchor="middle" fontSize="9.5" fill={INK3} className="font-mono">approve · reject</text>

      <line x1="450" y1="294" x2="484" y2="294" stroke={INK2} strokeWidth="1.2" markerEnd="url(#pa)" />

      <rect x="490" y="268" width="130" height="52" fill="#fffcf0" stroke={INK} />
      <text x="555" y="299" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">merged</text>

      {/* feedback: judgments -> skills */}
      <path d="M 375 320 V 356 H 24 V 132 H 34" fill="none" stroke={INK3} strokeWidth="1.1" strokeDasharray="4 4" markerEnd="url(#pa)" />
      <text x="250" y="348" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">recurring judgments accumulate as skills</text>
    </svg>
  );
}

export function HarnessDiagram() {
  return (
    <svg
      viewBox="0 0 760 365"
      role="img"
      aria-label="The agent harness loop: skills load the agent, the agent drives a real test environment via Playwright with replayable inputs, results hit assertions, agents draft and humans approve, knowledge is written back as skills"
      className="w-full"
    >
      <defs>
        <marker id="ha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={INK2} strokeWidth="1.4" />
        </marker>
        <marker id="hr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={RED} strokeWidth="1.4" />
        </marker>
      </defs>

      {/* skills library (stacked cards) */}
      <rect x="28" y="38" width="140" height="50" fill={WASH} stroke={INK} />
      <rect x="20" y="30" width="140" height="50" fill="#fffcf0" stroke={INK} />
      <text x="90" y="51" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">skills library</text>
      <text x="90" y="66" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">operating knowledge</text>

      {/* skills -> agent */}
      <line x1="90" y1="88" x2="90" y2="146" stroke={INK2} strokeWidth="1.2" markerEnd="url(#ha)" />
      <text x="100" y="122" fontSize="10" fill={INK3} className="font-mono">loads</text>

      {/* agent */}
      <rect x="20" y="150" width="140" height="56" fill="#fffcf0" stroke={INK} strokeWidth="1.4" />
      <text x="90" y="173" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">agent</text>
      <text x="90" y="188" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">Claude Code</text>

      {/* agent -> env via Playwright */}
      <line x1="160" y1="178" x2="260" y2="178" stroke={RED} strokeWidth="1.3" markerEnd="url(#hr)" />
      <text x="210" y="170" textAnchor="middle" fontSize="10" fill={RED} className="font-mono">Playwright</text>

      {/* real test environment (mini browser) */}
      <rect x="264" y="136" width="180" height="84" fill="#fffcf0" stroke={INK} strokeWidth="1.4" />
      <line x1="264" y1="158" x2="444" y2="158" stroke={INK} />
      <circle cx="278" cy="147" r="3.5" fill="none" stroke={INK2} />
      <circle cx="290" cy="147" r="3.5" fill="none" stroke={INK2} />
      <circle cx="302" cy="147" r="3.5" fill="none" stroke={INK2} />
      <text x="354" y="182" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">real test</text>
      <text x="354" y="197" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">environment</text>

      {/* replayable inputs */}
      <rect x="264" y="252" width="180" height="42" fill="#fffcf0" stroke={INK} strokeDasharray="4 3" />
      <text x="354" y="269" textAnchor="middle" fontSize="10" fill={INK2} className="font-mono">synthetic traffic</text>
      <text x="354" y="283" textAnchor="middle" fontSize="10" fill={INK2} className="font-mono">event replay</text>
      <line x1="354" y1="252" x2="354" y2="224" stroke={INK2} strokeWidth="1.1" strokeDasharray="4 3" markerEnd="url(#ha)" />
      <text x="362" y="242" fontSize="10" fill={INK3} className="font-mono">replayable inputs</text>

      {/* env -> assertions */}
      <line x1="444" y1="178" x2="504" y2="178" stroke={INK2} strokeWidth="1.2" markerEnd="url(#ha)" />
      <rect x="508" y="150" width="100" height="56" fill="#fffcf0" stroke={INK} />
      <text x="558" y="173" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">assertions</text>
      <text x="558" y="189" textAnchor="middle" fontSize="11" fill={INK2} className="font-mono">✓ / ✗</text>

      {/* assertions -> human gate */}
      <line x1="608" y1="178" x2="648" y2="178" stroke={INK2} strokeWidth="1.2" markerEnd="url(#ha)" />
      <text x="628" y="168" textAnchor="middle" fontSize="9" fill={INK3} className="font-mono">drafts</text>
      <rect x="652" y="146" width="88" height="64" fill={WASH} stroke={INK} strokeWidth="1.4" />
      <text x="696" y="171" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">human</text>
      <text x="696" y="185" textAnchor="middle" fontSize="11" fill={INK} className="font-mono">gate</text>
      <text x="696" y="200" textAnchor="middle" fontSize="9" fill={INK3} className="font-mono">approve·reject</text>

      {/* feedback: knowledge written back as skills */}
      <path d="M 696 210 V 350 H 10 V 55 H 14" fill="none" stroke={INK3} strokeWidth="1.1" strokeDasharray="4 4" markerEnd="url(#ha)" />
      <text x="400" y="342" textAnchor="middle" fontSize="10" fill={INK3} className="font-mono">verified knowledge written back as skills</text>
    </svg>
  );
}

export function OcrSketch() {
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
