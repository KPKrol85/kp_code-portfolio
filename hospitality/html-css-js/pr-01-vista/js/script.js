document.documentElement.classList.replace('no-js', 'js');

import { initNav } from "./features/nav.js";
import { initTheme } from "./features/theme.js";
import { initReveal } from "./features/reveal.js";
import { initLightbox } from "./features/lightbox.js";
import { initForm } from "./features/form.js";
import { initTabs } from "./features/tabs.js";
import { initCompactHeader } from "./features/compact-header.js";
import { initGalleryFilters } from "./features/gallery-filters.js";
import { setAriaCurrent } from "./features/aria-current.js";
import { initJsonLd } from "./features/seo-jsonld.js";

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    const isDevMode = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    navigator.serviceWorker
      .register("pwa/service-worker.js")
      .then((reg) => {
        if (isDevMode) {
          console.log("[PWA] Service Worker zarejestrowany", reg.scope);
        }
      })
      .catch((err) => {
        if (isDevMode) {
          console.error("[PWA] Błąd rejestracji Service Workera", err);
        }
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
  initJsonLd();

  if (document.getElementById("gallery-filters")) {
    initGalleryFilters();
  }

  registerSW();
}

window.addEventListener("DOMContentLoaded", boot);
