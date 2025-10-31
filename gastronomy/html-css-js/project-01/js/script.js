/* ===========================================================================
   = Project: gastronomy-html-css-js-project-01
   = Author: KP_Code
   = Last Update: 2025-10-22
   ===========================================================================
   = script.js
   = Structure Overview
   ===========================================================================
   = 00 - HELPERS                 - utility functions.
   = 01 - MOBILE NAV TOGGLE       - open / close mobile nav.
   = 02 - TABS                    - menu filtering.
   = 03 - LIGHTBOX                - contextual navigation.
   = 04 - RESERVATION FORM        - validation, feedback, loading state...
   = 05 - FOOTER YEAR             - dynamic current year in footer.
   = 06 - THEME SWITCHER          - light / dark mode with memory.
   = 07 - SCROLLSPY               - menu item highlighting.
   = 08 - SCROLL BUTTONS          - down / up.
   = 09 - CTA                     - pulse only in viewport.
   = 10 - SMART NAV               - navigation style change on scroll.
   = 11 - NAV                     - navigation active subpage - aria-current.
   = 12 - PAGE MENU               - behavior of "more about dish" panel.
   = 13 - FAQ                     - aria sync (aria-expanded + aria-controls).
   = 14 - GALLERY FILTER          - page-gallery.
   = 15 - STICKY SHADOW ON SCROLL - add shadow to sticky elements on scroll.
   = 16 - SCROLL TO TOP           - scroll to top button.
   = 17 - SCROLL TARGETS          - smooth scroll to anchor targets.
   =========================================================================== */

/* ===== 00 - HELPERS ===== */

const DEBUG = true;
const log = (...a) => DEBUG && console.log("[ui]", ...a);
const byTestId = (id, root = document) => root.querySelector(`[data-testid="${id}"]`);
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function initHelpers() {
  document.documentElement.classList.remove("no-js");
  if (document.body) {
    document.body.classList.remove("no-js");
  } else {
    window.addEventListener("DOMContentLoaded", () => document.body && document.body.classList.remove("no-js"), { once: true });
  }
  log("helpers initialized");
}

/* ===== 01 - MOBILE NAV TOGGLE ===== */

function initMobileNav() {
  const toggle = byTestId("nav-toggle") || $(".nav-toggle");
  const nav = byTestId("site-nav") || $("#site-nav");
  if (!toggle || !nav) return;

  const mq = window.matchMedia("(min-width: 900px)");
  const setExpanded = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  if (!toggle.hasAttribute("aria-controls")) {
    toggle.setAttribute("aria-controls", nav.id || "site-nav");
  }

  toggle.addEventListener("click", () => setExpanded(!document.body.classList.contains("nav-open")), { passive: true });

  nav.addEventListener(
    "click",
    (e) => {
      if (e.target.closest("a")) setExpanded(false);
    },
    { passive: true }
  );

  let lastDesktop = mq.matches;
  const onMQChange = () => {
    const nowDesktop = mq.matches;
    if (nowDesktop && !lastDesktop) setExpanded(false);
    lastDesktop = nowDesktop;
  };
  mq.addEventListener?.("change", onMQChange);
  window.addEventListener("resize", onMQChange, { passive: true });

  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("nav-open")) return;
    const insideNav = e.target.closest("#site-nav");
    const insideBtn = e.target.closest(".nav-toggle");
    if (!insideNav && !insideBtn) setExpanded(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) setExpanded(false);
  });

  log("nav-toggle:", !!toggle, "site-nav:", !!nav);
}

/* ===== 02 - TABS ===== */

