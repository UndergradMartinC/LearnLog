import { test, expect } from '@playwright/test';

test('homepage shows key homepage content', async ({ page }) => {
  await page.goto('http://localhost:4321');

  await expect(page).toHaveTitle(/LearnLog/);
  await expect(page.getByText('LearnLog').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Features' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Document what you learn, every day.' })
  ).toBeVisible();
});

test('navbar links navigate to the right pages', async ({ page }) => {
  await page.goto('http://localhost:4321');

  await page.getByRole('link', { name: 'Features' }).click();
  await expect(page).toHaveURL('http://localhost:4321/features');

  await page.goto('http://localhost:4321');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL('http://localhost:4321/about');

  await page.goto('http://localhost:4321');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('http://localhost:4321/login');

  await page.goto('http://localhost:4321');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL('http://localhost:4321/signup');
});