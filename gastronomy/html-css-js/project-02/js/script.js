/* ============================================
   = 00 - DOM HELPERS & NAV STATE
   = 01 - THEME STATE MANAGEMENT
   = 02 - THEME TOGGLE INITIALIZATION
   = 03 - DOMCONTENTLOADED INTERACTIONS
   = 04 - GALLERY PAGE
   = 05 - REVEAL
   = 06 - MENU PAGE
   ============================================ */

"use strict";
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var THEME_STORAGE_KEY = "kp-theme";
  var metaTheme = null;
  var systemPreference = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var hasStoredPreference = false;

  /* ===== 00 - DOM HELPERS & NAV STATE ===== */

  function q(selector) {
    return typeof selector === "string" ? document.querySelector(selector) : selector || null;
  }
  function isNavMobile() {
    return typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia("(max-width: 1023px)").matches : false;
  }
  function syncNavA11y(nav, expanded) {
    if (!nav) return;
    if (!isNavMobile()) {
      nav.removeAttribute("aria-hidden");
      nav.removeAttribute("inert");
      return;
    }
    nav.setAttribute("aria-hidden", String(!expanded));
    if (expanded) {
      nav.removeAttribute("inert");
    } else {
      try {
        nav.setAttribute("inert", "");
      } catch (err) {}
    }
  }
  function s(button, expanded) {
    button.setAttribute("aria-expanded", String(expanded));
    var nav = q("#primary-nav");
    if (nav) {
      nav.setAttribute("data-open", String(expanded));
      syncNavA11y(nav, expanded);
    }
  }

  /* ===== 01 - THEME STATE MANAGEMENT ===== */

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
    var message = isDark ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny";
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

  /* ===== 02 - THEME TOGGLE INITIALIZATION ===== */

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

  /* ===== 03 - DOMCONTENTLOADED INTERACTIONS ===== */

  document.addEventListener("DOMContentLoaded", function () {
    var legalYear = document.getElementById("year");
    if (legalYear) {
      legalYear.textContent = String(new Date().getFullYear());
    }
    var navToggle = q(".nav-toggle");
    var nav = q("#primary-nav");
    navToggle &&
      navToggle.addEventListener("click", function () {
        var expanded = navToggle.getAttribute("aria-expanded") === "true";
        s(navToggle, !expanded);
        var nowExpanded = !expanded;
        navToggle.setAttribute("aria-label", nowExpanded ? "Zamknij menu" : "Otwórz menu");
      });
    if (nav) {
      syncNavA11y(nav, navToggle && navToggle.getAttribute("aria-expanded") === "true");
      nav.addEventListener("click", function (event) {
        var link = event.target.closest("a");
        if (!link || !isNavMobile()) return;
        if (navToggle && navToggle.getAttribute("aria-expanded") === "true") {
          s(navToggle, false);
          navToggle.setAttribute("aria-label", "Otwórz menu");
        }
      });
      window.addEventListener("resize", function () {
        syncNavA11y(nav, navToggle && navToggle.getAttribute("aria-expanded") === "true");
      });
    }
    document.addEventListener("keyup", function (event) {
      event.key === "Escape" && navToggle && navToggle.getAttribute("aria-expanded") === "true" && s(navToggle, false);
    });
    var reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;
        var target = document.querySelector(targetId);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
    var form = q(".form");
    var status = q("#form-status");
    if (form) {
      form.setAttribute("novalidate", "");
      var progress = q("#form-progress");
      var nameInput = form.querySelector("#name");
      var emailInput = form.querySelector("#email");
      var messageInput = form.querySelector("#message");
      var fields = [nameInput, emailInput, messageInput].filter(Boolean);
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      function pluralize(n, one, few, many) {
        var mod10 = n % 10;
        var mod100 = n % 100;
        if (n === 1) return one;
        if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
        return many;
      }

      function getError(field, value) {
        if (!field) return "";
        if (field.id === "name") {
          return value.length >= 2 ? "" : "Podaj imię i nazwisko (min. 2 znaki).";
        }
        if (field.id === "email") {
          return emailPattern.test(value) ? "" : "Wpisz poprawny adres e-mail.";
        }
        if (field.id === "message") {
          return value.length >= 10 ? "" : "Wiadomość powinna mieć co najmniej 10 znaków.";
        }
        return "";
      }

      function setFieldState(field, message) {
        var errorEl = field ? q("#error-" + field.id) : null;
        if (errorEl) errorEl.textContent = message || "";
        if (!field) return;
        if (message) {
          field.setAttribute("aria-invalid", "true");
          field.classList.add("is-invalid");
        } else {
          field.removeAttribute("aria-invalid");
          field.classList.remove("is-invalid");
        }
      }

      function validateField(field, show) {
        if (!field) return true;
        var value = field.value.trim();
        var message = getError(field, value);
        if (show) setFieldState(field, message);
        return !message;
      }

      function validateAll(show) {
        var firstInvalid = null;
        var allValid = true;
        fields.forEach(function (field) {
          var shouldShow = show || field.dataset.touched === "true";
          var ok = validateField(field, shouldShow);
          if (!ok && !firstInvalid) firstInvalid = field;
          allValid = allValid && ok;
        });
        return { valid: allValid, firstInvalid: firstInvalid };
      }

      function updateProgress() {
        if (!progress) return;
        var validCount = 0;
        fields.forEach(function (field) {
          if (validateField(field, false)) validCount++;
        });
        var remaining = fields.length - validCount;
        if (remaining <= 0) {
          progress.textContent = "Formularz gotowy do wysłania.";
          return;
        }
        var label = pluralize(remaining, "pole", "pola", "pól");
        progress.textContent = "Uzupełnij " + remaining + " " + label + ", aby wysłać.";
      }

      fields.forEach(function (field) {
        field.addEventListener("blur", function () {
          field.dataset.touched = "true";
          validateField(field, true);
          updateProgress();
        });
        field.addEventListener("input", function () {
          if (field.dataset.touched === "true") validateField(field, true);
          updateProgress();
        });
      });

      updateProgress();

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!fields.length) return;
        var result = validateAll(true);
        if (!result.valid) {
          status && (status.classList.remove("visually-hidden"), (status.textContent = "Uzupełnij poprawnie wyróżnione pola."));
          result.firstInvalid && result.firstInvalid.focus();
          return;
        }
        status && (status.classList.remove("visually-hidden"), (status.textContent = "Wysyłanie…"));
        setTimeout(function () {
          status && (status.textContent = "Dziękujemy! Wiadomość została wysłana.");
          form.reset();
          fields.forEach(function (field) {
            field.dataset.touched = "";
            setFieldState(field, "");
          });
          updateProgress();
        }, 800);
      });
    }
    var header = q(".site-header");
    if (header) {
      var isTicking = false;
      var lastState = null;
      var updateHeader = function () {
        var shouldShrink = window.scrollY > 8;
        if (shouldShrink !== lastState) {
          header.classList.toggle("is-scrolled", shouldShrink);
          lastState = shouldShrink;
        }
        isTicking = false;
      };
      var onScroll = function () {
        if (isTicking) return;
        isTicking = true;
        window.requestAnimationFrame(updateHeader);
      };
      updateHeader();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    renderFeaturedMenu().then(function (rendered) {
      if (rendered && typeof window.initReveal === "function") {
        window.initReveal();
      }
    });
    initReveal();
    initThemeToggle();
  });
})();

