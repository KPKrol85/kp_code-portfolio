export function initTreatmentFilter() {
  const filter = document.querySelector("[data-treatment-filter]");
  const cards = document.querySelectorAll("[data-treatment-card]");

  if (!filter || cards.length === 0) {
    return;
  }

  filter.addEventListener("change", () => {
    const value = filter.value;
    cards.forEach((card) => {
      const category = card.getAttribute("data-category");
      const show = value === "all" || value === category;
      card.hidden = !show;
    });
  });
}
