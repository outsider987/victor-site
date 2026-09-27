import './styles.css';
import { stations, works, type Lang } from './content';
import { createScroll } from './scroll';

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// ---------------------------------------------------------------- language
let lang: Lang = root.dataset.lang === 'zh' ? 'zh' : 'en';
const langListeners: ((l: Lang) => void)[] = [];

function applyLang(next: Lang) {
  lang = next;
  root.dataset.lang = next;
  root.lang = next === 'zh' ? 'zh-Hant' : 'en';
  document.querySelectorAll<HTMLButtonElement>('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === next)));
  for (const name of ['alt', 'aria-label']) {
    document.querySelectorAll<HTMLElement>(`[data-${name}-en]`).forEach((el) => {
      const v = el.dataset[`${name === 'alt' ? 'alt' : 'ariaLabel'}${next === 'en' ? 'En' : 'Zh'}`];
      if (v) el.setAttribute(name, v);
    });
  }
  document.title = next === 'zh' ? 'Victor Chang · 資深全端工程師' : 'Victor Chang · Senior Full-Stack Engineer';
  try {
    localStorage.setItem('lang', next);
  } catch {
    /* private mode: the choice just lasts for this visit */
  }
  langListeners.forEach((fn) => fn(next));
}
document.querySelectorAll<HTMLButtonElement>('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang === 'zh' ? 'zh' : 'en')));
applyLang(lang);

// ---------------------------------------------------------------- scroll → stations
const scroll = createScroll({ count: stations.length });
const beads = [...document.querySelectorAll<HTMLAnchorElement>('.bead')];
const beadString = document.querySelector<HTMLElement>('.beads');
const phone = matchMedia('(max-width: 760px)');
let current = -1;
scroll.onChange(({ p, show }) => {
  // On a phone the string steps aside at the start, where it would sit on the hero's actions.
  beadString?.classList.toggle('is-away', phone.matches && p < 0.35);
  const near = Math.round(p);
  if (near !== current) {
    current = near;
    beads.forEach((b, i) => {
      b.classList.toggle('is-current', i === near);
      if (i === near) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
  }
  show.forEach((v, i) => scroll.tags[i]?.classList.toggle('is-live', v > 0.6));
});

// ---------------------------------------------------------------- lightbox
const lb = document.getElementById('lightbox') as HTMLDialogElement;
const lbImg = lb.querySelector<HTMLImageElement>('.lightbox__img')!;
const lbCap = lb.querySelector<HTMLElement>('.lightbox__cap')!;
const lbCount = lb.querySelector<HTMLElement>('.lightbox__count')!;
let lbWork = works[0];
let lbIndex = 0;
function lbShow(i: number) {
  const shots = lbWork.shots;
  lbIndex = (i + shots.length) % shots.length;
  const s = shots[lbIndex];
  lbImg.src = s.src;
  lbImg.alt = s.alt[lang];
  lbCap.textContent = s.alt[lang];
  lbCount.textContent = `${lbIndex + 1} / ${shots.length}`;
}
document.querySelectorAll<HTMLButtonElement>('[data-open-shots]').forEach((b) =>
  b.addEventListener('click', () => {
    lbWork = works.find((w) => w.id === b.dataset.openShots) ?? works[0];
    lbShow(0);
    lb.showModal();
  }),
);
lb.addEventListener('click', (e) => {
  const act = (e.target as HTMLElement).closest<HTMLElement>('[data-lb]')?.dataset.lb;
  if (act === 'prev') lbShow(lbIndex - 1);
  else if (act === 'next') lbShow(lbIndex + 1);
  else if (act === 'close' || e.target === lb) lb.close();
});
lb.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
  if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
});

// ---------------------------------------------------------------- the clay world
const loader = document.getElementById('loader')!;
const pct = document.getElementById('loader-pct')!;
// Fetch the 3D chunk now; build the world once the page has painted (creating a WebGL context
// can hold the main thread for most of a second). If the context can't be made, createWorld
// throws and the page stays flat.
const gl = 'WebGL2RenderingContext' in window ? import('./gl/world') : null;
gl?.catch(() => {});

async function boot() {
  if (!gl) {
    root.classList.add('no-gl');
    return;
  }
  // Behind the loader, draw every tag once at full strength (see .is-warm in the styles), then
  // give the browser two frames to paint them before the GPU gets busy with WebGL.
  root.classList.add('is-warm');
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  try {
    const { createWorld } = await gl;
    const world = await createWorld(document.getElementById('world') as HTMLCanvasElement, {
      lang,
      reducedMotion: reducedMotion.matches,
      onProgress: (v) => (pct.textContent = `${Math.round(v * 100)}%`),
    });
    langListeners.push((l) => world.setLang(l));
    reducedMotion.addEventListener('change', (e) => world.setReducedMotion(e.matches));
    scroll.onChange(({ p }) => world.setProgress(p));
    world.setProgress(scroll.p);
    reveal();
  } catch (err) {
    console.warn('3D scene unavailable, showing the flat version:', err);
    root.classList.add('no-gl');
    reveal();
  }
}

// The warm-up pose comes off one frame before the loader starts to fade, so it's never seen.
function reveal() {
  root.classList.remove('is-warm');
  requestAnimationFrame(() => requestAnimationFrame(() => loader.classList.add('is-done')));
}
// Start the world once the page has reached the screen. Creating a WebGL context can hold the
// GPU process for up to a second, and before first paint that would keep the page blank.
function afterFirstPaint(fn: () => void) {
  let started = false;
  const go = () => {
    if (!started) (started = true), setTimeout(fn, 0);
  };
  try {
    new PerformanceObserver((list, obs) => {
      if (list.getEntriesByName('first-contentful-paint').length) obs.disconnect(), go();
    }).observe({ type: 'paint', buffered: true });
  } catch {
    /* no paint timing: the timeout below starts it */
  }
  setTimeout(go, 1500);
}
afterFirstPaint(boot);
