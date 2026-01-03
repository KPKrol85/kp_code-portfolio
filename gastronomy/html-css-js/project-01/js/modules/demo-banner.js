import { getFocusable, log } from "./utils.js";

export function initDemoBanner() {
  const banner = document.getElementById("demo-banner");
  if (!banner) return;

  const panel = banner.querySelector(".demo-banner__panel");
  const acceptBtn = banner.querySelector("[data-demo-accept]");
  const storageKey = "gastronomy_demo_accepted";

  if (localStorage.getItem(storageKey) === "true") {
    banner.setAttribute("aria-hidden", "true");
    banner.setAttribute("hidden", "");
    document.body?.classList.remove("demo-banner-open");
    return;
  }

  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    document.body?.classList.add("demo-banner-open");

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
    document.body?.classList.remove("demo-banner-open");

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
