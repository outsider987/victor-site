// Recapture live works in clean, meaningful states (cookie banners dismissed, games running).
import { chromium } from 'playwright';
const out = process.argv[2] ?? new URL('./out', import.meta.url).pathname;
const browser = await chromium.launch();
async function ctx(mobile) {
  return browser.newContext(mobile
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'zh-TW' }
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'zh-TW' });
}
async function dismiss(page) {
  for (const t of ['我同意', '同意', '只用必要的', '拒絕']) {
    const b = page.getByRole('button', { name: t, exact: true });
    if (await b.count()) { await b.first().click().catch(() => {}); await page.waitForTimeout(600); return; }
  }
}
async function shot(name, url, mobile, steps) {
  const c = await ctx(mobile); const page = await c.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2500);
    await dismiss(page);
    if (steps) await steps(page);
    await page.screenshot({ path: `${out}/${name}.png` });
    console.log('ok', name, page.url());
  } catch (e) { console.log('ERR', name, e.message.split('\n')[0]); }
  await c.close();
}
for (const m of [false, true]) {
  const t = m ? 'm' : 'd';
  await shot(`3ccash-${t}`, 'https://3ccash.com/', m);
  await shot(`3ccash-quote-${t}`, 'https://3ccash.com/sell/quote', m);
  await shot(`temple-${t}`, 'https://courage-mazu.com/shop', m);
  await shot(`temple-fund-${t}`, 'https://courage-mazu.com/fund', m);
  await shot(`temple-cal-${t}`, 'https://courage-mazu.com/calendar', m);
  await shot(`sandstorm-${t}`, 'https://sandstorm-god.courage-mazu.workers.dev/', m, async (p) => {
    const b = p.getByText('開始遊戲'); if (await b.count()) { await b.first().click(); await p.waitForTimeout(4000); }
  });
  await shot(`sandstorm-spin-${t}`, 'https://sandstorm-god.courage-mazu.workers.dev/', m, async (p) => {
    const b = p.getByText('開始遊戲'); if (await b.count()) { await b.first().click(); await p.waitForTimeout(3500); }
    await p.keyboard.press('Space'); await p.waitForTimeout(1600);
  });
  await shot(`casino-${t}`, 'https://casino-ail.pages.dev/', m);
}
await browser.close();
