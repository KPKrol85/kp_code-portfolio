(function () {
  try {
    var applyTheme = function (isDark) {
      if (!document.body) return;
      document.body.classList.toggle("dark-mode", isDark);
    };
    var initTheme = function () {
      var t = localStorage.getItem("theme");
      if (t === "dark" || t === "light") applyTheme(t === "dark");
      else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        applyTheme(true);
      }
    };
    if (document.body) initTheme();
    else document.addEventListener("DOMContentLoaded", initTheme, { once: true });
  } catch (e) {}
})();
