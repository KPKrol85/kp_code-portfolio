/*
 * Contact form validation, error messaging, and summary rendering.
 */

export const initForms = () => {
  const contactForm = document.querySelector("[data-contact-form]");
  if (!contactForm) {
    return;
  }

  const formMessage = contactForm.querySelector("[data-form-message]");
  const formSummary = contactForm.querySelector("[data-form-summary]");
  const fields = Array.from(contactForm.querySelectorAll(".form__field"));
  const fieldInputs = fields
    .map((field) => field.querySelector("input, textarea, select"))
    .filter(Boolean);

  const getFieldErrorElement = (field) => field.querySelector(".form__error");

  const getBaseDescribedBy = (input) => {
    if (!input.dataset.describedbyBase) {
      input.dataset.describedbyBase = input.getAttribute("aria-describedby") || "";
    }

    return input.dataset.describedbyBase;
  };

  const setDescribedBy = (input, errorId) => {
    const base = getBaseDescribedBy(input);
    const ids = new Set(base.split(" ").filter(Boolean));

    if (errorId) {
      ids.add(errorId);
    } else {
      ids.delete(errorId);
    }

    const describedBy = Array.from(ids).join(" ");
    if (describedBy) {
      input.setAttribute("aria-describedby", describedBy);
      return;
    }

    input.removeAttribute("aria-describedby");
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
        return { valid: false, message: "Wiadomość jest za krótka." };
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

    const base = getBaseDescribedBy(input);
    if (base) {
      input.setAttribute("aria-describedby", base);
      return;
    }

    input.removeAttribute("aria-describedby");
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
      const link = document.createElement("a");
      link.href = `#${input.id}`;
      link.textContent = message;
      item.appendChild(link);
      list.appendChild(item);
    });

    formSummary.append(heading, list);
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

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
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

    if (errors.length) {
      renderSummary(errors);
      if (formMessage) {
        formMessage.textContent = "Uzupełnij wymagane pola formularza.";
      }
      errors[0].input.focus();
      return;
    }

    renderSummary([]);
    if (formMessage) {
      formMessage.textContent = "Dziękuję! Wrócę z odpowiedzią w ciągu 24h.";
    }
    contactForm.reset();
  });
};
