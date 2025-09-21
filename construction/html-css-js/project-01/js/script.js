/* ======================================================================
  0) UTILS 
  1) NAWIGACJA (mobile toggle + dropdown Oferta)
  2) SCROLLSPY — aktywne linki w menu + wsparcie dla "Oferta"
     - Źródło prawdy dla offsetu: utils.getHeaderH() (+8 px bufora)
     - Ustawia scroll-margin-top na sekcjach, żeby kotwice nie „wpadały” pod header
     - Podświetla .dropdown-trigger dla #oferta i #oferta-*
  3) ROK W STOPCE 
  4) SMOOTH SCROLL #TOP 
  5) FLOATING SCROLL BUTTONS — mijanka w połowie widoku
     - ↓ widoczny w górnej połowie strony, ↑ w dolnej
     - chowa ↓ tuż przy dole i ↑ tuż przy górze
     - respektuje prefers-reduced-motion
     - wstrzymuje ↓ gdy menu mobilne jest otwarte
  6) FORMULARZ: kontakt (honeypot + walidacja + a11y + mock)
  7) HEADER — shrink + dokładne --header-h (z Fonts & ResizeObserver)
     - Dodaje .is-shrink po przewinięciu > ENTER, usuwa poniżej EXIT (histereza)
     - Po każdej zmianie wysokości: aktualizuje CSS var --header-h i odświeża utils cache
  8) MOTYW (przełącznik z pamięcią + a11y + nasłuch systemu)
     - zapis w localStorage pod kluczem 'theme' ('light' | 'dark')
     - jeśli brak zapisu, używa prefers-color-scheme
     - aktualizuje: [data-theme] na <html>, aria-pressed, aria-label, title  
  9) RIPPLE — „Wycena” (prefers-reduced-motion respected)
 10) HERO — ultra-wide: blur sync z <picture>
      - Ustawia tło .hero__bg-blur na faktycznie użyty wariant z <img srcset>
      - Reaguje na: load obrazka, resize, visibilitychange, zmiany atrybutów (src/srcset/sizes)
 11) LIGHTBOX dla miniaturek w #oferta .card
      - klik w obrazek otwiera podgląd
      - Esc zamyka, ←/→ nawigują, klik tła zamyka
      - obsługa swipe (mobile)
      - wybiera największy wariant z srcset, fallback: currentSrc/src
  12) OFERTA — poziomy scroller (snap + maski + strzałki)   
====================================================================== */

/* =========================================================
INIT — uruchom wszystko po załadowaniu DOM
Kolejność:
1) header (ustawia --header-h i cache w utils)
2) nav (toggle + dropdown)
3) scrollspy (używa utils.getHeaderH)
4) smooth top + floating buttons
5) formularz + rok w stopce
6) motyw, ripple, hero blur
========================================================= */

/* ============================================================
 0) UTILS 
     - Źródło prawdy dla wysokości headera (--header-h)
     - Memoizacja per szerokość okna
     - API: utils.getHeaderH(), utils.refreshHeaderH(), utils.syncHeaderCssVar()
============================================================ */
const utils = (() => {
  const docEl = document.documentElement;
  const headerSel = '.site-header, header[role="banner"]';

  const qHeader = () => document.querySelector(headerSel);

  const readCssVarPx = (name) => {
    const raw = getComputedStyle(docEl).getPropertyValue(name);
    const v = parseFloat(raw); // zadziała też, gdy var ma 'px'
    return Number.isFinite(v) ? v : 0;
  };

  const measureHeaderPx = () => {
    const el = qHeader();
    return el ? el.offsetHeight : 0;
  };

  const computeHeaderH = () => {
    // 1) spróbuj z CSS var --header-h; 2) fallback: realny pomiar; 3) bezpieczny default
    const fromVar = readCssVarPx("--header-h");
    const val = fromVar > 0 ? fromVar : measureHeaderPx();
    return val > 0 ? val : 74;
  };

  let cached = null;
  let lastW = 0;

  const getHeaderH = () => {
    // memoizacja per szerokość (RWD)
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
    // ustaw zmienną CSS na aktualny pomiar + odśwież cache
    const h = computeHeaderH();
    docEl.style.setProperty("--header-h", `${h}px`);
    cached = h;
    return h;
  };

  // reset cache przy zmianie viewportu
  window.addEventListener(
    "resize",
    () => {
      cached = null;
    },
    { passive: true }
  );

  return { getHeaderH, refreshHeaderH, syncHeaderCssVar };
})();

