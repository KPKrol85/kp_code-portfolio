import { createElement, clearElement } from "../utils/dom.js";
import { formatCurrency } from "../utils/format.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { actions } from "../store/actions.js";
import { renderNotice, createRetryButton } from "../components/uiStates.js";
import { withButtonLoading } from "../utils/ui-state.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";
import { content } from "../content/pl.js";

export const renderCart = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { cart, products, productsStatus, productsError } = store.getState();

  if (productsStatus === "loading" || productsStatus === "idle") {
    const container = createElement("section", { className: "container" });
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

  const itemsWrapper = createElement("div", { className: "grid" });
  let subtotal = 0;
  validItems.forEach((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      return;
    }
    subtotal += product.price * item.quantity;
    const card = createElement("div", { className: "card" });
    card.appendChild(createElement("h3", { text: product.name }));
    card.appendChild(createElement("p", { text: product.shortDescription }));
    const quantityId = `cart-qty-${product.id}`;
    const quantityLabel = createElement("label", {
      className: "sr-only",
      text: "Ilość",
      attrs: { for: quantityId },
    });
    const quantityField = createElement("input", {
      className: "input",
      attrs: { id: quantityId, type: "number", min: "1", value: String(item.quantity) },
    });
    quantityField.addEventListener("change", () => {
      const rawValue = Number(quantityField.value);
      const safeValue = Number.isFinite(rawValue) ? Math.max(1, Math.floor(rawValue)) : 1;
      quantityField.value = String(safeValue);
      cartService.updateItem(product.id, safeValue);
      actions.cart.setCart(cartService.getCart());
      renderCart();
    });

    const removeButton = createElement("button", {
      className: "button secondary",
      text: "Usuń",
      attrs: { type: "button" },
    });
    removeButton.addEventListener("click", () => {
      cartService.removeItem(product.id);
      actions.cart.setCart(cartService.getCart());
      showToast(content.toasts.removedFromCart);
      renderCart();
    });

    card.appendChild(
      createElement("p", { className: "price", text: formatCurrency(product.price) })
    );
    card.appendChild(quantityLabel);
    card.appendChild(quantityField);
    card.appendChild(removeButton);
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
    attrs: { id: "promo-code", type: "text", placeholder: "Kod rabatowy (mock)" },
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

  summary.appendChild(createElement("h2", { text: content.common.summaryTitle }));
  summary.appendChild(createElement("p", { text: `Suma: ${formatCurrency(subtotal)}` }));
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

  const layout = createElement("div", { className: "grid grid-2 section" }, [
    itemsWrapper,
    summary,
  ]);
  container.appendChild(layout);
  main.appendChild(container);
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
