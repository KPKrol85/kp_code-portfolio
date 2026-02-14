import { qs, qsa } from './dom.js';

export function initNav() {
  const toggle = qs('[data-nav-toggle]');
  const nav = qs('[data-nav]');
  if (!toggle || !nav) return;

  let lastFocus = null;

  const focusable = () => qsa('a, button', nav).filter((el) => !el.disabled);
  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      lastFocus = document.activeElement;
      focusable()[0]?.focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!nav.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