/* ============================================================
 1) NAWIGACJA (mobile toggle + dropdown „Oferta” + a11y)
     - hamburger: open/close + focus trap + klik poza + Esc
     - dropdown „Oferta”: desktop=hover, mobile=1. tap otwórz, 2. tap idź do #oferta
============================================================ */
function initNav() {
  const html = document.documentElement;
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#navMenu");
  if (!toggle || !menu) return;

  // dopisz aria-controls dla dostępności
  if (!toggle.getAttribute("aria-controls"))
    toggle.setAttribute("aria-controls", "navMenu");

  const OPEN_CLASS = "is-nav-open";
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

  // stan początkowy — bez zabierania focusu
  setOpen(menu.classList.contains("open"), { silentFocus: true });

  // otwieranie/zamykanie przyciskiem
  toggle.addEventListener("click", () =>
    setOpen(!menu.classList.contains("open"))
  );

  // zamykanie po kliknięciu w link anchor (tylko na mobile)
  menu.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
    if (isMobile) setOpen(false);
  });

  // zamykanie po kliknięciu poza menu
  document.addEventListener(
    "click",
    (e) => {
      if (
        !menu.contains(e.target) &&
        !toggle.contains(e.target) &&
        menu.classList.contains("open")
      ) {
        setOpen(false);
      }
    },
    { passive: true }
  );

  // Esc + focus trap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      // jeśli jesteśmy w dropdownie — zostaw jego obsłudze
      const ddMenuLive = document.querySelector("#dd-oferta");
      const ddTrigLive = document.querySelector(
        '.dropdown-trigger[href="#oferta"]'
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
    if (e.key === "Tab" && menu.classList.contains("open")) {
      const f = menu.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!f.length) return;
      const first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ===== Dropdown „Oferta” — pełne wsparcie klawiatury (Esc / focus) ===== */
  const ddTrigger = document.querySelector('.dropdown-trigger[href="#oferta"]');
  const ddMenu = document.querySelector("#dd-oferta");

  if (ddTrigger && ddMenu) {
    let ddOpen = ddMenu.classList.contains("open");
    const mqDesktop = window.matchMedia("(min-width: 992px)");
    const parentLi =
      ddTrigger.closest(".has-dropdown") || ddTrigger.parentElement;

    const focusFirstItem = () => {
      ddMenu
        .querySelector('a, button, [tabindex]:not([tabindex="-1"])')
        ?.focus({ preventScroll: true });
    };

    const setDd = (open, { returnFocus = false, focusFirst = false } = {}) => {
      ddMenu.classList.toggle("open", open);
      ddTrigger.setAttribute("aria-expanded", String(open));
      ddOpen = open;

      if (open && focusFirst) {
        focusFirstItem();
      } else if (!open && returnFocus) {
        ddTrigger.focus({ preventScroll: true });
      }
    };

    // Desktop: hover
    if (parentLi) {
      parentLi.addEventListener("mouseenter", () => {
        if (mqDesktop.matches) setDd(true);
      });
      parentLi.addEventListener("mouseleave", () => {
        if (mqDesktop.matches) setDd(false);
      });
    }

    // Mobile: 1. aktywacja -> otwórz submenu, 2. aktywacja -> nawigacja
    const openMobileOnce = () => {
      const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
      if (!isMobile) return false;
      if (!ddOpen) {
        setDd(true, { focusFirst: true });
        return true;
      }
      return false;
    };

    ddTrigger.addEventListener("click", (e) => {
      if (openMobileOnce()) {
        e.preventDefault();
      }
    });

    ddTrigger.addEventListener("keydown", (e) => {
      const isEnter = e.key === "Enter";
      const isSpace = e.key === " " || e.code === "Space";
      if (!(isEnter || isSpace)) return;
      if (openMobileOnce()) {
        e.preventDefault();
      }
    });

    // Zamykaj dropdown przy kliknięciu poza
    document.addEventListener(
      "click",
      (e) => {
        if (
          ddOpen &&
          !ddMenu.contains(e.target) &&
          !ddTrigger.contains(e.target)
        ) {
          setDd(false, { returnFocus: false });
        }
      },
      { passive: true }
    );

    // Esc zamyka dropdown
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const active = document.activeElement;
      const inside =
        active && (ddMenu.contains(active) || ddTrigger.contains(active));
      if (ddOpen && inside) {
        e.preventDefault();
        setDd(false, { returnFocus: true });
      }
    });

    // Gdy chowamy całe menu — domknij też dropdown
    toggle.addEventListener("click", () => {
      if (!menu.classList.contains("open")) setDd(false);
    });

    // Inicjalizacja ARIA
    ddTrigger.setAttribute("aria-expanded", String(ddOpen));
  }
}

