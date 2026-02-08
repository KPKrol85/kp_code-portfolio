const scheduleFilterNoop = () => {};

let isScheduleFilterInitialized = false;
let destroyScheduleFilter = scheduleFilterNoop;

export function initScheduleFilter() {
  if (isScheduleFilterInitialized) {
    return destroyScheduleFilter;
  }

  const filtersContainer = document.querySelector(".schedule__filters");
  const buttons = Array.from(filtersContainer?.querySelectorAll("button[data-filter]") || []);
  const cards = Array.from(document.querySelectorAll(".schedule-card"));
  const resultsContainer = document.getElementById("schedule-results");
  const resultsCount = document.getElementById("schedule-results-count");
  const liveStatus = document.getElementById("schedule-status");

  if (!filtersContainer || !buttons.length || !cards.length) {
    destroyScheduleFilter = scheduleFilterNoop;
    return destroyScheduleFilter;
  }

  const ac = new AbortController();
  const { signal } = ac;

  const getFilterLabel = (button) => button?.textContent?.trim() || "Wszystko";

  const setActive = (activeButton) => {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));

      if (resultsContainer?.id) {
        button.setAttribute("aria-controls", resultsContainer.id);
      }
    });
  };

  const setCardVisibility = (card, isVisible) => {
    if (isVisible) {
      card.removeAttribute("hidden");
      card.removeAttribute("aria-hidden");
      return;
    }

    card.setAttribute("hidden", "");
    card.setAttribute("aria-hidden", "true");
  };

  const updateStatus = (visibleCount, filterLabel) => {
    const countText = `Wyniki: ${visibleCount}`;
    const statusText = `Pokazywanie ${visibleCount} wyników dla filtra ${filterLabel}.`;

    if (resultsCount) {
      resultsCount.textContent = countText;
    }

    if (liveStatus) {
      liveStatus.textContent = statusText;
    }
  };

  const filterCards = (filter, filterLabel) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category;
      const isVisible = filter === "all" || filter === category;

      setCardVisibility(card, isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    updateStatus(visibleCount, filterLabel);
  };

  const activeButton =
    buttons.find((button) => button.classList.contains("is-active")) || buttons[0];

  setActive(activeButton);
  filterCards(activeButton.dataset.filter || "all", getFilterLabel(activeButton));

  filtersContainer.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button || !filtersContainer.contains(button)) {
        return;
      }

      const filter = button.dataset.filter || "all";
      const filterLabel = getFilterLabel(button);

      setActive(button);
      filterCards(filter, filterLabel);
    },
    { signal }
  );

  isScheduleFilterInitialized = true;

  destroyScheduleFilter = () => {
    ac.abort();
    buttons.forEach((button, index) => {
      const isDefault = index === 0;
      button.classList.toggle("is-active", isDefault);
      button.setAttribute("aria-pressed", String(isDefault));
      if (resultsContainer?.id) {
        button.setAttribute("aria-controls", resultsContainer.id);
      }
    });

    cards.forEach((card) => {
      card.removeAttribute("hidden");
      card.removeAttribute("aria-hidden");
    });

    updateStatus(cards.length, getFilterLabel(buttons[0]));

    isScheduleFilterInitialized = false;
    destroyScheduleFilter = scheduleFilterNoop;
  };

  return destroyScheduleFilter;
}
