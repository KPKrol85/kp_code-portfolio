const focusableSelectors = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
];

function getFocusableElements(container) {
  if (!container) return [];
  return [...container.querySelectorAll(focusableSelectors.join(","))].filter((element) => {
    if (element.hasAttribute("disabled")) return false;
    if (element.getAttribute("aria-hidden") === "true") return false;
    return element.offsetParent !== null || element === document.activeElement;
  });
}

const mobileNavNoop = () => {};
const supportsInert = "inert" in HTMLElement.prototype;
let destroyMobileNav = mobileNavNoop;
let isMobileNavInitialized = false;

export function initMobileNav() {
  if (isMobileNavInitialized) {
    return destroyMobileNav;
  }

  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-mobile-nav]");
  const closeBtn = document.querySelector("[data-nav-close]");
  const navList = nav?.querySelector(".mobile-nav__list") || nav;
  const desktopQuery = window.matchMedia("(min-width: 700px)");
  let desktopQueryListenerMode = null;

  if (!toggle || !nav || !closeBtn || !navList) {
    destroyMobileNav = mobileNavNoop;
    return destroyMobileNav;
  }

  const ac = new AbortController();
  const { signal } = ac;
  let isOpen = false;
  let lastFocused = null;
  let isBodyScrollLocked = false;
  let previousBodyOverflow = "";
  let previousBodyPaddingRight = "";
  const backgroundState = new Map();

  const collectBackgroundElements = () => {
    const result = [];
    const seen = new Set();

    const addElement = (element) => {
      if (!element || seen.has(element) || element === nav || nav.contains(element) || element.contains(nav)) return;
      seen.add(element);
      result.push(element);
    };

    const bodyChildren = [...document.body.children];
    bodyChildren.forEach(addElement);

    const header = nav.closest("header");
    if (header) {
      [...header.children].forEach(addElement);
    }

    return result;
  };

  const hideBackgroundFromAssistiveTech = () => {
    backgroundState.clear();
    collectBackgroundElements().forEach((element) => {
      backgroundState.set(element, {
        ariaHidden: element.getAttribute("aria-hidden"),
        inert: supportsInert ? element.inert : null
      });
      element.setAttribute("aria-hidden", "true");
      if (supportsInert) {
        element.inert = true;
      }
    });
  };

  const restoreBackgroundForAssistiveTech = () => {
    backgroundState.forEach((previousState, element) => {
      if (previousState.ariaHidden === null) {
        element.removeAttribute("aria-hidden");
      } else {
        element.setAttribute("aria-hidden", previousState.ariaHidden);
      }

      if (supportsInert && previousState.inert !== null) {
        element.inert = previousState.inert;
      }
    });
    backgroundState.clear();
  };

  const lockBodyScroll = () => {
    if (isBodyScrollLocked) return;

    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.paddingRight = previousBodyPaddingRight;
    }

    isBodyScrollLocked = true;
  };

  const unlockBodyScroll = () => {
    if (!isBodyScrollLocked) return;

    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPaddingRight;

    isBodyScrollLocked = false;
  };

  const focusInitialElement = () => {
    const focusable = getFocusableElements(nav);
    if (focusable.length) {
      focusable[0].focus();
      return;
    }

    nav.focus();
  };

  const openNav = () => {
    if (isOpen) return;

    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
    nav.hidden = false;
    if (supportsInert) {
      nav.inert = false;
    }
    toggle.setAttribute("aria-expanded", "true");

    lockBodyScroll();
    hideBackgroundFromAssistiveTech();
    focusInitialElement();

    isOpen = true;
  };

  const closeNav = ({ restoreFocus = true } = {}) => {
    if (!isOpen && nav.hidden) return;

    if (supportsInert) {
      nav.inert = true;
    }
    nav.hidden = true;
    toggle.setAttribute("aria-expanded", "false");

    unlockBodyScroll();
    restoreBackgroundForAssistiveTech();

    isOpen = false;

    if (restoreFocus) {
      const focusTarget = lastFocused && document.contains(lastFocused) ? lastFocused : toggle;
      focusTarget.focus();
    }
  };

  const syncViewportState = () => {
    if (desktopQuery.matches) {
      closeNav({ restoreFocus: false });
      return;
    }

    if (supportsInert) {
      nav.inert = nav.hidden;
    }
  };

  const trapFocus = (event) => {
    if (!isOpen || nav.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeNav();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(nav);
    if (!focusable.length) {
      event.preventDefault();
      nav.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!nav.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onToggleClick = () => {
    if (isOpen) {
      closeNav();
      return;
    }

    openNav();
  };

  toggle.addEventListener("click", onToggleClick, { signal });
  closeBtn.addEventListener("click", () => closeNav(), { signal });

  nav.addEventListener(
    "click",
    (event) => {
      if (event.target === nav) {
        closeNav();
      }
    },
    { signal }
  );

  document.addEventListener("keydown", trapFocus, { signal });

  navList.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest("a[href]");
      if (!link || !navList.contains(link)) {
        return;
      }

      if (link.target === "_blank") {
        return;
      }

      closeNav();
    },
    { signal }
  );

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", syncViewportState, { signal });
    desktopQueryListenerMode = "event";
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(syncViewportState);
    desktopQueryListenerMode = "listener";
  }
  syncViewportState();

  nav.dataset.initialized = "true";

  isMobileNavInitialized = true;

  destroyMobileNav = () => {
    if (desktopQueryListenerMode === "listener" && desktopQuery.removeListener) {
      desktopQuery.removeListener(syncViewportState);
    }

    ac.abort();
    closeNav({ restoreFocus: false });
    nav.dataset.initialized = "false";
    lastFocused = null;
    isMobileNavInitialized = false;
    destroyMobileNav = mobileNavNoop;
  };

  return destroyMobileNav;
}
