import { expect, test } from '@playwright/test';
import { HOME, trackErrors } from './helpers';

test('браузер только с WebGL1 получает фолбэк, а не падение страницы', async ({ page }) => {
  // three.js r186 needs WebGL2; emulate an old browser that only has WebGL1.
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      if (type === 'webgl2') return null;
      return (original as (...a: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof original;
  });
  const errors = trackErrors(page);
  await page.goto(HOME);
  await expect(page.getByTestId('scene-fallback')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#top h1')).toBeVisible();
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});
