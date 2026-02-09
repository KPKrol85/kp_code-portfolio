import { CONFIG } from "../config.js";
import { qs } from "./dom.js";

export const showToast = (message) => {
  const toast = qs(CONFIG.selectors.toastRegion);
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("toast--visible");
  toast.setAttribute("aria-live", "polite");
  window.setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 2500);
};
