/*
 * Contact form progressive enhancement.
 * Keeps the form submittable without JavaScript and enhances it with validation and async submission when available.
 */

export const initForms = () => {
  const contactForm = document.querySelector("[data-contact-form]");
  if (!contactForm) {
    return;
  }

  const formMessage = contactForm.querySelector("[data-form-message]");
  const formSummary = contactForm.querySelector("[data-form-summary]");
  const submitButton = contactForm.querySelector("[data-form-submit]");
  const fields = Array.from(contactForm.querySelectorAll(".form__field")).filter((field) => !field.hasAttribute("data-honeypot-field"));
  const fieldInputs = fields
    .map((field) => field.querySelector("input, textarea, select"))
    .filter(Boolean);
  const canEnhanceSubmit =
    typeof window.fetch === "function" &&
    typeof window.FormData === "function";

  let isSubmitting = false;

  const getFieldErrorElement = (field) => field.querySelector(".form__error");

  const getBaseDescribedBy = (input) => {
    if (!input.dataset.describedbyBase) {
      input.dataset.describedbyBase = input.getAttribute("aria-describedby") || "";
    }

    return input.dataset.describedbyBase;
  };

  const setDescribedBy = (input, errorId) => {
    const ids = new Set(getBaseDescribedBy(input).split(" ").filter(Boolean));

    if (errorId) {
      ids.add(errorId);
    }

    const describedBy = Array.from(ids).join(" ");
    if (describedBy) {
      input.setAttribute("aria-describedby", describedBy);
      return;
    }

    input.removeAttribute("aria-describedby");
  };

  const clearDescribedByError = (input, errorId) => {
    const ids = new Set(getBaseDescribedBy(input).split(" ").filter(Boolean));
    ids.delete(errorId);

    const describedBy = Array.from(ids).join(" ");
    if (describedBy) {
      input.setAttribute("aria-describedby", describedBy);
      return;
    }

    input.removeAttribute("aria-describedby");
  };

  const setMessage = (message, state = "") => {
    if (!formMessage) {
      return;
    }

    formMessage.textContent = message;

    if (state) {
      formMessage.dataset.state = state;
      return;
    }

    delete formMessage.dataset.state;
  };

  const focusStatus = (element) => {
    if (!element || element.hidden || !element.textContent.trim()) {
      return;
    }

    element.focus({ preventScroll: false });
  };

  const validateField = (input) => {
    const value = input.value.trim();

    if (input.hasAttribute("required") && !value) {
      return { valid: false, message: "To pole jest wymagane." };
    }

    if (input.type === "email" && value && input.validity.typeMismatch) {
      return { valid: false, message: "Podaj poprawny adres e-mail." };
    }

    if (input.tagName === "TEXTAREA" && input.hasAttribute("minlength")) {
      const minLength = Number(input.getAttribute("minlength"));
      if (value.length < minLength) {
        return { valid: false, message: "Wiadomość powinna mieć co najmniej 10 znaków." };
      }
    }

    return { valid: true, message: "" };
  };

  const setFieldError = (field, message) => {
    const input = field.querySelector("input, textarea, select");
    const errorElement = getFieldErrorElement(field);

    if (!input || !errorElement) {
      return;
    }

    field.classList.add("form__field--error");
    errorElement.textContent = message;
    errorElement.hidden = false;
    errorElement.setAttribute("aria-hidden", "false");
    input.setAttribute("aria-invalid", "true");
    setDescribedBy(input, errorElement.id);
  };

  const clearFieldError = (field) => {
    const input = field.querySelector("input, textarea, select");
    const errorElement = getFieldErrorElement(field);

    if (!input || !errorElement) {
      return;
    }

    field.classList.remove("form__field--error");
    errorElement.textContent = "";
    errorElement.hidden = true;
    errorElement.setAttribute("aria-hidden", "true");
    input.removeAttribute("aria-invalid");
    clearDescribedByError(input, errorElement.id);
  };

  const clearAllFieldErrors = () => {
    fields.forEach(clearFieldError);
  };

  const renderSummary = (errors) => {
    if (!formSummary) {
      return;
    }

    if (!errors.length) {
      formSummary.hidden = true;
      formSummary.innerHTML = "";
      return;
    }

    formSummary.hidden = false;
    formSummary.innerHTML = "";

    const heading = document.createElement("p");
    heading.textContent = "Popraw błędy w formularzu:";

    const list = document.createElement("ul");
    errors.forEach(({ input, message }) => {
      const item = document.createElement("li");

      if (input?.id) {
        const link = document.createElement("a");
        link.href = `#${input.id}`;
        link.textContent = message;
        item.appendChild(link);
      } else {
        item.textContent = message;
      }

      list.appendChild(item);
    });

    formSummary.append(heading, list);
  };

  const validateFields = () => {
    const errors = [];

    fields.forEach((field) => {
      const input = field.querySelector("input, textarea, select");
      if (!input) {
        return;
      }

      const result = validateField(input);
      if (!result.valid) {
        setFieldError(field, result.message);
        errors.push({ input, message: result.message });
        return;
      }

      clearFieldError(field);
    });

    return errors;
  };

  const applyServerErrors = (errorMap = {}) => {
    const summaryErrors = [];

    fields.forEach((field) => {
      const input = field.querySelector("input, textarea, select");
      if (!input) {
        return;
      }

      const message = errorMap[input.name];
      if (!message) {
        clearFieldError(field);
        return;
      }

      setFieldError(field, message);
      summaryErrors.push({ input, message });
    });

    renderSummary(summaryErrors);
    return summaryErrors;
  };

  const setSubmittingState = (submitting) => {
    isSubmitting = submitting;
    contactForm.dataset.submitting = submitting ? "true" : "false";

    if (submitButton) {
      submitButton.disabled = submitting;
    }
  };

  const handleFieldEvent = (event) => {
    const input = event.target;
    const field = input.closest(".form__field");
    if (!field) {
      return;
    }

    const { valid, message } = validateField(input);
    if (valid) {
      clearFieldError(field);
      return;
    }

    if (event.type === "blur" || field.classList.contains("form__field--error")) {
      setFieldError(field, message);
    }
  };

  fieldInputs.forEach((input) => {
    input.addEventListener("input", handleFieldEvent);
    input.addEventListener("blur", handleFieldEvent);
  });

  contactForm.addEventListener("submit", async (event) => {
    const errors = validateFields();

    if (errors.length) {
      event.preventDefault();
      renderSummary(errors);
      setMessage("Uzupełnij wymagane pola formularza.", "error");
      errors[0].input.focus();
      focusStatus(formSummary);
      return;
    }

    renderSummary([]);
    setMessage("", "");

    if (isSubmitting) {
      event.preventDefault();
      return;
    }

    if (!canEnhanceSubmit) {
      return;
    }

    event.preventDefault();
    setSubmittingState(true);
    setMessage("Trwa wysyłanie wiadomości...", "pending");

    try {
      const response = await fetch(contactForm.dataset.formEndpoint || contactForm.action, {
        method: (contactForm.method || "post").toUpperCase(),
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok || !payload?.ok) {
        const summaryErrors = applyServerErrors(payload?.errors || {});
        const message =
          payload?.message ||
          "Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz bezpośrednio na adres kontakt@kp-code.pl.";

        setMessage(message, "error");

        if (summaryErrors.length) {
          summaryErrors[0].input.focus();
          focusStatus(formSummary);
        } else {
          focusStatus(formMessage);
        }

        return;
      }

      clearAllFieldErrors();
      renderSummary([]);
      contactForm.reset();
      setMessage(payload.message, "success");
      focusStatus(formMessage);
    } catch {
      setMessage("Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz bezpośrednio na adres kontakt@kp-code.pl.", "error");
      focusStatus(formMessage);
    } finally {
      setSubmittingState(false);
    }
  });
};
