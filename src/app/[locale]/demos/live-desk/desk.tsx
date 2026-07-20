"use client";

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useCallback,
} from "react";
import { market, type Quote } from "./market";

type Mode = "isolated" | "naive";

/* ---------- shared bits ---------- */

function PriceCell({ value, dir, seq }: { value: number; dir: 1 | -1 | 0; seq: number }) {
  return (
    <td className="tnum px-3 py-1.5 text-right font-mono text-[13px]">
      {/* key remount restarts the flash animation on every update */}
      <span key={seq} className={dir === 0 ? "" : "desk-flash"}>
        {value.toFixed(2)}
      </span>
    </td>
  );
}

function ChgCell({ chg }: { chg: number }) {
  const cls = chg > 0 ? "text-up" : chg < 0 ? "text-red-ink" : "text-ink-3";
  const glyph = chg > 0 ? "▲" : chg < 0 ? "▼" : "·";
  return (
    <td className={`tnum px-3 py-1.5 text-right font-mono text-[13px] ${cls}`}>
      {glyph} {Math.abs(chg).toFixed(2)}%
    </td>
  );
}

function RowCells({ q, renders }: { q: Quote; renders: number }) {
  return (
    <>
      <td className="px-3 py-1.5 font-mono text-[13px]">{q.sym}</td>
      <PriceCell value={q.bid} dir={q.dir} seq={q.seq} />
      <PriceCell value={q.ask} dir={q.dir} seq={q.seq} />
      <PriceCell value={q.last} dir={q.dir} seq={q.seq} />
      <ChgCell chg={q.chg} />
      <td className="tnum px-3 py-1.5 text-right font-mono text-xs text-ink-3">{q.seq}</td>
      <td className="tnum px-3 py-1.5 text-right font-mono text-xs text-ink-3">{renders}</td>
    </>
  );
}

/* ---------- isolated mode: each row subscribes to its own instrument ---------- */

const IsolatedRow = memo(function IsolatedRow({ id }: { id: number }) {
  const subscribe = useMemo(() => market.subscribeRow(id), [id]);
  const getSnapshot = useMemo(() => market.getRow(id), [id]);
  const q = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const renders = useRef(0);
  renders.current++;
  market.renderTally++;
  return (
    <tr className="border-t border-rule">
      <RowCells q={q} renders={renders.current} />
    </tr>
  );
});

function IsolatedTable() {
  // parent renders once; ticks never touch it
  return (
    <tbody>
      {market.getQuotes().map((q) => (
        <IsolatedRow key={q.id} id={q.id} />
      ))}
    </tbody>
  );
}

/* ---------- naive mode: one subscription at the top, everything re-renders ---------- */

function NaiveRow({ q }: { q: Quote }) {
  const renders = useRef(0);
  renders.current++;
  market.renderTally++;
  return (
    <tr className="border-t border-rule">
      <RowCells q={q} renders={renders.current} />
    </tr>
  );
}

function NaiveTable() {
  useSyncExternalStore(market.subscribeGlobal, market.getGlobalVersion, market.getGlobalVersion);
  return (
    <tbody>
      {market.getQuotes().map((q) => (
        <NaiveRow key={q.id} q={q} />
      ))}
    </tbody>
  );
}

/* ---------- stats ---------- */

function useDeskStats(running: boolean) {
  const [stats, setStats] = useState({ actualTps: 0, rendersPerSec: 0, fps: 0, totalTicks: 0 });
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let lastSample = performance.now();
    let lastTicks = market.getTickCount();
    const loop = (now: number) => {
      frames++;
      if (now - lastSample >= 1000) {
        const ticksNow = market.getTickCount();
        setStats({
          actualTps: ticksNow - lastTicks,
          rendersPerSec: market.renderTally,
          fps: frames,
          totalTicks: ticksNow,
        });
        market.renderTally = 0;
        frames = 0;
        lastTicks = ticksNow;
        lastSample = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return stats;
}

/* ---------- the desk ---------- */

export default function Desk({ explainer }: { explainer: string }) {
  const [mode, setMode] = useState<Mode>("isolated");
  const [tps, setTps] = useState(120);
  const [running, setRunning] = useState(true);
  const stats = useDeskStats(running);

  useEffect(() => {
    if (!running || tps <= 0) return;
    const interval = 1000 / tps;
    let cancelled = false;
    let carry = 0;
    let last = performance.now();
    let raf = 0;
    const pump = (now: number) => {
      if (cancelled) return;
      carry += now - last;
      last = now;
      while (carry >= interval) {
        market.tick();
        carry -= interval;
      }
      raf = requestAnimationFrame(pump);
    };
    raf = requestAnimationFrame(pump);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [tps, running]);

  const setModeCb = useCallback((m: Mode) => setMode(m), []);

  return (
    <div>
      {/* control strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border border-ink bg-wash px-4 py-3 font-mono text-xs">
        <label className="flex items-center gap-2">
          mode
          <span className="inline-flex border border-ink">
            {(["isolated", "naive"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setModeCb(m)}
                className={`px-2.5 py-1 ${
                  mode === m ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-rule"
                }`}
              >
                {m}
              </button>
            ))}
          </span>
        </label>
        <label className="flex items-center gap-2">
          updates/s
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={tps}
            onChange={(e) => setTps(Number(e.target.value))}
            className="w-32 accent-[#af3029]"
          />
          <span className="tnum w-8 text-right">{tps}</span>
        </label>
        <button
          onClick={() => setRunning((r) => !r)}
          className="border border-ink bg-paper px-2.5 py-1 hover:bg-rule"
        >
          {running ? "pause" : "resume"}
        </button>
      </div>

      {/* stats strip */}
      <div className="tnum mt-3 grid grid-cols-2 gap-px border border-ink bg-ink font-mono text-xs sm:grid-cols-4">
        {[
          ["ticks/s", stats.actualTps],
          ["row renders/s", stats.rendersPerSec],
          ["fps", stats.fps],
          ["total ticks", stats.totalTicks],
        ].map(([k, v]) => (
          <div key={k} className="bg-paper px-3 py-2">
            <div className="text-ink-3">{k}</div>
            <div className="mt-0.5 text-lg text-ink">{v}</div>
          </div>
        ))}
      </div>

      <p className="mt-3 font-mono text-xs leading-relaxed text-ink-3">{explainer}</p>

      {/* the grid */}
      <div className="mt-4 overflow-x-auto border border-ink bg-paper card-shadow">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="bg-wash font-mono text-[11px] uppercase tracking-wider text-ink-2">
              <th className="px-3 py-2 text-left font-medium">sym</th>
              <th className="px-3 py-2 text-right font-medium">bid</th>
              <th className="px-3 py-2 text-right font-medium">ask</th>
              <th className="px-3 py-2 text-right font-medium">last</th>
              <th className="px-3 py-2 text-right font-medium">chg</th>
              <th className="px-3 py-2 text-right font-medium">seq</th>
              <th className="px-3 py-2 text-right font-medium">renders</th>
            </tr>
          </thead>
          {mode === "isolated" ? <IsolatedTable /> : <NaiveTable />}
        </table>
      </div>
    </div>
  );
}
