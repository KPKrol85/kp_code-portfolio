const focusableSelectors = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
];

export function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-mobile-nav]");
  const closeBtn = document.querySelector("[data-nav-close]");
  const desktopQuery = window.matchMedia("(min-width: 700px)");

  if (!toggle || !nav || !closeBtn) return;

  let lastFocused = null;

  const openNav = () => {
    lastFocused = document.activeElement;
    nav.inert = false;
    nav.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    const focusable = nav.querySelectorAll(focusableSelectors.join(","));
    if (focusable.length) {
      focusable[0].focus();
    }
  };

  const closeNav = ({ restoreFocus = true } = {}) => {
    nav.inert = true;
    nav.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (restoreFocus && lastFocused) {
      lastFocused.focus();
    }
  };

  const syncViewportState = () => {
    if (desktopQuery.matches) {
      closeNav({ restoreFocus: false });
      return;
    }
    nav.inert = nav.hidden;
  };

  const trapFocus = (event) => {
    if (nav.hidden) return;
    if (event.key === "Escape") {
      closeNav();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = nav.querySelectorAll(focusableSelectors.join(","));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  toggle.addEventListener("click", () => {
    if (nav.hidden) {
      openNav();
    } else {
      closeNav();
    }
  });

  closeBtn.addEventListener("click", closeNav);

  nav.addEventListener("click", (event) => {
    if (event.target === nav) {
      closeNav();
    }
  });

  document.addEventListener("keydown", trapFocus);

  nav.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  desktopQuery.addEventListener("change", syncViewportState);
  syncViewportState();
}
