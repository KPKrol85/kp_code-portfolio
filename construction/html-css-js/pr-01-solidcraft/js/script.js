

/* === 00 - Header height === */

const utils = (() => {
  const docEl = document.documentElement;
  const headerSel = '.site-header, header[role="banner"]';
  const qHeader = () => document.querySelector(headerSel);
  const readCssVarPx = (name) => {
    const raw = getComputedStyle(docEl).getPropertyValue(name);
    const v = parseFloat(raw);
    return Number.isFinite(v) ? v : 0;
  };

  const measureHeaderPx = () => {
    const el = qHeader();
    return el ? Math.round(el.getBoundingClientRect().height) : 0;
  };

  const computeHeaderH = () => {
    const fromVar = readCssVarPx("--header-h");
    const val = fromVar > 0 ? fromVar : measureHeaderPx();
    return val > 0 ? val : 74;
  };

  let cached = null;
  let lastW = 0;

  const getHeaderH = () => {
    const w = window.innerWidth || 0;
    if (cached != null && w === lastW) return cached;
    cached = computeHeaderH();
    lastW = w;
    return cached;
  };

  const refreshHeaderH = () => {
    cached = null;
    return getHeaderH();
  };

  const syncHeaderCssVar = () => {
    const h = computeHeaderH();
    docEl.style.setProperty("--header-h", `${h}px`);
    cached = h;
    return h;
  };

  let rAF = 0;
  window.addEventListener(
    "resize",
    () => {
      if (rAF) return;
      rAF = requestAnimationFrame(() => {
        rAF = 0;
        cached = null;
      });
    },
    { passive: true },
  );

  return Object.freeze({ getHeaderH, refreshHeaderH, syncHeaderCssVar });
})();

/* === 01 - Navigation dropdown === */

function initNav() {
  if (initNav._abort) initNav._abort.abort();

  const ac = new AbortController();
  const { signal } = ac;

  initNav._abort = ac;

  const html = document.documentElement;
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#navMenu");

  if (!toggle || !menu) return;
  if (!toggle.getAttribute("aria-controls"))
    toggle.setAttribute("aria-controls", "navMenu");

  const OPEN_CLASS = "is-nav-open";
  const OUTSIDE_EVT = "pointerdown" in window ? "pointerdown" : "click";

  let lastFocus = null;

  const setOpen = (open, { silentFocus = false } = {}) => {
    menu.classList.toggle("open", open);
    html.classList.toggle(OPEN_CLASS, open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    window.dispatchEvent(new CustomEvent("nav:toggle", { detail: { open } }));
    if (silentFocus) return;
    if (open) {
      lastFocus = document.activeElement;
      menu
        .querySelector('a, button, [tabindex]:not([tabindex="-1"])')
        ?.focus({ preventScroll: true });
    } else {
      (lastFocus || toggle).focus({ preventScroll: true });
      lastFocus = null;
    }
  };

  setOpen(menu.classList.contains("open"), { silentFocus: true });

  toggle.addEventListener(
    "click",
    () => setOpen(!menu.classList.contains("open")),
    { signal },
  );

  menu.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
      if (isMobile) setOpen(false);
    },
    { signal },
  );

  document.addEventListener(
    OUTSIDE_EVT,
    (e) => {
      if (!menu.classList.contains("open")) return;
      if (!menu.contains(e.target) && !toggle.contains(e.target))
        setOpen(false);
    },
    { capture: true, passive: true, signal },
  );

  document.addEventListener(
    "keydown",
    (e) => {
      const isOpen = menu.classList.contains("open");
      if (!isOpen) return;
      if (e.key === "Escape") {
        const ddMenuLive = document.querySelector("#dd-oferta");
        const ddTrigLive = document.querySelector(
          '.dropdown-trigger[href="#oferta"]',
        );
        const active = document.activeElement;
        const insideDd =
          ddMenuLive &&
          ddTrigLive &&
          (ddMenuLive.contains(active) || ddTrigLive.contains(active));
        if (!insideDd) {
          setOpen(false);
          return;
        }
      }
      if (e.key === "Tab") {
        const focusables = menu.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    { signal },
  );

  const ddTrigger = document.querySelector('.dropdown-trigger[href="#oferta"]');
  const ddMenu = document.querySelector("#dd-oferta");

  if (ddTrigger && ddMenu) {
    let ddOpen = ddMenu.classList.contains("open");
    const mqDesktop = window.matchMedia("(min-width: 992px)");
    const parentLi =
      ddTrigger.closest(".has-dropdown") || ddTrigger.parentElement;
    ddTrigger.setAttribute("aria-expanded", String(ddOpen));
    ddTrigger.setAttribute("aria-haspopup", "true");
    if (!ddTrigger.getAttribute("aria-controls"))
      ddTrigger.setAttribute("aria-controls", "dd-oferta");
    const focusFirstItem = () => {
      ddMenu
        .querySelector('a, button, [tabindex]:not([tabindex="-1"])')
        ?.focus({ preventScroll: true });
    };

    const setDd = (open, { returnFocus = false, focusFirst = false } = {}) => {
      ddMenu.classList.toggle("open", open);
      ddTrigger.setAttribute("aria-expanded", String(open));
      ddOpen = open;
      if (open && focusFirst) focusFirstItem();
      else if (!open && returnFocus) ddTrigger.focus({ preventScroll: true });
    };
    if (parentLi) {
      parentLi.addEventListener(
        "mouseenter",
        () => {
          if (mqDesktop.matches) setDd(true);
        },
        { signal },
      );
      parentLi.addEventListener(
        "mouseleave",
        () => {
          if (mqDesktop.matches) setDd(false);
        },
        { signal },
      );
    }

    const openMobileOnce = () => {
      const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
      if (!isMobile) return false;
      if (!ddOpen) {
        setDd(true, { focusFirst: true });
        return true;
      }
      return false;
    };

    ddTrigger.addEventListener(
      "click",
      (e) => {
        if (openMobileOnce()) e.preventDefault();
      },
      { signal },
    );

    ddTrigger.addEventListener(
      "keydown",
      (e) => {
        const isEnter = e.key === "Enter";
        const isSpace = e.key === " " || e.code === "Space";
        if (!(isEnter || isSpace)) return;
        if (openMobileOnce()) e.preventDefault();
      },
      { signal },
    );

    document.addEventListener(
      OUTSIDE_EVT,
      (e) => {
        if (
          ddOpen &&
          !ddMenu.contains(e.target) &&
          !ddTrigger.contains(e.target)
        ) {
          setDd(false, { returnFocus: false });
        }
      },
      { capture: true, passive: true, signal },
    );

    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Escape" || !ddOpen) return;
        const active = document.activeElement;
        const inside =
          active && (ddMenu.contains(active) || ddTrigger.contains(active));
        if (inside) {
          e.preventDefault();
          setDd(false, { returnFocus: true });
        }
      },
      { signal },
    );

    toggle.addEventListener(
      "click",
      () => {
        const willClose = menu.classList.contains("open");
        if (willClose) setDd(false);
      },
      { signal },
    );

    const onMqChange = () => setDd(false);
    if (mqDesktop.addEventListener)
      mqDesktop.addEventListener("change", onMqChange, { signal });
    else mqDesktop.addListener(onMqChange);
  }
}

