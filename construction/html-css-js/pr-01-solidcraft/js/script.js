import { utils } from "./modules/utils.js";
import { initNav, initHeaderShrink, initScrollSpy } from "./modules/nav.js";
import {
  initFooterYear,
  initSmoothTop,
  initScrollReveal,
  initThemeToggle,
  initRipple,
  initHeroBlurSync,
} from "./modules/ui-core.js";
import { initContactForm } from "./modules/forms.js";
import { initOfertaLightbox } from "./modules/lightbox.js";
import { initOfferPrefetch } from "./modules/prefetch.js";
import { initHomeHelpers } from "./modules/home.js";
import { initMapConsent } from "./modules/map-consent.js";
import { initCookieBanner } from "./modules/cookie-banner.js";

window.SC = window.SC || {};
window.SC.utils = utils;
window.SC.nav = {
  init: initNav,
  initHeaderShrink,
  initScrollSpy,
};
window.SC.ui = {
  initFooterYear,
  initSmoothTop,
  initScrollReveal,
  initThemeToggle,
  initRipple,
  initHeroBlurSync,
};
window.SC.forms = { init: initContactForm };
window.SC.lightbox = { init: initOfertaLightbox };
window.SC.prefetch = { init: initOfferPrefetch };
window.SC.home = { init: initHomeHelpers };
window.SC.mapConsent = { init: initMapConsent };
window.SC.cookieBanner = { init: initCookieBanner };
window.utils = window.utils || utils;

const runInit = () => {
  utils.syncHeaderCssVar?.();

  initNav?.();
  initHeaderShrink?.();
  initScrollSpy?.();

  initFooterYear?.();
  initSmoothTop?.();
  initScrollReveal?.();
  initThemeToggle?.();
  initRipple?.();
  initHeroBlurSync?.();

  initOfertaLightbox?.();
  initOfferPrefetch?.();
  initHomeHelpers?.();

  initMapConsent?.();
  initContactForm?.();
  initCookieBanner?.();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runInit, { once: true });
} else {
  runInit();
}
