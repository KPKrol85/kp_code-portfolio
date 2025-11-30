// Filters fleet cards based on data attributes
export function initGalleryFilters() {
  const chips = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll("#fleet-grid [data-type]");
  if (!chips.length || !items.length) return;

  const applyFilters = (filter) => {
    items.forEach((item) => {
      const match = filter === "all" || item.dataset.type === filter || item.dataset.purpose === filter;
      item.style.display = match ? "grid" : "none";
    });
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      applyFilters(chip.dataset.filter);
    });
  });

  applyFilters("all");
}
