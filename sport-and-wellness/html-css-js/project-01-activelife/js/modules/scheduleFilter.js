export function initScheduleFilter() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".schedule-card");

  if (!buttons.length || !cards.length) return;

  const setActive = (button) => {
    buttons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");
  };

  const filterCards = (filter) => {
    cards.forEach((card) => {
      const category = card.dataset.category;
      const isVisible = filter === "all" || filter === category;
      card.style.display = isVisible ? "flex" : "none";
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      setActive(button);
      filterCards(filter);
    });
  });
}
