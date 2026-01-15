import { createElement, clearElement } from "../utils/dom.js";
import { formatDate } from "../utils/format.js";
import { store } from "../store/store.js";
import { purchasesService } from "../services/purchases.js";
import { renderNotice } from "../components/uiStates.js";

const createLicenseBlob = (details) => {
  const content = [
    "KP_Code Digital Vault - License",
    `Produkt: ${details.productName}`,
    `Licencja: ${details.license}`,
    `Klient: ${details.userName}`,
    `Data zakupu: ${details.date}`,
  ].join("\n");
  return new Blob([content], { type: "text/plain" });
};

export const renderLicenses = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { user, licenses, products, productsStatus, productsError } = store.getState();

  if (productsStatus === "loading" || productsStatus === "idle") {
    const container = createElement("section", { className: "container" });
    container.appendChild(createElement("h1", { text: "Licencje" }));
    renderNotice(container, {
      title: "Ladowanie licencji",
      message: "Trwa pobieranie danych produktow.",
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  if (productsStatus === "error") {
    const container = createElement("section", { className: "container" });
    container.appendChild(createElement("h1", { text: "Licencje" }));
    renderNotice(container, {
      title: "Nie udalo sie pobrac produktow",
      message: productsError || "Sprobuj ponownie pozniej.",
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  const container = createElement("section", { className: "container" });
  container.appendChild(createElement("h1", { text: "Licencje" }));

  const licenseGrid = createElement("div", { className: "grid grid-2" });
  if (!licenses.length) {
    renderNotice(licenseGrid, {
      title: "Brak licencji",
      message: "Brak licencji do wyswietlenia.",
    });
  } else {
    licenses.forEach((license) => {
      const card = createElement("div", { className: "card" }, [
        createElement("h2", { text: license.type }),
        createElement("p", { text: license.summary }),
        createElement("h4", { text: "Uprawnienia" }),
        createElement("ul", {}, license.permissions.map((item) => createElement("li", { text: item }))),
        createElement("h4", { text: "Ograniczenia" }),
        createElement("ul", {}, license.limitations.map((item) => createElement("li", { text: item }))),
        createElement("p", { text: `Wsparcie: ${license.support}` }),
      ]);
      licenseGrid.appendChild(card);
    });
  }

  container.appendChild(licenseGrid);

  const assignedSection = createElement("div", { className: "section" }, [
    createElement("h2", { text: "Twoje licencje" }),
  ]);

  if (!user) {
    assignedSection.appendChild(createElement("p", { text: "Zaloguj się, aby zobaczyć przypisane licencje." }));
  } else {
    const library = purchasesService.getLibrary(user.id);
    if (!library.length) {
      assignedSection.appendChild(createElement("p", { text: "Brak przypisanych licencji." }));
    } else {
      const list = createElement("div", { className: "grid grid-2" });
      library.forEach((entry) => {
        const product = products.find((item) => item.id === entry.productId);
        if (!product) {
          return;
        }
        const card = createElement("div", { className: "card" }, [
          createElement("h3", { text: product.name }),
          createElement("p", { text: `Licencja: ${entry.license}` }),
          createElement("p", { text: `Data zakupu: ${formatDate(entry.purchasedAt)}` }),
        ]);
        const downloadButton = createElement("button", {
          className: "button secondary",
          text: "Pobierz license.txt",
          attrs: { type: "button" },
        });
        downloadButton.addEventListener("click", () => {
          const blob = createLicenseBlob({
            productName: product.name,
            license: entry.license,
            userName: user.name,
            date: formatDate(entry.purchasedAt),
          });
          const url = URL.createObjectURL(blob);
          const link = createElement("a", {
            attrs: { href: url, download: `${product.id}-license.txt` },
          });
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
        });
        card.appendChild(downloadButton);
        list.appendChild(card);
      });
      assignedSection.appendChild(list);
    }
  }

  container.appendChild(assignedSection);
  main.appendChild(container);
};
