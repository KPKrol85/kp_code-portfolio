import { qs } from "../utils/dom.js";

export const showModal = (content) => {
  const root = qs("#modalRoot");
  root.innerHTML = "";
  const overlay = document.createElement("div");
  overlay.className = "drawer-overlay is-open";
  const modal = document.createElement("div");
  modal.className = "card";
  modal.style.maxWidth = "520px";
  modal.style.margin = "20vh auto";
  modal.appendChild(content);
  root.appendChild(overlay);
  root.appendChild(modal);
  const close = () => (root.innerHTML = "");
  overlay.addEventListener("click", close);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
  return close;
};