function initTabs() {
  const tabsRoot = byTestId("menu-tabs") || document;
  const tabs = $$(".tab", tabsRoot);
  if (!tabs.length) return;

  const items = $$(".dish");

  if (tabsRoot !== document && !tabsRoot.hasAttribute("role")) {
    tabsRoot.setAttribute("role", "tablist");
  }
  tabs.forEach((t) => {
    if (!t.hasAttribute("role")) t.setAttribute("role", "tab");
  });

  const activate = (btn) => {
    tabs.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    const filter = btn.dataset.filter;
    items.forEach((card) => {
      const show = filter === "all" || card.dataset.cat === filter;
      card.style.display = show ? "" : "none";
    });
  };

  activate($(".tab.is-active", tabsRoot) || tabs[0]);

  tabsRoot.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest(".tab");
      if (!btn || !tabs.includes(btn)) return;
      activate(btn);
    },
    { passive: true }
  );

  tabsRoot.addEventListener("keydown", (e) => {
    const current = e.target.closest(".tab");
    if (!current || !tabs.includes(current)) return;
    const i = tabs.indexOf(current);
    const focusAt = (idx) => tabs[(idx + tabs.length) % tabs.length].focus();

    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      tabs[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      tabs[tabs.length - 1].focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(current);
    }
  });

  log("menu-tabs:", !!byTestId("menu-tabs"), "tabs:", tabs.length);
}

/* ===== 03 - LIGHTBOX ===== */

