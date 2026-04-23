import { test, expect } from '@playwright/test';

test('features page loads and stays on /features', async ({ page }) => {
  await page.goto('http://localhost:4321/features');

  await expect(page).toHaveURL(/\/features$/);
});

test('features page shows LearnLog branding', async ({ page }) => {
  await page.goto('http://localhost:4321/features');

  await expect(page.getByText(/learnlog/i).first()).toBeVisible();
});