// form.js – basic client validation with aria-invalid and messages + honeypot
export function initForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;

  function setError(input, msgId, show) {
    input.setAttribute('aria-invalid', show ? 'true' : 'false');
    const msg = document.getElementById(msgId);
    if (msg) msg.hidden = !show;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    // honeypot
    if ((data.get('website') || '').toString().trim() !== '') return; // silently drop

    let ok = true;
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const checkin = form.querySelector('#checkin');
    const checkout = form.querySelector('#checkout');
    const guests = form.querySelector('#guests');

    if (name) { const v = name.value.trim().length > 1; setError(name, 'err-name', !v); ok = ok && v; }
    if (email) { const v = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value); setError(email, 'err-email', !v); ok = ok && v; }
    if (checkin) { const v = !!checkin.value; setError(checkin, 'err-checkin', !v); ok = ok && v; }
    if (checkout) { const v = !!checkout.value && (!checkin || checkout.value >= checkin.value); setError(checkout, 'err-checkout', !v); ok = ok && v; }
    if (guests) { const n = parseInt(guests.value, 10); const v = n >= 1 && n <= 6; setError(guests, 'err-guests', !v); ok = ok && v; }

    const success = form.querySelector('.form__success');
    if (ok) {
      if (success) success.hidden = false;
      form.reset();
      // keep focus visible feedback
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.focus();
    } else {
      if (success) success.hidden = true;
    }
  });
}

