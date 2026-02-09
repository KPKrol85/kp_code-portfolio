const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const SUBMIT_DELAY_MS = 800;
const GOAL_MIN_LENGTH = 24;

export function initContactForm() {
  const form = document.querySelector(".contact__form");

  if (!form) {
    return;
  }

  form.setAttribute("novalidate", "");

  const submitButton = form.querySelector('button[type="submit"]');
  const initialButtonLabel = submitButton?.textContent?.trim() || "Wyślij zapytanie";
  const feedback = form.querySelector("[data-form-feedback]");

  form.addEventListener("input", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement) || !target.getAttribute("name")) {
      return;
    }

    clearFieldValidation(form, target.getAttribute("name"));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearValidationState(form);

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      goal: String(formData.get("goal") || "").trim(),
    };

    const validationErrors = validatePayload(payload);

    if (validationErrors.length > 0) {
      showFeedback(feedback, validationErrors[0].message, "error");
      markInvalidFields(form, validationErrors);
      return;
    }

    setLoadingState(form, submitButton, initialButtonLabel, true);

    try {
      // Symulacja czasu odpowiedzi API. Backend może zostać podpięty w tym miejscu.
      await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));

      console.info("Lead form payload:", payload);
      form.reset();
      showFeedback(feedback, "Twoja wiadomość została wysłana.", "success");
    } catch (error) {
      console.error("Lead form submit failed", error);
      showFeedback(feedback, "Nie udało się wysłać formularza. Spróbuj ponownie.", "error");
    } finally {
      setLoadingState(form, submitButton, initialButtonLabel, false);
    }
  });
}

function validatePayload(payload) {
  const errors = [];

  if (!payload.name) {
    errors.push({ field: "name", message: "Podaj imię i nazwisko." });
  }

  if (!payload.email) {
    errors.push({ field: "email", message: "Podaj adres email." });
  } else if (!EMAIL_PATTERN.test(payload.email)) {
    errors.push({ field: "email", message: "Podaj poprawny adres email." });
  }

  if (!payload.goal) {
    errors.push({ field: "goal", message: "Opisz swój cel treningowy w kilku zdaniach." });
  } else if (payload.goal.length < GOAL_MIN_LENGTH) {
    errors.push({ field: "goal", message: `Wpisz minimum ${GOAL_MIN_LENGTH} znaki, żeby lepiej opisać cel.` });
  }

  return errors;
}

function markInvalidFields(form, errors) {
  errors.forEach(({ field, message }) => {
    const input = form.elements.namedItem(field);

    if (!(input instanceof HTMLElement)) {
      return;
    }

    const hintId = `${form.id}-${field}-hint`;
    const errorId = `${form.id}-${field}-error`;
    const errorElement = form.querySelector(`[data-field-error="${field}"]`);

    if (errorElement instanceof HTMLElement) {
      errorElement.textContent = message;
    }

    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", `${hintId} ${errorId}`);
  });

  const firstInvalidField = form.querySelector('[aria-invalid="true"]');
  firstInvalidField?.focus();
}

function clearValidationState(form) {
  const invalidFields = form.querySelectorAll('[aria-invalid="true"]');

  invalidFields.forEach((field) => {
    if (!(field instanceof HTMLElement)) {
      return;
    }

    const fieldName = field.getAttribute("name");

    field.removeAttribute("aria-invalid");

    if (!fieldName) {
      field.removeAttribute("aria-describedby");
      return;
    }

    field.setAttribute("aria-describedby", `${form.id}-${fieldName}-hint`);
  });

  const fieldErrors = form.querySelectorAll("[data-field-error]");

  fieldErrors.forEach((fieldError) => {
    fieldError.textContent = "";
  });
}

function clearFieldValidation(form, fieldName) {
  if (!fieldName) {
    return;
  }

  const input = form.elements.namedItem(fieldName);
  const errorElement = form.querySelector(`[data-field-error="${fieldName}"]`);

  if (errorElement instanceof HTMLElement) {
    errorElement.textContent = "";
  }

  if (!(input instanceof HTMLElement)) {
    return;
  }

  input.removeAttribute("aria-invalid");
  input.setAttribute("aria-describedby", `${form.id}-${fieldName}-hint`);
}

function setLoadingState(form, submitButton, initialButtonLabel, isLoading) {
  form.setAttribute("aria-busy", String(isLoading));

  if (!submitButton) {
    return;
  }

  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Wysyłanie…" : initialButtonLabel;
}

function showFeedback(feedbackElement, message, state) {
  if (!(feedbackElement instanceof HTMLElement)) {
    return;
  }

  feedbackElement.textContent = message;
  feedbackElement.dataset.state = state;
}
