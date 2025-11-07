const STORAGE_KEY = "theme-pref"; // 'light' | 'dark' | 'auto'

function applyTheme(pref) {
  const html = document.documentElement;
  if (pref === "auto") {
    const systemDark = matchMedia("(prefers-color-scheme: dark)").matches;
    html.setAttribute("data-theme", systemDark ? "dark" : "light");
  } else {
    html.setAttribute("data-theme", pref);
  }
}

function getStored() {
  return localStorage.getItem(STORAGE_KEY) || "auto";
}

function store(pref) {
  localStorage.setItem(STORAGE_KEY, pref);
}

export function initTheme() {
  let current = getStored();
  applyTheme(current);

  const media = matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener?.("change", () => {
    if (current === "auto") applyTheme("auto");
  });

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    const setPressed = () => {
      const now = document.documentElement.getAttribute("data-theme");
      btn.setAttribute("aria-pressed", String(now === "dark")); // opcjonalnie
    };
    setPressed();

    btn.addEventListener("click", () => {
      const now = document.documentElement.getAttribute("data-theme");
      current = now === "light" ? "dark" : "light";
      applyTheme(current);
      store(current);
      setPressed();
    });
  }
}
