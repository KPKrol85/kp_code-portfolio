import { createElement, clearElement } from "../utils/dom.js";
import { formatCurrency } from "../utils/format.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { renderNotice } from "../components/uiStates.js";

export const renderCart = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { cart, products, productsStatus, productsError } = store.getState();

  if (productsStatus === "loading" || productsStatus === "idle") {
    const container = createElement("section", { className: "container" });
    container.appendChild(createElement("h1", { text: "Twoj koszyk" }));
    renderNotice(container, {
      title: "Ladowanie koszyka",
      message: "Trwa pobieranie danych produktow.",
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  if (productsStatus === "error") {
    const container = createElement("section", { className: "container" });
    container.appendChild(createElement("h1", { text: "Twoj koszyk" }));
    renderNotice(container, {
      title: "Nie udalo sie pobrac produktow",
      message: productsError || "Sprobuj ponownie pozniej.",
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Twój koszyk" }));

  if (!cart.length) {
    container.appendChild(
      createElement("div", { className: "notice" }, [
        createElement("h2", { text: "Koszyk jest pusty" }),
        createElement("p", { text: "Dodaj produkty, aby rozpocząć zakup." }),
        createElement("a", { className: "button", text: "Przeglądaj katalog", attrs: { href: "#/products" } }),
      ])
    );
    main.appendChild(container);
    return;
  }

  const itemsWrapper = createElement("div", { className: "grid" });
  let subtotal = 0;
  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      return;
    }
    subtotal += product.price * item.quantity;
    const card = createElement("div", { className: "card" });
    card.appendChild(createElement("h3", { text: product.name }));
    card.appendChild(createElement("p", { text: product.shortDescription }));
    const quantityField = createElement("input", {
      className: "input",
      attrs: { type: "number", min: "1", value: String(item.quantity) },
    });
    quantityField.addEventListener("change", () => {
      const value = Number(quantityField.value);
      cartService.updateItem(product.id, value);
      store.setState({ cart: cartService.getCart() });
      renderCart();
    });

    const removeButton = createElement("button", {
      className: "button secondary",
      text: "Usuń",
      attrs: { type: "button" },
    });
    removeButton.addEventListener("click", () => {
      cartService.removeItem(product.id);
      store.setState({ cart: cartService.getCart() });
      showToast("Usunięto z koszyka.");
      renderCart();
    });

    card.appendChild(createElement("p", { className: "price", text: formatCurrency(product.price) }));
    card.appendChild(quantityField);
    card.appendChild(removeButton);
    itemsWrapper.appendChild(card);
  });

  const summary = createElement("div", { className: "card" });
  const promoField = createElement("input", {
    className: "input",
    attrs: { type: "text", placeholder: "Kod rabatowy (mock)" },
  });
  const applyButton = createElement("button", {
    className: "button secondary",
    text: "Zastosuj",
    attrs: { type: "button" },
  });
  applyButton.addEventListener("click", () => {
    showToast("Kod rabatowy zastosowany (demo).");
  });

  summary.appendChild(createElement("h2", { text: "Podsumowanie" }));
  summary.appendChild(createElement("p", { text: `Suma: ${formatCurrency(subtotal)}` }));
  summary.appendChild(promoField);
  summary.appendChild(applyButton);
  summary.appendChild(
    createElement("a", { className: "button block", text: "Przejdź do checkout", attrs: { href: "#/checkout" } })
  );

  const layout = createElement("div", { className: "grid grid-2 section" }, [itemsWrapper, summary]);
  container.appendChild(layout);
  main.appendChild(container);
};