function initLightbox() {
  const lb = document.getElementById("lb") || document.querySelector(".lightbox");
  if (!lb) return;

  const isDialog = lb.nodeName === "DIALOG" && typeof lb.showModal === "function";
  const pic = lb.querySelector("picture") || lb;
  const sAvif = pic?.querySelector('source[type="image/avif"]') || document.getElementById("lb-avif");
  const sWebp = pic?.querySelector('source[type="image/webp"]') || document.getElementById("lb-webp");
  const img = pic?.querySelector("img") || document.getElementById("lb-img");
  const btnX = lb.querySelector(".lb-close") || lb.querySelector("[data-close]");
  const overlayEl = lb.querySelector(".lb-overlay");

  let counter = lb.querySelector(".lb-counter");
  if (!counter) {
    counter = document.createElement("output");
    counter.className = "lb-counter";
    counter.setAttribute("aria-live", "polite");
    counter.setAttribute("aria-atomic", "true");
    lb.appendChild(counter);
  }
  function updateCounter() {
    const total = currentCollection.length;
    if (!counter || total <= 1 || currentIndex < 0) {
      counter.hidden = true;
      counter.textContent = "";
      return;
    }
    counter.hidden = false;
    const txt = `${currentIndex + 1} / ${total}`;
    counter.value = txt;
    counter.textContent = txt;
  }

  if (!isDialog) {
    lb.setAttribute("hidden", "");
    lb.setAttribute("aria-hidden", "true");
  }

  const resolveUrl = (p) => {
    if (!p) return "";
    try {
      return new URL(p, location.href).href;
    } catch {
      return p;
    }
  };

  const stripExt = (s = "") => {
    if (!s) return "";
    const abs = resolveUrl(s);
    const clean = abs.replace(/[?#].*$/, "");
    return clean.replace(/\.(avif|webp|jpe?g|png)$/i, "");
  };

  const getBaseFromElement = (el) => {
    if (!el) return "";
    try {
      const d = el.dataset && el.dataset.full;
      if (d) return resolveUrl(d);
    } catch {}
    const a = el.getAttribute && el.getAttribute("data-full");
    if (a) return resolveUrl(a);
    const h = el.getAttribute && el.getAttribute("href");
    if (h && !h.startsWith("#")) return resolveUrl(h);
    const imgEl = el.querySelector && el.querySelector("img");
    if (imgEl) return imgEl.currentSrc || imgEl.src || "";
    return "";
  };

  const setSources = (base, alt = "") => {
    if (!base) return;
    const b = stripExt(base);
    if (!b) return;
    if (sAvif) sAvif.srcset = `${b}.avif`;
    if (sWebp) sWebp.srcset = `${b}.webp`;
    if (img) {
      img.src = `${b}.jpg`;
      img.alt = alt || "";
    }
  };

  let currentIndex = -1;
  let currentCollection = [];
  let lastFocused = null;
  let _scrollY = 0;
  let _prevHash = "";
  let _prevBodyPos = "";
  let _prevBodyTop = "";
  let _prevBodyWidth = "";

  const lockScroll = () => {
    _scrollY = window.scrollY;
    _prevBodyPos = document.body.style.position;
    _prevBodyTop = document.body.style.top;
    _prevBodyWidth = document.body.style.width;
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.position = "fixed";
    document.body.style.top = `-${_scrollY}px`;
    document.body.style.width = "100%";
  };
  const unlockScroll = () => {
    document.body.style.position = _prevBodyPos;
    document.body.style.top = _prevBodyTop;
    document.body.style.width = _prevBodyWidth;
    window.scrollTo(0, _scrollY);
  };

  const visibleGridItems = (grid) => {
    if (!grid) return [];
    return Array.from(grid.querySelectorAll(".g-item")).filter((el) => !el.hidden && el.offsetParent !== null);
  };
  const visibleThumbItems = () => Array.from(document.querySelectorAll(".dish-thumb")).filter((el) => !el.hidden && el.offsetParent !== null);

  const openLB = (base, alt, index = -1, collection = []) => {
    if (!base) return;
    lastFocused = document.activeElement;

    currentCollection = Array.isArray(collection) && collection.length ? collection : visibleGridItems(document.querySelector(".gallery-grid")) || [];
    if (!currentCollection.length) currentCollection = visibleThumbItems();

    const absBase = resolveUrl(base);
    setSources(absBase, alt);

    if (typeof index === "number" && index >= 0) currentIndex = index;
    else {
      currentIndex = currentCollection.findIndex((el) => {
        const candidate = getBaseFromElement(el) || "";
        return candidate && resolveUrl(candidate) === absBase;
      });
    }
    if (currentIndex === -1 && currentCollection.length) currentIndex = 0;

    _prevHash = location.hash || "";
    if (_prevHash) history.replaceState(null, "", location.pathname + location.search);

    lockScroll();

    if (isDialog) {
      try {
        if (!lb.open) lb.showModal();
      } catch (e) {
        console.error(e);
      }
    } else {
      lb.removeAttribute("hidden");
      lb.setAttribute("aria-hidden", "false");
      lb.classList.add("open");
    }
    if (btnX && typeof btnX.focus === "function") btnX.focus();

    updateCounter();
    preloadNeighbor(1);
    preloadNeighbor(-1);
  };

  const closeLB = () => {
    if (isDialog) {
      if (lb.open) lb.close();
    } else {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      lb.setAttribute("hidden", "");
      setTimeout(() => {
        sAvif?.removeAttribute("srcset");
        sWebp?.removeAttribute("srcset");
        img?.removeAttribute("src");
      }, 170);
    }

    if (_prevHash) history.replaceState(null, "", location.pathname + location.search + _prevHash);
    unlockScroll();

    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    currentIndex = -1;
    currentCollection = [];
    if (counter) {
      counter.hidden = true;
      counter.textContent = "";
    }
  };

  const showAtIndex = (idx) => {
    if (!currentCollection || !currentCollection.length) return;
    currentIndex = (idx + currentCollection.length) % currentCollection.length;
    const el = currentCollection[currentIndex];
    const base = getBaseFromElement(el) || "";
    const alt = el?.querySelector("img")?.alt || el?.getAttribute("aria-label") || "";
    setSources(base, alt);
    updateCounter();
  };

  function preloadNeighbor(offset) {
    if (!currentCollection.length || currentIndex === -1) return;
    const idx = (currentIndex + offset + currentCollection.length) % currentCollection.length;
    const el = currentCollection[idx];
    const raw = getBaseFromElement(el) || "";
    if (raw) {
      const p = stripExt(raw);
      [`${p}.webp`, `${p}.avif`, `${p}.jpg`].forEach((u) => {
        const im = new Image();
        im.src = u;
      });
    }
  }

  const onKey = (e) => {
    if (e.key === "Escape") {
      if (isDialog ? lb.open : lb.classList.contains("open")) closeLB();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (currentCollection.length) showAtIndex(currentIndex === -1 ? 0 : currentIndex - 1);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (currentCollection.length) showAtIndex(currentIndex === -1 ? 0 : currentIndex + 1);
      return;
    }
  };

  document.addEventListener("click", (e) => {
    const thumb = e.target.closest(".dish-thumb");
    if (thumb) {
      const base = getBaseFromElement(thumb);
      const alt = thumb.querySelector("img")?.alt || thumb.getAttribute("aria-label") || "";
      const link = e.target.closest("a");
      if (link) e.preventDefault();
      const coll = visibleThumbItems();
      const idx = coll.indexOf(thumb);
      openLB(base, alt, idx >= 0 ? idx : -1, coll);
      return;
    }
    const tile = e.target.closest(".g-item");
    if (tile) {
      const base = getBaseFromElement(tile);
      const alt = tile.querySelector("img")?.alt || tile.getAttribute("aria-label") || "";
      const link = e.target.closest("a");
      if (link) e.preventDefault();
      const grid = tile.closest(".gallery-grid");
      const coll = visibleGridItems(grid);
      const idx = coll.indexOf(tile);
      openLB(base, alt, idx >= 0 ? idx : -1, coll);
    }
  });

  const galleryRoot = document.getElementById("galeria-grid") || document.querySelector("#galeria-grid");
  if (galleryRoot) {
    galleryRoot.addEventListener(
      "click",
      (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );
  }

  window.addEventListener(
    "hashchange",
    () => {
      if ((isDialog && lb.open) || (!isDialog && lb.classList.contains("open"))) {
        history.replaceState(null, "", location.pathname + location.search);
        window.scrollTo(0, _scrollY);
      }
    },
    true
  );

  btnX?.addEventListener("click", closeLB);
  if (overlayEl) overlayEl.addEventListener("click", closeLB);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLB();
  });
  lb.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeLB();
  });

  document.addEventListener("keydown", onKey);

  let btnPrev = lb.querySelector(".lb-prev");
  let btnNext = lb.querySelector(".lb-next");
  const mk = (cls, label, svg) => {
    const b = document.createElement("button");
    b.className = cls;
    b.type = "button";
    b.setAttribute("aria-label", label);
    b.innerHTML = svg;
    return b;
  };
  if (!btnPrev) {
    btnPrev = mk(
      "lb-prev",
      "Poprzednie zdjęcie",
      '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 19L8 12l7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    );
    lb.appendChild(btnPrev);
  }
  if (!btnNext) {
    btnNext = mk(
      "lb-next",
      "Następne zdjęcie",
      '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    );
    lb.appendChild(btnNext);
  }

  const onPrev = (e) => {
    e.stopPropagation();
    if (currentCollection.length) showAtIndex(currentIndex === -1 ? 0 : currentIndex - 1);
  };
  const onNext = (e) => {
    e.stopPropagation();
    if (currentCollection.length) showAtIndex(currentIndex === -1 ? 0 : currentIndex + 1);
  };
  btnPrev.addEventListener("click", onPrev);
  btnNext.addEventListener("click", onNext);

  // swipe
  (function () {
    if (!img) return;
    const SUPPORTS_POINTER = "PointerEvent" in window;

    let startX = 0,
      startY = 0,
      dx = 0,
      dy = 0;
    let tracking = false,
      lockedHorizontal = false;

    const THRESHOLD_PX = 60;
    const LOCK_ANGLE = 0.577;

    const setTransform = (x) => {
      img.style.transition = "none";
      img.style.transform = `translate3d(${x}px,0,0)`;
      img.style.willChange = "transform";
    };
    const resetTransform = () => {
      img.style.transition = "transform .18s ease";
      img.style.transform = "translate3d(0,0,0)";
      img.addEventListener(
        "transitionend",
        () => {
          img.style.willChange = "";
        },
        { once: true }
      );
    };

    const onDown = (x, y) => {
      startX = x;
      startY = y;
      dx = 0;
      dy = 0;
      tracking = true;
      lockedHorizontal = false;
    };
    const onMove = (x, y, e) => {
      if (!tracking) return;
      dx = x - startX;
      dy = y - startY;
      if (!lockedHorizontal && Math.abs(dx) > 8) {
        const ratio = Math.abs(dy / (dx || 1));
        lockedHorizontal = ratio < LOCK_ANGLE;
      }
      if (lockedHorizontal) {
        e?.preventDefault?.();
        setTransform(dx);
      }
    };
    const onUp = () => {
      if (!tracking) return;
      tracking = false;
      if (lockedHorizontal && Math.abs(dx) > THRESHOLD_PX && currentCollection.length) {
        const dir = dx < 0 ? +1 : -1;
        img.style.transition = "transform .12s ease";
        img.style.transform = `translate3d(${Math.sign(dx) * window.innerWidth * 0.25}px,0,0)`;
        setTimeout(() => {
          showAtIndex(currentIndex === -1 ? 0 : currentIndex + dir);
          img.style.transition = "none";
          img.style.transform = `translate3d(${Math.sign(-dx) * 28}px,0,0)`;
          requestAnimationFrame(() => resetTransform());
          preloadNeighbor(1);
          preloadNeighbor(-1);
        }, 90);
      } else {
        resetTransform();
      }
    };

    if (SUPPORTS_POINTER) {
      img.addEventListener(
        "pointerdown",
        (e) => {
          if (e.pointerType !== "mouse") onDown(e.clientX, e.clientY);
        },
        { passive: true }
      );
      img.addEventListener(
        "pointermove",
        (e) => {
          if (e.pointerType !== "mouse") onMove(e.clientX, e.clientY, e);
        },
        { passive: false }
      );
      img.addEventListener("pointerup", onUp, { passive: true });
      img.addEventListener("pointercancel", onUp, { passive: true });
    } else {
      img.addEventListener(
        "touchstart",
        (e) => {
          const t = e.touches[0];
          if (!t) return;
          onDown(t.clientX, t.clientY);
        },
        { passive: true }
      );
      img.addEventListener(
        "touchmove",
        (e) => {
          const t = e.touches[0];
          if (!t) return;
          onMove(t.clientX, t.clientY, e);
        },
        { passive: false }
      );
      img.addEventListener("touchend", onUp, { passive: true });
      img.addEventListener("touchcancel", onUp, { passive: true });
    }
  })();

  // fullscreen + zoom fallback
  const fsEl = lb;
  const canFS = !!(fsEl.requestFullscreen || fsEl.webkitRequestFullscreen || fsEl.msRequestFullscreen);
  const reqFS = () => fsEl.requestFullscreen?.() || fsEl.webkitRequestFullscreen?.() || fsEl.msRequestFullscreen?.();
  const exitFS = () => document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
  const isFS = () => !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);

  const enterZoomFallback = () => lb.classList.add("is-zoomed");
  const exitZoomFallback = () => lb.classList.remove("is-zoomed");
  const isZoomFallback = () => lb.classList.contains("is-zoomed");

  const setFsBackdrop = (on) => lb.classList.toggle("is-fs", !!on);

  async function toggleFullscreen() {
    if (canFS) {
      if (isFS()) {
        await exitFS();
        setFsBackdrop(false);
      } else {
        try {
          await reqFS();
          setFsBackdrop(true);
        } catch {
          enterZoomFallback();
          setFsBackdrop(true);
        }
      }
    } else {
      if (isZoomFallback()) {
        exitZoomFallback();
        setFsBackdrop(false);
      } else {
        enterZoomFallback();
        setFsBackdrop(true);
      }
    }
  }
  lb.addEventListener("close", () => {
    exitZoomFallback();
    setFsBackdrop(false);
  });
  document.addEventListener("fullscreenchange", () => setFsBackdrop(isFS()));

  img?.addEventListener("dblclick", (e) => {
    e.preventDefault();
    toggleFullscreen();
  });

  let lastTap = 0;
  img?.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
        toggleFullscreen();
        lastTap = 0;
      } else lastTap = now;
    },
    { passive: false }
  );

  lb.addEventListener("keydown", (e) => {
    if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  // API
  window.openLB = (base, alt, idx) => openLB(base, alt, idx);
  window.closeLB = closeLB;

  console.log("lightbox ready →", isDialog ? "<dialog>" : "<div>");
}

/* ===== 04 - RESERVATION FORM ===== */

function initReservationForm() {
  const form = byTestId("booking-form") || $("#booking-form");
  const msg = $("#form-msg");
  if (!form || !msg) return;

  const btn = form.querySelector(".btn-form");
  if (!msg.hasAttribute("aria-live")) msg.setAttribute("aria-live", "polite");
  if (!msg.hasAttribute("role")) msg.setAttribute("role", "status");

  const setLoading = (on) => {
    if (!btn) return;
    if (on) {
      if (!btn.dataset.label) btn.dataset.label = btn.textContent.trim();
      btn.textContent = "Wysyłanie…";
      btn.classList.add("is-loading");
      btn.setAttribute("aria-busy", "true");
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.label || "Wyślij rezerwację";
      btn.classList.remove("is-loading");
      btn.removeAttribute("aria-busy");
      btn.disabled = false;
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (btn && btn.classList.contains("is-loading")) return;

    // honeypot
    if (form.company && form.company.value.trim() !== "") {
      msg.textContent = "Wykryto bota — zgłoszenie odrzucone.";
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity?.();
      msg.textContent = "Uzupełnij wymagane pola.";
      return;
    }

    setLoading(true);
    msg.textContent = "";

    const T = 1000 + Math.random() * 200;
    setTimeout(() => {
      try {
        msg.textContent = "Dziękujemy! Oddzwonimy, aby potwierdzić rezerwację.";
        form.reset();
      } finally {
        setLoading(false);
      }
    }, T);
  });

  log("booking-form:", !!form, "btn-form:", !!btn);
}

/* ===== 05 - FOOTER YEAR ===== */

function initFooterYear() {
  const y = $("#year");
  if (!y) return;
  y.textContent = new Date().getFullYear();
}

/* ===== 06 - THEME SWITCHER ===== */

function initThemeSwitcher() {
  const btn = byTestId("theme-toggle") || $(".theme-toggle");
  if (!btn) return;

  const STORAGE_KEY = "theme";
  const root = document.documentElement;
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const prefersDark = mql.matches;
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!btn.hasAttribute("role")) btn.setAttribute("role", "button");

  const icon = (mode) => (mode === "dark" ? "☀" : "☾");

  const apply = (mode) => {
    const ic = $(".theme-icon", btn);
    if (mode === "light" || mode === "dark") {
      root.setAttribute("data-theme", mode);
      btn.setAttribute("aria-pressed", String(mode === "dark"));
      if (ic) ic.textContent = icon(mode);
    } else {
      root.removeAttribute("data-theme");
      btn.setAttribute("aria-pressed", "false");
      if (ic) ic.textContent = icon(prefersDark ? "dark" : "light");
    }
  };

  apply(saved ?? (prefersDark ? "dark" : "light"));

  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  });

  mql.addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) apply(e.matches ? "dark" : "light");
  });

  log("theme-toggle:", !!btn);
}

