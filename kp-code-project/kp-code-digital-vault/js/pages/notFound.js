import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { getContent } from "../content/index.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";

export const renderNotFound = () => {
  const content = getContent();
  const main = document.getElementById("main-content");
  clearElement(main);
  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath("/404"));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  container.appendChild(createElement("h1", { text: content.notFound.title }));
  container.appendChild(
    createElement("p", {
      text: content.notFound.lead,
    })
  );
  container.appendChild(
    createElement("a", { className: "button", text: content.notFound.ctaLabel, attrs: { href: "#/" } })
  );
  main.appendChild(container);
};
