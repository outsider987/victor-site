import type { Metadata } from "next";
import { Nav, Footer, Row, SectionTitle, Card, EMAIL } from "@/components/site";
import { altFor, isLocale, type Locale } from "@/i18n";

const meta = {
  en: {
    title: "Services — Victor Chang",
    description:
      "Freelance full-stack delivery: real-time dashboards, product platforms, and AI-accelerated development. English / 中文.",
  },
  zh: {
    title: "服務 — Victor Chang",
    description:
      "接案全端交付：即時儀表板、產品平台、AI 加速開發。中英文皆可合作。",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = meta[isLocale(locale) ? locale : "en"];
  return { ...t, alternates: altFor("/services") };
}

const content = {
  en: {
    eyebrow: "For clients · 接案",
    h1: "Systems that touch money, built to be trusted.",
    lede: "Seven years on insurance claims, live wagering markets, and crypto products — software where bugs cost real money. That is the standard your project gets, whatever its size.",
    ledeZh: "中文合作無障礙——需求訪談、報價、交付文件皆可全中文進行。",
    offersTitle: "What I take on",
    offers: [
      {
        tag: "platforms",
        h: "Full-stack product delivery",
        p: "A feature, a module, or a whole platform — React/Next.js front, Node or Go behind, deployed and documented. For teams that need senior hands without a hiring cycle.",
      },
      {
        tag: "real-time",
        h: "Real-time systems & dashboards",
        p: "WebSocket feeds, live consoles, event-driven backends — built to stay smooth under thousands of updates a minute. Trading, gaming, logistics, monitoring.",
      },
      {
        tag: "velocity",
        h: "AI-accelerated delivery",
        p: "I run a production-grade agentic workflow (Claude Code) — with the agent harnesses and reusable skills that make it reliable. Senior-quality output, fast, without the AI debt. Best for MVPs and deadline-bound builds.",
      },
    ],
    trackTitle: "Track record",
    track: [
      { meta: "2026 —", text: "Real-time sports wagering exchange: live odds consoles, event-driven Go services." },
      { meta: "freelance", text: "Delivery for a leading crypto gaming platform — frontend architecture and features." },
      { meta: "2022 – 26", text: "Health-insurance claims platform used daily by 150+ clinics across Hong Kong." },
      { meta: "earlier", text: "Custom CMS platforms that let non-technical teams run content independently." },
    ],
    howTitle: "How it works",
    how1: "We start with a free 30–60 minute scope call, in English or 中文, and define what done looks like. You get a fixed-scope proposal in writing — deliverables, timeline, price.",
    how2: "Then a weekly demo cadence: working software every week, async written updates in between. At the end, handover — docs, tests, deploy pipeline — so your team can run it without me.",
    ctaLead: "Have a project in mind? Tell me what you're building —",
    ctaTail: " — EN / 中文, replies within 24h.",
  },
  zh: {
    eyebrow: "接案合作",
    h1: "經手金流的系統，做到值得信任。",
    lede: "七年都在做保險理賠、即時投注市場與加密產品——bug 直接等於賠錢的那種軟體。不論案子大小，你的專案拿到的就是這個標準。",
    ledeZh: "需求訪談、報價、週報與交付文件，全程可用中文進行；跨國團隊協作時亦可中英並行。",
    offersTitle: "接什麼",
    offers: [
      {
        tag: "平台開發",
        h: "全端產品交付",
        p: "一個功能、一個模組，或一整個平台——React/Next.js 前端、Node 或 Go 後端，部署完成、文件齊備。適合需要資深人手、又不想走招聘流程的團隊。",
      },
      {
        tag: "即時系統",
        h: "即時系統與儀表板",
        p: "WebSocket 行情、即時操作台、事件驅動後端——每分鐘數千次更新下依然順滑。交易、遊戲、物流、監控都適用。",
      },
      {
        tag: "交付速度",
        h: "AI 加速開發",
        p: "我以生產等級的 agentic 工作流（Claude Code）開發，並自建 agent harness 與可重用 skill 讓它可靠——資深品質的產出、更快的速度，而不是 AI 技術債。最適合 MVP 與趕檔期的案子。",
      },
    ],
    trackTitle: "實績",
    track: [
      { meta: "2026 —", text: "即時運動博彩交易所：即時賠率操作台、事件驅動 Go 服務。" },
      { meta: "接案", text: "為知名加密遊戲平台交付前端架構與功能。" },
      { meta: "2022 – 26", text: "香港 150+ 診所每日使用的健保理賠平台。" },
      { meta: "更早", text: "客製 CMS 平台，讓非技術團隊能獨立經營內容。" },
    ],
    howTitle: "合作方式",
    how1: "先來一場免費的 30–60 分鐘需求訪談（中英文皆可），一起定義「做完」長什麼樣。你會收到書面的固定範圍報價——交付物、時程、價格。",
    how2: "接著是每週 demo 的節奏：每週都有能動的軟體，中間以非同步文字回報進度。結案時完整交接——文件、測試、部署管線——你的團隊不需要我也能運轉它。",
    ctaLead: "有案子想做？跟我說你在打造什麼——",
    ctaTail: "——中英文皆可，24 小時內回覆。",
  },
} as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const t = content[l];

  return (
    <div className="flex min-h-screen flex-col">
      <Nav locale={l} path="/services" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-16">
          <p className="font-mono text-[13px] text-ink-3">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.6rem]">
            {t.h1}
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-ink-2">{t.lede}</p>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink-2">{t.ledeZh}</p>
        </section>

        <section>
          <SectionTitle>{t.offersTitle}</SectionTitle>
          <div className="mt-4 grid gap-5 lg:grid-cols-3">
            {t.offers.map((o) => (
              <Card key={o.tag}>
                <p className="font-mono text-xs text-ink-3">{o.tag}</p>
                <p className="mt-2 font-serif text-lg font-medium leading-snug">{o.h}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{o.p}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>{t.trackTitle}</SectionTitle>
          <div className="border-b border-rule">
            {t.track.map((r) => (
              <Row key={r.meta} meta={r.meta}>
                <p className="text-[15.5px] leading-relaxed">{r.text}</p>
              </Row>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>{t.howTitle}</SectionTitle>
          <div className="max-w-xl space-y-3 text-[15.5px] leading-relaxed text-ink-2">
            <p>{t.how1}</p>
            <p>{t.how2}</p>
          </div>
        </section>

        <section className="mt-14">
          <p className="leading-relaxed text-ink-2">
            {t.ctaLead}{" "}
            <a
              className="underline decoration-rule-mid underline-offset-4 hover:text-red-ink hover:decoration-red-ink"
              href={`mailto:${EMAIL}?subject=Project inquiry`}
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
