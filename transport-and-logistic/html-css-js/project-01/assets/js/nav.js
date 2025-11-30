// Handles mobile navigation interactions and focus management
export function initNav() {
  const toggle = document.querySelector(".nav__toggle");
  const panel = document.querySelector(".nav__panel");
  const links = panel?.querySelectorAll("a");
  if (!toggle || !panel) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    panel.hidden = true;
    document.body.classList.remove("no-scroll");
  };

  const openMenu = () => {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.add("is-open");
    document.body.classList.add("no-scroll");
    links?.[0]?.focus();
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !toggle.contains(e.target) && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });

  // Ensure menu is visible on desktop sizes
  const mq = window.matchMedia("(min-width: 900px)");
  const handleMq = () => {
    if (mq.matches) {
      panel.hidden = false;
      document.body.classList.remove("no-scroll");
      toggle.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
    } else {
      panel.hidden = true;
    }
  };
  handleMq();
  mq.addEventListener("change", handleMq);
}
