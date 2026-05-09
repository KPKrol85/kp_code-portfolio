const { test, expect } = require('@playwright/test');
const { grantSiteConsent } = require('./helpers/site-consent');

test.describe('Contact form smoke', () => {
  test('shows validation feedback for required fields on empty submit', async ({ page }) => {
    await grantSiteConsent(page);
    await page.goto('/contact.html');

    await page.getByRole('button', { name: 'Wyślij zapytanie' }).click();

    const invalidFields = page.locator('#contact-form [aria-invalid="true"]');
    await expect(invalidFields).toHaveCount(6);

    await expect(page.locator('#name-error')).not.toHaveText('');
    await expect(page.locator('#email-error')).not.toHaveText('');
    await expect(page.locator('#phone-error')).not.toHaveText('');
    await expect(page.locator('#serviceType-error')).not.toHaveText('');
    await expect(page.locator('#route-error')).not.toHaveText('');
    await expect(page.locator('#rodo-error')).not.toHaveText('');
  });

  test('submits valid contact form through Netlify Forms contract', async ({ page }) => {
    await grantSiteConsent(page);
    await page.goto('/contact.html');

    const form = page.locator('#contact-form');
    await expect(form).toHaveAttribute('method', /post/i);
    await expect(form).toHaveAttribute('data-netlify', 'true');
    await expect(form).toHaveAttribute('name', 'contact');
    await expect(form.locator('input[type="hidden"][name="form-name"]')).toHaveValue('contact');

    await page.getByLabel('Imię i nazwisko').fill('Jan Testowy');
    await page.getByLabel('Email').fill('jan.testowy@example.com');
    await page.getByLabel('Telefon').fill('+48123456789');
    await page.getByLabel('Typ usługi').selectOption('express');
    await page.getByLabel('Trasa (miejsce załadunku → dostawy)').fill('Kraków → Berlin');
    await page.getByLabel('Opis ładunku').fill('Palety z elektroniką.');
    await page.getByLabel('Zgadzam się na przetwarzanie danych w celu przygotowania oferty.').check();

    await expect(page.locator('#contact-form [aria-invalid="true"]')).toHaveCount(0);

    const submitRequest = page.waitForRequest((request) => request.method() === 'POST' && request.url().includes('/contact.html?success=1'));
    await page.getByRole('button', { name: 'Wyślij zapytanie' }).click();
    await submitRequest;

    await expect(page).not.toHaveURL(/#.+error/i);
  });
});
