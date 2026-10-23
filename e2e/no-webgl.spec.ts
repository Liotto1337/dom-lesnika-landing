import { expect, test } from '@playwright/test';
import { HOME, trackErrors } from './helpers';

test.use({ launchOptions: { args: ['--disable-webgl', '--disable-3d-apis', '--disable-gpu'] } });

test('без WebGL показывается фолбэк', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(HOME);
  await expect(page.getByTestId('scene-fallback')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#top canvas')).toHaveCount(0);
  await expect(page.locator('#top h1')).toBeVisible();
  expect(errors).toEqual([]);
});
