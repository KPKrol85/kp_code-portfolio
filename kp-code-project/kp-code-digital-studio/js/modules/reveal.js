/*
 * Scroll-reveal behavior for sections marked with data attributes.
 */

export const initReveal = () => {
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!revealElements.length || !("IntersectionObserver" in window)) {
    return;
  }

  const isMobileReveal = window.matchMedia("(max-width: 767px)").matches;
  const revealOptions = {
    rootMargin: isMobileReveal ? "0px 0px 30% 0px" : "0px 0px 15% 0px",
    threshold: isMobileReveal ? 0.08 : 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("reveal", "is-visible");
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
};
