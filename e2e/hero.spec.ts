import { expect, test } from '@playwright/test';
import { HOME } from './helpers';

test('кнопка «Забронировать» ведёт к контактам', async ({ page }) => {
  await page.goto(HOME);
  await page.locator('#top').getByRole('button', { name: 'Забронировать' }).click();
  await expect(page.locator('#contacts')).toBeInViewport({ timeout: 4000 });
});

test('переключатель времени суток', async ({ page }) => {
  await page.goto(HOME);
  const group = page.getByRole('group', { name: 'Время суток' });
  const day = group.getByRole('button', { name: 'День' });
  const sunset = group.getByRole('button', { name: 'Закат' });
  const night = group.getByRole('button', { name: 'Ночь' });
  await expect(day).toHaveAttribute('aria-pressed', 'true');
  await expect(sunset).toHaveAttribute('aria-pressed', 'false');
  await night.click();
  await expect(night).toHaveAttribute('aria-pressed', 'true');
  await expect(day).toHaveAttribute('aria-pressed', 'false');
});

test('режим «Подышать лесом»', async ({ page }) => {
  await page.goto(HOME);
  const title = page.locator('#top h1');
  await page.getByRole('button', { name: 'Подышать лесом' }).click();
  await expect(title).toBeHidden();
  await expect(page.locator('header')).toHaveCSS('opacity', '0');
  await expect(page.getByRole('timer')).toHaveText(/^(1:00|0:5\d)$/);
  await page.getByRole('button', { name: 'Вернуться' }).click();
  await expect(title).toBeVisible();
  await expect(title).toHaveCSS('opacity', '1');
  await expect(page.locator('body')).not.toHaveAttribute('data-break', 'on');
});

test('Esc выключает режим', async ({ page }) => {
  await page.goto(HOME);
  const title = page.locator('#top h1');
  await page.getByRole('button', { name: 'Подышать лесом' }).click();
  await expect(page.getByRole('timer')).toBeVisible();
  await expect(title).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(title).toHaveCSS('opacity', '1');
  await expect(page.getByRole('timer')).toBeHidden();
});
