// Usage: node scripts/fps.mjs <url> [width] [height] — counts frames for 5 s after load.
import { chromium } from '@playwright/test';

const [url, w = '1440', h = '900'] = process.argv.slice(2);
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
await page.goto(url);
await page.waitForSelector('#top canvas');
await page.waitForTimeout(3000);
const fps = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      const tick = () => {
        frames++;
        if (performance.now() - start < 5000) requestAnimationFrame(tick);
        else resolve((frames / (performance.now() - start)) * 1000);
      };
      requestAnimationFrame(tick);
    }),
);
console.log(`${w}x${h}: ${fps.toFixed(1)} fps`);
await browser.close();
