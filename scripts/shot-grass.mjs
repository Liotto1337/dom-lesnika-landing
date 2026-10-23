// Usage: node scripts/shot-grass.mjs <url> <out.png> <time-label> — full-density grass with the cursor on it.
import { chromium } from '@playwright/test';

const [url, out, time] = process.argv.slice(2);
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url);
await page.waitForSelector('#top canvas');
await page.waitForTimeout(4000);
if (time) await page.getByRole('button', { name: time }).click({ timeout: 60000 });
await page.waitForTimeout(6000);
for (let i = 0; i < 6; i++) {
  await page.mouse.move(420 + i * 12, 790 - i * 4);
  await page.waitForTimeout(400);
}
await page.screenshot({ path: out, timeout: 120000 });
await browser.close();
