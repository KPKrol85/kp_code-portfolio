import { qs, qsa, setExpanded, trapFocus } from "../utils.js";
import { SELECTORS } from "../config.js";

export const initNav = () => {
  const navToggle = qs(SELECTORS.navToggle);
  const navPanel = qs(SELECTORS.navPanel);
  const primaryNav = qs("#primary-navigation");
  const dropdownToggles = qsa(SELECTORS.dropdownToggle);
  const dropdownMenus = qsa(SELECTORS.dropdownMenu);

  if (navToggle?.dataset.initialized === "true") return;

  // Initialize panel state based on screen size
  const initPanelState = () => {
    if (window.innerWidth <= 1024) {
      navPanel?.setAttribute("hidden", "");
      navPanel?.removeAttribute("data-open");
      setExpanded(navToggle, false);
    } else {
      navPanel?.removeAttribute("hidden");
      setExpanded(navToggle, false);
    }
  };

  initPanelState();

  const closeNav = () => {
    if (!navPanel || !navToggle) return;
    navPanel.setAttribute("hidden", "");
    navPanel.removeAttribute("data-open");
    setExpanded(navToggle, false);
    navToggle.focus();
  };

  const openNav = () => {
    if (!navPanel || !navToggle) return;
    navPanel.removeAttribute("hidden");
    navPanel.setAttribute("data-open", "true");
    setExpanded(navToggle, true);
    const firstLink = qs("a, button", navPanel);
    firstLink?.focus();
  };

  navToggle?.addEventListener("click", () => {
    if (!navPanel || !navToggle) return;
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  // Close menu when clicking on a link
  const navLinks = qsa(".nav__link", navPanel);
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        closeNav();
      }
    });
  });

  // Handle escape key
  const handleEscape = (event) => {
    if (event.key !== "Escape") return;

    // Close mobile menu
    if (navToggle?.getAttribute("aria-expanded") === "true") {
      closeNav();
    }

    // Close dropdowns
    dropdownToggles.forEach((toggle) => {
      if (toggle.getAttribute("aria-expanded") === "true") {
        closeDropdown(toggle);
        toggle.focus();
      }
    });
  };

  document.addEventListener("keydown", handleEscape);

  // Setup dropdown menus
  const closeDropdown = (toggle) => {
    if (!toggle) return;
    const menu = qs(`#${toggle.getAttribute("aria-controls")}`);
    if (menu) {
      menu.dataset.open = "false";
      setExpanded(toggle, false);
    }
  };

  const openDropdown = (toggle) => {
    if (!toggle) return;
    const menu = qs(`#${toggle.getAttribute("aria-controls")}`);
    if (menu) {
      menu.dataset.open = "true";
      setExpanded(toggle, true);
      const firstItem = qs("a", menu);
      firstItem?.focus();
    }
  };

  // Dropdown toggle clicks
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeDropdown(toggle);
      } else {
        openDropdown(toggle);
      }
    });

    // Keyboard support for dropdown
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle.click();
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    dropdownToggles.forEach((toggle) => {
      const menu = qs(`#${toggle.getAttribute("aria-controls")}`);
      if (menu && !menu.contains(target) && !toggle.contains(target)) {
        closeDropdown(toggle);
      }
    });
  });

  // Keyboard navigation within dropdowns
  dropdownMenus.forEach((menu) => {
    const links = qsa("a", menu);
    links.forEach((link) => {
      link.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          const toggle = qs(`[aria-controls="${menu.id}"]`);
          closeDropdown(toggle);
          toggle?.focus();
        }
      });
    });
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      navPanel?.removeAttribute("hidden");
      navPanel?.removeAttribute("data-open");
      setExpanded(navToggle, false);
    } else if (navToggle?.getAttribute("aria-expanded") !== "true") {
      navPanel?.setAttribute("hidden", "");
      navPanel?.removeAttribute("data-open");
    }
  });

  navToggle && (navToggle.dataset.initialized = "true");

  return () => {
    document.removeEventListener("keydown", handleEscape);
    document.removeEventListener("click", () => {});
  };
};
