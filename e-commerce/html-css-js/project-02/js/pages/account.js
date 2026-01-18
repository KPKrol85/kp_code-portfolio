import { createElement, clearElement } from "../utils/dom.js";
import { navigateHash } from "../utils/navigation.js";
import { formatDate, formatCurrency } from "../utils/format.js";
import { authService } from "../services/auth.js";
import { purchasesService } from "../services/purchases.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { content } from "../content/pl.js";

export const renderAccount = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { user } = store.getState();

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Panel konta" }));

  if (!user) {
    container.appendChild(
      createElement("div", { className: "notice" }, [
        createElement("p", { text: "Zaloguj się, aby zobaczyć szczegóły konta." }),
        createElement("a", { className: "button", text: "Zaloguj się", attrs: { href: "#/auth" } }),
      ])
    );
    main.appendChild(container);
    return;
  }

  const profile = createElement("div", { className: "card" }, [
    createElement("h2", { text: "Twoje dane" }),
    createElement("p", { text: `Imię i nazwisko: ${user.name}` }),
    createElement("p", { text: `E-mail: ${user.email}` }),
    createElement("p", { text: `Data rejestracji: ${formatDate(user.createdAt)}` }),
    createElement("div", { className: "nav-links" }, [
      createElement("a", {
        className: "button secondary",
        text: "Biblioteka",
        attrs: { href: "#/library" },
      }),
      createElement("a", {
        className: "button secondary",
        text: "Licencje",
        attrs: { href: "#/licenses" },
      }),
    ]),
  ]);

  const orders = purchasesService.getOrders();
  const ordersCard = createElement("div", { className: "card" }, [
    createElement("h2", { text: "Historia zamówień" }),
  ]);

  if (!orders.length) {
    ordersCard.appendChild(createElement("p", { text: "Brak zamówień do wyświetlenia." }));
  } else {
    const list = createElement("ul");
    orders.forEach((order) => {
      list.appendChild(
        createElement("li", {
          text: `Zamówienie ${order.id.slice(0, 8)} — ${formatCurrency(order.total)} — ${formatDate(order.createdAt)}`,
        })
      );
    });
    ordersCard.appendChild(list);
  }

  const logoutButton = createElement("button", {
    className: "button",
    text: "Wyloguj",
    attrs: { type: "button" },
  });
  logoutButton.addEventListener("click", () => {
    authService.signOut();
    showToast(content.toasts.logout);
    navigateHash("#/auth");
  });

  const layout = createElement("div", { className: "grid grid-2 section" }, [profile, ordersCard]);
  container.appendChild(layout);
  container.appendChild(logoutButton);
  main.appendChild(container);
};
