export function initAccordion() {
  const accordions = document.querySelectorAll("[data-accordion]");
  accordions.forEach((accordion) => {
    const triggers = accordion.querySelectorAll(".accordion__trigger");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!isExpanded));
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        if (panel) {
          panel.hidden = isExpanded;
        }
      });
    });
  });
}
