import { getContent } from "../content/index.js";
import { createElement } from "../utils/dom.js";

const renderLoadingState = ({ title, message } = {}) => {
  const content = getContent();
  const resolvedTitle = title || content.states.route.loading.title;
  const resolvedMessage = message || content.states.route.loading.message;
  return createElement(
    "div",
    {
      className: "notice",
      attrs: { role: "status", "aria-live": "polite" },
    },
    [
      createElement("h2", { text: resolvedTitle }),
      resolvedMessage ? createElement("p", { text: resolvedMessage }) : null,
    ]
  );
};

const renderEmptyState = ({ title, message = "", ctaText, ctaHref, onCta } = {}) => {
  const content = getContent();
  const resolvedTitle = title || content.states.emptyFallbackTitle;
  const actions = [];
  if (ctaText) {
    if (ctaHref) {
      actions.push(
        createElement("a", { className: "button", text: ctaText, attrs: { href: ctaHref } })
      );
    } else if (onCta) {
      const button = createElement("button", {
        className: "button",
        text: ctaText,
        attrs: { type: "button" },
      });
      button.addEventListener("click", onCta);
      actions.push(button);
    }
  }

  return createElement("div", { className: "notice" }, [
    createElement("h2", { text: resolvedTitle }),
    message ? createElement("p", { text: message }) : null,
    actions.length ? createElement("div", { className: "nav-links" }, actions) : null,
  ]);
};

const renderErrorState = ({ title, message, ctaText, ctaHref, onCta } = {}) => {
  const content = getContent();
  const resolvedTitle = title || content.errors.unexpectedTitle;
  const resolvedMessage = message || content.errors.unexpectedDescription;
  const actions = [];
  if (ctaText) {
    if (ctaHref) {
      actions.push(
        createElement("a", { className: "button", text: ctaText, attrs: { href: ctaHref } })
      );
    } else if (onCta) {
      const button = createElement("button", {
        className: "button",
        text: ctaText,
        attrs: { type: "button" },
      });
      button.addEventListener("click", onCta);
      actions.push(button);
    }
  }

  return createElement(
    "div",
    {
      className: "notice",
      attrs: { role: "alert" },
    },
    [
      createElement("h2", { text: resolvedTitle }),
      resolvedMessage ? createElement("p", { text: resolvedMessage }) : null,
      actions.length ? createElement("div", { className: "nav-links" }, actions) : null,
    ]
  );
};

export { renderLoadingState, renderEmptyState, renderErrorState };
