import { initReveal } from "./modules/reveal.js";
import { initHeaderShrink } from "./modules/headerShrink.js";
import { initMobileNav } from "./modules/mobileNav.js";
import { initScheduleFilter } from "./modules/scheduleFilter.js";
import { initThemeToggle } from "./modules/themeToggle.js";

document.documentElement.classList.add("js");

initReveal();
initThemeToggle();

function initActiveSection() {
  const navLinks = Array.from(document.querySelectorAll(".nav__link[href^='#']"));

  if (!navLinks.length) {
    return () => {};
  }

  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id) {
        return null;
      }

      const section = document.getElementById(id);
      return section ? { id, section } : null;
    })
    .filter(Boolean);

  if (!sections.length) {
    return () => {};
  }

  const linksById = new Map(navLinks.map((link) => [link.getAttribute("href")?.slice(1), link]));
  let activeId = null;

  const setActiveLink = (nextId) => {
    if (!nextId || nextId === activeId) {
      return;
    }

    activeId = nextId;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${nextId}`);
    });
  };

  const controller = new AbortController();
  const { signal } = controller;

  const getClosestSectionToLine = ({ hysteresisPx = 0, fallbackToClosest = true } = {}) => {
    const activationLine = window.innerHeight * 0.38;
    let bestId = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    sections.forEach(({ id, section }) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top - activationLine);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestId = id;
      }
    });

    if (activeId) {
      const activeSection = sections.find(({ id }) => id === activeId)?.section;

      if (activeSection) {
        const activeDistance = Math.abs(activeSection.getBoundingClientRect().top - activationLine);
        if (bestId !== activeId && bestDistance >= activeDistance - hysteresisPx) {
          return activeId;
        }

        if (!fallbackToClosest && activeDistance <= hysteresisPx) {
          return activeId;
        }
      }
    }

    return bestId;
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingEntries = entries.filter((entry) => entry.isIntersecting);

        if (!intersectingEntries.length) {
          return;
        }

        const activationLine = window.innerHeight * 0.38;
        const bestEntry = intersectingEntries.reduce((best, current) => {
          const bestDistance = Math.abs(best.boundingClientRect.top - activationLine);
          const currentDistance = Math.abs(current.boundingClientRect.top - activationLine);

          if (currentDistance < bestDistance) {
            return current;
          }

          if (currentDistance === bestDistance && current.intersectionRatio > best.intersectionRatio) {
            return current;
          }

          return best;
        });

        const nextId = bestEntry.target.getAttribute("id");

        if (!nextId || !linksById.has(nextId)) {
          return;
        }

        const stabilizedId =
          activeId && nextId !== activeId
            ? getClosestSectionToLine({ hysteresisPx: window.innerHeight * 0.08 })
            : nextId;

        setActiveLink(stabilizedId || nextId);
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-20% 0px -45% 0px"
      }
    );

    sections.forEach(({ section }) => observer.observe(section));
    setActiveLink(getClosestSectionToLine());

    return () => {
      observer.disconnect();
      controller.abort();
    };
  }

  let ticking = false;
  const scheduleUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      const nextId = getClosestSectionToLine({ hysteresisPx: window.innerHeight * 0.08 });
      setActiveLink(nextId);
      ticking = false;
    });
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true, signal });
  window.addEventListener("resize", scheduleUpdate, { passive: true, signal });
  scheduleUpdate();

  return () => {
    controller.abort();
  };
}

const moduleInitializers = [initHeaderShrink, initMobileNav, initScheduleFilter, initActiveSection];
const destroys = [];

export function destroyAll() {
  while (destroys.length) {
    const destroy = destroys.pop();
    if (typeof destroy === "function") {
      destroy();
    }
  }
}

export function initAll() {
  destroyAll();
  moduleInitializers.forEach((initModule) => {
    const destroy = initModule();
    destroys.push(typeof destroy === "function" ? destroy : () => {});
  });
}

initAll();

window.initAll = initAll;
window.destroyAll = destroyAll;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
