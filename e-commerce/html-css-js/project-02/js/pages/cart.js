import { createElement, clearElement } from "../utils/dom.js";
import { parseHash } from "../utils/navigation.js";
import { formatCurrency } from "../utils/format.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { actions } from "../store/actions.js";
import { renderNotice, createRetryButton } from "../components/uiStates.js";
import { withButtonLoading } from "../utils/ui-state.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";
import { content } from "../content/pl.js";
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";

const QUANTITY_DEBOUNCE_MS = 120;

const parseQuantityValue = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  // Keep Math.floor for fractional input to align with cartService normalization.
  return Math.floor(parsed);
};

const normalizeQuantity = (value) => Math.max(1, value);

const getDisplayQuantity = (input) => {
  const parsed = parseQuantityValue(input.value);
  if (parsed === null || parsed < 1) {
    const lastValid = Number(input.dataset.lastValidQty);
    if (Number.isFinite(lastValid) && lastValid > 0) {
      return lastValid;
    }
    return 1;
  }
  return normalizeQuantity(parsed);
};

const updateLineSubtotal = (card, quantity, unitPrice) => {
  const subtotalNode = card.querySelector("[data-cart-line-total]");
  if (!subtotalNode) {
    return;
  }
  if (quantity > 1) {
    subtotalNode.textContent = `${quantity} x ${formatCurrency(unitPrice)} = ${formatCurrency(
      unitPrice * quantity
    )}`;
    subtotalNode.hidden = false;
  } else {
    subtotalNode.textContent = "";
    subtotalNode.hidden = true;
  }
};

const updateCartTotal = (itemsWrapper, totalNode) => {
  if (!itemsWrapper || !totalNode) {
    return;
  }
  const inputs = itemsWrapper.querySelectorAll("[data-cart-quantity]");
  let total = 0;
  inputs.forEach((input) => {
    const price = Number(input.dataset.unitPrice);
    if (!Number.isFinite(price)) {
      return;
    }
    const quantity = getDisplayQuantity(input);
    total += price * quantity;
  });
  totalNode.textContent = formatCurrency(total);
};

const updateStepperState = (card, quantity) => {
  if (!card) {
    return;
  }
  const decButton = card.querySelector("[data-action=\"dec\"]");
  if (decButton instanceof HTMLButtonElement) {
    decButton.disabled = quantity <= 1;
  }
};

const updateQuantityUI = (input, quantity, itemsWrapper, totalNode, options = {}) => {
  const { syncValue = true } = options;
  if (syncValue) {
    input.value = String(quantity);
  }
  input.dataset.lastValidQty = String(quantity);
  const card = input.closest("[data-product-id]");
  const unitPrice = Number(input.dataset.unitPrice);
  if (card && Number.isFinite(unitPrice)) {
    updateLineSubtotal(card, quantity, unitPrice);
  }
  updateCartTotal(itemsWrapper, totalNode);
  updateStepperState(card, quantity);
};

