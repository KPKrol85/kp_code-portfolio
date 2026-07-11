export const initProgressTracker = () => {
  const items = document.querySelectorAll(
    "[data-progress-item] .progress__toggle",
  );
  if (!items.length) return;

  items.forEach((button) => {
    const icon = button.querySelector(".progress__icon");
    if (!icon) return;

    const handleClick = () => {
      const isPressed = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!isPressed));
      icon.textContent = isPressed ? "○" : "✓";
    };

    button.addEventListener("click", handleClick);
    button.disabled = false;
  });
};
