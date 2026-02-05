import { initReveal } from "./modules/reveal.js";
import { initHeaderShrink } from "./modules/headerShrink.js";
import { initMobileNav } from "./modules/mobileNav.js";
import { initScheduleFilter } from "./modules/scheduleFilter.js";
import { initThemeToggle } from "./modules/themeToggle.js";

initReveal();
initHeaderShrink();
initMobileNav();
initScheduleFilter();
initThemeToggle();

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav__link");

if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.6 }
  );

  sections.forEach((section) => observer.observe(section));
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
