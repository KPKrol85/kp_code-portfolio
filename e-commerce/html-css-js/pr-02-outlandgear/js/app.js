import { CONFIG } from "./config.js";
import { qs, on } from "./modules/dom.js";
import { initNav } from "./modules/nav.js";
import { initPartials } from "./modules/partials.js";
import { initCatalog } from "./modules/catalog.js";
import { initProduct } from "./modules/product.js";
import { initCart, updateCartCount } from "./modules/cart.js";
import { initCheckout } from "./modules/checkout.js";
import { initContactForm } from "./modules/contact.js";
import { initLegalModal } from "./modules/legal-modal.js";

const initSearch = () => {
  const form = qs(CONFIG.selectors.searchForm);
  const input = qs(CONFIG.selectors.searchInput);
  if (!form || !input) return;

  on(form, "submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    const target = query ? `kategoria.html?q=${encodeURIComponent(query)}` : "kategoria.html";
    window.location.href = target;
  });
};

const initApp = () => {
  initNav();
  initSearch();
  updateCartCount();
  initCatalog();
  initProduct();
  initCart();
  initCheckout();
  initContactForm();
  initLegalModal();
};

const bootstrapApp = async () => {
  await initPartials();
  initApp();
};

document.addEventListener("DOMContentLoaded", () => {
  void bootstrapApp();
});
