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

  await expect(
    page.getByText('For students who take learning seriously')
  ).toBeVisible();

  await expect(
    page.getByRole('link', { name: 'Create your log' })
  ).toBeVisible();
});