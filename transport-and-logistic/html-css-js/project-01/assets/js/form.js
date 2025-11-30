// Form validation and simple calculators for quick quote and pricing pages
const validators = {
  required: (value) => value.trim().length > 0,
  email: (value) => /\S+@\S+\.\S+/.test(value),
  tel: (value) => /^[\\d+()\\s-]{6,}$/.test(value),
  number: (value) => !Number.isNaN(Number(value)) && Number(value) > 0
};

function showError(input, message) {
  const errorId = input.getAttribute("aria-describedby");
  const errorEl = errorId ? document.getElementById(errorId) : null;
  if (errorEl) errorEl.textContent = message;
  input.classList.add("invalid");
}

function clearError(input) {
  const errorId = input.getAttribute("aria-describedby");
  const errorEl = errorId ? document.getElementById(errorId) : null;
  if (errorEl) errorEl.textContent = "";
  input.classList.remove("invalid");
}

function validateField(input) {
  const type = input.getAttribute("type");
  const required = input.hasAttribute("required");
  const value = input.value;
  if (required && !validators.required(value)) {
    showError(input, "To pole jest wymagane.");
    return false;
  }
  if (type === "email" && value && !validators.email(value)) {
    showError(input, "Podaj prawidłowy adres email.");
    return false;
  }
  if (type === "tel" && value && !validators.tel(value)) {
    showError(input, "Podaj prawidłowy numer telefonu.");
    return false;
  }
  if ((type === "number" || input.tagName === "SELECT") && required && !validators.number(value)) {
    showError(input, "Wpisz wartość większą od zera.");
    return false;
  }
  clearError(input);
  return true;
}

function attachValidation(form, { onValid, resetOnValid = true } = {}) {
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    inputs.forEach((input) => {
      if (!validateField(input)) valid = false;
    });

    const requiredCheckbox = form.querySelector("input[type='checkbox'][required]");
    if (requiredCheckbox && !requiredCheckbox.checked) {
      showError(requiredCheckbox, "Zgoda jest wymagana.");
      valid = false;
    } else if (requiredCheckbox) {
      clearError(requiredCheckbox);
    }

    if (!valid) {
      inputs[0]?.focus();
      return;
    }

    if (typeof onValid === "function") {
      onValid();
      return;
    }

    if (resetOnValid) form.reset();
    const success = form.querySelector(".form__success");
    if (success) {
      success.hidden = false;
      success.focus?.();
    }
  });
}

function calculateRate(distance, weight, type, extras = []) {
  const base = {
    standard: 1.8,
    express: 2.4,
    adr: 2.9,
    chlodnia: 3.1,
    cold: 3.1
  }[type] || 1.8;

  let rate = base;
  if (weight > 1000) rate += 0.2;
  if (weight > 5000) rate += 0.4;
  if (extras.includes("lift")) rate += 0.15;
  if (extras.includes("insurance")) rate += 0.2;
  if (extras.includes("weekend") || extras.includes("tail")) rate += 0.1;
  return distance * rate;
}

function initQuickQuote() {
  const form = document.getElementById("quick-quote");
  const result = document.getElementById("quote-result");
  if (!form || !result) return;
  attachValidation(form, {
    resetOnValid: false,
    onValid: () => {
      const distance = Number(form.distance.value);
      const weight = Number(form.weight.value);
      const type = form.serviceType.value;
      const extras = Array.from(form.querySelectorAll("input[type='checkbox']:checked")).map((c) => c.value);
      if (!distance || !weight || !type) {
        result.textContent = "Uzupełnij pola, aby obliczyć koszt.";
        return;
      }
      const price = calculateRate(distance, weight, type, extras);
      result.textContent = `Szacowana stawka: ${price.toFixed(0)} zł netto`;
    }
  });
}

function initPricingForm() {
  const form = document.getElementById("pricing-form");
  const result = document.getElementById("pricing-result");
  if (!form || !result) return;
  attachValidation(form, {
    resetOnValid: false,
    onValid: () => {
    const distance = Number(form.distance.value);
    const weight = Number(form.weight.value);
    const type = form.service.value;
    const extras = Array.from(form.querySelectorAll("input[type='checkbox']:checked")).map((c) => c.value);
    if (!distance || !weight || !type) {
      result.textContent = "Uzupełnij wszystkie pola, aby zobaczyć wynik.";
      return;
    }
    const price = calculateRate(distance, weight, type, extras);
    result.textContent = `Szacunkowy koszt: ${price.toFixed(0)} zł netto`;
    }
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  attachValidation(form);
}

export function initForms() {
  initQuickQuote();
  initPricingForm();
  initContactForm();
}
