const { test, expect, devices } = require('@playwright/test');

test.use({ ...devices['iPhone 12'] });

test('mobile navigation opens and navigates to services page', async ({ page }) => {
  await page.goto('/index.html');

  const menuToggle = page.getByRole('button', { name: 'Otwórz menu' });
  await menuToggle.click();

  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');

  const servicesLink = page.getByRole('link', { name: 'Usługi' });
  await expect(servicesLink).toBeVisible();
  await servicesLink.click();

  await expect(page).toHaveURL(/\/services\.html$/);
});