/* ===== 07 - SCROLLSPY ===== */

function initScrollspy() {
  const links = $$("#site-nav a[href^='#']");
  if (!links.length) return;

  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const setActive = (id) => {
    if (!id || !map.has(id)) return;
    links.forEach((a) => a.removeAttribute("aria-current"));
    map.get(id)?.setAttribute("aria-current", "true");
  };

  const sections = [...document.querySelectorAll("section[id]")].filter((sec) => map.has(sec.id));
  if (!sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((sec) => io.observe(sec));

  const nav = document.getElementById("site-nav") || document;
  nav.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a || !links.includes(a)) return;
      const id = a.getAttribute("href").slice(1);
      setActive(id);
    },
    { passive: true }
  );

  if (location.hash) setActive(location.hash.slice(1));

  log("scrollspy:", links.length);
}

/* ===== 08 - SCROLL BUTTONS ===== */

function initScrollButtons() {
  const btnDown = byTestId("scroll-down") || $(".scroll-down");
  const btnUp = byTestId("scroll-up") || $(".scroll-up");
  if (!btnDown && !btnUp) return;

  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = prefersReduce ? "auto" : "smooth";

  const docHeight = () =>
    Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

  const goBottom = () => {
    const top = Math.max(0, docHeight() - window.innerHeight);
    window.scrollTo({ top, behavior });
  };

  const goTop = () => window.scrollTo({ top: 0, behavior });

  btnDown?.addEventListener("click", goBottom);
  btnUp?.addEventListener("click", goTop);

  let ticking = false;
  const onScrollRaw = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || window.pageYOffset;
      if (btnDown) {
        const atBottom = window.innerHeight + y >= docHeight() - 100;
        btnDown.classList.toggle("is-hidden", atBottom);
      }
      if (btnUp) btnUp.classList.toggle("is-visible", y > 300);
      ticking = false;
    });
  };

  onScrollRaw();
  window.addEventListener("scroll", onScrollRaw, { passive: true });

  log("scroll-down:", !!btnDown, "scroll-up:", !!btnUp);
}

