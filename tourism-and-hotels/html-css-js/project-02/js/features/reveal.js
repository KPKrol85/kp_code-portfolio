const SELECTORS = ['.hero', '.section', '.tour-card', '.feature-card', '.cta', '.page-hero', '.testimonials'];

export function initReveal() {
  const elements = [...document.querySelectorAll(SELECTORS.join(","))].filter((el) => !el.matches('[aria-label="Lista wycieczek"]'));

  if (!elements.length || !('IntersectionObserver' in window)) return;

  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