/* ===== Shared: Scrollspy Helper ===== */

function initScrollspy(config) {
  if (!config || !config.pageClass || !config.ids || !config.listSelector) return;
  var onPage = document.body && document.body.classList.contains(config.pageClass);
  if (!onPage) return;

  var links = Array.prototype.slice.call(document.querySelectorAll(config.listSelector));
  if (!links.length) return;

  var linkMap = Object.create(null);
  links.forEach(function (a) {
    var id = (a.getAttribute("href") || "").replace(/^#/, "");
    if (id) linkMap[id] = a;
  });

  function setActive(id) {
    links.forEach(function (a) {
      var match = (a.getAttribute("href") || "").replace(/^#/, "") === id;
      if (match) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "true");
      } else {
        a.classList.remove("is-active");
        a.removeAttribute("aria-current");
      }
    });
  }

  var listEl = links.length ? links[0].closest("ul") : null;
  if (listEl) {
    listEl.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = (a.getAttribute("href") || "").replace(/^#/, "");
      if (!id) return;
      setActive(id);
      if (typeof history !== "undefined" && typeof history.replaceState === "function") {
        history.replaceState(null, "", "#" + id);
      }
    });
  }

  setActive(config.ids[0]);

  var headerEl = document.querySelector(".site-header");
  var stickyEl = config.stickySelector ? document.querySelector(config.stickySelector) : null;
  var headerH = headerEl ? headerEl.offsetHeight : 64;
  var stickyH = stickyEl ? stickyEl.offsetHeight : 0;
  var isMobile = typeof window.matchMedia === "function" ? window.matchMedia("(max-width: 640px)").matches : false;
  var topRM = config.topPercent ? config.topPercent : -(headerH + stickyH + 10) + "px";
  var bottomRM = isMobile ? config.bottomPercentMobile || "-65%" : config.bottomPercent || "-55%";
  var options = { root: null, rootMargin: topRM + " 0px " + bottomRM + " 0px", threshold: 0.01 };

  if (typeof IntersectionObserver === "function") {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        if (id) setActive(id);
      });
    }, options);
    config.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  } else {
    var initial = (location.hash || "").replace(/^#/, "");
    setActive(initial && linkMap[initial] ? initial : config.ids[0]);
  }

  window.addEventListener("hashchange", function () {
    var h = (location.hash || "").replace(/^#/, "");
    if (h && linkMap[h]) setActive(h);
  });

  function computeActiveByPosition() {
    headerH = headerEl ? headerEl.offsetHeight : 64;
    stickyH = stickyEl ? stickyEl.offsetHeight : 0;
    var y = window.scrollY + headerH + stickyH + 8;
    var current = config.ids[0];
    for (var i = 0; i < config.ids.length; i++) {
      var el = document.getElementById(config.ids[i]);
      if (!el) continue;
      var top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= y) current = config.ids[i];
    }
    setActive(current);
  }
  var ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      computeActiveByPosition();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  setTimeout(computeActiveByPosition, 0);
}

