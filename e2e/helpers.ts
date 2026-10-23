import type { Page } from '@playwright/test';

/** Collects console errors and uncaught page errors for later assertion. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

/** Home page with a light grass field: software WebGL in CI cannot render 60k blades quickly. */
export const HOME = '/?blades=2000';
