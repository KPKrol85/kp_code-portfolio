// Entry point: bootstrap site modules.
import { initHeader } from './modules/header.js';
import { initTheme } from './modules/theme.js';
import { initReveal } from './modules/reveal.js';
import { initAccessibility } from './modules/accessibility.js';
import {
  initCart,
  initCartPage,
  initAddToCartButtons,
  initCheckoutSummary,
} from './modules/cart.js';
import {
  initFeaturedProducts,
  initShopProducts,
  initProductDetails,
  initRelatedProducts,
  initNewArrivalsProducts,
  initSaleProducts,
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

const initCopyrightYear = () => {
  const yearTargets = document.querySelectorAll('[data-current-year]');
  if (!yearTargets.length) return;
  const year = String(new Date().getFullYear());
  yearTargets.forEach((el) => {
    el.textContent = year;
  });
};

const initApp = () => {
  const has = (selector) => document.querySelector(selector);

  if (document.body) initAccessibility();
  if (has('[data-header]')) initHeader();
  if (has('[data-theme-toggle]')) initTheme();
  if (has('[data-reveal]')) initReveal();
  if (has('[data-cart-count]')) initCart();
  if (has('[data-products="featured"]')) initFeaturedProducts();
  if (has('[data-products="shop"]')) {
    initShopProducts();
    initFilters();
  }
  if (has('[data-products="new"]')) initNewArrivalsProducts();
  if (has('[data-products="related"]')) initRelatedProducts();
  if (has('[data-products="sale"]')) initSaleProducts();
  if (has('[data-product-details]')) initProductDetails();
  if (has('[data-cart-items]')) initCartPage();
  if (has('[data-checkout-summary]')) initCheckoutSummary();
  if (has('[data-contact-form], [data-checkout-form]')) initForms();
  // Przyczyna: przyciski są renderowane po async load produktów, więc selektor na starcie zwraca null.
  // Delegacja klików musi być podpięta zawsze, niezależnie od chwili renderu.
  initAddToCartButtons();
  if (has('[data-current-year]')) initCopyrightYear();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp, { once: true });
} else {
  initApp();
}
