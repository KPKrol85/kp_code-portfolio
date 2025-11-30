// Accessible accordion for FAQ section
export function initAccordion() {
  const accordions = document.querySelectorAll(".accordion__item");
  if (!accordions.length) return;

  const closeAll = () => {
    accordions.forEach((item) => {
      const btn = item.querySelector(".accordion__button");
      const panel = item.querySelector(".accordion__panel");
      btn?.setAttribute("aria-expanded", "false");
      panel?.setAttribute("hidden", "true");
    });
  };

  accordions.forEach((item) => {
    const btn = item.querySelector(".accordion__button");
    const panel = item.querySelector(".accordion__panel");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      closeAll();
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        panel.removeAttribute("hidden");
        panel.focus?.();
      }
    });
  });
}
