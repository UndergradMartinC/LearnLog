import { test, expect } from '@playwright/test';

test('signup page shows form fields', async ({ page }) => {
  await page.goto('http://localhost:4321/signup');

  await expect(
    page.getByRole('heading', { name: /start your log/i })
  ).toBeVisible();

  await expect(page.getByLabel('Full name')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();

  await expect(
    page.getByRole('button', { name: /create account/i })
  ).toBeVisible();

  await expect(page.getByText('Sign in')).toBeVisible();
});

test('signup form allows typing and submission attempt', async ({ page }) => {
  await page.goto('http://localhost:4321/signup');

  await page.getByLabel('Full name').fill('Test Student');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');

  await page.getByRole('button', { name: /create account/i }).click();

  await expect(page).toHaveURL(/signup|dashboard/);
});