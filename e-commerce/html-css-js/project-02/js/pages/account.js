import { createElement, clearElement } from "../utils/dom.js";
import { navigateHash, parseHash } from "../utils/navigation.js";
import { formatCurrency, formatDate } from "../utils/format.js";
import { authService } from "../services/auth.js";
import { purchasesService } from "../services/purchases.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { actions } from "../store/actions.js";
import { storage } from "../services/storage.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { content } from "../content/pl.js";

const ACCOUNT_NAV_ITEMS = [
  { label: "Przegląd", href: "#/account", match: "/account" },
  { label: "Zamówienia", href: "#/account/orders", match: "/account/orders" },
  { label: "Pobrane pliki", href: "#/account/downloads", match: "/account/downloads" },
  { label: "Ustawienia", href: "#/account/settings", match: "/account/settings" },
];

const getActiveAccountPath = () => {
  const { pathname } = parseHash();
  const match = ACCOUNT_NAV_ITEMS.find((item) => item.match === pathname);
  return match?.match || "/account";
};

const createLogoutHandler = () => () => {
  authService.signOut();
  showToast(content.toasts.logout);
  navigateHash("#/auth");
};

const createAccountNav = (activePath) => {
  const nav = createElement("nav", { className: "account-nav", attrs: { "aria-label": "Konto" } });
  ACCOUNT_NAV_ITEMS.forEach((item) => {
    const isActive = item.match === activePath;
    nav.appendChild(
      createElement("a", {
        className: `account-nav__link${isActive ? " is-active" : ""}`,
        text: item.label,
        attrs: {
          href: item.href,
          "aria-current": isActive ? "page" : null,
        },
      })
    );
  });
  const logoutButton = createElement("button", {
    className: "button secondary account-nav__logout",
    text: "Wyloguj",
    attrs: { type: "button" },
  });
  logoutButton.addEventListener("click", createLogoutHandler());
  nav.appendChild(logoutButton);
  return nav;
};

const renderAccountShell = ({ title, content }) => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { pathname } = parseHash();
  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }

  container.appendChild(createElement("h1", { text: "Twoje konto" }));

  const shell = createElement("div", { className: "account-shell section" });
  shell.appendChild(createAccountNav(getActiveAccountPath()));

  const contentArea = createElement("div", { className: "account-content" });
  contentArea.appendChild(createElement("h2", { text: title }));
  if (content) {
    contentArea.appendChild(content);
  }
  shell.appendChild(contentArea);

  container.appendChild(shell);
  main.appendChild(container);
};

const renderOverviewContent = () => {
  const { user } = store.getState();
  const greetingName = user?.name ? `Witaj, ${user.name.split(" ")[0]}!` : "Witaj!";
  const emailValue = user?.email || "—";
  const accountType = user?.email === "demo@kpcode.dev" ? "Demo" : "Klient";

  const intro = createElement("div", { className: "account-intro" }, [
    createElement("p", { className: "account-greeting", text: greetingName }),
    createElement("div", { className: "account-meta" }, [
      createElement("p", { text: `E-mail: ${emailValue}` }),
      createElement("p", { text: `Typ konta: ${accountType}` }),
    ]),
    createElement("p", {
      className: "account-status",
      text: "Status konta: aktywne. Masz pelny dostep do zakupionych zasobow.",
    }),
  ]);

  const tiles = createElement("div", { className: "grid grid-2" });
  tiles.appendChild(
    createElement("div", { className: "card account-tile" }, [
      createElement("h3", { text: "Zamowienia" }),
      createElement("p", { text: "Sprawdz historie zakupow i statusy platnosci." }),
      createElement("a", {
        className: "button secondary",
        text: "Zobacz zamowienia",
        attrs: { href: "#/account/orders" },
      }),
    ])
  );
  tiles.appendChild(
    createElement("div", { className: "card account-tile" }, [
      createElement("h3", { text: "Pobrane pliki" }),
      createElement("p", { text: "Szybki dostep do wszystkich zakupionych plikow." }),
      createElement("a", {
        className: "button secondary",
        text: "Przejdz do pobran",
        attrs: { href: "#/account/downloads" },
      }),
    ])
  );

  return createElement("div", { className: "account-overview" }, [intro, tiles]);
};

