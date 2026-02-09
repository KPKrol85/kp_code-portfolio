export function initFormValidation() {
  const form = document.querySelector("[data-form-validate]");
  if (!form) {
    return;
  }

  const status = form.querySelector("[data-form-status]");
  const requiredFields = form.querySelectorAll("[data-required]");

  const showError = (field, message) => {
    let error = field.parentElement.querySelector(".form__error");
    if (!error) {
      error = document.createElement("div");
      error.className = "form__error";
      field.parentElement.appendChild(error);
    }
    error.textContent = message;
    field.setAttribute("aria-invalid", "true");
  };

  const clearError = (field) => {
    const error = field.parentElement.querySelector(".form__error");
    if (error) {
      error.textContent = "";
    }
    field.removeAttribute("aria-invalid");
  };

  form.addEventListener("submit", (event) => {
    let hasErrors = false;
    requiredFields.forEach((field) => {
      const value = field.value.trim();
      if (!value) {
        hasErrors = true;
        showError(field, "This field is required.");
      } else {
        clearError(field);
      }
    });

    if (hasErrors) {
      event.preventDefault();
      if (status) {
        status.textContent = "Please review the highlighted fields and resubmit.";
      }
    }
  });
}
