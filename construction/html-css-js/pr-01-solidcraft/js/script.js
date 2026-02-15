(function (win, doc) {
  "use strict";

  win.SC = win.SC || {};

  const modules = [
    "modules/utils.js",
    "modules/nav.js",
    "modules/ui-core.js",
    "modules/forms.js",
    "modules/lightbox.js",
    "modules/prefetch.js",
    "modules/home.js",
    "modules/map-consent.js",
    "modules/cookie-banner.js",
  ];

  const getScriptBase = () => {
    const current =
      doc.currentScript ||
      Array.from(doc.scripts).find((s) =>
        /\/script(?:\.min)?\.js(?:$|\?)/.test(s.src),
      );

    if (current && current.src) {
      return current.src.replace(/[^/]+$/, "");
    }

    return `${location.origin}/js/`;
  };

  const loadModulesSequentially = (baseUrl) =>
    modules.reduce(
      (p, relPath) =>
        p.then(
          () =>
            new Promise((resolve, reject) => {
              const s = doc.createElement("script");
              s.src = baseUrl + relPath;
              s.async = false;
              s.defer = false;
              s.onload = () => resolve();
              s.onerror = () =>
                reject(new Error(`Module load failed: ${relPath}`));
              doc.head.appendChild(s);
            }),
        ),
      Promise.resolve(),
    );

  const runInit = () => {
    const SC = win.SC || {};

    SC.utils?.syncHeaderCssVar?.();

    SC.nav?.init?.();
    SC.nav?.initHeaderShrink?.();
    SC.nav?.initScrollSpy?.();

    SC.ui?.initFooterYear?.();
    SC.ui?.initSmoothTop?.();
    SC.ui?.initScrollReveal?.();
    SC.ui?.initThemeToggle?.();
    SC.ui?.initRipple?.();
    SC.ui?.initHeroBlurSync?.();

    SC.lightbox?.init?.();
    SC.prefetch?.init?.();
    SC.home?.init?.();

    SC.mapConsent?.init?.();
    SC.forms?.init?.();
    SC.cookieBanner?.init?.();
  };

  const start = () => {
    const baseUrl = getScriptBase();

    loadModulesSequentially(baseUrl)
      .then(() => {
        if (doc.readyState === "loading") {
          doc.addEventListener("DOMContentLoaded", runInit, { once: true });
        } else {
          runInit();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  start();
})(window, document);
