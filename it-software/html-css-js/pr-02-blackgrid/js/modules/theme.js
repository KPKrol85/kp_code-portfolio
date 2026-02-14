import { qs } from './dom.js';
import { storage } from './storage.js';

export function initTheme() {
  const toggle = qs('[data-theme-toggle]');
  if (!toggle) return;

  const root = document.documentElement;
  const saved = storage.get('theme', 'light');
  root.setAttribute('data-theme', saved);
  toggle.setAttribute('aria-pressed', String(saved === 'dark'));

  toggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    toggle.setAttribute('aria-pressed', String(next === 'dark'));
    storage.set('theme', next);
  });
}
