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
import { applyReducedMotion } from "../reduced-motion-init.js";

const ACCOUNT_NAV_ITEMS = [
  { label: content.account.nav.overview, href: "#/account", match: "/account" },
  { label: content.account.nav.orders, href: "#/account/orders", match: "/account/orders" },
  {
    label: content.account.nav.downloads,
    href: "#/account/downloads",
    match: "/account/downloads",
  },
  { label: content.account.nav.settings, href: "#/account/settings", match: "/account/settings" },
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
  const nav = createElement("nav", {
    className: "account-nav",
    attrs: { "aria-label": content.account.nav.ariaLabel },
  });
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
    text: content.account.nav.logout,
    attrs: { type: "button" },
  });
  logoutButton.addEventListener("click", createLogoutHandler());
  nav.appendChild(logoutButton);
  return nav;
};

const renderAccountShell = ({ title, contentNode }) => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { pathname } = parseHash();
  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }

  container.appendChild(createElement("h1", { text: content.account.title }));

  const shell = createElement("div", { className: "account-shell section" });
  shell.appendChild(createAccountNav(getActiveAccountPath()));

  const contentArea = createElement("div", { className: "account-content" });
  contentArea.appendChild(createElement("h2", { text: title }));
  if (contentNode) {
    contentArea.appendChild(contentNode);
  }
  shell.appendChild(contentArea);

  container.appendChild(shell);
  main.appendChild(container);
};

