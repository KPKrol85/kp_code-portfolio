import { qs, qsa, on } from "./dom.js";

const closeAllDropdowns = () => {
  qsa("[data-dropdown-toggle]").forEach((toggle) => {
    const menuId = toggle.getAttribute("aria-controls");
    const menu = qs(`#${menuId}`);
    toggle.setAttribute("aria-expanded", "false");
    if (menu) menu.setAttribute("aria-hidden", "true");
  });
};

const setupDropdowns = () => {
  qsa("[data-dropdown-toggle]").forEach((toggle) => {
    on(toggle, "click", (event) => {
      event.stopPropagation();
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      closeAllDropdowns();
      const menuId = toggle.getAttribute("aria-controls");
      const menu = qs(`#${menuId}`);
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      if (menu) menu.setAttribute("aria-hidden", String(isExpanded));
    });

    on(toggle, "keydown", (event) => {
      if (event.key === "Escape") {
        toggle.setAttribute("aria-expanded", "false");
        const menuId = toggle.getAttribute("aria-controls");
        const menu = qs(`#${menuId}`);
        if (menu) menu.setAttribute("aria-hidden", "true");
        toggle.focus();
      }
    });
  });

  on(document, "click", () => closeAllDropdowns());
  on(document, "keydown", (event) => {
    if (event.key === "Escape") {
      closeAllDropdowns();
    }
  });
};

const setupDrawer = () => {
  const toggle = qs("[data-nav-toggle]");
  const drawer = qs("[data-nav-drawer]");
  const closeBtn = qs("[data-nav-close]");
  const panel = qs("[data-nav-panel]", drawer);
  const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(", ");
  let lastActiveElement = null;

  if (!toggle || !drawer) return;

  const getFocusableElements = () =>
    qsa(FOCUSABLE_SELECTOR, drawer).filter(
      (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true"
    );

  const open = () => {
    lastActiveElement = document.activeElement;
    drawer.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    const [firstFocusable] = getFocusableElements();
    if (firstFocusable) firstFocusable.focus();
    else if (panel) panel.focus();
  };

  const close = () => {
    drawer.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    if (lastActiveElement instanceof HTMLElement) {
      lastActiveElement.focus();
      lastActiveElement = null;
    }
  };

  const handleFocusTrap = (event) => {
    if (drawer.getAttribute("aria-hidden") === "true" || event.key !== "Tab") return;

    const focusableElements = getFocusableElements();
    if (!focusableElements.length) {
      event.preventDefault();
      if (panel) panel.focus();
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && (activeElement === firstFocusable || !drawer.contains(activeElement))) {
      event.preventDefault();
      lastFocusable.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  };

  on(toggle, "click", () => {
    const isHidden = drawer.getAttribute("aria-hidden") === "true";
    if (isHidden) open();
    else close();
  });

  on(closeBtn, "click", close);

  on(drawer, "click", (event) => {
    if (event.target === drawer) close();
  });

  on(drawer, "keydown", handleFocusTrap);

  on(document, "keydown", (event) => {
    if (event.key === "Escape") close();
  });
};

const setupStickyHeaderShrink = () => {
  const header = qs(".site-header");
  const ENTER_THRESHOLD = 44;
  const EXIT_THRESHOLD = 16;
  let isShrunk = false;
  let frameId = null;

  if (!header) return;

  const applyState = (shouldShrink) => {
    if (shouldShrink === isShrunk) return;
    isShrunk = shouldShrink;
    header.classList.toggle("is-shrunk", shouldShrink);
  };

  const updateState = () => {
    frameId = null;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    if (!isShrunk && scrollY >= ENTER_THRESHOLD) {
      applyState(true);
      return;
    }

    if (isShrunk && scrollY <= EXIT_THRESHOLD) {
      applyState(false);
    }
  };

  const requestUpdate = () => {
    if (frameId !== null) return;
    frameId = window.requestAnimationFrame(updateState);
  };

  updateState();
  on(window, "scroll", requestUpdate, { passive: true });
  on(window, "resize", requestUpdate, { passive: true });
};

export const initNav = () => {
  setupDropdowns();
  setupDrawer();
  setupStickyHeaderShrink();
};
