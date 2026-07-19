import type { Metadata } from "next";
import Link from "next/link";
import { Nav, Footer, Row, SectionTitle, Card, EMAIL, GITHUB, LINKEDIN } from "@/components/site";
import { HarnessDiagram } from "@/components/case-diagrams";
import { altFor, isLocale, type Locale } from "@/i18n";

const meta = {
  en: {
    title: "Work — Victor Chang",
    description:
      "Case studies: real-time trading console for a wagering exchange, insurance claims platform, and Web3 product work.",
  },
  zh: {
    title: "作品 — Victor Chang",
    description:
      "Case study：運動博彩交易所的即時交易台、香港健保理賠平台、Web3 產品開發。",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = meta[isLocale(locale) ? locale : "en"];
  return { ...t, alternates: altFor("/work") };
}

type CaseStudy = {
  meta: string;
  title: string;
  href?: string;
  demo?: string;
  role: string;
  stack: string;
  points: string[];
};

const content: Record<
  Locale,
  {
    eyebrow: string;
    h1: string;
    lede: string;
    contact: { email: string; resume: string };
    casesTitle: string;
    cases: CaseStudy[];
    caseLink: string;
    demoLink: string;
    ndaNote: string;
    howTitle: string;
    how: { meta: string; text: string }[];
    ctaLead: string;
    ctaTail: string;
    harnessCaption: string;
  }
> = {
  en: {
    eyebrow: "For hiring teams",
    h1: "Seven years of systems where correctness costs money.",
    lede: "Currently a full-stack engineer on a real-time sports wagering exchange. Before that, four years on a health-insurance claims platform used across Hong Kong. Open to senior remote roles — APAC timezone or global async.",
    contact: { email: "email", resume: "resume on request" },
    casesTitle: "Case studies",
    cases: [
      {
        meta: "trading · 2026 —",
        title: "Live trading console for a sports wagering exchange",
        href: "/work/trading-console",
        demo: "/demos/live-desk",
        role: "Full-stack engineer · #1 contributor to the trader console (400+ PRs)",
        stack: "React 18 · TypeScript · Go · NATS · gRPC · WebSocket · Redis · GKE",
        points: [
          "Live odds grids over WebSocket: row-level re-render isolation, throttled frame invalidation, graceful WS-to-poll degradation.",
          "Go BFF real-time infrastructure — cross-pod WebSocket fan-out on Kubernetes with sequence-guarded event consistency.",
          "Maker-checker approval workflow: idempotent command gate, field-level before/after audit diffs for high-risk operations.",
        ],
      },
      {
        meta: "insurtech · 2022 – 2026",
        title: "Claims platform used daily by 150+ clinics across Hong Kong",
        href: "/work/claims-platform",
        role: "Senior full-stack engineer · technical lead across HK / Taiwan / Vietnam",
        stack: "TypeScript · React · NestJS · PostgreSQL · Redis · AWS",
        points: [
          "Led the v1→v2 rewrite out of a coupled PHP codebase: React rebuild with SWR-style caching and one canonical API layer; introduced the team's CI/CD.",
          "NestJS microservices for eligibility, copayment, OCR orchestration, and 13 insurer-system integrations.",
          "System performance +150%; automated OCR pipeline cut manual workload and delays by 40%.",
        ],
      },
      {
        meta: "web3 · 2021 —",
        title: "Crypto product work, employment and freelance",
        role: "Frontend / full-stack",
        stack: "Vue · Nuxt · TypeScript · TON",
        points: [
          "Frontend lead for government-grade crypto management systems and enterprise platforms.",
          "Freelance delivery for a crypto gaming platform; ongoing experiments with TON Connect, wallet flows, and on-chain tracking.",
        ],
      },
    ],
    caseLink: "→ read the case study: architecture & decisions",
    demoLink: "→ try the live demo",
    ndaNote:
      "Real product UIs stay behind NDAs — the demos here are de-identified rebuilds of the same techniques, running live.",
    howTitle: "How I work remotely",
    how: [
      {
        meta: "async-first",
        text: "Written specs, decision logs, PRs that explain themselves. Four years bridging Hong Kong, Taiwan, and Vietnam teams.",
      },
      {
        meta: "ai, engineered",
        text: "Agents drive real test environments through Playwright — replayable inputs (synthetic traffic, event replay), verifiable assertions, human-approved output. Operating knowledge is written down as reusable skills.",
      },
      {
        meta: "overlap",
        text: "Taipei (UTC+8). Comfortable overlapping APAC business hours and EU mornings / US evenings.",
      },
    ],
    ctaLead: "Want the resume, references, or a conversation? Write to",
    ctaTail: " — replies within 24h, UTC+8.",
    harnessCaption:
      "The harness loop: skills load the agent · the agent drives a real test environment via Playwright · replayable inputs, verifiable assertions · agents draft, humans approve · verified knowledge written back as skills.",
  },
  zh: {
    eyebrow: "給正在找人的團隊",
    h1: "七年，都在做出錯就是賠錢的系統。",
    lede: "目前在一間即時運動博彩交易所擔任全端工程師；此前四年打造香港 150+ 診所每日使用的健保理賠平台。開放資深遠端職位——亞太時區或全球非同步皆可。",
    contact: { email: "寫信", resume: "履歷來信索取" },
    casesTitle: "Case studies",
    cases: [
      {
        meta: "交易系統 · 2026 —",
        title: "運動博彩交易所的即時交易台",
        href: "/work/trading-console",
        demo: "/demos/live-desk",
        role: "全端工程師 · 交易台前端第一貢獻者（400+ PRs）",
        stack: "React 18 · TypeScript · Go · NATS · gRPC · WebSocket · Redis · GKE",
        points: [
          "WebSocket 驅動的即時賠率格線：行級重繪隔離、幀失效節流、WS 降級時無感切換輪詢。",
          "Go BFF 即時基礎設施——Kubernetes 上的跨 pod WebSocket 廣播，以序號高水位保證事件一致性。",
          "Maker-checker 雙人複核流程：冪等指令閘門、欄位級 before/after 審計差異，管住高風險操作。",
        ],
      },
      {
        meta: "保險科技 · 2022 – 2026",
        title: "香港 150+ 診所每日使用的理賠平台",
        href: "/work/claims-platform",
        role: "資深全端工程師 · 港／台／越三地技術主導",
        stack: "TypeScript · React · NestJS · PostgreSQL · Redis · AWS",
        points: [
          "主導 v1→v2 重寫，走出前後端糾纏的 PHP 舊碼：React 重建、SWR 式快取與唯一 API 存取層；並導入團隊的 CI/CD。",
          "NestJS 微服務：資格驗證、共付額計算、OCR 調度，與 13 家保險公司系統整合。",
          "系統效能 +150%；自動化 OCR 管線讓人工作業與延遲下降 40%。",
        ],
      },
      {
        meta: "web3 · 2021 —",
        title: "加密產品開發（正職與接案）",
        role: "前端／全端",
        stack: "Vue · Nuxt · TypeScript · TON",
        points: [
          "政府級加密資產管理系統與企業平台的前端主導。",
          "為加密遊戲平台提供接案交付；持續進行 TON Connect、錢包流程與鏈上追蹤的實作。",
        ],
      },
    ],
    caseLink: "→ 閱讀完整 case study：架構與決策",
    demoLink: "→ 玩玩 live demo",
    ndaNote:
      "真實產品介面受 NDA 保護——這裡的 demo 是同一套技術去識別化後的重建，而且是活的。",
    howTitle: "我的遠端工作方式",
    how: [
      {
        meta: "非同步優先",
        text: "規格文件、決策紀錄、能自我說明的 PR。四年串接香港、台灣、越南三地團隊。",
      },
      {
        meta: "AI 工程化",
        text: "agent 用 Playwright 打真實測試環境——輸入可重放（合成流量、事件重播）、結果可斷言、輸出人核准。操作知識寫成可重用的 skill。",
      },
      {
        meta: "時區配合",
        text: "台北（UTC+8）。可配合亞太上班時間，以及歐洲早晨／美國傍晚的會議時段。",
      },
    ],
    ctaLead: "想要履歷、推薦人，或直接聊聊？寫信到",
    ctaTail: "——24 小時內回覆（UTC+8）。",
    harnessCaption:
      "harness 迴路：skill 載入 agent · agent 經 Playwright 驅動真實測試環境 · 輸入可重放、斷言可驗 · agent 起草、人核准 · 驗證過的知識回寫成 skill。",
  },
};

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const t = content[l];

  return (
    <div className="flex min-h-screen flex-col">
      <Nav locale={l} path="/work" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-16">
          <p className="font-mono text-[13px] text-ink-3">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.6rem]">
            {t.h1}
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-ink-2">{t.lede}</p>
          <p className="tnum mt-5 font-mono text-[13px] leading-6 text-ink-3">
            <a className="text-red-ink hover:underline" href={`mailto:${EMAIL}`}>
              {t.contact.email}
            </a>{" "}
            ·{" "}
            <a className="hover:text-red-ink" href={GITHUB} target="_blank" rel="noreferrer">
              github
            </a>{" "}
            ·{" "}
            <a className="hover:text-red-ink" href={LINKEDIN} target="_blank" rel="noreferrer">
              linkedin
            </a>{" "}
            · {t.contact.resume}
          </p>
        </section>

        <section>
          <SectionTitle>{t.casesTitle}</SectionTitle>
          <div className="mt-4 space-y-6">
            {t.cases.map((cs) => (
              <Card key={cs.title}>
                <div className="tnum font-mono text-xs leading-5 text-ink-3">{cs.meta}</div>
                <div className="mt-2">
                  <h3 className="font-serif text-[1.35rem] font-medium leading-snug">
                    {cs.href ? (
                      <Link href={`/${l}${cs.href}`} className="hover:text-red-ink">
                        {cs.title}
                      </Link>
                    ) : (
                      cs.title
                    )}
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
                  {cs.href && (
                    <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs">
                      <Link href={`/${l}${cs.href}`} className="text-red-ink hover:underline">
                        {t.caseLink}
                      </Link>
                      {cs.demo && (
                        <Link href={`/${l}${cs.demo}`} className="text-red-ink hover:underline">
                          {t.demoLink}
                        </Link>
                      )}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <p className="mt-4 font-mono text-xs leading-relaxed text-ink-3">{t.ndaNote}</p>
        </section>

        <section>
          <SectionTitle>{t.howTitle}</SectionTitle>
          <div className="border-b border-rule">
            {t.how.map((h) => (
              <Row key={h.meta} meta={h.meta}>
                <p className="text-[15.5px] leading-relaxed">{h.text}</p>
              </Row>
            ))}
          </div>
          <figure className="mt-6 border-y border-rule py-6">
            <HarnessDiagram />
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
              {t.harnessCaption}
            </figcaption>
          </figure>
        </section>

        <section className="mt-14">
          <p className="leading-relaxed text-ink-2">
            {t.ctaLead}{" "}
            <a
              className="underline decoration-rule-mid underline-offset-4 hover:text-red-ink hover:decoration-red-ink"
              href={`mailto:${EMAIL}`}
            >
              {EMAIL}
            </a>
            <span className="tnum font-mono text-xs text-ink-3">{t.ctaTail}</span>
          </p>
        </section>
      </main>

      <Footer locale={l} />
    </div>
  );
}
