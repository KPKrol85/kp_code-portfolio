import { qs } from './dom.js';
import { isEmail, isPhone } from '../utils.js';

export const initForm = () => {
  const form = qs('[data-contact-form]');
  if (!form) return;
  const status = qs('[data-form-status]', form);

  const setError = (field, message = '') => {
    const error = qs(`#${field.id}-error`, form);
    if (error) error.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    const fields = [...form.querySelectorAll('[data-validate]')];
    fields.forEach((field) => setError(field));

    const invalid = [];
    fields.forEach((field) => {
      if (field.hasAttribute('required') && !field.value.trim()) {
        setError(field, 'To pole jest wymagane.');
        invalid.push(field);
      } else if (field.type === 'email' && field.value && !isEmail(field.value)) {
        setError(field, 'Podaj poprawny adres e-mail.');
        invalid.push(field);
      } else if (field.name === 'phone' && field.value && !isPhone(field.value)) {
        setError(field, 'Podaj poprawny numer telefonu.');
        invalid.push(field);
      }
    });

    const consent = qs('#gdpr', form);
    if (consent && !consent.checked) {
      setError(consent, 'Wymagana jest zgoda RODO.');
      invalid.push(consent);
    }

    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    status.textContent = 'Dziękujemy. Skontaktujemy się maksymalnie w ciągu 24 godzin.';
    form.reset();
  });
};
