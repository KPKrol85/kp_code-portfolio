const STORAGE_KEY = "kp-travel-theme";
const USER_THEMES = ["light", "dark"];

export function initThemeToggle() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  let stored;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    stored = null;
  }

  const inlineTheme = document.documentElement.getAttribute("data-theme") || "light";
  const initial = USER_THEMES.includes(stored) ? stored : inlineTheme;
  applyTheme(initial);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "auto";
    const next = nextTheme(current);
    applyTheme(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  });

  function applyTheme(value) {
    document.documentElement.setAttribute("data-theme", value);
  }

  function nextTheme(current) {
    if (current === "auto") return "light";

    const index = USER_THEMES.indexOf(current);
    return USER_THEMES[(index + 1) % USER_THEMES.length];
  }
}
