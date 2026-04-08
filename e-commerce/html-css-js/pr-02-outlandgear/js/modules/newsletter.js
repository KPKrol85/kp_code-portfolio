import { qs, on } from "./dom.js";
import {
  initFormFieldUX,
  setFormStatus,
  setSubmitState,
  validateFormFields,
} from "./form-ux.js";

export const initNewsletterForm = () => {
  const form = qs("[data-newsletter-form]");
  if (!form) return;

  form.noValidate = true;
  initFormFieldUX(form);

  on(form, "submit", (event) => {
    event.preventDefault();

    const { firstInvalidField } = validateFormFields(form);

    if (firstInvalidField) {
      setFormStatus(
        form,
        "Podaj poprawny adres e-mail, aby zapisać się do newslettera.",
        "error",
      );
      firstInvalidField.focus();
      return;
    }

    setSubmitState(form, true, "Zapisywanie...");
    setFormStatus(form, "Zapisywanie do listy pokazowej...", "info");

    window.setTimeout(() => {
      setSubmitState(form, false);
      setFormStatus(
        form,
        "Dziękujemy. Adres został zapisany w prezentacyjnej wersji formularza.",
        "success",
      );
      form.reset();
    }, 500);
  });
};
