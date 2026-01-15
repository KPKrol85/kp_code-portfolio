import { createElement, clearElement } from "../utils/dom.js";
import { formatCurrency } from "../utils/format.js";
import { validators } from "../utils/validators.js";
import { cartService } from "../services/cart.js";
import { purchasesService } from "../services/purchases.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { renderNotice } from "../components/uiStates.js";
import { setMeta } from "../utils/meta.js";
import { setButtonLoading, clearButtonLoading } from "../utils/ui-state.js";

export const renderCheckout = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { cart, products } = store.getState();

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Checkout" }));

  if (!cart.length) {
    renderNotice(container, {
      title: "Koszyk jest pusty",
      message: "Dodaj produkty do koszyka, aby kontynuowac.",
      action: { label: "Wroc do katalogu", href: "#/products" },
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  const form = createElement("form", { className: "card" });
  form.appendChild(createElement("h2", { text: "Dane zamowienia" }));

  const nameField = createElement("input", {
    className: "input",
    attrs: { id: "checkout-name", type: "text", name: "name", placeholder: "Imie i nazwisko" },
  });
  const emailField = createElement("input", {
    className: "input",
    attrs: { id: "checkout-email", type: "email", name: "email", placeholder: "E-mail" },
  });
  const companyField = createElement("input", {
    className: "input",
    attrs: { id: "checkout-company", type: "text", name: "company", placeholder: "Firma (opcjonalnie)" },
  });
  const taxIdField = createElement("input", {
    className: "input",
    attrs: { id: "checkout-tax-id", type: "text", name: "taxId", placeholder: "NIP (opcjonalnie)" },
  });

  const nameError = createElement("div", { className: "form-error" });
  const emailError = createElement("div", { className: "form-error" });
  const errorBox = createElement("div", { className: "form-error" });

  form.appendChild(createElement("div", { className: "form-field" }, [
    createElement("label", { text: "Imie i nazwisko", attrs: { for: "checkout-name" } }),
    nameField,
    nameError,
  ]));
  form.appendChild(createElement("div", { className: "form-field" }, [
    createElement("label", { text: "E-mail", attrs: { for: "checkout-email" } }),
    emailField,
    emailError,
  ]));
  form.appendChild(createElement("div", { className: "form-field" }, [
    createElement("label", { text: "Firma", attrs: { for: "checkout-company" } }),
    companyField,
  ]));
  form.appendChild(createElement("div", { className: "form-field" }, [
    createElement("label", { text: "NIP", attrs: { for: "checkout-tax-id" } }),
    taxIdField,
  ]));
  form.appendChild(errorBox);

  const submitButton = createElement("button", {
    className: "button block",
    text: "Zloz zamowienie",
    attrs: { type: "submit" },
  });
  form.appendChild(submitButton);

  const summary = createElement("div", { className: "card" });
  summary.appendChild(createElement("h2", { text: "Podsumowanie" }));
  let total = 0;
  const list = createElement("ul");
  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      return;
    }
    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    list.appendChild(
      createElement("li", { text: `${product.name} x${item.quantity} - ${formatCurrency(lineTotal)}` })
    );
  });
  summary.appendChild(list);
  summary.appendChild(createElement("p", { className: "price", text: formatCurrency(total) }));

  let isProcessing = false;
  const validateForm = () => {
    nameError.textContent = "";
    emailError.textContent = "";
    errorBox.textContent = "";

    const nameValid = validators.required(nameField.value) && validators.minLength(2)(nameField.value.trim());
    const emailValid = validators.email(emailField.value);

    if (!nameValid) {
      nameError.textContent = "Podaj imie i nazwisko (min. 2 znaki).";
    }
    if (!emailValid) {
      emailError.textContent = "Podaj poprawny e-mail.";
    }
    submitButton.disabled = !nameValid || !emailValid || isProcessing;
    return nameValid && emailValid;
  };

  const updateProcessingState = (processing) => {
    isProcessing = processing;
    if (processing) {
      setButtonLoading(submitButton, { loadingText: "Przetwarzanie..." });
    } else {
      clearButtonLoading(submitButton);
    }
    submitButton.disabled = processing || !validateForm();
  };

  [nameField, emailField].forEach((field) => {
    field.addEventListener("input", validateForm);
  });
  validateForm();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm() || isProcessing) {
      errorBox.textContent = "Popraw zaznaczone pola.";
      return;
    }

    updateProcessingState(true);
    const order = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      items: cart.map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: product ? product.price : 0,
        };
      }),
      total,
    };

    window.setTimeout(() => {
      purchasesService.addPurchase(order);
      cartService.clear();
      store.setState({ cart: [] });
      showToast("Zakup zakonczony sukcesem.");
      setMeta({
        title: "Dziekujemy za zakup",
        description: "Zakup zakonczony. Pliki zostaly dodane do Twojej biblioteki.",
      });
      location.hash = "#/library";
    }, 700);
  });

  const layout = createElement("div", { className: "grid grid-2 section" }, [form, summary]);
  container.appendChild(layout);
  main.appendChild(container);
};

export const renderCheckoutSuccess = () => {
  const main = document.getElementById("main-content");
  clearElement(main);
  setMeta({
    title: "Dziekujemy za zakup",
    description: "Zakup zakonczony. Pliki zostaly dodane do Twojej biblioteki.",
  });
  const container = createElement("section", { className: "container" }, [
    createElement("div", { className: "card" }, [
      createElement("h1", { text: "Dziekujemy za zakup!" }),
      createElement("p", { text: "Pliki zostaly dodane do Twojej biblioteki." }),
      createElement("div", { className: "nav-links" }, [
        createElement("a", { className: "button", text: "Przejdz do biblioteki", attrs: { href: "#/library" } }),
        createElement("a", { className: "button secondary", text: "Wroc do katalogu", attrs: { href: "#/products" } }),
      ]),
    ]),
  ]);
  main.appendChild(container);
};