/* === 02 - ScrollSpy === */

function initScrollSpy() {
  if (initScrollSpy._abort) initScrollSpy._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;

  initScrollSpy._abort = ac;

  const html = document.documentElement;
  const headerEl = document.querySelector(".site-header");
  const navMenu = document.getElementById("navMenu");
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];

  if (!navLinks.length) return;

  const PEEK = 12;
  const mapHref = (href) => (href === "#top" ? "#strona-glowna" : href);
  const targetsFromMenu = navLinks
    .map((a) => mapHref(a.getAttribute("href")))
    .filter((href) => href && href.startsWith("#") && href.length > 1);
  const extraTargets = [];

  if (document.querySelector("#oferta")) extraTargets.push("#oferta");

  const sections = [...new Set([...targetsFromMenu, ...extraTargets])]
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);

  if (!sections.length) return;

  const getHeaderLive = () =>
    headerEl ? Math.round(headerEl.getBoundingClientRect().height) : 0;
  const getOffset = () =>
    (typeof utils?.getHeaderH === "function"
      ? utils.getHeaderH()
      : getHeaderLive()) + PEEK;
  const isMenuOpen = () => {
    return (
      (navMenu && navMenu.classList.contains("open")) ||
      html.classList.contains("is-nav-open") ||
      document.body.classList.contains("nav-open") ||
      document.documentElement.classList.contains("nav-open") ||
      (headerEl && headerEl.classList.contains("open"))
    );
  };

  const applyScrollMargin = () => {
    const OFFSET = getOffset();
    const token = String(OFFSET);
    sections.forEach((sec) => {
      if (sec.dataset.appliedScrollMargin !== token) {
        sec.style.scrollMarginTop = OFFSET + "px";
        sec.dataset.appliedScrollMargin = token;
      }
    });
  };

  let lastId = sections[0].id;
  const setActive = (id) => {
    lastId = id;
    navLinks.forEach((a) => {
      const href = mapHref(a.getAttribute("href"));
      const match = href === "#" + id;
      a.classList.toggle("is-active", match);
      if (match) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    const ofertaTrigger = document.querySelector(
      '.dropdown-trigger[aria-controls="dd-oferta"]',
    );
    if (ofertaTrigger) {
      const isOfertaCtx = id === "oferta" || id.startsWith("oferta-");
      ofertaTrigger.classList.toggle("is-active", isOfertaCtx);
      if (isOfertaCtx) ofertaTrigger.setAttribute("aria-current", "true");
      else ofertaTrigger.removeAttribute("aria-current");
    }
  };

  const pickCurrent = () => {
    const OFFSET = getOffset();
    const probeY = OFFSET + 1;
    const candidates = sections.filter((sec) => {
      const r = sec.getBoundingClientRect();
      return r.top <= probeY && r.bottom > probeY;
    });
    if (candidates.length) return candidates[candidates.length - 1].id;

    let currentId = sections[0].id;
    let bestTop = -Infinity;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top - OFFSET;
      if (top <= 0 && top > bestTop) {
        bestTop = top;
        currentId = sec.id;
      }
    }
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2
    ) {
      currentId = sections[sections.length - 1].id;
    }
    return currentId;
  };

  const compute = () => {
    if (isMenuOpen()) return;
    const id = pickCurrent();
    if (id !== lastId) setActive(id);
  };

  let scrollTimeout = 0;
  const scheduleComputeAfterScroll = () => {
    if ("onscrollend" in window) {
      const once = () => {
        compute();
        window.removeEventListener("scrollend", once);
      };
      window.addEventListener("scrollend", once, { signal });
    } else {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(compute, 120);
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (isMenuOpen()) return;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        compute();
      });
    }
    scheduleComputeAfterScroll();
  };
  window.addEventListener("scroll", onScroll, { passive: true, signal });

  let raf = 0;
  const onResize = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      applyScrollMargin();
      compute();
    });
  };
  window.addEventListener("resize", onResize, { passive: true, signal });
  window.addEventListener("nav:toggle", onResize, { signal });

  const prefersNoAnim = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const behavior = prefersNoAnim ? "auto" : "smooth";

  navLinks.forEach((a) => {
    a.addEventListener(
      "click",
      (e) => {
        const raw = a.getAttribute("href") || "";
        const href = mapHref(raw);
        if (!href.startsWith("#")) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        navMenu?.classList.remove("open");
        headerEl?.classList.remove("open");
        html.classList.remove("is-nav-open");
        document.body.classList.remove("nav-open");
        document.documentElement.classList.remove("nav-open");
        window.dispatchEvent(
          new CustomEvent("nav:toggle", { detail: { open: false } }),
        );
        setActive(target.id);
        const OFFSET = getOffset();
        const targetY = Math.max(
          0,
          window.scrollY + target.getBoundingClientRect().top - OFFSET,
        );
        window.scrollTo({ top: targetY, behavior });
        if (history.pushState) history.pushState(null, "", href);
        else location.hash = href;
        scheduleComputeAfterScroll();
      },
      { signal },
    );
  });

  if (navMenu) {
    const mo = new MutationObserver(() => {
      if (!isMenuOpen()) scheduleComputeAfterScroll();
    });
    mo.observe(navMenu, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("pagehide", () => mo.disconnect(), {
      once: true,
      signal,
    });
  }

  applyScrollMargin();
  compute();
}

