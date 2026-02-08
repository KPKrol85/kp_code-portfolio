import { initReveal } from "./modules/reveal.js";
import { initScrollType } from "./modules/scroll-type.js";
import { initScrollSpy } from "./modules/scrollspy.js";
import { initMobileNav } from "./modules/mobile-nav.js";
import { initCounters } from "./modules/counters.js";
import { initHeaderShrink } from "./modules/header-shrink.js";
import { initContactForm } from "./modules/contact-form.js";

initReveal();
initScrollType();
initScrollSpy();
initMobileNav();
initCounters();
initHeaderShrink();
initContactForm();

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "[::1]";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    if (isLocalhost) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
      return;
    }

    const registration = await navigator.serviceWorker.register(new URL("../service-worker.js", import.meta.url));

    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          newWorker.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });

    let hasRefreshed = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (hasRefreshed) return;
      hasRefreshed = true;
      window.location.reload();
    });
  });
}
