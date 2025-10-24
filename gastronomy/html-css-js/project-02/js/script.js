"use strict";
(function () {
  var root = document.documentElement;
  var THEME_STORAGE_KEY = "kp-theme";
  var metaTheme = null;
  var systemPreference = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var hasStoredPreference = false;

  function q(selector) {
    return typeof selector === "string" ? document.querySelector(selector) : selector || null;
  }
  function s(button, expanded) {
    button.setAttribute("aria-expanded", String(expanded));
    var nav = q("#primary-nav");
    nav && nav.setAttribute("data-open", String(expanded));
  }

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

  document.addEventListener("DOMContentLoaded", function () {
    var yearEl = document.getElementById("year");
    yearEl && (yearEl.textContent = String(new Date().getFullYear()));
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
