
export function initGalleryFilters() {
  const filters = document.querySelectorAll("#gallery-filters .gallery-cats__link");
  const items = document.querySelectorAll(".gallery-grid [data-cat-item]");
  const sections = document.querySelectorAll(".gallery-section");
  if (!filters.length || !items.length) return;

  function applyFilter(cat) {
    items.forEach((el) => {
      const match = cat === "all" || el.getAttribute("data-cat-item") === cat;
      el.style.display = match ? "" : "none";
    });

    if (sections.length) {
      if (cat === "all") {
        sections.forEach((section) => {
          section.style.display = "";
        });
      } else {
        sections.forEach((section) => {
          const hasMatch = section.querySelector('[data-cat-item="' + cat + '"]');
          section.style.display = hasMatch ? "" : "none";
        });
      }
    }

    document.body.dataset.galleryFilter = cat;

    filters.forEach((a) => a.removeAttribute("aria-current"));
    const active = document.querySelector('#gallery-filters .gallery-cats__link[data-filter="' + cat + '"]');
    active && active.setAttribute("aria-current", "true");
  }

  const hash = window.location.hash.replace("#", "");
  const hasFilter = (value) => document.querySelector('#gallery-filters .gallery-cats__link[data-filter="' + value + '"]');
  const initialFilter = hash === "wszystkie" ? "all" : hasFilter(hash) ? hash : "all";
  applyFilter(initialFilter);

  filters.forEach((a) => {
    a.addEventListener("click", () => {
      applyFilter(a.getAttribute("data-filter"));
    });
  });
}