/* === 03 - Footer Year === */

function initFooterYear() {
  const el = document.getElementById("year");
  if (!el) return;
  const yearNow = String(new Date().getFullYear());
  const start = el.getAttribute("data-year-start");
  if (start && /^\d{4}$/.test(start) && start < yearNow) {
    const desired = `${start}–${yearNow}`;
    if (el.textContent !== desired) el.textContent = desired;
    return;
  }
  if (el.textContent !== yearNow) el.textContent = yearNow;
}

/* === 04 - Scroll to Top === */

function initSmoothTop() {
  if (initSmoothTop._abort) initSmoothTop._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initSmoothTop._abort = ac;
  const prefersNoAnim = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const behavior = prefersNoAnim ? "auto" : "smooth";
  const isVisible = (el) =>
    !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
  const getFocusTarget = () => {
    const main =
      document.querySelector("#main") ||
      document.querySelector("main") ||
      document.querySelector(".main");
    if (main && main.getAttribute("aria-hidden") !== "true" && isVisible(main))
      return main;
    const heading = Array.from(document.querySelectorAll("h1")).find(
      (el) => el.getAttribute("aria-hidden") !== "true" && isVisible(el),
    );
    if (heading) return heading;
    const container =
      document.querySelector('[role="main"]') ||
      document.querySelector("[data-page]");
    if (container && container.getAttribute("aria-hidden") !== "true") {
      return container;
    }
    return document.body;
  };
  const focusTarget = () => {
    const target = getFocusTarget();
    if (!target || typeof target.focus !== "function") return;
    const hadTabindex = target.hasAttribute("tabindex");
    if (!hadTabindex) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (!hadTabindex) target.removeAttribute("tabindex");
  };
  const isPrimaryClick = (e) =>
    e.button === 0 &&
    !e.defaultPrevented &&
    !e.metaKey &&
    !e.ctrlKey &&
    !e.shiftKey &&
    !e.altKey;
  document.addEventListener(
    "click",
    (e) => {
      const el = e.target.closest(
        'a[href="#top"], .scroll-top, [data-scroll="top"]',
      );
      if (!el) return;
      if (!isPrimaryClick(e)) return;
      if (
        el.getAttribute &&
        (el.getAttribute("target") === "_blank" || el.hasAttribute("download"))
      )
        return;
      e.preventDefault();
      window.scrollTo({ top: 0, behavior });
      focusTarget();
      if (history.pushState) history.pushState(null, "", "#top");
      else location.hash = "#top";
    },
    { signal },
  );
}

/* === 05 - Scroll Reveal === */

function initScrollReveal() {
  if (initScrollReveal._abort) initScrollReveal._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initScrollReveal._abort = ac;
  const prefersReduced = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!items.length) return;
  if (prefersReduced) {
    items.forEach((el) => el.classList.add("is-revealed"));
    return;
  }
  const applyDelay = (el) => {
    const ms = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
    if (Number.isFinite(ms) && ms > 0) el.style.transitionDelay = `${ms}ms`;
  };
  const onceByDefault = true;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const revealOnceAttr = el.getAttribute("data-reveal-once");
        const revealOnce =
          revealOnceAttr == null ? true : revealOnceAttr !== "false";
        if (entry.isIntersecting) {
          if (!el.classList.contains("is-revealed")) {
            applyDelay(el);
            requestAnimationFrame(() => el.classList.add("is-revealed"));
          }
          if (revealOnce) io.unobserve(el);
        } else if (!revealOnce) {
          el.classList.remove("is-revealed");
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -15% 0px",
      threshold: 0.14,
    },
  );
  items.forEach((el) => io.observe(el));
  window.addEventListener("pagehide", () => io.disconnect(), {
    once: true,
    signal,
  });
}

/* === 06 - Contact Form === */

