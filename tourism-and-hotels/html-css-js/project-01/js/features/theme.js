const STORAGE_KEY = "theme-pref";
const PREFS = new Set(["auto", "light", "dark"]);
const ICONS = {
  light: "assets/img/icons/sun-40x40.svg",
  dark: "assets/img/icons/moon-40x40.svg",
};

function getStoredPref() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return PREFS.has(stored) ? stored : "auto";
}

function savePref(pref) {
  if (pref === "auto") {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, pref);
}

function applyTheme(pref) {
  const next = PREFS.has(pref) ? pref : "auto";
  document.documentElement.setAttribute("data-theme", next);
}

function getActiveTheme(pref, media) {
  if (pref === "auto") {
    return media.matches ? "dark" : "light";
  }
  return pref;
}

function updateToggleIcon(iconEl, activeTheme) {
  if (!iconEl) return;
  iconEl.src = ICONS[activeTheme] || ICONS.light;
}

export function initTheme() {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const toggle = document.querySelector("[data-theme-toggle]");
  const icon = toggle?.querySelector(".theme-toggle__icon");
  let pref = getStoredPref();

  const sync = () => {
    applyTheme(pref);
    const activeTheme = getActiveTheme(pref, media);
    updateToggleIcon(icon, activeTheme);
  };

  if (toggle) {
    toggle.addEventListener("click", (event) => {
      if (event.shiftKey) {
        pref = "auto";
        savePref(pref);
        sync();
        return;
      }

      const activeTheme = getActiveTheme(pref, media);
      pref = activeTheme === "light" ? "dark" : "light";
      savePref(pref);
      sync();
    });
  }

  const onSystemThemeChange = () => {
    if (pref === "auto") {
      sync();
    }
  };

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onSystemThemeChange);
  } else if (typeof media.addListener === "function") {
    media.addListener(onSystemThemeChange);
  }

  sync();
}