/* ===== 09 - CTA ===== */

function initCtaPulse() {
  const ctas = document.querySelectorAll(".btn-cta");
  if (!ctas.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("cta-inview", entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );

  ctas.forEach((btn) => io.observe(btn));

  log("cta buttons:", ctas.length);
}

/* ===== 10 - SMART NAV ===== */

function initSmartNav() {
  const path = location.pathname;
  const isHome = /(?:^|\/)(index\.html)?$/.test(path) || path.endsWith("/");
  if (isHome) return;

  const map = { "#menu": "menu.html", "#galeria": "galeria.html" };
  const links = document.querySelectorAll(".site-nav a[href^='#']");
  if (!links.length) return;

  links.forEach((a) => {
    const to = map[a.getAttribute("href") || ""];
    if (to) a.setAttribute("href", to);
  });

  log("smart-nav links:", links.length);
}

/* ===== 11 - NAV ===== */

function initAriaCurrent() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a"));
  const file = location.pathname.split("/").pop() || "";
  const page = file.replace(".html", "");
  const hash = (location.hash || "").replace("#", "");

  links.forEach((l) => l.removeAttribute("aria-current"));

  const hrefMatches = (a, token) => {
    if (!token) return false;
    const href = a.getAttribute("href") || "";
    return href.includes("#" + token) || href.endsWith(token + ".html") || href.includes("/" + token + ".html") || href.includes("/" + token);
  };

  if (page) {
    for (const a of links) {
      if (hrefMatches(a, page)) {
        a.setAttribute("aria-current", "page");
        return;
      }
    }
  }

  if (hash) {
    for (const a of links) {
      if (hrefMatches(a, hash)) {
        a.setAttribute("aria-current", "page");
        return;
      }
    }
  }

  log("aria-current nav:", links.length);
}

