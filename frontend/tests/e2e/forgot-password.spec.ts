import { test, expect } from '@playwright/test';

test('forgot password page shows form', async ({ page }) => {
  await page.goto('http://localhost:4321/forgot-password');

  await expect(
    page.getByRole('heading', { name: /reset your password/i })
  ).toBeVisible();

  await expect(page.getByLabel('Email')).toBeVisible();

  await expect(
    page.getByRole('button', { name: /send reset link/i })
  ).toBeVisible();

  await expect(
    page.getByRole('link', { name: /back to sign in/i }).first()
  ).toBeVisible();
});

test('forgot password shows error when request fails', async ({ page }) => {
  await page.goto('http://localhost:4321/forgot-password');

  await page.getByLabel('Email').fill('test@example.com');
  await page.getByRole('button', { name: /send reset link/i }).click();

  await expect(
    page.getByText(/failed to fetch|something went wrong/i)
  ).toBeVisible();

  await expect(page).toHaveURL(/forgot-password/);
});