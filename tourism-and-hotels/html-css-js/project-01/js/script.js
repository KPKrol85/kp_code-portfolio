// Entry: initializes all features on DOMContentLoaded
import { initNav } from "./features/nav.js";
import { initTheme } from "./features/theme.js";
import { initReveal } from "./features/reveal.js";
import { initLightbox } from "./features/lightbox.js";
import { initForm } from "./features/form.js";
import { initTabs } from "./features/tabs.js";
import { initCompactHeader } from "./features/compact-header.js";
import { initGalleryFilters } from "./features/gallery-filters.js";

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}

function setAriaCurrent() {
  const path = location.pathname.replace(/\/index\.html?$/, "/");
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = a.getAttribute("href");
    const same = href === location.pathname || (href === "/index.html" && (path === "/" || path.endsWith("/")));
    if (same) a.setAttribute("aria-current", "page");
  });
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/pwa/service-worker.js")
      .then((reg) => {
        console.log("[PWA] Service Worker zarejestrowany", reg.scope);
      })
      .catch((err) => {
        console.error("[PWA] Błąd rejestracji Service Workera", err);
      });
  }
}

function boot() {
  setYear();
  setAriaCurrent();
  initTheme();
  initNav();
  initCompactHeader();
  initReveal();
  initLightbox();
  initForm();
  initTabs();

  // ✅ Uruchamiamy filtr tylko na stronie galerii
  if (document.getElementById("gallery-filters")) {
    initGalleryFilters();
  }

  registerSW();
}

window.addEventListener("DOMContentLoaded", boot);
