import { qs } from './dom.js';
import { isEmail } from '../utils.js';

export function initForm() {
  const form = qs('[data-contact-form]');
  if (!form) return;
  const status = qs('[data-form-status]', form);

  const setError = (field, message) => {
    const errorEl = qs(`[data-error-for="${field.name}"]`, form);
    if (errorEl) errorEl.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  };

  const clearErrors = () => {
    form.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error').forEach((el) => { el.textContent = ''; });
  };

  form.addEventListener('submit', (event) => {
    clearErrors();
    status.textContent = '';
    status.className = 'form-status';

    const data = new FormData(form);
    const required = ['name', 'email', 'subject', 'message'];
    let firstError = null;

    required.forEach((name) => {
      const field = form.elements[name];
      const value = (data.get(name) || '').toString().trim();
      if (!value) {
        setError(field, 'To pole jest wymagane.');
        firstError ||= field;
      }
    });

    if (data.get('email') && !isEmail(String(data.get('email')))) {
      const field = form.elements.email;
      setError(field, 'Podaj poprawny adres e-mail.');
      firstError ||= field;
    }

    if (firstError) {
      event.preventDefault();
      status.textContent = 'Formularz zawiera błędy. Popraw oznaczone pola.';
      status.classList.add('is-error');
      firstError.focus();
      return;
    }

    event.preventDefault();
    status.textContent = 'Dziękujemy. Zespół BlackGrid skontaktuje się z Tobą w ciągu 1 dnia roboczego.';
    status.classList.add('is-success');
    form.reset();
  });
}
