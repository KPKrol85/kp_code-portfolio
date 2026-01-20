import { createElement, clearElement } from "../utils/dom.js";
import { createProductCard } from "../components/productCard.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { renderDataState, createRetryButton } from "../components/uiStates.js";
import { getVisibleProducts } from "../utils/products.js";
import { debounce } from "../utils/debounce.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";
import { content } from "../content/pl.js";
import { actions } from "../store/actions.js";

const VISIBLE_ROWS = 5;
const ROWS_STEP = 5;
const PRODUCT_COLUMNS = 3;
const FILTER_DEFAULTS = { query: "", category: "all", sort: "latest" };
const VALID_SORTS = new Set(["latest", "price-asc", "price-desc"]);

export const renderProducts = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  if (main._productsUnsubscribe) {
    main._productsUnsubscribe();
    main._productsUnsubscribe = null;
  }

  let isActive = true;
  const cleanupHandlers = [];
  const addCleanup = (handler) => cleanupHandlers.push(handler);

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Katalog produktów" }));
  container.appendChild(
    createElement("p", {
      text: "Filtruj, sortuj i wybieraj produkty cyfrowe dopasowane do Twojego workflow.",
    })
  );

  const filters = createElement("div", { className: "grid grid-3" });
  const searchId = "products-search";
  const sortId = "products-sort";
  const categoryId = "products-category";
  const searchLabel = createElement("label", {
    className: "sr-only",
    text: "Szukaj produktu",
    attrs: { for: searchId },
  });
  const searchField = createElement("input", {
    className: "input",
    attrs: {
      id: searchId,
      type: "search",
      placeholder: "Szukaj produktu",
      autocomplete: "off",
      inputmode: "search",
      autocapitalize: "none",
      spellcheck: "false",
    },
  });
  const sortSelect = createElement("select", {
    className: "select",
    attrs: { id: sortId },
  });
  const sortLabel = createElement("label", {
    className: "sr-only",
    text: "Sortowanie",
    attrs: { for: sortId },
  });
  [
    { value: "latest", label: "Najnowsze" },
    { value: "price-asc", label: "Cena: rosnąco" },
    { value: "price-desc", label: "Cena: malejąco" },
  ].forEach((option) => {
    sortSelect.appendChild(
      createElement("option", { text: option.label, attrs: { value: option.value } })
    );
  });
  const categoryLabel = createElement("label", {
    className: "sr-only",
    text: "Kategoria",
    attrs: { for: categoryId },
  });
  const categorySelect = createElement("select", { className: "select", attrs: { id: categoryId } });
  let products = store.getState().products;
  let shouldSyncFromUrl = true;
  let isApplyingFilters = false;
  const isProductsListHash = () => {
    const hash = window.location.hash || "";
    return hash === "#/products" || hash.startsWith("#/products?");
  };

  const readFiltersFromHash = () => {
    const hash = window.location.hash || "";
    const queryString = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(queryString);
    return {
      query: params.get("q") ?? FILTER_DEFAULTS.query,
      category: params.get("category") ?? FILTER_DEFAULTS.category,
      sort: params.get("sort") ?? FILTER_DEFAULTS.sort,
    };
  };

  const getAvailableCategories = () =>
    Array.from(new Set(products.map((product) => product.category)));

  const normalizeFilters = (rawFilters, categories = []) => {
    const allowedCategories = new Set([FILTER_DEFAULTS.category, ...categories]);
    const query = typeof rawFilters.query === "string" ? rawFilters.query.trim() : "";
    return {
      query,
      category: allowedCategories.has(rawFilters.category)
        ? rawFilters.category
        : FILTER_DEFAULTS.category,
      sort: VALID_SORTS.has(rawFilters.sort) ? rawFilters.sort : FILTER_DEFAULTS.sort,
    };
  };

  const buildHashFromFilters = (filters) => {
    const params = new URLSearchParams();
    if (filters.query) {
      params.set("q", filters.query);
    }
    if (filters.category !== FILTER_DEFAULTS.category) {
      params.set("category", filters.category);
    }
    if (filters.sort !== FILTER_DEFAULTS.sort) {
      params.set("sort", filters.sort);
    }
    const queryString = params.toString();
    return queryString ? `#/products?${queryString}` : "#/products";
  };

  const updateUrlFromFilters = (filters, { replace = true } = {}) => {
    if (!isProductsListHash()) {
      return;
    }
    const nextHash = buildHashFromFilters(filters);
    if (window.location.hash === nextHash) {
      return;
    }
    if (replace && window.history?.replaceState) {
      window.history.replaceState(null, "", nextHash);
      return;
    }
    if (!replace && window.history?.pushState) {
      window.history.pushState(null, "", nextHash);
      return;
    }
    window.location.hash = nextHash;
  };

  const applyFiltersToControls = (filters) => {
    isApplyingFilters = true;
    searchField.value = filters.query;
    sortSelect.value = filters.sort;
    categorySelect.value = filters.category;
    isApplyingFilters = false;
  };

  const syncFiltersFromUrl = ({ replaceUrl = false } = {}) => {
    if (!isProductsListHash()) {
      return;
    }
    const rawFilters = readFiltersFromHash();
    const normalized = normalizeFilters(rawFilters, getAvailableCategories());
    applyFiltersToControls(normalized);
    if (replaceUrl) {
      updateUrlFromFilters(normalized, { replace: true });
    }
    if (store.getState().productsStatus === "ready" && products.length) {
      renderList(true);
    }
  };

  const getFiltersFromControls = () => ({
    query: searchField.value.trim(),
    category: categorySelect.value,
    sort: sortSelect.value,
  });

  const handleFiltersUpdate = ({ replace = true } = {}) => {
    if (isApplyingFilters) {
      return;
    }
    const filters = getFiltersFromControls();
    updateUrlFromFilters(filters, { replace });
    renderList();
  };

  const resetFilters = ({ replace = false } = {}) => {
    applyFiltersToControls(FILTER_DEFAULTS);
    updateUrlFromFilters(FILTER_DEFAULTS, { replace });
    renderList(true);
  };
  const updateCategories = (nextProducts) => {
    clearElement(categorySelect);
    categorySelect.appendChild(
      createElement("option", { text: "Wszystkie kategorie", attrs: { value: "all" } })
    );
    const categories = Array.from(new Set(nextProducts.map((product) => product.category)));
    categories.forEach((category) => {
      categorySelect.appendChild(
        createElement("option", { text: category, attrs: { value: category } })
      );
    });
  };

  updateCategories(products);

  filters.appendChild(searchLabel);
  filters.appendChild(searchField);
  filters.appendChild(sortLabel);
  filters.appendChild(sortSelect);
  filters.appendChild(categoryLabel);
  filters.appendChild(categorySelect);
  container.appendChild(filters);

  const grid = createElement("div", { className: "grid grid-3 section products-grid" });
  container.appendChild(grid);

  const resultsCount = createElement("p", {
    className: "products-count",
    attrs: { "aria-live": "polite", role: "status", "aria-atomic": "true" },
  });
  resultsCount.hidden = true;
  container.appendChild(resultsCount);

  const showMoreButton = createElement("button", {
    className: "button secondary block products-show-more",
    text: "Pokaż więcej",
    attrs: { type: "button" },
  });
  showMoreButton.hidden = true;
  container.appendChild(showMoreButton);

  let lastRenderSignature = null;
  let lastRenderProducts = null;
  let visibleRows = VISIBLE_ROWS;
  const parseGridColumns = (template) => {
    if (!template || template === "none") {
      return PRODUCT_COLUMNS;
    }
    const repeatMatch = template.match(/repeat\(\s*(\d+)\s*,/);
    if (repeatMatch) {
      return Number.parseInt(repeatMatch[1], 10) || PRODUCT_COLUMNS;
    }
    let columns = 0;
    let depth = 0;
    let token = "";
    for (const char of template) {
      if (char === "(") {
        depth += 1;
      } else if (char === ")") {
        depth = Math.max(0, depth - 1);
      }
      if (char === " " && depth === 0) {
        if (token.trim()) {
          columns += 1;
        }
        token = "";
      } else {
        token += char;
      }
    }
    if (token.trim()) {
      columns += 1;
    }
    return columns || PRODUCT_COLUMNS;
  };

  const getGridColumns = () => {
    const template = window.getComputedStyle(grid).gridTemplateColumns;
    return parseGridColumns(template);
  };

  const renderList = (force = false) => {
    if (!isActive || store.getState().productsStatus !== "ready") {
      return;
    }
    const query = searchField.value.toLowerCase();
    const category = categorySelect.value;
    const sort = sortSelect.value;
    const signature = `${query}|${category}|${sort}`;
    const signatureChanged = signature !== lastRenderSignature;
    if (signatureChanged) {
      visibleRows = VISIBLE_ROWS;
    }
    if (!signatureChanged && products === lastRenderProducts && !force) {
      return;
    }
    lastRenderSignature = signature;
    lastRenderProducts = products;

    const filtered = getVisibleProducts(products, { query, category, sort });
    if (!filtered.length) {
      clearElement(grid);
      resultsCount.hidden = true;
      showMoreButton.hidden = true;
      grid.appendChild(
        renderEmptyState({
          title: content.states.products.filteredEmpty.title,
          message: content.states.products.filteredEmpty.message,
          ctaText: content.states.products.filteredEmpty.cta,
          onCta: () => resetFilters({ replace: false }),
        })
      );
      return;
    }

    const limit = visibleRows * getGridColumns();
    const visible = filtered.slice(0, limit);
    const visibleIds = new Set(visible.map((product) => String(product.id)));
    const existingNodes = new Map();
    const hasNonCardChildren = Array.from(grid.children).some(
      (child) => !child.dataset.productId
    );
    if (hasNonCardChildren) {
      clearElement(grid);
    }
    grid.querySelectorAll("[data-product-id]").forEach((node) => {
      existingNodes.set(node.dataset.productId, node);
    });
    existingNodes.forEach((node, id) => {
      if (!visibleIds.has(id)) {
        node.remove();
        existingNodes.delete(id);
      }
    });
    resultsCount.textContent = `Pokazano ${visible.length} z ${filtered.length}`;
    resultsCount.hidden = false;
    const fragment = document.createDocumentFragment();
    visible.forEach((product) => {
      const id = String(product.id);
      let card = existingNodes.get(id);
      if (!card) {
        card = createProductCard(product, (productId) => {
          cartService.addItem(productId, 1);
          actions.cart.setCart(cartService.getCart());
          showToast(content.toasts.addedToCart);
        });
      }
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);

    showMoreButton.hidden = visible.length >= filtered.length;
  };

  const renderGridState = (state) => {
    const { productsStatus, productsError, products } = state;
    if (
      renderDataState(grid, {
        status: productsStatus,
        items: products,
        error: productsError,
        loading: {
          count: 6,
          variant: "product-card",
          lineWidths: [70, 85],
          lineHeights: [18, 14],
          tagCount: 3,
          tagWidth: 56,
          priceWidth: 32,
        },
        errorState: {
          title: content.states.products.error.title,
          message: productsError || content.states.products.error.message,
          action: { element: createRetryButton() },
        },
        empty: {
          title: content.states.products.empty.title,
          message: content.states.products.empty.message,
        },
      })
    ) {
      resultsCount.hidden = true;
      showMoreButton.hidden = true;
      return;
    }
  };

  let lastProducts = null;
  let lastStatus = null;
  let lastError = null;
  const handleStoreUpdate = (state) => {
    products = state.products;
    if (
      state.products === lastProducts &&
      state.productsStatus === lastStatus &&
      state.productsError === lastError
    ) {
      return;
    }
    lastProducts = state.products;
    lastStatus = state.productsStatus;
    lastError = state.productsError;
    if (state.productsStatus === "ready") {
      updateCategories(state.products);
    }
    renderGridState(state);
    if (state.productsStatus === "ready" && state.products.length) {
      if (shouldSyncFromUrl) {
        syncFiltersFromUrl({ replaceUrl: true });
        shouldSyncFromUrl = false;
        return;
      }
      renderList();
    }
  };

  const initialState = store.getState();
  products = initialState.products;
  lastProducts = initialState.products;
  lastStatus = initialState.productsStatus;
  lastError = initialState.productsError;
  if (initialState.productsStatus === "ready") {
    updateCategories(initialState.products);
  }
  renderGridState(initialState);
  if (initialState.productsStatus === "ready" && initialState.products.length) {
    syncFiltersFromUrl({ replaceUrl: true });
    shouldSyncFromUrl = false;
  }
  const unsubscribe = store.subscribe(handleStoreUpdate);
  main._productsUnsubscribe = unsubscribe;

  const attachFieldListener = (field, eventName, handler) => {
    field.addEventListener(eventName, handler);
    addCleanup(() => field.removeEventListener(eventName, handler));
  };
  const debouncedFiltersUpdate = debounce(() => handleFiltersUpdate({ replace: true }), 250);
  const debouncedResize = debounce(() => renderList(true), 150);
  attachFieldListener(searchField, "input", debouncedFiltersUpdate);
  attachFieldListener(sortSelect, "change", () => handleFiltersUpdate({ replace: false }));
  attachFieldListener(categorySelect, "change", () => handleFiltersUpdate({ replace: false }));
  attachFieldListener(showMoreButton, "click", () => {
    visibleRows += ROWS_STEP;
    renderList(true);
  });
  const handlePopState = () => {
    if (!isProductsListHash()) {
      return;
    }
    syncFiltersFromUrl({ replaceUrl: true });
  };
  window.addEventListener("popstate", handlePopState);
  addCleanup(() => window.removeEventListener("popstate", handlePopState));
  addCleanup(() => debouncedFiltersUpdate.cancel?.());
  window.addEventListener("resize", debouncedResize);
  addCleanup(() => window.removeEventListener("resize", debouncedResize));
  addCleanup(() => debouncedResize.cancel?.());

  main.appendChild(container);

  return () => {
    isActive = false;
    cleanupHandlers.forEach((handler) => handler());
    cleanupHandlers.length = 0;
    if (main._productsUnsubscribe) {
      main._productsUnsubscribe();
      main._productsUnsubscribe = null;
    }
  };
};
