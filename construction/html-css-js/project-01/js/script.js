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
    const fromVar = readCssVarPx('--header-h');
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
    docEl.style.setProperty('--header-h', `${h}px`);
    cached = h;
    return h;
  };

  // reset cache przy zmianie viewportu
  window.addEventListener('resize', () => { cached = null; }, { passive: true });

  return { getHeaderH, refreshHeaderH, syncHeaderCssVar };
})();


/* ============================================================
 1) NAWIGACJA (mobile toggle + dropdown „Oferta” + a11y)
     - hamburger: open/close + focus trap + klik poza + Esc
     - dropdown „Oferta”: desktop=hover, mobile=1. tap otwórz, 2. tap idź do #oferta
============================================================ */
function initNav() {
  const html   = document.documentElement;
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('#navMenu');
  if (!toggle || !menu) return;

  const OPEN_CLASS = 'is-nav-open';
  let lastFocus = null;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    html.classList.toggle(OPEN_CLASS, open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');

    if (open) {
      lastFocus = document.activeElement;
      menu.querySelector('a, button, [tabindex]:not([tabindex="-1"])')?.focus({ preventScroll: true });
    } else {
      toggle.focus({ preventScroll: true });
    }
  };

  // stan początkowy
  setOpen(menu.classList.contains('open'));

  // otwieranie/zamykanie przyciskiem
  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));

  // zamykanie po kliknięciu w link anchor (tylko na mobile)
  menu.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const isMobile = window.matchMedia('(max-width: 991.98px)').matches;
    if (isMobile) setOpen(false);
  });

  // zamykanie po kliknięciu poza menu
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
      setOpen(false);
    }
  }, { passive: true });

  // Esc + focus trap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setOpen(false);
      return;
    }
    if (e.key === 'Tab' && menu.classList.contains('open')) {
      const f = menu.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ===== Dropdown „Oferta” ===== */
  const ddTrigger = document.querySelector('.dropdown-trigger[href="#oferta"]');
  const ddMenu    = document.querySelector('#dd-oferta');

  if (ddTrigger && ddMenu) {
    let ddOpen = ddMenu.classList.contains('open');

    const setDd = (open) => {
      ddMenu.classList.toggle('open', open);
      ddTrigger.setAttribute('aria-expanded', String(open));
      ddOpen = open;
    };

    // Desktop: hover
    const mqDesktop = window.matchMedia('(min-width: 992px)');
    const parentLi  = ddTrigger.closest('.has-dropdown') || ddTrigger.parentElement;

    if (parentLi) {
      parentLi.addEventListener('mouseenter', () => { if (mqDesktop.matches) setDd(true); });
      parentLi.addEventListener('mouseleave', () => { if (mqDesktop.matches) setDd(false); });
    }

    // Mobile: 1. tap -> otwórz submenu, 2. tap -> nawiguj do #oferta
    ddTrigger.addEventListener('click', (e) => {
      const isMobile = window.matchMedia('(max-width: 991.98px)').matches;
      if (isMobile && !ddOpen) {
        e.preventDefault();
        setDd(true);
      }
    });

    // Zamykaj dropdown przy kliknięciu poza
    document.addEventListener('click', (e) => {
      if (ddOpen && !ddMenu.contains(e.target) && !ddTrigger.contains(e.target)) setDd(false);
    }, { passive: true });

    // Gdy chowamy całe menu mobile — zamknij też dropdown
    toggle.addEventListener('click', () => {
      if (!menu.classList.contains('open')) setDd(false);
    });

    // Inicjalizacja ARIA
    ddTrigger.setAttribute('aria-expanded', String(ddOpen));
  }
}


