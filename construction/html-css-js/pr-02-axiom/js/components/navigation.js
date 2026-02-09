import { SELECTORS } from "../core/config.js";
import { qs } from "../utils/dom.js";

export const initNavigation = () => {
  const btn = qs(SELECTORS.hamburger);
  const nav = qs(SELECTORS.primaryNav);
  if (!btn || !nav) return;
  const mql = window.matchMedia("(max-width: 768px)");
  if (!btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
  let lastTrigger = null;
  const unlock = () => document.body.classList.remove("nav-open");
  const lock = () => document.body.classList.add("nav-open");
  const applyDesktopState = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    nav.toggleAttribute("inert", false);
    nav.setAttribute("aria-hidden", "false");
    unlock();
    removeOutsideClick();
  };
  const applyMobileCollapsed = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    nav.toggleAttribute("inert", true);
    nav.setAttribute("aria-hidden", "true");
    unlock();
    removeOutsideClick();
  };
  const closeMenu = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    nav.toggleAttribute("inert", true);
    nav.setAttribute("aria-hidden", "true");
    unlock();
    (lastTrigger || btn).focus({ preventScroll: true });
    lastTrigger = null;
    removeOutsideClick();
  };
  const openMenu = () => {
    nav.classList.add("mobile-open");
    btn.classList.add("active");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Zamknij menu");
    nav.toggleAttribute("inert", false);
    nav.setAttribute("aria-hidden", "false");
    lock();
    lastTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : btn;
    const firstLink = nav.querySelector(".nav a");
    if (firstLink && typeof firstLink.focus === "function") {
      firstLink.focus({ preventScroll: true });
    }
    addOutsideClick();
  };
  const toggleMenu = () => (nav.classList.contains("mobile-open") ? closeMenu() : openMenu());
  btn.addEventListener("click", toggleMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("mobile-open")) closeMenu();
  });
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a[href], area[href]");
    if (link && mql.matches) closeMenu();
  });
  let outsideClickHandler = null;
  function addOutsideClick() {
    if (outsideClickHandler) return;
    outsideClickHandler = (e) => {
      if (!nav.classList.contains("mobile-open")) return;
      const inNav = nav.contains(e.target);
      const onBtn = btn.contains(e.target);
      if (!inNav && !onBtn) closeMenu();
    };
    document.addEventListener("pointerdown", outsideClickHandler, true);
  }
  function removeOutsideClick() {
    if (!outsideClickHandler) return;
    document.removeEventListener("pointerdown", outsideClickHandler, true);
    outsideClickHandler = null;
  }
  const onChange = (e) => {
    if (e.matches) {
      applyMobileCollapsed();
    } else {
      applyDesktopState();
    }
  };
  if (mql.addEventListener) mql.addEventListener("change", onChange);
  else if (mql.addListener) mql.addListener(onChange);
  if (mql.matches) applyMobileCollapsed();
  else applyDesktopState();
};