/* ===== 04 - GALLERY PAGE ===== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    initScrollspy({
      pageClass: "page-gallery",
      ids: ["wnetrza", "dania", "desery", "napoje"],
      listSelector: '.gallery-tabs__list a[href^="#"]',
      stickySelector: ".gallery-tabs",
      bottomPercent: "-55%",
      bottomPercentMobile: "-65%",
    });
  });
})();

/* ===== 04 - LIGHTBOX ===== */

(function initUnifiedLightbox() {
  const html = document.documentElement;
  const hasGalleryLinks = document.querySelector(".gallery__link");
  if (!hasGalleryLinks) return;

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

    const controls = document.createElement("div");
    controls.className = "lb-controls";
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "lb-btn lb-prev";
    prevBtn.setAttribute("aria-label", "Poprzednie zdjęcie");
    prevBtn.textContent = "←";
    const counter = document.createElement("span");
    counter.className = "lb-counter";
    counter.textContent = "1/1";
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "lb-btn lb-next";
    nextBtn.setAttribute("aria-label", "Następne zdjęcie");
    nextBtn.textContent = "→";
    const fullBtn = document.createElement("button");
    fullBtn.type = "button";
    fullBtn.className = "lb-btn lb-full";
    fullBtn.setAttribute("aria-label", "Pełny ekran");
    fullBtn.textContent = "⤢";
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "lb-btn lb-close";
    closeBtn.setAttribute("aria-label", "Zamknij podgląd");
    closeBtn.textContent = "×";
    controls.append(prevBtn, counter, nextBtn, fullBtn, closeBtn);
    try {
      prevBtn.textContent = "←";
      nextBtn.textContent = "→";
      closeBtn.textContent = "×";
      prevBtn.setAttribute("aria-label", "Poprzednie zdjęcie");
      prevBtn.setAttribute("title", "Poprzednie zdjęcie");
      nextBtn.setAttribute("aria-label", "Następne zdjęcie");
      nextBtn.setAttribute("title", "Następne zdjęcie");
      fullBtn.setAttribute("aria-label", "Pełny ekran");
      fullBtn.setAttribute("title", "Pełny ekran");
      closeBtn.setAttribute("aria-label", "Zamknij podgląd");
      closeBtn.setAttribute("title", "Zamknij podgląd");
      caption.id = "lb-caption";
      overlay.setAttribute("aria-label", "Podgląd zdjęcia");
      overlay.setAttribute("aria-describedby", "lb-caption");
      overlay.setAttribute("aria-keyshortcuts", "Esc ArrowLeft ArrowRight F");
    } catch (e) {
      /* no-op */
    }

    const live = document.createElement("div");
    live.className = "visually-hidden";
    live.id = "lb-live";
    live.setAttribute("aria-live", "polite");

    figure.append(img, caption);
    modal.append(figure, controls, live);
    overlay.append(modal);
    document.body.appendChild(overlay);
  }

  const imgEl = overlay.querySelector("img");
  const captionEl = overlay.querySelector(".lb-caption");
  const closeBtn = overlay.querySelector(".lb-close");
  const prevBtn = overlay.querySelector(".lb-prev");
  const nextBtn = overlay.querySelector(".lb-next");
  const fullBtn = overlay.querySelector(".lb-full");
  const counterEl = overlay.querySelector(".lb-counter");
  const liveEl = overlay.querySelector("#lb-live");
  const pageSections = Array.prototype.slice.call(document.querySelectorAll("header, main, footer"));

  function setPageInert(isInert) {
    pageSections.forEach(function (el) {
      if (!el) return;
      if (isInert) {
        try {
          el.setAttribute("inert", "");
        } catch (e) {}
        el.setAttribute("aria-hidden", "true");
      } else {
        try {
          el.removeAttribute("inert");
        } catch (e) {}
        el.removeAttribute("aria-hidden");
      }
    });
  }
  if (fullBtn && !fullBtn.getAttribute("title")) {
    fullBtn.setAttribute("title", "Pełny ekran (F)");
  }

  function getCaptionFromLink(link) {
    if (!link) return "";
    const dataCap = link.getAttribute("data-lb-caption");
    if (dataCap) return dataCap.trim();
    const fc = link.querySelector("figcaption");
    if (fc && fc.textContent.trim()) return fc.textContent.trim();
    const innerImg = link.querySelector("img");
    if (innerImg && innerImg.alt.trim()) return innerImg.alt.trim();
    return "";
  }

  let group = [];
  let index = 0;
  let lastTrigger = null;

  function placeArrows() {
    if (!imgEl || !prevBtn || !nextBtn) return;
    const rect = imgEl.getBoundingClientRect();
    if (!rect || !rect.height) return;
    const mid = rect.top + rect.height / 2;
    prevBtn.style.top = mid + "px";
    nextBtn.style.top = mid + "px";
  }

  function updateCounter() {
    counterEl.textContent = index + 1 + "/" + group.length;
    if (liveEl) liveEl.textContent = "Obraz " + (index + 1) + " z " + group.length;
  }
  function prefetch(i) {
    const n = group[i + 1];
    const p = group[i - 1];
    [n, p].forEach((a) => {
      if (a) {
        const im = new Image();
        im.src = a.getAttribute("href");
      }
    });
  }
  function render(i) {
    const a = group[i];
    if (!a) return;
    imgEl.classList.remove("is-ready");
    imgEl.onload = function () {
      imgEl.classList.add("is-ready");
      placeArrows();
    };
    imgEl.src = a.getAttribute("href");
    captionEl.textContent = getCaptionFromLink(a) || "";
    updateCounter();
    prefetch(i);
    requestAnimationFrame(placeArrows);
  }
  function openFromLink(a) {
    lastTrigger = a;
    const gName = a.getAttribute("data-lightbox") || "gallery";
    group = Array.prototype.slice.call(document.querySelectorAll(".gallery__link" + (gName ? '[data-lightbox="' + gName + '"]' : "")));
    index = Math.max(0, group.indexOf(a));
    html.classList.add("lb-open");
    render(index);
    requestAnimationFrame(() => closeBtn.focus());

    setPageInert(true);
  }
  function closeLightbox() {
    html.classList.remove("lb-open");
    imgEl.removeAttribute("src");
    if (lastTrigger) lastTrigger.focus();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

    setPageInert(false);
  }
  function next() {
    index = (index + 1) % group.length;
    render(index);
  }
  function prev() {
    index = (index - 1 + group.length) % group.length;
    render(index);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) return;
  });

  document.addEventListener("keydown", (e) => {
    if (!html.classList.contains("lb-open")) return;
    if (e.key === "Escape") return void closeLightbox();
    if (e.key === "ArrowRight" || e.key === "PageDown") return void next();
    if (e.key === "ArrowLeft" || e.key === "PageUp") return void prev();
    if (e.key === "Home") {
      index = 0;
      return void render(index);
    }
    if (e.key === "End") {
      index = group.length - 1;
      return void render(index);
    }
    if (e.key.toLowerCase() === "f") {
      if (!document.fullscreenElement) {
        overlay.requestFullscreen && overlay.requestFullscreen();
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }
    }
  });

  window.addEventListener("resize", placeArrows);
  window.addEventListener("orientationchange", placeArrows);
  document.addEventListener("fullscreenchange", placeArrows);

  let touchStartX = 0,
    touchStartY = 0,
    touchStartTime = 0;
  overlay.addEventListener(
    "touchstart",
    function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      const t = e.changedTouches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchStartTime = Date.now();
    },
    { passive: true }
  );
  overlay.addEventListener(
    "touchend",
    function (e) {
      if (!e.changedTouches || !e.changedTouches.length) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const dt = Date.now() - touchStartTime;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) && dt < 600) {
        if (dx < 0) {
          next();
        } else {
          prev();
        }
      }
    },
    { passive: true }
  );

  document.addEventListener("fullscreenchange", function () {
    html.classList.toggle("is-fullscreen", !!document.fullscreenElement);
  });

  (function initTopZoneHover() {
    let raf = null;
    function updateTopZone(y) {
      if (document.fullscreenElement) return;
      const threshold = 96;
      overlay.classList.toggle("lb-topzone", y <= threshold);
    }
    overlay.addEventListener("mousemove", function (e) {
      const y = e.clientY - overlay.getBoundingClientRect().top;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => updateTopZone(y));
    });
    overlay.addEventListener("mouseleave", function () {
      overlay.classList.remove("lb-topzone");
    });
  })();

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

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  fullBtn.addEventListener("click", function () {
    if (!document.fullscreenElement) {
      overlay.requestFullscreen && overlay.requestFullscreen();
    } else {
      document.exitFullscreen && document.exitFullscreen();
    }
  });

  document.addEventListener("click", (e) => {
    const a = e.target.closest(".gallery__link");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href) return;
    e.preventDefault();
    openFromLink(a);
  });
})();

