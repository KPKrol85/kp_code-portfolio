import { createElement, clearElement } from "../utils/dom.js";
import { formatDate } from "../utils/format.js";
import { purchasesService } from "../services/purchases.js";
import { store } from "../store/store.js";
import { renderNotice } from "../components/uiStates.js";

export const renderLibrary = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { products, productsStatus, productsError } = store.getState();
  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Twoja biblioteka" }));

  if (productsStatus === "loading" || productsStatus === "idle") {
    renderNotice(container, {
      title: "Ladowanie biblioteki",
      message: "Trwa pobieranie danych produktow.",
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  if (productsStatus === "error") {
    renderNotice(container, {
      title: "Nie udalo sie pobrac produktow",
      message: productsError || "Sprobuj ponownie pozniej.",
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  const libraryItems = purchasesService.getLibraryItems();
  if (!libraryItems.length) {
    renderNotice(container, {
      title: "Brak zakupow",
      message: "Po zakupie produkty pojawia sie tutaj automatycznie.",
      action: { label: "Przejdz do katalogu", href: "#/products" },
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  const latestByProduct = new Map();
  libraryItems.forEach((entry) => {
    const existing = latestByProduct.get(entry.productId);
    if (!existing || new Date(entry.purchasedAt) > new Date(existing.purchasedAt)) {
      latestByProduct.set(entry.productId, entry);
    }
  });

  const grid = createElement("div", { className: "grid grid-2 section" });
  Array.from(latestByProduct.values()).forEach((entry) => {
    const product = products.find((item) => item.id === entry.productId);
    if (!product) {
      return;
    }
    const card = createElement("div", { className: "card" });
    card.appendChild(createElement("h3", { text: product.name }));
    card.appendChild(createElement("p", { text: product.shortDescription }));
    card.appendChild(createElement("p", { text: `Zakupiono: ${formatDate(entry.purchasedAt)}` }));

    const list = createElement("ul");
    product.downloadables.forEach((file) => {
      const link = createElement("a", {
        text: `${file.name} (${file.size})`,
        attrs: { href: "assets/demo-download.txt", download: "" },
      });
      const item = createElement("li", {}, [link]);
      list.appendChild(item);
    });
    card.appendChild(list);
    grid.appendChild(card);
  });

  container.appendChild(grid);
  main.appendChild(container);
};
