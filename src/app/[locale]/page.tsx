import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Nav, Footer, Row, SectionTitle, Card, EMAIL } from "@/components/site";
import { altFor, isLocale, type Locale } from "@/i18n";

// avatar is optional: drop public/avatar.png and rebuild
const hasAvatar = fs.existsSync(path.join(process.cwd(), "public", "avatar.png"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;
  return { alternates: altFor("") };
}

const content = {
  en: {
    status: "Taipei · UTC+8 · open to remote roles & scoped freelance work",
    h1: (
      <>
        I build real-time, <em>real-money</em> systems.
      </>
    ),
    lede: (
      <>
        Senior full-stack engineer, seven years in. Insurance claims, live
        wagering markets, crypto products — software where a bug is a ledger
        entry, not a log line. React &amp; TypeScript on the front, Node and
        Go behind, distributed teams across APAC.
      </>
    ),
    record: "The record",
    ledger: [
      {
        meta: "2026 —",
        what: "Live trading console & Go real-time services for a sports wagering exchange",
        figure: "React · Go · NATS",
      },
      {
        meta: "2022 – 2026",
        what: "Health-insurance claims platform — 150+ clinics, 13 insurers, Hong Kong",
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
    ],
    start: "Start here",
    hiringTag: "hiring?",
    hiringText: "Case studies & how I work with distributed teams",
    hiringCta: "→ work",
    buildingTag: "building?",
    buildingText: "Scoped freelance delivery, English or 中文",
    buildingCta: "→ services",
    neither: "Neither? Say hello anyway —",
  },
  zh: {
    status: "台北 · UTC+8 · 開放遠端正職與固定範圍接案",
    h1: (
      <>
        我打造即時運作、<span className="text-red-ink">真金白銀</span>的系統。
      </>
    ),
    lede: (
      <>
        資深全端工程師，七年資歷。保險理賠、即時投注市場、加密產品——在這些軟體裡，一個
        bug 不是一行 log，而是一筆帳。前端 React 與 TypeScript，後端 Node 與
        Go，長期與亞太分散式團隊協作。
      </>
    ),
    record: "實績",
    ledger: [
      {
        meta: "2026 —",
        what: "運動博彩交易所的即時交易台與 Go 即時服務",
        figure: "React · Go · NATS",
      },
      {
        meta: "2022 – 2026",
        what: "健康保險理賠平台——香港 150+ 診所、13 家保險公司",
        figure: "+150% 效能 · −40% 作業延遲",
      },
      {
        meta: "2021 – 2022",
        what: "政府級加密資產管理系統，前端主導",
        figure: "Vue · Nuxt SSR",
      },
      {
        meta: "2018 – 2021",
        what: "工業影像辨識系統與桌面–網頁混合方案",
        figure: "C++ · OpenCV",
      },
    ],
    start: "從這裡開始",
    hiringTag: "找人？",
    hiringText: "Case study 與我的分散式團隊工作方式",
    hiringCta: "→ 作品",
    buildingTag: "要開發？",
    buildingText: "固定範圍的接案交付，中英文皆可",
    buildingCta: "→ 服務",
    neither: "都不是？打聲招呼也行——",
  },
} as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  const t = content[l];

  return (
    <div className="flex min-h-screen flex-col">
      <Nav locale={l} path="" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-16 sm:pt-24">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="max-w-2xl font-serif text-4xl font-medium leading-[1.12] tracking-tight sm:text-[3.4rem]">
                {t.h1}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">{t.lede}</p>
              <p className="tnum mt-6 font-mono text-[13px] text-ink-3">{t.status}</p>
            </div>
            {hasAvatar && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/avatar.png"
                alt="Victor Chang — pixel portrait"
                width={136}
                height={136}
                className="order-first shrink-0 border border-ink card-shadow [image-rendering:pixelated] sm:order-none sm:mt-2"
              />
            )}
          </div>
        </section>

        <section>
          <SectionTitle>{t.record}</SectionTitle>
          <div className="border-b border-rule">
            {t.ledger.map((r) => (
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
          <SectionTitle>{t.start}</SectionTitle>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Card href={`/${l}/work`}>
              <p className="font-mono text-xs text-ink-3">{t.hiringTag}</p>
              <p className="mt-2 font-serif text-xl font-medium leading-snug">
                {t.hiringText}
              </p>
              <p className="mt-3 font-mono text-xs text-red-ink">{t.hiringCta}</p>
            </Card>
            <Card href={`/${l}/services`}>
              <p className="font-mono text-xs text-ink-3">{t.buildingTag}</p>
              <p className="mt-2 font-serif text-xl font-medium leading-snug">
                {t.buildingText}
              </p>
              <p className="mt-3 font-mono text-xs text-red-ink">{t.buildingCta}</p>
            </Card>
          </div>
          <p className="mt-6 text-[15.5px] text-ink-2">
            {t.neither}{" "}
            <a
              className="underline decoration-rule-mid underline-offset-4 hover:decoration-red-ink hover:text-red-ink"
              href={`mailto:${EMAIL}`}
            >
              {EMAIL}
            </a>
          </p>
        </section>
      </main>

      <Footer locale={l} />
    </div>
  );
}