/* ===== 05 - REVEAL ===== */

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

  nodes.forEach(function (el) {
    el.classList.add("reveal");
  });
  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    var groupItems = group.querySelectorAll("[data-reveal]");
    groupItems.forEach(function (el, index) {
      el.style.setProperty("--reveal-delay", (index * 80).toString() + "ms");
    });
  });

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

  nodes.forEach(function (el) {
    if (isInView(el)) {
      show(el);
    } else {
      observer.observe(el);
    }
  });

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

/* ===== 06 - MENU DATA RENDER ===== */

var menuDataPromise = null;

function fetchMenuDataOnce() {
  if (menuDataPromise) return menuDataPromise;
  menuDataPromise = fetch("data/menu.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("menu.json load failed");
      return res.json();
    })
    .then(function (data) {
      return data && Array.isArray(data.items) ? data.items : [];
    })
    .catch(function () {
      return [];
    });
  return menuDataPromise;
}

function buildMenuCardMarkup(item, options) {
  if (!item) return "";
  options = options || {};
  var loading = options.loading || "lazy";
  var fetchpriority = options.fetchpriority ? ' fetchpriority="high"' : "";
  var img = item.image || {};
  var sizes = img.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px";
  var tags = Array.isArray(item.tags) && item.tags.length ? item.tags : [];
  var tagsMarkup = tags
    .map(function (tag) {
      return '<li class="menu-card__tag">' + tag + "</li>";
    })
    .join("");
  var figcaption = img.figcaption ? '<figcaption class="visually-hidden">' + img.figcaption + "</figcaption>" : "";

  return (
    '<li class="card menu-card" data-reveal>' +
    "<article>" +
    '<figure class="menu-card__figure">' +
    "<picture>" +
    '<source type="image/avif" srcset="' +
    img.avifSrcset +
    '" sizes="' +
    sizes +
    '" />' +
    '<source type="image/webp" srcset="' +
    img.webpSrcset +
    '" sizes="' +
    sizes +
    '" />' +
    '<img class="card__image" src="' +
    img.src +
    '" srcset="' +
    img.jpgSrcset +
    '" sizes="' +
    sizes +
    '" alt="' +
    img.alt +
    '" loading="' +
    loading +
    '"' +
    fetchpriority +
    ' decoding="async" width="' +
    img.width +
    '" height="' +
    img.height +
    '" />' +
    "</picture>" +
    figcaption +
    "</figure>" +
    '<div class="card__body">' +
    '<div class="menu-card__heading">' +
    '<h3 class="card__title">' +
    item.title +
    "</h3>" +
    '<span class="menu-card__price">' +
    item.price +
    "</span>" +
    "</div>" +
    '<p class="card__text">' +
    item.description +
    "</p>" +
    (tagsMarkup ? '<ul class="menu-card__tags">' + tagsMarkup + "</ul>" : "") +
    "</div>" +
    "</article>" +
    "</li>"
  );
}

