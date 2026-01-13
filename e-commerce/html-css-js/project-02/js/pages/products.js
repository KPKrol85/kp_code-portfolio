import { createElement, clearElement } from "../utils/dom.js";
import { createProductCard } from "../components/productCard.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";

export const renderProducts = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

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
  categorySelect.appendChild(
    createElement("option", { text: "Wszystkie kategorie", attrs: { value: "all" } })
  );

  const { products } = store.getState();
  const categories = Array.from(new Set(products.map((product) => product.category)));
  categories.forEach((category) => {
    categorySelect.appendChild(
      createElement("option", { text: category, attrs: { value: category } })
    );
  });

  filters.appendChild(searchField);
  filters.appendChild(sortSelect);
  filters.appendChild(categorySelect);
  container.appendChild(filters);

  const grid = createElement("div", { className: "grid grid-3 section" });
  container.appendChild(grid);

  const renderList = () => {
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
          createElement("h3", { text: "Brak wyników" }),
          createElement("p", { text: "Zmień filtry lub usuń kryteria wyszukiwania." }),
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

  [searchField, sortSelect, categorySelect].forEach((field) => {
    field.addEventListener("input", renderList);
    field.addEventListener("change", renderList);
  });

  if (!products.length) {
    for (let i = 0; i < 6; i += 1) {
      grid.appendChild(createElement("div", { className: "card" }, [
        createElement("div", { className: "skeleton", attrs: { style: "height: 180px" } }),
        createElement("div", { className: "skeleton", attrs: { style: "width: 70%; height: 18px" } }),
        createElement("div", { className: "skeleton", attrs: { style: "width: 60%; height: 14px" } }),
      ]));
    }
  } else {
    renderList();
  }

  main.appendChild(container);
};