/* ===== 12 - PAGE MENU ===== */

function initPageMenuPanel() {
  if (!document.body.classList.contains("page-menu")) return;

  document.addEventListener(
    "click",
    (e) => {
      if (e.target.closest(".dish-more")) return;
      const openDetails = document.querySelectorAll(".dish-more[open]");
      if (!openDetails.length) return;
      openDetails.forEach((d) => d.removeAttribute("open"));
    },
    { passive: true }
  );

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".dish-more[open]").forEach((d) => d.removeAttribute("open"));
  });

  document.addEventListener("toggle", (e) => {
    const el = e.target;
    if (!el.matches?.(".dish-more")) return;
    if (el.open) {
      document.querySelectorAll(".dish-more[open]").forEach((d) => {
        if (d !== el) d.removeAttribute("open");
      });
    }
  });

  log("page-menu initialized");
}

/* ===== 13 - FAQ ===== */

function initFaqAria() {
  const root = document.getElementById("faq") || document.querySelector(".faq");
  if (!root) return;

  const panels = root.querySelectorAll("details");
  if (!panels.length) return;

  panels.forEach((d, i) => {
    const s = d.querySelector("summary");
    if (!s) return;

    const panel = d.querySelector(".content");
    if (panel && !panel.id) panel.id = `faqp-${i}-${Math.random().toString(36).slice(2)}`;
    if (panel && !s.hasAttribute("aria-controls")) s.setAttribute("aria-controls", panel.id);

    const sync = () => s.setAttribute("aria-expanded", d.hasAttribute("open") ? "true" : "false");
    d.addEventListener("toggle", sync);
    sync();
  });

  log("faq panels:", panels.length);
}