function renderFeaturedMenu() {
  var list = document.querySelector('[data-menu-featured="true"]');
  if (!list) return Promise.resolve(false);
  return fetchMenuDataOnce().then(function (items) {
    if (!items.length) return false;
    var preferred = ["przystawki", "dania-glowne", "desery"];
    var selection = [];
    preferred.forEach(function (cat) {
      var found = items.find(function (item) {
        return item.category === cat;
      });
      if (found) selection.push(found);
    });
    if (selection.length < 3) selection = items.slice(0, 3);
    var html = selection
      .map(function (item, idx) {
        return buildMenuCardMarkup(item, { loading: idx === 0 ? "eager" : "lazy", fetchpriority: idx === 0 });
      })
      .join("");
    if (!html) return false;
    list.innerHTML = html;
    return true;
  });
}

function renderMenuByCategory() {
  var lists = Array.prototype.slice.call(document.querySelectorAll("[data-menu-category]"));
  if (!lists.length) return Promise.resolve(false);
  return fetchMenuDataOnce().then(function (items) {
    if (!items.length) return false;
    var firstImage = true;
    lists.forEach(function (list) {
      var category = list.getAttribute("data-menu-category");
      if (!category) return;
      var subset = items.filter(function (item) {
        return item.category === category;
      });
      if (!subset.length) return;
      var html = subset
        .map(function (item, idx) {
          var useEager = firstImage;
          firstImage = false;
          return buildMenuCardMarkup(item, { loading: useEager ? "eager" : "lazy", fetchpriority: useEager });
        })
        .join("");
      if (html) list.innerHTML = html;
    });
    return true;
  });
}

