/* ================================
   = Project: construction-02
   = Name: Axiom Construction
   = Technology: html/css/js
   = Author: Kamil Król - kp_code_
   = Last Update: 2025-12-19
   = Version: 1.00
   ================================
   = script.js
   = Structure overview
   ================================
   = 01 - IntersectionObserver
   = 02 - Theme toggle
   = 03 - Hamburger mobile nav
   = 04 - Scrool to top button
   = 05 - Contact form
   = 06 - Lightbox
   = 07 - Compact header
   = 08 - Register service worker
   ================================ */

/* === 01 - IntersectionObserver === */

(() => {
  const hiddenElements = document.querySelectorAll(".hidden");
  if (!hiddenElements.length) return;
  if (!("IntersectionObserver" in window)) {
    hiddenElements.forEach((el) => el.classList.add("show"));
    return;
  }
  const ENTER_RATIO = 0.12;
  const ROOT_MARGIN = "0px 0px 10% 0px";
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= ENTER_RATIO) {
          requestAnimationFrame(() => entry.target.classList.add("show"));
          return;
        }
        if (entry.intersectionRatio === 0) {
          entry.target.classList.remove("show");
        }
      });
    },
    { root: null, rootMargin: ROOT_MARGIN, threshold: [0, ENTER_RATIO, 0.5, 1] }
  );
  hiddenElements.forEach((el) => observer.observe(el));

  const isInViewport = (el, ratio = ENTER_RATIO) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    if (r.width === 0 || r.height === 0) return false;
    const visibleVert = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    const visibleHorz = Math.min(r.right, vw) - Math.max(r.left, 0);
    if (visibleVert <= 0 || visibleHorz <= 0) return false;
    const visibleArea = visibleVert * visibleHorz;
    const totalArea = r.width * r.height;
    return visibleArea / totalArea >= ratio;
  };
  const initialReveal = () => {
    hiddenElements.forEach((el) => {
      if (isInViewport(el)) el.classList.add("show");
    });
  };
  requestAnimationFrame(() => requestAnimationFrame(initialReveal));
  window.addEventListener("load", () => setTimeout(initialReveal, 0), { once: true });
  window.addEventListener("pageshow", () => setTimeout(initialReveal, 0), { once: true });
})();

/* === 02 - Theme toggle === */

(() => {
  const btnDesktop = document.getElementById("themeToggleDesktop");
  const btnMobile = document.getElementById("themeToggleMobile");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const setLogo = (isDark) => {
    document.querySelectorAll(".logo-img[data-light][data-dark]").forEach((img) => {
      const next = isDark ? img.dataset.dark : img.dataset.light;
      if (!next) return;
      const absNext = new URL(next, document.baseURI).href;
      if (img.src !== absNext) img.setAttribute("src", next);
    });
  };
  const setHamburgerIcon = (isDark) => {
    if (!hamburgerIcon) return;
    const next = isDark ? hamburgerIcon.dataset.dark : hamburgerIcon.dataset.light;
    if (next && hamburgerIcon.getAttribute("src") !== next) hamburgerIcon.setAttribute("src", next);
  };
  const syncButtonsA11y = (isDark) => {
    const pressed = String(isDark);
    const label = isDark ? "Przełącz na jasny motyw" : "Przełącz na ciemny motyw";
    if (btnDesktop) {
      btnDesktop.setAttribute("aria-pressed", pressed);
      btnDesktop.setAttribute("aria-label", label);
    }
    if (btnMobile) {
      btnMobile.setAttribute("aria-pressed", pressed);
      btnMobile.setAttribute("aria-label", label);
    }
  };
  const safeSetItem = (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  };
  const safeGetItem = (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };
  const setTheme = (mode, persist = true) => {
    const isDark = mode === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    setLogo(isDark);
    setHamburgerIcon(isDark);
    syncButtonsA11y(isDark);
    if (persist) safeSetItem("theme", isDark ? "dark" : "light");
  };
  const saved = safeGetItem("theme");
  if (saved === "dark" || saved === "light") setTheme(saved, false);
  else setTheme(mq && mq.matches ? "dark" : "light", false);
  const onToggle = () => setTheme(document.body.classList.contains("dark-mode") ? "light" : "dark", true);
  if (btnDesktop) btnDesktop.addEventListener("click", onToggle);
  if (btnMobile) btnMobile.addEventListener("click", onToggle);
  if (!saved && mq) {
    const onSystemChange = (e) => setTheme(e.matches ? "dark" : "light", false);
    if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }
})();

