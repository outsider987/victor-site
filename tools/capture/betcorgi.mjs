// BetCorgi: capture a few individual game screens from the public mock build.
import { chromium } from 'playwright';
const out = process.argv[2] ?? new URL('./out', import.meta.url).pathname;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'zh-TW' });
for (const g of ['crashGame', 'plinkoGame', 'minesGame', 'blackjackGame']) {
  const p = await c.newPage();
  try {
    await p.goto(`https://casino-ail.pages.dev/casino/${g}`, { waitUntil: 'networkidle', timeout: 45000 });
    await p.waitForTimeout(5000);
    await p.screenshot({ path: `${out}/casino-${g}.png` });
    console.log('ok', g, p.url(), await p.title());
  } catch (e) { console.log('ERR', g, e.message.split('\n')[0]); }
  await p.close();
}
await browser.close();
