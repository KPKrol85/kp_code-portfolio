import { qs, on } from "./dom.js";
import { initFormFieldUX, setFormStatus, setSubmitState, validateFormFields } from "./form-ux.js";

export const initContactForm = () => {
  const form = qs("[data-contact-form]");
  if (!form) return;

  form.noValidate = true;
  initFormFieldUX(form);

  on(form, "submit", (event) => {
    event.preventDefault();

    const { firstInvalidField } = validateFormFields(form);

    if (firstInvalidField) {
      setFormStatus(form, "Popraw pola oznaczone błędem przed wysyłką.", "error");
      firstInvalidField.focus();
      return;
    }

    setSubmitState(form, true, "Wysyłanie wiadomości...");
    setFormStatus(form, "Wiadomość jest wysyłana...", "info");

    window.setTimeout(() => {
      setSubmitState(form, false);
      setFormStatus(form, "Dziękujemy! Odpowiemy na wiadomość najszybciej jak to możliwe (demo).", "success");
      form.reset();
    }, 500);
  });
};