const renderOrdersContent = () => {
  const orders = purchasesService.getOrders();
  if (!orders.length) {
    return renderEmptyState({
      title: "Brak zamowien",
      message: "Nie masz jeszcze zadnych zamowien. Gdy dokonasz zakupu, pojawia sie tutaj.",
      ctaText: "Przejdz do produktow",
      ctaHref: "#/products",
    });
  }

  const list = createElement("div", { className: "account-orders" });
  orders.forEach((order) => {
    const shortId = order?.id ? order.id.slice(0, 8) : "—";
    const status = "Zrealizowane";
    const detailsButton = createElement("button", {
      className: "button secondary",
      text: "Szczegoly",
      attrs: { type: "button" },
    });
    detailsButton.addEventListener("click", () => {
      showToast("Szczegoly zamowienia sa w przygotowaniu.", "info");
    });
    list.appendChild(
      createElement("div", { className: "card account-order" }, [
        createElement("div", { className: "account-order__header" }, [
          createElement("h3", { text: `Zamowienie #${shortId}` }),
          createElement("span", { className: "badge", text: status }),
        ]),
        createElement("p", { text: `Data: ${formatDate(order.createdAt)}` }),
        createElement("p", { text: `Suma: ${formatCurrency(order.total)}` }),
        detailsButton,
      ])
    );
  });
  return list;
};

const renderDownloadsContent = () => {
  const { products } = store.getState();
  const items = purchasesService.getLibraryItems();
  const productMap = new Map(products.map((product) => [product.id, product]));

  if (!items.length) {
    return renderEmptyState({
      title: "Brak plikow do pobrania",
      message: "Gdy dokonasz zakupu, produkty do pobrania beda dostepne w tym miejscu.",
      ctaText: "Zobacz produkty",
      ctaHref: "#/products",
    });
  }

  const list = createElement("div", { className: "account-downloads" });
  items.forEach((item) => {
    const product = productMap.get(item.productId);
    const name = product?.name || "Produkt cyfrowy";
    const purchasedAt = item?.purchasedAt ? formatDate(item.purchasedAt) : "—";
    const downloadButton = createElement("button", {
      className: "button secondary",
      text: "Pobierz",
      attrs: { type: "button" },
    });
    downloadButton.addEventListener("click", () => {
      showToast("Pobieranie pliku jest w przygotowaniu.", "info");
    });
    list.appendChild(
      createElement("div", { className: "card account-download" }, [
        createElement("h3", { text: name }),
        createElement("p", { text: `Zakupiono: ${purchasedAt}` }),
        createElement("p", { text: `Ilosc: ${item.quantity}` }),
        downloadButton,
      ])
    );
  });
  return list;
};

const applyThemePreference = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  storage.set("kp_theme", theme);
  actions.ui.setTheme(theme);
};

const applyReducedMotionPreference = (enabled) => {
  const value = Boolean(enabled);
  if (value) {
    document.documentElement.setAttribute("data-reduced-motion", "true");
  } else {
    document.documentElement.removeAttribute("data-reduced-motion");
  }
  storage.set("kp_reduced_motion", value);
};

