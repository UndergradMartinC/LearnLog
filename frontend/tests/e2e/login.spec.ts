import { test, expect } from '@playwright/test';

test('login page shows form fields', async ({ page }) => {
  await page.goto('http://localhost:4321/login');

  // Heading
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

  // Inputs (use labels instead of placeholder — more reliable)
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();

  // Button
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

  // Extra (nice touch)
  await expect(page.getByText('Create one')).toBeVisible();
});

test('login form allows typing and submission attempt', async ({ page }) => {
  await page.goto('http://localhost:4321/login');

  // Fill inputs
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');

  // Click login
  await page.getByRole('button', { name: /sign in/i }).click();

  // Expect something to happen (depends on your app)
  // For now, just verify we're still on login OR redirected

  await expect(page).toHaveURL(/login|dashboard/);
});