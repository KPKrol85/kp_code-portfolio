import { materials } from "../data/materials.js";
import { getMaterialPresentation } from "../data/materialAccess.js";
import { filterMaterials } from "../data/materialFilters.js";

const createBadge = (label, className = "") => {
  const badge = document.createElement("span");
  badge.className = `badge ${className}`.trim();
  badge.textContent = label;
  return badge;
};

const createMetaBadges = (item) => {
  const presentation = getMaterialPresentation(item);
  const fragment = document.createDocumentFragment();
  fragment.append(
    createBadge(presentation.categoryLabel),
    createBadge(presentation.levelLabel),
    createBadge(item.format),
  );

  if (item.duration) {
    fragment.append(createBadge(item.duration));
  }

  return fragment;
};

const getFilteredMaterials = (filters) =>
  filterMaterials(materials, filters);

const renderMaterials = (list, container, emptyState) => {
  if (!list.length) {
    container.replaceChildren();
    emptyState.hidden = false;
    return;
  }

  const fragment = document.createDocumentFragment();

  list.forEach((item) => {
    const presentation = getMaterialPresentation(item);
    const card = document.createElement("article");
    card.className = "card card--resource materials__card";
    card.dataset.materialId = item.id;

    const title = document.createElement("h3");
    title.className = "card__title";
    title.textContent = item.title;

    const meta = document.createElement("div");
    meta.className = "card__tags materials__meta";
    meta.append(createMetaBadges(item));

    const description = document.createElement("p");
    description.className = "card__text";
    description.textContent = item.description;

    const accessBadge = createBadge(
      presentation.accessLabel,
      `badge--access badge--${item.access}`,
    );
    accessBadge.setAttribute(
      "aria-label",
      `Dostęp: ${presentation.accessLabel}`,
    );

    let action;
    if (presentation.action.kind === "link") {
      action = document.createElement("a");
      action.className = `button ${presentation.action.buttonClass}`;
      action.href = presentation.action.href;
      action.textContent = presentation.action.label;
    } else {
      action = document.createElement("span");
      action.className = "materials__availability";
      action.textContent = presentation.action.label;
    }

    const footer = document.createElement("div");
    footer.className = "materials__footer";
    footer.append(accessBadge, action);

    card.append(title, meta, description, footer);
    fragment.append(card);
  });

  container.replaceChildren(fragment);
  emptyState.hidden = true;
};

const updateCount = (count, element) => {
  if (!element) return;
  element.textContent = `Wyników: ${count}`;
};

const initMaterialsFilters = ({
  categorySelect,
  levelSelect,
  freeToggle,
  listContainer,
  emptyState,
  countElement,
}) => {
  const filters = {
    category: categorySelect.value,
    level: levelSelect.value,
    freeOnly: freeToggle.checked,
  };

  const applyFilters = () => {
    filters.category = categorySelect.value;
    filters.level = levelSelect.value;
    filters.freeOnly = freeToggle.checked;

    const filtered = getFilteredMaterials(filters);
    renderMaterials(filtered, listContainer, emptyState);
    updateCount(filtered.length, countElement);
  };

  categorySelect.addEventListener("change", applyFilters);
  levelSelect.addEventListener("change", applyFilters);
  freeToggle.addEventListener("change", applyFilters);

  applyFilters();
};

export const initMaterialsCatalog = () => {
  const listContainer = document.querySelector("#materials-list");
  if (!listContainer) return;

  const categorySelect = document.querySelector("[data-materials-category]");
  const levelSelect = document.querySelector("[data-materials-level]");
  const freeToggle = document.querySelector("[data-materials-free]");
  const emptyState = document.querySelector("[data-materials-empty]");
  const countElement = document.querySelector("[data-materials-count]");
  const filtersForm = document.querySelector("[data-materials-filters]");

  if (
    !categorySelect ||
    !levelSelect ||
    !freeToggle ||
    !emptyState ||
    !filtersForm
  )
    return;

  initMaterialsFilters({
    categorySelect,
    levelSelect,
    freeToggle,
    listContainer,
    emptyState,
    countElement,
  });
  filtersForm.hidden = false;
};

export {
  getFilteredMaterials,
  getMaterialPresentation,
  renderMaterials,
  initMaterialsFilters,
};
