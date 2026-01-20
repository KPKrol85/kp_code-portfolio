import { createElement } from "../utils/dom.js";

const TOAST_TIMEOUT = 4000;

export const showToast = (message, type = "info", options = {}) => {
  const { actionLabel, onAction, duration = TOAST_TIMEOUT } = options;
  const region = document.getElementById("toast-region");
  if (!region) {
    return;
  }
  const messageEl = createElement("strong", { className: "toast-message", text: message });
  let actionButton = null;
  let toast = null;
  if (actionLabel && typeof onAction === "function") {
    actionButton = createElement("button", {
      className: "button secondary toast-action",
      text: actionLabel,
      attrs: { type: "button" },
    });
    actionButton.addEventListener("click", () => {
      onAction();
      toast?.remove();
    });
  }
  const content = createElement("div", { className: "toast-content" }, [
    messageEl,
    actionButton
      ? createElement("div", { className: "toast-actions" }, [actionButton])
      : null,
  ]);
  toast = createElement(
    "div",
    {
      className: "toast",
      attrs: { role: "status", "data-type": type },
    },
    [content]
  );

  region.appendChild(toast);
  if (typeof duration === "number") {
    setTimeout(() => {
      toast.remove();
    }, duration);
  }
};