/* ===== 14 - GALLERY FILTER ===== */

function initGalleryFilter() {
  const root = document.querySelector("main.page-gallery");
  if (!root) return;

  const tabsWrap = root.querySelector(".tabs");
  if (!tabsWrap) return;

  const tabs = Array.from(tabsWrap.querySelectorAll(".tab"));
  const items = Array.from(root.querySelectorAll("#galeria-grid .g-item"));

  const normalize = (s) =>
    (s || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  function applyFilter(valueRaw) {
    const value = normalize(valueRaw);
    const showAll = value === "" || value === "all";
    items.forEach((el) => {
      const raw = el.dataset.cat || el.dataset.filter || "";
      const cats = normalize(raw)
        .split(/[\s,]+/)
        .filter(Boolean);
      el.hidden = showAll ? false : !cats.includes(value);
    });
  }

  function setActiveTab(btn) {
    tabs.forEach((t) => {
      const isAct = t === btn;
      t.setAttribute("aria-selected", String(isAct));
      t.classList.toggle("is-active", isAct);
    });
  }

  function initTabsA11y() {
    tabs.forEach((t, i) => {
      t.setAttribute("role", "tab");
      const selectedAttr = t.getAttribute("aria-selected");
      const selected = selectedAttr ? selectedAttr === "true" : i === 0;
      t.setAttribute("aria-selected", String(selected));
      t.setAttribute("tabindex", selected ? "0" : "-1");
    });
  }

  function activateTab(tab) {
    setActiveTab(tab);
    tabs.forEach((t) => t.setAttribute("tabindex", t === tab ? "0" : "-1"));
    const value = tab.dataset.filter || "";
    applyFilter(value);
    tab.focus();
  }

  function focusIndex(idx) {
    const i = (idx + tabs.length) % tabs.length;
    tabs[i].focus();
  }

  tabsWrap.addEventListener("keydown", (e) => {
    const key = e.key;
    const activeEl = document.activeElement;
    const idx = tabs.indexOf(activeEl);
    if (idx === -1) return;

    if (key === "ArrowRight" || key === "ArrowLeft") {
      e.preventDefault();
      focusIndex(key === "ArrowRight" ? idx + 1 : idx - 1);
      return;
    }
    if (key === "Home") {
      e.preventDefault();
      focusIndex(0);
      return;
    }
    if (key === "End") {
      e.preventDefault();
      focusIndex(tabs.length - 1);
      return;
    }
    if (key === "Enter" || key === " " || key === "Spacebar") {
      e.preventDefault();
      activateTab(activeEl);
      return;
    }
    if (key === "Escape") activeEl.blur();
  });

  tabs.forEach((t) => t.addEventListener("click", () => activateTab(t)));

  initTabsA11y();
  const pre = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
  if (pre) activateTab(pre);

  log("gallery-filter tabs:", tabs.length, "items:", items.length);
}

/* ===== 15 - STICKY SHADOW ON SCROLL ===== */

function initStickyShadow() {
  const onScroll = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  onScroll(); // stan początkowy
  window.addEventListener("scroll", onScroll, { passive: true });

  log("sticky shadow active");
}

/* ===== 16 - SCROLL TO TOP ===== */

function initScrollToTop() {
  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a.brand");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (href.includes("#top")) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReduce ? "auto" : "smooth" });
    }
  });

  log("scroll-to-top initialized");
}