function initContactForm() {
  if (initContactForm._abort) initContactForm._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initContactForm._abort = ac;
  const form = document.querySelector("section#kontakt .form");
  if (!form) return;
  const note = form.querySelector(".form-note");
  const btnSubmit = form.querySelector('button[type="submit"]');
  const hpInput = form.querySelector('input[name="bot-field"]');
  const nameInput = form.querySelector("#f-name");
  const phoneInput = form.querySelector("#f-phone");
  const msgInput = form.querySelector("#f-msg");
  const consentInput = form.querySelector("#f-consent");
  const isDev = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (note) {
    note.setAttribute("role", "status");
    note.setAttribute("aria-atomic", "true");
    note.setAttribute("aria-live", "polite");
    if (!note.hasAttribute("tabindex")) note.setAttribute("tabindex", "-1");
  }
  if (hpInput) {
    const wrap = hpInput.closest("label, div") || hpInput;
    Object.assign(wrap.style, {
      position: "absolute",
      left: "-9999px",
      width: "1px",
      height: "1px",
      overflow: "hidden",
    });
    wrap.setAttribute("aria-hidden", "true");
    hpInput.setAttribute("tabindex", "-1");
    hpInput.setAttribute("autocomplete", "off");
  }

  const startedAt = Date.now();
  const isTooFast = () => Date.now() - startedAt < 2000;
  const looksSpammy = (text) => {
    const t = String(text || "").toLowerCase();
    const links = (t.match(/https?:\/\//g) || []).length;
    return links >= 2 || /viagra|bitcoin|casino/.test(t);
  };

  const setBusy = (busy) => {
    form.setAttribute("aria-busy", busy ? "true" : "false");
    if (btnSubmit) btnSubmit.disabled = !!busy;
  };

  const showNote = (msg, ok = false) => {
    if (!note) return;
    note.textContent = msg || "";
    note.classList.toggle("is-ok", !!ok);
    note.classList.toggle("is-err", !ok && !!msg);
  };

  const encodeForm = (formEl) =>
    new URLSearchParams(new FormData(formEl)).toString();

  const errSpan = (el) => {
    const ids = (el.getAttribute("aria-describedby") || "").split(/\s+/);
    const id = ids.find((x) => x.endsWith("-error"));
    return id ? document.getElementById(id) : null;
  };

  const setFieldError = (el, msg) => {
    if (!el) return;
    el.setAttribute("aria-invalid", "true");
    el.setCustomValidity(msg || "");
    const span = errSpan(el);
    if (span) {
      span.textContent = msg || "";
      span.classList.toggle("visually-hidden", !msg);
    }
  };

  const clearFieldError = (el) => {
    if (!el) return;
    el.removeAttribute("aria-invalid");
    el.setCustomValidity("");
    const span = errSpan(el);
    if (span) {
      span.textContent = "";
      span.classList.add("visually-hidden");
    }
  };

  const formatPLPhone = (raw) => {
    raw = String(raw || "");
    const hasPlus48 = raw.trim().startsWith("+48");
    let digits = raw.replace(/\D/g, "");
    let prefix = "";
    if (hasPlus48) {
      if (digits.startsWith("48")) digits = digits.slice(2);
      prefix = "+48 ";
    }
    digits = digits.slice(0, 9);
    const g1 = digits.slice(0, 3);
    const g2 = digits.slice(3, 6);
    const g3 = digits.slice(6, 9);
    const grouped = [g1, g2, g3].filter(Boolean).join(" ");
    return (prefix + grouped).trim();
  };

  const isValidPLPhone = (val) => {
    const digits = String(val || "").replace(/\D/g, "");
    if (digits.length === 9) return true;
    if (digits.length === 11 && digits.startsWith("48")) return true;
    return false;
  };

  const applyPhoneMask = () => {
    if (!phoneInput) return;
    const active = document.activeElement === phoneInput;
    const before = phoneInput.value;
    const after = formatPLPhone(before);
    if (after !== before) {
      phoneInput.value = after;
      if (active && phoneInput.setSelectionRange) {
        phoneInput.setSelectionRange(after.length, after.length);
      }
    }
  };
  form.addEventListener(
    "input",
    (e) => {
      const t = e.target;
      if (note?.textContent) showNote("", true);
      if (t.matches("input, textarea")) clearFieldError(t);

      if (t === phoneInput) {
        applyPhoneMask();
        const raw = phoneInput.value.trim();
        if (raw === "" || isValidPLPhone(raw)) clearFieldError(phoneInput);
      }
    },
    { signal },
  );
  phoneInput?.addEventListener(
    "paste",
    () => requestAnimationFrame(applyPhoneMask),
    { signal },
  );
  phoneInput?.addEventListener("blur", applyPhoneMask, { signal });
  form.addEventListener(
    "blur",
    (e) => {
      const t = e.target;
      if (t.matches('input[type="text"], textarea')) t.value = t.value.trim();
    },
    true,
    { signal },
  );
  form.addEventListener(
    "reset",
    () => {
      showNote("", true);
      form
        .querySelectorAll('[aria-invalid="true"]')
        .forEach((el) => clearFieldError(el));
    },
    { signal },
  );

  let submitting = false;
  form.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      if (submitting) return;

      if (
        (hpInput && hpInput.value.trim() !== "") ||
        isTooFast() ||
        looksSpammy(msgInput?.value)
      ) {
        form.reset();
        return;
      }
      if (!form.checkValidity()) {
        if (nameInput && nameInput.validity.valueMissing) {
          setFieldError(nameInput, "Podaj imię i nazwisko (min. 2 znaki).");
        } else if (nameInput && nameInput.validity.tooShort) {
          setFieldError(
            nameInput,
            "Imię i nazwisko powinno mieć co najmniej 2 znaki.",
          );
        }
        if (phoneInput && phoneInput.validity.valueMissing) {
          setFieldError(phoneInput, "Podaj numer telefonu.");
        }
        if (msgInput && msgInput.validity.valueMissing) {
          setFieldError(msgInput, "Napisz krótki opis prac.");
        } else if (msgInput && msgInput.validity.tooLong) {
          setFieldError(msgInput, "Opis może mieć maksymalnie 1000 znaków.");
        }
        if (consentInput && !consentInput.checked) {
          setFieldError(
            consentInput,
            "Wymagana zgoda na kontakt w celu wyceny.",
          );
        }
        form.reportValidity();
        form
          .querySelector(':invalid, [aria-invalid="true"]')
          ?.focus({ preventScroll: true });
        showNote("Uzupełnij poprawnie wszystkie pola i zaznacz zgodę.", false);
        return;
      }

      if (phoneInput) {
        applyPhoneMask();
        const raw = phoneInput.value.trim();
        if (!isValidPLPhone(raw)) {
          setFieldError(
            phoneInput,
            "Podaj poprawny numer (np. 533 537 091 lub +48 533 537 091).",
          );
          form.reportValidity();
          phoneInput.focus({ preventScroll: true });
          showNote("Sprawdź format numeru telefonu.", false);
          return;
        }
        clearFieldError(phoneInput);
      }

      submitting = true;
      setBusy(true);
      showNote("Wysyłanie…", true);

      const submitUrl = form.getAttribute("action") || "/";
      const timeoutMs = 10000;
      const fetchController = new AbortController();
      const timeoutId = window.setTimeout(
        () => fetchController.abort(),
        timeoutMs,
      );

      try {
        const response = await fetch(submitUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encodeForm(form),
          signal: fetchController.signal,
        });

        if (!response.ok) {
          throw new Error(`Form submit failed: ${response.status}`);
        }

        form
          .querySelectorAll('[aria-invalid="true"]')
          .forEach((el) => el.removeAttribute("aria-invalid"));
        form.reset();
        showNote("Dziękujemy! Skontaktujemy się wkrótce.", true);
        note?.focus?.();
      } catch (err) {
        if (isDev) console.error(err);
        const message = fetchController.signal.aborted
          ? "Przekroczono limit czasu. Spróbuj ponownie."
          : "Nie udało się wysłać formularza. Spróbuj ponownie.";
        showNote(message, false);
      } finally {
        window.clearTimeout(timeoutId);
        setBusy(false);
        submitting = false;
      }
    },
    { signal },
  );
}

/* === 07 - Header Shrink === */

