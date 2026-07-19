/**
 * Synthetic market engine for the live-desk demo.
 * No real data, no real domain — a random-walk price feed with
 * sequence-stamped updates, mirroring the shape of a production
 * odds/price stream without any of its vocabulary.
 */

export type Quote = {
  id: number;
  sym: string;
  bid: number;
  ask: number;
  last: number;
  chg: number; // % vs session open
  seq: number; // per-instrument sequence number
  dir: 1 | -1 | 0; // direction of the last move
};

export type DeskStats = {
  targetTps: number;
  actualTps: number;
  rendersPerSec: number;
  fps: number;
  totalTicks: number;
};

const SYMBOLS = [
  "AAX", "BRN", "CMT", "DRV", "EQN", "FLX", "GRD", "HLM", "IVO", "JUN",
  "KRE", "LMD", "MNT", "NRW", "OPL", "PRX", "QNT", "RVA", "SLT", "TRM",
  "UMB", "VLT", "WRD", "XEN", "YRK", "ZPH", "ALD", "BSK", "CRW", "DLT",
];

type Listener = () => void;

class Market {
  quotes: Quote[] = [];
  private perRow: Map<number, Set<Listener>> = new Map();
  private global: Set<Listener> = new Set();
  private globalVersion = 0;
  private tickCount = 0;
  renderTally = 0; // incremented by row components; sampled by the stats loop

  constructor() {
    this.quotes = SYMBOLS.map((sym, id) => {
      const base = 20 + Math.random() * 480;
      const spread = base * 0.001;
      return {
        id,
        sym,
        bid: round2(base - spread),
        ask: round2(base + spread),
        last: round2(base),
        chg: 0,
        seq: 0,
        dir: 0 as const,
      };
    });
  }

  private opens = new Map<number, number>();

  tick() {
    const i = Math.floor(Math.random() * this.quotes.length);
    const q = this.quotes[i];
    if (!this.opens.has(q.id)) this.opens.set(q.id, q.last);
    const open = this.opens.get(q.id)!;
    const drift = q.last * (Math.random() - 0.5) * 0.004;
    const last = Math.max(0.01, round2(q.last + drift));
    const spread = Math.max(0.01, last * 0.001);
    const next: Quote = {
      ...q,
      last,
      bid: round2(last - spread),
      ask: round2(last + spread),
      chg: round2(((last - open) / open) * 100),
      seq: q.seq + 1,
      dir: drift > 0 ? 1 : drift < 0 ? -1 : 0,
    };
    // immutable row swap: only this row's snapshot identity changes
    this.quotes = this.quotes.slice();
    this.quotes[i] = next;
    this.globalVersion++;
    this.tickCount++;
    this.perRow.get(q.id)?.forEach((l) => l());
    this.global.forEach((l) => l());
  }

  // --- subscriptions ---
  subscribeRow = (id: number) => (listener: Listener) => {
    if (!this.perRow.has(id)) this.perRow.set(id, new Set());
    this.perRow.get(id)!.add(listener);
    return () => this.perRow.get(id)!.delete(listener);
  };
  getRow = (id: number) => () => this.quotes[id];

  subscribeGlobal = (listener: Listener) => {
    this.global.add(listener);
    return () => this.global.delete(listener);
  };
  getGlobalVersion = () => this.globalVersion;
  getQuotes = () => this.quotes;
  getTickCount = () => this.tickCount;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export const market = new Market();