/* ============================================================
 2) SCROLLSPY — aktywne linki + preferuj podsekcje (Opinie > Oferta)
     - mapuje #top -> #strona-glowna
     - próg = live header + PEEK (domyślnie 12px)
     - wybór sekcji: ta, która PRZECINA linię progu; gdy wiele — bierz najgłębszą (ostatnią)
     - nie przelicza, gdy hamburger jest otwarty
     - po kliknięciu: zamyka menu, scrolluje z offsetem, potwierdza po zakończeniu
============================================================ */
function initScrollSpy() {
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  if (!navLinks.length) return;

  const PEEK = 12;
  const mapHref = (href) => (href === "#top" ? "#strona-glowna" : href);

  // cele z menu
const targetsFromMenu = navLinks
  .map(a => mapHref(a.getAttribute("href")))
  .filter(href => href && href.startsWith("#") && href.length > 1);


  // ewentualne dodatkowe cele (zostawiamy #oferta, ale logika będzie faworyzować jej dzieci)
  const extraTargets = [];
  if (document.querySelector("#oferta")) extraTargets.push("#oferta");

  const sections = [...new Set([...targetsFromMenu, ...extraTargets])]
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);
  if (!sections.length) return;

  // helpers
  const headerEl = document.querySelector(".site-header");
  const getHeaderLive = () => (headerEl?.getBoundingClientRect().height || 0);
  const navMenu = document.getElementById("navMenu");
  const isMenuOpen = () =>
    (navMenu && navMenu.classList.contains("open")) ||
    document.body.classList.contains("nav-open") ||
    document.documentElement.classList.contains("nav-open") ||
    (headerEl && headerEl.classList.contains("open"));

  // scroll-margin-top ułatwia przewijanie do hash
  const applyScrollMargin = () => {
    const OFFSET = (utils?.getHeaderH?.() || getHeaderLive()) + PEEK;
    sections.forEach((sec) => {
      const v = String(OFFSET);
      if (sec.dataset.appliedScrollMargin !== v) {
        sec.style.scrollMarginTop = OFFSET + "px";
        sec.dataset.appliedScrollMargin = v;
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
      if (match) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    // trigger dla dropdownu "Oferta"
    const ofertaTrigger = document.querySelector('.dropdown-trigger[aria-controls="dd-oferta"]');
    if (ofertaTrigger) {
      const isOferta = id === "oferta" || id.startsWith("oferta-");
      ofertaTrigger.classList.toggle("is-active", isOferta);
      if (isOferta) ofertaTrigger.setAttribute("aria-current", "true"); else ofertaTrigger.removeAttribute("aria-current");
    }
  };

  // — Klucz: wybór sekcji po linii progu — preferuj podsekcje
  const pickCurrent = () => {
    const OFFSET = getHeaderLive() + PEEK;
    const probeY = OFFSET + 1; // 1px pod nagłówkiem

    // 1) sekcje, które PRZECINA linia progu (top<=probeY<bottom)
    const candidates = sections.filter((sec) => {
      const r = sec.getBoundingClientRect();
      const top = r.top;
      const bottom = r.bottom;
      return top <= probeY && bottom > probeY;
    });

    if (candidates.length) {
      // jeśli jest wiele (rodzic + dziecko), bierz najpóźniejszą w DOM (głębszą)
      return candidates[candidates.length - 1].id;
    }

    // 2) fallback: ostatnia, której top <= próg
    let currentId = sections[0].id;
    let bestTop = -Infinity;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top - OFFSET;
      if (top <= 0 && top > bestTop) { bestTop = top; currentId = sec.id; }
    }

    // dół strony → ostatnia sekcja
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      currentId = sections[sections.length - 1].id;
    }
    return currentId;
  };

  // przeliczanie po zakończeniu scrolla
  let scrollTimeout;
  const compute = () => {
    if (isMenuOpen()) return;
    const id = pickCurrent();
    if (id !== lastId) setActive(id);
  };
  const scheduleComputeAfterScroll = () => {
    if ("onscrollend" in window) {
      const handler = () => { compute(); window.removeEventListener("scrollend", handler); };
      window.addEventListener("scrollend", handler);
    } else {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(compute, 120);
    }
  };

// scroll / resize
let ticking = false;
const onScroll = () => {
  if (isMenuOpen()) return;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      compute();               // ← LIVE update podczas scrollowania
    });
  }
  scheduleComputeAfterScroll(); // ← potwierdzenie po zakończeniu scrolla
};
window.addEventListener("scroll", onScroll, { passive: true });




  // klik w link: zamknij menu, przewiń z offsetem (sekcja w 100% widoczna), potwierdź po scrollu
  const prefersNoAnim = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = prefersNoAnim ? "auto" : "smooth";

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = mapHref(a.getAttribute("href"));
      if (!href.startsWith("#")) return;
      e.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      // zamknij hamburger niezależnie od implementacji
      navMenu?.classList.remove("open");
      headerEl?.classList.remove("open");
      document.body.classList.remove("nav-open");
      document.documentElement.classList.remove("nav-open");

      // pozycja docelowa: top - (header + PEEK)
      const OFFSET = getHeaderLive() + PEEK;
      const targetY = Math.max(0, window.scrollY + target.getBoundingClientRect().top - OFFSET);

      // wrażenie spójności: natychmiast zaznacz cel
      setActive(target.id);

      // płynny scroll + potwierdzenie po zakończeniu
      window.scrollTo({ top: targetY, behavior });
      scheduleComputeAfterScroll();
    });
  });

  // obserwacja zamykania menu → dopiero wtedy przelicz
  if (navMenu) {
    const mo = new MutationObserver(() => {
      if (!isMenuOpen()) scheduleComputeAfterScroll();
    });
    mo.observe(navMenu, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("pagehide", () => mo.disconnect(), { once: true });
  }

  // start
  applyScrollMargin();
  compute();
}




/* ============================================================
 3) ROK W STOPCE 
   - automatycznie wpisuje bieżący rok w <span id="year">
============================================================ */
function initFooterYear() {
  const y = document.getElementById("year");
  if (y) {
    y.textContent = new Date().getFullYear();
  }
}

/* ============================================================
 4) SMOOTH SCROLL #TOP 
     - przewija po kliknięciu w <a href="#top"> lub .scroll-top
     - respektuje prefers-reduced-motion
     - delegacja zdarzeń (działa dla linków dodanych później)
============================================================ */
function initSmoothTop() {
  const prefersNoAnim = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const behavior = prefersNoAnim ? "auto" : "smooth";

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href="#top"], a.scroll-top');
    if (!a) return;

    // nie przechwytuj, jeśli user chce otworzyć w nowej karcie/oknie
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1)
      return;

    e.preventDefault();
    window.scrollTo({ top: 0, behavior });
  });
}