const renderOverviewContent = () => {
  const { user } = store.getState();
  const firstName = user?.name ? user.name.split(" ")[0] : "";
  const greetingName = firstName
    ? content.account.overview.greetingWithName.replace("{name}", firstName)
    : content.account.overview.greeting;
  const emailValue = user?.email || "—";
  const accountType =
    user?.email === "demo@kpcode.dev"
      ? content.account.overview.accountTypeDemo
      : content.account.overview.accountTypeClient;

  const intro = createElement("div", { className: "account-intro" }, [
    createElement("p", { className: "account-greeting", text: greetingName }),
    createElement("div", { className: "account-meta" }, [
      createElement("p", { text: `E-mail: ${emailValue}` }),
      createElement("p", {
        text: `${content.account.overview.accountTypeLabel}: ${accountType}`,
      }),
    ]),
    createElement("p", {
      className: "account-status",
      text: content.account.overview.status,
    }),
  ]);

  const tiles = createElement("div", { className: "grid grid-2" });
  tiles.appendChild(
    createElement("div", { className: "card account-tile" }, [
      createElement("h3", { text: content.account.overview.tiles.orders.title }),
      createElement("p", { text: content.account.overview.tiles.orders.description }),
      createElement("a", {
        className: "button secondary",
        text: content.account.overview.tiles.orders.cta,
        attrs: { href: "#/account/orders" },
      }),
    ])
  );
  tiles.appendChild(
    createElement("div", { className: "card account-tile" }, [
      createElement("h3", { text: content.account.overview.tiles.downloads.title }),
      createElement("p", { text: content.account.overview.tiles.downloads.description }),
      createElement("a", {
        className: "button secondary",
        text: content.account.overview.tiles.downloads.cta,
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
      title: content.account.orders.empty.title,
      message: content.account.orders.empty.message,
      ctaText: content.account.orders.empty.cta,
      ctaHref: "#/products",
    });
  }

  const list = createElement("div", { className: "account-orders" });
  orders.forEach((order) => {
    const shortId = order?.id ? order.id.slice(0, 8) : "—";
    const status = content.account.orders.statusCompleted;
    const detailsButton = createElement("button", {
      className: "button secondary",
      text: content.account.orders.detailsCta,
      attrs: { type: "button" },
    });
    detailsButton.addEventListener("click", () => {
      showToast(content.account.orders.detailsToast, "info");
    });
    list.appendChild(
      createElement("div", { className: "card account-order" }, [
        createElement("div", { className: "account-order__header" }, [
          createElement("h3", {
            text: content.account.orders.orderLabel.replace("{id}", shortId),
          }),
          createElement("span", { className: "badge", text: status }),
        ]),
        createElement("p", {
          text: `${content.account.orders.dateLabel}: ${formatDate(order.createdAt)}`,
        }),
        createElement("p", {
          text: `${content.account.orders.totalLabel}: ${formatCurrency(order.total)}`,
        }),
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
      title: content.account.downloads.empty.title,
      message: content.account.downloads.empty.message,
      ctaText: content.account.downloads.empty.cta,
      ctaHref: "#/products",
    });
  }

  const list = createElement("div", { className: "account-downloads" });
  items.forEach((item) => {
    const product = productMap.get(item.productId);
    const name = product?.name || content.account.downloads.fallbackProduct;
    const purchasedAt = item?.purchasedAt ? formatDate(item.purchasedAt) : "—";
    const downloadButton = createElement("button", {
      className: "button secondary",
      text: content.account.downloads.downloadCta,
      attrs: { type: "button" },
    });
    downloadButton.addEventListener("click", () => {
      showToast(content.account.downloads.downloadToast, "info");
    });
    list.appendChild(
      createElement("div", { className: "card account-download" }, [
        createElement("h3", { text: name }),
        createElement("p", {
          text: `${content.account.downloads.purchasedAtLabel}: ${purchasedAt}`,
        }),
        createElement("p", {
          text: `${content.account.downloads.quantityLabel}: ${item.quantity}`,
        }),
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
  applyReducedMotion(value);
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
    text: content.account.settings.lead,
  });

  const profileCard = createElement("div", { className: "card" });
  profileCard.appendChild(createElement("h3", { text: content.account.settings.profile.title }));
  profileCard.appendChild(
    createElement("p", {
      className: "account-section-lead",
      text: content.account.settings.profile.lead,
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
      createElement("label", {
        text: content.account.settings.profile.nameLabel,
        attrs: { for: "account-name" },
      }),
      nameField,
      nameError,
    ])
  );
  profileForm.appendChild(
    createElement("div", { className: "form-field" }, [
      createElement("label", {
        text: content.common.fields.email,
        attrs: { for: "account-email" },
      }),
      emailField,
    ])
  );
  const profileButton = createElement("button", {
    className: "button secondary",
    text: content.account.settings.profile.saveCta,
    attrs: { type: "submit" },
  });
  profileForm.appendChild(profileButton);
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const trimmed = nameField.value.trim();
    if (trimmed.length < 2) {
      nameError.textContent = content.common.validation.profileNameMinLength;
      nameField.setAttribute("aria-invalid", "true");
      nameField.setAttribute("aria-describedby", "account-name-error");
      return;
    }
    nameError.textContent = "";
    nameField.removeAttribute("aria-invalid");
    nameField.removeAttribute("aria-describedby");
    authService.updateProfile({ name: trimmed });
    showToast(content.account.settings.profile.savedToast, "info");
  });
  profileCard.appendChild(profileForm);

  const preferencesCard = createElement("div", { className: "card" });
  preferencesCard.appendChild(
    createElement("h3", { text: content.account.settings.preferences.title })
  );
  preferencesCard.appendChild(
    createElement("p", {
      className: "account-section-lead",
      text: content.account.settings.preferences.lead,
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
      createElement("span", { text: content.account.settings.preferences.darkMode }),
      themeToggle,
    ]),
    createElement("label", { className: "account-switch", attrs: { for: "account-motion-toggle" } }, [
      createElement("span", { text: content.account.settings.preferences.reducedMotion }),
      motionToggle,
    ]),
  ]);
  preferencesCard.appendChild(preferenceList);
  const preferencesButton = createElement("button", {
    className: "button secondary",
    text: content.account.settings.preferences.saveCta,
    attrs: { type: "button" },
  });
  preferencesButton.addEventListener("click", () => {
    const nextTheme = themeToggle.checked ? "dark" : "light";
    applyThemePreference(nextTheme);
    applyReducedMotionPreference(motionToggle.checked);
    showToast(content.account.settings.preferences.savedToast, "info");
  });
  preferencesCard.appendChild(preferencesButton);

  const securityCard = createElement("div", { className: "card" });
  securityCard.appendChild(createElement("h3", { text: content.account.settings.security.title }));
  securityCard.appendChild(
    createElement("p", {
      className: "account-section-lead",
      text: content.account.settings.security.lead,
    })
  );
  securityCard.appendChild(
    createElement("button", {
      className: "button secondary",
      text: content.account.settings.security.changePasswordCta,
      attrs: { type: "button", disabled: "disabled" },
    })
  );

  const dangerCard = createElement("div", { className: "card account-danger" });
  dangerCard.appendChild(createElement("h3", { text: content.account.settings.danger.title }));
  dangerCard.appendChild(
    createElement("p", {
      className: "account-section-lead",
      text: content.account.settings.danger.lead,
    })
  );
  const logoutAction = createElement("button", {
    className: "button secondary",
    text: content.account.settings.danger.logoutCta,
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
      createElement("h3", { text: content.account.settings.hint.title }),
      createElement("p", {
        className: "account-section-lead",
        text: content.account.settings.hint.message,
      }),
    ]),
  ]);

  const grid = createElement("div", { className: "account-settings" }, [mainColumn, asideColumn]);
  return createElement("div", { className: "account-settings-wrapper" }, [description, grid]);
};

export const renderAccountOverview = () => {
  renderAccountShell({
    title: content.account.overviewSectionTitle,
    contentNode: renderOverviewContent(),
  });
};

export const renderAccountOrders = () => {
  renderAccountShell({
    title: content.account.orders.title,
    contentNode: renderOrdersContent(),
  });
};

export const renderAccountDownloads = () => {
  renderAccountShell({
    title: content.account.downloads.title,
    contentNode: renderDownloadsContent(),
  });
};

export const renderAccountSettings = () => {
  renderAccountShell({
    title: content.account.settings.title,
    contentNode: renderSettingsContent(),
  });
};