/* ===== 06 - MENU PAGE  ===== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var onMenuPage = document.body && document.body.classList.contains("page--menu");
    if (!onMenuPage) return;

    initScrollspy({
      pageClass: "page--menu",
      ids: ["przystawki", "dania-glowne", "zupy", "kuchnia-szefa", "desery", "drinki"],
      listSelector: '.menu-tabs__list a[href^="#"]',
      stickySelector: ".menu-navigation",
      topPercent: "-40%",
      bottomPercent: "-55%",
      bottomPercentMobile: "-65%",
    });

    function initMenuFilters() {
      var search = document.getElementById("menu-search");
      var buttonsWrap = document.querySelector(".menu-filters .filters");
      if (!search || !buttonsWrap) return;

      var buttons = Array.prototype.slice.call(buttonsWrap.querySelectorAll("button[data-filter]"));
      var cards = Array.prototype.slice.call(document.querySelectorAll(".menu-card"));
      var emptyInfo = document.querySelector(".filters__empty");

      function normalize(str) {
        return (str || "")
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      }

      cards.forEach(function (card) {
        var tags = Array.prototype.slice
          .call(card.querySelectorAll(".menu-card__tag"))
          .map(function (el) {
            return (el.textContent || "").trim();
          })
          .filter(Boolean);
        card.setAttribute("data-tags", tags.join(","));
      });

      var activeTag = "*";
      var term = "";

      function apply() {
        var visibleCount = 0;
        var nTerm = normalize(term);
        cards.forEach(function (card) {
          var titleEl = card.querySelector(".card__title");
          var textEl = card.querySelector(".card__text");
          var hay = normalize((titleEl && titleEl.textContent) + " " + (textEl && textEl.textContent));
          var matchesTerm = !nTerm || hay.indexOf(nTerm) !== -1;
          var tags = (card.getAttribute("data-tags") || "").split(",").map(function (t) {
            return t.trim();
          });
          var matchesTag = activeTag === "*" || tags.indexOf(activeTag) !== -1;
          var show = matchesTerm && matchesTag;
          card.style.display = show ? "" : "none";
          if (show) visibleCount++;
        });
        if (emptyInfo) {
          emptyInfo.hidden = visibleCount !== 0;
          if (visibleCount === 0) emptyInfo.textContent = "Brak pozycji spełniających kryteria.";
        }
      }

      var debounceTimer = null;
      function debounced(fn, delay) {
        return function () {
          var args = arguments;
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function () {
            fn.apply(null, args);
          }, delay);
        };
      }

      search.addEventListener(
        "input",
        debounced(function () {
          term = search.value || "";
          apply();
        }, 200)
      );

      buttonsWrap.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-filter]");
        if (!btn) return;
        buttons.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        activeTag = btn.getAttribute("data-filter") || "*";
        apply();
      });

      apply();
    }

    function initPriceLabels() {
      var prices = Array.prototype.slice.call(document.querySelectorAll(".menu-card__price"));
      prices.forEach(function (el) {
        var raw = (el.textContent || "").trim();
        var m = raw.match(/[0-9]+(?:[\.,][0-9]+)?/);
        var val = m ? m[0] : raw;
        el.setAttribute("aria-label", val + " złotych");
      });
    }

    /* ===== 06 - GALLERY PAGE ===== */

    function enhanceFigureAlts() {
      var cards = Array.prototype.slice.call(document.querySelectorAll(".menu-card"));
      cards.forEach(function (card) {
        var fig = card.querySelector("figure");
        var img = fig ? fig.querySelector("img") : null;
        var titleEl = card.querySelector(".card__title");
        var descEl = card.querySelector(".card__text");
        if (!fig) return;
        var title = titleEl ? titleEl.textContent.trim() : "";
        var desc = descEl ? descEl.textContent.trim() : "";
        if (img && title) img.alt = title;
        var cap = fig.querySelector("figcaption");
        var full = title + (desc ? ". " + desc : "") + " — alergeny: wg obsługi.";
        if (cap) {
          cap.textContent = full;
          cap.classList.add("visually-hidden");
        } else {
          var newCap = document.createElement("figcaption");
          newCap.className = "visually-hidden";
          newCap.textContent = full;
          fig.appendChild(newCap);
        }
      });
    }

    function initAnchors() {
      function slugify(str) {
        return (str || "")
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      function addAnchor(el) {
        if (!el) return;
        var id = el.getAttribute("id");
        if (!id) {
          id = slugify(el.textContent);
          if (id) el.setAttribute("id", id);
        }
        if (!id || el.querySelector(".anchor")) return;
        var a = document.createElement("a");
        a.className = "anchor";
        a.href = "#" + id;
        a.setAttribute("aria-label", "Kopiuj link do tego elementu");
        a.addEventListener("click", function (e) {
          e.preventDefault();
          var url = location.origin + location.pathname + "#" + id;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              a.setAttribute("aria-label", "Skopiowano link");
              setTimeout(function () {
                a.setAttribute("aria-label", "Kopiuj link do tego elementu");
              }, 1000);
            });
          } else {
            var input = document.createElement("input");
            input.value = url;
            document.body.appendChild(input);
            input.select();
            try {
              document.execCommand("copy");
            } catch (err) {}
            document.body.removeChild(input);
          }
          if (typeof history !== "undefined" && history.replaceState) history.replaceState(null, "", "#" + id);
        });
        el.appendChild(a);
      }
      document.querySelectorAll(".menu-section__header h2").forEach(addAnchor);
      document.querySelectorAll(".card__title").forEach(addAnchor);
    }

    renderMenuByCategory().then(function (rendered) {
      initMenuFilters();
      initPriceLabels();
      enhanceFigureAlts();
      initAnchors();
      if (rendered && typeof window.initReveal === "function") {
        window.initReveal();
      }
    });
  });
})();
