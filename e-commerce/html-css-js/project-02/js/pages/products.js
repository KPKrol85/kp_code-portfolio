import { createElement, clearElement } from "../utils/dom.js";
import { createProductCard } from "../components/productCard.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { renderDataState } from "../components/uiStates.js";
import { getVisibleProducts } from "../utils/products.js";
import { debounce } from "../utils/debounce.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";

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

  const grid = createElement("div", { className: "grid grid-3 section" });
  container.appendChild(grid);

  let lastRenderSignature = null;
  let lastRenderProducts = null;
  const renderList = () => {
    if (!isActive || store.getState().productsStatus !== "ready") {
      return;
    }
    const query = searchField.value.toLowerCase();
    const category = categorySelect.value;
    const sort = sortSelect.value;
    const signature = `${query}|${category}|${sort}`;
    if (signature === lastRenderSignature && products === lastRenderProducts) {
      return;
    }
    lastRenderSignature = signature;
    lastRenderProducts = products;
    clearElement(grid);

    const visible = getVisibleProducts(products, { query, category, sort });
    if (!visible.length) {
      grid.appendChild(renderEmptyState({
        title: "No products found.",
        message: "Try adjusting filters or search.",
        ctaText: "Reset filters",
        onCta: () => {
          searchField.value = "";
          sortSelect.value = "latest";
          categorySelect.value = "all";
          renderList();
        },
      }));
      return;
    }

    visible.forEach((product) => {
      grid.appendChild(
        createProductCard(product, (id) => {
          cartService.addItem(id, 1);
          store.setState({ cart: cartService.getCart() });
          showToast("Dodano produkt do koszyka.");
        })
      );
    });
  };

  const renderGridState = (state) => {
    const { productsStatus, productsError, products } = state;
    if (renderDataState(grid, {
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
        title: "Nie udalo sie pobrac produktow",
        message: productsError || "Sprobuj ponownie pozniej.",
      },
      empty: {
        title: "Brak produktow",
        message: "Brak produktow do wyswietlenia.",
      },
    })) {
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

