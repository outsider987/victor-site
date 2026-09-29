// Maps page scroll to a continuous station progress p (0 … count-1).
// Each station first dwells (p holds on the integer, its tag is shown), then travels to the next.
type State = { p: number; show: number[] };

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function createScroll({ count }: { count: number }) {
  const sections = [...document.querySelectorAll<HTMLElement>('.station')].slice(0, count);
  const tags = sections.map((s) => s.querySelector<HTMLElement>('.tag')!);
  const cue = document.querySelector<HTMLElement>('.scroll-cue');
  const phone = matchMedia('(max-width: 760px)');
  const listeners: ((s: State) => void)[] = [];
  let anchors: { top: number; dwellEnd: number }[] = [];
  let vh = innerHeight;
  const state: State & { tags: HTMLElement[] } = { p: 0, show: tags.map(() => 1), tags };

  function measure() {
    vh = innerHeight;
    anchors = sections.map((s, i) => {
      const top = s.offsetTop;
      const last = i === sections.length - 1;
      if (last) return { top, dwellEnd: Infinity };
      if (phone.matches) {
        const tag = tags[i];
        return { top, dwellEnd: Math.max(top, top + tag.offsetTop + tag.offsetHeight - vh * 0.42) };
      }
      return { top, dwellEnd: top + s.offsetHeight * 0.36 };
    });
    update();
  }

  function progress(y: number) {
    if (!anchors.length || y <= anchors[0].top) return 0;
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const next = anchors[i + 1].top;
      if (y < next) {
        if (y <= a.dwellEnd) return i;
        return i + (y - a.dwellEnd) / Math.max(1, next - a.dwellEnd);
      }
    }
    return anchors.length - 1;
  }

  function update() {
    if (!anchors.length) return; // not measured yet
    const y = scrollY;
    state.p = progress(y);
    state.show = anchors.map((a, i) => {
      if (phone.matches) return 1;
      const fadeIn = i === 0 ? 1 : smooth(a.top - vh * 0.34, a.top - vh * 0.02, y);
      const fadeOut = Number.isFinite(a.dwellEnd) ? 1 - smooth(a.dwellEnd, a.dwellEnd + vh * 0.2, y) : 1;
      // Fully transparent cards can be culled by the compositor.
      return Math.min(fadeIn, fadeOut);
    });
    state.show.forEach((v, i) => tags[i].style.setProperty('--show', v.toFixed(3)));
    cue?.style.setProperty('--show', (1 - smooth(0.02, 0.25, state.p)).toFixed(3));
    listeners.forEach((fn) => fn(state));
  }

  // A keyboard user tabbing into a hidden tag should land on that station.
  tags.forEach((tag, i) =>
    tag.addEventListener('focusin', () => {
      if (state.show[i] < 0.6) scrollTo({ top: anchors[i].top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }),
  );

  let raf = 0;
  addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(() => ((raf = 0), update()));
  }, { passive: true });
  // Measuring reads layout, so it waits for the next frame, where the browser lays out anyway,
  // and any number of triggers (first paint, fonts arriving, resizes) cost one layout per frame.
  let measuring = 0;
  const remeasure = () => {
    if (!measuring) measuring = requestAnimationFrame(() => ((measuring = 0), measure()));
  };
  addEventListener('resize', remeasure);
  phone.addEventListener('change', remeasure);
  document.fonts?.addEventListener('loadingdone', remeasure);
  new ResizeObserver(remeasure).observe(document.body);
  remeasure();

  return {
    get p() {
      return state.p;
    },
    tags,
    onChange(fn: (s: State) => void) {
      listeners.push(fn);
      fn(state);
    },
  };
}
