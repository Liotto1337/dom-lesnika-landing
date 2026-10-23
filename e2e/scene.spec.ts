import { expect, test } from '@playwright/test';
import { trackErrors } from './helpers';

test.describe('3D-сцена', () => {
  test('сцена рендерится без ошибок', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/');
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
