(function () {
  var storageKey = "kp-theme";
  var root = document.documentElement;
  var theme = null;

  try {
    var stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") theme = stored;
  } catch (err) {}

  if (!theme) {
    var preset = root.getAttribute("data-theme");
    if (preset === "light" || preset === "dark") theme = preset;
  }

  if (!theme) {
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme = prefersDark ? "dark" : "light";
  }

  root.setAttribute("data-theme", theme);

  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#181210" : "#f8f1e7");

  if ("serviceWorker" in navigator) {
    var hostname = window.location.hostname;
    var isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

    if (!isLocalhost) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(function () {
        }).catch(function (err) {
          console.warn("❌ Błąd rejestracji Service Workera:", err);
        });
      });
    }
  }
})();
