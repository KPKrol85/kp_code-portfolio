import { CONFIG } from "../config.js";
import { qs, on } from "./dom.js";
import { clearCart } from "./storage.js";
import { initFormFieldUX, validateFormFields } from "./form-ux.js";
import { clearUiState, setUiState } from "./ui-state.js";

export const initCheckout = () => {
  const form = qs(CONFIG.selectors.checkoutForm);
  if (!form) return;

  const status = qs(CONFIG.selectors.checkoutStatus) || qs("[data-checkout-status]", form);
  const successPanel = qs("[data-checkout-success]");

  form.noValidate = true;
  initFormFieldUX(form);

  on(form, "submit", (event) => {
    event.preventDefault();

    const { firstInvalidField } = validateFormFields(form);

    if (firstInvalidField) {
      setUiState(status, {
        type: "error",
        title: "Formularz zawiera błędy",
        message: "Uzupełnij wymagane pola i popraw oznaczone wartości.",
      });
      firstInvalidField.focus();
      return;
    }

    setUiState(status, {
      type: "success",
      title: "Zamówienie zapisane",
      message: "Możesz wrócić do strony głównej lub kontynuować zakupy.",
    });
    if (successPanel) {
      successPanel.hidden = false;
    }
    form.reset();
    form.hidden = true;
    clearCart();
  });

  on(form, "input", () => {
    clearUiState(status);
  });
};
