import { createElement, clearElement } from "../utils/dom.js";
import { store } from "../store/store.js";

const navItems = [
  { label: "Start", path: "#/" },
  { label: "Produkty", path: "#/products" },
  { label: "Koszyk", path: "#/cart" },
  { label: "Konto", path: "#/account" },
  { label: "Biblioteka", path: "#/library" },
  { label: "Licencje", path: "#/licenses" },
  { label: "Kontakt", path: "#/contact" },
];

export const renderHeader = (container, onThemeToggle) => {
  const MOBILE_BREAKPOINT = 960;
  const SHRINK_THRESHOLD = 36;
  let menuOpen = false;
  let menuToggleButton = null;
  let menuDrawer = null;
  let menuOverlay = null;
  let scrollTicking = false;
  let scrollLocked = false;
  let lockedScrollY = 0;

  const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

  const getLogoSrc = () => {
    const theme = document.documentElement.dataset.theme;
    return theme === "dark" ? "assets/logo/logo-06-dark.svg" : "assets/logo/logo-06-light.svg";
  };

  const getThemeLabel = () => {
    const theme = store.getState().ui?.theme;
    return theme === "dark" ? "dark" : "light";
  };

  const createThemeIcon = () => {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "sun-and-moon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", "0 0 24 24");

    const mask = document.createElementNS(ns, "mask");
    mask.setAttribute("id", "moon-mask");
    const maskRect = document.createElementNS(ns, "rect");
    maskRect.setAttribute("x", "0");
    maskRect.setAttribute("y", "0");
    maskRect.setAttribute("width", "100%");
    maskRect.setAttribute("height", "100%");
    maskRect.setAttribute("fill", "white");
    const maskCircle = document.createElementNS(ns, "circle");
    maskCircle.setAttribute("class", "moon");
    maskCircle.setAttribute("cx", "24");
    maskCircle.setAttribute("cy", "10");
    maskCircle.setAttribute("r", "6");
    maskCircle.setAttribute("fill", "black");
    mask.appendChild(maskRect);
    mask.appendChild(maskCircle);

    const sun = document.createElementNS(ns, "circle");
    sun.setAttribute("class", "sun");
    sun.setAttribute("cx", "12");
    sun.setAttribute("cy", "12");
    sun.setAttribute("r", "6");
    sun.setAttribute("mask", "url(#moon-mask)");

    const beams = document.createElementNS(ns, "g");
    beams.setAttribute("class", "sun-beams");
    const beamLines = [
      ["12", "1", "12", "3"],
      ["12", "21", "12", "23"],
      ["4.22", "4.22", "5.64", "5.64"],
      ["18.36", "18.36", "19.78", "19.78"],
      ["1", "12", "3", "12"],
      ["21", "12", "23", "12"],
      ["4.22", "19.78", "5.64", "18.36"],
      ["18.36", "5.64", "19.78", "4.22"],
    ];
    beamLines.forEach(([x1, y1, x2, y2]) => {
      const line = document.createElementNS(ns, "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      beams.appendChild(line);
    });

    svg.appendChild(mask);
    svg.appendChild(sun);
    svg.appendChild(beams);
    return svg;
  };

  const buildNavLinks = (className) => {
    const navList = createElement("div", { className });
    navItems.forEach((item) => {
      const link = createElement("a", {
        text: item.label,
        attrs: { href: item.path, "data-route": item.path },
      });
      navList.appendChild(link);
    });
    return navList;
  };

  const buildActions = (className) => {
    const actions = createElement("div", { className });
    const { cart, user } = store.getState();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartButton = createElement("a", {
      text: `Koszyk (${cartCount})`,
      attrs: { href: "#/cart" },
    });

    const authButton = createElement("a", {
      text: user ? "Moje konto" : "Zaloguj",
      attrs: { href: user ? "#/account" : "#/auth" },
    });

    const themeButton = createElement(
      "button",
      {
        className: "theme-toggle",
        attrs: {
          id: "theme-toggle",
          type: "button",
          "aria-label": getThemeLabel(),
          "aria-live": "polite",
        },
      },
      [createThemeIcon()],
    );

    themeButton.addEventListener("click", onThemeToggle);

    actions.appendChild(cartButton);
    actions.appendChild(authButton);
    actions.appendChild(themeButton);
    return actions;
  };

  const lockScroll = () => {
    if (scrollLocked) {
      return;
    }
    lockedScrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.classList.add("no-scroll");
    scrollLocked = true;
  };

  const unlockScroll = () => {
    if (!scrollLocked) {
      return;
    }
    document.body.classList.remove("no-scroll");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.paddingRight = "";
    window.scrollTo(0, lockedScrollY);
    scrollLocked = false;
  };

  const applyMenuState = ({ focusOnOpen = false, restoreFocus = false } = {}) => {
    if (!menuDrawer || !menuOverlay || !menuToggleButton) {
      return;
    }
    menuDrawer.classList.toggle("is-open", menuOpen);
    menuOverlay.classList.toggle("is-open", menuOpen);
    menuDrawer.setAttribute("aria-hidden", menuOpen ? "false" : "true");
    menuOverlay.setAttribute("aria-hidden", menuOpen ? "false" : "true");
    menuToggleButton.setAttribute("aria-expanded", menuOpen ? "true" : "false");
    menuToggleButton.setAttribute("aria-label", menuOpen ? "Close menu" : "Open menu");

    if (menuOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }

    if (menuOpen && focusOnOpen) {
      const firstFocusable = menuDrawer.querySelector(focusableSelector);
      if (firstFocusable) {
        firstFocusable.focus();
      }
    } else if (!menuOpen && restoreFocus && menuToggleButton) {
      menuToggleButton.focus();
    }
  };

  const setMenuOpen = (next, { restoreFocus = true } = {}) => {
    if (menuOpen === next) {
      return;
    }
    menuOpen = next;
    applyMenuState({ focusOnOpen: menuOpen, restoreFocus });
  };

  const build = () => {
    clearElement(container);

    // --- BRAND / LOGO ---
    const logo = createElement("img", {
      attrs: {
        src: getLogoSrc(),
        alt: "KP_Code Digital Vault",
        width: "140",
        height: "64",
      },
    });

    const brandLink = createElement("a", { attrs: { href: "#/" }, className: "brand" }, [logo]);

    // --- NAV ---
    const nav = createElement("nav", {
      className: "primary-nav",
      attrs: { "aria-label": "Glowna" },
    });
    nav.appendChild(buildNavLinks("nav-links"));

    // --- ACTIONS ---
    const actions = buildActions("nav-links header-actions");

    // --- MOBILE TOGGLE ---
    const menuIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    menuIcon.setAttribute("class", "menu-toggle-icon");
    menuIcon.setAttribute("viewBox", "0 0 24 24");
    menuIcon.setAttribute("width", "24");
    menuIcon.setAttribute("height", "24");
    menuIcon.setAttribute("fill", "none");
    menuIcon.setAttribute("stroke", "currentColor");
    menuIcon.setAttribute("stroke-width", "2");
    menuIcon.setAttribute("stroke-linecap", "round");
    menuIcon.setAttribute("stroke-linejoin", "round");

    const pathTop = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathTop.setAttribute("d", "M4 7H20");
    const pathMiddle = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathMiddle.setAttribute("d", "M4 12H20");
    const pathBottom = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathBottom.setAttribute("d", "M4 17H20");

    menuIcon.appendChild(pathTop);
    menuIcon.appendChild(pathMiddle);
    menuIcon.appendChild(pathBottom);

    const menuButton = createElement(
      "button",
      {
        className: "menu-toggle",
        attrs: {
          type: "button",
          "aria-label": "Open menu",
          "aria-expanded": menuOpen ? "true" : "false",
          "aria-controls": "mobile-nav",
        },
      },
      [menuIcon],
    );
    menuButton.addEventListener("click", () => setMenuOpen(!menuOpen));

    // --- MOBILE MENU ---
    const mobileMenu = createElement(
      "nav",
      {
        className: "mobile-menu",
        attrs: {
          id: "mobile-nav",
          "aria-label": "Menu",
          "aria-hidden": menuOpen ? "false" : "true",
        },
      },
      [buildNavLinks("nav-links mobile-nav-links"), buildActions("nav-links mobile-action-links")],
    );

    const mobileOverlay = createElement("div", { className: "mobile-menu-overlay" });
    mobileOverlay.addEventListener("click", () => setMenuOpen(false));
    mobileMenu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link && link.getAttribute("href")?.startsWith("#")) {
        setMenuOpen(false, { restoreFocus: false });
      }
    });

    menuToggleButton = menuButton;
    menuDrawer = mobileMenu;
    menuOverlay = mobileOverlay;

    // --- MOUNT ---
    container.appendChild(brandLink);
    container.appendChild(nav);
    container.appendChild(actions);
    container.appendChild(menuButton);
    container.appendChild(mobileOverlay);
    container.appendChild(mobileMenu);

    applyMenuState({ focusOnOpen: menuOpen });
  };

  build();
  store.subscribe(build);

  const headerRoot = container.closest("header");
  const handleScroll = () => {
    if (!headerRoot) {
      return;
    }
    if (scrollTicking) {
      return;
    }
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      headerRoot.classList.toggle("is-shrink", window.scrollY > SHRINK_THRESHOLD);
      scrollTicking = false;
    });
  };

  const handleKeydown = (event) => {
    if (!menuOpen) {
      return;
    }
    if (event.key === "Escape") {
      setMenuOpen(false);
      return;
    }
    if (event.key === "Tab" && menuDrawer) {
      const focusable = menuDrawer.querySelectorAll(focusableSelector);
      if (!focusable.length) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const handleResize = () => {
    if (window.innerWidth > MOBILE_BREAKPOINT && menuOpen) {
      setMenuOpen(false, { restoreFocus: false });
    }
  };

  if (headerRoot && headerRoot.dataset.shrinkReady !== "true") {
    headerRoot.dataset.shrinkReady = "true";
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);
};

export const updateActiveNav = (path) => {
  document.querySelectorAll("[data-route]").forEach((link) => {
    if (link.getAttribute("data-route") === path) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

// Zmiany: A11y/ARIA dla hamburgera, focus trap + ESC, scroll lock z przywroceniem pozycji, overlay + motion.
