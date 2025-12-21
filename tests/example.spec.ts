import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/SaberPro/);
});

test('get started link', async ({ page }) => {
    await page.goto('/');

    // Click the login link.
    await page.getByRole('link', { name: /Ingresar/i }).click();

    // Expects page to have a heading with the name of Login.
    await expect(page.getByRole('heading', { name: /Bienvenido/i })).toBeVisible();
});
