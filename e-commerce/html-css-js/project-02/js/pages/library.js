import { createElement, clearElement } from "../utils/dom.js";
import { formatDate } from "../utils/format.js";
import { purchasesService } from "../services/purchases.js";
import { store } from "../store/store.js";

export const renderLibrary = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { user, products } = store.getState();
  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Twoja biblioteka" }));

  if (!user) {
    container.appendChild(
      createElement("div", { className: "notice" }, [
        createElement("p", { text: "Zaloguj się, aby zobaczyć zakupione pliki." }),
        createElement("a", { className: "button", text: "Zaloguj się", attrs: { href: "#/auth" } }),
      ])
    );
    main.appendChild(container);
    return;
  }

  const library = purchasesService.getLibrary(user.id);
  if (!library.length) {
    container.appendChild(
      createElement("div", { className: "notice" }, [
        createElement("h2", { text: "Brak zakupów" }),
        createElement("p", { text: "Po zakupie produkty pojawią się tutaj automatycznie." }),
        createElement("a", { className: "button", text: "Przejdź do katalogu", attrs: { href: "#/products" } }),
      ])
    );
    main.appendChild(container);
    return;
  }

  const grid = createElement("div", { className: "grid grid-2 section" });
  library.forEach((entry) => {
    const product = products.find((item) => item.id === entry.productId);
    if (!product) {
      return;
    }
    const card = createElement("div", { className: "card" });
    card.appendChild(createElement("h3", { text: product.name }));
    card.appendChild(createElement("p", { text: product.shortDescription }));
    card.appendChild(createElement("p", { text: `Zakupiono: ${formatDate(entry.purchasedAt)}` }));

    const list = createElement("ul");
    product.downloadables.forEach((file) => {
      const link = createElement("a", {
        text: `${file.name} (${file.size})`,
        attrs: { href: "assets/demo-download.txt", download: "" },
      });
      const item = createElement("li", {}, [link]);
      list.appendChild(item);
    });
    card.appendChild(list);
    grid.appendChild(card);
  });

  container.appendChild(grid);
  main.appendChild(container);
};
