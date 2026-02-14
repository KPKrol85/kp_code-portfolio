import { qsa } from './dom.js';

export function initAccordion() {
  qsa('[data-accordion]').forEach((accordion) => {
    qsa('[data-accordion-trigger]', accordion).forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('aria-controls');
        const panel = document.getElementById(id);
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
      });
    });
  });
}
