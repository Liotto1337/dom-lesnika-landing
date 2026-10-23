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

// Lives here because the fake clock would otherwise have to render hundreds of software-WebGL frames.
test('возврат во вкладку не оставляет лишний таймер, который обрывает следующий сеанс', async ({ page }) => {
  await page.clock.install();
  await page.goto(HOME);
  const start = page.getByRole('button', { name: 'Подышать лесом' });
  await start.click();
  // Coming back to the tab re-checks the timer.
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await page.clock.fastForward(5_000);
  await page.getByRole('button', { name: 'Вернуться' }).click();
  await page.clock.fastForward(5_000);
  await start.click({ force: true });
  await expect(page.getByRole('timer')).toBeVisible();
  // The first session would have ended now; the second has ~8 s left.
  await page.clock.fastForward(52_000);
  await page.clock.runFor(500);
  await expect(page.getByRole('timer')).toBeVisible();
  await expect(page.getByRole('timer')).toHaveText(/^0:0\d$/);
});
