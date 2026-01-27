import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { parseHash } from "../utils/navigation.js";

const buildActions = (ctas) => {
  if (!ctas?.length) {
    return null;
  }

  const actions = createElement("div", { className: "hero-actions" });
  ctas.forEach((cta) => {
    actions.appendChild(
      createElement("a", {
        className: `button${cta.variant === "secondary" ? " secondary" : ""}`,
        text: cta.label,
        attrs: { href: cta.href },
      })
    );
  });
  return actions;
};

export const renderPlaceholder = ({ title, lead, bullets = [], ctas = [] }) => {
  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const { pathname } = parseHash();
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));
  const heading = createElement("h1", {
    text: title,
    attrs: { tabindex: "-1", "data-focus-heading": "true" },
  });
  const intro = createElement("div", { className: "section" }, [
    breadcrumbs,
    heading,
    createElement("p", { text: lead ?? "W przygotowaniu." }),
  ]);
  const actions = buildActions(ctas);
  if (actions) {
    intro.appendChild(actions);
  }

  const details = createElement("div", { className: "card" }, [
    createElement("h2", { text: "Co będzie tutaj?" }),
  ]);
  if (bullets.length) {
    const list = createElement(
      "ul",
      {},
      bullets.map((item) => createElement("li", { text: item }))
    );
    details.appendChild(list);
  } else {
    details.appendChild(
      createElement("p", { text: "Dodamy szczegóły funkcji i treści tej sekcji." })
    );
  }

  container.appendChild(intro);
  container.appendChild(details);
  main.appendChild(container);
};

export const createPlaceholderHandler = (config) => () => renderPlaceholder(config);
