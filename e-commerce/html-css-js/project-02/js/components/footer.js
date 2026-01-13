import { createElement, clearElement } from "../utils/dom.js";

const company = {
  brand: "KP_Code Digital Vault",
  owner: "Kamil Król",
  address: "ul. Marynarki Wojennej 12/31, 33-100 Tarnów, Polska",
  phone: "+48 533 537 091",
  email: "kontakt@kp-code.pl",
};

export const renderFooter = (container) => {
  clearElement(container);
  const grid = createElement("div", { className: "grid grid-3" });

  const brand = createElement("div", {}, [
    createElement("h3", { text: company.brand }),
    createElement("p", { text: "Profesjonalne produkty cyfrowe dla twórców i zespołów." }),
  ]);

  const contact = createElement("div", {}, [
    createElement("h4", { text: "Kontakt" }),
    createElement("p", { text: company.owner }),
    createElement("p", { text: company.address }),
    createElement("p", { text: company.phone }),
    createElement("p", { text: company.email }),
  ]);

  const links = createElement("div", {}, [
    createElement("h4", { text: "Szybkie linki" }),
    createElement("a", { text: "Regulamin", attrs: { href: "#/legal" } }),
    createElement("br"),
    createElement("a", { text: "Polityka prywatności", attrs: { href: "#/legal" } }),
    createElement("br"),
    createElement("a", { text: "Kontakt", attrs: { href: "#/contact" } }),
  ]);

  grid.appendChild(brand);
  grid.appendChild(contact);
  grid.appendChild(links);

  container.appendChild(grid);
};