const renderSettingsContent = () => {
  const { user, ui } = store.getState();
  const nameValue = user?.name || "Demo";
  const emailValue = user?.email || "demo@kpcode.dev";
  const reducedMotionStored = storage.get("kp_reduced_motion", false);
  applyReducedMotionPreference(reducedMotionStored);
  const description = createElement("p", {
    className: "account-section-lead",
    text: "Zarzadzaj danymi profilu, preferencjami i bezpieczenstwem.",
  });

  const profileCard = createElement("div", { className: "card" });
  profileCard.appendChild(createElement("h3", { text: "Profil" }));
  profileCard.appendChild(
    createElement("p", {
      className: "account-section-lead",
      text: "Zaktualizuj nazwe profilu i sprawdz przypisany e-mail.",
    })
  );
  const nameField = createElement("input", {
    className: "input",
    attrs: {
      id: "account-name",
      type: "text",
      value: nameValue,
      autocomplete: "name",
      inputmode: "text",
    },
  });
  const nameError = createElement("div", {
    className: "form-error",
    attrs: { id: "account-name-error" },
  });
  const emailField = createElement("input", {
    className: "input",
    attrs: {
      id: "account-email",
      type: "email",
      value: emailValue,
      readonly: "readonly",
    },
  });
  const profileForm = createElement("form");
  profileForm.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", { text: "Nazwa", attrs: { for: "account-name" } }),
      nameField,
      nameError,
    ])
  );
  profileForm.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", { text: "E-mail", attrs: { for: "account-email" } }),
      emailField,
    ])
  );
  const profileButton = createElement("button", {
    className: "button secondary",
    text: "Zapisz zmiany",
    attrs: { type: "submit" },
  });
  profileForm.appendChild(profileButton);
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const trimmed = nameField.value.trim();
    if (trimmed.length < 2) {
      nameError.textContent = "Nazwa musi miec co najmniej 2 znaki.";
      nameField.setAttribute("aria-invalid", "true");
      nameField.setAttribute("aria-describedby", "account-name-error");
      return;
    }
    nameError.textContent = "";
    nameField.removeAttribute("aria-invalid");
    nameField.removeAttribute("aria-describedby");
    authService.updateProfile({ name: trimmed });
    showToast("Zapisano zmiany profilu.", "info");
  });
  profileCard.appendChild(profileForm);

  const preferencesCard = createElement("div", { className: "card" });
  preferencesCard.appendChild(createElement("h3", { text: "Preferencje" }));
  preferencesCard.appendChild(
    createElement("p", {
      className: "account-section-lead",
      text: "Dostosuj wyglad i animacje do swoich preferencji.",
    })
  );
  const themeToggle = createElement("input", {
    attrs: {
      id: "account-theme-toggle",
      type: "checkbox",
      checked: ui.theme === "dark" ? "checked" : null,
    },
  });
  const motionToggle = createElement("input", {
    attrs: {
      id: "account-motion-toggle",
      type: "checkbox",
      checked: reducedMotionStored ? "checked" : null,
    },
  });
  const preferenceList = createElement("div", { className: "account-preferences" }, [
    createElement("label", { className: "account-switch", attrs: { for: "account-theme-toggle" } }, [
      createElement("span", { text: "Tryb ciemny" }),
      themeToggle,
    ]),
    createElement("label", { className: "account-switch", attrs: { for: "account-motion-toggle" } }, [
      createElement("span", { text: "Zredukowane animacje" }),
      motionToggle,
    ]),
  ]);
  preferencesCard.appendChild(preferenceList);
  const preferencesButton = createElement("button", {
    className: "button secondary",
    text: "Zapisz preferencje",
    attrs: { type: "button" },
  });
  preferencesButton.addEventListener("click", () => {
    const nextTheme = themeToggle.checked ? "dark" : "light";
    applyThemePreference(nextTheme);
    applyReducedMotionPreference(motionToggle.checked);
    showToast("Zapisano preferencje.", "info");
  });
  preferencesCard.appendChild(preferencesButton);

  const securityCard = createElement("div", { className: "card" });
  securityCard.appendChild(createElement("h3", { text: "Bezpieczenstwo" }));
  securityCard.appendChild(
    createElement("p", {
      className: "account-section-lead",
      text: "To srodowisko demo. Zmiana hasla bedzie dostepna po wdrozeniu backendu.",
    })
  );
  securityCard.appendChild(
    createElement("button", {
      className: "button secondary",
      text: "Zmien haslo",
      attrs: { type: "button", disabled: "disabled" },
    })
  );

  const dangerCard = createElement("div", { className: "card account-danger" });
  dangerCard.appendChild(createElement("h3", { text: "Strefa zagrozenia" }));
  dangerCard.appendChild(
    createElement("p", {
      className: "account-section-lead",
      text: "Wyloguj sie z konta, jesli korzystasz z publicznego urzadzenia.",
    })
  );
  const logoutAction = createElement("button", {
    className: "button secondary",
    text: "Wyloguj",
    attrs: { type: "button" },
  });
  logoutAction.addEventListener("click", createLogoutHandler());
  dangerCard.appendChild(logoutAction);

  const mainColumn = createElement("div", { className: "account-settings__main" }, [
    profileCard,
    preferencesCard,
    securityCard,
    dangerCard,
  ]);
  const asideColumn = createElement("div", { className: "account-settings__aside" }, [
    createElement("div", { className: "card" }, [
      createElement("h3", { text: "Wskazowka" }),
      createElement("p", {
        className: "account-section-lead",
        text: "Ustawienia sa zapisywane lokalnie i dzialaja w trybie demo.",
      }),
    ]),
  ]);

  const grid = createElement("div", { className: "account-settings" }, [mainColumn, asideColumn]);
  return createElement("div", { className: "account-settings-wrapper" }, [description, grid]);
};

export const renderAccountOverview = () => {
  renderAccountShell({
    title: "Przeglad",
    content: renderOverviewContent(),
  });
};

export const renderAccountOrders = () => {
  renderAccountShell({
    title: "Zamowienia",
    content: renderOrdersContent(),
  });
};

export const renderAccountDownloads = () => {
  renderAccountShell({
    title: "Pobrane pliki",
    content: renderDownloadsContent(),
  });
};

export const renderAccountSettings = () => {
  renderAccountShell({
    title: "Ustawienia konta",
    content: renderSettingsContent(),
  });
};
