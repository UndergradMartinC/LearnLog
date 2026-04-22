import { test, expect } from '@playwright/test';

test('new post page currently stays on /posts/new when unauthenticated', async ({ page }) => {
  await page.goto('http://localhost:4321/posts/new');

  await expect(page).toHaveURL(/\/posts\/new$/);
});

test('new post page currently shows fetch error without backend auth', async ({ page }) => {
  await page.goto('http://localhost:4321/posts/new');

  await expect(page.getByText(/typeerror: fetch failed/i)).toBeVisible();
});