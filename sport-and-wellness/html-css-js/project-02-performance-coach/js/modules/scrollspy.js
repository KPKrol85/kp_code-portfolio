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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkMap.get(entry.target.id);
        if (link) {
          if (entry.isIntersecting) {
            navLinks.forEach((nav) => nav.classList.remove("scrollspy-active"));
            link.classList.add("scrollspy-active");
          }
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  sections.forEach((section) => observer.observe(section));
};
