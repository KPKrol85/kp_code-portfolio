export function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (!toggle || !nav) {
    return;
  }

  const updateState = (isOpen) => {
    nav.dataset.open = String(isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  };

  updateState(false);

  toggle.addEventListener("click", () => {
    const isOpen = nav.dataset.open === "true";
    updateState(!isOpen);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      updateState(false);
    }
  });
}
