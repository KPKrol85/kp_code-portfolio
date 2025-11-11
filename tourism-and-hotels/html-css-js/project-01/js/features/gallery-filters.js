// js/features/gallery-filters.js
// Filtrowanie kategorii w galerii zdjęć

export function initGalleryFilters() {
  const filters = document.querySelectorAll("#gallery-filters .gallery-cats__link");
  const items = document.querySelectorAll(".gallery-grid [data-cat-item]");
  if (!filters.length || !items.length) return;

  function applyFilter(cat) {
    items.forEach((el) => {
      const match = cat === "all" || el.getAttribute("data-cat-item") === cat;
      el.style.display = match ? "" : "none";
    });

    filters.forEach((a) => a.removeAttribute("aria-current"));
    const active = document.querySelector('#gallery-filters .gallery-cats__link[data-filter="' + cat + '"]');
    active && active.setAttribute("aria-current", "true");
  }

  // Start domyślnie od "wszystkie"
  applyFilter("all");

  filters.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter(a.getAttribute("data-filter"));
      document.getElementById("gallery-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
