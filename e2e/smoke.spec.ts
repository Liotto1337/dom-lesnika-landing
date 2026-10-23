import { expect, test } from '@playwright/test';
import { HOME, trackErrors } from './helpers';

const NAV = ['О нас', 'Домики', 'Активный отдых', 'Контакты'];

test('главная открывается без ошибок', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(HOME);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Дом лесника');
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test('меню шапки на десктопе', async ({ page }) => {
  await page.goto(HOME);
  const nav = page.getByRole('navigation', { name: 'Основное меню' });
  for (const label of NAV) {
    await expect(nav.getByRole('link', { name: label })).toBeVisible();
  }
});

test('бургер на телефоне', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto(HOME);
  const nav = page.getByRole('navigation', { name: 'Основное меню' });
  await expect(nav.getByRole('link', { name: 'О нас' })).toBeHidden();
  await page.getByRole('button', { name: 'Меню' }).click();
  for (const label of NAV) {
    await expect(nav.getByRole('link', { name: label })).toBeVisible();
  }
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
});
