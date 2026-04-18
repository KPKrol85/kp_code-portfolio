import { qs, qsa } from '../utils.js';
import { SELECTORS } from '../config.js';

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

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
    name: 'Podaj imię i nazwisko.',
    email: 'Podaj adres e-mail.',
    date: 'Wybierz datę wydarzenia.',
    city: 'Podaj miasto lub region.',
    budget: 'Wybierz zakres budżetu.',
    package: 'Wybierz preferowany pakiet.',
    guests: 'Podaj planowaną liczbę gości.',
    message: 'Napisz kilka słów o wydarzeniu.'
  };

  return messages[field.name] || 'To pole jest wymagane.';
};

const getFieldErrorMessage = (field) => {
  const guestsMin = Number(field.getAttribute('min'));
  const guestsMax = Number(field.getAttribute('max'));

  if (field.validity.valueMissing) {
    return getRequiredMessage(field);
  }

  if (field.name === 'email' && field.validity.typeMismatch) {
    return 'Podaj poprawny adres e-mail.';
  }

  if (field.name === 'date' && field.value) {
    const today = getTodayDateString();
    if (field.value < today || field.validity.rangeUnderflow) {
      return 'Data wydarzenia nie może być z przeszłości.';
    }
  }

  if (field.name === 'guests') {
    if (field.validity.badInput) {
      return 'Podaj poprawną liczbę gości.';
    }

    if (field.validity.rangeUnderflow) {
      return `Podaj liczbę gości nie mniejszą niż ${guestsMin}.`;
    }

    if (field.validity.rangeOverflow) {
      return `Podaj liczbę gości nie większą niż ${guestsMax}.`;
    }
  }

  if (field.validity.typeMismatch) {
    return 'Wprowadź poprawny format.';
  }

  return 'Sprawdź poprawność pola.';
};

export const initForm = () => {
  const form = qs(SELECTORS.contactForm);
  if (!form || form.dataset.initialized === 'true') return;

  const status = qs('[data-form-status]', form);
  const fields = qsa('[data-validate]', form);
  const dateField = qs('#date', form);

  const applyDynamicConstraints = () => {
    if (dateField) {
      dateField.min = getTodayDateString();
    }
  };

  const clearStatus = () => {
    if (status) {
      status.textContent = '';
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

  form.addEventListener('submit', (event) => {
    event.preventDefault();
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
      if (status) {
        status.textContent = 'Uzupełnij zaznaczone pola, aby wysłać zapytanie.';
        status.classList.add('status');
      }
      firstInvalid?.focus();
      return;
    }

    fields.forEach((field) => clearError(field));
    form.reset();
    applyDynamicConstraints();

    if (status) {
      status.textContent = 'Dziękujemy! Twoja wiadomość została przyjęta. Odpowiemy w ciągu 24 godzin.';
      status.classList.add('status');
    }
  });

  form.dataset.initialized = 'true';
};
