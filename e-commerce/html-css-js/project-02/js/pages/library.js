import { createElement, clearElement } from "../utils/dom.js";
import { parseHash } from "../utils/navigation.js";
import { formatDate } from "../utils/format.js";
import { createDownloadLink } from "../utils/downloads.js";
import { purchasesService } from "../services/purchases.js";
import { store } from "../store/store.js";
import { renderNotice, createRetryButton } from "../components/uiStates.js";
import { content } from "../content/pl.js";
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { demoPurchasesService } from "../services/demo-purchases.js";

const PURCHASES_KEY = "kp_dv_purchases";

const withBase = (path) => {
  const baseUrl = new URL(document.baseURI);
  const basePath = baseUrl.pathname.replace(/\/index\.html?$/, "/");
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl.origin}${normalizedBase}${normalizedPath}`;
};

const MOCK_PRODUCTS = [
  {
    id: "core-ui-components-pack",
    title: "Core UI Components Pack",
    subtitle: "Panel + paczka CSS do pobrania",
    badge: "Pack 01",
    description: "Stripe-like panel do przeglądania komponentów + download paczki CSS.",
    panelUrl: "/products/core-ui-components-pack/platform/index.html",
    downloadUrl: "/products/core-ui-components-pack/package/core-ui-components-pack.css",
  },
];

const normalizePurchaseIds = (value) =>
  Array.isArray(value) ? value.filter((id) => typeof id === "string" && id.trim().length) : [];

const getPurchases = () => {
  const raw = localStorage.getItem(PURCHASES_KEY);
  if (!raw) {
    return [];
  }
  try {
    return normalizePurchaseIds(JSON.parse(raw));
  } catch (error) {
    return [];
  }
};

const addPurchase = (id) => {
  const trimmed = typeof id === "string" ? id.trim() : "";
  if (!trimmed) {
    return [];
  }
  const next = Array.from(new Set([trimmed, ...getPurchases()]));
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(next));
  return next;
};

const removePurchase = (id) => {
  const trimmed = typeof id === "string" ? id.trim() : "";
  const next = getPurchases().filter((item) => item !== trimmed);
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(next));
  return next;
};

const clearPurchases = () => {
  localStorage.removeItem(PURCHASES_KEY);
};

const createDemoTools = () => {
  const demoTools = createElement("div", { className: "card section" });
  demoTools.appendChild(createElement("h3", { text: "Demo tools" }));
  demoTools.appendChild(
    createElement("p", {
      text: "Symuluj zakup produktu bez backendu. Dane są zapisywane w localStorage.",
    })
  );
  const actions = createElement("div", { className: "flex-between" });
  const addButton = createElement("button", {
    className: "button",
    text: "Symuluj zakup",
    attrs: { type: "button" },
  });
  addButton.addEventListener("click", () => {
    addPurchase("core-ui-components-pack");
    renderLibrary();
  });
  const clearButton = createElement("button", {
    className: "button secondary",
    text: "Wyczyść zakupy",
    attrs: { type: "button" },
  });
  clearButton.addEventListener("click", () => {
    clearPurchases();
    renderLibrary();
  });
  actions.appendChild(addButton);
  actions.appendChild(clearButton);
  demoTools.appendChild(actions);
  return demoTools;
};

export const renderLibrary = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { products, productsStatus, productsError } = store.getState();
  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(parseHash().pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  container.appendChild(createElement("h1", { text: content.library.title }));

  const purchasedIds = getPurchases();
  const purchasedItems = MOCK_PRODUCTS.filter((product) => purchasedIds.includes(product.id));
  if (purchasedItems.length) {
    container.appendChild(createElement("h2", { text: "Twoje produkty" }));
    const grid = createElement("div", { className: "grid grid-2 section" });
    purchasedItems.forEach((item) => {
      const card = createElement("div", { className: "card card-product" });
      const header = createElement("div", { className: "flex-between" }, [
        createElement("h3", { text: item.title }),
        createElement("span", { className: "badge", text: item.badge }),
      ]);
      const subtitle = createElement("p", { text: item.subtitle });
      const description = createElement("p", { text: item.description });
      const actions = createElement("div", { className: "flex-between" }, [
        createElement("a", {
          className: "button",
          text: "Otwórz panel",
          attrs: {
            href: withBase(item.panelUrl),
            target: "_blank",
            rel: "noopener noreferrer",
          },
        }),
      ]);
      actions.appendChild(
        createElement("a", {
          className: "button secondary",
          text: "Pobierz paczkę",
          attrs: {
            href: withBase(item.downloadUrl),
            target: "_blank",
            rel: "noopener noreferrer",
          },
        })
      );
      card.appendChild(header);
      card.appendChild(subtitle);
      card.appendChild(description);
      card.appendChild(actions);
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  const demoItems = demoPurchasesService.getLibraryItems();
  if (demoItems.length) {
    const grid = createElement("div", { className: "grid grid-2 section" });
    demoItems.forEach((item) => {
      const card = createElement("div", { className: "card card-product" });
      const header = createElement("div", { className: "flex-between" }, [
        createElement("h3", { text: item.title }),
        createElement("span", { className: "badge", text: `v${item.version}` }),
      ]);
      const description = createElement("p", { text: item.description });
      const actions = createElement("div", { className: "flex-between" }, [
        createElement("a", {
          className: "button",
          text: "Otwórz panel",
          attrs: item.previewUrl?.startsWith("#/")
            ? { href: item.previewUrl }
            : { href: item.previewUrl, target: "_blank", rel: "noopener noreferrer" },
        }),
      ]);
      if (item.packageUrl) {
        actions.appendChild(
          createElement("a", {
            className: "button secondary",
            text: "Pobierz paczkę",
            attrs: {
              href: item.packageUrl,
              target: "_blank",
              rel: "noopener noreferrer",
            },
          })
        );
      }
      card.appendChild(header);
      card.appendChild(description);
      card.appendChild(actions);
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  if (!purchasedItems.length && !demoItems.length && (productsStatus === "loading" || productsStatus === "idle")) {
    renderNotice(container, {
      title: content.states.library.loading.title,
      message: content.states.library.loading.message,
      headingTag: "h2",
    });
    container.appendChild(createDemoTools());
    main.appendChild(container);
    return;
  }

  if (!purchasedItems.length && !demoItems.length && productsStatus === "error") {
    renderNotice(container, {
      title: content.states.products.error.title,
      message: productsError || content.states.products.error.message,
      action: { element: createRetryButton() },
      headingTag: "h2",
    });
    container.appendChild(createDemoTools());
    main.appendChild(container);
    return;
  }

  const libraryItems = purchasesService.getLibraryItems();
  if (!purchasedItems.length && !demoItems.length && !libraryItems.length) {
    renderNotice(container, {
      title: content.states.library.empty.title,
      message: "Brak zakupionych produktów. Po zakupie pojawią się tutaj pliki i panel.",
      action: { label: content.library.emptyCta, href: "#/products" },
      headingTag: "h2",
    });
    container.appendChild(createDemoTools());
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
  container.appendChild(createDemoTools());

  main.appendChild(container);
};
