import { test, expect } from '@playwright/test';

test('post detail page currently stays on /posts/test-post when unauthenticated', async ({ page }) => {
  await page.goto('http://localhost:4321/posts/test-post');

  await expect(page).toHaveURL(/\/posts\/test-post$/);
});

test('post detail page currently shows fetch error without backend auth', async ({ page }) => {
  await page.goto('http://localhost:4321/posts/test-post');

  await expect(page.getByText(/typeerror: fetch failed/i)).toBeVisible();
});