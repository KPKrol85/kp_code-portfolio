import { getFocusable, log } from "./utils.js";

export function initDemoBanner() {
  const banner = document.getElementById("demo-banner");
  if (!banner) return;

  const panel = banner.querySelector(".demo-banner__panel");
  const acceptBtn = banner.querySelector("[data-demo-accept]");
  const storageKey = "gastronomy_demo_accepted";

  if (localStorage.getItem(storageKey) === "true") return;

  let lastFocused = null;
  let prevOverflow = "";

  const open = () => {
    lastFocused = document.activeElement;
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    banner.removeAttribute("hidden");
    banner.setAttribute("aria-hidden", "false");

    const focusables = getFocusable(panel || banner);
    const first = focusables[0] || panel || banner;
    if (first && typeof first.focus === "function") first.focus();
  };

  const close = () => {
    localStorage.setItem(storageKey, "true");
    banner.setAttribute("aria-hidden", "true");
    banner.setAttribute("hidden", "");
    document.body.style.overflow = prevOverflow;

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  const trapFocus = (event) => {
    if (event.key !== "Tab") return;
    const focusables = getFocusable(panel || banner);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  open();

  acceptBtn?.addEventListener("click", () => close());

  banner.addEventListener("keydown", (event) => {
    if (event.key === "Escape") return;
    trapFocus(event);
  });

  banner.addEventListener("click", (event) => {
    if (event.target === banner) event.preventDefault();
  });

  log();
}