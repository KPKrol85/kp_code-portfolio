import { createElement, clearElement } from "../utils/dom.js";
import { store } from "../store/store.js";

const navItems = [
  { label: "Start", path: "#/" },
  { label: "Produkty", path: "#/products" },
  { label: "Koszyk", path: "#/cart" },
  { label: "Konto", path: "#/account" },
  { label: "Biblioteka", path: "#/library" },
  { label: "Licencje", path: "#/licenses" },
  { label: "Kontakt", path: "#/contact" },
];

export const renderHeader = (container, onThemeToggle) => {
  const build = () => {
    clearElement(container);
    const logo = createElement("img", {
      attrs: {
        src: "assets/logo.svg",
        alt: "KP_Code Digital Vault",
        width: "140",
        height: "32",
      },
    });
    const brandLink = createElement(
      "a",
      { attrs: { href: "#/" }, className: "brand" },
      [logo]
    );

    const nav = createElement("nav", { attrs: { "aria-label": "Główna" } });
    const navList = createElement("div", { className: "nav-links" });
    navItems.forEach((item) => {
      const link = createElement("a", {
        text: item.label,
        attrs: { href: item.path, "data-route": item.path },
      });
      navList.appendChild(link);
    });
    nav.appendChild(navList);

    const actions = createElement("div", { className: "nav-links" });
    const { cart, user } = store.getState();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartButton = createElement("a", {
      text: `Koszyk (${cartCount})`,
      attrs: { href: "#/cart" },
    });

    const authButton = createElement("a", {
      text: user ? "Moje konto" : "Zaloguj",
      attrs: { href: user ? "#/account" : "#/auth" },
    });

    const themeButton = createElement(
      "button",
      {
        className: "theme-toggle",
        text: "Tryb",
        attrs: { type: "button", "aria-label": "Zmień motyw" },
      }
    );
    themeButton.addEventListener("click", onThemeToggle);

    actions.appendChild(cartButton);
    actions.appendChild(authButton);
    actions.appendChild(themeButton);

    container.appendChild(brandLink);
    container.appendChild(nav);
    container.appendChild(actions);
  };

  build();
  store.subscribe(build);
};

export const updateActiveNav = (path) => {
  document.querySelectorAll("[data-route]").forEach((link) => {
    if (link.getAttribute("data-route") === path) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};