/* === 03 - Hamburger mobile nav=== */

(() => {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("primaryNav");
  if (!btn || !nav) return;
  const mql = window.matchMedia("(max-width: 768px)");
  if (!btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
  let lastTrigger = null;
  const unlock = () => document.body.classList.remove("nav-open");
  const lock = () => document.body.classList.add("nav-open");
  const applyDesktopState = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    nav.toggleAttribute("inert", false);
    nav.setAttribute("aria-hidden", "false");
    unlock();
    removeOutsideClick();
  };
  const applyMobileCollapsed = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    nav.toggleAttribute("inert", true);
    nav.setAttribute("aria-hidden", "true");
    unlock();
    removeOutsideClick();
  };
  const closeMenu = () => {
    nav.classList.remove("mobile-open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Otwórz menu");
    nav.toggleAttribute("inert", true);
    nav.setAttribute("aria-hidden", "true");
    unlock();
    (lastTrigger || btn).focus({ preventScroll: true });
    lastTrigger = null;
    removeOutsideClick();
  };
  const openMenu = () => {
    nav.classList.add("mobile-open");
    btn.classList.add("active");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Zamknij menu");
    nav.toggleAttribute("inert", false);
    nav.setAttribute("aria-hidden", "false");
    lock();
    lastTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : btn;
    const firstLink = nav.querySelector(".nav a");
    if (firstLink && typeof firstLink.focus === "function") {
      firstLink.focus({ preventScroll: true });
    }
    addOutsideClick();
  };
  const toggleMenu = () => (nav.classList.contains("mobile-open") ? closeMenu() : openMenu());
  btn.addEventListener("click", toggleMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("mobile-open")) closeMenu();
  });
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a[href], area[href]");
    if (link && mql.matches) closeMenu();
  });
  let outsideClickHandler = null;
  function addOutsideClick() {
    if (outsideClickHandler) return;
    outsideClickHandler = (e) => {
      if (!nav.classList.contains("mobile-open")) return;
      const inNav = nav.contains(e.target);
      const onBtn = btn.contains(e.target);
      if (!inNav && !onBtn) closeMenu();
    };
    document.addEventListener("pointerdown", outsideClickHandler, true);
  }
  function removeOutsideClick() {
    if (!outsideClickHandler) return;
    document.removeEventListener("pointerdown", outsideClickHandler, true);
    outsideClickHandler = null;
  }
  const onChange = (e) => {
    if (e.matches) {
      applyMobileCollapsed();
    } else {
      applyDesktopState();
    }
  };
  if (mql.addEventListener) mql.addEventListener("change", onChange);
  else if (mql.addListener) mql.addListener(onChange);
  if (mql.matches) applyMobileCollapsed();
  else applyDesktopState();
})();

/* === 04 - Button to top === */

(() => {
  const btn = document.getElementById("powrot-na-gore") || document.querySelector(".powrot-na-gore");
  if (!btn) return;
  const THRESHOLD = 300;
  const root = document.scrollingElement || document.documentElement;
  const getScrollTop = () => Math.max(0, typeof window.pageYOffset === "number" ? window.pageYOffset : root.scrollTop);
  const setVisible = (v) => {
    btn.classList.toggle("is-visible", v);
    btn.setAttribute("aria-hidden", String(!v));
    if (v) btn.removeAttribute("inert");
    else btn.setAttribute("inert", "");
  };
  const update = () => setVisible(getScrollTop() > THRESHOLD);
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };
  update();
  window.addEventListener("load", update, { once: true });
  window.addEventListener("pageshow", update, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") update();
  });
  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!btn.classList.contains("is-visible")) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  });
})();

/* === 05 - Contact form === */

