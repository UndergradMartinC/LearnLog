import { test, expect } from '@playwright/test';

test('dashboard page currently stays on /dashboard when unauthenticated', async ({ page }) => {
  await page.goto('http://localhost:4321/dashboard');

  await expect(page).toHaveURL(/\/dashboard$/);
});

test('dashboard page currently shows fetch error without backend auth', async ({ page }) => {
  await page.goto('http://localhost:4321/dashboard');

  await expect(page.getByText(/typeerror: fetch failed/i)).toBeVisible();
});