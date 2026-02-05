export const initScrollSpy = () => {
  const sections = document.querySelectorAll("[data-scroll-section]");
  const navLinks = document.querySelectorAll(".nav__link");
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute("href");
    if (id && id.startsWith("#")) {
      linkMap.set(id.substring(1), link);
    }
  });

  const setActiveLink = (activeLink) => {
    navLinks.forEach((nav) => {
      const isActive = nav === activeLink;
      nav.classList.toggle("scrollspy-active", isActive);
      if (isActive) {
        // "location" najlepiej opisuje aktywny punkt nawigacji w obrębie jednej strony.
        nav.setAttribute("aria-current", "location");
      } else {
        nav.removeAttribute("aria-current");
      }
    });
  };

  const observableSections = Array.from(sections).filter((section) =>
    section.id && linkMap.has(section.id)
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkMap.get(entry.target.id);
        if (link && entry.isIntersecting) {
          setActiveLink(link);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  observableSections.forEach((section) => observer.observe(section));

  const initialActiveSection = observableSections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
  });

  const fallbackSection = observableSections.find((section) => section.getBoundingClientRect().bottom > 0);

  setActiveLink(linkMap.get((initialActiveSection || fallbackSection)?.id));
};
