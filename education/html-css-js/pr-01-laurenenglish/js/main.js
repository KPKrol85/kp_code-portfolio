import { initReveal } from "./modules/reveal.js";
import { initHeaderShrink } from "./modules/headerShrink.js";
import { initMobileNav } from "./modules/mobileNav.js";
import { initScrollSpy } from "./modules/scrollSpy.js";
import { initAccordion } from "./modules/accordion.js";
import { initResourcesFilter } from "./modules/resourcesFilter.js";
import { initProgressTracker } from "./modules/progressTracker.js";
import { initContactForm } from "./modules/contactForm.js";
import { initMaterialsCatalog } from "./modules/materialsCatalog.js";
import { initAnchorFocus } from "./modules/anchorFocus.js";
import { initProgressPage } from "./pages/progress-page.js";
import { readStoredValue, writeStoredValue } from "./state/browserStorage.js";

const reportInitializationFailure = (name, error) => {
  console.error(`[Lauren English] ${name} initialization failed.`, error);
};

const runInitializer = (name, initializer) => {
  try {
    initializer();
  } catch (error) {
    reportInitializationFailure(name, error);
  }
};

const initThemeToggle = () => {
  const toggles = Array.from(document.querySelectorAll("[data-theme-toggle]"));
  if (!toggles.length) return;

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-pressed", String(isDark));
    });
  };

  const savedTheme = readStoredValue("theme");
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      writeStoredValue("theme", nextTheme);
    });
    toggle.hidden = false;
  });
};

const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      try {
        const registration =
          navigator.serviceWorker.register("/service-worker.js");
        registration.catch((error) =>
          reportInitializationFailure("Service worker", error),
        );
      } catch (error) {
        reportInitializationFailure("Service worker", error);
      }
    });
  }
};

[
  ["Reveal", initReveal],
  ["Header shrink", initHeaderShrink],
  ["Mobile navigation", initMobileNav],
  ["Scroll spy", initScrollSpy],
  ["Accordion", initAccordion],
  ["Resource filters", initResourcesFilter],
  ["Progress tracker", initProgressTracker],
  ["Materials catalogue", initMaterialsCatalog],
  ["Anchor focus", initAnchorFocus],
  ["Theme toggle", initThemeToggle],
  ["Contact form", initContactForm],
  ["Progress page", initProgressPage],
  ["Service worker", registerServiceWorker],
].forEach(([name, initializer]) => runInitializer(name, initializer));
