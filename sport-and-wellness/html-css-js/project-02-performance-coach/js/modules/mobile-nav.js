export const initMobileNav = () => {
  const toggle = document.querySelector(".header__toggle");
  const nav = document.querySelector(".nav");
  const page = document.querySelector(".page");
  if (!toggle || !nav || !page) return;

  const links = nav.querySelectorAll("a");
  let scrollY = 0;

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

  const closeNav = ({ returnFocus = false } = {}) => {
    if (!nav.classList.contains("nav--open")) return;
    nav.classList.remove("nav--open");
    toggle.setAttribute("aria-expanded", "false");
    unlockScroll();
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      lockScroll();
      links[0]?.focus();
      return;
    }
    unlockScroll();
  });

  links.forEach((link) => link.addEventListener("click", () => closeNav()));

  nav.addEventListener("click", (event) => {
    if (event.target === nav) {
      closeNav({ returnFocus: true });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav({ returnFocus: true });
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeNav();
    }
  });
};
