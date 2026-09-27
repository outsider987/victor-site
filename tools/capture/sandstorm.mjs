// Sandstorm God: the start button lives in the game layer, so click by coordinates.
import { chromium } from 'playwright';
const out = process.argv[2] ?? new URL('./out', import.meta.url).pathname;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const [t, opts, pt] of [
  ['d', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, [720, 684]],
  ['m', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, [195, 563]],
]) {
  const c = await browser.newContext({ ...opts, locale: 'zh-TW' });
  const p = await c.newPage();
  await p.goto('https://sandstorm-god.courage-mazu.workers.dev/', { waitUntil: 'networkidle', timeout: 45000 });
  await p.waitForTimeout(3000);
  if (t === 'm') await p.touchscreen.tap(pt[0], pt[1]); else await p.mouse.click(pt[0], pt[1]);
  await p.waitForTimeout(4500);
  await p.screenshot({ path: `${out}/sandstorm-board-${t}.png` });
  await p.keyboard.press('Space');
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `${out}/sandstorm-spin-${t}.png` });
  await p.waitForTimeout(5000);
  await p.screenshot({ path: `${out}/sandstorm-after-${t}.png` });
  console.log('ok', t);
  await c.close();
}
await browser.close();
