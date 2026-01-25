import { storage } from "./services/storage.js";

export const THEME_KEY = "kp_theme";

export const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const detectTheme = () => {
  const saved = storage.get(THEME_KEY, null);
  return {
    theme: saved ?? getSystemTheme(),
    hasSaved: Boolean(saved),
  };
};

export const applyTheme = (theme, { persist = true, onChange } = {}) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (persist) {
    storage.set(THEME_KEY, theme);
  }
  if (typeof onChange === "function") {
    onChange(theme);
  }
};

export const initTheme = ({ onChange } = {}) => {
  const { theme, hasSaved } = detectTheme();
  applyTheme(theme, { persist: hasSaved, onChange });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (event) => {
    if (storage.get(THEME_KEY, null)) {
      return;
    }
    applyTheme(event.matches ? "dark" : "light", { persist: false, onChange });
  });

  return theme;
};

export const toggleTheme = (currentTheme) => (currentTheme === "dark" ? "light" : "dark");
