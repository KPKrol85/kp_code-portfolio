(() => {
  try {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");

    const theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    root.dataset.theme = theme;
    root.classList.add("preload-theme");
  } catch {
    // ignore unavailable storage or access restrictions
  }

  window.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() =>
      document.documentElement.classList.remove("preload-theme"),
    );
  });
})();