/* ============================================================
 5) FLOATING SCROLL BUTTONS — hero(↓) = na sam dół, top(↑)
     - ↓ widoczny tylko gdy hero w kadrze i menu nie jest otwarte
     - ↓ przewija NA SAM DÓŁ (jeden duży smooth scrollBy)
     - ↑ pokazuje się po 200 px (DESKTOP ONLY)
     - prefers-reduced-motion respektowane
============================================================ */
function initScrollButtons() {
  let btnTop = document.querySelector(".scroll-top-float"); // ↑
  const btnDown = document.querySelector(".scroll-down");   // ↓ (w #strona-glowna)
  const hero = document.querySelector("#strona-glowna");
  const navMenu = document.getElementById("navMenu");
  if (!btnTop && !btnDown) return;

  // 🔹 Mobile/touch: usuń przycisk "↑" i nie rejestruj dla niego żadnych listenerów
  const isTouch = window.matchMedia("(hover:none) and (pointer:coarse)").matches;
  if (isTouch && btnTop) {
    btnTop.remove();
    btnTop = null; // żeby dalsza logika go pomijała
  }

  const prefersNoAnim = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = prefersNoAnim ? "auto" : "smooth";
  const root = document.scrollingElement || document.documentElement;

  // ↑ do góry (DESKTOP ONLY — na mobile btnTop == null)
  btnTop?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior });
  });

  // ↓ na sam dół — jeden, duży, płynny scroll względny
  btnDown?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollBy({ top: 1e9, behavior }); // przeglądarka i tak "zaklamruje" do dołu
  });

  // Widoczność (↓ tylko gdy hero w kadrze, brak menu, nie przy samym dole)
  let ticking = false, heroInView = true;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight || 0;
    const docH = Math.max(root.scrollHeight, document.body.scrollHeight);
    const y = Math.min(root.scrollTop || window.scrollY || 0, Math.max(0, docH - vh));
    const nearTop = y < 200;
    const nearBottom = y + vh > docH - 40;
    const menuOpen = !!(navMenu && navMenu.classList.contains("open"));

    if (btnTop) btnTop.classList.toggle("is-hidden", nearTop);
    if (btnDown) btnDown.classList.toggle("is-hidden", !heroInView || menuOpen || nearBottom);
  };

  const onScrollOrResize = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  // Obserwacja hero (czy w kadrze)
  let io;
  if (hero) {
    io = new IntersectionObserver(
      (entries) => {
        heroInView = !!entries[0]?.isIntersecting;
        update();
      },
      { root: null, threshold: 0.12 }
    );
    io.observe(hero);
  }

  // Obserwacja otwierania/zamykania menu
  let mo;
  if (navMenu) {
    mo = new MutationObserver(update);
    mo.observe(navMenu, { attributes: true, attributeFilter: ["class"] });
  }

  // Init + nasłuchy
  update();
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  window.addEventListener("pagehide", () => {
    io?.disconnect();
    mo?.disconnect();
  }, { once: true });
}
initScrollButtons();


