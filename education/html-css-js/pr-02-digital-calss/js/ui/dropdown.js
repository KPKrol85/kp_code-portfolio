export const bindDropdown = (trigger, menu) => {
  const toggle = () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", expanded ? "false" : "true");
    menu.hidden = expanded;
  };
  trigger.addEventListener("click", toggle);
  document.addEventListener("click", (event) => {
    if (!trigger.contains(event.target) && !menu.contains(event.target)) {
      trigger.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    }
  });
};
