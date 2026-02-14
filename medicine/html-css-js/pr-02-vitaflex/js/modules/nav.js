import { qs, qsa } from './dom.js';

const focusable = 'a[href], button:not([disabled])';

export const initNav = () => {
  const toggle = qs('[data-nav-toggle]');
  const menu = qs('[data-nav-menu]');
  if (!toggle || !menu) return;
  let lastFocused = null;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (lastFocused) lastFocused.focus();
  };

  const openMenu = () => {
    lastFocused = document.activeElement;
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    const first = qsa(focusable, menu)[0];
    if (first) first.focus();
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    if (event.key === 'Tab' && menu.classList.contains('is-open')) {
      const nodes = qsa(focusable, menu);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
};
