import { test, expect } from '@playwright/test';

test('profile page currently stays on /profile when unauthenticated', async ({ page }) => {
  await page.goto('http://localhost:4321/profile');

  await expect(page).toHaveURL(/\/profile$/);
});

test('profile page currently shows fetch error without backend auth', async ({ page }) => {
  await page.goto('http://localhost:4321/profile');

  await expect(page.getByText(/typeerror: fetch failed/i)).toBeVisible();
});