import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";

export const renderNotFound = () => {
  const main = document.getElementById("main-content");
  clearElement(main);
  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath("/404"));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  container.appendChild(createElement("h1", { text: "404" }));
  container.appendChild(
    createElement("p", {
      text: "Nie znaleziono strony. Sprawdź adres lub wróć na stronę główną.",
    })
  );
  container.appendChild(
    createElement("a", { className: "button", text: "Powrót", attrs: { href: "#/" } })
  );
  main.appendChild(container);
};
