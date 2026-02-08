import { getContent } from "../content/index.js";

import { createElement, clearElement } from "./dom.js";
import { navigateHash } from "./navigation.js";

let fallbackShown = false;
let handling = false;

const toError = (value, fallbackMessage) => {
  if (value instanceof Error) {
    return value;
  }
  const message = typeof value === "string" ? value : fallbackMessage;
  return new Error(message);
};

const showFallback = (error, source) => {
  if (fallbackShown || handling) {
    return;
  }
  handling = true;
  fallbackShown = true;
  try {
    console.error("[error-boundary]", source, error);
    const main = document.getElementById("main-content");
    if (!main) {
      console.error("[error-boundary] Missing #main-content, cannot render fallback.");
      return;
    }
    clearElement(main);
    const content = getContent();

    const container = createElement("section", { className: "container" });
    const card = createElement("div", { className: "card" }, [
      createElement("h1", { text: content.errors.unexpectedTitle }),
      createElement("p", {
        text: content.errors.unexpectedDescription,
      }),
    ]);

    const actions = createElement("div", { className: "nav-links" });
    const reloadButton = createElement("button", {
      className: "button",
      text: content.errors.retryAction,
      attrs: { type: "button" },
    });
    reloadButton.addEventListener("click", () => {
      window.location.reload();
    });
    const homeButton = createElement("button", {
      className: "button secondary",
      text: content.errors.homeAction,
      attrs: { type: "button" },
    });
    homeButton.addEventListener("click", () => {
      navigateHash("#/", { force: true });
    });

    actions.appendChild(reloadButton);
    actions.appendChild(homeButton);
    card.appendChild(actions);
    container.appendChild(card);
    main.appendChild(container);
  } catch (renderError) {
    console.error("[error-boundary] Failed to render fallback.", renderError);
  } finally {
    handling = false;
  }
};

const initErrorBoundary = () => {
  window.addEventListener("error", (event) => {
    const error = toError(event?.error, event?.message || "Unhandled error");
    showFallback(error, "error");
  });

  window.addEventListener("unhandledrejection", (event) => {
    const error = toError(event?.reason, "Unhandled promise rejection");
    showFallback(error, "unhandledrejection");
  });
};

export { initErrorBoundary };