/* ============================================================
 2) SCROLLSPY — aktywne linki w menu + wsparcie dla "Oferta"
     - mapuje #top -> #strona-glowna
     - offset z utils.getHeaderH() + 8px
     - ustawia scroll-margin-top na sekcjach
============================================================ */
function initScrollSpy() {
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  if (!navLinks.length) return;

  // Mapowanie #top -> #strona-glowna (hero)
  const mapHref = (href) => (href === '#top' ? '#strona-glowna' : href);

  // kotwice z menu (+ opcjonalny #oferta)
  const targetsFromMenu = navLinks
    .map(a => mapHref(a.getAttribute('href')))
    .filter(href => href && href.startsWith('#'));

  const extraTargets = [];
  if (document.querySelector('#oferta')) extraTargets.push('#oferta');

  // unikalne i istniejące sekcje
  const sections = [...new Set([...targetsFromMenu, ...extraTargets])]
    .map(sel => document.querySelector(sel))
    .filter(Boolean);
  if (!sections.length) return;

  // 1) scroll-margin-top wg aktualnego headera
  const applyScrollMargin = () => {
    const OFFSET = utils.getHeaderH() + 8;
    sections.forEach(sec => {
      const cur = parseFloat(getComputedStyle(sec).scrollMarginTop) || 0;
      if (cur < OFFSET) sec.style.scrollMarginTop = OFFSET + 'px';
    });
  };
  applyScrollMargin();

  // 2) podświetlanie aktywnego linku
  const setActive = (id) => {
    navLinks.forEach(a => {
      const href = mapHref(a.getAttribute('href'));
      const match = href === ('#' + id);
      a.classList.toggle('is-active', match);
      if (match) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });

    // Specjalnie dla "Oferta" (trigger dropdownu)
    const ofertaTrigger = document.querySelector('.dropdown-trigger[aria-controls="dd-oferta"]');
    if (ofertaTrigger) {
      const isOferta = id === 'oferta' || id.startsWith('oferta-');
      ofertaTrigger.classList.toggle('is-active', isOferta);
      if (isOferta) ofertaTrigger.setAttribute('aria-current', 'true');
      else ofertaTrigger.removeAttribute('aria-current');
    }
  };

  // 3) logika wyboru sekcji
  let ticking = false;
  const compute = () => {
    ticking = false;
    const OFFSET = utils.getHeaderH() + 8;

    let currentId = sections[0].id;
    let bestTop = -Infinity;

    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top - OFFSET;
      if (top <= 0 && top > bestTop) {
        bestTop = top;
        currentId = sec.id;
      }
    }

    // jeśli jesteś na dole — wybierz ostatnią
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      currentId = sections[sections.length - 1].id;
    }

    setActive(currentId);
  };

  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(compute); }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    utils.refreshHeaderH();
    applyScrollMargin();
    requestAnimationFrame(compute);
  }, { passive: true });

  // Start
  compute();
}


/* ============================================================
 3) ROK W STOPCE 
   - automatycznie wpisuje bieżący rok w <span id="year">
============================================================ */
function initFooterYear() {
  const y = document.getElementById('year');
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
  const prefersNoAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = prefersNoAnim ? 'auto' : 'smooth';

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#top"], a.scroll-top');
    if (!a) return;

    // nie przechwytuj, jeśli user chce otworzyć w nowej karcie/oknie
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;

    e.preventDefault();
    window.scrollTo({ top: 0, behavior });
  });
}


/* ============================================================
 5) FLOATING SCROLL BUTTONS — mijanka w połowie widoku
     - ↓ widoczny w górnej połowie strony, ↑ w dolnej
     - chowa ↓ tuż przy dole i ↑ tuż przy górze
     - respektuje prefers-reduced-motion
     - wstrzymuje ↓ gdy menu mobilne jest otwarte
============================================================ */
function initScrollButtons() {
  const btnTop    = document.querySelector('.scroll-top-float');       // ↑
  const btnBottom = document.querySelector('.scroll-bottom-float');    // ↓
  const navMenu   = document.getElementById('navMenu');
  if (!btnTop && !btnBottom) return;

  const prefersNoAnim = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = prefersNoAnim ? 'auto' : 'smooth';
  const scrollEl = document.scrollingElement || document.documentElement;

  // Kliknięcia
  btnTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior });
  });
  btnBottom?.addEventListener('click', () => {
    const total = Math.max(scrollEl.scrollHeight, document.body.scrollHeight);
    window.scrollTo({ top: total, behavior });
  });

  // Pokazywanie/ukrywanie z rAF-throttle
  let ticking = false;
  const update = () => {
    ticking = false;

    const viewport  = window.innerHeight || 0;
    const totalDoc  = Math.max(scrollEl.scrollHeight, document.body.scrollHeight);
    const maxScroll = Math.max(0, totalDoc - viewport);
    const y         = Math.min(scrollEl.scrollTop || window.scrollY || 0, maxScroll);

    const mid        = maxScroll / 2;
    const nearTop    = y < 40;
    const nearBottom = y > (maxScroll - 40);
    const menuOpen   = !!(navMenu && navMenu.classList.contains('open'));

    btnTop?.classList.toggle('is-hidden',   (y <= mid) || nearTop);
    btnBottom?.classList.toggle('is-hidden',(y >  mid) || nearBottom || menuOpen);

    // a11y (opcjonalnie)
    btnTop?.setAttribute('aria-hidden',   btnTop?.classList.contains('is-hidden') ? 'true' : 'false');
    btnBottom?.setAttribute('aria-hidden',btnBottom?.classList.contains('is-hidden') ? 'true' : 'false');
  };

  const onScrollOrResize = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  update();
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });

  // Reaguj też na zmianę klasy menu (otwarcie/zamknięcie)
  if (navMenu) {
    const mo = new MutationObserver(update);
    mo.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('pagehide', () => mo.disconnect(), { once: true });
  }
}