(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const IS_LOCAL = /localhost|127\.0\.0\.1/.test(location.hostname);
  const statusBox = form.querySelector("#formStatus");
  const submitBtn = form.querySelector(".submit-btn");
  const originalBtnText = submitBtn ? submitBtn.textContent : "Wyślij wiadomość";
  const requiredFields = ["name", "email", "subject", "service", "message"];
  const msg = form.querySelector("#message");
  const counter = document.getElementById("messageCounter");
  const MAX = 500;
  const a11ySummary = form.querySelector("#errorSummary");
  const skipLink = form.querySelector("#skipToError");
  if (skipLink) {
    skipLink.addEventListener("click", (ev) => {
      ev.preventDefault();
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
    });
  }
  form.addEventListener("keydown", (ev) => {
    const k = ev.key || ev.code;
    if (ev.altKey && ev.shiftKey && (k === "E" || k === "KeyE")) {
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        ev.preventDefault();
        firstInvalid.focus();
      }
    }
  });
  const setInvalid = (el) => {
    if (!el) return;
    el.classList.add("is-invalid");
    el.setAttribute("aria-invalid", "true");
  };
  const clearInvalid = (el) => {
    if (!el) return;
    el.classList.remove("is-invalid");
    el.removeAttribute("aria-invalid");
  };
  const showStatus = (message, ok = false) => {
    if (!statusBox) return;
    statusBox.classList.toggle("ok", !!ok);
    statusBox.classList.toggle("err", !ok);
    statusBox.textContent = message;
  };

  function updateCounter() {
    if (!msg || !counter) return;
    if (msg.value.length > MAX) msg.value = msg.value.slice(0, MAX);
    const len = msg.value.length;
    counter.textContent = `${len}/${MAX}`;
    counter.classList.toggle("warn", len >= MAX - 50 && len < MAX);
    counter.classList.toggle("limit", len >= MAX);
  }
  updateCounter();
  const MSG_KEY = "contactFormMessage";
  if (msg) {
    const savedMsg = (() => {
      try {
        return localStorage.getItem(MSG_KEY);
      } catch {
        return null;
      }
    })();
    if (savedMsg) {
      msg.value = savedMsg;
      updateCounter();
    }
    msg.addEventListener("input", () => {
      try {
        localStorage.setItem(MSG_KEY, msg.value);
      } catch {}
    });
  }

  form.addEventListener("input", (e) => {
    const t = e.target;
    if (t.matches("#name, #email, #subject, #service, #message, #phone, #consent")) clearInvalid(t);
    if (t === msg) updateCounter();
    if (![...form.querySelectorAll(".is-invalid")].length) {
      if (a11ySummary) a11ySummary.classList.add("visually-hidden");
      if (skipLink) skipLink.classList.add("visually-hidden");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.getAttribute("aria-busy") === "true") return;
    showStatus("", false);
    let valid = true;
    requiredFields.forEach((id) => {
      const el = form.querySelector("#" + id);
      if (!el || !el.value || !el.value.trim()) {
        setInvalid(el);
        valid = false;
      }
    });
    const email = form.querySelector("#email");
    const emailVal = email ? email.value.trim() : "";
    if (email && emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setInvalid(email);
      valid = false;
      showStatus("Wpisz poprawny adres e-mail.", false);
    }
    const phone = form.querySelector("#phone");
    if (phone) {
      const phoneVal = phone.value.trim();
      if (phoneVal && !/^[0-9 +()-]{7,20}$/.test(phoneVal)) {
        setInvalid(phone);
        valid = false;
        showStatus("Wpisz poprawny numer telefonu (np. +48 600 000 000).", false);
      }
    }
    const consent = form.querySelector("#consent");
    if (consent && !consent.checked) {
      setInvalid(consent);
      valid = false;
      showStatus("Zaznacz zgodę na przetwarzanie danych.", false);
    }
    const recaptchaWrap = form.querySelector("[data-recaptcha]");
    if (recaptchaWrap && !IS_LOCAL) {
      const tokenField = form.querySelector('[name="g-recaptcha-response"]');
      if (!tokenField || !tokenField.value) {
        valid = false;
        showStatus("Potwierdź, że nie jesteś robotem (reCAPTCHA).", false);
      }
    }
    if (msg && msg.value.length > MAX) {
      setInvalid(msg);
      valid = false;
      showStatus(`Wiadomość może mieć maks. ${MAX} znaków.`, false);
    }
    if (!valid) {
      const invalids = [...form.querySelectorAll(".is-invalid")];
      if (a11ySummary) {
        const labels = invalids.map((el) => {
          const lab = el.id ? form.querySelector(`label[for="${el.id}"]`) : null;
          return lab ? lab.textContent.trim() : el.name || el.id || "Pole";
        });
        const n = invalids.length;
        const suf = n === 1 ? "błąd" : n >= 2 && n <= 4 ? "błędy" : "błędów";
        a11ySummary.textContent = `Formularz zawiera ${n} ${suf}: ${labels.join(", ")}.`;
        a11ySummary.classList.remove("visually-hidden");
      }
      if (skipLink) skipLink.classList.remove("visually-hidden");
      const firstInvalid = invalids[0];
      if (firstInvalid) firstInvalid.focus();
      if (statusBox && !statusBox.textContent) showStatus("Uzupełnij wymagane pola.", false);
      return;
    }
    form.setAttribute("aria-busy", "true");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("sending");
      submitBtn.textContent = "Wysyłanie…";
    }
    showStatus("Wysyłanie…", true);
    const formData = new FormData(form);
    const body = new URLSearchParams(formData).toString();
    try {
      if (!IS_LOCAL) {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
        if (!res.ok) throw new Error("Netlify response not OK");
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
      form.setAttribute("aria-busy", "false");
      form.reset();
      try {
        localStorage.removeItem(MSG_KEY);
      } catch {}
      updateCounter();
      showStatus("Dziękujemy! Wiadomość została wysłana.", true);
      if (submitBtn) {
        submitBtn.classList.remove("sending");
        submitBtn.classList.add("sent");
        submitBtn.textContent = "Wysłano ✓";
        setTimeout(() => {
          submitBtn.disabled = false;
        }, 1200);
        setTimeout(() => {
          showStatus("", true);
          submitBtn.classList.remove("sent");
          submitBtn.textContent = originalBtnText;
        }, 6000);
      }
      if (a11ySummary) a11ySummary.classList.add("visually-hidden");
      if (skipLink) skipLink.classList.add("visually-hidden");
      if (!IS_LOCAL) {
        if (typeof gtag === "function") {
          gtag("event", "generate_lead", { event_category: "Formularz", event_label: "Kontakt — Budownictwo" });
        }
        if (typeof fbq === "function") {
          fbq("track", "Lead");
        }
      }
    } catch (err) {
      form.setAttribute("aria-busy", "false");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("sending");
        submitBtn.textContent = originalBtnText;
      }
      showStatus("Ups! Nie udało się wysłać. Spróbuj ponownie za chwilę.", false);
      console.error(err);
    }
  });
})();

