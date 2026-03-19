/*
 * Mobile navigation, focus management, and header shrink behavior.
 */

export const initNavigation = () => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navBackdrop = document.querySelector("[data-nav-backdrop]");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelector(".nav__links");
  const navDesktopQuery = window.matchMedia("(min-width: 1024px)");

  const getFocusableNavItems = () => {
    if (!navLinks) {
      return [];
    }

    return Array.from(navLinks.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => element.getClientRects().length);
  };

  const setNavAria = (isOpen) => {
    if (!navToggle || !navLinks) {
      return;
    }

    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Zamknij menu" : "Otwórz menu");
    navLinks.setAttribute("aria-hidden", isOpen ? "false" : "true");
  };

  const closeNav = (returnFocus = true) => {
    if (!nav || !navLinks || !navToggle) {
      return;
    }

    if (!nav.classList.contains("nav--open")) {
      setNavAria(false);
      document.body.classList.remove("nav-open");
      return;
    }

    nav.classList.remove("nav--open");
    document.body.classList.remove("nav-open");
    setNavAria(false);
    document.removeEventListener("keydown", handleNavKeydown);

    if (returnFocus) {
      navToggle.focus();
    }
  };

  const handleNavKeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeNav();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusableNavItems();
    if (!focusable.length || !navLinks) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!navLinks.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const openNav = () => {
    if (!nav || !navLinks || !navToggle || navDesktopQuery.matches) {
      return;
    }

    if (nav.classList.contains("nav--open")) {
      return;
    }

    nav.classList.add("nav--open");
    document.body.classList.add("nav-open");
    setNavAria(true);
    document.addEventListener("keydown", handleNavKeydown);

    requestAnimationFrame(() => {
      const focusTarget = navLinks.querySelector(".nav__link");
      focusTarget?.focus();
    });
  };

  const syncNavToViewport = () => {
    if (!navLinks) {
      return;
    }

    if (navDesktopQuery.matches) {
      closeNav(false);
      navLinks.removeAttribute("aria-hidden");
      return;
    }

    const isOpen = nav?.classList.contains("nav--open");
    navLinks.setAttribute("aria-hidden", isOpen ? "false" : "true");
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      if (nav?.classList.contains("nav--open")) {
        closeNav();
        return;
      }

      openNav();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", () => closeNav());
  }

  if (navLinks) {
    navLinks.addEventListener("click", (event) => {
      const link = event.target.closest(".nav__link");
      if (link && !navDesktopQuery.matches) {
        closeNav();
      }
    });
  }

  syncNavToViewport();
  navDesktopQuery.addEventListener("change", syncNavToViewport);

  const header = document.querySelector(".header");
  if (!header) {
    return;
  }

  const enter = 18;
  const exit = 8;
  let isShrink = false;
  let ticking = false;

  const applyHeaderState = () => {
    ticking = false;
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY <= 0) {
      if (isShrink) {
        isShrink = false;
        header.classList.remove("is-shrink");
      }
      return;
    }

    if (!isShrink && scrollY >= enter) {
      isShrink = true;
      header.classList.add("is-shrink");
      return;
    }

    if (isShrink && scrollY <= exit) {
      isShrink = false;
      header.classList.remove("is-shrink");
    }
  };

  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(applyHeaderState);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  applyHeaderState();
};
