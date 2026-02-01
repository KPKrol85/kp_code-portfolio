(() => {
  const stored = window.safeStorage?.safeGetJSON("kp_theme", null);
  const theme =
    stored ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
})();
