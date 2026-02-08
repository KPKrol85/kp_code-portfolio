import { qs } from "../utils/dom.js";

export const initDrawer = () => {
  const toggle = qs("#drawerToggle");
  const sidebar = qs("#sidebar");
  const overlay = document.createElement("div");
  overlay.className = "drawer-overlay";
  document.body.appendChild(overlay);

  const close = () => {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const open = () => {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  toggle.addEventListener("click", () => {
    if (sidebar.classList.contains("is-open")) {
      close();
    } else {
      open();
    }
  });

  overlay.addEventListener("click", close);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  return { open, close };
};
