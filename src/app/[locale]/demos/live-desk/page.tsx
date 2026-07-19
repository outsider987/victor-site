import type { Metadata } from "next";
import Link from "next/link";
import { Nav, Footer, SectionTitle, EMAIL } from "@/components/site";
import { altFor, isLocale, type Locale } from "@/i18n";
import Desk from "./desk";

const meta = {
  en: {
    title: "Demo: live trading desk — Victor Chang",
    description:
      "A live-updating price grid with row-level re-render isolation, and a naive mode to compare against. Synthetic feed, real technique.",
  },
  zh: {
    title: "Demo：即時交易台 — Victor Chang",
    description:
      "行級重繪隔離的即時價格格線，附 naive 模式對照。合成行情，真實技術。",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = meta[isLocale(locale) ? locale : "en"];
  return { ...t, alternates: altFor("/demos/live-desk") };
}

export default async function LiveDeskPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";

  const t =
    l === "en"
      ? {
          crumb: "live demo",
          h1: "Live trading desk, dissected.",
          lede: (
            <>
              A synthetic price feed pushing up to 500 updates a second into a
              React grid. The point is the <em>renders</em> column: in isolated
              mode, only the row that ticked re-renders — the technique behind
              the production trading console in{" "}
              <Link
                href={`/${l}/work/trading-console`}
                className="underline decoration-rule-mid underline-offset-4 hover:text-red-ink hover:decoration-red-ink"
              >
                this case study
              </Link>
              . Flip to naive mode to feel what the grid would cost without it.
            </>
          ),
          deskCopy:
            "watch row renders/s: in isolated mode it tracks ticks/s (one render per update); in naive mode every update re-renders all 30 rows — same feed, ~30× the render work. crank updates/s and compare fps.",
          howTitle: "How it works",
          how1: (
            <>
              A module-level market store emits sequence-stamped updates. In
              isolated mode each row subscribes to its own instrument via{" "}
              <code className="font-mono text-[13px]">useSyncExternalStore</code>{" "}
              — the table&apos;s parent renders once and is never touched
              again. In naive mode one subscription sits at the top and every
              tick re-renders all rows, which is how most grids are
              accidentally built.
            </>
          ),
          how2: (
            <>
              Synthetic data, deliberately generic domain — the engineering is
              the exhibit. Source lives in this site&apos;s repo:{" "}
              <code className="font-mono text-[13px]">src/app/[locale]/demos/live-desk</code>.
            </>
          ),
          note: "Questions about the production version —",
        }
      : {
          crumb: "live demo",
          h1: "即時交易台，拆給你看。",
          lede: (
            <>
              合成行情以每秒最高 500 次更新灌進 React 格線。重點在{" "}
              <em>renders</em> 那一欄：isolated
              模式下，只有跳動的那一列會重繪——這正是{" "}
              <Link
                href={`/${l}/work/trading-console`}
                className="underline decoration-rule-mid underline-offset-4 hover:text-red-ink hover:decoration-red-ink"
              >
                這篇 case study
              </Link>{" "}
              裡正式交易台所用的技術。切到 naive
              模式，感受一下沒有它的格線要付出什麼代價。
            </>
          ),
          deskCopy:
            "盯著 row renders/s：isolated 模式下它貼著 ticks/s 走（一次更新一次重繪）；naive 模式下每次更新重繪全部 30 列——同一條行情流，約 30 倍的重繪工作量。把 updates/s 拉高，比較 fps。",
          howTitle: "原理",
          how1: (
            <>
              模組層級的行情 store 發出帶序號的更新。isolated
              模式下每一列透過{" "}
              <code className="font-mono text-[13px]">useSyncExternalStore</code>{" "}
              訂閱自己的商品——表格的父元件只渲染一次，之後再也不被觸碰。naive
              模式則是一個訂閱掛在頂端，每次 tick
              全表重繪——大多數格線都是這樣被「不小心」寫出來的。
            </>
          ),
          how2: (
            <>
              合成資料、刻意通用的領域——展示品是工程本身。原始碼就在本站 repo：{" "}
              <code className="font-mono text-[13px]">src/app/[locale]/demos/live-desk</code>。
            </>
          ),
          note: "想聊正式版的實作——",
        };

  return (
    <div className="flex min-h-screen flex-col">
      <Nav locale={l} path="/demos/live-desk" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-14">
          <p className="font-mono text-[13px] text-ink-3">
            <Link href={`/${l}/work`} className="hover:text-red-ink">work</Link> / {t.crumb}
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.4rem]">
            {t.h1}
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-2">{t.lede}</p>
        </section>

        <section className="mt-8">
          <Desk explainer={t.deskCopy} />
        </section>

        <section>
          <SectionTitle>{t.howTitle}</SectionTitle>
          <div className="max-w-xl space-y-3 text-[15.5px] leading-relaxed text-ink-2">
            <p>{t.how1}</p>
            <p>{t.how2}</p>
          </div>
          <p className="mt-6 font-mono text-xs leading-relaxed text-ink-3">
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
