import { initHeader } from './modules/header.js';
import { initTheme } from './modules/theme.js';
import { initReveal } from './modules/reveal.js';
import { initAccessibility } from './modules/accessibility.js';
import { initCart, initCartPage, bindAddToCartButtons, renderCheckoutSummary } from './modules/cart.js';
import {
  initFeaturedProducts,
  initShopProducts,
  initProductDetails,
  initRelatedProducts,
  initNewArrivalsProducts,
  initSaleProducts
} from './modules/products.js';
import { initFilters } from './modules/filters.js';

const initForms = () => {
  const forms = document.querySelectorAll('[data-contact-form], [data-checkout-form]');
  if (!forms.length) return;

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;

      form.querySelectorAll('input, textarea, select').forEach((field) => {
        if (field.hasAttribute('required')) {
          const value = field.value.trim();
          const valid = value.length > 0 && (!field.type.includes('email') || isEmail(value));
          field.setAttribute('aria-invalid', String(!valid));
          if (!valid) isValid = false;
        }
      });

      if (!isValid) {
        if (status) {
          status.textContent = 'Uzupełnij wymagane pola i popraw adres e-mail.';
        }
        return;
      }

      if (status) {
        status.textContent = 'Dziękujemy! Twoje zgłoszenie zostało przyjęte.';
      }
      form.reset();
    });
  });
};

const initApp = () => {
  initAccessibility();
  initHeader();
  initTheme();
  initReveal();
  initCart();
  initFeaturedProducts();
  initShopProducts();
  initNewArrivalsProducts();
  initProductDetails();
  initRelatedProducts();
  initSaleProducts();
  initFilters();
  initCartPage();
  renderCheckoutSummary();
  initForms();
  bindAddToCartButtons();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp, { once: true });
} else {
  initApp();
}
