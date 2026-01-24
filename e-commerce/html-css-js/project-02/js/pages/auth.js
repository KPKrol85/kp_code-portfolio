import { createElement, clearElement } from "../utils/dom.js";
import { navigateHash, parseHash } from "../utils/navigation.js";
import { validators } from "../utils/validators.js";
import { authService } from "../services/auth.js";
import { showToast } from "../components/toast.js";
import { withButtonLoading } from "../utils/ui-state.js";
import { content } from "../content/pl.js";
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";

const AUTH_FALLBACK_HASH = "#/account";

const isSafeReturnTo = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("http:") ||
    lower.startsWith("https:") ||
    lower.startsWith("javascript:") ||
    lower.startsWith("data:")
  ) {
    return false;
  }
  if (trimmed.startsWith("//") || trimmed.startsWith("#//")) {
    return false;
  }
  return trimmed.startsWith("#/") || trimmed.startsWith("/");
};

const normalizeReturnTo = (value) => {
  if (!isSafeReturnTo(value)) {
    return null;
  }
  return value.startsWith("#") ? value : `#${value}`;
};

const navigateToReturnTo = (targetHash) => {
  const onRouteAfter = (event) => {
    if (event?.detail?.path === "/404") {
      navigateHash(AUTH_FALLBACK_HASH, { force: true });
    }
  };
  window.addEventListener("route:after", onRouteAfter, { once: true });
  navigateHash(targetHash, { force: true });
};

const generateId = () =>
  (globalThis.crypto?.randomUUID?.() ??
    `id_${Date.now()}_${Math.random().toString(16).slice(2)}`);

export const renderAuth = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { pathname, queryParams } = parseHash();
  const container = createElement("section", { className: "container auth-page" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  const rawNextParam = Array.isArray(queryParams.next) ? queryParams.next[0] : queryParams.next;
  const nextParam = normalizeReturnTo(rawNextParam);

  const tabs = createElement("div", { className: "tabs", attrs: { role: "tablist" } });
  const loginTab = createElement("button", {
    className: "tab-button",
    text: content.auth.tabs.login,
    attrs: {
      id: "auth-tab-login",
      type: "button",
      role: "tab",
      "aria-selected": "true",
      tabindex: "0",
      "aria-controls": "auth-panel-login",
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
      tabindex: "-1",
      "aria-controls": "auth-panel-register",
    },
  });
  tabs.appendChild(loginTab);
  tabs.appendChild(registerTab);

  const loginPanel = createElement("div", {
    className: "card section auth-panel",
    attrs: {
      id: "auth-panel-login",
      role: "tabpanel",
      tabindex: "0",
      "aria-labelledby": "auth-tab-login",
    },
  });
  const registerPanel = createElement("div", {
    className: "card section auth-panel",
    attrs: {
      id: "auth-panel-register",
      role: "tabpanel",
      tabindex: "0",
      "aria-labelledby": "auth-tab-register",
      hidden: "hidden",
    },
  });

  const renderLogin = () => {
    clearElement(loginPanel);
    loginPanel.setAttribute("aria-labelledby", "auth-tab-login");
    loginPanel.appendChild(createElement("h2", { text: content.auth.login.title }));
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
            const returnTo = normalizeReturnTo(authService.consumeReturnTo()) || nextParam;
            if (returnTo) {
              navigateToReturnTo(returnTo);
              return;
            }
            navigateHash(AUTH_FALLBACK_HASH);
          } catch (error) {
            errorBox.textContent = error.message;
          }
        },
        { loadingText: content.auth.login.loading }
      );
    });

    loginPanel.appendChild(form);
    const demoLoginButton = createElement("button", {
      className: "button secondary block",
      text: "Zaloguj (tryb demo)",
      attrs: { type: "button" },
    });
    demoLoginButton.addEventListener("click", () => {
      try {
        authService.signIn({
          id: generateId(),
          name: "Demo Klient",
          email: "demo@kpcode.dev",
        });
        showToast("Zalogowano w trybie demo.", "info");
        const returnTo = normalizeReturnTo(authService.consumeReturnTo()) || nextParam;
        if (returnTo) {
          navigateToReturnTo(returnTo);
          return;
        }
        navigateHash(AUTH_FALLBACK_HASH);
      } catch (error) {
        errorBox.textContent = error.message;
      }
    });
    loginPanel.appendChild(demoLoginButton);
  };

  const renderRegister = () => {
    clearElement(registerPanel);
    registerPanel.setAttribute("aria-labelledby", "auth-tab-register");
    registerPanel.appendChild(createElement("h2", { text: content.auth.register.title }));
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

    registerPanel.appendChild(form);
  };

  const tabsList = [loginTab, registerTab];
  const panels = new Map([
    [loginTab, loginPanel],
    [registerTab, registerPanel],
  ]);

  const updateBreadcrumbLabel = (label) => {
    if (!breadcrumbs) {
      return;
    }
    const current = breadcrumbs.querySelector(".breadcrumbs__current");
    if (current) {
      current.textContent = label;
    }
  };

  const setActiveTab = (nextTab, { focus = false } = {}) => {
    tabsList.forEach((tab) => {
      const isActive = tab === nextTab;
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      const panel = panels.get(tab);
      if (panel) {
        panel.hidden = !isActive;
      }
    });
    if (nextTab === loginTab) {
      renderLogin();
      updateBreadcrumbLabel(content.auth.tabs.login);
    } else {
      renderRegister();
      updateBreadcrumbLabel(content.auth.tabs.register);
    }
    if (focus) {
      nextTab.focus();
    }
  };

  loginTab.addEventListener("click", () => {
    setActiveTab(loginTab);
  });

  registerTab.addEventListener("click", () => {
    setActiveTab(registerTab);
  });

  tabs.addEventListener("keydown", (event) => {
    const currentIndex = tabsList.indexOf(document.activeElement);
    if (currentIndex === -1) {
      return;
    }
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabsList.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabsList.length) % tabsList.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabsList.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    setActiveTab(tabsList[nextIndex], { focus: true });
  });

  setActiveTab(loginTab);

  const authShell = createElement("div", { className: "auth-shell" });
  authShell.appendChild(tabs);
  authShell.appendChild(loginPanel);
  authShell.appendChild(registerPanel);
  container.appendChild(authShell);
  main.appendChild(container);
};
