/* ================================
   = Project: gastronomy-01
   = Name: Ambre
   = Technology: html/css/js
   = Author: Kamil Król - kp_code_
   = Last Update: 2026-01-02
   = Version: 1.00
   ================================
   = script.js
   = Structure Overview
   ================================
   = 00 - Helpers
   = 01 - Mobile nav toggle
   = 02 - Tabs
   = 03 - Lightbox
   = 04 - Rezerwation form
   = 05 - Footer year
   = 06 - Theme switcher
   = 07 - Scroll spy
   = 08 - Scroll buttons
   = 09 - CTA
   = 10 - Smart nav
   = 11 - Nav
   = 12 - Page menu
   = 13 - FAQ
   = 14 - Gallery filter
   = 15 - Sticky shadow on scroll
   = 16 - Scroll to top
   = 17 - Scroll targets
   = 18 - Load more
   = 19 - Demo banner
   =============================== */

/* === 00 - Helpers === */

const DEBUG = false;
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

/* === 01 - Mobile nav toggle === */

function initMobileNav() {
  const toggle = byTestId("nav-toggle") || $(".nav-toggle");
  const nav = byTestId("site-nav") || $("#site-nav");
  const drawer = $(".nav-drawer");
  const overlay = $(".nav-overlay");
  if (!toggle || !nav || !drawer || !overlay) return;

  const mqMobile = window.matchMedia("(max-width: 938px)");
  const drawerNav = drawer.querySelector(".nav-drawer-inner") || drawer;
  let closeTimer = null;

  const setupAccordion = (root) => {
    const items = Array.from(root.querySelectorAll(".has-submenu"));
    items.forEach((item, index) => {
      const trigger = item.querySelector(":scope > a");
      const submenu = item.querySelector(":scope > .nav-submenu");
      if (!trigger || !submenu) return;
      if (!submenu.id) submenu.id = `drawer-submenu-${index + 1}`;
      trigger.classList.add("drawer-accordion-trigger");
      trigger.setAttribute("aria-controls", submenu.id);
      trigger.setAttribute("aria-expanded", "false");
    });

    root.addEventListener("click", (e) => {
      const trigger = e.target.closest(".drawer-accordion-trigger");
      if (trigger) {
        if (!mqMobile.matches) return;
        e.preventDefault();
        const item = trigger.closest(".has-submenu");
        const isOpen = item.classList.contains("is-accordion-open");
        items.forEach((other) => {
          if (other === item) return;
          other.classList.remove("is-accordion-open");
          other.querySelector(":scope > .drawer-accordion-trigger")?.setAttribute("aria-expanded", "false");
        });
        item.classList.toggle("is-accordion-open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
        return;
      }
      if (e.target.closest("a")) setOpen(false);
    });
  };

  const buildDrawer = () => {
    if (drawerNav.dataset.built === "true") return;
    const list = nav.querySelector("ul");
    if (!list) return;
    const cloned = list.cloneNode(true);
    cloned.classList.add("drawer-menu");
    drawerNav.innerHTML = "";
    drawerNav.appendChild(cloned);
    drawerNav.dataset.built = "true";
    setupAccordion(cloned);
  };

  const drawerId = drawer.id || "mobile-drawer";
  if (!drawer.id) drawer.id = drawerId;
  toggle.setAttribute("aria-controls", drawerId);

  const setOpen = (open) => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (!mqMobile.matches && open) return;
    if (open) {
      buildDrawer();
      overlay.hidden = false;
      drawer.hidden = false;
      drawer.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        document.body.classList.add("nav-open");
        toggle.setAttribute("aria-expanded", "true");
        const firstLink = drawer.querySelector("a, button, [tabindex]:not([tabindex='-1'])");
        firstLink?.focus();
      });
      return;
    }
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    closeTimer = window.setTimeout(() => {
      overlay.hidden = true;
      drawer.hidden = true;
    }, 260);
    toggle.focus();
  };

  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")), { passive: true });
  overlay.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) setOpen(false);
  });

  const onMQChange = () => {
    if (!mqMobile.matches) setOpen(false);
  };
  mqMobile.addEventListener?.("change", onMQChange);
  window.addEventListener("resize", onMQChange, { passive: true });

  log("nav-toggle:", !!toggle, "site-nav:", !!nav, "drawer:", !!drawer);
}

/* === 02 - Tabs === */

