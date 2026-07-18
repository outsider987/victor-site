import type { Metadata } from "next";
import Link from "next/link";
import { Nav, Footer, SectionTitle, EMAIL } from "@/components/site";
import Desk from "./desk";

export const metadata: Metadata = {
  title: "Demo: live trading desk — Victor Chang",
  description:
    "A live-updating price grid with row-level re-render isolation, and a naive mode to compare against. Synthetic feed, real technique.",
};

export default function LiveDeskPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-20">
        <section className="pt-14">
          <p className="font-mono text-[13px] text-ink-3">
            <Link href="/work" className="hover:text-red-ink">work</Link> / live demo
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.4rem]">
            Live trading desk, dissected.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-ink-2">
            A synthetic price feed pushing up to 500 updates a second into a
            React grid. The point is the <em>renders</em> column: in isolated
            mode, only the row that ticked re-renders — the technique behind
            the production trading console in{" "}
            <Link href="/work/trading-console" className="underline decoration-rule-mid underline-offset-4 hover:text-red-ink hover:decoration-red-ink">
              this case study
            </Link>
            . Flip to naive mode to feel what the grid would cost without it.
          </p>
        </section>

        <section className="mt-8">
          <Desk />
        </section>

        <section>
          <SectionTitle>How it works</SectionTitle>
          <div className="max-w-xl space-y-3 text-[15.5px] leading-relaxed text-ink-2">
            <p>
              A module-level market store emits sequence-stamped updates. In
              isolated mode each row subscribes to its own instrument via{" "}
              <code className="font-mono text-[13px]">useSyncExternalStore</code>{" "}
              — the table&apos;s parent renders once and is never touched
              again. In naive mode one subscription sits at the top and every
              tick re-renders all rows, which is how most grids are
              accidentally built.
            </p>
            <p>
              Synthetic data, deliberately generic domain — the engineering is
              the exhibit. Source lives in this site&apos;s repo:{" "}
              <code className="font-mono text-[13px]">src/app/demos/live-desk</code>.
            </p>
          </div>
          <p className="mt-6 font-mono text-xs leading-relaxed text-ink-3">
            Questions about the production version —{" "}
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
