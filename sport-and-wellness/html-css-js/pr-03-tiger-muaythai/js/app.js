import { initTheme } from './modules/theme.js';
import { initNav, initHeaderScroll } from './modules/nav.js';
import { initAccordion } from './modules/accordion.js';
import { initForm } from './modules/form.js';
import { initReveal } from './modules/reveal.js';
import { initHomeEnhancements } from './modules/home.js';
import { initAdvancedUi } from './modules/ui.js';

function init() {
  initTheme();
  initNav();
  initHeaderScroll();
  initAccordion();
  initForm();
  initReveal();
  initHomeEnhancements();
  initAdvancedUi();
}

document.addEventListener('DOMContentLoaded', init);