/* ============================================================
 6) FORMULARZ: kontakt (honeypot + walidacja + a11y + maska + mock)
============================================================ */
function initContactForm() {
  const form = document.querySelector("section#kontakt .form");
  if (!form) return;

  const note = form.querySelector(".form-note");
  const btnSubmit = form.querySelector('button[type="submit"]');
  const hpInput = form.querySelector('input[name="website"]'); // honeypot
  const nameInput = form.querySelector("#f-name");
  const phoneInput = form.querySelector("#f-phone");
  const msgInput = form.querySelector("#f-msg");
  const consentInput = form.querySelector("#f-consent");

  // Live region dla komunikatów globalnych
  if (note) {
    note.setAttribute("role", "status");
    note.setAttribute("aria-atomic", "true");
    note.setAttribute("aria-live", "polite");
  }

  // Honeypot – bezpiecznie ukryj (na wypadek braku CSS)
  if (hpInput) {
    const wrap = hpInput.closest("label, div");
    if (wrap) {
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
  }

  // Dodatkowe antyspam: minimalny czas wypełniania + prosta heurystyka linków
  const startedAt = Date.now();
  const isTooFast = () => Date.now() - startedAt < 2000; // < 2s = bot
  const looksSpammy = (text) => {
    const t = String(text || "").toLowerCase();
    const links = (t.match(/https?:\/\//g) || []).length;
    return links >= 2 || /viagra|bitcoin|casino/.test(t);
  };

  // Regex zgodny z pattern w HTML
  const PL_PHONE = /^(?:\+?48)?[ \-]?(?:\d[ \-]?){9}$/;

  // Helpers
  const setBusy = (busy) => {
    form.setAttribute("aria-busy", busy ? "true" : "false");
    if (btnSubmit) btnSubmit.disabled = !!busy;
  };

  const showNote = (msg, ok = false) => {
    if (!note) return;
    note.textContent = msg;
    note.classList.toggle("is-ok", ok);
    note.classList.toggle("is-err", !ok);
  };

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

  // ===== Maska telefonu (PL) =====
  // - na bieżąco formatuje jako "600 700 800" lub "+48 600 700 800"
  // - toleruje wpisywanie spacji/kresek, pasty, backspace, itp.
  const formatPLPhone = (raw) => {
    raw = String(raw || "");
    const hasPlus48 = raw.trim().startsWith("+48");
    // zachowaj +48 tylko jeśli rzeczywiście wpisane
    let digits = raw.replace(/\D/g, "");
    let prefix = "";

    if (hasPlus48) {
      if (digits.startsWith("48")) digits = digits.slice(2);
      prefix = "+48 ";
    }

    // maks. 9 cyfr lokalnie
    digits = digits.slice(0, 9);

    const g1 = digits.slice(0, 3);
    const g2 = digits.slice(3, 6);
    const g3 = digits.slice(6, 9);
    const grouped = [g1, g2, g3].filter(Boolean).join(" ");
    return (prefix + grouped).trim();
  };

  const applyPhoneMask = () => {
    if (!phoneInput) return;
    const caretAtEnd = document.activeElement === phoneInput;
    const before = phoneInput.value;
    const after = formatPLPhone(before);
    if (after !== before) {
      phoneInput.value = after;
      if (caretAtEnd) {
        // prosty wariant: kursor na końcu (w praktyce UX jest OK)
        phoneInput.setSelectionRange(after.length, after.length);
      }
    }
  };

  // Czyść komunikaty przy edycji + live walidacja telefonu + maska
  form.addEventListener("input", (e) => {
    const t = e.target;
    if (note?.textContent) showNote("", true);
    if (t.matches("input, textarea")) clearFieldError(t);

    if (t === phoneInput) {
      applyPhoneMask();
      const raw = phoneInput.value.trim();
      if (raw === "" || PL_PHONE.test(raw)) clearFieldError(phoneInput);
    }
  });

  // Maska także przy wklejeniu i po blur
  phoneInput?.addEventListener("paste", () => {
    requestAnimationFrame(applyPhoneMask);
  });
  phoneInput?.addEventListener("blur", applyPhoneMask);

  // Trymowanie po blur (imię i opis)
  form.addEventListener(
    "blur",
    (e) => {
      const t = e.target;
      if (t.matches('input[type="text"], textarea')) t.value = t.value.trim();
    },
    true
  );

  // Zapobiegaj podwójnemu submitowi (Enter + klik)
  let submitting = false;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (submitting) return;

    // 0) Antyspam: honeypot / czas / heurystyka linków
    if (
      (hpInput && hpInput.value.trim() !== "") ||
      isTooFast() ||
      looksSpammy(msgInput?.value)
    ) {
      form.reset();
      return;
    }

    // 1) Podstawowa walidacja HTML5 z czytelnymi komunikatami
    if (!form.checkValidity()) {
      if (nameInput && nameInput.validity.valueMissing) {
        setFieldError(nameInput, "Podaj imię i nazwisko (min. 2 znaki).");
      } else if (nameInput && nameInput.validity.tooShort) {
        setFieldError(
          nameInput,
          "Imię i nazwisko powinno mieć co najmniej 2 znaki."
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
        setFieldError(consentInput, "Wymagana zgoda na kontakt w celu wyceny.");
      }

      form.reportValidity();
      form
        .querySelector(':invalid, [aria-invalid="true"]')
        ?.focus({ preventScroll: true });
      showNote("Uzupełnij poprawnie wszystkie pola i zaznacz zgodę.", false);
      return;
    }

    // 2) Dodatkowa walidacja numeru PL (po masce)
    if (phoneInput) {
      applyPhoneMask();
      const raw = phoneInput.value.trim();
      if (!PL_PHONE.test(raw)) {
        setFieldError(
          phoneInput,
          "Podaj poprawny numer (np. 600 700 800 lub +48 600 700 800)."
        );
        form.reportValidity();
        phoneInput.focus({ preventScroll: true });
        showNote("Sprawdź format numeru telefonu.", false);
        return;
      }
      clearFieldError(phoneInput);
    }

    // 3) „Wysyłka” (mock)
    submitting = true;
    setBusy(true);
    showNote("Wysyłanie…", true);

    setTimeout(() => {
      setBusy(false);
      submitting = false;
      form
        .querySelectorAll('[aria-invalid="true"]')
        .forEach((el) => el.removeAttribute("aria-invalid"));
      form.reset();
      showNote("Dziękujemy! Skontaktujemy się wkrótce.", true);
      note?.focus?.();
    }, 900);
  });
}

/* ============================================================
 7) HEADER — shrink + dokładne --header-h (z Fonts & ResizeObserver)
    - Dodaje .is-shrink po przewinięciu > ENTER, usuwa poniżej EXIT (histereza)
    - Po każdej zmianie wysokości: aktualizuje CSS var --header-h i odświeża utils cache
============================================================ */
function initHeaderShrink() {
  const header = document.querySelector('.site-header, header[role="banner"]');
  if (!header) return;

  let isShrink = false;
  const ENTER = 16; // px – kiedy wchodzimy w shrink
  const EXIT = 4; // px – kiedy wychodzimy ze shrink

  const syncVar = () => {
    // precyzyjny pomiar i wpis do CSS var
    const h = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--header-h", `${h}px`);
    // wyczyść cache w utils i niech kolejne getHeaderH() zwróci świeżą wartość
    utils.refreshHeaderH();
  };

  // Obserwuj zmiany wysokości headera (RWD, shrink, zmiany fontu itd.)
  const ro = new ResizeObserver(() => {
    // Minimalne odciążenie – jedź przez rAF, żeby uniknąć layout thrashingu
    requestAnimationFrame(syncVar);
  });
  ro.observe(header);

  // Po załadowaniu fontów wysokość może się zmienić
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => {
        requestAnimationFrame(syncVar);
      })
      .catch(() => {});
  }

  const apply = (want) => {
    if (want === isShrink) {
      // nawet gdy stan bez zmian – zsynchronizuj var na wszelki wypadek
      syncVar();
      return;
    }
    isShrink = want;
    header.classList.toggle("is-shrink", isShrink);
    // Po zmianie klasy wysokość się zmienia — zaktualizuj var w następnym frame
    requestAnimationFrame(syncVar);
  };

  const onScroll = () => {
    const y = window.scrollY || 0;
    if (!isShrink && y > ENTER) apply(true);
    else if (isShrink && y < EXIT) apply(false);
  };

  // Start
  syncVar();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  // Na wypadek zmian viewportu (np. obrót telefonu)
  window.addEventListener("resize", () => requestAnimationFrame(syncVar), {
    passive: true,
  });

  // Sprzątanie (na wypadek nawigacji SPA)
  window.addEventListener(
    "pagehide",
    () => {
      try {
        ro.disconnect();
      } catch {}
    },
    { once: true }
  );
}

