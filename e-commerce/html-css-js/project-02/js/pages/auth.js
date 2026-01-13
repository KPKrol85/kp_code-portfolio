import { createElement, clearElement } from "../utils/dom.js";
import { validators } from "../utils/validators.js";
import { authService } from "../services/auth.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";

export const renderAuth = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Konto użytkownika" }));

  const tabs = createElement("div", { className: "tabs", attrs: { role: "tablist" } });
  const loginTab = createElement("button", {
    className: "tab-button",
    text: "Logowanie",
    attrs: { type: "button", role: "tab", "aria-selected": "true" },
  });
  const registerTab = createElement("button", {
    className: "tab-button",
    text: "Rejestracja",
    attrs: { type: "button", role: "tab", "aria-selected": "false" },
  });
  tabs.appendChild(loginTab);
  tabs.appendChild(registerTab);

  const panel = createElement("div", { className: "card section", attrs: { role: "tabpanel" } });

  const renderLogin = () => {
    clearElement(panel);
    panel.appendChild(createElement("h2", { text: "Zaloguj się" }));
    const emailField = createElement("input", {
      className: "input",
      attrs: { type: "email", placeholder: "E-mail" },
    });
    const passwordField = createElement("input", {
      className: "input",
      attrs: { type: "password", placeholder: "Hasło" },
    });
    const errorBox = createElement("div", { className: "form-error" });
    const form = createElement("form");

    form.appendChild(createElement("div", { className: "form-field" }, [
      createElement("label", { text: "E-mail" }),
      emailField,
    ]));
    form.appendChild(createElement("div", { className: "form-field" }, [
      createElement("label", { text: "Hasło" }),
      passwordField,
    ]));
    form.appendChild(errorBox);
    form.appendChild(createElement("button", { className: "button block", text: "Zaloguj", attrs: { type: "submit" } }));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      errorBox.textContent = "";
      try {
        if (!validators.email(emailField.value)) {
          throw new Error("Podaj poprawny e-mail.");
        }
        if (!validators.minLength(6)(passwordField.value)) {
          throw new Error("Hasło musi mieć minimum 6 znaków.");
        }
        const { user, session } = authService.login({
          email: emailField.value,
          password: passwordField.value,
        });
        store.setState({ user, session });
        showToast("Zalogowano pomyślnie.");
        location.hash = "#/account";
      } catch (error) {
        errorBox.textContent = error.message;
      }
    });

    panel.appendChild(form);
  };

  const renderRegister = () => {
    clearElement(panel);
    panel.appendChild(createElement("h2", { text: "Załóż konto" }));
    const nameField = createElement("input", {
      className: "input",
      attrs: { type: "text", placeholder: "Imię i nazwisko" },
    });
    const emailField = createElement("input", {
      className: "input",
      attrs: { type: "email", placeholder: "E-mail" },
    });
    const passwordField = createElement("input", {
      className: "input",
      attrs: { type: "password", placeholder: "Hasło" },
    });
    const errorBox = createElement("div", { className: "form-error" });
    const form = createElement("form");

    form.appendChild(createElement("div", { className: "form-field" }, [
      createElement("label", { text: "Imię i nazwisko" }),
      nameField,
    ]));
    form.appendChild(createElement("div", { className: "form-field" }, [
      createElement("label", { text: "E-mail" }),
      emailField,
    ]));
    form.appendChild(createElement("div", { className: "form-field" }, [
      createElement("label", { text: "Hasło" }),
      passwordField,
    ]));
    form.appendChild(errorBox);
    form.appendChild(createElement("button", { className: "button block", text: "Utwórz konto", attrs: { type: "submit" } }));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      errorBox.textContent = "";
      try {
        if (!validators.required(nameField.value)) {
          throw new Error("Podaj imię i nazwisko.");
        }
        if (!validators.email(emailField.value)) {
          throw new Error("Podaj poprawny e-mail.");
        }
        if (!validators.minLength(6)(passwordField.value)) {
          throw new Error("Hasło musi mieć minimum 6 znaków.");
        }
        authService.register({
          name: nameField.value,
          email: emailField.value,
          password: passwordField.value,
        });
        showToast("Konto utworzone, możesz się zalogować.");
        loginTab.click();
      } catch (error) {
        errorBox.textContent = error.message;
      }
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
