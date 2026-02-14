import { initTheme } from './modules/theme.js';
import { initNav } from './modules/nav.js';
import { initAccordion } from './modules/accordion.js';
import { initForm } from './modules/form.js';
import { initReveal } from './modules/reveal.js';

const init = () => {
  initTheme();
  initNav();
  initAccordion();
  initForm();
  initReveal();
};

document.addEventListener('DOMContentLoaded', init, { passive: true });