/* ============================================================
 8) MOTYW (przełącznik z pamięcią + a11y + nasłuch systemu)
     - zapis w localStorage pod kluczem 'theme' ('light' | 'dark')
     - jeśli brak zapisu, używa prefers-color-scheme
     - aktualizuje: [data-theme] na <html>, aria-pressed, aria-label, title
============================================================ */
function initThemeToggle() {
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

  const saved = safeGet(KEY); // 'dark' | 'light' | null
  const prefersDark = !!mq && mq.matches;
  const initial = saved || (prefersDark ? "dark" : "light");

  const apply = (mode, { persist = true } = {}) => {
    const dark = mode === "dark";
    root.setAttribute("data-theme", dark ? "dark" : "light");

    // a11y + UX
    btn.setAttribute("aria-pressed", String(dark));
    const nextLabel = dark
      ? "Przełącz na jasny tryb"
      : "Przełącz na ciemny tryb";
    btn.setAttribute("aria-label", nextLabel);
    btn.setAttribute("title", nextLabel);

    if (persist) safeSet(KEY, dark ? "dark" : "light");
  };

  // Start — jeśli nie było zapisu, nie nadpisuj systemu
  apply(initial, { persist: !saved });

  // Klik — przełącz
  btn.addEventListener("click", () => {
    const current =
      root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    apply(current === "dark" ? "light" : "dark", { persist: true });
  });

  // Reaguj na zmianę systemowego motywu, JEŚLI user nic nie zapisał
  if (mq && !saved) {
    mq.addEventListener?.("change", (e) => {
      apply(e.matches ? "dark" : "light", { persist: false });
    });
  }
}

/* ============================================================
 9) RIPPLE — „Wycena” (prefers-reduced-motion respected)
============================================================ */
function initRipple() {
  const btn = document.querySelector(".nav-menu li > a.btn.btn--sm");
  if (!btn) return;

  const prefersReduced = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return; // szanuj ustawienia dostępności – nie podpinaj efektu

  const spawn = (x, y) => {
    const rect = btn.getBoundingClientRect();
    const d = Math.hypot(rect.width, rect.height);

    // usuń poprzednią falę, jeśli jeszcze jest
    btn.querySelector(".ripple")?.remove();

    const ink = document.createElement("span");
    ink.className = "ripple";
    ink.style.width = ink.style.height = `${d}px`;
    ink.style.left = `${x - rect.left - d / 2}px`;
    ink.style.top = `${y - rect.top - d / 2}px`;
    btn.appendChild(ink);

    ink.addEventListener("animationend", () => ink.remove());
  };

  // Pointer (mysz/touch/pen)
  btn.addEventListener("pointerdown", (e) => {
    if (e.button === 2) return; // ignoruj PPM
    spawn(e.clientX, e.clientY);
  });

  // Klawiatura (Enter/Spacja – ripple ze środka)
  btn.addEventListener("keydown", (e) => {
    const isEnter = e.key === "Enter";
    const isSpace = e.key === " " || e.code === "Space";
    if (!isEnter && !isSpace) return;

    const rect = btn.getBoundingClientRect();
    spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);

    if (isSpace) {
      e.preventDefault();
      btn.click();
    }
  });
}

