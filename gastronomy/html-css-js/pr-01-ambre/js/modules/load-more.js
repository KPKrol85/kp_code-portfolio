import { log } from "./utils.js";

const DEFAULT_STEP = 12;

const updateStatus = (status, visible, total) => {
  if (!status) return;
  status.textContent = `Załadowano ${visible} z ${total}`;
};

const finalizeButton = (button) => {
  if (!button) return;
  button.disabled = true;
  button.textContent = "Wszystko załadowane";
};

const ensureButton = (button) => {
  if (!button) return;
  button.disabled = false;
};

export function initLoadMoreMenu() {
  const grid = document.querySelector(".menu__grid, .menu-grid");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".dish"));
  if (!items.length) return;

  const container = grid.closest("section") || grid.parentElement || document;
  const button = container.querySelector("[data-load-more]");
  const status = container.querySelector("[data-load-status]");
  if (!button) return;

  let visibleCount = Math.min(DEFAULT_STEP, items.length);

  const getActiveFilter = () => {
    const active = container.querySelector(".tabs__tab.tabs__tab--active") ||
      container.querySelector(".tabs__tab[aria-selected='true']");
    return active?.dataset.filter || "all";
  };

  const apply = () => {
    const filter = getActiveFilter();
    items.forEach((item, index) => {
      const loaded = index < visibleCount;
      item.dataset.loadHidden = loaded ? "false" : "true";
      const matches = filter === "all" || item.dataset.cat === filter;
      item.hidden = !(loaded && matches);
    });

    updateStatus(status, Math.min(visibleCount, items.length), items.length);

    if (visibleCount >= items.length) {
      finalizeButton(button);
    } else {
      ensureButton(button);
    }
  };

  apply();

  button.addEventListener("click", () => {
    visibleCount = Math.min(visibleCount + DEFAULT_STEP, items.length);
    apply();
  });

  log(items.length);
}

export function initLoadMoreGallery() {
  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".g-item"));
  if (!items.length) return;

  const container = grid.closest("section") || grid.parentElement || document;
  const button = container.querySelector("[data-load-more]");
  const status = container.querySelector("[data-load-status]");
  if (!button) return;

  let visibleCount = Math.min(DEFAULT_STEP, items.length);

  const getActiveFilter = () => {
    const active = container.querySelector(".tabs__tab.tabs__tab--active") ||
      container.querySelector(".tabs__tab[aria-selected='true']");
    return active?.dataset.filter || "all";
  };

  const normalize = (value) =>
    (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const apply = () => {
    const filter = normalize(getActiveFilter());
    const showAll = filter === "" || filter === "all";

    items.forEach((item, index) => {
      const loaded = index < visibleCount;
      item.dataset.loadHidden = loaded ? "false" : "true";

      const raw = item.dataset.cat || item.dataset.filter || "";
      const normalized = normalize(raw).split(/[\s,]+/).filter(Boolean);
      const matches = showAll || normalized.includes(filter);

      item.hidden = !(loaded && matches);
    });

    updateStatus(status, Math.min(visibleCount, items.length), items.length);

    if (visibleCount >= items.length) {
      finalizeButton(button);
    } else {
      ensureButton(button);
    }
  };

  apply();

  button.addEventListener("click", () => {
    visibleCount = Math.min(visibleCount + DEFAULT_STEP, items.length);
    apply();
  });

  log(items.length);
}
