import { getStoredTheme } from './storage.js';

export const initTheme = () => {
  const theme = getStoredTheme();
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
};
