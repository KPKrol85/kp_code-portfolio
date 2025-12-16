import { initNav } from "./nav.js";
import { initCompactHeader } from "./compact-header.js";
import { initThemeToggle } from "./theme.js";
import { initDemoConsent } from "./demo-consent.js";
import { applyAriaCurrent } from "./aria-current.js";
import { initTabs } from "./tabs.js";
import { initAccordion } from "./accordion-faq.js";
import { initReveal } from "./reveal.js";
import { initForms } from "./form.js";
import { initGalleryFilters } from "./gallery-filters.js";
import { initLightbox } from "./lightbox.js";
import { initServicesFilters } from "./services-filters.js";
import { initServiceDetail } from "./service-detail.js";
import { initFooterStats } from "./stats.js";

// Bootstraps all modules depending on available DOM hooks
initNav();
initCompactHeader();
initThemeToggle();
initDemoConsent();
applyAriaCurrent();
initReveal();
initTabs();
initAccordion();
initForms();
initGalleryFilters();
initLightbox();
initServicesFilters();
initServiceDetail();

initFooterStats();

if (
  "serviceWorker" in navigator &&
  (location.protocol === "https:" || location.hostname === "localhost")
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Ignore registration errors to avoid impacting page load.
    });
  });
}
