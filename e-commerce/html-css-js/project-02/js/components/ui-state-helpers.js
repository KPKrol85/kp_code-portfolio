import { createElement } from "../utils/dom.js";

const renderLoadingState = ({ title = "Loading", message = "Please wait..." } = {}) => {
  return createElement("div", {
    className: "notice",
    attrs: { role: "status", "aria-live": "polite" },
  }, [
    createElement("h2", { text: title }),
    message ? createElement("p", { text: message }) : null,
  ]);
};

const renderEmptyState = ({
  title = "Nothing here yet.",
  message = "",
  ctaText,
  ctaHref,
  onCta,
} = {}) => {
  const actions = [];
  if (ctaText) {
    if (ctaHref) {
      actions.push(createElement("a", { className: "button", text: ctaText, attrs: { href: ctaHref } }));
    } else if (onCta) {
      const button = createElement("button", { className: "button", text: ctaText, attrs: { type: "button" } });
      button.addEventListener("click", onCta);
      actions.push(button);
    }
  }

  return createElement("div", { className: "notice" }, [
    createElement("h2", { text: title }),
    message ? createElement("p", { text: message }) : null,
    actions.length ? createElement("div", { className: "nav-links" }, actions) : null,
  ]);
};

const renderErrorState = ({
  title = "Something went wrong.",
  message = "Please try again later.",
  ctaText,
  ctaHref,
  onCta,
} = {}) => {
  const actions = [];
  if (ctaText) {
    if (ctaHref) {
      actions.push(createElement("a", { className: "button", text: ctaText, attrs: { href: ctaHref } }));
    } else if (onCta) {
      const button = createElement("button", { className: "button", text: ctaText, attrs: { type: "button" } });
      button.addEventListener("click", onCta);
      actions.push(button);
    }
  }

  return createElement("div", {
    className: "notice",
    attrs: { role: "alert" },
  }, [
    createElement("h2", { text: title }),
    message ? createElement("p", { text: message }) : null,
    actions.length ? createElement("div", { className: "nav-links" }, actions) : null,
  ]);
};

export { renderLoadingState, renderEmptyState, renderErrorState };
