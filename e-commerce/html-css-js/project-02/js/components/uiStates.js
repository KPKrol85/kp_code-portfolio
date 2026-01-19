import { createElement, clearElement } from "../utils/dom.js";
import { content } from "../content/pl.js";

const createNotice = ({ title, message, action, headingTag = "h3" } = {}) => {
  const children = [];
  if (title) {
    children.push(createElement(headingTag, { text: title }));
  }
  if (message) {
    children.push(createElement("p", { text: message }));
  }
  if (action?.element) {
    children.push(action.element);
  } else if (action?.href && action?.label) {
    children.push(
      createElement("a", {
        className: action.className || "button",
        text: action.label,
        attrs: { href: action.href },
      })
    );
  }
  return createElement("div", { className: "notice" }, children);
};

const createSkeletonCard = ({
  imageHeight = 180,
  lineWidths = [60, 80],
  lineHeights = [18, 14],
} = {}) => {
  const card = createElement("div", { className: "card" });
  card.appendChild(
    createElement("div", { className: "skeleton", attrs: { style: `height: ${imageHeight}px` } })
  );
  lineWidths.forEach((width, index) => {
    const height = lineHeights[index] || lineHeights[lineHeights.length - 1] || 14;
    card.appendChild(
      createElement("div", {
        className: "skeleton",
        attrs: { style: `width: ${width}%; height: ${height}px` },
      })
    );
  });
  return card;
};

export const renderNotice = (container, options) => {
  const notice = createNotice(options);
  container.appendChild(notice);
  return notice;
};

export const createRetryButton = (label = "Spróbuj ponownie") => {
  return createElement("button", {
    className: "button",
    text: label,
    attrs: { type: "button", "data-retry": "init-data" },
  });
};

export const renderSkeletonCards = (container, options = {}) => {
  const { count = 3 } = options;
  for (let i = 0; i < count; i += 1) {
    container.appendChild(createSkeletonCard(options));
  }
};

export const renderDataState = (
  container,
  { status, items, error, loading, empty, errorState } = {}
) => {
  clearElement(container);

  if (status === "loading" || status === "idle") {
    if (loading?.variant === "notice") {
      renderNotice(container, loading);
    } else {
      renderSkeletonCards(container, loading);
    }
    return true;
  }

  if (status === "error") {
    renderNotice(container, {
      ...errorState,
      message: errorState?.message || error || content.states.errorFallbackMessage,
    });
    return true;
  }

  if (status === "ready" && Array.isArray(items) && items.length === 0) {
    renderNotice(container, empty);
    return true;
  }

  return false;
};
