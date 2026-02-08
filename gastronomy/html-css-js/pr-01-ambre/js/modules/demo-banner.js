import { log } from "./utils.js";

export function initDemoBanner() {
  const banner = document.getElementById("demo-banner");
  if (!banner) return;

  const acceptBtn = banner.querySelector("[data-demo-accept]");
  const dismissBtn = banner.querySelector("[data-demo-dismiss]");
  const acceptedKey = "demoNoticeAccepted";
  const dismissedKey = "demoNoticeDismissed";

  const isStored =
    localStorage.getItem(acceptedKey) === "true" ||
    localStorage.getItem(dismissedKey) === "true";

  if (isStored) {
    banner.setAttribute("aria-hidden", "true");
    banner.setAttribute("hidden", "");
    return;
  }

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = () => {
    banner.removeAttribute("hidden");
    banner.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      banner.classList.add("is-visible");
    });
  };

  const hide = (storageKey) => {
    if (storageKey) localStorage.setItem(storageKey, "true");
    banner.setAttribute("aria-hidden", "true");
    banner.classList.remove("is-visible");
    banner.classList.add("is-hiding");

    const done = () => {
      banner.setAttribute("hidden", "");
      banner.classList.remove("is-hiding");
    };

    if (prefersReducedMotion()) {
      done();
      return;
    }

    const onEnd = (event) => {
      if (event.target !== banner) return;
      banner.removeEventListener("transitionend", onEnd);
      done();
    };

    banner.addEventListener("transitionend", onEnd);
  };

  show();

  acceptBtn?.addEventListener("click", () => hide(acceptedKey));
  dismissBtn?.addEventListener("click", () => hide(dismissedKey));

  log();
}
