import { applyTheme, initTheme, toggleTheme } from "../theme.js";

import { createThemeToggleButton } from "./theme-toggle.js";

const slots = document.querySelectorAll("[data-theme-toggle-slot]");

if (slots.length) {
  let currentTheme = null;
  const updateHandlers = new Set();

  const handleThemeChange = (theme) => {
    currentTheme = theme;
    updateHandlers.forEach((update) => update(theme));
  };

  const initialTheme = initTheme({ onChange: handleThemeChange });

  slots.forEach((slot) => {
    const { button, updateLabel } = createThemeToggleButton({
      theme: currentTheme ?? initialTheme,
      onToggle: () => {
        const nextTheme = toggleTheme(currentTheme ?? initialTheme);
        applyTheme(nextTheme, { onChange: handleThemeChange });
      },
    });
    updateHandlers.add(updateLabel);
    updateLabel(currentTheme ?? initialTheme);
    slot.appendChild(button);
  });
}
