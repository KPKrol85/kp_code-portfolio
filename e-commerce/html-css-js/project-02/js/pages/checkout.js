import { createElement, clearElement } from "../utils/dom.js";
import { navigateHash } from "../utils/navigation.js";
import { formatCurrency } from "../utils/format.js";
import { validators } from "../utils/validators.js";
import { cartService } from "../services/cart.js";
import { purchasesService } from "../services/purchases.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { actions } from "../store/actions.js";
import { setMeta } from "../utils/meta.js";
import { setButtonLoading, clearButtonLoading } from "../utils/ui-state.js";
import { renderNotice } from "../components/uiStates.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";
import { content } from "../content/pl.js";

export const renderCheckout = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { cart, products } = store.getState();
  const validItems = cart.filter((item) => products.some((entry) => entry.id === item.productId));
  const missingItems = cart.filter((item) => !products.some((entry) => entry.id === item.productId));

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: content.checkout.title }));

  if (!cart.length) {
    container.appendChild(
      renderEmptyState({
        title: content.states.checkout.empty.title,
        message: content.states.checkout.empty.message,
        ctaText: content.common.browseProducts,
        ctaHref: "#/products",
      })
    );
    main.appendChild(container);
    return;
  }

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
          renderCheckout();
        },
      })
    );
    renderMissingSection(container, missingItems);
    main.appendChild(container);
    return;
  }

  if (missingItems.length) {
    renderNotice(container, {
      title: "Wykryto niedostepne pozycje w koszyku.",
      message: "Usun brakujace pozycje, aby kontynuowac checkout.",
      headingTag: "h2",
    });
    renderMissingSection(container, missingItems);
  }

  const form = createElement("form", { className: "card" });
  form.appendChild(createElement("h2", { text: content.checkout.orderDetailsTitle }));

  const nameField = createElement("input", {
    className: "input",
    attrs: { id: "checkout-name", type: "text", name: "name", placeholder: "Imię i nazwisko" },
  });
  const emailField = createElement("input", {
    className: "input",
    attrs: { id: "checkout-email", type: "email", name: "email", placeholder: "E-mail" },
  });
  const companyField = createElement("input", {
    className: "input",
    attrs: {
      id: "checkout-company",
      type: "text",
      name: "company",
      placeholder: "Firma (opcjonalnie)",
    },
  });
  const taxIdField = createElement("input", {
    className: "input",
    attrs: { id: "checkout-tax-id", type: "text", name: "taxId", placeholder: "NIP (opcjonalnie)" },
  });

  const nameErrorId = "checkout-name-error";
  const emailErrorId = "checkout-email-error";
  const nameError = createElement("div", {
    className: "form-error",
    attrs: { id: nameErrorId },
  });
  const emailError = createElement("div", {
    className: "form-error",
    attrs: { id: emailErrorId },
  });
  const errorBox = createElement("div", {
    className: "form-error",
    attrs: { "aria-live": "polite" },
  });

  form.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", { text: "Imię i nazwisko", attrs: { for: "checkout-name" } }),
      nameField,
      nameError,
    ])
  );
  form.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", { text: "E-mail", attrs: { for: "checkout-email" } }),
      emailField,
      emailError,
    ])
  );
  form.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", { text: "Firma", attrs: { for: "checkout-company" } }),
      companyField,
    ])
  );
  form.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", { text: "NIP", attrs: { for: "checkout-tax-id" } }),
      taxIdField,
    ])
  );
  form.appendChild(errorBox);

  const submitButton = createElement("button", {
    className: "button block",
    text: content.checkout.submit,
    attrs: { type: "submit" },
  });
  form.appendChild(submitButton);

  const summary = createElement("div", { className: "card" });
  summary.appendChild(createElement("h2", { text: content.common.summaryTitle }));
  let total = 0;
  const list = createElement("ul");
  validItems.forEach((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      return;
    }
    const lineTotal = product.price * item.quantity;
    total += lineTotal;
    list.appendChild(
      createElement("li", {
        text: `${product.name} x${item.quantity} - ${formatCurrency(lineTotal)}`,
      })
    );
  });
  summary.appendChild(list);
  summary.appendChild(createElement("p", { className: "price", text: formatCurrency(total) }));

  let isProcessing = false;
  const validateForm = () => {
    nameError.textContent = "";
    emailError.textContent = "";
    errorBox.textContent = "";

    const nameValid =
      validators.required(nameField.value) && validators.minLength(2)(nameField.value.trim());
    const emailValid = validators.email(emailField.value);

    if (!nameValid) {
      nameError.textContent = "Podaj imię i nazwisko (min. 2 znaki).";
      nameField.setAttribute("aria-invalid", "true");
      nameField.setAttribute("aria-describedby", nameErrorId);
    } else {
      nameField.removeAttribute("aria-invalid");
      nameField.removeAttribute("aria-describedby");
    }
    if (!emailValid) {
      emailError.textContent = "Podaj poprawny e-mail.";
      emailField.setAttribute("aria-invalid", "true");
      emailField.setAttribute("aria-describedby", emailErrorId);
    } else {
      emailField.removeAttribute("aria-invalid");
      emailField.removeAttribute("aria-describedby");
    }
    submitButton.disabled = !nameValid || !emailValid || isProcessing;
    return nameValid && emailValid;
  };

  const updateProcessingState = (processing) => {
    isProcessing = processing;
    if (processing) {
      setButtonLoading(submitButton, { loadingText: content.common.processing });
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
      actions.cart.clearCart();
      showToast(content.toasts.checkoutSuccess);
      setMeta({
        title: content.checkout.success.metaTitle,
        description: content.checkout.success.metaDescription,
      });
      navigateHash("#/library");
    }, 700);
  });

  const layout = createElement("div", { className: "grid grid-2 section" }, [form, summary]);
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
      renderCheckout();
    });
    card.appendChild(removeButton);
    list.appendChild(card);
  });
  section.appendChild(list);
  container.appendChild(section);
};

export const renderCheckoutSuccess = () => {
  const main = document.getElementById("main-content");
  clearElement(main);
  setMeta({
    title: content.checkout.success.metaTitle,
    description: content.checkout.success.metaDescription,
  });
  const container = createElement("section", { className: "container" }, [
    createElement("div", { className: "card" }, [
      createElement("h1", { text: content.checkout.success.title }),
      createElement("p", { text: content.checkout.success.message }),
      createElement("div", { className: "nav-links" }, [
        createElement("a", {
          className: "button",
          text: content.checkout.success.ctaLibrary,
          attrs: { href: "#/library" },
        }),
        createElement("a", {
          className: "button secondary",
          text: content.checkout.success.ctaCatalog,
          attrs: { href: "#/products" },
        }),
      ]),
    ]),
  ]);
  main.appendChild(container);
};