function initTabs() {
  const tabsRoot = byTestId("menu-tabs") || document;
  const tabs = $$(".tab", tabsRoot);
  if (!tabs.length) return;

  const items = $$(".dish");
  const grid = document.querySelector(".menu-grid");

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
      const loadVisible = card.dataset.loadVisible !== "false";
      const show = (filter === "all" || card.dataset.cat === filter) && loadVisible;
      card.hidden = !show;
    });
  };

  activate($(".tab.is-active", tabsRoot) || tabs[0]);

  const onLoadMoreUpdate = () => {
    const active = $(".tab.is-active", tabsRoot) || tabs[0];
    if (active) activate(active);
  };
  grid?.addEventListener("loadmore:update", onLoadMoreUpdate);

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

/* === 18 - Load more === */

function setupLoadMore({ root, items, button, status, step = 12 }) {
  if (!root || !items?.length || !button || !status) return;

  const total = items.length;
  let visibleCount = Math.min(step, total);

  const update = () => {
    items.forEach((item, idx) => {
      const isVisible = idx < visibleCount;
      item.dataset.loadVisible = isVisible ? "true" : "false";
      item.hidden = !isVisible;
    });

    status.textContent = `Zaladowano ${Math.min(visibleCount, total)} z ${total}`;
    const done = visibleCount >= total;
    button.disabled = done;
    button.setAttribute("aria-disabled", done ? "true" : "false");
    button.textContent = done ? "Wszystko zaladowane" : "Zaladuj wiecej";
    button.hidden = total <= step && done;
  };

  update();
  root.dispatchEvent(new CustomEvent("loadmore:update", { bubbles: true }));

  button.addEventListener("click", () => {
    if (visibleCount >= total) return;
    visibleCount = Math.min(visibleCount + step, total);
    update();
    root.dispatchEvent(new CustomEvent("loadmore:update", { bubbles: true }));
  });
}

function initLoadMoreMenu() {
  const root = document.querySelector("main.page-menu");
  if (!root) return;

  const grid = root.querySelector(".menu-grid");
  const button = root.querySelector("[data-load-more]");
  const status = root.querySelector("[data-load-status]");
  if (!grid || !button || !status) return;

  const items = Array.from(grid.querySelectorAll(".dish"));
  setupLoadMore({ root: grid, items, button, status, step: 12 });
}

function initLoadMoreGallery() {
  const root = document.querySelector("main.page-gallery");
  if (!root) return;

  const grid = root.querySelector(".gallery-grid");
  const button = root.querySelector("[data-load-more]");
  const status = root.querySelector("[data-load-status]");
  if (!grid || !button || !status) return;

  const items = Array.from(grid.querySelectorAll(".g-item"));
  setupLoadMore({ root: grid, items, button, status, step: 12 });
}

/* === 03 - Lightbox === */

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
  if (imgEl) return imgEl.src || imgEl.currentSrc || "";
  return "";
};


