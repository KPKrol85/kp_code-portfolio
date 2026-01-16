import { createElement, clearElement } from "../utils/dom.js";
import { createProductCard } from "../components/productCard.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { renderDataState } from "../components/uiStates.js";
import { getVisibleProducts } from "../utils/products.js";
import { debounce } from "../utils/debounce.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";

const VISIBLE_ROWS = 5;
const ROWS_STEP = 5;
const PRODUCT_COLUMNS = 3;

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
  const searchField = createElement("input", {
    className: "input",
    attrs: { type: "search", placeholder: "Szukaj produktu" },
  });
  const sortSelect = createElement("select", {
    className: "select",
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
  const categorySelect = createElement("select", { className: "select" });
  let products = store.getState().products;
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

  filters.appendChild(searchField);
  filters.appendChild(sortSelect);
  filters.appendChild(categorySelect);
  container.appendChild(filters);

  const grid = createElement("div", { className: "grid grid-3 section products-grid" });
  container.appendChild(grid);

  const resultsCount = createElement("p", { className: "products-count" });
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
    clearElement(grid);

    const filtered = getVisibleProducts(products, { query, category, sort });
    if (!filtered.length) {
      resultsCount.hidden = true;
      showMoreButton.hidden = true;
      grid.appendChild(
        renderEmptyState({
          title: "Nie znaleziono produktów.",
          message: "Spróbuj zmienić filtry lub wyszukiwanie.",
          ctaText: "Wyczyść filtry",
          onCta: () => {
            searchField.value = "";
            sortSelect.value = "latest";
            categorySelect.value = "all";
            renderList();
          },
        })
      );
      return;
    }

    const limit = visibleRows * PRODUCT_COLUMNS;
    const visible = filtered.slice(0, limit);
    resultsCount.textContent = `Pokazano ${visible.length} z ${filtered.length}`;
    resultsCount.hidden = false;
    visible.forEach((product) => {
      grid.appendChild(
        createProductCard(product, (id) => {
          cartService.addItem(id, 1);
          store.setState({ cart: cartService.getCart() });
          showToast("Dodano produkt do koszyka.");
        })
      );
    });

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
          imageHeight: 180,
          lineWidths: [70, 60],
          lineHeights: [18, 14],
        },
        errorState: {
          title: "Nie udało się pobrać produktów",
          message: productsError || "Spróbuj ponownie później.",
        },
        empty: {
          title: "Brak produktów",
          message: "Brak produktów do wyświetlenia.",
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
    renderList();
  }
  const unsubscribe = store.subscribe(handleStoreUpdate);
  main._productsUnsubscribe = unsubscribe;

  const attachFieldListener = (field, eventName, handler) => {
    field.addEventListener(eventName, handler);
    addCleanup(() => field.removeEventListener(eventName, handler));
  };
  const debouncedRenderList = debounce(renderList, 250);
  attachFieldListener(searchField, "input", debouncedRenderList);
  attachFieldListener(sortSelect, "change", renderList);
  attachFieldListener(categorySelect, "change", renderList);
  attachFieldListener(showMoreButton, "click", () => {
    visibleRows += ROWS_STEP;
    renderList(true);
  });

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


