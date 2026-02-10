const SELECTORS = [".hero", ".section", ".tour-card", ".feature-card", ".cta", ".page-hero", ".testimonials", ".gallery-grid figure"];

export function initReveal() {
  let elements = Array.from(document.querySelectorAll(SELECTORS.join(",")));
  elements = elements.filter((el) => {
    const ariaLabel = el.getAttribute("aria-label");
    return ariaLabel !== "Lista wycieczek" && ariaLabel !== "Galeria zdjęć";
  });

  if (!elements.length || !("IntersectionObserver" in window)) return;

  elements.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -20px 0px",
    },
  );

  elements.forEach((el) => observer.observe(el));
}
