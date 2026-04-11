/*
 * Single JavaScript entry point for the project.
 * Feature modules are imported and initialized here in a minimal, predictable order.
 */

import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initSmoothScroll } from './modules/scroll.js';
import { initReveal } from './modules/reveal.js';
import { initForms } from './modules/forms.js';
import { initProjectFilter } from './modules/project-filter.js';
import { initServiceWorker } from './modules/service-worker.js';
import { initAboutBinaryRain } from './modules/about-binary-rain.js';

const initApp = () => {
  initTheme();
  initNavigation();
  initSmoothScroll();
  initReveal();
  initForms();
  initProjectFilter();
  initAboutBinaryRain();
  initServiceWorker();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp, { once: true });
} else {
  initApp();
}
