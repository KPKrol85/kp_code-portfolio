const STORAGE_KEY = "activelife-theme";

export function initThemeToggle() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem(STORAGE_KEY);
  const theme = storedTheme || (prefersDark ? "dark" : "light");

  setTheme(theme);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  function setTheme(value) {
    document.documentElement.setAttribute("data-theme", value);
    toggle.setAttribute("aria-pressed", value === "dark" ? "true" : "false");
  }
}
