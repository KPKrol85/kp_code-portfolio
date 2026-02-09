import { materials } from '../data/materials.js';
import { packages, packagesSectionHref } from '../data/packages.js';

const categoryLabels = {
  grammar: 'Gramatyka',
  vocabulary: 'Słownictwo',
  speaking: 'Speaking',
  writing: 'Writing',
  exam: 'Egzaminy',
  business: 'Biznes',
};

const accessLabels = {
  free: 'Free',
  premium: 'Premium',
};

const createBadge = (label, className = '') => {
  const badge = document.createElement('span');
  badge.className = `badge ${className}`.trim();
  badge.textContent = label;
  return badge;
};

const createMetaBadges = (item) => {
  const fragment = document.createDocumentFragment();
  fragment.append(
    createBadge(categoryLabels[item.category] || item.category),
    createBadge(item.level === 'All' ? 'Wszystkie poziomy' : item.level),
    createBadge(item.format),
  );

  if (item.duration) {
    fragment.append(createBadge(item.duration));
  }

  return fragment;
};

const canAccess = (item) => {
  // TODO: integrate with purchase/access logic
  return item.access === 'free';
};

const getPremiumCtaHref = (item) => {
  if (item.packageKey && packages[item.packageKey]) {
    return packages[item.packageKey].href;
  }
  return packagesSectionHref;
};

const getCtaHref = (item) => {
  if (item.access === 'premium') {
    return getPremiumCtaHref(item);
  }
  return item.url || '#';
};

const getFilteredMaterials = (filters) =>
  materials.filter((item) => {
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (filters.level !== 'all' && item.level !== filters.level && item.level !== 'All') {
      return false;
    }
    if (filters.freeOnly && item.access !== 'free') {
      return false;
    }
    return true;
  });

const renderMaterials = (list, container, emptyState) => {
  container.innerHTML = '';

  if (!list.length) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  const fragment = document.createDocumentFragment();

  list.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card card--resource materials__card';

    const title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = item.title;

    const meta = document.createElement('div');
    meta.className = 'card__tags materials__meta';
    meta.append(createMetaBadges(item));

    const description = document.createElement('p');
    description.className = 'card__text';
    description.textContent = item.description;

    const accessBadge = createBadge(accessLabels[item.access], `badge--access badge--${item.access}`);
    accessBadge.setAttribute('aria-label', `Dostęp: ${accessLabels[item.access]}`);

    const cta = document.createElement('a');
    const hasAccess = canAccess(item);
    cta.className = `button ${hasAccess ? 'button--ghost' : 'button--primary'}`;
    cta.href = getCtaHref(item);
    cta.textContent = item.ctaLabel;

    const footer = document.createElement('div');
    footer.className = 'materials__footer';
    footer.append(accessBadge, cta);

    card.append(title, meta, description, footer);
    fragment.append(card);
  });

  container.append(fragment);
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

  categorySelect.addEventListener('change', applyFilters);
  levelSelect.addEventListener('change', applyFilters);
  freeToggle.addEventListener('change', applyFilters);

  applyFilters();
};

export const initMaterialsCatalog = () => {
  const listContainer = document.querySelector('#materials-list');
  if (!listContainer) return;

  const categorySelect = document.querySelector('[data-materials-category]');
  const levelSelect = document.querySelector('[data-materials-level]');
  const freeToggle = document.querySelector('[data-materials-free]');
  const emptyState = document.querySelector('[data-materials-empty]');
  const countElement = document.querySelector('[data-materials-count]');

  if (!categorySelect || !levelSelect || !freeToggle || !emptyState) return;

  initMaterialsFilters({
    categorySelect,
    levelSelect,
    freeToggle,
    listContainer,
    emptyState,
    countElement,
  });
};

export { getFilteredMaterials, renderMaterials, initMaterialsFilters };
