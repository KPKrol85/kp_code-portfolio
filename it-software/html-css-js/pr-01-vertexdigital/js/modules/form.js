import { SELECTORS } from '../config.js';
import { qs, qsa } from './dom.js';

const setError = (field, message) => {
  const error = field.parentElement.querySelector('.form__error');
  if (error) {
    error.textContent = message;
  }
  field.setAttribute('aria-invalid', 'true');
};

const clearError = (field) => {
  const error = field.parentElement.querySelector('.form__error');
  if (error) {
    error.textContent = '';
  }
  field.setAttribute('aria-invalid', 'false');
};

export const initForm = () => {
  const form = qs(SELECTORS.form);
  if (!form) return;

  const status = qs(SELECTORS.status);
  const fields = qsa('input, select, textarea', form);

  const validateField = (field) => {
    if (field.validity.valid) {
      clearError(field);
      return true;
    }

    if (field.validity.valueMissing) {
      setError(field, 'To pole jest wymagane.');
      return false;
    }

    if (field.validity.typeMismatch) {
      setError(field, 'Wpisz poprawny adres email.');
      return false;
    }

    setError(field, 'Uzupełnij pole poprawnie.');
    return false;
  };

  fields.forEach((field) => {
    field.addEventListener('input', () => validateField(field));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let firstInvalid = null;

    fields.forEach((field) => {
      const valid = validateField(field);
      if (!valid && !firstInvalid) {
        firstInvalid = field;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      if (status) {
        status.textContent = 'Sprawdź pola oznaczone błędem.';
      }
      return;
    }

    if (status) {
      status.textContent = 'Dziękujemy! Odezwiemy się w ciągu 24h.';
    }

    form.reset();
  });
};
