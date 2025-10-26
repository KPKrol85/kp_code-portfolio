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
    initReveal();
    initThemeToggle();
  });
})();

/* ===== 04) LIGHTBOX (UNIFIED + A11Y) ===== */
(function initUnifiedLightbox() {
  const html = document.documentElement;

  /* Build overlay once */
  let overlay = document.querySelector(".lb-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "lb-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Podgląd zdjęcia");

    const modal = document.createElement("div");
    modal.className = "lb-modal";

    const figure = document.createElement("figure");
    figure.className = "lb-figure";

    const img = document.createElement("img");
    img.alt = "";
    img.decoding = "async";
    img.loading = "eager";

    const caption = document.createElement("figcaption");
    caption.className = "lb-caption";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "lb-close";
    closeBtn.setAttribute("aria-label", "Zamknij podgląd");
    closeBtn.innerHTML = "&times;";

    figure.append(img, caption);
    modal.append(closeBtn, figure);
    overlay.append(modal);
    document.body.appendChild(overlay);
  }

  const imgEl = overlay.querySelector("img");
  const captionEl = overlay.querySelector(".lb-caption");
  const closeBtn = overlay.querySelector(".lb-close");

  function getCaptionFromLink(link) {
    if (!link) return "";
    // 1) data-lb-caption na linku
    const dataCap = link.getAttribute("data-lb-caption");
    if (dataCap) return dataCap.trim();
    // 2) figcaption w środku linku
    const fc = link.querySelector("figcaption");
    if (fc && fc.textContent.trim()) return fc.textContent.trim();
    // 3) alt obrazka wewnątrz
    const innerImg = link.querySelector("img");
    if (innerImg && innerImg.alt.trim()) return innerImg.alt.trim();
    return "";
  }

  function openLightbox(src, captionText) {
    imgEl.src = src;
    captionEl.textContent = captionText || "";
    html.classList.add("lb-open");
    // Focus mgnt: po otwarciu focus na przycisku Zamknij
    requestAnimationFrame(() => closeBtn.focus());
  }

  function closeLightbox() {
    html.classList.remove("lb-open");
    imgEl.removeAttribute("src");
  }

  // Click w tło zamyka
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // ESC zamyka
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && html.classList.contains("lb-open")) {
      closeLightbox();
    }
  });

  // TAB trap (prosta pętla po focusowalnych elementach w overlay)
  overlay.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusables = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  });

  // Przycisk zamknięcia
  closeBtn.addEventListener("click", closeLightbox);

  // Delegacja: obsługuj kliknięcia w .gallery__link (i dowolny element z [data-lb] w przyszłości)
  document.addEventListener("click", (e) => {
    const a = e.target.closest(".gallery__link");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href) return;
    e.preventDefault();
    const caption = getCaptionFromLink(a);
    openLightbox(href, caption);
  });
})();


/* ===== 04) REVEAL (IntersectionObserver + fallbacks) ===== */
function initReveal() {
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (!nodes.length) return;

  var motionQuery = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var prefersReduce = motionQuery ? motionQuery.matches : false;
  var hasObserver = typeof window.IntersectionObserver === "function";
  var observer = null;

  var show = function (el) {
    el.classList.add("is-visible");
  };
  var isInView = function (el) {
    var rect = el.getBoundingClientRect();
    var viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
    return rect.top <= viewportH * 0.9 && rect.bottom >= 0;
  };

  // Ensure baseline reveal class + per-group stagger tokens.
  nodes.forEach(function (el) {
    el.classList.add("reveal");
  });
  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    var groupItems = group.querySelectorAll("[data-reveal]");
    groupItems.forEach(function (el, index) {
      el.style.setProperty("--reveal-delay", (index * 80).toString() + "ms");
    });
  });

  // Respect reduced motion and older browsers with an immediate reveal.
  if (!hasObserver || prefersReduce) {
    nodes.forEach(show);
    return;
  }

  observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
  );

  // Reveal anything already inside the viewport to avoid flicker.
  nodes.forEach(function (el) {
    if (isInView(el)) {
      show(el);
    } else {
      observer.observe(el);
    }
  });

  // If the user switches to reduced motion mid-session, stop animating.
  if (motionQuery) {
    var handleMotionChange = function (event) {
      if (!event.matches || !observer) return;
      observer.disconnect();
      nodes.forEach(show);
    };
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", handleMotionChange);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(handleMotionChange);
    }
  }
}
if (typeof window !== "undefined") {
  window.initReveal = initReveal;
}

// Update summary:
// Refined initReveal to add classes, stagger groups, honor reduced motion, and gracefully reveal elements even without IntersectionObserver.
// Keeps hero/above-the-fold content visible at load while scrolling animates the remaining sections.
