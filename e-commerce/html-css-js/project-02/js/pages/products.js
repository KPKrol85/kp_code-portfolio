import { createElement, clearElement } from "../utils/dom.js";
import { createProductCard } from "../components/productCard.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";

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

  const renderList = () => {
    if (!isActive || store.getState().productsStatus !== "ready") {
      return;
    }
    clearElement(grid);
    const query = searchField.value.toLowerCase();
    const category = categorySelect.value;
    const sort = sortSelect.value;

    let filtered = [...products];
    if (query) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }
    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    }
    if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }
    if (sort === "latest") {
      filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    if (!filtered.length) {
      grid.appendChild(
        createElement("div", { className: "notice" }, [
          createElement("h3", { text: "Brak wynik¢w" }),
          createElement("p", { text: "Zmieä filtry lub usuä kryteria wyszukiwania." }),
        ])
      );
      return;
    }

    filtered.forEach((product) => {
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
    clearElement(grid);

    if (productsStatus === "loading") {
      for (let i = 0; i < 6; i += 1) {
        grid.appendChild(createElement("div", { className: "card" }, [
          createElement("div", { className: "skeleton", attrs: { style: "height: 180px" } }),
          createElement("div", { className: "skeleton", attrs: { style: "width: 70%; height: 18px" } }),
          createElement("div", { className: "skeleton", attrs: { style: "width: 60%; height: 14px" } }),
        ]));
      }
      return;
    }

    if (productsStatus === "error") {
      grid.appendChild(
        createElement("div", { className: "notice" }, [
          createElement("h3", { text: "Nie udało się pobrać produktów" }),
          createElement("p", { text: productsError || "Spróbuj ponownie później." }),
        ])
      );
      return;
    }

    if (productsStatus === "ready" && !products.length) {
      grid.appendChild(
        createElement("div", { className: "notice" }, [
          createElement("h3", { text: "Brak produktów" }),
          createElement("p", { text: "Brak produktów do wyświetlenia." }),
        ])
      );
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

  const attachFieldListener = (field, eventName) => {
    field.addEventListener(eventName, renderList);
    addCleanup(() => field.removeEventListener(eventName, renderList));
  };
  [searchField, sortSelect, categorySelect].forEach((field) => {
    attachFieldListener(field, "input");
    attachFieldListener(field, "change");
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

