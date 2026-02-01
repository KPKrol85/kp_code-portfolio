import { initNetworkStatusBanner } from "../features/network.js";
import { initDemoLegalModal } from "../features/demo-modal.js";
import { initThemeToggle } from "../features/theme.js";
import { initNav } from "../features/nav.js";
import { initReveal } from "../features/reveal.js";
import { initImageFallbacks, renderFeaturedMenu, initMenuPage } from "../features/menu.js";
import { initGalleryPage } from "../features/gallery.js";
import { initLightbox } from "../features/lightbox.js";
import { initForm } from "../features/form.js";
import { initMisc } from "../features/misc.js";

export function initApp() {
  document.addEventListener("DOMContentLoaded", function () {
    initMisc();
    initNetworkStatusBanner();
    initDemoLegalModal();
    initImageFallbacks();
    initNav();
    initForm();
    initMenuPage();
    initGalleryPage();
    initLightbox();

    renderFeaturedMenu().then(function (rendered) {
      if (rendered && typeof window.initReveal === "function") {
        window.initReveal();
      }
    });

    initReveal();
    initThemeToggle();
  });
}