function initHeaderShrink() {
  if (initHeaderShrink._abort) initHeaderShrink._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initHeaderShrink._abort = ac;
  const header = document.querySelector('.site-header, header[role="banner"]');
  if (!header) return;
  const ENTER = 16;
  const EXIT = 4;
  let isShrink = false;
  let rafScroll = 0;
  const measureHeader = () => Math.round(header.getBoundingClientRect().height);
  const syncVar = () => {
    const h = measureHeader();
    document.documentElement.style.setProperty("--header-h", `${h}px`);
    if (window.utils?.refreshHeaderH) window.utils.refreshHeaderH();
    window.dispatchEvent(
      new CustomEvent("header:sync", { detail: { height: h } }),
    );
    return h;
  };

  const applyShrink = (want) => {
    if (want === isShrink) {
      requestAnimationFrame(syncVar);
      return;
    }
    isShrink = want;
    header.classList.toggle("is-shrink", isShrink);
    requestAnimationFrame(syncVar);
  };

  const onScroll = () => {
    if (rafScroll) return;
    rafScroll = requestAnimationFrame(() => {
      rafScroll = 0;
      const y = window.scrollY || 0;
      if (!isShrink && y > ENTER) applyShrink(true);
      else if (isShrink && y < EXIT) applyShrink(false);
    });
  };

  const ro = new ResizeObserver(() => {
    requestAnimationFrame(syncVar);
  });
  ro.observe(header);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => requestAnimationFrame(syncVar))
      .catch(() => {});
  }
  window.addEventListener("nav:toggle", () => requestAnimationFrame(syncVar), {
    signal,
  });

  window.addEventListener("pageshow", () => requestAnimationFrame(syncVar), {
    signal,
  });

  document.addEventListener(
    "visibilitychange",
    () => {
      if (!document.hidden) requestAnimationFrame(syncVar);
    },
    { signal },
  );

  window.addEventListener("scroll", onScroll, { passive: true, signal });
  window.addEventListener("resize", () => requestAnimationFrame(syncVar), {
    passive: true,
    signal,
  });

  signal.addEventListener("abort", () => {
    try {
      ro.disconnect();
    } catch {}
  });
  syncVar();
  onScroll();
}

/* === 08 - Theme Toggle === */

function initThemeToggle() {
  if (initThemeToggle._abort) initThemeToggle._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initThemeToggle._abort = ac;
  const btn = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  if (!btn || !root) return;
  const KEY = "theme";
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  const safeGet = (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };

  const safeSet = (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  };

  const nextOf = (mode) => (mode === "dark" ? "light" : "dark");

  const syncThemeToggleState = () => {
    const current =
      root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    btn.setAttribute("aria-pressed", String(current === "dark"));
  };

  const apply = (mode, { persist = false, silent = false } = {}) => {
    const normalized = mode === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", normalized);
    btn.setAttribute("data-theme-state", normalized);
    syncThemeToggleState();
    const label =
      `Tryb: ${normalized === "dark" ? "ciemny" : "jasny"}. ` +
      (normalized === "dark"
        ? "Przełącz na jasny tryb"
        : "Przełącz na ciemny tryb");
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
    if (persist) safeSet(KEY, normalized);
    if (!silent) {
      window.dispatchEvent(
        new CustomEvent("theme:change", { detail: { theme: normalized } }),
      );
    }
  };

  const saved = safeGet(KEY);
  const start =
    saved === "light" || saved === "dark"
      ? saved
      : mq && mq.matches
        ? "dark"
        : "light";
  apply(start, {
    persist: saved === "light" || saved === "dark",
    silent: true,
  });
  syncThemeToggleState();

  btn.addEventListener(
    "click",
    () => {
      const current =
        root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = nextOf(current);
      apply(next, { persist: true });
    },
    { signal },
  );

  window.addEventListener(
    "storage",
    (e) => {
      if (e.key !== KEY) return;
      const v = e.newValue;
      if (v === "dark" || v === "light") apply(v, { persist: false });
    },
    { signal },
  );

  initThemeToggle.set = (mode) => {
    apply(mode === "dark" ? "dark" : "light", { persist: true });
  };
}

/* === 09 - CTA ripple === */

function initRipple() {
  if (initRipple._abort) initRipple._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initRipple._abort = ac;
  const btn = document.querySelector(".nav-menu li > a.btn.btn--sm");
  if (!btn) return;
  const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const prefersReduced = !!mql && mql.matches;
  if (prefersReduced) return;
  const cs = getComputedStyle(btn);
  if (cs.position === "static") btn.style.position = "relative";
  if (cs.overflow !== "hidden") btn.style.overflow = "hidden";
  const computeDiameter = (rect, x, y) => {
    const dx1 = x - rect.left;
    const dy1 = y - rect.top;
    const dx2 = rect.right - x;
    const dy2 = rect.bottom - y;
    const maxDist = Math.max(
      Math.hypot(dx1, dy1),
      Math.hypot(dx1, dy2),
      Math.hypot(dx2, dy1),
      Math.hypot(dx2, dy2),
    );
    return Math.ceil(maxDist * 2);
  };

  const spawn = (x, y) => {
    const rect = btn.getBoundingClientRect();
    const d = computeDiameter(rect, x, y);
    btn.querySelector(".ripple")?.remove();
    const ink = document.createElement("span");
    ink.className = "ripple";
    ink.style.width = ink.style.height = `${d}px`;
    ink.style.left = `${x - rect.left - d / 2}px`;
    ink.style.top = `${y - rect.top - d / 2}px`;
    btn.appendChild(ink);
    const cleanup = () => ink.remove();
    ink.addEventListener("animationend", cleanup, { once: true, signal });
    setTimeout(() => ink.isConnected && cleanup(), 1200);
  };

  const isPrimary = (e) =>
    e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  btn.addEventListener(
    "pointerdown",
    (e) => {
      if (!isPrimary(e)) return;
      spawn(e.clientX, e.clientY);
    },
    { signal },
  );

  btn.addEventListener(
    "keydown",
    (e) => {
      const isEnter = e.key === "Enter";
      const isSpace = e.key === " " || e.code === "Space";
      if (!isEnter && !isSpace) return;
      const rect = btn.getBoundingClientRect();
      spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (isSpace) {
        e.preventDefault();
        btn.click();
      }
    },
    { signal },
  );

  if (mql?.addEventListener) {
    mql.addEventListener(
      "change",
      (e) => {
        if (e.matches) initRipple._abort?.abort();
      },
      { signal },
    );
  }
}

/* === 10 - Hero blur === */

