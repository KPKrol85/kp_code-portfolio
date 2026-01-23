import { createElement, clearElement } from "../utils/dom.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { createRetryButton } from "../components/uiStates.js";
import { debounce } from "../utils/debounce.js";
import { content } from "../content/pl.js";
import { actions } from "../store/actions.js";
import { createProductsGrid } from "../components/productsGrid.js";
import { getCategoryConfig } from "../utils/productCategories.js";
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildProductCategoryBreadcrumbs } from "../utils/breadcrumbs.js";

const VALID_SORTS = new Set(["latest", "price-asc", "price-desc"]);

export const renderProductCategory = ({ category }) => {
  const main = document.getElementById("main-content");
  clearElement(main);

  if (main._productsCategoryUnsubscribe) {
    main._productsCategoryUnsubscribe();
    main._productsCategoryUnsubscribe = null;
  }

  let isActive = true;
  const cleanupHandlers = [];
  const addCleanup = (handler) => cleanupHandlers.push(handler);
  const categoryConfig = getCategoryConfig(category);
  const labels = content.products?.categoryPage;

  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildProductCategoryBreadcrumbs(category));
  const hero = createElement("section", { className: "hero services-hero products-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  heroContent.appendChild(
    createElement("h1", {
      text: categoryConfig.title,
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", { className: "hero-lead", text: categoryConfig.description })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const filters = createElement("div", { className: "grid grid-2 section" });
  const searchId = `products-${category}-search`;
  const sortId = `products-${category}-sort`;
  const searchLabel = createElement("label", {
    className: "sr-only",
    text: labels?.searchLabel ?? "Search in category",
    attrs: { for: searchId },
  });
  const searchField = createElement("input", {
    className: "input",
    attrs: {
      id: searchId,
      type: "search",
      placeholder: labels?.searchPlaceholder ?? "Search in this category",
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
    text: labels?.sortLabel ?? "Sort",
    attrs: { for: sortId },
  });
  const sortOptions = labels?.sortOptions ?? {
    latest: "Latest",
    priceAsc: "Price: low to high",
    priceDesc: "Price: high to low",
  };
  [
    { value: "latest", label: sortOptions.latest },
    { value: "price-asc", label: sortOptions.priceAsc },
    { value: "price-desc", label: sortOptions.priceDesc },
  ].forEach((option) => {
    sortSelect.appendChild(
      createElement("option", { text: option.label, attrs: { value: option.value } })
    );
  });
  filters.appendChild(searchLabel);
  filters.appendChild(searchField);
  filters.appendChild(sortLabel);
  filters.appendChild(sortSelect);
  container.appendChild(filters);

  const productsGrid = createProductsGrid({
    onAddToCart: (productId) => {
      cartService.addItem(productId, 1);
      actions.cart.setCart(cartService.getCart());
      showToast(content.toasts.addedToCart);
    },
    showMoreLabel: labels?.showMore ?? "Show more",
  });
  const { grid, resultsCount, showMoreButton } = productsGrid;
  container.appendChild(grid);
  container.appendChild(resultsCount);
  container.appendChild(showMoreButton);

  const aboutSection = createElement("div", { className: "card section" }, [
    createElement("h2", { text: labels?.aboutTitle ?? "About this category" }),
  ]);
  const aboutList = createElement("ul");
  categoryConfig.bullets.forEach((item) => aboutList.appendChild(createElement("li", { text: item })));
  aboutSection.appendChild(aboutList);
  container.appendChild(aboutSection);

  const faqItems = Array.isArray(categoryConfig.faq) ? categoryConfig.faq : [];
  if (faqItems.length) {
    const faqSection = createElement("section", {
      className: "section",
      attrs: { "aria-label": labels?.faqTitle ?? "FAQ / Instructions" },
    });
    const faqHeader = createElement("div", { className: "section-header" }, [
      createElement("h2", { text: labels?.faqTitle ?? "FAQ / Instructions" }),
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

  let products = store.getState().products;
  let productsVersion = 0;

  const normalizeSort = (value) => (VALID_SORTS.has(value) ? value : "latest");

  const renderList = (force = false) => {
    if (!isActive || store.getState().productsStatus !== "ready") {
      return;
    }
    const query = searchField.value.trim().toLowerCase();
    const emptyStateConfig = query
      ? {
          title: content.states.products.filteredEmpty.title,
          message: content.states.products.filteredEmpty.message,
          ctaText: content.states.products.filteredEmpty.cta,
          onCta: () => {
            searchField.value = "";
            renderList(true);
          },
        }
      : {
          title: labels?.emptyTitle ?? "New products coming soon",
          message: labels?.emptyMessage ?? "We will add the first products soon...",
          ctaText: labels?.emptyCta ?? "Back to products",
          ctaHref: "#/products",
        };
    productsGrid.renderList({
      products,
      filters: {
        query,
        category,
        sort: normalizeSort(sortSelect.value),
      },
      filteredEmptyState: emptyStateConfig,
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
    renderGridState(state);
    if (state.productsStatus === "ready" && state.products.length) {
      renderList();
    }
  };

  const initialState = store.getState();
  products = initialState.products;
  lastProducts = initialState.products;
  lastStatus = initialState.productsStatus;
  lastError = initialState.productsError;
  if (initialState.productsStatus === "ready") {
    productsGrid.updateProductsVersion(productsVersion);
  }
  renderGridState(initialState);
  if (initialState.productsStatus === "ready" && initialState.products.length) {
    renderList(true);
  }
  const unsubscribe = store.subscribe(handleStoreUpdate);
  main._productsCategoryUnsubscribe = unsubscribe;

  const attachFieldListener = (field, eventName, handler) => {
    field.addEventListener(eventName, handler);
    addCleanup(() => field.removeEventListener(eventName, handler));
  };
  const debouncedFiltersUpdate = debounce(() => renderList(true), 250);
  const debouncedResize = debounce(() => renderList(true), 150);
  attachFieldListener(searchField, "input", debouncedFiltersUpdate);
  attachFieldListener(sortSelect, "change", () => renderList(true));
  window.addEventListener("resize", debouncedResize);
  addCleanup(() => window.removeEventListener("resize", debouncedResize));
  addCleanup(() => debouncedFiltersUpdate.cancel?.());
  addCleanup(() => debouncedResize.cancel?.());

  main.appendChild(container);

  return () => {
    isActive = false;
    cleanupHandlers.forEach((handler) => handler());
    cleanupHandlers.length = 0;
    if (main._productsCategoryUnsubscribe) {
      main._productsCategoryUnsubscribe();
      main._productsCategoryUnsubscribe = null;
    }
  };
};
