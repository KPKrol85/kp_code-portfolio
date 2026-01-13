import { createElement, clearElement } from "../utils/dom.js";
import { formatCurrency } from "../utils/format.js";
import { createProductCard } from "../components/productCard.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";

export const renderHome = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const hero = createElement("section", { className: "container hero" });
  hero.appendChild(createElement("h1", { text: "KP_Code Digital Vault" }));
  hero.appendChild(
    createElement("p", {
      text: "Nowoczesny sklep z produktami cyfrowymi: szablony, UI kits i mini-narzędzia dla zespołów produktowych.",
    })
  );
  const heroActions = createElement("div", { className: "nav-links" }, [
    createElement("a", { className: "button", text: "Przeglądaj produkty", attrs: { href: "#/products" } }),
    createElement("a", { className: "button secondary", text: "Zobacz demo konta", attrs: { href: "#/account" } }),
  ]);
  hero.appendChild(heroActions);

  const stats = createElement("div", { className: "grid grid-3" }, [
    createElement("div", { className: "card" }, [
      createElement("h3", { text: "6" }),
      createElement("p", { text: "Produktów dostępnych od ręki" }),
    ]),
    createElement("div", { className: "card" }, [
      createElement("h3", { text: "98%" }),
      createElement("p", { text: "Zadowolonych klientów (mock)" }),
    ]),
    createElement("div", { className: "card" }, [
      createElement("h3", { text: "24h" }),
      createElement("p", { text: "Średni czas wdrożenia" }),
    ]),
  ]);

  const section = createElement("section", { className: "container section" });
  section.appendChild(createElement("h2", { text: "Popularne produkty" }));
  const grid = createElement("div", { className: "grid grid-3" });

  const { products } = store.getState();
  if (!products.length) {
    for (let i = 0; i < 3; i += 1) {
      grid.appendChild(createElement("div", { className: "card" }, [
        createElement("div", { className: "skeleton", attrs: { style: "height: 180px" } }),
        createElement("div", { className: "skeleton", attrs: { style: "width: 60%; height: 18px" } }),
        createElement("div", { className: "skeleton", attrs: { style: "width: 80%; height: 14px" } }),
      ]));
    }
  } else {
    products.slice(0, 3).forEach((product) => {
      grid.appendChild(
        createProductCard(product, (id) => {
          cartService.addItem(id, 1);
          store.setState({ cart: cartService.getCart() });
          showToast("Dodano produkt do koszyka.");
        })
      );
    });
  }

  section.appendChild(grid);

  const info = createElement("section", { className: "container section" }, [
    createElement("div", { className: "card" }, [
      createElement("h2", { text: "Dlaczego Digital Vault?" }),
      createElement("p", { text: "Zbieramy i aktualizujemy najlepsze assety dla projektantów i zespołów product development." }),
      createElement("div", { className: "tag-list" }, [
        createElement("span", { className: "badge", text: "Natychmiastowy dostęp" }),
        createElement("span", { className: "badge", text: "Aktualizacje w cenie" }),
        createElement("span", { className: "badge", text: `Ceny od ${formatCurrency(59)}` }),
      ]),
    ]),
  ]);

  main.appendChild(hero);
  main.appendChild(stats);
  main.appendChild(section);
  main.appendChild(info);
};