export const renderCart = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const addBreadcrumbs = (container) => {
    const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(parseHash().pathname));
    if (breadcrumbs) {
      container.appendChild(breadcrumbs);
    }
  };

  const { cart, products, productsStatus, productsError } = store.getState();

  if (productsStatus === "loading" || productsStatus === "idle") {
    const container = createElement("section", { className: "container" });
    addBreadcrumbs(container);
    container.appendChild(createElement("h1", { text: content.cart.title }));
    renderNotice(container, {
      title: content.states.cart.loading.title,
      message: content.states.cart.loading.message,
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  if (productsStatus === "error") {
    const container = createElement("section", { className: "container" });
    addBreadcrumbs(container);
    container.appendChild(createElement("h1", { text: content.cart.title }));
    renderNotice(container, {
      title: content.states.products.error.title,
      message: productsError || content.states.products.error.message,
      action: { element: createRetryButton() },
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  const container = createElement("section", { className: "container" });
  addBreadcrumbs(container);
  container.appendChild(createElement("h1", { text: content.cart.title }));

  const validItems = cart.filter((item) => products.some((entry) => entry.id === item.productId));
  const missingItems = cart.filter((item) => !products.some((entry) => entry.id === item.productId));

  if (!validItems.length && missingItems.length) {
    container.appendChild(
      renderEmptyState({
        title: "Nie mozemy wyswietlic pozycji z koszyka.",
        message: "Wszystkie pozycje sa niedostepne. Usun je, aby kontynuowac.",
        ctaText: "Wyczysc niedostepne",
        onCta: () => {
          const nextCart = cart.filter(
            (item) => !missingItems.some((missing) => missing.productId === item.productId)
          );
          cartService.saveCart(nextCart);
          actions.cart.setCart(nextCart);
          renderCart();
        },
      })
    );
    renderMissingSection(container, missingItems);
    main.appendChild(container);
    return;
  }

  if (!cart.length) {
    container.appendChild(
      renderEmptyState({
        title: content.states.cart.empty.title,
        message: content.states.cart.empty.message,
        ctaText: content.common.browseProducts,
        ctaHref: "#/products",
      })
    );
    main.appendChild(container);
    return;
  }

  if (missingItems.length) {
    renderNotice(container, {
      title: "Wykryto niedostepne pozycje w koszyku.",
      message: "Usun brakujace pozycje, aby kontynuowac zakupy.",
      headingTag: "h2",
    });
    renderMissingSection(container, missingItems);
  }

  const itemsWrapper = createElement("div", {
    className: "grid cart-items",
    attrs: { "data-cart-list": "true" },
  });
  const pendingQuantityUpdates = new Map();
  let subtotal = 0;
  validItems.forEach((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      return;
    }
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    const card = createElement("div", {
      className: "card",
      attrs: { "data-product-id": product.id, "data-cart-item": "true" },
    });
    card.appendChild(createElement("h3", { text: product.name }));
    card.appendChild(createElement("p", { text: product.shortDescription }));
    const quantityId = `cart-qty-${product.id}`;
    const quantityLabel = createElement("label", {
      className: "sr-only",
      text: "Ilość",
      attrs: { for: quantityId },
    });
    const quantityField = createElement("input", {
      className: "input cart-quantity-stepper__input",
      attrs: {
        id: quantityId,
        type: "number",
        min: "1",
        step: "1",
        value: String(item.quantity),
        inputmode: "numeric",
        "aria-label": "Ilość produktu",
        "data-cart-quantity": "true",
        "data-role": "qty",
        "data-product-id": product.id,
        "data-unit-price": String(product.price),
        "data-last-valid-qty": String(item.quantity),
      },
    });
    const quantityStepper = createElement("div", { className: "cart-quantity-stepper" });
    const decrementButton = createElement("button", {
      className: "button secondary cart-quantity-stepper__btn",
      text: "-",
      attrs: {
        type: "button",
        "data-action": "dec",
        "data-product-id": product.id,
        "aria-label": "Zmniejsz ilość",
      },
    });
    decrementButton.disabled = item.quantity <= 1;
    const incrementButton = createElement("button", {
      className: "button secondary cart-quantity-stepper__btn",
      text: "+",
      attrs: {
        type: "button",
        "data-action": "inc",
        "data-product-id": product.id,
        "aria-label": "Zwiększ ilość",
      },
    });
    quantityStepper.appendChild(decrementButton);
    quantityStepper.appendChild(quantityField);
    quantityStepper.appendChild(incrementButton);

    const removeButton = createElement("button", {
      className: "button secondary cart-item__remove",
      text: "Usuń",
      attrs: { type: "button" },
    });
    removeButton.addEventListener("click", () => {
      cartService.removeItem(product.id);
      actions.cart.setCart(cartService.getCart());
      showToast(content.toasts.removedFromCart);
      renderCart();
    });

    const pricing = createElement("div", { className: "cart-item__pricing" });
    const unitPrice = createElement("div", {
      className: "price cart-item__unit-price",
      text: formatCurrency(product.price),
    });
    unitPrice.appendChild(
      createElement("span", {
        className: "cart-item__unit-suffix",
        text: " / szt.",
      })
    );
    const lineTotalText =
      item.quantity > 1
        ? `${item.quantity} x ${formatCurrency(product.price)} = ${formatCurrency(lineTotal)}`
        : "";
    const lineTotalNode = createElement("div", {
      className: "cart-item__line-total",
      text: lineTotalText,
      attrs: { "data-cart-line-total": "true" },
    });
    if (item.quantity <= 1) {
      lineTotalNode.hidden = true;
    }
    pricing.appendChild(unitPrice);
    pricing.appendChild(lineTotalNode);
    card.appendChild(pricing);
    card.appendChild(quantityLabel);
    const actionsRow = createElement("div", { className: "cart-item__actions" });
    actionsRow.appendChild(quantityStepper);
    actionsRow.appendChild(removeButton);
    card.appendChild(actionsRow);
    itemsWrapper.appendChild(card);
  });

  const summary = createElement("div", { className: "card" });
  const promoLabel = createElement("label", {
    className: "sr-only",
    text: "Kod rabatowy",
    attrs: { for: "promo-code" },
  });
  const promoField = createElement("input", {
    className: "input",
    attrs: {
      id: "promo-code",
      type: "text",
      placeholder: "Kod rabatowy (mock)",
      autocomplete: "off",
      inputmode: "text",
      autocapitalize: "characters",
      spellcheck: "false",
    },
  });
  const applyButton = createElement("button", {
    className: "button secondary",
    text: "Zastosuj",
    attrs: { type: "button" },
  });
  applyButton.addEventListener("click", () => {
    withButtonLoading(
      applyButton,
      async () => {
        showToast(content.toasts.promoApplied);
      },
      { loadingText: content.common.processing }
    );
  });

  const totalValue = createElement("strong", {
    text: formatCurrency(subtotal),
    attrs: {
      "data-cart-total": "true",
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
    },
  });
  summary.appendChild(createElement("h2", { text: content.common.summaryTitle }));
  summary.appendChild(
    createElement("p", { className: "cart-total" }, [
      createElement("span", { text: "Suma: " }),
      totalValue,
    ])
  );
  summary.appendChild(promoLabel);
  summary.appendChild(promoField);
  summary.appendChild(applyButton);
  const clearButton = createElement("button", {
    className: "button secondary",
    text: "Wyczyść koszyk",
    attrs: { type: "button" },
  });
  clearButton.addEventListener("click", () => {
    cartService.clear();
    actions.cart.clearCart();
    renderCart();
  });
  summary.appendChild(clearButton);
  summary.appendChild(
    createElement("a", {
      className: "button block",
      text: content.cart.checkoutCta,
      attrs: { href: "#/checkout" },
    })
  );

  const layout = createElement("div", { className: "grid grid-2 section cart-layout" }, [
    itemsWrapper,
    summary,
  ]);
  container.appendChild(layout);
  main.appendChild(container);

  const scheduleQuantityUpdate = (productId, quantity) => {
    const existingTimer = pendingQuantityUpdates.get(productId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    const timer = window.setTimeout(() => {
      pendingQuantityUpdates.delete(productId);
      const nextCart = cartService.updateItem(productId, quantity);
      actions.cart.setCart(nextCart);
    }, QUANTITY_DEBOUNCE_MS);
    pendingQuantityUpdates.set(productId, timer);
  };

  const commitQuantityUpdate = (productId, quantity) => {
    const existingTimer = pendingQuantityUpdates.get(productId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      pendingQuantityUpdates.delete(productId);
    }
    const nextCart = cartService.updateItem(productId, quantity);
    actions.cart.setCart(nextCart);
  };

  itemsWrapper.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest("button[data-action]");
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    const action = button.dataset.action;
    if (action !== "inc" && action !== "dec") {
      return;
    }
    const item = button.closest("[data-cart-item]");
    if (!item) {
      return;
    }
    const input = item.querySelector("[data-role=\"qty\"]");
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    const current = getDisplayQuantity(input);
    const nextQuantity = normalizeQuantity(current + (action === "inc" ? 1 : -1));
    updateQuantityUI(input, nextQuantity, itemsWrapper, totalValue);
    const productId = item.dataset.productId || input.dataset.productId;
    if (productId) {
      commitQuantityUpdate(productId, nextQuantity);
      renderCart();
    }
  });

  itemsWrapper.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    if (!target.matches("[data-cart-quantity]")) {
      return;
    }
    const rawQuantity = parseQuantityValue(target.value);
    if (rawQuantity === null || rawQuantity < 1) {
      return;
    }
    const safeQuantity = normalizeQuantity(rawQuantity);
    updateQuantityUI(target, safeQuantity, itemsWrapper, totalValue, { syncValue: false });
    const productId = target.dataset.productId;
    if (productId) {
      scheduleQuantityUpdate(productId, safeQuantity);
    }
  });

  const handleQuantityCommit = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    if (!target.matches("[data-cart-quantity]")) {
      return;
    }
    const parsed = parseQuantityValue(target.value);
    const normalized = normalizeQuantity(parsed !== null && parsed >= 1 ? parsed : 1);
    updateQuantityUI(target, normalized, itemsWrapper, totalValue);
    const productId = target.dataset.productId;
    if (productId) {
      commitQuantityUpdate(productId, normalized);
      renderCart();
    }
  };

  itemsWrapper.addEventListener("change", handleQuantityCommit);
  itemsWrapper.addEventListener("blur", handleQuantityCommit, true);
};

const renderMissingSection = (container, missingItems) => {
  const section = createElement("div", { className: "section" });
  section.appendChild(createElement("h2", { text: "Niedostepne pozycje" }));
  const list = createElement("div", { className: "grid" });
  missingItems.forEach((item) => {
    const card = createElement("div", { className: "card" });
    card.appendChild(createElement("h3", { text: "Produkt niedostepny" }));
    card.appendChild(createElement("p", { text: `ID: ${item.productId}` }));
    card.appendChild(
      createElement("p", {
        text: "Ten produkt nie jest juz dostepny w katalogu.",
      })
    );
    const removeButton = createElement("button", {
      className: "button secondary",
      text: "Usun",
      attrs: { type: "button" },
    });
    removeButton.addEventListener("click", () => {
      cartService.removeItem(item.productId);
      actions.cart.setCart(cartService.getCart());
      renderCart();
    });
    card.appendChild(removeButton);
    list.appendChild(card);
  });
  section.appendChild(list);
  container.appendChild(section);
};