/* ============================================================
 6) FORMULARZ: kontakt (honeypot + walidacja + a11y + mock)
============================================================ */
function initContactForm() {
  const form = document.querySelector('section#kontakt .form');
  if (!form) return;

  const note          = form.querySelector('.form-note');
  const btnSubmit     = form.querySelector('button[type="submit"]');
  const hpInput       = form.querySelector('input[name="website"]');   // honeypot
  const nameInput     = form.querySelector('#f-name');
  const phoneInput    = form.querySelector('#f-phone');
  const msgInput      = form.querySelector('#f-msg');
  const consentInput  = form.querySelector('#f-consent');

  // Live region dla komunikatów globalnych
  if (note) {
    note.setAttribute('role', 'status');
    note.setAttribute('aria-atomic', 'true');
  }

  // Honeypot – bezpiecznie ukryj (na wypadek braku CSS)
  if (hpInput) {
    const wrap = hpInput.closest('label, div');
    if (wrap) {
      Object.assign(wrap.style, {
        position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden'
      });
      wrap.setAttribute('aria-hidden', 'true');
      hpInput.setAttribute('tabindex', '-1');
      hpInput.setAttribute('autocomplete', 'off');
    }
  }

  // Regex zgodny z pattern w HTML
  const PL_PHONE = /^(?:\+?48)?[ \-]?(?:\d[ \-]?){9}$/;

  // Helpers
  const setBusy = (busy) => {
    form.setAttribute('aria-busy', busy ? 'true' : 'false');
    if (btnSubmit) btnSubmit.disabled = !!busy;
  };

  const showNote = (msg, ok = false) => {
    if (!note) return;
    note.textContent = msg;
    note.classList.toggle('is-ok', ok);
    note.classList.toggle('is-err', !ok);
  };

  const errSpan = (el) => {
    const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/);
    const id  = ids.find(x => x.endsWith('-error'));
    return id ? document.getElementById(id) : null;
  };

  const setFieldError = (el, msg) => {
    if (!el) return;
    el.setAttribute('aria-invalid', 'true');
    el.setCustomValidity(msg || '');
    const span = errSpan(el);
    if (span) {
      span.textContent = msg || '';
      span.classList.toggle('visually-hidden', !msg);
    }
  };

  const clearFieldError = (el) => {
    if (!el) return;
    el.removeAttribute('aria-invalid');
    el.setCustomValidity('');
    const span = errSpan(el);
    if (span) {
      span.textContent = '';
      span.classList.add('visually-hidden');
    }
  };

  // Czyść komunikaty przy edycji + live walidacja telefonu
  form.addEventListener('input', (e) => {
    const t = e.target;
    if (note?.textContent) showNote('', true);
    if (t.matches('input, textarea')) clearFieldError(t);
    if (t === phoneInput) {
      const raw = phoneInput.value.trim();
      if (raw === '' || PL_PHONE.test(raw)) clearFieldError(phoneInput);
    }
  });

  // Trymowanie po blur
  form.addEventListener('blur', (e) => {
    const t = e.target;
    if (t.matches('input[type="text"], textarea')) t.value = t.value.trim();
  }, true);

  // Zapobiegaj podwójnemu submitowi (Enter + klik)
  let submitting = false;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitting) return;

    // 1) Honeypot → spam out
    if (hpInput && hpInput.value.trim() !== '') {
      form.reset();
      return;
    }

    // 2) Podstawowa walidacja HTML5 z czytelnymi komunikatami
    if (!form.checkValidity()) {
      if (nameInput && nameInput.validity.valueMissing) {
        setFieldError(nameInput, 'Podaj imię i nazwisko (min. 2 znaki).');
      }
      if (phoneInput && phoneInput.validity.valueMissing) {
        setFieldError(phoneInput, 'Podaj numer telefonu.');
      }
      if (msgInput && msgInput.validity.valueMissing) {
        setFieldError(msgInput, 'Napisz krótki opis prac.');
      }
      if (consentInput && !consentInput.checked) {
        setFieldError(consentInput, 'Wymagana zgoda na kontakt w celu wyceny.');
      }

      form.reportValidity();
      form.querySelector(':invalid')?.focus({ preventScroll: true });
      showNote('Uzupełnij poprawnie wszystkie pola i zaznacz zgodę.', false);
      return;
    }

    // 3) Dodatkowa walidacja numeru PL
    if (phoneInput) {
      const raw = phoneInput.value.trim();
      if (!PL_PHONE.test(raw)) {
        setFieldError(phoneInput, 'Podaj poprawny numer (np. 600 700 800 lub +48 600 700 800).');
        form.reportValidity();
        phoneInput.focus({ preventScroll: true });
        showNote('Sprawdź format numeru telefonu.', false);
        return;
      }
      clearFieldError(phoneInput);
    }

    // 4) „Wysyłka” (mock)
    submitting = true;
    setBusy(true);
    showNote('Wysyłanie…', true);

    setTimeout(() => {
      setBusy(false);
      submitting = false;
      form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
      form.reset();
      showNote('Dziękujemy! Skontaktujemy się wkrótce.', true);
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
  const EXIT  = 4;  // px – kiedy wychodzimy ze shrink

  const syncVar = () => {
    // precyzyjny pomiar i wpis do CSS var
    const h = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-h', `${h}px`);
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
    document.fonts.ready.then(() => {
      requestAnimationFrame(syncVar);
    }).catch(() => {});
  }

  const apply = (want) => {
    if (want === isShrink) {
      // nawet gdy stan bez zmian – zsynchronizuj var na wszelki wypadek
      syncVar();
      return;
    }
    isShrink = want;
    header.classList.toggle('is-shrink', isShrink);
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
  window.addEventListener('scroll', onScroll, { passive: true });
  // Na wypadek zmian viewportu (np. obrót telefonu)
  window.addEventListener('resize', () => requestAnimationFrame(syncVar), { passive: true });

  // Sprzątanie (na wypadek nawigacji SPA)
  window.addEventListener('pagehide', () => {
    try { ro.disconnect(); } catch {}
  }, { once: true });
}


/* ============================================================
 8) MOTYW (przełącznik z pamięcią + a11y + nasłuch systemu)
     - zapis w localStorage pod kluczem 'theme' ('light' | 'dark')
     - jeśli brak zapisu, używa prefers-color-scheme
     - aktualizuje: [data-theme] na <html>, aria-pressed, aria-label, title
============================================================ */
function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  if (!btn || !root) return;

  const KEY = 'theme';
  const mq  = window.matchMedia?.('(prefers-color-scheme: dark)');

  const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  const saved       = safeGet(KEY);                    // 'dark' | 'light' | null
  const prefersDark = !!mq && mq.matches;
  const initial     = saved || (prefersDark ? 'dark' : 'light');

  const apply = (mode, { persist = true } = {}) => {
    const dark = mode === 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');

    // a11y + UX
    btn.setAttribute('aria-pressed', String(dark));
    const nextLabel = dark ? 'Przełącz na jasny tryb' : 'Przełącz na ciemny tryb';
    btn.setAttribute('aria-label', nextLabel);
    btn.setAttribute('title', nextLabel);

    if (persist) safeSet(KEY, dark ? 'dark' : 'light');
  };

  // Start — jeśli nie było zapisu, nie nadpisuj systemu
  apply(initial, { persist: !saved });

  // Klik — przełącz
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    apply(current === 'dark' ? 'light' : 'dark', { persist: true });
  });

  // Reaguj na zmianę systemowego motywu, JEŚLI user nic nie zapisał
  if (mq && !saved) {
    mq.addEventListener?.('change', (e) => {
      apply(e.matches ? 'dark' : 'light', { persist: false });
    });
  }
}


