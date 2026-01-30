import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { getContent } from "../content/index.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { parseHash } from "../utils/navigation.js";

export const renderAdmin = () => {
  const content = getContent();
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
      createElement("h1", { text: content.access.adminDisabled.title }),
      createElement("p", {
        text: content.access.adminDisabled.message,
      }),
    ])
  );
  main.appendChild(container);
};
