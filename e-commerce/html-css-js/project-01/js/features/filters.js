import { fetchProducts } from '../services/products.js';
import { renderGrid } from './products.js';
import { renderState } from '../ui/state.js';
import { logError } from '../core/errors.js';

export const initFilters = async () => {
  const container = document.querySelector('[data-products="shop"]');
  if (!container) return;

  const categorySelect = document.querySelector('#filter-category');
  const priceRange = document.querySelector('#filter-price');
  const priceOutput = document.querySelector('[data-price-output]');
  const sortSelect = document.querySelector('#filter-sort');
  const resultCount = document.querySelector('[data-result-count]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchClear = document.querySelector('[data-search-clear]');
  const suggestions = document.querySelector('[data-search-suggestions]');
  const searchField = document.querySelector('[data-search]');

  renderState(container, 'loading', 'Ładowanie produktów...');

  let products = [];
  try {
    products = await fetchProducts();
  } catch (error) {
    logError('filters:load', error);
    renderState(container, 'error', 'Nie udało się wczytać produktów do filtrowania.');
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');

  const debounce = (fn, delay = 200) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const polishL = String.fromCharCode(322);

  const foldChar = (char) => {
    const lowered = char.toLowerCase();
    let simplified = lowered.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (simplified === polishL) simplified = 'l';
    if (/[a-z0-9]/.test(simplified)) return simplified;
    if (/\s/.test(simplified)) return ' ';
    return '';
  };

  const foldText = (value = '') => {
    let folded = '';
    for (const char of value) {
      folded += foldChar(char);
    }
    return folded.replace(/\s+/g, ' ').trim();
  };

  const buildFoldedMap = (value = '') => {
    let folded = '';
    const map = [];
    for (let i = 0; i < value.length; i += 1) {
      const foldedChar = foldChar(value[i]);
      if (!foldedChar) continue;
      if (foldedChar === ' ') {
        if (folded.endsWith(' ')) continue;
        folded += ' ';
        map.push(i);
        continue;
      }
      folded += foldedChar;
      map.push(i);
    }
    while (folded.startsWith(' ')) {
      folded = folded.slice(1);
      map.shift();
    }
    while (folded.endsWith(' ')) {
      folded = folded.slice(0, -1);
      map.pop();
    }
    return { folded, map };
  };

  const escapeHtml = (value) =>
    value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);

  const highlightMatch = (value, query) => {
    const foldedQuery = foldText(query);
    if (!foldedQuery) return escapeHtml(value);
    const { folded, map } = buildFoldedMap(value);
    const index = folded.indexOf(foldedQuery);
    if (index === -1 || !map.length) return escapeHtml(value);
    const start = map[index];
    const end = map[index + foldedQuery.length - 1] + 1;
    const before = escapeHtml(value.slice(0, start));
    const match = escapeHtml(value.slice(start, end));
    const after = escapeHtml(value.slice(end));
    return `${before}<mark>${match}</mark>${after}`;
  };

  const buildSearchText = (product) =>
    [product.name, product.category, product.badge, ...(product.tags || [])].filter(Boolean).join(' ');

  const fuzzyScore = (query, text) => {
    if (query.length < 2) return 0;
    let matched = 0;
    for (let i = 0, j = 0; i < text.length && j < query.length; i += 1) {
      if (text[i] === query[j]) {
        matched += 1;
        j += 1;
      }
    }
    return matched / query.length;
  };

  const scoreMatch = (query, name, search) => {
    if (!query) return 0;
    if (name.startsWith(query)) return 300;
    if (name.includes(query)) return 220;
    if (search.startsWith(query)) return 180;
    if (search.includes(query)) return 120;
    const fuzzy = fuzzyScore(query, name);
    return fuzzy >= 0.7 ? 80 + fuzzy * 20 : 0;
  };

  const searchable = products.map((product) => ({
    product,
    nameIndex: foldText(product.name),
    searchIndex: foldText(buildSearchText(product))
  }));

  const resolveCategory = (value) => {
    if (!categorySelect) return null;
    const options = Array.from(categorySelect.options);
    const directMatch = options.find((option) => option.value === value);
    if (directMatch) return directMatch.value;
    const normalized = foldText(value);
    const normalizedMatch = options.find((option) => foldText(option.value) === normalized);
    return normalizedMatch?.value || null;
  };

  const state = {
    query: '',
    activeIndex: -1,
    suggestions: []
  };

  const clearSuggestions = () => {
    if (!suggestions || !searchInput) return;
    suggestions.innerHTML = '';
    suggestions.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
    searchInput.removeAttribute('aria-activedescendant');
    state.activeIndex = -1;
  };

  const setActiveIndex = (nextIndex) => {
    if (!suggestions || !searchInput) return;
    const options = Array.from(suggestions.querySelectorAll('[data-search-option]'));
    if (!options.length) return;
    const maxIndex = options.length - 1;
    const safeIndex = Math.max(0, Math.min(nextIndex, maxIndex));
    state.activeIndex = safeIndex;
    options.forEach((option, index) => {
      const isActive = index === safeIndex;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('aria-selected', String(isActive));
      if (isActive) {
        searchInput.setAttribute('aria-activedescendant', option.id);
      }
    });
  };

  const renderSuggestions = (query) => {
    if (!suggestions || !searchInput) return;
    const foldedQuery = foldText(query);
    if (!foldedQuery) {
      clearSuggestions();
      return;
    }
    const scored = searchable
      .map(({ product, nameIndex, searchIndex }) => ({
        product,
        score: scoreMatch(foldedQuery, nameIndex, searchIndex)
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
      .slice(0, 8);

    state.suggestions = scored;
    state.activeIndex = -1;

    if (!scored.length) {
      clearSuggestions();
      return;
    }

    suggestions.innerHTML = scored
      .map((entry, index) => {
        const name = entry.product.name;
        return `<div class="search-option" role="option" id="search-option-${index}" data-search-option data-index="${index}" aria-selected="false">${highlightMatch(
          name,
          query
        )}</div>`;
      })
      .join('');

    suggestions.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
  };

  const applyFilters = () => {
    const category = categorySelect?.value || 'all';
    const maxPrice = Number(priceRange?.value || 1000);
    const sort = sortSelect?.value || 'featured';
    const searchQuery = foldText(searchInput?.value || '');

    let filtered = searchable
      .filter(({ product, searchIndex }) => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesSearch = !searchQuery || searchIndex.includes(searchQuery);
        return matchesCategory && product.price <= maxPrice && matchesSearch;
      })
      .map(({ product }) => product);

    if (sort === 'price-asc') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }
    if (sort === 'price-desc') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }
    if (sort === 'name-asc') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderGrid(container, filtered);
    if (resultCount) {
      resultCount.textContent = `${filtered.length} wynik\u00f3w`;
      resultCount.setAttribute('aria-live', 'polite');
    }
  };

  const applyFiltersDebounced = debounce(applyFilters, 200);

  if (priceRange && priceOutput) {
    priceOutput.textContent = priceRange.value;
    priceRange.addEventListener('input', () => {
      priceOutput.textContent = priceRange.value;
      applyFilters();
    });
  }

  categorySelect?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.query = searchInput.value;
      if (searchClear) {
        searchClear.hidden = !state.query;
      }
      renderSuggestions(state.query);
      applyFiltersDebounced();
    });

    searchInput.addEventListener('keydown', (event) => {
      if (!state.suggestions.length) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex(state.activeIndex + 1);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex(state.activeIndex - 1);
      }
      if (event.key === 'Enter' && state.activeIndex >= 0) {
        event.preventDefault();
        const selected = state.suggestions[state.activeIndex];
        if (selected) {
          searchInput.value = selected.product.name;
          state.query = searchInput.value;
          if (searchClear) {
            searchClear.hidden = false;
          }
          clearSuggestions();
          applyFilters();
        }
      }
      if (event.key === 'Escape') {
        clearSuggestions();
      }
    });
  }

  if (suggestions) {
    suggestions.addEventListener('click', (event) => {
      const option = event.target.closest('[data-search-option]');
      if (!option || !searchInput) return;
      const index = Number(option.dataset.index);
      const selected = state.suggestions[index];
      if (!selected) return;
      searchInput.value = selected.product.name;
      state.query = searchInput.value;
      if (searchClear) {
        searchClear.hidden = false;
      }
      clearSuggestions();
      applyFilters();
    });

    suggestions.addEventListener('mousemove', (event) => {
      const option = event.target.closest('[data-search-option]');
      if (!option) return;
      const index = Number(option.dataset.index);
      if (Number.isNaN(index)) return;
      setActiveIndex(index);
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      state.query = '';
      searchClear.hidden = true;
      clearSuggestions();
      applyFilters();
      searchInput.focus();
    });
  }

  if (searchField) {
    document.addEventListener('click', (event) => {
      if (!searchField.contains(event.target)) {
        clearSuggestions();
      }
    });
  }

  if (categoryParam && categorySelect) {
    const resolved = resolveCategory(categoryParam);
    if (resolved) {
      categorySelect.value = resolved;
    }
  }

  applyFilters();
};
