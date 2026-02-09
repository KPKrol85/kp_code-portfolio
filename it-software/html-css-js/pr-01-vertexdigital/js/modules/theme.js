import { SELECTORS, STORAGE_KEYS } from '../config.js';
import { storage } from './storage.js';

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

const getPreferredTheme = () => {
  const stored = storage.get(STORAGE_KEYS.theme);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const initTheme = () => {
  const toggle = document.querySelector(SELECTORS.themeToggle);
  if (!toggle) {
    applyTheme(getPreferredTheme());
    return;
  }

  const initial = getPreferredTheme();
  applyTheme(initial);
  toggle.setAttribute('aria-pressed', initial === 'dark');

  toggle.addEventListener('click', () => {
    const next =
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark';
    applyTheme(next);
    storage.set(STORAGE_KEYS.theme, next);
    toggle.setAttribute('aria-pressed', next === 'dark');
  });
};
