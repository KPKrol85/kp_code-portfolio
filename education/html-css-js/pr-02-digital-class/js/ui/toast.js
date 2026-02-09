import { qs } from "../utils/dom.js";

export const showToast = (message) => {
  const root = qs("#toastRoot");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  root.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};
