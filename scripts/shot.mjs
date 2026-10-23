// Usage: node scripts/shot.mjs <url> <out.png> [width] [height] [time] [fullPage] [scrollY]
import { chromium } from '@playwright/test';

const [url, out, w = '1440', h = '900', time = '', full = '', scrollY = '0'] = process.argv.slice(2);
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url);
await page.waitForTimeout(2500);
if (time) {
  await page.getByRole('button', { name: time }).click();
  await page.waitForTimeout(2200);
}
if (+scrollY) {
  await page.evaluate((y) => window.scrollTo(0, y), +scrollY);
  await page.waitForTimeout(1500);
}
await page.screenshot({ path: out, fullPage: full === 'full' });
if (errors.length) console.log('ERRORS:', errors.join('\n'));
await browser.close();
