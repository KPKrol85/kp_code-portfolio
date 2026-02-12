const { test, expect } = require('@playwright/test');

test.describe('Fleet lightbox smoke', () => {
  test('opens on click and closes with Escape', async ({ page }) => {
    await page.goto('/fleet.html');

    await page.getByRole('button', { name: /otwórz galerię/i }).first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Galeria pojazdu' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('opens with keyboard Enter on gallery trigger', async ({ page }) => {
    await page.goto('/fleet.html');

    const firstTrigger = page.getByRole('button', { name: /otwórz galerię/i }).first();
    await firstTrigger.focus();
    await page.keyboard.press('Enter');

    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
