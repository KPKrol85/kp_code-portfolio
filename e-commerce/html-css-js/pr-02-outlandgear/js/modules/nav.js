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
  if (!toggle || !drawer) return;

  const open = () => {
    drawer.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    const panel = qs("[data-nav-panel]", drawer);
    if (panel) panel.focus();
  };

  const close = () => {
    drawer.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
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

  on(document, "keydown", (event) => {
    if (event.key === "Escape") close();
  });
};

export const initNav = () => {
  setupDropdowns();
  setupDrawer();
};
