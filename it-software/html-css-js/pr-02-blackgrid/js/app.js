import { initTheme } from './modules/theme.js';
import { initNav } from './modules/nav.js';
import { initAccordion } from './modules/accordion.js';
import { initTabs } from './modules/tabs.js';
import { initFilters } from './modules/filters.js';
import { initForm } from './modules/form.js';
import { initReveal } from './modules/reveal.js';
import { initAnalytics } from './modules/analytics.js';

function init() {
  initTheme();
  initNav();
  initAccordion();
  initTabs();
  initFilters();
  initForm();
  initReveal();
  initAnalytics();
}

document.addEventListener('DOMContentLoaded', init);
