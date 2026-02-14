import { qsa } from './dom.js';

export const initAccordion = () => {
  qsa('[data-accordion]').forEach((accordion) => {
    accordion.addEventListener('click', (event) => {
      const trigger = event.target.closest('.accordion__trigger');
      if (!trigger) return;
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });

    accordion.addEventListener('keydown', (event) => {
      const triggers = qsa('.accordion__trigger', accordion);
      const current = event.target.closest('.accordion__trigger');
      if (!current) return;
      const index = triggers.indexOf(current);
      if (event.key === 'ArrowDown') triggers[(index + 1) % triggers.length].focus();
      if (event.key === 'ArrowUp') triggers[(index - 1 + triggers.length) % triggers.length].focus();
    });
  });
};
