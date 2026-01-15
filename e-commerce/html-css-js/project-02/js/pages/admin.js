import { createElement, clearElement } from "../utils/dom.js";

export const renderAdmin = () => {
  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  clearElement(main);
  const container = createElement("section", { className: "container" }, [
    createElement("div", { className: "card" }, [
      createElement("h1", { text: "Panel administratora" }),
      createElement("p", { text: "Panel administratora (w budowie)." }),
    ]),
  ]);
  main.appendChild(container);
};
