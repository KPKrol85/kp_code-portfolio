import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { createProductsGrid } from "../components/productsGrid.js";
import { showToast } from "../components/toast.js";
import { createRetryButton } from "../components/uiStates.js";
import { getContent } from "../content/index.js";
import { cartService } from "../services/cart.js";
import { actions } from "../store/actions.js";
import { store } from "../store/store.js";
import { buildProductsBreadcrumbs } from "../utils/breadcrumbs.js";
import { debounce } from "../utils/debounce.js";
import { createElement, clearElement } from "../utils/dom.js";
import { getCategoryLabel, getProductCategories } from "../utils/productCategories.js";

const FILTER_DEFAULTS = { query: "", category: "all", sort: "latest" };
const VALID_SORTS = new Set(["latest", "price-asc", "price-desc"]);

export const renderProducts = () => {
  const content = getContent();
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
  const breadcrumbs = createBreadcrumbs(buildProductsBreadcrumbs());
  const hero = createElement("section", { className: "hero services-hero products-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  heroContent.appendChild(createElement("h1", { text: content.products.listPage.title }));
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: content.products.listPage.lead,
    })
  );

  const filters = createElement("div", { className: "grid grid-3 products-filters section" });
  const searchId = "products-search";
  const sortId = "products-sort";
  const categoryId = "products-category";
  const searchLabel = createElement("label", {
    className: "sr-only",
    text: content.products.listPage.searchLabel,
    attrs: { for: searchId },
  });
  const searchField = createElement("input", {
    className: "input",
    attrs: {
      id: searchId,
      type: "search",
      placeholder: content.products.listPage.searchPlaceholder,
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
    text: content.products.listPage.sortLabel,
    attrs: { for: sortId },
  });
  [
    { value: "latest", label: content.products.listPage.sortOptions.latest },
    { value: "price-asc", label: content.products.listPage.sortOptions.priceAsc },
    { value: "price-desc", label: content.products.listPage.sortOptions.priceDesc },
  ].forEach((option) => {
    sortSelect.appendChild(
      createElement("option", { text: option.label, attrs: { value: option.value } })
    );
  });
  const categoryLabel = createElement("label", {
    className: "sr-only",
    text: content.products.listPage.categoryLabel,
    attrs: { for: categoryId },
  });
  const categorySelect = createElement("select", {
    className: "select",
    attrs: { id: categoryId },
  });
  let products = store.getState().products;
  let shouldSyncFromUrl = true;
  let isApplyingFilters = false;
  let isHydratingFromUrl = false;
  let lastSyncedHash = "";
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
    if (!isProductsListHash() || isHydratingFromUrl) {
      return { didRender: false };
    }
    const nextHash = buildHashFromFilters(filters);
    if (window.location.hash === nextHash) {
      return { didRender: false };
    }
    lastSyncedHash = nextHash;
    if (replace && window.history?.replaceState) {
      window.history.replaceState(null, "", nextHash);
      syncFiltersFromUrl({ replaceUrl: true });
      return { didRender: true };
    }
    window.location.hash = nextHash;
    return { didRender: false };
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
    isHydratingFromUrl = true;
    applyFiltersToControls(normalized);
    isHydratingFromUrl = false;
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
    const { didRender } = updateUrlFromFilters(filters, { replace });
    if (!didRender) {
      renderList();
    }
  };

  const resetFilters = ({ replace = false } = {}) => {
    applyFiltersToControls(FILTER_DEFAULTS);
    updateUrlFromFilters(FILTER_DEFAULTS, { replace });
    renderList(true);
  };
  const getOrderedCategories = (nextProducts) => {
    const available = new Set(nextProducts.map((product) => product.category));
    const ordered = getProductCategories()
      .map((category) => category.slug)
      .filter((slug) => available.has(slug));
    available.forEach((slug) => {
      if (!ordered.includes(slug)) {
        ordered.push(slug);
      }
    });
    return ordered;
  };

  const updateCategories = (nextProducts) => {
    clearElement(categorySelect);
    categorySelect.appendChild(
      createElement("option", {
        text: content.products.listPage.categoryAll,
        attrs: { value: "all" },
      })
    );
    const categories = getOrderedCategories(nextProducts);
    categories.forEach((category) => {
      categorySelect.appendChild(
        createElement("option", { text: getCategoryLabel(category), attrs: { value: category } })
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
  hero.appendChild(heroContent);
  container.appendChild(hero);
  container.appendChild(filters);

  const productsGrid = createProductsGrid({
    onAddToCart: (productId) => {
      cartService.addItem(productId, 1);
      actions.cart.setCart(cartService.getCart());
      showToast(content.toasts.addedToCart);
    },
    showMoreLabel: content.products.listPage.showMore,
  });
  const { grid, resultsCount, showMoreButton } = productsGrid;
  container.appendChild(grid);
  container.appendChild(resultsCount);
  container.appendChild(showMoreButton);

  const faqItems = content.products?.faqGeneral ?? [];
  if (faqItems.length) {
    const faqSection = createElement("section", {
      className: "section",
      attrs: { "aria-label": content.products.listPage.faq.ariaLabel },
    });
    const faqHeader = createElement("div", { className: "section-header" }, [
      createElement("h2", { text: content.products.listPage.faq.title }),
      createElement("p", {
        className: "section-lead",
        text: content.products.listPage.faq.lead,
      }),
    ]);
    faqSection.appendChild(faqHeader);
    const faqList = createElement("div", { className: "faq-list" });
    faqItems.forEach((item) => {
      const details = createElement("details", { className: "faq-item" });
      details.appendChild(createElement("summary", { text: item.question }));
      details.appendChild(createElement("p", { text: item.answer }));
      faqList.appendChild(details);
    });
    faqSection.appendChild(faqList);
    container.appendChild(faqSection);
  }

  let productsVersion = 0;

  const renderList = (force = false) => {
    if (!isActive || store.getState().productsStatus !== "ready") {
      return;
    }
    const query = searchField.value.trim().toLowerCase();
    productsGrid.renderList({
      products,
      filters: {
        query,
        category: categorySelect.value,
        sort: sortSelect.value,
      },
      filteredEmptyState: {
        title: content.states.products.filteredEmpty.title,
        message: content.states.products.filteredEmpty.message,
        ctaText: content.states.products.filteredEmpty.cta,
        onCta: () => resetFilters({ replace: false }),
      },
      force,
    });
  };

  const renderGridState = (state) => {
    productsGrid.renderState(state, {
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
        message: state.productsError || content.states.products.error.message,
        action: { element: createRetryButton() },
      },
      empty: {
        title: content.states.products.empty.title,
        message: content.states.products.empty.message,
      },
    });
  };

  let lastProducts = null;
  let lastStatus = null;
  let lastError = null;
  const handleStoreUpdate = (state) => {
    if (
      state.products === lastProducts &&
      state.productsStatus === lastStatus &&
      state.productsError === lastError
    ) {
      return;
    }
    const productsChanged = state.products !== lastProducts;
    if (productsChanged) {
      productsVersion += 1;
      productsGrid.updateProductsVersion(productsVersion);
    }
    products = state.products;
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
    productsGrid.updateProductsVersion(productsVersion);
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
  const handleHashChange = () => {
    if (!isProductsListHash()) {
      return;
    }
    if (lastSyncedHash && window.location.hash === lastSyncedHash) {
      lastSyncedHash = "";
      return;
    }
    syncFiltersFromUrl({ replaceUrl: true });
  };
  window.addEventListener("hashchange", handleHashChange);
  addCleanup(() => window.removeEventListener("hashchange", handleHashChange));
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
