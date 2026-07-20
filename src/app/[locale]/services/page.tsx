import type { Metadata } from "next";
import { Nav, Footer, Row, SectionTitle, Card, EMAIL } from "@/components/site";
import { altFor, isLocale, type Locale } from "@/i18n";
import { ProjectPicker, type PickerCopy } from "./picker";

const meta = {
  en: {
    title: "Services — Victor Chang",
    description:
      "Freelance delivery: websites, admin systems, e-commerce, real-time dashboards, integrations, MVPs. English / 中文.",
  },
  zh: {
    title: "服務 — Victor Chang",
    description:
      "接案交付：網站、後台管理系統、購物車、即時儀表板、API 串接、MVP。中英文皆可合作。",
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

type Offer = { tag: string; h: string; p: string };

const content: Record<
  Locale,
  {
    eyebrow: string;
    h1: string;
    lede: string;
    ledeZh: string;
    offersTitle: string;
    offers: Offer[];
    pickerTitle: string;
    pickerTypes: string[];
    picker: PickerCopy;
    trackTitle: string;
    track: { meta: string; text: string }[];
    howTitle: string;
    how1: string;
    how2: string;
    ctaLead: string;
    ctaTail: string;
  }
> = {
  en: {
    eyebrow: "For clients · 接案",
    h1: "Systems that touch money, built to be trusted.",
    lede: "Seven years on insurance claims, live wagering markets, and crypto products — software where bugs cost real money. That is the standard your project gets, whatever its size.",
    ledeZh: "中文合作無障礙——需求訪談、報價、交付文件皆可全中文進行。",
    offersTitle: "What you can order",
    offers: [
      {
        tag: "site",
        h: "Personal & brand websites",
        p: "Like this one: design, build, deploy — bilingual and SEO-ready.",
      },
      {
        tag: "backoffice",
        h: "Admin & management systems",
        p: "Dashboards, roles & permissions, audit trails. Trading-desk-grade backoffice is my day job.",
      },
      {
        tag: "commerce",
        h: "E-commerce & carts",
        p: "Catalog, cart, checkout, payment integration — with the order backoffice behind it.",
      },
      {
        tag: "mvp",
        h: "MVP sprints",
        p: "Fixed scope, fixed price — idea to shippable in weeks.",
      },
    ],
    pickerTitle: "How to start: pick what you need",
    pickerTypes: [
      "Personal / brand website",
      "Admin system",
      "E-commerce",
      "MVP",
      "Something else",
    ],
    picker: {
      hint: "Opens a pre-filled email — edit and send.",
      timelineLabel: "timeline",
      timelines: ["urgent (<1 month)", "1–3 months", "flexible"],
      button: "Compose inquiry",
      emailSubject: "Project inquiry",
      bodyIntro: "Hi Victor,",
      bodyNeed: "What I need: ",
      bodyTimeline: "Timeline: ",
      bodyDesc: "About the project:",
      bodyDescPlaceholder: "(a few sentences on what you're building)",
      bodyBudget: "Budget range (optional):",
      bodyName: "Name / company:",
    },
    trackTitle: "Track record",
    track: [
      {
        meta: "2026 —",
        text: "Real-time sports wagering exchange: live odds consoles, event-driven Go services.",
      },
      {
        meta: "freelance",
        text: "Delivery for a leading crypto gaming platform — frontend architecture and features.",
      },
      {
        meta: "2022 – 26",
        text: "Health-insurance claims platform used daily by 150+ clinics across Hong Kong.",
      },
      {
        meta: "earlier",
        text: "Custom CMS platforms that let non-technical teams run content independently.",
      },
    ],
    howTitle: "How it works",
    how1: "We start with a free 30–60 minute scope call, in English or 中文, and define what done looks like. You get a fixed-scope proposal in writing — deliverables, timeline, price.",
    how2: "Then a weekly demo cadence: working software every week, async written updates in between. At the end, handover — docs, tests, deploy pipeline — so your team can run it without me.",
    ctaLead: "Prefer to just write? Tell me what you're building —",
    ctaTail: " — EN / 中文, replies within 24h.",
  },
  zh: {
    eyebrow: "接案合作",
    h1: "經手金流的系統，做到值得信任。",
    lede: "七年都在做保險理賠、即時投注市場與加密產品——bug 直接等於賠錢的那種軟體。不論案子大小，你的專案拿到的就是這個標準。",
    ledeZh: "需求訪談、報價、週報與交付文件，全程可用中文進行；跨國團隊協作時亦可中英並行。",
    offersTitle: "可以委託的項目",
    offers: [
      {
        tag: "網站",
        h: "個人網站／形象官網",
        p: "就像這個網站：設計、開發、部署一手包，含雙語與 SEO。",
      },
      {
        tag: "後台",
        h: "後台管理系統",
        p: "儀表板、權限、審計軌跡——交易台等級的後台是我的日常。",
      },
      {
        tag: "電商",
        h: "購物車／電商",
        p: "商品、購物車、金流串接，後面配訂單管理後台。",
      },
      {
        tag: "mvp",
        h: "MVP 衝刺",
        p: "固定範圍、固定價格——數週內從想法到可上線。",
      },
    ],
    pickerTitle: "怎麼開始：點選你需要的",
    pickerTypes: [
      "個人網站／官網",
      "後台管理系統",
      "購物車／電商",
      "MVP",
      "其他",
    ],
    picker: {
      hint: "會打開一封寫好一半的信——改一改就能寄。",
      timelineLabel: "時程",
      timelines: ["急件（<1 個月）", "1–3 個月", "彈性"],
      button: "產生需求信",
      emailSubject: "專案洽詢",
      bodyIntro: "Victor 你好，",
      bodyNeed: "我需要：",
      bodyTimeline: "時程：",
      bodyDesc: "專案說明：",
      bodyDescPlaceholder: "（幾句話描述你想做什麼）",
      bodyBudget: "預算範圍（可不填）：",
      bodyName: "稱呼／公司：",
    },
    trackTitle: "實績",
    track: [
      {
        meta: "2026 —",
        text: "即時運動博彩交易所：即時賠率操作台、事件驅動 Go 服務。",
      },
      { meta: "接案", text: "為知名加密遊戲平台交付前端架構與功能。" },
      { meta: "2022 – 26", text: "香港 150+ 診所每日使用的健保理賠平台。" },
      { meta: "更早", text: "客製 CMS 平台，讓非技術團隊能獨立經營內容。" },
    ],
    howTitle: "合作方式",
    how1: "先來一場免費的 30–60 分鐘需求訪談（中英文皆可），一起定義「做完」長什麼樣。你會收到書面的固定範圍報價——交付物、時程、價格。",
    how2: "接著是每週 demo 的節奏：每週都有能動的軟體，中間以非同步文字回報進度。結案時完整交接——文件、測試、部署管線——你的團隊不需要我也能運轉它。",
    ctaLead: "想直接用寫的？跟我說你在打造什麼——",
    ctaTail: "——中英文皆可，24 小時內回覆。",
  },
};

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
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {t.offers.map((o) => (
              <Card key={o.tag}>
                <p className="font-mono text-xs text-ink-3">{o.tag}</p>
                <p className="mt-1.5 font-serif text-lg font-medium leading-snug">{o.h}</p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{o.p}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>{t.pickerTitle}</SectionTitle>
          <div className="mt-4">
            <ProjectPicker email={EMAIL} types={t.pickerTypes} copy={t.picker} />
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