function initHeroBlurSync() {
  if (initHeroBlurSync._abort) initHeroBlurSync._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initHeroBlurSync._abort = ac;
  const img = document.querySelector(".hero-bg img");
  const blur = document.querySelector(".hero__bg-blur");
  if (!img || !blur) return;
  const pic = img.closest("picture") || null;
  let rafId = 0;
  let debTimer = 0;
  let lastBg = "";
  const setBg = (url) => {
    const want = `url("${url}")`;
    if (want !== lastBg) {
      blur.style.backgroundImage = want;
      lastBg = want;
      window.dispatchEvent(
        new CustomEvent("hero:blurSync", { detail: { url } }),
      );
    }
  };

  const pickCurrentUrl = () => img.currentSrc || img.src || "";
  const sync = () => {
    if (!img.isConnected || !blur.isConnected) return;
    const url = pickCurrentUrl();
    if (url) setBg(url);
  };

  const syncNextFrame = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(sync);
  };

  const syncDebounced = (ms = 150) => {
    clearTimeout(debTimer);
    debTimer = setTimeout(sync, ms);
  };

  img.addEventListener("load", syncNextFrame, { signal });

  window.addEventListener("resize", () => syncDebounced(120), {
    passive: true,
    signal,
  });

  window.addEventListener("orientationchange", syncNextFrame, { signal });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "visible") syncNextFrame();
    },
    { signal },
  );

  const mqlColor = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (mqlColor?.addEventListener) {
    mqlColor.addEventListener("change", syncNextFrame, { signal });
  } else if (mqlColor?.addListener && !mqlColor.addEventListener) {
    mqlColor.addListener(syncNextFrame);
    signal.addEventListener("abort", () =>
      mqlColor.removeListener(syncNextFrame),
    );
  }

  const moAttrs = ["src", "srcset", "sizes", "media"];
  const mo = new MutationObserver(syncNextFrame);
  mo.observe(img, { attributes: true, attributeFilter: moAttrs });
  if (pic) {
    pic.querySelectorAll("source").forEach((s) => {
      mo.observe(s, { attributes: true, attributeFilter: moAttrs });
    });
    const moChild = new MutationObserver(syncNextFrame);
    moChild.observe(pic, { childList: true, subtree: true });
    signal.addEventListener("abort", () => moChild.disconnect());
  }

  window.addEventListener(
    "pagehide",
    () => {
      try {
        mo.disconnect();
      } catch {}
      cancelAnimationFrame(rafId);
      clearTimeout(debTimer);
    },
    { once: true, signal },
  );

  if (document.readyState === "complete") sync();
  else window.addEventListener("load", sync, { once: true, signal });
  syncNextFrame();
}

/* === 11 - Lightbox === */

