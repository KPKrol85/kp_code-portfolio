/*
 * Project grid filtering on the portfolio page.
 */

export const initProjectFilter = () => {
  const filterWrapper = document.querySelector(".project-filters");
  const projectGrid = document.querySelector("[data-project-grid]");
  if (!filterWrapper || !projectGrid) {
    return;
  }

  const filterButtons = Array.from(filterWrapper.querySelectorAll("[data-filter]"));
  if (!filterButtons.length) {
    return;
  }

  const items = Array.from(projectGrid.querySelectorAll("[data-category]"));

  const setActiveFilter = (filterKey) => {
    filterButtons.forEach((button) => {
      const isActive = button.getAttribute("data-filter") === filterKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    items.forEach((item) => {
      const categoryTokens = (item.getAttribute("data-category") || "")
        .split(/\s+/)
        .filter(Boolean);
      const visible = filterKey === "all" || categoryTokens.includes(filterKey);
      item.hidden = !visible;
    });
  };

  const defaultButton =
    filterButtons.find((button) => button.classList.contains("is-active"))
    ?? filterButtons.find((button) => button.getAttribute("data-filter") === "all")
    ?? filterButtons[0];

  if (defaultButton) {
    setActiveFilter(defaultButton.getAttribute("data-filter"));
  }

  filterWrapper.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button || !filterWrapper.contains(button)) {
      return;
    }

    setActiveFilter(button.getAttribute("data-filter"));
  });
};
