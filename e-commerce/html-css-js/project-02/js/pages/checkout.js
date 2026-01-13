import { createElement, clearElement } from "../utils/dom.js";
import { formatCurrency } from "../utils/format.js";
import { validators } from "../utils/validators.js";
import { cartService } from "../services/cart.js";
import { purchasesService } from "../services/purchases.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";

export const renderCheckout = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { cart, products, user } = store.getState();

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Checkout" }));

  if (!cart.length) {
    container.appendChild(
      createElement("div", { className: "notice" }, [
        createElement("h2", { text: "Brak produktów" }),
        createElement("p", { text: "Dodaj produkty do koszyka, aby kontynuować." }),
        createElement("a", { className: "button", text: "Wróć do katalogu", attrs: { href: "#/products" } }),
      ])
    );
    main.appendChild(container);
    return;
  }

  if (!user) {
    container.appendChild(
      createElement("div", { className: "notice" }, [
        createElement("h2", { text: "Zaloguj się" }),
        createElement("p", { text: "Aby ukończyć zakup, potrzebujemy aktywnego konta." }),
        createElement("a", { className: "button", text: "Przejdź do logowania", attrs: { href: "#/auth" } }),
      ])
    );
  }

  const form = createElement("form", { className: "card" });
  form.appendChild(createElement("h2", { text: "Dane zamówienia" }));

  const nameField = createElement("input", {
    className: "input",
    attrs: { type: "text", name: "name", placeholder: "Imię i nazwisko" },
  });
  const emailField = createElement("input", {
    className: "input",
    attrs: { type: "email", name: "email", placeholder: "E-mail" },
  });
  const addressField = createElement("textarea", {
    className: "textarea",
    attrs: { name: "address", rows: "3", placeholder: "Adres rozliczeniowy" },
  });
  const licenseSelect = createElement("select", {
    className: "select",
    attrs: { name: "license" },
  });
  [
    { value: "Personal", label: "Licencja Personal" },
    { value: "Commercial", label: "Licencja Commercial" },
  ].forEach((option) => {
    licenseSelect.appendChild(
      createElement("option", { text: option.label, attrs: { value: option.value } })
    );
  });

  const termsCheckbox = createElement("input", {
    attrs: { type: "checkbox", id: "terms" },
  });
  const termsLabel = createElement("label", { text: "Akceptuję regulamin i politykę prywatności", attrs: { for: "terms" } });
  const termsWrapper = createElement("div", { className: "form-field" }, [termsCheckbox, termsLabel]);

  const errorBox = createElement("div", { className: "form-error" });

  form.appendChild(createElement("div", { className: "form-field" }, [
    createElement("label", { text: "Imię i nazwisko" }),
    nameField,
  ]));
  form.appendChild(createElement("div", { className: "form-field" }, [
    createElement("label", { text: "E-mail" }),
    emailField,
  ]));
  form.appendChild(createElement("div", { className: "form-field" }, [
    createElement("label", { text: "Adres" }),
    addressField,
  ]));
  form.appendChild(createElement("div", { className: "form-field" }, [
    createElement("label", { text: "Licencja" }),
    licenseSelect,
  ]));
  form.appendChild(termsWrapper);
  form.appendChild(errorBox);

  const submitButton = createElement("button", {
    className: "button block",
    text: "Złóż zamówienie",
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
    total += product.price * item.quantity;
    list.appendChild(
      createElement("li", { text: `${product.name} x${item.quantity} — ${formatCurrency(product.price * item.quantity)}` })
    );
  });
  summary.appendChild(list);
  summary.appendChild(createElement("p", { className: "price", text: formatCurrency(total) }));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorBox.textContent = "";
    const errors = [];

    if (!validators.required(nameField.value)) {
      errors.push("Podaj imię i nazwisko.");
    }
    if (!validators.email(emailField.value)) {
      errors.push("Podaj poprawny e-mail.");
    }
    if (!validators.required(addressField.value)) {
      errors.push("Podaj adres rozliczeniowy.");
    }
    if (!termsCheckbox.checked) {
      errors.push("Zaakceptuj regulamin i politykę prywatności.");
    }
    if (!user) {
      errors.push("Musisz być zalogowany, aby złożyć zamówienie.");
    }

    if (errors.length) {
      errorBox.textContent = errors.join(" ");
      return;
    }

    const order = {
      id: crypto.randomUUID(),
      items: [...cart],
      total,
      license: licenseSelect.value,
      createdAt: new Date().toISOString(),
    };

    const libraryItems = cart.map((item) => ({
      productId: item.productId,
      license: licenseSelect.value,
      purchasedAt: new Date().toISOString(),
    }));

    purchasesService.addOrder(user.id, order);
    purchasesService.addToLibrary(user.id, libraryItems);
    cartService.clear();
    store.setState({ cart: [] });
    showToast("Zakup zakończony sukcesem.");
    location.hash = "#/checkout/success";
  });

  const layout = createElement("div", { className: "grid grid-2 section" }, [form, summary]);
  container.appendChild(layout);
  main.appendChild(container);
};

export const renderCheckoutSuccess = () => {
  const main = document.getElementById("main-content");
  clearElement(main);
  const container = createElement("section", { className: "container" }, [
    createElement("div", { className: "card" }, [
      createElement("h1", { text: "Dziękujemy za zakup!" }),
      createElement("p", { text: "Pliki zostały dodane do Twojej biblioteki." }),
      createElement("div", { className: "nav-links" }, [
        createElement("a", { className: "button", text: "Przejdź do biblioteki", attrs: { href: "#/library" } }),
        createElement("a", { className: "button secondary", text: "Wróć do katalogu", attrs: { href: "#/products" } }),
      ]),
    ]),
  ]);
  main.appendChild(container);
};
