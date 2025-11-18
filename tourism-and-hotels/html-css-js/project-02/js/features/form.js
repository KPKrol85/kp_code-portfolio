const SELECTOR = '[data-form]';

export function initForm() {
  const form = document.querySelector(SELECTOR);
  if (!form) return;

  const successMessage = form.querySelector('.form__success');
  const tourSelect = form.querySelector('select[name="tour"]');
  prefillFromQuery(tourSelect);

  form.addEventListener('blur', event => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
      validateField(event.target, form);
    }
  }, true);

  form.addEventListener('submit', event => {
    event.preventDefault();
    let isValid = true;
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      if (!validateField(field, form)) {
        isValid = false;
      }
    });

    if (isValid) {
      form.reset();
      if (successMessage) {
        successMessage.hidden = false;
      }
      form.querySelectorAll('.form__error').forEach(error => (error.textContent = ''));
    } else if (successMessage) {
      successMessage.hidden = true;
    }
  });
}

function validateField(field, form) {
  const errorEl = field.closest('.form__field')?.querySelector('.form__error');
  if (!errorEl) return true;

  let message = '';
  if (field.validity.valueMissing) {
    message = 'To pole jest wymagane.';
  } else if (field.validity.typeMismatch) {
    message = 'Wprowadź poprawny format.';
  } else if (field.validity.patternMismatch) {
    message = 'Wprowadź poprawny format.';
  } else if (field.validity.tooShort) {
    message = 'Wprowadź co najmniej ' + field.minLength + ' znaki.';
  } else if (field.validity.rangeUnderflow || field.validity.rangeOverflow) {
    message = 'Wartość poza dozwolonym zakresem.';
  }

  if (!message && field.id === 'date-end') {
    const start = form.querySelector('#date-start');
    if (start instanceof HTMLInputElement && start.value && field.value && field.value < start.value) {
      message = 'Data zakończenia musi być po dacie rozpoczęcia.';
    }
  }

  if (!message && field.id === 'phone' && field.value && field.value.length < 7) {
    message = 'Podaj pełny numer telefonu.';
  }

  errorEl.textContent = message;
  return message === '';
}

function prefillFromQuery(select) {
  if (!select) return;
  const params = new URLSearchParams(window.location.search);
  const tour = params.get('tour');
  if (tour) {
    select.value = tour;
  }
}