function initOfertaLightbox() {
  if (initOfertaLightbox._abort) initOfertaLightbox._abort.abort();

  const ac = new AbortController();
  const { signal } = ac;
  initOfertaLightbox._abort = ac;

  const thumbs = Array.from(
    document.querySelectorAll(
      "#oferta .card picture img, .gallery .gallery-item picture img",
    ),
  );

  if (!thumbs.length) return;

  const $ = (t) => document.createElement(t);

  const html = document.documentElement;
  const main =
    document.getElementById("main") || document.querySelector("main");
  const header = document.querySelector(".site-header");

  let backdrop = document.querySelector(".lb-backdrop");
  let wrap = document.querySelector(".lb-wrap");
  let viewport, img, btnClose, btnPrev, btnNext;

  if (!backdrop || !wrap) {
    backdrop = $("div");
    backdrop.className = "lb-backdrop";

    wrap = $("div");
    wrap.className = "lb-wrap";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "Podgląd zdjęcia");
    wrap.tabIndex = -1;

    viewport = $("div");
    viewport.className = "lb-viewport";

    img = new Image();
    img.alt = "";
    img.decoding = "async";

    viewport.appendChild(img);
    wrap.appendChild(viewport);

    const mkBtn = (cls, label, svg) => {
      const b = $("button");
      b.type = "button";
      b.className = `lb-btn ${cls}`;
      b.setAttribute("aria-label", label);
      b.innerHTML = svg;
      return b;
    };

    const svgX =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"/></svg>';

    const svgL =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.7 5.3a1 1 0 0 1 0 1.4L11.4 11l4.3 4.3a 1 1 0 1 1-1.4 1.4l-5-5a 1 1 0 0 1 0-1.4l5-5a 1 1 0 0 1 1.4 0z"/></svg>';

    const svgR =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 5.3a 1 1 0 0 0 0 1.4L12.6 11l-4.3 4.3a 1 1 0 1 0 1.4 1.4l5-5a 1 1 0 0 0 0-1.4l-5-5a 1 1 0 0 0-1.4 0z"/></svg>';

    btnClose = mkBtn("lb-close", "Zamknij podgląd", svgX);
    btnPrev = mkBtn("lb-prev", "Poprzednie zdjęcie", svgL);
    btnNext = mkBtn("lb-next", "Następne zdjęcie", svgR);

    document.body.append(backdrop, wrap, btnClose, btnPrev, btnNext);
  } else {
    viewport = wrap.querySelector(".lb-viewport") || $("div");
    img = wrap.querySelector("img") || new Image();

    btnClose = document.querySelector(".lb-btn.lb-close");
    btnPrev = document.querySelector(".lb-btn.lb-prev");
    btnNext = document.querySelector(".lb-btn.lb-next");
  }

  const parseSrcset = (ss) => {
    if (!ss) return [];

    return ss
      .split(",")
      .map((s) => s.trim())
      .map((s) => {
        const m = s.match(/(.+)\s+(\d+)w$/);
        return m
          ? { url: m[1], w: parseInt(m[2], 10) }
          : { url: s.split(" ")[0], w: 0 };
      })
      .sort((a, b) => b.w - a.w);
  };

  const bestUrlFor = (el) => {
    let best = parseSrcset(el.getAttribute("srcset"))[0]?.url;

    if (!best) {
      const pic = el.closest("picture");

      if (pic) {
        const candidates = [];

        pic.querySelectorAll("source").forEach((s) => {
          candidates.push(...parseSrcset(s.getAttribute("srcset")));
        });

        candidates.sort((a, b) => b.w - a.w);
        best = candidates[0]?.url || null;
      }
    }

    return best || el.currentSrc || el.src || "";
  };

  const preload = (i) => {
    if (i < 0 || i >= thumbs.length) return;

    const url = bestUrlFor(thumbs[i]);

    if (!url) return;

    const tmp = new Image();
    tmp.src = url;
  };

  let index = 0;
  let isOpen = false;
  let lastFocus = null;

  const applyImage = () => {
    const el = thumbs[index];
    const url = bestUrlFor(el);

    if (!url) return;

    img.src = url;
    img.alt = el.getAttribute("alt") || "";

    preload((index + 1) % thumbs.length);
    preload((index - 1 + thumbs.length) % thumbs.length);
  };

  const focusables = () => [btnClose, btnPrev, btnNext].filter(Boolean);

  const setOpen = (open) => {
    isOpen = open;

    backdrop.classList.toggle("is-open", open);
    wrap.classList.toggle("is-open", open);
    btnClose.classList.toggle("is-open", open);
    btnPrev.classList.toggle("is-open", open);
    btnNext.classList.toggle("is-open", open);

    html.classList.toggle("lb-no-scroll", open);
    wrap.setAttribute("aria-hidden", open ? "false" : "true");

    try {
      if (main && "inert" in main) main.inert = open;
      if (header && "inert" in header) header.inert = open;
    } catch {}

    if (open) {
      lastFocus = document.activeElement;

      applyImage();

      const multi = thumbs.length > 1;
      btnPrev.style.display = multi ? "grid" : "none";
      btnNext.style.display = multi ? "grid" : "none";

      (btnClose || wrap).focus({ preventScroll: true });
      return;
    }

    img.src = "";
    img.alt = "";

    btnPrev.style.display = "none";
    btnNext.style.display = "none";

    lastFocus?.focus?.({ preventScroll: true });
    lastFocus = null;

    if (document.fullscreenElement) document.exitFullscreen?.();
  };

  const prev = () => {
    if (thumbs.length < 2) return;

    index = (index - 1 + thumbs.length) % thumbs.length;
    applyImage();
  };

  const next = () => {
    if (thumbs.length < 2) return;

    index = (index + 1) % thumbs.length;
    applyImage();
  };

  thumbs.forEach((el, i) => {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Powiększ zdjęcie");

    el.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        index = i;
        setOpen(true);
      },
      { signal },
    );

    el.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Enter" || e.key === " " || e.code === "Space") {
          e.preventDefault();
          index = i;
          setOpen(true);
        }
      },
      { signal },
    );
  });

  btnClose?.addEventListener("click", () => setOpen(false), { signal });
  btnPrev?.addEventListener("click", prev, { signal });
  btnNext?.addEventListener("click", next, { signal });

  backdrop.addEventListener("click", () => setOpen(false), { signal });

  document.addEventListener(
    "keydown",
    (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (e.key === "ArrowLeft") {
        prev();
        return;
      }

      if (e.key === "ArrowRight") {
        next();
        return;
      }

      if (e.key !== "Tab") return;

      const list = focusables();
      if (!list.length) return;

      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    { signal },
  );

  let sx = 0;
  let sy = 0;
  let moved = false;

  const onStart = (e) => {
    const t = e.changedTouches?.[0];
    if (!t) return;

    sx = t.clientX;
    sy = t.clientY;
    moved = false;
  };

  const onMove = () => {
    moved = true;
  };

  const onEnd = (e) => {
    if (!moved) return;

    const t = e.changedTouches?.[0];
    if (!t) return;

    const dx = t.clientX - sx;
    const dy = t.clientY - sy;

    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev();
    }
  };

  const viewportEl = wrap.querySelector(".lb-viewport") || wrap;

  viewportEl.addEventListener("touchstart", onStart, { passive: true, signal });
  viewportEl.addEventListener("touchmove", onMove, { passive: true, signal });
  viewportEl.addEventListener("touchend", onEnd, { passive: true, signal });

  let lastTap = 0;

  const toggleFs = () => {
    const target = img || viewportEl;
    if (!target) return;

    if (!document.fullscreenElement) {
      (
        target.requestFullscreen ||
        target.webkitRequestFullscreen ||
        target.msRequestFullscreen
      )?.call(target);
      return;
    }

    document.exitFullscreen?.();
  };

  viewportEl.addEventListener(
    "dblclick",
    () => {
      if (!isOpen) return;
      toggleFs();
    },
    { signal },
  );

  viewportEl.addEventListener(
    "touchend",
    (e) => {
      if (!isOpen) return;

      const now = Date.now();

      if (now - lastTap < 350) {
        e.preventDefault();
        toggleFs();
      }

      lastTap = now;
    },
    { passive: true, signal },
  );

  window.addEventListener("pagehide", () => ac.abort(), { once: true, signal });
}

/* === 12 - Prefetch === */

function initOfferPrefetch() {
  if (initOfferPrefetch._abort) initOfferPrefetch._abort.abort();
  const ac = new AbortController();
  const { signal } = ac;
  initOfferPrefetch._abort = ac;
  const canPrefetch = () => {
    const n = navigator;
    const c = n && "connection" in n ? n.connection : null;
    if (c?.saveData) return false;
    const et = (c?.effectiveType || "").toLowerCase();
    if (et.includes("2g") || et === "slow-2g") return false;
    return true;
  };
  if (!canPrefetch()) return;
  const links = Array.from(
    document.querySelectorAll(
      '.services-track h3 a[href^="oferta/"], #oferta .card h3 a[href^="oferta/"]',
    ),
  );
  if (!links.length) return;
  const prefetched = new Set();
  const timers = new WeakMap();
  const isSameOriginHttp = (href) => {
    try {
      const u = new URL(href, location.href);
      return (
        (u.protocol === "http:" || u.protocol === "https:") &&
        u.origin === location.origin
      );
    } catch {
      return false;
    }
  };

  const injectPrefetch = (href) => {
    if (!isSameOriginHttp(href)) return;
    if (prefetched.has(href)) return;
    if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
      prefetched.add(href);
      return;
    }
    const l = document.createElement("link");
    l.rel = "prefetch";
    l.href = href;
    document.head.appendChild(l);
    prefetched.add(href);
  };

  const schedule = (a) => {
    clear(a);
    const id = setTimeout(() => injectPrefetch(a.href), 120);
    timers.set(a, id);
  };

  const clear = (a) => {
    const id = timers.get(a);
    if (id) {
      clearTimeout(id);
      timers.delete(a);
    }
  };

  links.forEach((a) => {
    a.addEventListener("mouseenter", () => schedule(a), { signal });
    a.addEventListener("mouseleave", () => clear(a), { signal });
    a.addEventListener("focus", () => schedule(a), { signal });
    a.addEventListener("blur", () => clear(a), { signal });
    a.addEventListener("touchstart", () => injectPrefetch(a.href), {
      passive: true,
      once: true,
      signal,
    });
  });
  window.addEventListener("pagehide", () => ac.abort(), { once: true, signal });
}

