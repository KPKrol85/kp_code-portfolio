import { SELECTORS } from '../config.js';
import { qs, qsa } from './dom.js';

export const initNav = () => {
  const toggle = qs(SELECTORS.navToggle);
  const list = qs(SELECTORS.navList);
  if (!toggle || !list) return;

  const links = qsa(SELECTORS.navLinks, list);
  let lastFocused = null;

  if (window.innerWidth > 900) {
    list.removeAttribute('aria-hidden');
  } else {
    list.setAttribute('aria-hidden', 'true');
  }

  const openMenu = () => {
    lastFocused = document.activeElement;
    list.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    list.removeAttribute('aria-hidden');
    const firstLink = links[0];
    if (firstLink) firstLink.focus();
    document.addEventListener('keydown', onKeydown);
  };

  const closeMenu = () => {
    list.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    list.setAttribute('aria-hidden', 'true');
    if (lastFocused) lastFocused.focus();
    document.removeEventListener('keydown', onKeydown);
  };

  const onKeydown = (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  };

  toggle.addEventListener('click', () => {
    const isOpen = list.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth > 900) {
        list.classList.remove('is-open');
        list.removeAttribute('aria-hidden');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        list.setAttribute('aria-hidden', 'true');
      }
    },
    { passive: true }
  );
};
