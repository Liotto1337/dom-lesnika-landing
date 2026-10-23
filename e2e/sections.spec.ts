import { expect, test, type Page } from '@playwright/test';
import { HOME, trackErrors } from './helpers';

async function scrollToBottom(page: Page) {
  // Step through the page so lazy images and scroll-triggered reveals all fire.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(800);
}

test('секции на месте', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(HOME);
  for (const name of ['О нас', /^Выбери свой/, 'Активный отдых', 'Контакты']) {
    await expect(page.getByRole('heading', { level: 2, name })).toHaveCount(1);
  }
  await expect(page.locator('#cabins').getByRole('article')).toHaveCount(4);
  await expect(page.locator('#activities').getByRole('article')).toHaveCount(6);
  await expect(page.getByRole('contentinfo')).toContainText('Дом лесника');
  expect(errors).toEqual([]);
});

test('меню ведёт к секциям', async ({ page }) => {
  await page.goto(HOME);
  const nav = page.getByRole('navigation', { name: 'Основное меню' });
  for (const [label, id] of [
    ['Контакты', 'contacts'],
    ['О нас', 'about'],
    ['Активный отдых', 'activities'],
    ['Домики', 'cabins'],
  ]) {
    // The header hides while scrolling down; scroll up a touch so it shows again.
    await page.mouse.wheel(0, -200);
    await nav.getByRole('link', { name: label }).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 4000 });
  }
});

test('кнопка карточки ведёт к контактам', async ({ page }) => {
  await page.goto(HOME);
  const card = page.locator('#cabins').getByRole('article').first();
  await card.scrollIntoViewIfNeeded();
  await card.getByRole('button', { name: /Забронировать/ }).click();
  await expect(page.locator('#contacts')).toBeInViewport({ timeout: 4000 });
});

test('все картинки загрузились', async ({ page }) => {
  await page.goto(HOME);
  await scrollToBottom(page);
  const broken = await page.evaluate(() =>
    [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
  );
  expect(broken).toEqual([]);
  expect(await page.locator('main img').count()).toBeGreaterThanOrEqual(13);
});

test('нет горизонтального скролла на телефоне', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto(HOME);
  await scrollToBottom(page);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
});
