import { createElement, clearElement } from "../utils/dom.js";
import { parseHash } from "../utils/navigation.js";
import { formatCurrency, formatDate } from "../utils/format.js";
import { purchasesService } from "../services/purchases.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";

const ACCOUNT_NAV_ITEMS = [
  { label: "Przegląd", href: "#/account", match: "/account" },
  { label: "Zamówienia", href: "#/account/orders", match: "/account/orders" },
  { label: "Pobrane pliki", href: "#/account/downloads", match: "/account/downloads" },
];

const getActiveAccountPath = () => {
  const { pathname } = parseHash();
  const match = ACCOUNT_NAV_ITEMS.find((item) => item.match === pathname);
  return match?.match || "/account";
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

  const intro = createElement("div", { className: "account-intro" }, [
    createElement("p", { className: "account-greeting", text: greetingName }),
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
      message: "Twoja historia zamowien jest pusta. Dodaj cos do koszyka i wroc tutaj.",
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
      message: "Po zakupie produkty pojawia sie tutaj automatycznie.",
      ctaText: "Przejdz do produktow",
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
