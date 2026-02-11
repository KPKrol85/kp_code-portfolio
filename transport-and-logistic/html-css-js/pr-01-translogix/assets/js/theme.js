const STORAGE_KEY = "translogix-theme";

function getPreferredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("theme-dark", theme === "dark");
  root.classList.toggle("theme-light", theme === "light");
}

function updateToggleA11y(toggle, theme) {
  const isDark = theme === "dark";
  toggle.setAttribute("aria-pressed", isDark);
  toggle.setAttribute("aria-label", isDark ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny");
}

export function initThemeToggle() {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  let current = getPreferredTheme();
  applyTheme(current);

  updateToggleA11y(toggle, current);

  toggle.addEventListener("click", () => {
    current = current === "dark" ? "light" : "dark";
    applyTheme(current);
    localStorage.setItem(STORAGE_KEY, current);

    updateToggleA11y(toggle, current);
  });
}
