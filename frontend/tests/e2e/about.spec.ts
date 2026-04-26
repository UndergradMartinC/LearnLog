import { test, expect } from '@playwright/test';

test('about page loads and stays on /about', async ({ page }) => {
  await page.goto('http://localhost:4321/about');

  await expect(page).toHaveURL(/\/about$/);
});

test('about page shows LearnLog branding', async ({ page }) => {
  await page.goto('http://localhost:4321/about');

  await expect(page.getByText(/learnlog/i).first()).toBeVisible();
});