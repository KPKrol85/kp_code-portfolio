import { createElement, clearElement } from "../utils/dom.js";
import { navigateHash } from "../utils/navigation.js";
import { validators } from "../utils/validators.js";
import { authService } from "../services/auth.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { withButtonLoading } from "../utils/ui-state.js";

export const renderAuth = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Konto u3ytkownika" }));

  const tabs = createElement("div", { className: "tabs", attrs: { role: "tablist" } });
  const loginTab = createElement("button", {
    className: "tab-button",
    text: "Logowanie",
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
    text: "Rejestracja",
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
    panel.appendChild(createElement("h2", { text: "Zaloguj sic" }));
    const emailField = createElement("input", {
      className: "input",
      attrs: { id: "auth-login-email", type: "email", placeholder: "E-mail" },
    });
    const passwordField = createElement("input", {
      className: "input",
      attrs: { id: "auth-login-password", type: "password", placeholder: "Has^o" },
    });
    const errorBox = createElement("div", { className: "form-error" });
    const form = createElement("form");

    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "E-mail", attrs: { for: "auth-login-email" } }),
        emailField,
      ])
    );
    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "Has^o", attrs: { for: "auth-login-password" } }),
        passwordField,
      ])
    );
    form.appendChild(errorBox);
    const submitButton = createElement("button", {
      className: "button block",
      text: "Zaloguj",
      attrs: { type: "submit" },
    });
    form.appendChild(submitButton);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      withButtonLoading(
        submitButton,
        async () => {
          errorBox.textContent = "";
          try {
            if (!validators.email(emailField.value)) {
              throw new Error("Podaj poprawny e-mail.");
            }
            if (!validators.minLength(6)(passwordField.value)) {
              throw new Error("Has^o musi mie? minimum 6 znakcw.");
            }
            const { user, session } = authService.login({
              email: emailField.value,
              password: passwordField.value,
            });
            store.setState({ user, session });
            showToast("Zalogowano pomy~lnie.");
            navigateHash("#/account");
          } catch (error) {
            errorBox.textContent = error.message;
          }
        },
        { loadingText: "Logowanie..." }
      );
    });

    panel.appendChild(form);
  };

  const renderRegister = () => {
    clearElement(panel);
    panel.setAttribute("aria-labelledby", "auth-tab-register");
    panel.appendChild(createElement("h2", { text: "Za^c3 konto" }));
    const nameField = createElement("input", {
      className: "input",
      attrs: { id: "auth-register-name", type: "text", placeholder: "Imic i nazwisko" },
    });
    const emailField = createElement("input", {
      className: "input",
      attrs: { id: "auth-register-email", type: "email", placeholder: "E-mail" },
    });
    const passwordField = createElement("input", {
      className: "input",
      attrs: { id: "auth-register-password", type: "password", placeholder: "Has^o" },
    });
    const errorBox = createElement("div", { className: "form-error" });
    const form = createElement("form");

    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "Imic i nazwisko", attrs: { for: "auth-register-name" } }),
        nameField,
      ])
    );
    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "E-mail", attrs: { for: "auth-register-email" } }),
        emailField,
      ])
    );
    form.appendChild(
      createElement("div", { className: "form-field" }, [
        createElement("label", { text: "Has^o", attrs: { for: "auth-register-password" } }),
        passwordField,
      ])
    );
    form.appendChild(errorBox);
    const submitButton = createElement("button", {
      className: "button block",
      text: "Utwcrz konto",
      attrs: { type: "submit" },
    });
    form.appendChild(submitButton);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      withButtonLoading(
        submitButton,
        async () => {
          errorBox.textContent = "";
          try {
            if (!validators.required(nameField.value)) {
              throw new Error("Podaj imic i nazwisko.");
            }
            if (!validators.email(emailField.value)) {
              throw new Error("Podaj poprawny e-mail.");
            }
            if (!validators.minLength(6)(passwordField.value)) {
              throw new Error("Has^o musi mie? minimum 6 znakcw.");
            }
            authService.register({
              name: nameField.value,
              email: emailField.value,
              password: passwordField.value,
            });
            showToast("Konto utworzone, mo3esz sic zalogowa?.");
            loginTab.click();
          } catch (error) {
            errorBox.textContent = error.message;
          }
        },
        { loadingText: "Rejestracja..." }
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
