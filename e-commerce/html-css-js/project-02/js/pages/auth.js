import { createElement, clearElement } from "../utils/dom.js";
import { navigateHash } from "../utils/navigation.js";
import { validators } from "../utils/validators.js";
import { authService } from "../services/auth.js";
import { showToast } from "../components/toast.js";
import { withButtonLoading } from "../utils/ui-state.js";
import { content } from "../content/pl.js";

export const renderAuth = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: content.auth.title }));

  const tabs = createElement("div", { className: "tabs", attrs: { role: "tablist" } });
  const loginTab = createElement("button", {
    className: "tab-button",
    text: content.auth.tabs.login,
    attrs: {
      id: "auth-tab-login",
      type: "button",
      role: "tab",
      "aria-selected": "true",
      "aria-controls": "auth-panel",
    },
  });
  const registerTab = createElement("button", {
    className: "tab-button",
    text: content.auth.tabs.register,
    attrs: {
      id: "auth-tab-register",
      type: "button",
      role: "tab",
      "aria-selected": "false",
      "aria-controls": "auth-panel",
    },
  });
  tabs.appendChild(loginTab);
  tabs.appendChild(registerTab);

  const panel = createElement("div", {
    className: "card section",
    attrs: {
      id: "auth-panel",
      role: "tabpanel",
      tabindex: "0",
      "aria-labelledby": "auth-tab-login",
    },
  });

  const renderLogin = () => {
    clearElement(panel);
    panel.setAttribute("aria-labelledby", "auth-tab-login");
    panel.appendChild(createElement("h2", { text: content.auth.login.title }));
    const emailField = createElement("input", {
      className: "input",
      attrs: {
        id: "auth-login-email",
        type: "email",
        placeholder: "E-mail",
        autocomplete: "email",
        inputmode: "email",
        autocapitalize: "none",
        spellcheck: "false",
      },
    });
    const passwordField = createElement("input", {
      className: "input",
      attrs: {

        id: "auth-login-password",

        type: "password",

        placeholder: "Hasło",

        autocomplete: "current-password",

        autocapitalize: "none",

        spellcheck: "false",

      },
    });
    const errorBox = createElement("div", {
      className: "form-error",
      attrs: { "aria-live": "polite" },
    });
    const emailError = createElement("div", {
      className: "form-error sr-only",
      attrs: { id: "auth-login-email-error" },
    });
    const passwordError = createElement("div", {
      className: "form-error sr-only",
      attrs: { id: "auth-login-password-error" },
    });
    const form = createElement("form");

    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "E-mail", attrs: { for: "auth-login-email" } }),
        emailField,
        emailError,
      ])
    );
    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "Hasło", attrs: { for: "auth-login-password" } }),
        passwordField,
        passwordError,
      ])
    );
    form.appendChild(errorBox);
    const submitButton = createElement("button", {
      className: "button block",
      text: content.auth.login.submit,
      attrs: { type: "submit" },
    });
    form.appendChild(submitButton);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      withButtonLoading(
        submitButton,
        async () => {
          errorBox.textContent = "";
          const emailMessage = validators.email(emailField.value) ? "" : "Podaj poprawny e-mail.";
          const passwordMessage = validators.minLength(6)(passwordField.value)
            ? ""
            : "Hasło musi mieć minimum 6 znaków.";
          emailError.textContent = emailMessage;
          passwordError.textContent = passwordMessage;
          if (emailMessage) {
            emailField.setAttribute("aria-invalid", "true");
            emailField.setAttribute("aria-describedby", "auth-login-email-error");
          } else {
            emailField.removeAttribute("aria-invalid");
            emailField.removeAttribute("aria-describedby");
          }
          if (passwordMessage) {
            passwordField.setAttribute("aria-invalid", "true");
            passwordField.setAttribute("aria-describedby", "auth-login-password-error");
          } else {
            passwordField.removeAttribute("aria-invalid");
            passwordField.removeAttribute("aria-describedby");
          }
          try {
            if (emailMessage || passwordMessage) {
              errorBox.textContent = emailMessage || passwordMessage;
              return;
            }
            authService.signIn({
              email: emailField.value,
              password: passwordField.value,
            });
            showToast(content.toasts.loginSuccess);
            navigateHash("#/account");
          } catch (error) {
            errorBox.textContent = error.message;
          }
        },
        { loadingText: content.auth.login.loading }
      );
    });

    panel.appendChild(form);
  };

  const renderRegister = () => {
    clearElement(panel);
    panel.setAttribute("aria-labelledby", "auth-tab-register");
    panel.appendChild(createElement("h2", { text: content.auth.register.title }));
    const nameField = createElement("input", {
      className: "input",
      attrs: {

        id: "auth-register-name",

        type: "text",

        placeholder: "Imię i nazwisko",

        autocomplete: "name",

        inputmode: "text",

        autocapitalize: "words",

        spellcheck: "false",

      },
    });
    const emailField = createElement("input", {
      className: "input",
      attrs: {
        id: "auth-register-email",
        type: "email",
        placeholder: "E-mail",
        autocomplete: "email",
        inputmode: "email",
        autocapitalize: "none",
        spellcheck: "false",
      },
    });
    const passwordField = createElement("input", {
      className: "input",
      attrs: {

        id: "auth-register-password",

        type: "password",

        placeholder: "Hasło",

        autocomplete: "new-password",

        autocapitalize: "none",

        spellcheck: "false",

      },
    });
    const errorBox = createElement("div", {
      className: "form-error",
      attrs: { "aria-live": "polite" },
    });
    const nameError = createElement("div", {
      className: "form-error sr-only",
      attrs: { id: "auth-register-name-error" },
    });
    const emailError = createElement("div", {
      className: "form-error sr-only",
      attrs: { id: "auth-register-email-error" },
    });
    const passwordError = createElement("div", {
      className: "form-error sr-only",
      attrs: { id: "auth-register-password-error" },
    });
    const form = createElement("form");

    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "Imię i nazwisko", attrs: { for: "auth-register-name" } }),
        nameField,
        nameError,
      ])
    );
    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "E-mail", attrs: { for: "auth-register-email" } }),
        emailField,
        emailError,
      ])
    );
    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "Hasło", attrs: { for: "auth-register-password" } }),
        passwordField,
        passwordError,
      ])
    );
    form.appendChild(errorBox);
    const submitButton = createElement("button", {
      className: "button block",
      text: content.auth.register.submit,
      attrs: { type: "submit" },
    });
    form.appendChild(submitButton);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      withButtonLoading(
        submitButton,
        async () => {
          errorBox.textContent = "";
          const nameMessage = validators.required(nameField.value)
            ? ""
            : "Podaj imię i nazwisko.";
          const emailMessage = validators.email(emailField.value) ? "" : "Podaj poprawny e-mail.";
          const passwordMessage = validators.minLength(6)(passwordField.value)
            ? ""
            : "Hasło musi mieć minimum 6 znaków.";
          nameError.textContent = nameMessage;
          emailError.textContent = emailMessage;
          passwordError.textContent = passwordMessage;
          if (nameMessage) {
            nameField.setAttribute("aria-invalid", "true");
            nameField.setAttribute("aria-describedby", "auth-register-name-error");
          } else {
            nameField.removeAttribute("aria-invalid");
            nameField.removeAttribute("aria-describedby");
          }
          if (emailMessage) {
            emailField.setAttribute("aria-invalid", "true");
            emailField.setAttribute("aria-describedby", "auth-register-email-error");
          } else {
            emailField.removeAttribute("aria-invalid");
            emailField.removeAttribute("aria-describedby");
          }
          if (passwordMessage) {
            passwordField.setAttribute("aria-invalid", "true");
            passwordField.setAttribute("aria-describedby", "auth-register-password-error");
          } else {
            passwordField.removeAttribute("aria-invalid");
            passwordField.removeAttribute("aria-describedby");
          }
          try {
            if (nameMessage || emailMessage || passwordMessage) {
              errorBox.textContent = nameMessage || emailMessage || passwordMessage;
              return;
            }
            authService.register({
              name: nameField.value,
              email: emailField.value,
              password: passwordField.value,
            });
            showToast(content.toasts.accountCreated);
            loginTab.click();
          } catch (error) {
            errorBox.textContent = error.message;
          }
        },
        { loadingText: content.auth.register.loading }
      );
    });

    panel.appendChild(form);
  };

  loginTab.addEventListener("click", () => {
    loginTab.setAttribute("aria-selected", "true");
    registerTab.setAttribute("aria-selected", "false");
    renderLogin();
  });

  registerTab.addEventListener("click", () => {
    registerTab.setAttribute("aria-selected", "true");
    loginTab.setAttribute("aria-selected", "false");
    renderRegister();
  });

  renderLogin();

  container.appendChild(tabs);
  container.appendChild(panel);
  main.appendChild(container);
};
