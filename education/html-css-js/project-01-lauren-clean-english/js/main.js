import { initReveal } from './modules/reveal.js';
import { initHeaderShrink } from './modules/headerShrink.js';
import { initMobileNav } from './modules/mobileNav.js';
import { initScrollSpy } from './modules/scrollSpy.js';
import { initAccordion } from './modules/accordion.js';
import { initResourcesFilter } from './modules/resourcesFilter.js';
import { initProgressTracker } from './modules/progressTracker.js';
import { initContactForm } from './modules/contactForm.js';
import { initMaterialsCatalog } from './modules/materialsCatalog.js';
import { initAnchorFocus } from './modules/anchorFocus.js';
import { initProgressPage } from './pages/progress-page.js';

const initThemeToggle = () => {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.dataset.theme = saved;
  }
  toggle.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = current;
    localStorage.setItem('theme', current);
  });
};

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
};

initReveal();
initHeaderShrink();
initMobileNav();
initScrollSpy();
initAccordion();
initResourcesFilter();
initProgressTracker();
initMaterialsCatalog();
initAnchorFocus();
initThemeToggle();
initContactForm();
initProgressPage();
registerServiceWorker();