const setSources = (base, alt = "") => {
  if (!base) return;
  const p = stripExt(base);
  if (!p) return;
  const pOpt = p.replace("/assets/img/", "/assets/img/_optimized/");
  if (sAvif) sAvif.srcset = `${pOpt}.avif`;
  if (sWebp) sWebp.srcset = `${pOpt}.webp`;
  if (img) {
    img.src = `${p}.jpg`;
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
    const pOpt = p.replace("/assets/img/", "/assets/img/_optimized/");
    [`${pOpt}.webp`, `${pOpt}.avif`, `${p}.jpg`].forEach((u) => {
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

  window.openLB = (base, alt, idx) => openLB(base, alt, idx);
  window.closeLB = closeLB;

  console.log("lightbox ready →", isDialog ? "<dialog>" : "<div>");
}

/* === 04 - Reservation form === */

function initReservationForm() {
  const form = byTestId("booking-form") || $("#booking-form");
  const msg = $("#form-msg");
  if (!form || !msg) return;

  const btn = form.querySelector(".btn-form");
  const phone = form.querySelector("#phone");
  const consent = form.querySelector("#consent");
  const phoneError = $("#phone-error");
  const consentError = $("#consent-error");
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

  const digitsOnly = (value) => (value || "").replace(/\D/g, "");

  const formatPhonePL = (value) => {
    let digits = digitsOnly(value);
    if (digits.startsWith("48") && digits.length > 9) digits = digits.slice(2);
    digits = digits.slice(0, 9);
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 9);
    const groups = [p1, p2, p3].filter(Boolean);
    return groups.length ? `+48 ${groups.join(" ")}` : "";
  };

  const isValidPhonePL = (value) => {
    let digits = digitsOnly(value);
    if (digits.startsWith("48") && digits.length > 9) digits = digits.slice(2);
    return digits.length === 9;
  };

  const setFieldError = (field, errorEl, text) => {
    if (errorEl) errorEl.textContent = text || "";
    if (!field) return;
    if (text) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  };

  if (phone) {
    phone.addEventListener("input", () => {
      const formatted = formatPhonePL(phone.value);
      if (formatted !== phone.value) phone.value = formatted;
      setFieldError(phone, phoneError, "");
    });
    phone.addEventListener("blur", () => {
      if (phone.value && !isValidPhonePL(phone.value)) {
        setFieldError(phone, phoneError, "Podaj poprawny numer telefonu w formacie +48 123 456 789.");
      }
    });
  }

  consent?.addEventListener("change", () => setFieldError(consent, consentError, ""));

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (btn && btn.classList.contains("is-loading")) return;

    if (form.company && form.company.value.trim() !== "") {
      msg.textContent = "Wykryto bota — zgłoszenie odrzucone.";
      return;
    }

    const phoneOk = phone ? isValidPhonePL(phone.value) : true;
    const consentOk = consent ? consent.checked : true;
    setFieldError(phone, phoneError, phoneOk ? "" : "Podaj poprawny numer telefonu w formacie +48 123 456 789.");
    setFieldError(consent, consentError, consentOk ? "" : "Wymagana zgoda na przetwarzanie danych.");

    if (!phoneOk || !consentOk || !form.checkValidity()) {
      form.reportValidity?.();
      msg.textContent = "Popraw bledy w formularzu.";
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

/* === 05 - Footer year === */

function initFooterYear() {
  const y = $("#year");
  if (!y) return;
  y.textContent = new Date().getFullYear();
}

/* === 06 - THheme switcher === */

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

/* === 07 - Scrollspy === */

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

/* === 08 - Scroll buttons === */

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

/* === 09 - CTA === */

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

/* === 10 - Smart nav === */

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

/* === 11 - Nav === */

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

/* === 12 - Page menu === */

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

/* === 13 - FAQ === */

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

/* === 14 - Gallery filter === */

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
      const loadVisible = el.dataset.loadVisible !== "false";
      el.hidden = !loadVisible || (!showAll && !cats.includes(value));
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

  function activateTab(tab, shouldFocus = true) {
    setActiveTab(tab);
    tabs.forEach((t) => t.setAttribute("tabindex", t === tab ? "0" : "-1"));
    const value = tab.dataset.filter || "";
    applyFilter(value);
    if (shouldFocus) tab.focus();
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

  const grid = root.querySelector(".gallery-grid");
  const onLoadMoreUpdate = () => {
    const active = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
    if (active) activateTab(active, false);
  };
  grid?.addEventListener("loadmore:update", onLoadMoreUpdate);

  log("gallery-filter tabs:", tabs.length, "items:", items.length);
}

/* === 15 - Sticky shadow on scroll === */

function initStickyShadow() {
  const onScroll = () => {
    document.body.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  log("sticky shadow active");
}

/* === 16 - Scroll to top === */

function initScrollToTop() {
  const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a.brand");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    if (href.includes("#top")) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReduce ? "auto" : "smooth" });
    }
  });

  log("scroll-to-top initialized");
}

/* === 17 - Scroll targets === */

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

/* === 19 - Demo banner === */

function initDemoBanner() {
  const banner = document.getElementById("demo-banner");
  if (!banner) return;

  const STORAGE_KEY = "gastronomy_demo_accepted";
  const acceptBtn = banner.querySelector("[data-demo-accept]");
  const panel = banner.querySelector(".demo-banner__panel");
  let lastFocused = null;

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex=\"-1\"])';

  const getFocusable = () => Array.from(banner.querySelectorAll(focusableSelector)).filter((el) => !el.hasAttribute("disabled"));

  const open = () => {
    lastFocused = document.activeElement;
    banner.hidden = false;
    banner.setAttribute("aria-hidden", "false");
    document.body.classList.add("demo-banner-open");
    const focusables = getFocusable();
    (focusables[0] || panel || banner).focus?.();
  };

  const close = () => {
    banner.setAttribute("aria-hidden", "true");
    banner.hidden = true;
    document.body.classList.remove("demo-banner-open");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  const onKeydown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      return;
    }
    if (e.key !== "Tab") return;

    const focusables = getFocusable();
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  banner.addEventListener("keydown", onKeydown);

  acceptBtn?.addEventListener("click", () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    close();
  });

  const accepted = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  })();

  if (!accepted) open();
}

/* === Bootstrap === */

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

  { name: "DEMO BANNER", init: initDemoBanner },
  { name: "LOAD MORE MENU", init: initLoadMoreMenu },
  { name: "TABS", init: initTabs },
  { name: "PAGE MENU", init: initPageMenuPanel },
  { name: "RESERVATION FORM", init: initReservationForm },

  { name: "LOAD MORE GALLERY", init: initLoadMoreGallery },
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
