"use strict";
(function () {
  var root = document.documentElement;
  var THEME_STORAGE_KEY = "kp-theme";
  var metaTheme = null;
  var systemPreference = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var hasStoredPreference = false;

  /* ===== 00 - DOM HELPERS & NAV STATE ===== */

  function q(selector) {
    return typeof selector === "string" ? document.querySelector(selector) : selector || null;
  }
  function s(button, expanded) {
    button.setAttribute("aria-expanded", String(expanded));
    var nav = q("#primary-nav");
    nav && nav.setAttribute("data-open", String(expanded));
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
    navToggle &&
      navToggle.addEventListener("click", function () {
        var expanded = navToggle.getAttribute("aria-expanded") === "true";
        s(navToggle, !expanded);
        var nowExpanded = !expanded;
        navToggle.setAttribute("aria-label", nowExpanded ? "Zamknij menu" : "Otwórz menu");
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
        status && (status.classList.remove("visually-hidden"), (status.textContent = "Wysyłanie…"));
        setTimeout(function () {
          var name = nameInput.value.trim();
          var email = emailInput.value.trim();
          var message = messageInput.value.trim();
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!name || !emailPattern.test(email) || !message) {
            status && (status.textContent = "Wpisz poprawne imię, e‑mail i wiadomość.");
            return;
          }
          status && (status.textContent = "Dziękujemy! Wiadomość została wysłana.");
          form.reset();
        }, 800);
      });
    initReveal();
    initThemeToggle();
  });
})();

/* ===== 04 - LIGHTBOX (UNIFIED + A11Y) ===== */

(function initUnifiedLightbox() {
  const html = document.documentElement;

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
    };
    imgEl.src = a.getAttribute("href");
    captionEl.textContent = getCaptionFromLink(a) || "";
    updateCounter();
    prefetch(i);
  }
  function openFromLink(a) {
    lastTrigger = a;
    const gName = a.getAttribute("data-lightbox") || "gallery";
    group = Array.prototype.slice.call(document.querySelectorAll(".gallery__link" + (gName ? '[data-lightbox="' + gName + '"]' : "")));
    index = Math.max(0, group.indexOf(a));
    html.classList.add("lb-open");
    render(index);
    requestAnimationFrame(() => closeBtn.focus());
  }
  function closeLightbox() {
    html.classList.remove("lb-open");
    imgEl.removeAttribute("src");
    if (lastTrigger) lastTrigger.focus();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
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
    // Nie zamykaj po kliknięciu w tło (zarówno normalnie, jak i w fullscreen).
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

  // Fullscreen state -> toggle helper class for CSS
  document.addEventListener("fullscreenchange", function () {
    html.classList.toggle("is-fullscreen", !!document.fullscreenElement);
  });

  // Hover-only w górnej strefie overlay (pokazuj krzyżyk tylko blisko górnej krawędzi)
  (function initTopZoneHover() {
    let raf = null;
    function updateTopZone(y) {
      if (document.fullscreenElement) return; // w fullscreen i tak ukryte stylem
      const threshold = 96; // px od góry overlay
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

/* ===== 04 - REVEAL ===== */

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

/* ===== 05 - MENU PAGE  ===== */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var onMenuPage = document.body && document.body.classList.contains("page--menu");
    if (!onMenuPage) return;

    (function initScrollspy() {
      var ids = ["przystawki", "dania-glowne", "zupy", "kuchnia-szefa", "desery", "drinki"];
      var linkMap = Object.create(null);
      var tabsList = document.querySelector(".menu-tabs__list");
      if (!tabsList) return;
      var links = Array.prototype.slice.call(tabsList.querySelectorAll('a[href^="#"]'));
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

      tabsList.addEventListener("click", function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a) return;
        var id = (a.getAttribute("href") || "").replace(/^#/, "");
        if (!id) return;
        setActive(id);
        if (typeof history !== "undefined" && typeof history.replaceState === "function") {
          history.replaceState(null, "", "#" + id);
        }
      });

      var options = { root: null, rootMargin: "-40% 0% -55% 0%", threshold: 0.01 };
      if (typeof IntersectionObserver !== "function") {
        var initial = (location.hash || "").replace(/^#/, "");
        setActive(initial && linkMap[initial] ? initial : ids[0]);
        return;
      }
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          if (id) setActive(id);
        });
      }, options);

      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      var initial = (location.hash || "").replace(/^#/, "");
      if (initial && linkMap[initial]) setActive(initial);
    })();

    (function initMenuFilters() {
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
    })();

    (function initPriceLabels() {
      var prices = Array.prototype.slice.call(document.querySelectorAll(".menu-card__price"));
      prices.forEach(function (el) {
        var raw = (el.textContent || "").trim();
        var m = raw.match(/[0-9]+(?:[\.,][0-9]+)?/);
        var val = m ? m[0] : raw;
        el.setAttribute("aria-label", val + " złotych");
      });
    })();

    // Improve alt/figcaption: short alt = title, figcaption = title + opis + alergeny
    (function enhanceFigureAlts() {
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
    })();

    // Add copy-link anchors to section headers and dish titles
    (function initAnchors() {
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
    })();
  });
})();
