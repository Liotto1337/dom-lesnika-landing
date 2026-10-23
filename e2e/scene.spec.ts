import { expect, test } from '@playwright/test';
import { HOME, trackErrors } from './helpers';

test.describe('3D-сцена', () => {
  test('сцена рендерится без ошибок', async ({ page }) => {
    test.slow(); // software WebGL (SwiftShader) is slow even with a light grass field
    const errors = trackErrors(page);
    await page.goto(HOME);
    await expect(page.locator('#top canvas')).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(2000);
    expect(errors).toEqual([]);
    for (const [id, label] of [['day', 'День'], ['sunset', 'Закат'], ['night', 'Ночь']] as const) {
      await page.getByRole('button', { name: label }).click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `e2e/__screens__/hero-${id}.png` });
    }
    expect(errors).toEqual([]);
  });
});

type GrassDebug = { count: number; pointer: [number, number, number]; windScale: number };

test.describe('трава', () => {
  // Full-density grass on software WebGL: page setup and teardown alone can take tens of seconds.
  test.describe.configure({ timeout: 180_000 });

  test('60 000 травинок на десктопе и реакция на курсор', async ({ page }) => {
    await page.goto('/?debug');
    await page.waitForFunction(() => Boolean(window.__debug?.grass), null, { timeout: 15000 });
    const before = await page.evaluate(() => (window.__debug!.grass as GrassDebug).pointer.join());
    expect(await page.evaluate(() => (window.__debug!.grass as GrassDebug).count)).toBe(60000);
    expect(before).toBe('0,-999,0');
    // Left of the time switcher, on the grass in front of the hill.
    await page.mouse.move(300, 800);
    await page.mouse.move(340, 790, { steps: 5 });
    await expect
      .poll(() => page.evaluate(() => (window.__debug!.grass as GrassDebug).pointer.join()))
      .not.toBe(before);
  });

  test('при «уменьшить движение» ветер слабее', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?debug&blades=2000');
    await page.waitForFunction(() => Boolean(window.__debug?.grass), null, { timeout: 15000 });
    expect(await page.evaluate(() => (window.__debug!.grass as GrassDebug).windScale)).toBeLessThan(0.5);
  });

  test('20 000 травинок на телефоне', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?debug');
    await page.waitForFunction(() => Boolean(window.__debug?.grass), null, { timeout: 15000 });
    expect(await page.evaluate(() => (window.__debug!.grass as GrassDebug).count)).toBe(20000);
  });
});

declare global {
  interface Window {
    __debug?: Record<string, unknown>;
  }
}
