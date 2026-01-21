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
import { renderNotice, createRetryButton } from "../components/uiStates.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";
import { content } from "../content/pl.js";

export const renderCheckout = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { cart, products, productsStatus, productsError } = store.getState();

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: content.checkout.title }));

  if (productsStatus === "loading" || productsStatus === "idle") {
    renderNotice(container, {
      title: content.states.cart.loading.title,
      message: content.states.cart.loading.message,
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

  const safeProducts = Array.isArray(products) ? products : [];
  const validItems = cart.filter((item) =>
    safeProducts.some((entry) => entry.id === item.productId)
  );
  const missingItems = cart.filter(
    (item) => !safeProducts.some((entry) => entry.id === item.productId)
  );

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
    const missingNotice = createElement("div", { className: "card" });
    missingNotice.appendChild(
      createElement("h2", { text: "Wykryto niedostepne pozycje w koszyku." })
    );
    missingNotice.appendChild(
      createElement("p", {
        text: "Usun ponizsze pozycje, aby kontynuowac skladanie zamowienia.",
      })
    );
    const missingList = createElement("ul");
    missingItems.forEach((item) => {
      missingList.appendChild(createElement("li", { text: `ID: ${item.productId}` }));
    });
    missingNotice.appendChild(missingList);
    const removeAllButton = createElement("button", {
      className: "button secondary",
      text: "Usun niedostepne produkty",
      attrs: { type: "button" },
    });
    const removeMissingItems = () => {
      const missingIds = new Set(missingItems.map((item) => item.productId));
      const nextCart = cart.filter((item) => !missingIds.has(item.productId));
      cartService.saveCart(nextCart);
      actions.cart.setCart(nextCart);
      renderCheckout();
    };
    removeAllButton.addEventListener("click", removeMissingItems);
    missingNotice.appendChild(removeAllButton);
    container.appendChild(missingNotice);
    renderMissingSection(container, missingItems);
  }

  const errorBoxId = "checkout-form-errors";
  const form = createElement("form", {
    className: "card",
    attrs: { "aria-describedby": errorBoxId },
  });
  form.appendChild(createElement("h2", { text: content.checkout.orderDetailsTitle }));

  const nameField = createElement("input", {
    className: "input",
    attrs: {
      id: "checkout-name",
      type: "text",
      name: "name",
      placeholder: "Imię i nazwisko",
      autocomplete: "name",
      inputmode: "text",
      autocapitalize: "words",
      spellcheck: "false",
    },
  });
  const emailField = createElement("input", {
    className: "input",
    attrs: {
      id: "checkout-email",
      type: "email",
      name: "email",
      placeholder: "E-mail",
      autocomplete: "email",
      inputmode: "email",
      autocapitalize: "none",
      spellcheck: "false",
    },
  });
  const companyField = createElement("input", {
    className: "input",
    attrs: {
      id: "checkout-company",
      type: "text",
      name: "company",
      placeholder: "Firma (opcjonalnie)",
      autocomplete: "organization",
      inputmode: "text",
      autocapitalize: "words",
    },
  });
  const taxIdField = createElement("input", {
    className: "input",
    attrs: {
      id: "checkout-tax-id",
      type: "text",
      name: "taxId",
      placeholder: "NIP (opcjonalnie)",
      inputmode: "numeric",
      autocomplete: "off",
      autocapitalize: "none",
      spellcheck: "false",
    },
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
    attrs: { id: errorBoxId, role: "alert" },
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
    const product = safeProducts.find((entry) => entry.id === item.productId);
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
  const applyValidation = () => {
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
    const isValid = nameValid && emailValid;
    submitButton.disabled = !isValid || isProcessing;
    return { nameValid, emailValid, isValid };
  };
  const validateForm = () => applyValidation().isValid;

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

    const { nameValid, emailValid, isValid } = applyValidation();

    if (isProcessing) {
      return;
    }

    if (missingItems.length) {
      return;
    }

    if (!isValid) {
      errorBox.textContent = "Popraw zaznaczone pola.";
      const firstInvalid = !nameValid ? nameField : !emailValid ? emailField : null;
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    updateProcessingState(true);
    const order = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      items: validItems.map((item) => {
        const product = safeProducts.find((entry) => entry.id === item.productId);
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
