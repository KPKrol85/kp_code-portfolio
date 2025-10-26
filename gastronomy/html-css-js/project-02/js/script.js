"use strict";
(function () {
  var root = document.documentElement;
  var THEME_STORAGE_KEY = "kp-theme";
  var metaTheme = null;
  var systemPreference = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var hasStoredPreference = false;

  /* ===== 00) DOM HELPERS & NAV STATE ===== */

  function q(selector) {
    return typeof selector === "string" ? document.querySelector(selector) : selector || null;
  }
  function s(button, expanded) {
    button.setAttribute("aria-expanded", String(expanded));
    var nav = q("#primary-nav");
    nav && nav.setAttribute("data-open", String(expanded));
  }

  /* ===== 01) THEME STATE MANAGEMENT ===== */

  function getStoredTheme() {
    try {
      var value = localStorage.getItem(THEME_STORAGE_KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch (err) {
      return null;
    }
  }
  function persistTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      hasStoredPreference = true;
    } catch (err) {}
  }
  function updateMetaTheme(theme) {
    if (!metaTheme) {
      metaTheme = document.querySelector('meta[name="theme-color"]');
    }
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "dark" ? "#181210" : "#f8f1e7");
    }
  }
  function syncToggleVisuals(theme) {
    var toggle = q(".theme-toggle");
    if (!toggle) return;
    var isDark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    var message = isDark ? "Switch to light mode" : "Switch to dark mode";
    toggle.setAttribute("aria-label", message);
    var hiddenLabel = toggle.querySelector(".visually-hidden");
    hiddenLabel && (hiddenLabel.textContent = message);
  }
  function emitThemeChange(theme) {
    if (typeof window === "undefined" || typeof window.CustomEvent !== "function") return;
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }
  function applyTheme(theme, options) {
    options = options || {};
    var nextTheme = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", nextTheme);
    syncToggleVisuals(nextTheme);
    updateMetaTheme(nextTheme);
    if (options.persist) {
      persistTheme(nextTheme);
    }
    if (!options.silent) {
      emitThemeChange(nextTheme);
    }
  }

  /* ===== 02) THEME TOGGLE INITIALIZATION ===== */

  function initThemeToggle() {
    var toggle = q(".theme-toggle");
    if (!toggle) return;
    var storedTheme = getStoredTheme();
    if (storedTheme) {
      hasStoredPreference = true;
    }
    var initial = storedTheme || root.getAttribute("data-theme");
    if (!initial && systemPreference && typeof systemPreference.matches === "boolean") {
      initial = systemPreference.matches ? "dark" : "light";
    }
    applyTheme(initial || "light", { silent: true });
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next, { persist: true });
    });
    if (systemPreference) {
      var handleSystemChange = function (event) {
        if (hasStoredPreference) return;
        applyTheme(event.matches ? "dark" : "light");
      };
      if (typeof systemPreference.addEventListener === "function") {
        systemPreference.addEventListener("change", handleSystemChange);
      } else if (typeof systemPreference.addListener === "function") {
        systemPreference.addListener(handleSystemChange);
      }
    }
  }
  if (typeof window !== "undefined") {
    window.initThemeToggle = initThemeToggle;
  }

  /* ===== 03) DOMCONTENTLOADED INTERACTIONS ===== */

  document.addEventListener("DOMContentLoaded", function () {
    var legalYear = document.getElementById("year");
    if (legalYear) {
      legalYear.textContent = String(new Date().getFullYear());
    }
    var navToggle = q(".nav-toggle");
    navToggle &&
      navToggle.addEventListener("click", function () {
        var expanded = navToggle.getAttribute("aria-expanded") === "true";
        s(navToggle, !expanded);
      });
    document.addEventListener("keyup", function (event) {
      event.key === "Escape" && navToggle && navToggle.getAttribute("aria-expanded") === "true" && s(navToggle, false);
    });
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;
        var target = document.querySelector(targetId);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
    var form = q(".form");
    var status = q("#form-status");
    form &&
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var nameInput = form.querySelector("#name");
        var emailInput = form.querySelector("#email");
        var messageInput = form.querySelector("#message");
        if (!(nameInput && emailInput && messageInput)) return;
        status && (status.classList.remove("visually-hidden"), (status.textContent = "Sending…"));
        setTimeout(function () {
          var name = nameInput.value.trim();
          var email = emailInput.value.trim();
          var message = messageInput.value.trim();
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!name || !emailPattern.test(email) || !message) {
            status && (status.textContent = "Please enter a valid name, email, and message.");
            return;
          }
          status && (status.textContent = "Thank you! Your message has been sent.");
          form.reset();
        }, 800);
      });
    initThemeToggle();
  });
})();

/* ===== 04) LIGHTBOX (BASE VERSION) ===== */

function initLightbox() {
  const images = document.querySelectorAll("[data-lb-caption]");
  let overlay = document.querySelector(".lb-overlay");
  let modal = overlay ? overlay.querySelector(".lb-modal") : null;
  let caption = modal ? modal.querySelector(".lb-caption") : null;
  let img = modal ? modal.querySelector("img") : null;

  if (!overlay) {
    overlay = document.createElement("div");
    modal = document.createElement("div");
    caption = document.createElement("p");
    img = document.createElement("img");

    overlay.className = "lb-overlay";
    modal.className = "lb-modal";
    caption.className = "lb-caption";

    modal.append(img, caption);
    overlay.append(modal);
    document.body.appendChild(overlay);
  }

  images.forEach((image) => {
    image.addEventListener("click", () => {
      img.src = image.src;
      caption.textContent = image.dataset.lbCaption || "";
      overlay.classList.add("active");
    });
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLightbox);
} else {
  initLightbox();
}

/* ===== GALLERY – Lightbox integration (progressive enhancement) ===== */
(function initGalleryLightbox() {
  const overlay = document.querySelector(".lb-overlay");
  if (!overlay) return;
  const body = document.documentElement; // we toggle class on <html>
  const imgEl =
    overlay.querySelector("img") ||
    (() => {
      const img = document.createElement("img");
      img.alt = "";
      img.decoding = "async";
      img.loading = "eager";
      overlay.appendChild(img);
      return img;
    })();

  function open(src, caption) {
    imgEl.src = src;
    imgEl.setAttribute("data-lb-caption", caption || "");
    body.classList.add("lb-open");
  }
  function close() {
    body.classList.remove("lb-open");
    imgEl.removeAttribute("src");
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.querySelectorAll(".gallery__link").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      open(a.getAttribute("href"), a.getAttribute("data-lb-caption"));
    });
  });
})();