/* ============================================================
 10) HERO — ultra-wide: blur sync z <picture>
     - Ustawia tło .hero__bg-blur na faktycznie użyty wariant z <img srcset>
     - Reaguje na: load obrazka, resize, visibilitychange, zmiany atrybutów (src/srcset/sizes)
============================================================ */
function initHeroBlurSync() {
  const picImg = document.querySelector(".hero-bg img");
  const blurLay = document.querySelector(".hero__bg-blur");
  if (!picImg || !blurLay) return;

  let rafId = 0;
  let debTimer = 0;
  let lastBg = ""; // cache, żeby nie przepisywać tego samego tła

  const syncBlurBg = () => {
    // jeśli elementy zostały odpięte od DOM, przerwij
    if (!picImg.isConnected || !blurLay.isConnected) return;

    const url = picImg.currentSrc || picImg.src;
    if (!url) return;

    const want = `url("${url}")`;
    if (want !== lastBg) {
      blurLay.style.backgroundImage = want;
      lastBg = want;
    }
  };

  const onImgLoad = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(syncBlurBg);
  };

  const onResize = () => {
    clearTimeout(debTimer);
    debTimer = setTimeout(syncBlurBg, 150);
  };

  const onVis = () => {
    if (document.visibilityState === "visible") syncBlurBg();
  };

  // Obserwuj zmiany src/srcset/sizes na <img>
  const mo = new MutationObserver(syncBlurBg);
  mo.observe(picImg, {
    attributes: true,
    attributeFilter: ["src", "srcset", "sizes"],
  });

  // Start (po załadowaniu strony/obrazu)
  if (document.readyState === "complete") syncBlurBg();
  else window.addEventListener("load", syncBlurBg, { once: true });

  picImg.addEventListener("load", onImgLoad);
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVis);

  // Sprzątanie (na wypadek nawigacji SPA)
  window.addEventListener(
    "pagehide",
    () => {
      mo.disconnect();
      picImg.removeEventListener("load", onImgLoad);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(rafId);
      clearTimeout(debTimer);
    },
    { once: true }
  );
}

/* ============================================================
 11) LIGHTBOX dla miniaturek w #oferta .card
      - klik w obrazek otwiera podgląd
      - Esc zamyka, ←/→ nawigują, klik tła zamyka
      - obsługa swipe (mobile)
      - wybiera największy wariant z srcset, fallback: currentSrc/src
============================================================ */
function initOfertaLightbox() {
  const imgs = Array.from(
    document.querySelectorAll("#oferta .card picture img")
  );
  if (!imgs.length) return;

  // Zbuduj DOM lightboxa raz
  const $ = (h) => document.createElement(h);
  const backdrop = $("div");
  backdrop.className = "lb-backdrop";
  const wrap = $("div");
  wrap.className = "lb-wrap";
  const viewport = $("div");
  viewport.className = "lb-viewport";
  const img = new Image();
  img.alt = "";
  img.decoding = "async";
  viewport.appendChild(img);
  wrap.appendChild(viewport);

  const mkBtn = (cls, svg) => {
    const b = $("button");
    b.className = `lb-btn ${cls}`;
    b.type = "button";
    b.innerHTML = svg;
    b.setAttribute(
      "aria-label",
      cls === "lb-close"
        ? "Zamknij podgląd"
        : cls === "lb-prev"
          ? "Poprzednie zdjęcie"
          : "Następne zdjęcie"
    );
    return b;
  };
  const svgX =
    '<svg viewBox="0 0 24 24"><path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"/></svg>';
  const svgL =
    '<svg viewBox="0 0 24 24"><path d="M15.7 5.3a1 1 0 0 1 0 1.4L11.4 11l4.3 4.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0z"/></svg>';
  const svgR =
    '<svg viewBox="0 0 24 24"><path d="M8.3 5.3a1 1 0 0 0 0 1.4L12.6 11l-4.3 4.3a1 1 0 1 0 1.4 1.4l5-5a1 1 0 0 0 0-1.4l-5-5a1 1 0 0 0-1.4 0z"/></svg>';
  const btnClose = mkBtn("lb-close", svgX);
  const btnPrev = mkBtn("lb-prev", svgL);
  const btnNext = mkBtn("lb-next", svgR);

  document.body.append(backdrop, wrap, btnClose, btnPrev, btnNext);

  let idx = 0,
    open = false,
    trap = null;

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
    // Najpierw spróbuj z <img srcset>
    let best = parseSrcset(el.getAttribute("srcset"))[0]?.url;
    if (!best) {
      // Potem z <picture><source>
      const pic = el.closest("picture");
      if (pic) {
        const sources = Array.from(pic.querySelectorAll("source"));
        let candidates = [];
        sources.forEach((s) => {
          candidates = candidates.concat(parseSrcset(s.getAttribute("srcset")));
        });
        candidates.sort((a, b) => b.w - a.w);
        best = candidates[0]?.url || null;
      }
    }
    return best || el.currentSrc || el.src;
  };

  const applyImage = () => {
    const el = imgs[idx];
    const url = bestUrlFor(el);
    img.src = url;
    img.alt = el.getAttribute("alt") || "";
  };

  const setOpen = (want) => {
    open = want;
    backdrop.classList.toggle("is-open", open);
    wrap.style.pointerEvents = open ? "auto" : "none";
    document.documentElement.classList.toggle("lb-no-scroll", open); // steruje też widocznością przycisków w CSS
    if (open) {
      applyImage();
      // focus na zamykanie dla a11y
      btnClose.focus({ preventScroll: true });
      // prosty focus trap (między trzema przyciskami)
      trap = (e) => {
        if (e.key !== "Tab") return;
        const focusables = [btnClose, btnPrev, btnNext];
        const first = focusables[0],
          last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", trap);
    } else {
      document.removeEventListener("keydown", trap || (() => {}));
      img.src = ""; // wyczyść podgląd (żeby nie „zostawał”)
      img.alt = "";
    }
  };

  const prev = () => {
    idx = (idx - 1 + imgs.length) % imgs.length;
    applyImage();
  };
  const next = () => {
    idx = (idx + 1) % imgs.length;
    applyImage();
  };

  // Klik na miniaturę
  imgs.forEach((el, i) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      idx = i;
      setOpen(true);
    });
    el.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && !open) {
        e.preventDefault();
        idx = i;
        setOpen(true);
      }
    });
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "Powiększ zdjęcie");
  });

  // Sterowanie
  btnClose.addEventListener("click", () => setOpen(false));
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);
  backdrop.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowLeft") {
      prev();
    } else if (e.key === "ArrowRight") {
      next();
    }
  });

  // Swipe (mobile)
  let startX = 0,
    startY = 0,
    moved = false;
  viewport.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
      moved = false;
    },
    { passive: true }
  );
  viewport.addEventListener(
    "touchmove",
    () => {
      moved = true;
    },
    { passive: true }
  );
  viewport.addEventListener(
    "touchend",
    (e) => {
      if (!moved) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? next() : prev();
      }
    },
    { passive: true }
  );
}
// odpal po DOMContentLoaded (na końcu inicjalizacji)
document.addEventListener("DOMContentLoaded", initOfertaLightbox);

