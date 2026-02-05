const getFocusableElements = (container) =>
  Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );

export const initNav = () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (!toggle || !panel) return;

  let isOpen = false;

  const openMenu = () => {
    panel.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    isOpen = true;
    const focusables = getFocusableElements(panel);
    focusables[0]?.focus();
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    isOpen = false;
    toggle.focus();
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  panel.addEventListener("click", (event) => {
    if (event.target.closest(".nav__link")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      closeMenu();
    }

    if (event.key === "Tab") {
      const focusables = getFocusableElements(panel);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900 && isOpen) {
      closeMenu();
    }
  });
};
