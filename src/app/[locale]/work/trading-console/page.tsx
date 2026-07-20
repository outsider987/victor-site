import type { Metadata } from "next";
import Link from "next/link";
import { Nav, Footer, Row, SectionTitle, EMAIL } from "@/components/site";
import { TradingArchDiagram, ConsoleSketch } from "@/components/case-diagrams";
import { altFor, isLocale, type Locale } from "@/i18n";

const meta = {
  en: {
    title: "Case study: live trading console — Victor Chang",
    description:
      "Architecture and engineering decisions behind a real-time trading console for a sports wagering exchange: WebSocket fan-out, render isolation, maker-checker controls.",
  },
  zh: {
    title: "Case study：即時交易台 — Victor Chang",
    description:
      "運動博彩交易所即時交易台的架構與工程決策：WebSocket 廣播、重繪隔離、maker-checker 風控。",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = meta[isLocale(locale) ? locale : "en"];
  return { ...t, alternates: altFor("/work/trading-console") };
}

export default async function TradingConsolePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";

  const t =
    l === "en"
      ? {
          crumb: "case study",
          h1: "A trading console that keeps up with the market.",
          metaLine: (
            <>
              2026 — present · sports wagering exchange · full-stack engineer
              <br />
              React 18 · TypeScript · Go · NATS · gRPC · WebSocket · Redis · PostgreSQL · GKE
            </>
          ),
          intro1: (
            <>
              A wagering exchange runs on numbers that change by the second.
              Traders watch a grid of live odds across hundreds of markets and
              intervene — suspending a market, overriding a price — where every
              action moves real money. I was the #1 contributor to this console
              (400+ PRs) and a top contributor to the Go backend feeding it.
            </>
          ),
          intro2: (
            <>
              The problem in one line: <em>thousands of odds updates per
              minute, one browser tab, and an operations team that must never
              see stale data without knowing it&apos;s stale.</em>
            </>
          ),
          archTitle: "Architecture",
          archCaption:
            "Data plane, de-identified. Vendor feeds are normalized into one schema, published as sequence-stamped frames on NATS, fanned out across BFF pods so every WebSocket client gets every event, and rendered by the React console. Ops actions flow through a maker-checker gate.",
          problemsTitle: "The interesting problems",
          problems: [
            {
              meta: "render economics",
              text: "A naive React grid re-renders everything on every frame. I isolated re-renders to the single changed row: stable context values, memoized leaf cells, and throttled frame invalidation. The grid stays smooth while the market is moving — and there is a render-count overlay in dev builds to prove it stays that way.",
            },
            {
              meta: "consistency",
              text: "Kubernetes runs several BFF pods; a client connects to one, but events arrive on all of them. I built the cross-pod fan-out so every pod delivers every relevant event, with engine sequence numbers as high-water marks — an out-of-order frame can never overwrite fresher state, and a 60-second poll can never regress what the socket already knew.",
            },
            {
              meta: "human-in-the-loop",
              text: "High-risk operations (price overrides, market suspension) go through a maker-checker workflow: one person proposes, another approves, every write carries a reason and an idempotency key, and the audit trail shows field-level before/after diffs. Trust is a feature you build, not a policy you write.",
            },
          ],
          sketchTitle: "The console, abstracted",
          sketchCaption:
            "Stylized sketch — the real interface stays behind the NDA. Market list, live odds grid with row-isolated updates, and the maker-checker approval queue.",
          demoLink: "→ see the render-isolation technique running live: the trading desk demo",
          numbersTitle: "In numbers",
          numbers: [
            {
              meta: "ai practice",
              text: "Spec-first, Claude Code daily. The E2E harness: agents drive real environments via Playwright — replayable inputs, verifiable assertions, human-approved output. Operating and testing knowledge lives in reusable skills.",
            },
            {
              meta: "3 services",
              text: "touched daily: the React console, the legacy real-time BFF (+57k lines of Go), and the v2 BFF with the batched odds-override pipeline.",
            },
          ],
          note: "Company name, partners, and internal identifiers withheld. Happy to go deeper in a conversation —",
        }
      : {
          crumb: "case study",
          h1: "跟得上盤口的交易台。",
          metaLine: (
            <>
              2026 — 至今 · 運動博彩交易所 · 全端工程師
              <br />
              React 18 · TypeScript · Go · NATS · gRPC · WebSocket · Redis · PostgreSQL · GKE
            </>
          ),
          intro1: (
            <>
              博彩交易所靠著每秒都在變的數字運轉。操盤人員盯著數百個盤口的即時賠率格線，並隨時介入——停盤、覆寫價格——每個動作都牽動真金白銀。我是這個交易台的第一貢獻者（400+
              PRs），也是背後 Go 後端的主要貢獻者之一。
            </>
          ),
          intro2: (
            <>
              問題一句話講完：<em>每分鐘數千次賠率更新、一個瀏覽器分頁，以及一個「絕不能在不知情的情況下看到過期數據」的營運團隊。</em>
            </>
          ),
          archTitle: "架構",
          archCaption:
            "資料平面（去識別化）。供應商行情正規化為單一 schema，以帶序號的幀發布到 NATS，跨 BFF pod 廣播讓每個 WebSocket 客戶端都收到每個事件，最後由 React 交易台渲染。營運操作一律通過 maker-checker 閘門。",
          problemsTitle: "有意思的難題",
          problems: [
            {
              meta: "重繪經濟學",
              text: "天真的 React 格線每一幀都全表重繪。我把重繪隔離到「只有變動的那一列」：穩定的 context 值、memo 化的葉節點儲存格、節流的幀失效。行情狂動時格線依然順滑——而且 dev build 內建重繪計數面板，隨時可以驗證它沒有退化。",
            },
            {
              meta: "一致性",
              text: "Kubernetes 上跑著多個 BFF pod；客戶端只連其中一個，事件卻落在每一個上。我做了跨 pod 廣播，讓每個 pod 都送達每個相關事件，並以引擎序號作為高水位——亂序的幀永遠蓋不掉更新的狀態，60 秒輪詢也永遠不會把 socket 已知的資料倒退回去。",
            },
            {
              meta: "人在迴路",
              text: "高風險操作（價格覆寫、停盤）走 maker-checker 流程：一人提案、另一人核准，每筆寫入都帶原因與冪等鍵，審計軌跡顯示欄位級的 before/after 差異。信任是做出來的功能，不是寫出來的規定。",
            },
          ],
          sketchTitle: "交易台（抽象版）",
          sketchCaption:
            "風格化線稿——真實介面在 NDA 後面。左：盤口清單；中：行級更新的即時賠率格線；右：maker-checker 審批佇列。",
          demoLink: "→ 看重繪隔離技術活著跑：交易台 live demo",
          numbersTitle: "數字",
          numbers: [
            {
              meta: "AI 實踐",
              text: "規格先行，Claude Code 日常開發。E2E harness：agent 用 Playwright 驅動真實環境，輸入可重放、斷言可驗、輸出人核准。操作與測試知識寫成可重用 skill。",
            },
            {
              meta: "3 個服務",
              text: "每天經手：React 交易台、舊版即時 BFF（+5.7 萬行 Go），以及帶批次賠率覆寫管線的 v2 BFF。",
            },
          ],
          note: "公司名稱、合作方與內部識別資訊皆已隱去。想聊更深的細節——",
        };

  return (
    <div className="flex min-h-screen flex-col">
      <Nav locale={l} path="/work/trading-console" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-14">
          <p className="font-mono text-[13px] text-ink-3">
            <Link href={`/${l}/work`} className="hover:text-red-ink">work</Link> / {t.crumb}
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.4rem]">
            {t.h1}
          </h1>
          <p className="tnum mt-4 font-mono text-xs leading-6 text-ink-3">{t.metaLine}</p>
        </section>

        <section className="mt-10 max-w-xl space-y-4 leading-relaxed">
          <p>{t.intro1}</p>
          <p className="text-ink-2">{t.intro2}</p>
        </section>

        <section>
          <SectionTitle>{t.archTitle}</SectionTitle>
          <figure className="draw-on-scroll border-y border-rule py-6">
            <TradingArchDiagram />
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
              {t.archCaption}
            </figcaption>
          </figure>
        </section>

        <section>
          <SectionTitle>{t.problemsTitle}</SectionTitle>
          <div className="border-b border-rule">
            {t.problems.map((p) => (
              <Row key={p.meta} meta={p.meta}>
                <p className="text-[15.5px] leading-relaxed">{p.text}</p>
              </Row>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>{t.sketchTitle}</SectionTitle>
          <figure className="draw-on-scroll border-y border-rule py-6">
            <ConsoleSketch />
            <figcaption className="mt-3 font-mono text-xs leading-relaxed text-ink-3">
              {t.sketchCaption}
            </figcaption>
          </figure>
          <p className="mt-4 font-mono text-xs">
            <Link href={`/${l}/demos/live-desk`} className="text-red-ink hover:underline">
              {t.demoLink}
            </Link>
          </p>
        </section>

        <section>
          <SectionTitle>{t.numbersTitle}</SectionTitle>
          <div className="border-b border-rule">
            {t.numbers.map((n) => (
              <Row key={n.meta} meta={n.meta}>
                <p className="text-[15.5px] leading-relaxed">{n.text}</p>
              </Row>
            ))}
          </div>
          <p className="mt-4 font-mono text-xs leading-relaxed text-ink-3">
            {t.note}{" "}
            <a className="text-red-ink hover:underline" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        </section>
      </main>

      <Footer locale={l} />
    </div>
  );
}
