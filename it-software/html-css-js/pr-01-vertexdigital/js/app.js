import { storage } from './modules/storage.js';
import { initNav } from './modules/nav.js';
import { initTheme } from './modules/theme.js';
import { initAccordion } from './modules/accordion.js';
import { initForm } from './modules/form.js';
import { initReveal } from './modules/reveal.js';

const init = () => {
  storage.ensureSchema();
  initTheme();
  initNav();
  initAccordion();
  initForm();
  initReveal();
};

document.addEventListener('DOMContentLoaded', init);
