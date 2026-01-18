import { createElement, clearElement } from "../utils/dom.js";
import { store } from "../store/store.js";

const navItems = [
  { label: "Start", path: "#/" },
  {
    label: "Produkty",
    dropdownRoot: { label: "Wszystkie produkty", path: "#/products" },
    dropdown: [
      { label: "UI Kits & Components", path: "#/products/ui-kits" },
      { label: "Templates & Dashboards", path: "#/products/templates" },
      { label: "Assets & Graphics", path: "#/products/assets" },
      { label: "Knowledge & Tools", path: "#/products/knowledge" },
    ],
  },
  {
    label: "Usługi",
    dropdown: [
      { label: "Web Development", path: "#/services/web-development" },
      { label: "WordPress Solutions", path: "#/services/wordpress" },
      { label: "UI / UX & Branding", path: "#/services/ui-ux-branding" },
      { label: "Consulting & Support", path: "#/services/consulting-support" },
    ],
  },
  { label: "Konto", path: "#/account" },
  { label: "Biblioteka", path: "#/library" },
  { label: "Licencje", path: "#/licenses" },
  { label: "Kontakt", path: "#/contact" },
];

export const renderHeader = (container, onThemeToggle, { onHeightChange } = {}) => {
  const MOBILE_BREAKPOINT = 960;
  const SHRINK_THRESHOLD = 80;
  const EXPAND_THRESHOLD = 40;
  let menuOpen = false;
  let menuToggleButton = null;
  let menuDrawer = null;
  let menuOverlay = null;
  let openDropdown = null;
  let scrollTicking = false;
  let scrollLocked = false;
  let lockedScrollY = 0;
  let isShrunk = false;

  const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

  const LOGO_PATH =
    "M 365.851562 149.308594 L 176.976562 338.183594 L 18.148438 179.359375 L 151.707031 45.804688 L 264.011719 158.109375 L 169.574219 252.546875 L 90.160156 173.136719 L 156.9375 106.355469 L 213.09375 162.511719 L 165.875 209.730469 L 126.167969 170.023438 L 159.554688 136.632812 L 187.632812 164.710938 L 164.023438 188.320312 L 144.167969 168.46875 L 160.863281 151.773438 L 174.902344 165.8125 L 163.097656 177.617188 L 153.171875 167.691406 L 161.519531 159.34375 L 168.539062 166.363281 L 162.636719 172.265625 L 157.671875 167.300781 L 161.84375 163.128906 L 165.355469 166.636719 L 162.402344 169.589844 L 159.921875 167.105469 L 162.007812 165.019531";

  const createLogo = () => {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 384 383.999986");
    svg.setAttribute("width", "140");
    svg.setAttribute("height", "64");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("aria-hidden", "true");

    const defs = document.createElementNS(ns, "defs");
    const clipPath = document.createElementNS(ns, "clipPath");
    clipPath.setAttribute("id", "logo-clip");
    const clipPathShape = document.createElementNS(ns, "path");
    clipPathShape.setAttribute(
      "d",
      "M 18.128906 45.804688 L 366 45.804688 L 366 338.304688 L 18.128906 338.304688 Z M 18.128906 45.804688 "
    );
    clipPathShape.setAttribute("clip-rule", "nonzero");
    clipPath.appendChild(clipPathShape);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    const group = document.createElementNS(ns, "g");
    group.setAttribute("clip-path", "url(#logo-clip)");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", LOGO_PATH);
    path.setAttribute("fill", "currentColor");
    path.setAttribute("fill-rule", "evenodd");
    group.appendChild(path);
    svg.appendChild(group);

    return svg;
  };

  const getThemeLabel = (theme) => {
    return theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  };

  let themeIconCount = 0;
  const createThemeIcon = () => {
    themeIconCount += 1;
    const maskId = `moon-mask-${themeIconCount}`;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "sun-and-moon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", "0 0 24 24");

    const mask = document.createElementNS(ns, "mask");
    mask.setAttribute("id", maskId);
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
    sun.setAttribute("mask", `url(#${maskId})`);

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

  const buildNavLinks = (className, { idPrefix = "nav" } = {}) => {
    const navList = createElement("div", { className });
    navItems.forEach((item, index) => {
      const itemClassName = item.dropdown ? "nav-item nav-dropdown" : "nav-item";
      const itemWrapper = createElement("div", { className: itemClassName });

      if (item.dropdown) {
        const menuId = `${idPrefix}-dropdown-${index}`;
        const triggerButton = createElement("button", {
          text: item.label,
          className: "nav-link nav-dropdown__button",
          attrs: {
            type: "button",
            "aria-expanded": "false",
            "aria-controls": menuId,
          },
        });
        const trigger = createElement("div", { className: "nav-dropdown__trigger" }, [
          triggerButton,
        ]);
        const dropdownItems = item.dropdownRoot
          ? [item.dropdownRoot, ...item.dropdown]
          : item.dropdown;
        const menu = createElement(
          "div",
          {
            className: "nav-dropdown__menu",
            attrs: { id: menuId, role: "menu", "aria-hidden": "true" },
          },
          dropdownItems.map((entry) =>
            createElement("a", {
              text: entry.label,
              attrs: { href: entry.path, role: "menuitem" },
            })
          )
        );
        menu.setAttribute("hidden", "");
        itemWrapper.appendChild(trigger);
        itemWrapper.appendChild(menu);
      } else {
        const link = createElement("a", {
          text: item.label,
          className: "nav-link",
          attrs: { href: item.path, "data-route": item.path },
        });
        itemWrapper.appendChild(link);
      }

      navList.appendChild(itemWrapper);
    });
    return navList;
  };

  const getCartCount = (cart) => cart.reduce((sum, item) => sum + item.quantity, 0);

  const buildActions = (className, { withId = false } = {}) => {
    const actions = createElement("div", { className });
    const cartButton = createElement("a", {
      attrs: { href: "#/cart" },
    });

    const authButton = createElement("a");

    const themeButton = createElement(
      "button",
      {
        className: "theme-toggle",
        attrs: {
          id: withId ? "theme-toggle" : null,
          type: "button",
          "aria-label": getThemeLabel(store.getState().ui?.theme),
          "aria-live": "polite",
          title: "Toggle theme",
        },
      },
      [createThemeIcon()]
    );

    themeButton.addEventListener("click", onThemeToggle);

    actions.appendChild(cartButton);
    actions.appendChild(authButton);
    actions.appendChild(themeButton);
    return {
      element: actions,
      update(nextState) {
        cartButton.textContent = `Koszyk (${nextState.cartCount})`;
        authButton.textContent = nextState.isAuthenticated ? "Moje konto" : "Zaloguj";
        authButton.setAttribute("href", nextState.isAuthenticated ? "#/account" : "#/auth");
        themeButton.setAttribute("aria-label", getThemeLabel(nextState.theme));
      },
    };
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
    if (openDropdown) {
      const dropdownToClose = openDropdown;
      openDropdown = null;
      dropdownToClose.classList.remove("is-open");
      const toggle = dropdownToClose.querySelector(".nav-dropdown__button");
      const menu = dropdownToClose.querySelector(".nav-dropdown__menu");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
      if (menu) {
        menu.setAttribute("aria-hidden", "true");
        menu.setAttribute("hidden", "");
      }
    }
    applyMenuState({ focusOnOpen: menuOpen, restoreFocus });
  };

  const notifyHeight = () => {
    if (typeof onHeightChange === "function") {
      onHeightChange();
    }
  };

  const build = () => {
    clearElement(container);

    // --- BRAND / LOGO ---
    const logo = createLogo();
    const brandLink = createElement(
      "a",
      { attrs: { href: "#/", "aria-label": "KP_Code Digital Vault" }, className: "brand" },
      [logo]
    );

    // --- NAV ---
    const nav = createElement("nav", {
      className: "primary-nav",
      attrs: { "aria-label": "Glowna" },
    });
    nav.appendChild(buildNavLinks("nav-links", { idPrefix: "primary" }));

    // --- ACTIONS ---
    const actions = buildActions("nav-links header-actions", { withId: true });

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
      [menuIcon]
    );
    menuButton.addEventListener("click", () => setMenuOpen(!menuOpen));

    // --- MOBILE MENU ---
    const mobileActions = buildActions("nav-links mobile-action-links");

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
      [buildNavLinks("nav-links mobile-nav-links", { idPrefix: "mobile" }), mobileActions.element]
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
    container.appendChild(actions.element);
    container.appendChild(menuButton);
    container.appendChild(mobileOverlay);
    container.appendChild(mobileMenu);

    applyMenuState({ focusOnOpen: menuOpen });

    return { actions, mobileActions };
  };

  const selectHeaderState = (state) => ({
    cartCount: getCartCount(state.cart),
    isAuthenticated: Boolean(state.user),
    theme: state.ui?.theme,
  });

  const { actions, mobileActions } = build();
  const updateActions = (nextState) => {
    actions.update(nextState);
    mobileActions.update(nextState);
  };
  let previousState = selectHeaderState(store.getState());
  updateActions(previousState);
  notifyHeight();
  store.subscribe((state) => {
    const nextState = selectHeaderState(state);
    if (
      nextState.cartCount === previousState.cartCount &&
      nextState.isAuthenticated === previousState.isAuthenticated &&
      nextState.theme === previousState.theme
    ) {
      return;
    }
    updateActions(nextState);
    previousState = nextState;
  });

  const headerRoot = container.closest("header");
  const applyShrinkState = (nextShrunk) => {
    if (!headerRoot || isShrunk === nextShrunk) {
      return;
    }
    isShrunk = nextShrunk;
    headerRoot.classList.toggle("is-shrink", isShrunk);
    notifyHeight();
  };

  const handleScroll = () => {
    if (!headerRoot) {
      return;
    }
    if (scrollTicking) {
      return;
    }
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (scrollY <= 0) {
        applyShrinkState(false);
      } else if (!isShrunk && scrollY > SHRINK_THRESHOLD) {
        applyShrinkState(true);
      } else if (isShrunk && scrollY < EXPAND_THRESHOLD) {
        applyShrinkState(false);
      }
      scrollTicking = false;
    });
  };

  const setDropdownOpen = (dropdown, nextOpen, { focusToggle = false } = {}) => {
    if (!dropdown) {
      return;
    }
    const toggle = dropdown.querySelector(".nav-dropdown__button");
    const menu = dropdown.querySelector(".nav-dropdown__menu");
    if (!toggle || !menu) {
      return;
    }
    dropdown.classList.toggle("is-open", nextOpen);
    toggle.setAttribute("aria-expanded", nextOpen ? "true" : "false");
    menu.setAttribute("aria-hidden", nextOpen ? "false" : "true");
    if (nextOpen) {
      menu.removeAttribute("hidden");
      openDropdown = dropdown;
    } else {
      menu.setAttribute("hidden", "");
      if (openDropdown === dropdown) {
        openDropdown = null;
      }
      if (focusToggle) {
        toggle.focus();
      }
    }
  };

  const toggleDropdown = (dropdown) => {
    if (!dropdown) {
      return;
    }
    const isOpen = dropdown.classList.contains("is-open");
    if (isOpen) {
      setDropdownOpen(dropdown, false, { focusToggle: true });
      return;
    }
    if (openDropdown && openDropdown !== dropdown) {
      setDropdownOpen(openDropdown, false);
    }
    setDropdownOpen(dropdown, true);
  };

  const handleDropdownClick = (event) => {
    const toggle = event.target.closest(".nav-dropdown__button");
    if (toggle) {
      const dropdown = toggle.closest(".nav-dropdown");
      if (dropdown) {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown(dropdown);
      }
      return;
    }
    const menuLink = event.target.closest(".nav-dropdown__menu a");
    if (menuLink) {
      const dropdown = menuLink.closest(".nav-dropdown");
      if (dropdown) {
        setDropdownOpen(dropdown, false);
      }
    }
  };

  const handleDocumentClick = (event) => {
    if (!openDropdown) {
      return;
    }
    if (openDropdown.contains(event.target)) {
      return;
    }
    setDropdownOpen(openDropdown, false);
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      if (openDropdown) {
        const dropdownToClose = openDropdown;
        setDropdownOpen(dropdownToClose, false, { focusToggle: true });
        return;
      }
      if (menuOpen) {
        setMenuOpen(false);
      }
      return;
    }
    if (!menuOpen) {
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
    notifyHeight();
  };

  if (headerRoot && headerRoot.dataset.shrinkReady !== "true") {
    headerRoot.dataset.shrinkReady = "true";
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
  container.addEventListener("click", handleDropdownClick);
  document.addEventListener("click", handleDocumentClick);
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
