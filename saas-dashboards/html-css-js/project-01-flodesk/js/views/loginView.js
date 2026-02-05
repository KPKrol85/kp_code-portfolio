import { auth } from '../core/auth.js';
import { qs } from '../core/dom.js';
import { validators } from '../utils/validators.js';
import { showToast } from '../components/toast.js';

export const renderLoginView = (container) => {
  container.innerHTML = `
    <main class="login" id="main">
      <div class="login__card">
        <h1 class="login__title">Zaloguj się do FlowDesk</h1>
        <p class="login__desc">Użyj firmowego emaila. Demo nie wymaga prawdziwego hasła.</p>
        <form id="loginForm" class="form-grid" novalidate>
          <div class="input">
            <label class="input__label" for="email">Email</label>
            <input class="input__field" id="email" name="email" type="email" placeholder="anna@firma.pl" required />
            <span class="input__helper">Użyj formatu: imie@firma.pl</span>
            <span class="input__error" id="emailError"></span>
          </div>
          <div class="input">
            <label class="input__label" for="password">Hasło</label>
            <input class="input__field" id="password" name="password" type="password" required minlength="6" />
            <span class="input__helper">Minimum 6 znaków.</span>
            <span class="input__error" id="passwordError"></span>
          </div>
          <button class="btn btn--primary" type="submit">Zaloguj</button>
        </form>
      </div>
    </main>
  `;

  const form = qs('#loginForm', container);
  const emailError = qs('#emailError', container);
  const passwordError = qs('#passwordError', container);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = data.get('email');
    const password = data.get('password');
    let valid = true;

    emailError.textContent = '';
    passwordError.textContent = '';

    if (!validators.email(email)) {
      emailError.textContent = 'Podaj poprawny adres email.';
      valid = false;
    }
    if (!validators.minLength(password, 6)) {
      passwordError.textContent = 'Hasło jest za krótkie.';
      valid = false;
    }

    if (!valid) return;

    auth.login({ email });
    showToast('Zalogowano pomyślnie.');
    window.location.hash = '#/dashboard';
  });
};
