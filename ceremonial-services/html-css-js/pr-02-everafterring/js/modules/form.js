import { qs, qsa } from '../utils.js';
import { SELECTORS } from '../config.js';

const STATUS_CLASSES = [
  'form__status--loading',
  'form__status--success',
  'form__status--error'
];

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const showError = (field, message) => {
  const errorId = field.getAttribute('aria-describedby');
  field.setAttribute('aria-invalid', 'true');
  if (!errorId) return;
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = message;
  }
};

const clearError = (field) => {
  const errorId = field.getAttribute('aria-describedby');
  field.removeAttribute('aria-invalid');
  if (!errorId) return;
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = '';
  }
};

const getRequiredMessage = (field) => {
  const messages = {
    name: 'Wpisz imię i nazwisko, abyśmy wiedzieli, z kim się kontaktujemy.',
    email: 'Podaj adres e-mail, na który mamy wysłać odpowiedź.',
    date: 'Wybierz planowaną datę ślubu lub wydarzenia.',
    city: 'Wpisz miasto lub region, w którym planujecie wydarzenie.',
    budget: 'Wybierz przedział budżetu, abyśmy mogli dopasować zakres usług.',
    package: 'Wybierz pakiet, który najlepiej odpowiada Waszym potrzebom.',
    guests: 'Podaj orientacyjną liczbę gości.',
    message: 'Opisz krótko Wasze wydarzenie, abyśmy mogli przygotować lepszą ofertę.'
  };

  return messages[field.name] || 'Uzupełnij to pole, aby przejść dalej.';
};

const getFieldErrorMessage = (field) => {
  const guestsMin = Number(field.getAttribute('min'));
  const guestsMax = Number(field.getAttribute('max'));

  if (field.validity.valueMissing) {
    return getRequiredMessage(field);
  }

  if (field.name === 'email' && field.validity.typeMismatch) {
    return 'Wpisz adres e-mail w formacie nazwa@domena.pl.';
  }

  if (field.name === 'date' && field.value) {
    const today = getTodayDateString();
    if (field.value < today || field.validity.rangeUnderflow) {
      return 'Wybierz datę wydarzenia od dzisiaj wzwyż.';
    }
  }

  if (field.name === 'guests') {
    if (field.validity.badInput) {
      return 'Wpisz liczbę gości cyframi, np. 80.';
    }

    if (field.validity.rangeUnderflow) {
      return `Podaj co najmniej ${guestsMin} gości lub popraw wpisaną wartość.`;
    }

    if (field.validity.rangeOverflow) {
      return `Podaj nie więcej niż ${guestsMax} gości lub skoryguj wpisaną wartość.`;
    }
  }

  if (field.validity.typeMismatch) {
    return 'Popraw format wpisanej wartości.';
  }

  return 'Sprawdź wpisaną wartość i popraw to pole.';
};

const serializeFormData = (form) => {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
};

const mockSubmitContactForm = async (payload, form) => {
  await wait(900);

  if (form.dataset.submitMode === 'mock-error') {
    throw new Error('Mock submission failed.');
  }

  return {
    ok: true,
    payload
  };
};

const submitContactForm = async (payload, form) => {
  const endpoint = form.dataset.submitEndpoint?.trim();

  if (!endpoint) {
    return mockSubmitContactForm(payload, form);
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}.`);
  }

  return response;
};

export const initForm = () => {
  const form = qs(SELECTORS.contactForm);
  if (!form || form.dataset.initialized === 'true') return;

  const status = qs('[data-form-status]', form);
  const fields = qsa('[data-validate]', form);
  const dateField = qs('#date', form);
  const submitButton = qs('[type="submit"]', form);
  const defaultSubmitLabel = submitButton?.textContent?.trim() || 'Wyślij zapytanie';
  let isSubmitting = false;

  const applyDynamicConstraints = () => {
    if (dateField) {
      dateField.min = getTodayDateString();
    }
  };

  const clearStatus = () => {
    if (status) {
      status.textContent = '';
      status.classList.remove(...STATUS_CLASSES);
    }
  };

  const setStatus = (message, variant) => {
    if (!status) return;
    status.textContent = message;
    status.classList.remove(...STATUS_CLASSES);
    if (variant) {
      status.classList.add(`form__status--${variant}`);
    }
  };

  const setSubmittingState = (submitting) => {
    isSubmitting = submitting;
    if (submitting) {
      form.setAttribute('aria-busy', 'true');
    } else {
      form.removeAttribute('aria-busy');
    }

    if (submitButton) {
      submitButton.disabled = submitting;
      submitButton.textContent = submitting ? 'Wysyłanie...' : defaultSubmitLabel;
    }
  };

  const validateField = (field) => {
    if (field.validity.valid) {
      clearError(field);
      return true;
    }

    showError(field, getFieldErrorMessage(field));

    return false;
  };

  applyDynamicConstraints();

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      clearStatus();
      validateField(field);
    });
    field.addEventListener('change', () => {
      clearStatus();
      validateField(field);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    clearStatus();
    let firstInvalid = null;
    let allValid = true;

    fields.forEach((field) => {
      const isValid = validateField(field);
      if (!isValid && !firstInvalid) {
        firstInvalid = field;
      }
      if (!isValid) {
        allValid = false;
      }
    });

    if (!allValid) {
      setStatus('Uzupełnij zaznaczone pola, aby wysłać zapytanie.', 'error');
      firstInvalid?.focus();
      return;
    }

    const payload = serializeFormData(form);
    setSubmittingState(true);
    setStatus('Wysyłamy Twoje zapytanie...', 'loading');

    try {
      await submitContactForm(payload, form);
      fields.forEach((field) => clearError(field));
      form.reset();
      applyDynamicConstraints();
      setStatus('Dziękujemy! Twoja wiadomość została wysłana. Odpowiemy w ciągu 24 godzin.', 'success');
    } catch (error) {
      setStatus('Nie udało się wysłać formularza. Sprawdź połączenie i spróbuj ponownie.', 'error');
    } finally {
      setSubmittingState(false);
    }
  });

  form.dataset.initialized = 'true';
};
