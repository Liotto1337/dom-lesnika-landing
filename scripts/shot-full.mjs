// Usage: node scripts/shot-full.mjs <url> <out.png> [width] [height]
// Scrolls through the page so reveals and the gold line play, then takes a full-page shot.
import { chromium } from '@playwright/test';

const [url, out, w = '1440', h = '900'] = process.argv.slice(2);
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url);
await page.waitForTimeout(2500);
const height = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < height; y += 400) {
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(150);
}
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
await page.screenshot({ path: out, fullPage: true, timeout: 120000 });
if (errors.length) console.log('ERRORS:', errors.join('\n'));
await browser.close();
