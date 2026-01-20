import { createElement, clearElement } from "../utils/dom.js";
import { formatDate } from "../utils/format.js";
import { createDownloadLink } from "../utils/downloads.js";
import { purchasesService } from "../services/purchases.js";
import { store } from "../store/store.js";
import { renderNotice, createRetryButton } from "../components/uiStates.js";
import { content } from "../content/pl.js";

export const renderLibrary = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { products, productsStatus, productsError } = store.getState();
  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: content.library.title }));

  if (productsStatus === "loading" || productsStatus === "idle") {
    renderNotice(container, {
      title: content.states.library.loading.title,
      message: content.states.library.loading.message,
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  if (productsStatus === "error") {
    renderNotice(container, {
      title: content.states.products.error.title,
      message: productsError || content.states.products.error.message,
      action: { element: createRetryButton() },
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  const libraryItems = purchasesService.getLibraryItems();
  if (!libraryItems.length) {
    renderNotice(container, {
      title: content.states.library.empty.title,
      message: content.states.library.empty.message,
      action: { label: content.library.emptyCta, href: "#/products" },
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
    const downloadables = Array.isArray(product.downloadables) ? product.downloadables : [];
    downloadables.forEach((file) => {
      const link = createDownloadLink(file);
      if (!link) {
        return;
      }
      const item = createElement("li", {}, [link]);
      list.appendChild(item);
    });
    card.appendChild(list);
    grid.appendChild(card);
  });

  container.appendChild(grid);
  main.appendChild(container);
};
