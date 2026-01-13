import { createElement } from "../utils/dom.js";

const TOAST_TIMEOUT = 4000;

export const showToast = (message, type = "info") => {
  const region = document.getElementById("toast-region");
  if (!region) {
    return;
  }
  const toast = createElement("div", {
    className: "toast",
    attrs: { role: "status", "data-type": type },
  }, [createElement("strong", { text: message })]);

  region.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, TOAST_TIMEOUT);
};
