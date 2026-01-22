import { createElement, clearElement } from "../utils/dom.js";
import { parseHash } from "../utils/navigation.js";
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";

export const renderAdmin = () => {
  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  clearElement(main);
  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(parseHash().pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  container.appendChild(
    createElement("div", { className: "card" }, [
      createElement("h1", { text: "Panel administratora" }),
      createElement("p", {
        text: "Panel administracyjny wymaga weryfikacji po stronie backendu. W trybie demo jest niedostępny.",
      }),
    ])
  );
  main.appendChild(container);
};
