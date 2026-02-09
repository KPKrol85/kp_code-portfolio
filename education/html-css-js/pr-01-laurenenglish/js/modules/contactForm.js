export const initContactForm = () => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const fields = form.querySelectorAll('[data-error-target]');

  fields.forEach((field) => {
    const errorId = field.dataset.errorTarget;
    if (!errorId) return;
    const errorMessage = form.querySelector(`#${errorId}`);
    if (!errorMessage) return;

    const showError = () => {
      errorMessage.hidden = false;
      field.setAttribute('aria-invalid', 'true');
    };

    const hideError = () => {
      errorMessage.hidden = true;
      field.setAttribute('aria-invalid', 'false');
    };

    field.addEventListener('invalid', () => {
      showError();
    });

    field.addEventListener('input', () => {
      if (field.validity.valid) {
        hideError();
      }
    });
  });
};
