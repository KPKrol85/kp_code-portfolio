const STORAGE_KEY = "theme-pref"; // 'light' | 'dark' | 'auto'
const PREFS = ["auto", "light", "dark"];

function applyTheme(pref) {
  const html = document.documentElement;
  const next = PREFS.includes(pref) ? pref : "auto";
  html.setAttribute("data-theme", next);
}

function getStored() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return PREFS.includes(stored) ? stored : "auto";
}

function store(pref) {
  localStorage.setItem(STORAGE_KEY, pref);
}

function syncButtons(buttons, pref) {
  buttons.forEach((btn) => {
    const isActive = btn.dataset.theme === pref;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

export function initTheme() {
  let current = getStored();
  applyTheme(current);

  const media = matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener?.("change", () => {
    if (current === "auto") {
      applyTheme("auto");
    }
  });

  const toggle = document.getElementById("theme-toggle");
  const buttons = toggle ? [...toggle.querySelectorAll("button[data-theme]")] : [];
  if (buttons.length) {
    syncButtons(buttons, current);

    toggle.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-theme]");
      if (!target) return;
      const next = target.dataset.theme;
      if (!PREFS.includes(next)) return;
      current = next;
      applyTheme(current);
      store(current);
      syncButtons(buttons, current);
    });
  }
}