/* ============================================================
 12) OFERTA — poziomy scroller (snap + maski + strzałki)
     (bez guardów WIDTH – sam wykrywa czy „fits”)
============================================================ */
function initOfertaScroller() {
  const scroller = document.getElementById("oferta-scroller");
  const track = document.getElementById("oferta-track");
  if (!scroller || !track) return;

  const prev = scroller.querySelector(".scroller-btn.prev");
  const next = scroller.querySelector(".scroller-btn.next");

  const prefersNoAnim = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = prefersNoAnim ? "auto" : "smooth";

  const gap = () => parseFloat(getComputedStyle(track).gap) || 0;
  const cardW = () => {
    const c = track.querySelector(".card");
    return c ? c.getBoundingClientRect().width : 0;
  };
  // bezpieczny krok: karta+gap albo 90% widocznego toru
  const step = () => Math.max(cardW() + gap(), Math.round(track.clientWidth * 0.9));

  const update = () => {
    const max = Math.max(0, track.scrollWidth - track.clientWidth - 1);
    const x = track.scrollLeft;
    const atStart = x <= 1;
    const atEnd = x >= max;

    scroller.classList.toggle("at-start", atStart);
    scroller.classList.toggle("at-end", atEnd);

    prev?.setAttribute("aria-disabled", String(atStart));
    next?.setAttribute("aria-disabled", String(atEnd));

    const fits = track.scrollWidth <= track.clientWidth + 1;
    scroller.classList.toggle("fits", fits);
  };

  let ticking = false;
  const onScrollOrResize = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  // Strzałki
  prev?.addEventListener("click", () =>
    track.scrollBy({ left: -step(), behavior })
  );
  next?.addEventListener("click", () =>
    track.scrollBy({ left: step(), behavior })
  );

  // Klawiatura (gdy focus na torze)
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); track.scrollBy({ left: step(), behavior }); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); track.scrollBy({ left: -step(), behavior }); }
    else if (e.key === "Home") { e.preventDefault(); track.scrollTo({ left: 0, behavior }); }
    else if (e.key === "End") { e.preventDefault(); track.scrollTo({ left: track.scrollWidth, behavior }); }
  });

  // Wheel → poziomo (przy pionowym gestcie na touchpadzie)
  track.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      track.scrollBy({ left: e.deltaY, behavior: "auto" });
      e.preventDefault();
    }
  }, { passive: false });

  // Kiedy obrazki się dograją — przelicz
  track.querySelectorAll("img").forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", onScrollOrResize, { once: true });
      img.addEventListener("error", onScrollOrResize, { once: true });
    }
  });

  // Init + nasłuchy
  update();
  track.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  window.addEventListener("load", onScrollOrResize, { once: true });
}



/* =========================================================
   INIT — odpal wszystko po załadowaniu DOM (kolejność ma sens)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initHeaderShrink();     // 7) header: --header-h + shrink
  initNav();              // 1) nawigacja (hamburger + dropdown „Oferta”)
  initScrollSpy();        // 2) scrollspy
  initSmoothTop();        // 4) smooth scroll do #top
  initScrollButtons();    // 5) pływające przyciski ↑/↓
  initOfertaScroller();   // 12) OFERTA — poziomy scroller (snap + maski + strzałki)
  initContactForm();      // 6) formularz kontaktowy
  initFooterYear();       // 3) rok w stopce
  initThemeToggle();      // 8) motyw (dark/light)
  initRipple();           // 9) ripple na „Wycena”
  initHeroBlurSync();     // 10) HERO blur sync
});
