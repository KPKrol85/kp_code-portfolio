import { onReady } from './modules/dom.js';
import { initNav } from './modules/nav.js';
import { initForm } from './modules/form.js';

onReady(() => {
  initNav();
  initForm();
});
