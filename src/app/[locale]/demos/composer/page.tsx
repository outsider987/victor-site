import type { Metadata } from "next";
import Link from "next/link";
import { Nav, Footer, SectionTitle, EMAIL } from "@/components/site";
import { altFor, isLocale, type Locale } from "@/i18n";
import { Composer } from "./composer";

const meta = {
  en: {
    title: "Demo: email composer — Victor Chang",
    description:
      "A keyboard-first email composer built on Tiptap/Prosemirror: slash commands, live input-latency meter. Built to learn the editor.",
  },
  zh: {
    title: "Demo：email 編輯器 — Victor Chang",
    description:
      "以 Tiptap/Prosemirror 打造的鍵盤優先 email 編輯器：slash 指令、即時輸入延遲儀表。為了學編輯器而做。",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = meta[isLocale(locale) ? locale : "en"];
  return { ...t, alternates: altFor("/demos/composer") };
}

export default async function ComposerPage({
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
          h1: "An email composer, keyboard-first.",
          lede: (
            <>
              Built on Tiptap/Prosemirror over a weekend — I was applying to
              work on an email client&apos;s editor, so I learned the editor
              first. Type <code className="font-mono text-[14px]">/</code> for
              block commands, ⌘B/⌘I for marks, and watch the latency meter
              while you type.
            </>
          ),
          composer: {
            to: "to",
            subject: "subject",
            placeholder: "Write something — try typing / on an empty line…",
            latencyLabel: "keystroke → paint:",
            latencyHint: "measured live on your machine",
            send: "send",
            sent: "sent ✓",
          },
          howTitle: "What this shows",
          how1: (
            <>
              A custom slash-command extension on Prosemirror&apos;s suggestion
              plugin — the menu is headless state pushed out of the editor,
              rendered by React, keyboard-navigable end to end. The latency
              strip measures keydown to the next paint after the editor
              commits, the number an editor team actually optimizes.
            </>
          ),
          how2: (
            <>
              Source:{" "}
              <code className="font-mono text-[13px]">src/app/[locale]/demos/composer</code>{" "}
              in this site&apos;s repo.
            </>
          ),
          note: "Nothing is sent anywhere — the envelope is a prop.",
        }
      : {
          crumb: "live demo",
          h1: "鍵盤優先的 email 編輯器。",
          lede: (
            <>
              用 Tiptap/Prosemirror 一個週末做出來的——因為要申請一家 email
              客戶端公司的編輯器職缺，就先把編輯器學了。在空行輸入{" "}
              <code className="font-mono text-[14px]">/</code> 叫出區塊指令、⌘B/⌘I
              做格式，打字時看上方的延遲儀表。
            </>
          ),
          composer: {
            to: "收件人",
            subject: "主旨",
            placeholder: "寫點什麼——在空行打 / 試試…",
            latencyLabel: "按鍵 → 繪製：",
            latencyHint: "在你的機器上即時量測",
            send: "寄出",
            sent: "已寄出 ✓",
          },
          howTitle: "這展示了什麼",
          how1: (
            <>
              在 Prosemirror suggestion plugin 上自寫的 slash 指令擴充——選單是從編輯器推出來的
              headless 狀態，由 React 渲染，全程可鍵盤操作。延遲儀表量的是 keydown
              到編輯器提交後下一次繪製——編輯器團隊真正在優化的那個數字。
            </>
          ),
          how2: (
            <>
              原始碼：本站 repo 的{" "}
              <code className="font-mono text-[13px]">src/app/[locale]/demos/composer</code>。
            </>
          ),
          note: "什麼都不會真的寄出——信封只是道具。",
        };

  return (
    <div className="flex min-h-screen flex-col">
      <Nav locale={l} path="/demos/composer" />

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
          <Composer copy={t.composer} />
          <p className="mt-3 font-mono text-xs text-ink-3">{t.note}</p>
        </section>

        <section>
          <SectionTitle>{t.howTitle}</SectionTitle>
          <div className="max-w-xl space-y-3 text-[15.5px] leading-relaxed text-ink-2">
            <p>{t.how1}</p>
            <p>{t.how2}</p>
          </div>
          <p className="mt-6 font-mono text-xs leading-relaxed text-ink-3">
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
