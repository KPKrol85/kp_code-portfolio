const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

export const initMobileNav = () => {
  const toggle = document.querySelector(".header__toggle");
  const nav = document.querySelector(".nav");
  const page = document.querySelector(".page");
  const overlay = document.querySelector(".nav-overlay");

  if (!toggle || !nav || !page || !overlay) return;

  const links = nav.querySelectorAll("a");
  const desktopMedia = window.matchMedia("(min-width: 768px)");
  let scrollY = 0;
  let lastFocusedElement = null;

  const isDesktop = () => desktopMedia.matches;

  const getFocusableElements = () =>
    [...nav.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
      (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true"
    );

  const lockScroll = () => {
    scrollY = window.scrollY;
    page.classList.add("nav-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    page.classList.remove("nav-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY);
  };

  const setMobileA11yState = (isOpen) => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    nav.setAttribute("aria-hidden", String(!isOpen));
    nav.hidden = !isOpen;
    overlay.setAttribute("aria-hidden", String(!isOpen));
    overlay.hidden = !isOpen;

    if (isOpen) {
      nav.setAttribute("role", "dialog");
      nav.setAttribute("aria-modal", "true");
      return;
    }

    nav.removeAttribute("aria-modal");
    nav.removeAttribute("role");
  };

  const openNav = () => {
    if (isDesktop() || nav.classList.contains("nav--open")) return;

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : toggle;
    setMobileA11yState(true);
    nav.classList.add("nav--open");
    overlay.classList.add("nav-overlay--visible");
    lockScroll();

    const [firstFocusable] = getFocusableElements();
    (firstFocusable || nav).focus();
  };

  const closeNav = ({ returnFocus = false } = {}) => {
    if (!nav.classList.contains("nav--open")) return;

    nav.classList.remove("nav--open");
    overlay.classList.remove("nav-overlay--visible");
    setMobileA11yState(false);
    unlockScroll();

    if (!returnFocus) return;

    if (lastFocusedElement instanceof HTMLElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
      return;
    }

    toggle.focus();
  };

  const handleKeydown = (event) => {
    if (!nav.classList.contains("nav--open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeNav({ returnFocus: true });
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      nav.focus();
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === firstFocusable || !nav.contains(activeElement)) {
        event.preventDefault();
        lastFocusable.focus();
      }
      return;
    }

    if (activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  };

  const syncWithViewport = () => {
    if (isDesktop()) {
      closeNav();
      nav.hidden = false;
      nav.removeAttribute("aria-hidden");
      nav.removeAttribute("aria-modal");
      nav.removeAttribute("role");
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      return;
    }

    setMobileA11yState(nav.classList.contains("nav--open"));
  };

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("nav--open")) {
      closeNav({ returnFocus: true });
      return;
    }

    openNav();
  });

  links.forEach((link) => link.addEventListener("click", () => closeNav({ returnFocus: true })));
  overlay.addEventListener("click", () => closeNav({ returnFocus: true }));
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", syncWithViewport);

  syncWithViewport();
};
