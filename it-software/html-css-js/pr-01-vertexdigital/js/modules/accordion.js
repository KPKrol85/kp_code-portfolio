import { SELECTORS } from '../config.js';
import { qsa } from './dom.js';

export const initAccordion = () => {
  const accordions = qsa(SELECTORS.accordion);
  if (!accordions.length) return;

  accordions.forEach((accordion) => {
    const triggers = qsa(SELECTORS.accordionTrigger, accordion);
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isExpanded));
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = isExpanded;
        }
      });

      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          trigger.click();
        }
      });
    });
  });
};
