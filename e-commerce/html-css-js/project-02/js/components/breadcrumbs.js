import { createElement } from "../utils/dom.js";

export const createBreadcrumbs = (items = [], { className } = {}) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }
  const nav = createElement("nav", {
    className: `breadcrumbs${className ? ` ${className}` : ""}`,
    attrs: { "aria-label": "Breadcrumb" },
  });
  const list = createElement("ol", { className: "breadcrumbs__list" });

  items.forEach((item, index) => {
    if (!item?.label) {
      return;
    }
    const isLast = index === items.length - 1;
    const li = createElement("li", { className: "breadcrumbs__item" });
    if (!isLast && item.href) {
      li.appendChild(
        createElement("a", {
          className: "breadcrumbs__link",
          text: item.label,
          attrs: { href: item.href },
        })
      );
    } else {
      li.appendChild(
        createElement("span", {
          className: "breadcrumbs__current",
          text: item.label,
          attrs: { "aria-current": "page" },
        })
      );
    }
    list.appendChild(li);
  });

  nav.appendChild(list);
  return nav;
};
