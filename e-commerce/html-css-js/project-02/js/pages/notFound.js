import { createElement, clearElement } from "../utils/dom.js";

export const renderNotFound = () => {
  const main = document.getElementById("main-content");
  clearElement(main);
  const container = createElement("section", { className: "container" }, [
    createElement("h1", { text: "404" }),
    createElement("p", { text: "Nie znaleziono strony. Sprawdź adres lub wróć na stronę główną." }),
    createElement("a", { className: "button", text: "Powrót", attrs: { href: "#/" } }),
  ]);
  main.appendChild(container);
};
