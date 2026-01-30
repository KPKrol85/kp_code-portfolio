import { t } from "../content/index.js";
import { createElement, clearElement } from "../utils/dom.js";
import { getVisibleProducts } from "../utils/products.js";

import { createProductCard } from "./productCard.js";
import { renderEmptyState } from "./ui-state-helpers.js";
import { renderDataState } from "./uiStates.js";

const VISIBLE_ROWS = 5;
const ROWS_STEP = 5;
const PRODUCT_COLUMNS = 3;

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

export const createProductsGrid = ({ onAddToCart, showMoreLabel } = {}) => {
  const grid = createElement("div", { className: "grid grid-3 section products-grid" });
  const resultsCount = createElement("p", {
    className: "products-count",
    attrs: { "aria-live": "polite", role: "status", "aria-atomic": "true" },
  });
  resultsCount.hidden = true;
  const resolvedShowMoreLabel = showMoreLabel || t("products.grid.showMore");
  const showMoreButton = createElement("button", {
    className: "button secondary block products-show-more",
    text: resolvedShowMoreLabel,
    attrs: { type: "button" },
  });
  showMoreButton.hidden = true;

  let lastRenderSignature = null;
  let lastRenderProducts = null;
  let latestProducts = [];
  let latestFilters = { query: "", category: "all", sort: "latest" };
  let productsVersion = 0;
  let visibleRows = VISIBLE_ROWS;

  const getGridColumns = () => {
    const template = window.getComputedStyle(grid).gridTemplateColumns;
    return parseGridColumns(template);
  };

  const renderList = ({ products, filters, emptyState, filteredEmptyState, force = false } = {}) => {
    if (products) {
      latestProducts = products;
    }
    if (filters) {
      latestFilters = { ...latestFilters, ...filters };
    }
    const { query = "", category = "all", sort = "latest" } = latestFilters;
    const signature = `${query}|${category}|${sort}`;
    const signatureChanged = signature !== lastRenderSignature;
    if (signatureChanged) {
      visibleRows = VISIBLE_ROWS;
    }
    if (!signatureChanged && latestProducts === lastRenderProducts && !force) {
      return;
    }
    lastRenderSignature = signature;
    lastRenderProducts = latestProducts;

    const filtered = getVisibleProducts(latestProducts, {
      query,
      category,
      sort,
      dataVersion: productsVersion,
    });
    if (!filtered.length) {
      clearElement(grid);
      resultsCount.hidden = true;
      showMoreButton.hidden = true;
      const emptyConfig = filteredEmptyState || emptyState;
      if (emptyConfig) {
        grid.appendChild(renderEmptyState(emptyConfig));
      }
      return;
    }

    const limit = visibleRows * getGridColumns();
    const visible = getVisibleProducts(latestProducts, {
      query,
      category,
      sort,
      limit,
      dataVersion: productsVersion,
    });
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
    resultsCount.textContent = t("products.count", {
      shown: visible.length,
      total: filtered.length,
    });
    resultsCount.hidden = false;
    const fragment = document.createDocumentFragment();
    visible.forEach((product) => {
      const id = String(product.id);
      let card = existingNodes.get(id);
      if (!card) {
        card = createProductCard(product, (productId) => {
          if (typeof onAddToCart === "function") {
            onAddToCart(productId);
          }
        });
      }
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);

    showMoreButton.hidden = visible.length >= filtered.length;
  };

  const renderState = ({ productsStatus, productsError, products }, config) => {
    const rendered = renderDataState(grid, {
      status: productsStatus,
      items: products,
      error: productsError,
      loading: config?.loading,
      errorState: config?.errorState,
      empty: config?.empty,
    });
    if (rendered) {
      resultsCount.hidden = true;
      showMoreButton.hidden = true;
    }
    return rendered;
  };

  const showMore = () => {
    visibleRows += ROWS_STEP;
    renderList({ force: true });
  };

  showMoreButton.addEventListener("click", showMore);

  return {
    grid,
    resultsCount,
    showMoreButton,
    renderList,
    renderState,
    updateProductsVersion(version) {
      productsVersion = version;
    },
    resetVisibleRows() {
      visibleRows = VISIBLE_ROWS;
    },
  };
};
