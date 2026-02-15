(function (SC) {
  "use strict";

  function initCookieBanner() {
    try {
      const KEY = "cookies-consent-v1";
      const banner = document.getElementById("cookie-banner");

      if (!banner) return;
      if (localStorage.getItem(KEY) === "accepted") return;

      const previousFocus = document.activeElement;

      banner.hidden = false;

      try {
        banner.tabIndex = -1;
        banner.focus({ preventScroll: true });
      } catch {}

      const acceptBtn = document.getElementById("cc-accept");
      const getFocusable = () =>
        Array.from(banner.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null);

      if (acceptBtn) {
        acceptBtn.addEventListener("click", () => {
          localStorage.setItem(KEY, "accepted");
          banner.hidden = true;

          try {
            (previousFocus || document.querySelector(".theme-toggle") || document.body).focus({ preventScroll: true });
          } catch {}
        });
      }

      banner.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          const focusable = getFocusable();
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          const active = document.activeElement;

          if (e.shiftKey) {
            if (active === first || !banner.contains(active)) {
              e.preventDefault();
              last.focus({ preventScroll: true });
            }
          } else if (active === last || !banner.contains(active)) {
            e.preventDefault();
            first.focus({ preventScroll: true });
          }
          return;
        }

        if (e.key !== "Escape") return;

        localStorage.setItem(KEY, "accepted");
        banner.hidden = true;

        try {
          (previousFocus || document.querySelector(".theme-toggle") || document.body).focus({ preventScroll: true });
        } catch {}
      });
    } catch {}
  }

  SC.cookieBanner = { init: initCookieBanner };
})((window.SC = window.SC || {}));
