import { initNav } from "./features/nav.js";
import { initThemeToggle } from "./features/theme.js";
import { initCompactHeader } from "./features/compact-header.js";
import { initReveal } from "./features/reveal.js";
import { initToursFilters, initFiltersDropdowns } from "./features/tours-filters.js";
import { initTabs } from "./features/tabs.js";
import { initAccordionFaq } from "./features/accordion-faq.js";
import { initForm } from "./features/form.js";
import { initAriaCurrent } from "./features/aria-current.js";
import { initLightbox } from "./features/lightbox.js";
import { initTourDetail } from "./features/tour-detail.js";
import { initGalleryFilters } from "./features/gallery-filters.js";

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initThemeToggle();
  initCompactHeader();
  initReveal();
  initToursFilters();
  initFiltersDropdowns();
  initTabs();
  initAccordionFaq();
  initForm();
  initAriaCurrent();

  if (document.body.dataset.page === "gallery") {
    initGalleryFilters();
  }

  initTourDetail();
  initLightbox();
  updateYear();
});

function updateYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // silent fail for demo
    });
  });
}