/* ============================================================
 9) RIPPLE — „Wycena” (prefers-reduced-motion respected)
============================================================ */
function initRipple() {
  const btn = document.querySelector('.nav-menu li > a.btn.btn--sm');
  if (!btn) return;

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // szanuj ustawienia dostępności – nie podpinaj efektu

  const spawn = (x, y) => {
    const rect = btn.getBoundingClientRect();
    const d = Math.hypot(rect.width, rect.height);

    // usuń poprzednią falę, jeśli jeszcze jest
    btn.querySelector('.ripple')?.remove();

    const ink = document.createElement('span');
    ink.className = 'ripple';
    ink.style.width = ink.style.height = `${d}px`;
    ink.style.left = `${x - rect.left - d / 2}px`;
    ink.style.top  = `${y - rect.top  - d / 2}px`;
    btn.appendChild(ink);

    ink.addEventListener('animationend', () => ink.remove());
  };

  // Pointer (mysz/touch/pen)
  btn.addEventListener('pointerdown', (e) => {
    if (e.button === 2) return; // ignoruj PPM
    spawn(e.clientX, e.clientY);
  });

  // Klawiatura (Enter/Spacja – ripple ze środka)
  btn.addEventListener('keydown', (e) => {
    const isEnter = e.key === 'Enter';
    const isSpace = e.key === ' ' || e.code === 'Space';
    if (!isEnter && !isSpace) return;

    const rect = btn.getBoundingClientRect();
    spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);

    if (isSpace) { e.preventDefault(); btn.click(); }
  });
}


