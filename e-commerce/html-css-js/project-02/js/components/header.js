import { createElement, clearElement } from "../utils/dom.js";
import { store } from "../store/store.js";
import { authService } from "../services/auth.js";
import { navigateHash } from "../utils/navigation.js";
import { showToast } from "./toast.js";
import { content } from "../content/pl.js";

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
    dropdownRoot: { label: "Wszystkie usługi", path: "#/services" },
    dropdown: [
      { label: "Web Development", path: "#/services/web-development" },
      { label: "WordPress Solutions", path: "#/services/wordpress" },
      { label: "UI / UX & Branding", path: "#/services/ui-ux-branding" },
      { label: "Consulting & Support", path: "#/services/consulting-support" },
    ],
  },
  { label: "Kontakt", path: "#/contact" },
];

const LOGO_SOURCES = {
  light: "/assets/logo/logo-light-mode.svg",
  dark: "/assets/logo/logo-dark-mode.svg",
};
const LOGO_WIDTH = 140;
const LOGO_HEIGHT = 64;

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

  const getLogoSrc = (theme) => (theme === "dark" ? LOGO_SOURCES.dark : LOGO_SOURCES.light);

  const createLogoImage = (theme) =>
    createElement("img", {
      attrs: {
        src: getLogoSrc(theme),
        alt: "KP_Code Digital Vault",
        width: String(LOGO_WIDTH),
        height: String(LOGO_HEIGHT),
      },
    });

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

  const updateDropdownMenu = (menu, items) => {
    clearElement(menu);
    items.forEach((entry) => {
      const link = createElement("a", {
        text: entry.label,
        attrs: {
          href: entry.path,
          "data-action": entry.action || null,
        },
      });
      menu.appendChild(link);
    });
  };

  const buildDropdown = ({ label, menuId, items }) => {
    const itemWrapper = createElement("div", { className: "nav-item nav-dropdown" });
    const triggerButton = createElement("button", {
      text: label,
      className: "nav-link nav-dropdown__button",
      attrs: {
        type: "button",
        "aria-expanded": "false",
        "aria-controls": menuId,
      },
    });
    const trigger = createElement("div", { className: "nav-dropdown__trigger" }, [triggerButton]);
    const menu = createElement("div", {
      className: "nav-dropdown__menu",
      attrs: { id: menuId, "aria-hidden": "true" },
    });
    menu.setAttribute("hidden", "");
    if (items?.length) {
      updateDropdownMenu(menu, items);
    }
    itemWrapper.appendChild(trigger);
    itemWrapper.appendChild(menu);
    return { itemWrapper, menu, triggerButton };
  };

  const buildNavLinks = (className, { idPrefix = "nav" } = {}) => {
    const navList = createElement("div", { className });
    navItems.forEach((item, index) => {
      if (item.dropdown) {
        const dropdownItems = item.dropdownRoot
          ? [item.dropdownRoot, ...item.dropdown]
          : item.dropdown;
        const { itemWrapper } = buildDropdown({
          label: item.label,
          menuId: `${idPrefix}-dropdown-${index}`,
          items: dropdownItems,
        });
        navList.appendChild(itemWrapper);
        return;
      }

      const itemWrapper = createElement("div", { className: "nav-item" });
      const link = createElement("a", {
        text: item.label,
        className: "nav-link",
        attrs: { href: item.path, "data-route": item.path },
      });
      itemWrapper.appendChild(link);
      navList.appendChild(itemWrapper);
    });
    return navList;
  };

  const getCartCount = (cart) => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getAccountItems = (isAuthenticated) => {
    if (!isAuthenticated) {
      return [
        { label: "Zaloguj", path: "#/auth" },
        { label: "Rejestracja", path: "#/auth" },
        { label: "Demo konta", path: "#/account" },
      ];
    }
    return [
      { label: "Panel konta", path: "#/account" },
      { label: "Biblioteka", path: "#/library" },
      { label: "Licencje", path: "#/licenses" },
      { label: "Ustawienia", path: "#/settings" },
      { label: "Wyloguj", path: "#/auth", action: "logout" },
    ];
  };

  const buildActions = (className, { withId = false } = {}) => {
    const actions = createElement("div", { className });
    const cartButton = createElement("a", {
      text: `Koszyk (${getCartCount(store.getState().cart)})`,
      attrs: { href: "#/cart" },
    });

    const accountDropdown = buildDropdown({
      label: "Konto",
      menuId: `${withId ? "header" : "mobile"}-account-dropdown`,
      items: getAccountItems(Boolean(store.getState().user)),
    });

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
    actions.appendChild(accountDropdown.itemWrapper);
    actions.appendChild(themeButton);
    return {
      element: actions,
      update(nextState) {
        cartButton.textContent = `Koszyk (${nextState.cartCount})`;
        updateDropdownMenu(accountDropdown.menu, getAccountItems(nextState.isAuthenticated));
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
    const logo = createLogoImage(store.getState().ui?.theme);
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

    return { actions, mobileActions, logo };
  };

  const selectHeaderState = (state) => ({
    cartCount: getCartCount(state.cart),
    isAuthenticated: Boolean(state.user),
    theme: state.ui?.theme,
  });

  const { actions, mobileActions, logo } = build();
  const updateLogo = (theme) => {
    const nextSrc = getLogoSrc(theme);
    if (logo && logo.getAttribute("src") !== nextSrc) {
      logo.setAttribute("src", nextSrc);
    }
  };
  const updateActions = (nextState) => {
    actions.update(nextState);
    mobileActions.update(nextState);
    updateLogo(nextState.theme);
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

  const getFirstFocusableLink = (menu) => {
    if (!menu) {
      return null;
    }
    return menu.querySelector("a[href]");
  };

  const openDropdownMenu = (dropdown, { focusFirstLink = false } = {}) => {
    if (!dropdown) {
      return;
    }
    const menu = dropdown.querySelector(".nav-dropdown__menu");
    setDropdownOpen(dropdown, true);
    if (focusFirstLink && menu) {
      const firstLink = getFirstFocusableLink(menu);
      if (firstLink) {
        firstLink.focus();
      }
    }
  };

  const closeDropdownMenu = (dropdown, { focusToggle = false } = {}) => {
    setDropdownOpen(dropdown, false, { focusToggle });
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
      closeDropdownMenu(dropdown, { focusToggle: true });
      return;
    }
    if (openDropdown && openDropdown !== dropdown) {
      closeDropdownMenu(openDropdown);
    }
    openDropdownMenu(dropdown);
  };

  const handleDropdownClick = (event) => {
    const toggle = event.target.closest(".nav-dropdown__button");
    if (toggle) {
      if (toggle.dataset.ignoreClick === "true") {
        delete toggle.dataset.ignoreClick;
        return;
      }
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
        if (menuLink.dataset.action === "logout") {
          event.preventDefault();
          authService.signOut();
          showToast(content.toasts.logout);
          navigateHash("#/auth");
        }
        closeDropdownMenu(dropdown);
        if (menuOpen) {
          setMenuOpen(false, { restoreFocus: false });
        }
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
    closeDropdownMenu(openDropdown);
  };

  const handleDropdownKeydown = (event) => {
    const toggle = event.target.closest(".nav-dropdown__button");
    if (toggle) {
      const dropdown = toggle.closest(".nav-dropdown");
      if (!dropdown) {
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        if (openDropdown && openDropdown !== dropdown) {
          closeDropdownMenu(openDropdown);
        }
        openDropdownMenu(dropdown, { focusFirstLink: true });
        return;
      }
      if (event.key === "Escape") {
        if (dropdown.classList.contains("is-open")) {
          event.preventDefault();
          closeDropdownMenu(dropdown, { focusToggle: true });
        }
        return;
      }
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        toggle.dataset.ignoreClick = "true";
        if (dropdown.classList.contains("is-open")) {
          closeDropdownMenu(dropdown, { focusToggle: true });
        } else {
          if (openDropdown && openDropdown !== dropdown) {
            closeDropdownMenu(openDropdown);
          }
          openDropdownMenu(dropdown, { focusFirstLink: true });
        }
      }
      return;
    }

    const menuLink = event.target.closest(".nav-dropdown__menu a");
    if (menuLink && event.key === "Escape") {
      const dropdown = menuLink.closest(".nav-dropdown");
      if (dropdown) {
        event.preventDefault();
        closeDropdownMenu(dropdown, { focusToggle: true });
      }
    }
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      if (openDropdown) {
        const dropdownToClose = openDropdown;
        closeDropdownMenu(dropdownToClose, { focusToggle: true });
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
  container.addEventListener("keydown", handleDropdownKeydown);
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
