// Entry: initializes all features on DOMContentLoaded
import { initNav } from "./features/nav.js";
import { initTheme } from "./features/theme.js";
import { initReveal } from "./features/reveal.js";
import { initLightbox } from "./features/lightbox.js";
import { initForm } from "./features/form.js";
import { initTabs } from "./features/tabs.js";
import { initCompactHeader } from "./features/compact-header.js";
import { initGalleryFilters } from "./features/gallery-filters.js";
import { setAriaCurrent } from "./features/aria-current.js"; // ⬅️ było initAriaCurrent

// A11y: sync aria-pressed for theme toggle
const themeBtn = document.getElementById('theme-toggle');
function syncThemeButtonAria() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeBtn?.setAttribute('aria-pressed', String(isDark));
}
document.addEventListener('DOMContentLoaded', syncThemeButtonAria);
themeBtn?.addEventListener('click', () => {
  // existing theme toggle runs in initTheme(); this just re-syncs aria state
  syncThemeButtonAria();
});

function setYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = new Date().getFullYear();
}

function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("pwa/service-worker.js")
      .then((reg) => console.log("[PWA] Service Worker zarejestrowany", reg.scope))
      .catch((err) => console.error("[PWA] Błąd rejestracji Service Workera", err));
  }
}

function boot() {
  setYear();
  setAriaCurrent(); // ⬅️ było initAriaCurrent()
  initTheme();
  initNav();
  initCompactHeader();
  initReveal();
  initLightbox();
  initForm();
  initTabs();

  if (document.getElementById("gallery-filters")) {
    initGalleryFilters();
  }

  registerSW();
}

window.addEventListener("DOMContentLoaded", boot);

// --- A11y sync for segmented filter on rooms.html ---
(function () {
  const tabsWrap = document.querySelector('.tabs');
  if (!tabsWrap) return;
  const tabs = Array.from(tabsWrap.querySelectorAll('.tabs__tab'));
  if (!tabs.length) return;

  function setActive(btn) {
    tabs.forEach((t) => {
      const active = t === btn;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-pressed', active ? 'true' : 'false');
      t.tabIndex = active ? 0 : -1;
    });

    // Zachowujemy istniejącą mechanikę filtrowania: ustaw data-active na .card-grid
    const panel = document.querySelector('[data-tabs-panel]');
    const target = btn.getAttribute('data-tab-target') || 'all';
    if (panel) {
      panel.setAttribute('data-active', target);
      // Opcjonalna widoczność elementów jak w logice projektu
      const items = panel.querySelectorAll('[data-room-type]');
      items.forEach((el) => {
        const show = target === 'all' || el.getAttribute('data-room-type') === target;
        el.style.display = show ? '' : 'none';
      });
    }
  }

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => setActive(btn));
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const i = (tabs.indexOf(btn) + dir + tabs.length) % tabs.length;
      setActive(tabs[i]);
      tabs[i].focus();
    });
  });

  // Inicjalna synchronizacja z zaznaczonym przyciskiem
  const current = tabs.find((t) => t.classList.contains('is-active')) || tabs[0];
  if (current) setActive(current);
})();
