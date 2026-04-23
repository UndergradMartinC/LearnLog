import { test, expect } from '@playwright/test';

test('edit post page loads route when unauthenticated', async ({ page }) => {
  // Using fake slug since backend is not connected
  await page.goto('http://localhost:4321/posts/test-post/edit');

  await expect(page).toHaveURL(/\/posts\/test-post\/edit$/);
});

test('edit post page shows fetch error without backend auth', async ({ page }) => {
  await page.goto('http://localhost:4321/posts/test-post/edit');

  await expect(page.getByText(/typeerror: fetch failed/i)).toBeVisible();
});