/* ===== 17 - SCROLL TARGETS ===== */

function initScrollTargets() {
  const btns = document.querySelectorAll("[data-target]");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = document.querySelector(btn.dataset.target);
      section?.scrollIntoView({ behavior: "smooth" });
    });
  });

  log("scroll-target buttons:", btns.length);
}

/* ===== BOOTSTRAP ===== */

const FEATURES = [
  { name: "HELPERS", init: initHelpers },
  { name: "THEME SWITCHER", init: initThemeSwitcher },

  { name: "MOBILE NAV", init: initMobileNav },

  { name: "FOOTER YEAR", init: initFooterYear },

  { name: "SMART NAV", init: initSmartNav },
  { name: "NAV", init: initAriaCurrent },
  { name: "SCROLLSPY", init: initScrollspy },

  { name: "STICKY SHADOW", init: initStickyShadow },
  { name: "SCROLL BUTTONS", init: initScrollButtons },
  { name: "SCROLL TO TOP", init: initScrollToTop },
  { name: "SCROLL TARGETS", init: initScrollTargets },

  { name: "CTA", init: initCtaPulse },

  { name: "TABS", init: initTabs },
  { name: "PAGE MENU", init: initPageMenuPanel },
  { name: "RESERVATION FORM", init: initReservationForm },

  { name: "GALLERY FILTER", init: initGalleryFilter },
  { name: "LIGHTBOX", init: initLightbox },

  { name: "FAQ", init: initFaqAria },
];

function boot() {
  for (const f of FEATURES) {
    try {
      f.init();
    } catch (err) {
      console.warn(err);
    }
  }
}
document.addEventListener("DOMContentLoaded", boot);

/* ===== End of js/script.js ===== */