/* ============================================================
 10) HERO — ultra-wide: blur sync z <picture>
     - Ustawia tło .hero__bg-blur na faktycznie użyty wariant z <img srcset>
     - Reaguje na: load obrazka, resize, visibilitychange, zmiany atrybutów (src/srcset/sizes)
============================================================ */
function initHeroBlurSync() {
  const picImg  = document.querySelector('.hero-bg img');
  const blurLay = document.querySelector('.hero__bg-blur');
  if (!picImg || !blurLay) return;

  let rafId = 0;
  let debTimer = 0;
  let lastBg = ''; // cache, żeby nie przepisywać tego samego tła

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
    if (document.visibilityState === 'visible') syncBlurBg();
  };

  // Obserwuj zmiany src/srcset/sizes na <img>
  const mo = new MutationObserver(syncBlurBg);
  mo.observe(picImg, { attributes: true, attributeFilter: ['src', 'srcset', 'sizes'] });

  // Start (po załadowaniu strony/obrazu)
  if (document.readyState === 'complete') syncBlurBg();
  else window.addEventListener('load', syncBlurBg, { once: true });

  picImg.addEventListener('load', onImgLoad);
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVis);

  // Sprzątanie (na wypadek nawigacji SPA)
  window.addEventListener('pagehide', () => {
    mo.disconnect();
    picImg.removeEventListener('load', onImgLoad);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    cancelAnimationFrame(rafId);
    clearTimeout(debTimer);
  }, { once: true });
}


/* =========================================================
   INIT — odpal wszystko po załadowaniu DOM (kolejność ma sens)
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initHeaderShrink();   // 7) header: --header-h + shrink
  initNav();            // 1) nawigacja (hamburger + dropdown „Oferta”)
  initScrollSpy();      // 2) scrollspy
  initSmoothTop();      // 4) smooth scroll do #top
  initScrollButtons();  // 5) pływające przyciski ↑/↓
  initContactForm();    // 6) formularz kontaktowy
  initFooterYear();     // 3) rok w stopce
  initThemeToggle();    // 8) motyw (dark/light)
  initRipple();         // 9) ripple na „Wycena”
  initHeroBlurSync();   // 10) HERO blur sync
});

































