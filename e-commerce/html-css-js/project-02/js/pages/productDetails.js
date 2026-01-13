import { createElement, clearElement } from "../utils/dom.js";
import { formatCurrency, formatDate } from "../utils/format.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { purchasesService } from "../services/purchases.js";

export const renderProductDetails = ({ id }) => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { products, user } = store.getState();
  const product = products.find((item) => item.id === id);

  if (!product) {
    main.appendChild(
      createElement("div", { className: "container" }, [
        createElement("h1", { text: "Produkt nie został znaleziony" }),
        createElement("p", { text: "Sprawdź adres lub wróć do katalogu." }),
        createElement("a", { className: "button", text: "Wróć do katalogu", attrs: { href: "#/products" } }),
      ])
    );
    return;
  }

  const wrapper = createElement("section", { className: "container" });
  const layout = createElement("div", { className: "grid grid-2" });

  const image = createElement("img", { attrs: { src: product.thumbnail, alt: product.name } });
  const details = createElement("div", { className: "card" });
  details.appendChild(createElement("h1", { text: product.name }));
  details.appendChild(createElement("p", { text: product.description }));
  details.appendChild(createElement("div", { className: "price", text: formatCurrency(product.price) }));

  const tags = createElement("div", { className: "tag-list" });
  product.tags.forEach((tag) => tags.appendChild(createElement("span", { className: "badge", text: tag })));
  details.appendChild(tags);

  const metaList = createElement("div", { className: "surface-muted" }, [
    createElement("p", { text: `Kategoria: ${product.category}` }),
    createElement("p", { text: `Wymagania: ${product.requirements}` }),
    createElement("p", { text: `Wersja: ${product.version}` }),
    createElement("p", { text: `Aktualizacja: ${formatDate(product.updatedAt)}` }),
  ]);
  details.appendChild(metaList);

  const actionRow = createElement("div", { className: "nav-links" });
  const addButton = createElement("button", { className: "button", text: "Dodaj do koszyka", attrs: { type: "button" } });
  addButton.addEventListener("click", () => {
    cartService.addItem(product.id, 1);
    store.setState({ cart: cartService.getCart() });
    showToast("Produkt dodany do koszyka.");
  });
  actionRow.appendChild(addButton);
  actionRow.appendChild(createElement("a", { className: "button secondary", text: "Przejdź do koszyka", attrs: { href: "#/cart" } }));
  details.appendChild(actionRow);

  const contents = createElement("div", { className: "card section" }, [
    createElement("h2", { text: "Zawartość paczki" }),
  ]);
  const list = createElement("ul");
  product.bundleContents.forEach((item) => list.appendChild(createElement("li", { text: item })));
  contents.appendChild(list);

  const downloads = createElement("div", { className: "card section" }, [
    createElement("h2", { text: "Pliki do pobrania" }),
  ]);
  const downloadList = createElement("ul");
  const hasAccess = user ? purchasesService.getLibrary(user.id).some((entry) => entry.productId === product.id) : false;

  product.downloadables.forEach((item) => {
    const label = hasAccess ? `${item.name} (${item.size})` : `${item.name} (odblokuj po zakupie)`;
    downloadList.appendChild(createElement("li", { text: label }));
  });
  downloads.appendChild(downloadList);
  if (!hasAccess) {
    downloads.appendChild(createElement("p", { text: "Pliki pojawią się w bibliotece po zakończeniu zamówienia." }));
  }

  layout.appendChild(image);
  layout.appendChild(details);

  wrapper.appendChild(layout);
  wrapper.appendChild(contents);
  wrapper.appendChild(downloads);

  main.appendChild(wrapper);
};