/* === 13 - Home helpers === */

function initHomeHelpers() {
  // Reset previous listeners (if re-initialized)
  if (initHomeHelpers._abort) initHomeHelpers._abort.abort();

  const ac = new AbortController();
  const { signal } = ac;
  initHomeHelpers._abort = ac;

  const isHome =
    !!document.querySelector("#kontakt") ||
    !!document.querySelector("#oferta") ||
    !!document.querySelector("#strona-glowna");

  if (!isHome) {
    window.addEventListener("pagehide", () => ac.abort(), {
      once: true,
      signal,
    });
    return;
  }

  const isVisible = (el) =>
    !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
  const getFocusTarget = () => {
    const main =
      document.querySelector("#main") ||
      document.querySelector("main") ||
      document.querySelector(".main");
    if (main && main.getAttribute("aria-hidden") !== "true" && isVisible(main))
      return main;
    const heading = Array.from(document.querySelectorAll("h1")).find(
      (el) => el.getAttribute("aria-hidden") !== "true" && isVisible(el),
    );
    if (heading) return heading;
    const container =
      document.querySelector('[role="main"]') ||
      document.querySelector("[data-page]");
    if (container && container.getAttribute("aria-hidden") !== "true") {
      return container;
    }
    return document.body;
  };
  const focusTarget = () => {
    const target = getFocusTarget();
    if (!target || typeof target.focus !== "function") return;
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    setTimeout(() => target.removeAttribute("tabindex"), 800);
  };

  const getScrollBehavior = () => {
    const prefersNoAnim = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    return prefersNoAnim ? "auto" : "smooth";
  };

  const cleanUrlKeepQuery = () => {
    history.replaceState(null, "", location.pathname + location.search);
  };

  const cleanUrlKeepHash = () => {
    history.replaceState(null, "", location.pathname + location.hash);
  };

  const scrollToTop = () => {
    const behavior = getScrollBehavior();
    const topEl = document.getElementById("top");

    if (topEl?.scrollIntoView) {
      topEl.scrollIntoView({ behavior });
      focusTarget();
      return;
    }

    window.scrollTo({ top: 0, behavior });
    focusTarget();
  };

  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest('a.scroll-top, a[href="#top"]');
      if (!link) return;

      if (!e.defaultPrevented) {
        e.preventDefault();
        scrollToTop();
      } else {
        focusTarget();
      }

      cleanUrlKeepQuery();
    },
    { signal },
  );

  (function prefillService() {
    const form = document.querySelector("#kontakt form");
    if (!form) return;

    const params = new URLSearchParams(location.search);
    const service = params.get("usluga");
    if (!service) return;

    let input = form.querySelector('[name="usluga"]');

    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = "usluga";
      form.appendChild(input);
    }

    input.value = service;
    cleanUrlKeepHash();
  })();

  window.addEventListener("pagehide", () => ac.abort(), { once: true, signal });
}

/* === 14 - Map consent === */

function initMapConsent() {
  const mapContainer = document.querySelector("[data-map-src]");
  if (!mapContainer) return;

  const mapSrc = mapContainer.dataset.mapSrc;
  const placeholder = mapContainer.querySelector(".map-placeholder");
  const loadBtn = mapContainer.querySelector(".map-load-btn");
  const storageKey = "consent.maps";

  const loadMap = () => {
    if (!mapSrc || mapContainer.querySelector("iframe")) return;

    const iframe = document.createElement("iframe");
    iframe.title = "Mapa dojazdu — przykładowa lokalizacja Tarnów";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    iframe.setAttribute("allowfullscreen", "");
    iframe.src = mapSrc;

    if (placeholder) placeholder.remove();
    mapContainer.appendChild(iframe);
  };

  try {
    if (localStorage.getItem(storageKey) === "true") loadMap();
  } catch {}

  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      try {
        localStorage.setItem(storageKey, "true");
      } catch {}
      loadMap();
    });
  }
}

/* === 15 - Cookie Banner === */

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
      Array.from(
        banner.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => {
        localStorage.setItem(KEY, "accepted");
        banner.hidden = true;

        try {
          (
            previousFocus ||
            document.querySelector(".theme-toggle") ||
            document.body
          ).focus({ preventScroll: true });
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
        (
          previousFocus ||
          document.querySelector(".theme-toggle") ||
          document.body
        ).focus({ preventScroll: true });
      } catch {}
    });
  } catch {}
}

/* === 99 - Bootstrap === */

(function boot() {
  const start = () => {
    if (typeof utils?.syncHeaderCssVar === "function") utils.syncHeaderCssVar();

    if (typeof initNav === "function") initNav();
    if (typeof initHeaderShrink === "function") initHeaderShrink();
    if (typeof initScrollSpy === "function") initScrollSpy();

    if (typeof initFooterYear === "function") initFooterYear();
    if (typeof initSmoothTop === "function") initSmoothTop();
    if (typeof initScrollReveal === "function") initScrollReveal();

    if (typeof initThemeToggle === "function") initThemeToggle();
    if (typeof initRipple === "function") initRipple();

    if (typeof initHeroBlurSync === "function") initHeroBlurSync();
    if (typeof initOfertaLightbox === "function") initOfertaLightbox();
    if (typeof initOfferPrefetch === "function") initOfferPrefetch();

    if (typeof initHomeHelpers === "function") initHomeHelpers();
    if (typeof initMapConsent === "function") initMapConsent();
    if (typeof initContactForm === "function") initContactForm();
    if (typeof initCookieBanner === "function") initCookieBanner();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
