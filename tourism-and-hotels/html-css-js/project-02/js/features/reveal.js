// assets/js/features/reveal.js

const SELECTORS = [
  ".hero",
  ".section",
  ".tour-card",
  ".feature-card",
  ".cta",
  ".page-hero",
  ".testimonials",
  ".gallery-grid figure", // ← KAŻDY <figure> z galerii osobno
];

export function initReveal() {
  // Bierzemy wszystkie elementy z SELECTORS
  let elements = Array.from(document.querySelectorAll(SELECTORS.join(",")));

  // Wywalamy sekcję z listą wycieczek i sekcję galerii,
  // żeby CAŁE sekcje nie miały revala – chcemy tylko karty / figure
  elements = elements.filter((el) => {
    const ariaLabel = el.getAttribute("aria-label");
    return ariaLabel !== "Lista wycieczek" && ariaLabel !== "Galeria zdjęć";
  });

  if (!elements.length || !("IntersectionObserver" in window)) return;

  // Dodajemy klasę .reveal startowo
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
      rootMargin: "0px 0px -20px 0px", // szybciej łapie element w widoku
    }
  );

  elements.forEach((el) => observer.observe(el));
}