/* === 06 - Lightbox === */

(() => {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const imgEl = lb.querySelector(".lb__img");
  const captionEl = lb.querySelector(".lb__caption");
  const closeBtn = lb.querySelector(".lb__close");
  const backdrop = lb.querySelector(".lb__backdrop");
  const figureEl = lb.querySelector(".lb__figure");
  let items = [];
  let currentIndex = 0;
  let currentContainer = null;
  let prevBtn = null;
  let nextBtn = null;
  let liveRegion = null;
  let fsBtn = null;
  let lastActive = null;
  let focusables = [],
    firstF = null,
    lastF = null;
  const isTouchLike = window.matchMedia ? window.matchMedia("(hover: none) and (pointer: coarse)").matches : "ontouchstart" in window;
  const trapInit = () => {
    focusables = Array.from(lb.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
    firstF = focusables[0];
    lastF = focusables[focusables.length - 1];
  };
  const trapRelease = () => {
    focusables = [];
    firstF = lastF = null;
  };
  const handleTrap = (e) => {
    if (!focusables.length) return;
    if (e.shiftKey && document.activeElement === firstF) {
      e.preventDefault();
      lastF.focus();
    } else if (!e.shiftKey && document.activeElement === lastF) {
      e.preventDefault();
      firstF.focus();
    }
  };
  const open = (src, alt) => {
    lastActive = document.activeElement;
    if (!items.length) {
      imgEl.src = src;
      imgEl.alt = alt || "";
      if (alt && alt.trim()) {
        captionEl.textContent = alt;
        captionEl.hidden = false;
      } else {
        captionEl.textContent = "";
        captionEl.hidden = true;
      }
    }
    lb.removeAttribute("hidden");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("lb-open");
    trapInit();
    if (closeBtn) closeBtn.focus();
    ensureControls();
    announceSlide();
  };
  const close = () => {
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-open");
    imgEl.removeAttribute("src");
    captionEl.textContent = "";
    captionEl.hidden = true;
    trapRelease();
    lb.classList.remove("is-immersive");
    lb.setAttribute("hidden", "");
    if (lastActive && typeof lastActive.focus === "function") {
      lastActive.focus();
    }
    items = [];
    currentIndex = 0;
    currentContainer = null;
    if (fsBtn) {
      fsBtn.setAttribute("aria-pressed", "false");
      fsBtn.setAttribute("aria-label", "Włącz pełny ekran");
    }
  };
  const isFs = () => !!document.fullscreenElement;
  const enterFs = (el) => (el && el.requestFullscreen ? el.requestFullscreen() : Promise.resolve());
  const exitFs = () => (document.exitFullscreen ? document.exitFullscreen() : Promise.resolve());
  const isImmersiveFallback = () => lb.classList.contains("is-immersive");
  const toggleFs = () => {
    if (figureEl && figureEl.requestFullscreen && document.exitFullscreen) {
      return isFs() ? exitFs() : enterFs(figureEl);
    }
    lb.classList.toggle("is-immersive");
    updateFsButton();
    return Promise.resolve();
  };
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".gallery-link");
    if (!link || !link.closest(".gallery-container")) return;
    e.preventDefault();
    const href = link.getAttribute("href");
    const thumbImg = link.querySelector("img");
    const alt = thumbImg ? thumbImg.alt : "";
    currentContainer = link.closest(".gallery-container");
    const links = currentContainer ? Array.from(currentContainer.querySelectorAll(".gallery-link")) : [link];
    items = links
      .map((a) => {
        const timg = a.querySelector("img");
        return { href: a.getAttribute("href"), alt: timg ? timg.alt : "" };
      })
      .filter((i) => !!i.href);
    currentIndex = Math.max(
      0,
      items.findIndex((i) => i.href === href)
    );
    open(href, alt);
    render(currentIndex);
  });
  if (backdrop)
    backdrop.addEventListener("click", () => {
      if (isFs()) {
        exitFs().finally(() => close());
        return;
      }
      if (isImmersiveFallback()) lb.classList.remove("is-immersive");
      close();
    });
  if (imgEl) {
    imgEl.addEventListener("click", () => {
      toggleFs();
    });
    imgEl.addEventListener("dblclick", (e) => {
      e.preventDefault();
      toggleFs();
    });
  }

  function ensureControls() {
    if (!figureEl) return;
    if (!prevBtn) {
      prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "lb__prev";
      prevBtn.setAttribute("aria-label", "Poprzednie zdjęcie");
      prevBtn.innerHTML = "&#8249;";
      prevBtn.addEventListener("click", () => {
        showPrev();
      });
      figureEl.appendChild(prevBtn);
    }
    if (!nextBtn) {
      nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "lb__next";
      nextBtn.setAttribute("aria-label", "Następne zdjęcie");
      nextBtn.innerHTML = "&#8250;";
      nextBtn.addEventListener("click", () => {
        showNext();
      });
      figureEl.appendChild(nextBtn);
    }
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.className = "sr-only";
      liveRegion.setAttribute("aria-live", "polite");
      lb.appendChild(liveRegion);
    }
    if (!fsBtn) {
      fsBtn = document.createElement("button");
      fsBtn.type = "button";
      fsBtn.className = "lb__fs";
      fsBtn.setAttribute("aria-pressed", "false");
      fsBtn.setAttribute("aria-label", "Włącz pełny ekran");
      fsBtn.textContent = "⛶";
      fsBtn.addEventListener("click", () => {
        toggleFs();
        updateFsButton();
      });
      figureEl.appendChild(fsBtn);
    }
    updateFsButton();
  }

  function announceSlide() {
    if (!liveRegion || !items.length) return;
    const n = items.length;
    liveRegion.textContent = `Zdjęcie ${currentIndex + 1} z ${n}`;
  }

  function updateFsButton() {
    if (!fsBtn) return;
    const active = isFs() || isImmersiveFallback();
    fsBtn.setAttribute("aria-pressed", String(active));
    fsBtn.setAttribute("aria-label", active ? "Wyłącz pełny ekran" : "Włącz pełny ekran");
  }

  function preloadNeighbor(i) {
    if (!items.length) return;
    const n = items.length;
    const prev = items[(i - 1 + n) % n];
    const next = items[(i + 1) % n];
    [prev, next].forEach((it) => {
      if (it && it.href) {
        const pre = new Image();
        pre.decoding = "async";
        pre.src = it.href;
      }
    });
  }

  function render(i) {
    if (!items.length) return;
    const it = items[i];
    if (!it) return;
    imgEl.classList.add("is-fading");
    const onLoad = () => {
      imgEl.classList.remove("is-fading");
      imgEl.removeEventListener("load", onLoad);
    };
    imgEl.addEventListener("load", onLoad);
    imgEl.src = it.href;
    imgEl.alt = it.alt || "";
    if (it.alt && it.alt.trim()) {
      captionEl.textContent = it.alt;
      captionEl.hidden = false;
    } else {
      captionEl.textContent = "";
      captionEl.hidden = true;
    }
    announceSlide();
    preloadNeighbor(i);
  }

  function showNext() {
    if (!items.length) return;
    currentIndex = (currentIndex + 1) % items.length;
    render(currentIndex);
  }

  function showPrev() {
    if (!items.length) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    render(currentIndex);
  }

  (function initSwipe() {
    if (!figureEl) return;
    let startX = 0,
      startY = 0,
      dragging = false,
      dx = 0,
      dy = 0,
      active = false;
    const H_THRESHOLD = 48; // px
    const detectStart = (x, y) => {
      startX = x;
      startY = y;
      dragging = false;
      dx = 0;
      dy = 0;
      active = true;
    };
    const detectMove = (x, y, ev) => {
      if (!active) return;
      dx = x - startX;
      dy = y - startY;
      if (!dragging) {
        if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) dragging = true;
      }
      if (dragging && ev && ev.cancelable) ev.preventDefault();
    };
    const detectEnd = () => {
      if (dragging) {
        if (Math.abs(dx) > H_THRESHOLD) {
          if (dx < 0) showNext();
          else showPrev();
        }
      }
      dragging = false;
      active = false;
      dx = dy = 0;
    };
    figureEl.addEventListener("pointerdown", (e) => {
      detectStart(e.clientX, e.clientY);
    });
    figureEl.addEventListener(
      "pointermove",
      (e) => {
        detectMove(e.clientX, e.clientY, e);
      },
      { passive: true }
    );
    figureEl.addEventListener("pointerup", detectEnd);
    figureEl.addEventListener("pointercancel", detectEnd);
    figureEl.addEventListener("pointerleave", () => {
      if (active) detectEnd();
    });
  })();
  if (closeBtn) closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (lb.getAttribute("aria-hidden") !== "false") return;
    if (e.key === "Escape") {
      e.preventDefault();
      if (isFs()) {
        exitFs();
        return;
      }
      if (isImmersiveFallback()) {
        lb.classList.remove("is-immersive");
        return;
      }
      close();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      showNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      showPrev();
    } else if (e.key === "Tab") {
      handleTrap(e);
    }
  });
  document.addEventListener("fullscreenchange", () => {
    if (!isFs()) {
      lb.classList.remove("is-immersive");
    }
    updateFsButton();
  });
  if (!isTouchLike) {
    document.addEventListener(
      "mouseenter",
      (e) => {
        const el = e.target;
        if (!el || el.nodeType !== 1 || typeof el.closest !== "function") return;
        const link = el.closest(".gallery-link");
        if (!link || !link.closest(".gallery-container")) return;
        const href = link.getAttribute("href");
        if (!href) return;
        const pre = new Image();
        pre.decoding = "async";
        pre.src = href;
      },
      true
    );
  }
})();

/* === 07 - Compact header === */

(() => {
  const THRESHOLD = 20;
  let compactOn = false;
  let ticking = false;
  const shouldCompact = () => (window.scrollY || window.pageYOffset || 0) > THRESHOLD;
  const apply = (on) => {
    if (on === compactOn) return;
    compactOn = on;
    document.body.classList.toggle("header-compact", compactOn);
  };
  const update = () => apply(shouldCompact());
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("pageshow", update, { once: true });
  const btn = document.getElementById("hamburger");
  if (btn) {
    btn.addEventListener("click", () => {
      setTimeout(update, 0);
    });
  }
  const mo = new MutationObserver(update);
  mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
})();

/* === 08 - Register serwice worker === */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
