import { content } from "../content/pl.js";
import { createElement, clearElement } from "../utils/dom.js";

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

const createProductCardSkeleton = ({
  lineWidths = [65, 85],
  lineHeights = [18, 14],
  tagCount = 3,
  tagWidth = 60,
  priceWidth = 35,
  imageAspect = "16 / 10",
} = {}) => {
  const card = createElement("div", { className: "card card-product is-skeleton" });
  const media = createElement("div", {
    className: "skeleton card-product-media",
    attrs: { style: `aspect-ratio: ${imageAspect};` },
  });
  const title = createElement("div", {
    className: "skeleton",
    attrs: { style: `width: ${lineWidths[0]}%; height: ${lineHeights[0]}px` },
  });
  const desc = createElement("div", {
    className: "skeleton",
    attrs: { style: `width: ${lineWidths[1]}%; height: ${lineHeights[1]}px` },
  });
  const tags = createElement("div", { className: "tag-list" });
  for (let i = 0; i < tagCount; i += 1) {
    tags.appendChild(
      createElement("span", {
        className: "badge skeleton",
        attrs: { style: `width: ${tagWidth}px; height: 22px` },
      })
    );
  }
  const price = createElement("div", {
    className: "skeleton",
    attrs: { style: `width: ${priceWidth}%; height: ${lineHeights[0]}px` },
  });
  const actions = createElement("div", { className: "flex-between" }, [
    createElement("div", { className: "skeleton skeleton-button" }),
    createElement("div", { className: "skeleton skeleton-button" }),
  ]);
  card.appendChild(media);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(tags);
  card.appendChild(price);
  card.appendChild(actions);
  return card;
};

const createSkeletonCard = ({
  imageHeight = 180,
  lineWidths = [60, 80],
  lineHeights = [18, 14],
  variant,
  ...rest
} = {}) => {
  if (variant === "product-card") {
    return createProductCardSkeleton({ lineWidths, lineHeights, ...rest });
  }
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
