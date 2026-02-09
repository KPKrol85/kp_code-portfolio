import { CONFIG } from "../config.js";
import { qs, qsa, on } from "./dom.js";
import { clearCart } from "./storage.js";

const showError = (input, message) => {
  const error = qs(`[data-error-for="${input.name}"]`);
  if (error) {
    error.textContent = message;
  }
  input.setAttribute("aria-invalid", "true");
};

const clearError = (input) => {
  const error = qs(`[data-error-for="${input.name}"]`);
  if (error) {
    error.textContent = "";
  }
  input.removeAttribute("aria-invalid");
};

export const initCheckout = () => {
  const form = qs(CONFIG.selectors.checkoutForm);
  if (!form) return;
  const status = qs(CONFIG.selectors.checkoutStatus);
  const successPanel = qs("[data-checkout-success]");

  const inputs = qsa("input, select, textarea", form);

  on(form, "submit", (event) => {
    event.preventDefault();
    let firstInvalid = null;

    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        const message = input.validationMessage || "Wypełnij to pole.";
        showError(input, message);
        if (!firstInvalid) firstInvalid = input;
      } else {
        clearError(input);
      }
    });

    if (firstInvalid) {
      if (status) status.textContent = "Uzupełnij wymagane pola formularza.";
      firstInvalid.focus();
      return;
    }

    if (status) status.textContent = "Zamówienie zostało zapisane (demo).";
    if (successPanel) {
      successPanel.hidden = false;
    }
    form.reset();
    form.hidden = true;
    clearCart();
  });
};
