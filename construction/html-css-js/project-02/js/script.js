/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Animacje pojawiania sekcji przy scrollu (powtarzalne + initial) ============
   - Dodaje klasę .show, gdy element .hidden pojawi się w kadrze
   - Usuwa klasę .show, gdy element całkowicie znika z widoku                      
   - Obsługuje fallback dla starych przeglądarek (bez IntersectionObserver)
   - Initial reveal: pokazuje elementy widoczne od razu po wejściu na stronę
   ======================================================================================= */
(() => {
  const hiddenElements = document.querySelectorAll('.hidden');
  if (!hiddenElements.length) return; // brak ukrytych elementów — nic nie robimy

  /* --- Fallback dla bardzo starych przeglądarek (bez IntersectionObserver) --- */
  if (!('IntersectionObserver' in window)) {
    hiddenElements.forEach((el) => el.classList.add('show'));
    return;
  }

  /* --- Konfiguracja obserwatora --- */
  const ENTER_RATIO = 0.12; // próg wejścia: ≥12% elementu w kadrze
  const ROOT_MARGIN = '0px 0px -10% 0px'; // dolny margines — odpala nieco wcześniej

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Dodaj .show, gdy element jest sensownie widoczny
        if (entry.intersectionRatio > ENTER_RATIO) {
          entry.target.classList.add('show');
        }
        // Usuń .show dopiero, gdy całkowicie zniknie z widoku
        else if (entry.intersectionRatio === 0) {
          entry.target.classList.remove('show');
        }
      });
    },
    {
      root: null, // viewport
      rootMargin: ROOT_MARGIN,
      threshold: [0, ENTER_RATIO, 0.5, 1], // kilka progów dla precyzji
    }
  );

  hiddenElements.forEach((el) => observer.observe(el));

  /* --- Initial reveal: sprawdź, co już jest widoczne przy starcie --- */
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
    return visibleArea / totalArea > ratio;
  };

  const initialReveal = () => {
    hiddenElements.forEach((el) => {
      if (isInViewport(el)) el.classList.add('show');
    });
  };

  // Odpal jak najszybciej oraz przy typowych wejściach
  initialReveal();
  window.addEventListener('load', initialReveal, { once: true });
  window.addEventListener('pageshow', initialReveal, { once: true });
})();


/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Motyw + przełączanie logo + ikonka hamburgera (desktop+mobile) =============
   - Umożliwia przełączanie motywu jasny/ciemny
   - Podmienia logotypy (.logo-img[data-light][data-dark]) i ikonę hamburgera
   - Zapamiętuje wybór w localStorage (zabezpieczenie na Safari Private Mode)      
   - Obsługuje dwa przyciski: desktopowy i mobilny
   - Synchronizuje aria-label i aria-pressed (a11y)
   - Reaguje na systemowy prefers-color-scheme, jeśli brak zapisu w LS
   ======================================================================================= */
(() => {
  const btnDesktop = document.getElementById('themeToggleDesktop');
  const btnMobile = document.getElementById('themeToggleMobile');
  const logos = document.querySelectorAll('.logo-img[data-light][data-dark]');
  const hamburgerIcon = document.getElementById('hamburgerIcon');

  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  /* --- Ścieżki do ikonki hamburgera (light/dark) --- */
  const HAMBURGER_SRC = {
    light: 'assets/img/icon/hamburger-02-light-mode-40.svg',
    dark: 'assets/img/icon/hamburger-02-dark-mode-40.svg',
  };

  /* --- Podmiana logo w zależności od motywu --- */
  const setLogo = (isDark) => {
    logos.forEach((img) => {
      const next = isDark ? img.dataset.dark : img.dataset.light;
      // unikamy zbędnych podmian
      if (img.src !== new URL(next, document.baseURI).href) {
        img.setAttribute('src', next);
      }
    });
  };

  /* --- Podmiana ikonki hamburgera --- */
  const setHamburgerIcon = (isDark) => {
    if (!hamburgerIcon) return;
    const next = isDark ? HAMBURGER_SRC.dark : HAMBURGER_SRC.light;
    if (hamburgerIcon.getAttribute('src') !== next) {
      hamburgerIcon.setAttribute('src', next);
    }
  };

  /* --- Synchronizacja aria-* przycisków toggle (a11y) --- */
  const syncButtonsA11y = (isDark) => {
    const pressed = String(isDark);
    const label = isDark ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw';
    if (btnDesktop) {
      btnDesktop.setAttribute('aria-pressed', pressed);
      btnDesktop.setAttribute('aria-label', label);
    }
    if (btnMobile) {
      btnMobile.setAttribute('aria-pressed', pressed);
      btnMobile.setAttribute('aria-label', label);
    }
  };

  /* --- Safe localStorage (try/catch dla Safari Private) --- */
  const safeSetItem = (k, v) => {
    try { localStorage.setItem(k, v); } catch { /* brak zapisu */ }
  };
  const safeGetItem = (k) => {
    try { return localStorage.getItem(k); } catch { return null; }
  };

  /* --- Główna funkcja zmiany motywu --- */
  const setTheme = (mode, persist = true) => {
    const isDark = mode === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    setLogo(isDark);
    setHamburgerIcon(isDark);
    syncButtonsA11y(isDark);
    if (persist) safeSetItem('theme', isDark ? 'dark' : 'light');
  };

  /* --- Inicjalizacja: localStorage > prefers-color-scheme --- */
  const saved = safeGetItem('theme'); // 'dark' | 'light' | null
  if (saved === 'dark' || saved === 'light') {
    setTheme(saved, false);
  } else {
    setTheme(mq && mq.matches ? 'dark' : 'light', false);
  }

  /* --- Obsługa kliknięć w przyciski --- */
  const onToggle = () => {
    const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(next, true);
  };
  if (btnDesktop) btnDesktop.addEventListener('click', onToggle);
  if (btnMobile) btnMobile.addEventListener('click', onToggle);

  /* --- Reakcja na zmianę systemowego motywu (tylko jeśli brak zapisu w LS) --- */
  if (!saved && mq) {
    const onSystemChange = (e) => setTheme(e.matches ? 'dark' : 'light', false);
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange); // Safari <14
  }
})();

/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Hamburger (mobile nav) =====================================================
   - Steruje otwieraniem/zamykaniem menu mobilnego
   - A11y: aria-expanded + aria-label, blokada scrolla na <body> (menu-open)
   - Zamyka się na: Esc, klik linku w menu, wyjście z zakresu mobile (>768px)
   ======================================================================================= */
(() => {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('primaryNav');
  if (!btn || !nav) return; // brak elementów — kończymy

  /* --- Zamknij menu i posprzątaj atrybuty/stany --- */
  const closeMenu = () => {
    nav.classList.remove('mobile-open');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Otwórz menu');
    document.body.classList.remove('menu-open'); // odblokuj scroll
  };

  /* --- Przełącz menu (open/close) + aktualizacja a11y --- */
  const toggleMenu = () => {
    const isOpen = !nav.classList.contains('mobile-open');
    nav.classList.toggle('mobile-open', isOpen);
    btn.classList.toggle('active', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
    document.body.classList.toggle('menu-open', isOpen); // zablokuj/odblokuj scroll
  };

  /* --- Klik w przycisk hamburgera --- */
  btn.addEventListener('click', toggleMenu);

  /* --- Esc zamyka tylko, gdy naprawdę jest otwarte --- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('mobile-open')) {
      closeMenu();
    }
  });

  /* --- Klik w link w nawigacji = zamknij (UX mobilny) --- */
  nav.addEventListener('click', (e) => {
    const link = e.target.closest('a[href], area[href]');
    if (link) closeMenu();
  });

  /* --- Wyjście z mobile (np. rotacja/resize > 768px) — zamknij menu --- */
  const mql = window.matchMedia('(max-width: 768px)');
  const onChange = () => {
    if (!mql.matches) closeMenu();
  };
  if (mql.addEventListener) mql.addEventListener('change', onChange);
  else if (mql.addListener) mql.addListener(onChange); // Safari <14
})();


/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Przycisk „Powrót na górę” ==================================================
   - Pokazuje przycisk po przewinięciu > THRESHOLD
   - rAF odszumia nasłuch scrolla
   - Szanuje prefers-reduced-motion przy płynnym scrollu
   - Aktualizuje stan na: start, load, pageshow (bfcache), visibilitychange, resize
   ======================================================================================= */
(() => {
  const btn = document.getElementById('powrot-na-gore') || document.querySelector('.powrot-na-gore');
  if (!btn) return; // brak przycisku — nic nie robimy

  const THRESHOLD = 300; // px — po tylu pikselach pojawia się przycisk

  /* --- Bezpieczny odczyt pozycji scrolla (zgodność) --- */
  const getScrollTop = () =>
    typeof window.pageYOffset === 'number'
      ? window.pageYOffset
      : (document.scrollingElement || document.documentElement).scrollTop;

  /* --- Uaktualnij widoczność przycisku --- */
  const update = () => {
    btn.classList.toggle('is-visible', getScrollTop() > THRESHOLD);
  };

  /* --- rAF: delikatne „odszumienie” eventów scroll --- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  /* --- Inicjalizacja i typowe powroty z bfcache --- */
  update();
  window.addEventListener('load', update, { once: true });
  window.addEventListener('pageshow', update, { once: true }); // Safari/FF bfcache
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') update();
  });
  window.addEventListener('resize', update); // zmiana wysokości viewportu

  /* --- Reakcja na scroll --- */
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Płynny powrót do góry (+ respect reduced motion) --- */
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // Jeśli z jakiegoś powodu można kliknąć niewidoczny przycisk — ignorujemy
    if (!btn.classList.contains('is-visible')) return;

    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  });
})();

/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== FORMULARZ — submit + walidacja + licznik + success state + Netlify =========
   - Walidacja: required, email, phone (opcjonalny), RODO, reCAPTCHA (Netlify)
   - A11y: aria-invalid, skrót do pierwszego błędu, error summary + skip link
   - Licznik znaków wiadomości + auto-save szkicu w localStorage
   - Wysyłka: POST application/x-www-form-urlencoded (Netlify Forms)
   - Success state: dyskretny, bez przeładowania; GA4 + Meta po sukcesie (prod)
   =========================================================== */
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  /* --- USTAWIENIA / REFERENCJE --- */
  const IS_LOCAL = /localhost|127\.0\.0\.1/.test(location.hostname); // wspólny przełącznik środowiska
  const statusBox = form.querySelector('#formStatus');               // rola: podgląd błędów/sukcesów
  const submitBtn = form.querySelector('.submit-btn');
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Wyślij wiadomość'; // (1) defensywnie
  const requiredFields = ['name', 'email', 'subject', 'service', 'message']; // phone opcjonalny

  const msg = form.querySelector('#message');
  const counter = document.getElementById('messageCounter');
  const MAX = 500;

  // A11y elementy istnieją w HTML (summary + skrót)
  const a11ySummary = form.querySelector('#errorSummary');
  const skipLink = form.querySelector('#skipToError');

  /* --- Skrót „przejdź do pierwszego błędu” (link pod sumarycznym komunikatem) --- */
  if (skipLink) {
    skipLink.addEventListener('click', (ev) => {
      ev.preventDefault();
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
    });
  }

  /* --- Skrót klawiaturowy: Alt+Shift+E → fokus na 1. błędnym polu --- */
  form.addEventListener('keydown', (ev) => {
    const k = ev.key || ev.code;
    if (ev.altKey && ev.shiftKey && (k === 'E' || k === 'KeyE')) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        ev.preventDefault();
        firstInvalid.focus();
      }
    }
  });

  /* --- UTILS: oznaczanie/odznaczanie błędów + status box --- */
  const setInvalid = (el) => { if (!el) return; el.classList.add('is-invalid'); el.setAttribute('aria-invalid', 'true'); };
  const clearInvalid = (el) => { if (!el) return; el.classList.remove('is-invalid'); el.removeAttribute('aria-invalid'); };
  const showStatus = (message, ok = false) => {
    if (!statusBox) return;
    statusBox.classList.toggle('ok', !!ok);
    statusBox.classList.toggle('err', !ok);
    statusBox.textContent = message;
  };

  /* --- Licznik znaków wiadomości + twardy limit --- */
  function updateCounter() {
    if (!msg || !counter) return;
    if (msg.value.length > MAX) msg.value = msg.value.slice(0, MAX);
    const len = msg.value.length;
    counter.textContent = `${len}/${MAX}`;
    counter.classList.toggle('warn', len >= MAX - 50 && len < MAX);
    counter.classList.toggle('limit', len >= MAX);
  }
  updateCounter();

  /* --- AUTO-SAVE szkicu wiadomości (localStorage) --- */
  const MSG_KEY = 'contactFormMessage';
  if (msg) {
    // Przy starcie: odczyt i odświeżenie licznika
    const savedMsg = (() => { try { return localStorage.getItem(MSG_KEY); } catch { return null; } })();
    if (savedMsg) { msg.value = savedMsg; updateCounter(); }

    // Zapis na input (try/catch pod Safari Private)
    msg.addEventListener('input', () => {
      try { localStorage.setItem(MSG_KEY, msg.value); } catch { /* silent */ }
    });
  }

  /* --- Oczyszczanie błędów podczas wpisywania + ukrywanie summary/skip, gdy czysto --- */
  form.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('#name, #email, #subject, #service, #message, #phone, #consent')) clearInvalid(t);
    if (t === msg) updateCounter();

    // Jeśli nie ma już błędów — schowaj summary/skip (a11y)
    if (![...form.querySelectorAll('.is-invalid')].length) {
      if (a11ySummary) a11ySummary.classList.add('visually-hidden');
      if (skipLink) skipLink.classList.add('visually-hidden');
    }
  });

  /* --- Główny handler submit --- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hard guard: nie pozwól na wielokrotny submit
    if (form.getAttribute('aria-busy') === 'true') return;
    showStatus('', false);

    let valid = true;

    /* 1) Required — puste pola */
    requiredFields.forEach((id) => {
      const el = form.querySelector('#' + id);
      if (!el || !el.value || !el.value.trim()) { setInvalid(el); valid = false; }
    });

    /* 2) Email — prosta walidacja struktury */
    const email = form.querySelector('#email');
    const emailVal = email ? email.value.trim() : '';
    if (email && emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setInvalid(email); valid = false; showStatus('Wpisz poprawny adres e-mail.', false);
    }

    /* 3) Telefon (opcjonalny) — akceptuje cyfry, spacje i standardowe separatory */
    const phone = form.querySelector('#phone');
    if (phone) {
      const phoneVal = phone.value.trim();
      if (phoneVal && !/^[0-9 +()-]{7,20}$/.test(phoneVal)) {
        setInvalid(phone); valid = false; showStatus('Wpisz poprawny numer telefonu (np. +48 600 000 000).', false);
      }
    }

    /* 4) RODO — checkbox wymagany */
    const consent = form.querySelector('#consent');
    if (consent && !consent.checked) {
      setInvalid(consent); valid = false; showStatus('Zaznacz zgodę na przetwarzanie danych.', false);
    }

    /* 4.5) reCAPTCHA (Netlify) — tylko gdy widget jest obecny i nie lokalnie */
    const recaptchaWrap = form.querySelector('[data-recaptcha]');
    if (recaptchaWrap && !IS_LOCAL) {
      const tokenField = form.querySelector('[name="g-recaptcha-response"]');
      if (!tokenField || !tokenField.value) { valid = false; showStatus('Potwierdź, że nie jesteś robotem (reCAPTCHA).', false); }
    }

    /* 5) Limit treści wiadomości */
    if (msg && msg.value.length > MAX) {
      setInvalid(msg); valid = false; showStatus(`Wiadomość może mieć maks. ${MAX} znaków.`, false);
    }

    /* --- Gdy są błędy: pokaż podsumowanie i przeskocz do pierwszego błędu --- */
    if (!valid) {
      const invalids = [...form.querySelectorAll('.is-invalid')];

      if (a11ySummary) {
        const labels = invalids.map((el) => {
          const lab = el.id ? form.querySelector(`label[for="${el.id}"]`) : null;
          return lab ? lab.textContent.trim() : el.name || el.id || 'Pole';
        });
        const n = invalids.length;
        const suf = n === 1 ? 'błąd' : n >= 2 && n <= 4 ? 'błędy' : 'błędów';
        a11ySummary.textContent = `Formularz zawiera ${n} ${suf}: ${labels.join(', ')}.`;
        a11ySummary.classList.remove('visually-hidden');
      }
      if (skipLink) skipLink.classList.remove('visually-hidden');

      const firstInvalid = invalids[0];
      if (firstInvalid) firstInvalid.focus();

      if (statusBox && !statusBox.textContent) showStatus('Uzupełnij wymagane pola.', false);
      return;
    }

    /* === SENDING UI === */
    form.setAttribute('aria-busy', 'true');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('sending');
      submitBtn.textContent = 'Wysyłanie…';
    }
    showStatus('Wysyłanie…', true);

    /* --- Przygotowanie danych do Netlify Forms --- */
    const formData = new FormData(form);                            // zawiera też hidden 'form-name'
    const body = new URLSearchParams(formData).toString();          // urlencoded do fetch

    try {
      /* --- Wysyłka: produkcja vs. lokalnie (symulacja) --- */
      if (!IS_LOCAL) {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
          // keepalive: true, // (opcjonalnie) pozwala wysłać, gdy user szybko nawigował dalej
        });
        if (!res.ok) throw new Error('Netlify response not OK');
      } else {
        // Lokalnie: krótkie opóźnienie dla realizmu
        await new Promise((r) => setTimeout(r, 500));
      }

      /* === SUCCESS === */
      form.setAttribute('aria-busy', 'false');                      // (2) sprzątanie flagi
      form.reset();
      try { localStorage.removeItem(MSG_KEY); } catch {}

      updateCounter();
      showStatus('Dziękujemy! Wiadomość została wysłana.', true);

      if (submitBtn) {
        submitBtn.classList.remove('sending');
        submitBtn.classList.add('sent');
        submitBtn.textContent = 'Wysłano ✓';
        setTimeout(() => { submitBtn.disabled = false; }, 1200);
        setTimeout(() => {
          showStatus('', true);
          submitBtn.classList.remove('sent');
          submitBtn.textContent = originalBtnText;
        }, 6000);
      }

      // Posprzątaj A11y (podsumowanie/skip niewidoczne przy czystym stanie)
      if (a11ySummary) a11ySummary.classList.add('visually-hidden');
      if (skipLink) skipLink.classList.add('visually-hidden');

      /* --- TRACKING (tylko produkcja): GA4 + Meta --- */
      if (!IS_LOCAL) {
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', { event_category: 'Formularz', event_label: 'Kontakt — Budownictwo' });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'Lead');
        }
      }
    } catch (err) {
      /* === ERROR PATH === */
      form.setAttribute('aria-busy', 'false');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('sending');
        submitBtn.textContent = originalBtnText;
      }
      showStatus('Ups! Nie udało się wysłać. Spróbuj ponownie za chwilę.', false);
      console.error(err);
    }
  }); // ← koniec submit handlera
})(); // ← koniec IIFE

/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== LIGHTBOX — podgląd zdjęcia + „double-tap to open” na mobile ================
   - Desktop/klawiatura: bez zmian (1 klik otwiera)
   - Mobile (coarse pointer): 1. tap = pokaż overlay i uzbrój kartę, 2. tap (w tę samą) = otwórz
   - Zamknięcie: Esc, klik w tło lub przycisk ×
   - Dostępność: focus-trap, aria-modal, przywracanie fokusu
   ======================================================================================== */
(() => {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const imgEl = lb.querySelector('.lb__img');
  const captionEl = lb.querySelector('.lb__caption');
  const closeBtn = lb.querySelector('.lb__close');
  const backdrop = lb.querySelector('.lb__backdrop');

  let lastActive = null;
  let focusables = [], firstF = null, lastF = null;

  // Wykrywanie „mobile touch” (coarse, bez hover)
  const isTouchLike = window.matchMedia
    ? window.matchMedia('(hover: none) and (pointer: coarse)').matches
    : ('ontouchstart' in window);

  // Stan „uzbrojenia” (pierwszy tap)
  let armedLink = null;
  let armTimer = null;

  const arm = (link) => {
    disarm();
    armedLink = link;
    // pokaż overlay poprzez focus + klasa (dla pewności)
    const item = link.closest('.gallery-item');
    if (item) item.classList.add('is-armed');
    link.focus({ preventScroll: true });

    // auto-rozbrojenie po chwili (1.5s) — naturalne UX
    armTimer = setTimeout(disarm, 1500);

    // dotknięcie w dowolne inne miejsce też rozbraja
    const outsideOnce = (ev) => {
      const t = ev.target;
      if (!t || !armedLink) return;
      if (!t.closest('.gallery-item') || t.closest('.gallery-item') !== armedLink.closest('.gallery-item')) {
        disarm();
      }
    };
    document.addEventListener('touchstart', outsideOnce, { once: true, passive: true });
    document.addEventListener('pointerdown', outsideOnce, { once: true });
  };

  const disarm = () => {
    if (armTimer) { clearTimeout(armTimer); armTimer = null; }
    if (armedLink) {
      const it = armedLink.closest('.gallery-item');
      if (it) it.classList.remove('is-armed');
    }
    armedLink = null;
  };

  // Rozbrojenie przy scrollu/resize (częsty gest po „podglądzie”)
  let disarmTick = false;
  const scheduleDisarm = () => {
    if (disarmTick) return;
    disarmTick = true;
    requestAnimationFrame(() => { disarm(); disarmTick = false; });
  };
  window.addEventListener('scroll', scheduleDisarm, { passive: true });
  window.addEventListener('resize', scheduleDisarm);

  const trapInit = () => {
    focusables = Array.from(lb.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    firstF = focusables[0];
    lastF  = focusables[focusables.length - 1];
  };
  const trapRelease = () => { focusables = []; firstF = lastF = null; };
  const handleTrap = (e) => {
    if (!focusables.length) return;
    if (e.shiftKey && document.activeElement === firstF) { e.preventDefault(); lastF.focus(); }
    else if (!e.shiftKey && document.activeElement === lastF) { e.preventDefault(); firstF.focus(); }
  };

  const open = (src, alt) => {
    lastActive = document.activeElement;
    imgEl.src = src;
    imgEl.alt = alt || '';
    if (alt) { captionEl.textContent = alt; captionEl.hidden = false; } else { captionEl.hidden = true; }
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-open');
    trapInit();
    closeBtn.focus();
    disarm(); // po otwarciu już nie potrzebujemy stanu „armed”
  };

  const close = () => {
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    imgEl.removeAttribute('src');
    trapRelease();
    if (lastActive) lastActive.focus();
  };

  // Delegacja kliknięcia w miniaturę/link w obrębie .gallery-container
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.gallery-link');
    if (!link) return;
    if (!link.closest('.gallery-container')) return;

    // Mobile: double-tap flow
    if (isTouchLike) {
      // jeśli to pierwszy tap w tę miniaturę — tylko uzbrój i pokaż overlay
      if (armedLink !== link) {
        e.preventDefault();
        arm(link);
        return;
      }
      // drugi tap w tę samą miniaturę — otwieramy
      e.preventDefault();
      const href = link.getAttribute('href');
      const thumbImg = link.querySelector('img');
      open(href, thumbImg ? thumbImg.alt : '');
      return;
    }

    // Desktop/klawiatura: normalne otwarcie 1-klik
    e.preventDefault();
    const href = link.getAttribute('href');
    const thumbImg = link.querySelector('img');
    open(href, thumbImg ? thumbImg.alt : '');
  });

  // Zamknięcie: klik w tło / przycisk ×
  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Klawiatura: Esc + Tab (focus-trap)
  document.addEventListener('keydown', (e) => {
    if (lb.getAttribute('aria-hidden') !== 'false') return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') { handleTrap(e); }
  });

  // Prefetch dużego zdjęcia po najechaniu (desktop only)
  if (!isTouchLike) {
    document.addEventListener('mouseenter', (e) => {
      const link = e.target.closest('.gallery-link');
      if (!link || !link.closest('.gallery-container')) return;
      const href = link.getAttribute('href');
      if (!href) return;
      const pre = new Image();
      pre.decoding = 'async';
      pre.src = href;
    }, true);
  }
})();


/* =======================================================================================@@@@@@@@@@@@@@@@@@@@
   ========== Accent Switch (opcjonalne) =================================================
   - Zmienia akcent kolorystyczny (data-accent na <html>)
   - Zapamiętuje wybór w localStorage (safe try/catch)
   - Inicjalizacja: localStorage > atrybut w HTML > fallback 'ocean'
   - API globalne: window.setAccent('nazwa') do debug/testów
   - Delegacja: klik w element z atrybutem [data-accent-pick="nazwa"]
   ======================================================================================= */
(() => {
  const KEY = 'accent';
  const html = document.documentElement;

  /* --- Safe localStorage (np. Safari Private) --- */
  const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  /* --- Ustaw akcent + zapisz (opcjonalnie) --- */
  const applyAccent = (name, persist = true) => {
    if (!name) return;
    html.setAttribute('data-accent', name);
    if (persist) safeSet(KEY, name);
  };

  /* --- Inicjalizacja: localStorage > atrybut w HTML > fallback --- */
  const saved = safeGet(KEY);
  const initial = saved || html.getAttribute('data-accent') || 'ocean';
  applyAccent(initial, false);

  /* --- API globalne: np. w konsoli window.setAccent('sky') --- */
  window.setAccent = applyAccent;

  /* --- Delegacja: dowolny element z [data-accent-pick="nazwa"] --- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accent-pick]');
    if (!btn) return;
    applyAccent(btn.getAttribute('data-accent-pick'), true);
  });
})();



/* ======================================================================
   NAV — dropdown „Usługi” (stabilny)
   - Działa z <button id="servicesToggle"> lub <a id="servicesToggle">
   - A11y: aria-expanded + aria-hidden; Esc zamyka; ArrowDown skok do 1. linku
   - Zamyka się przy kliknięciu poza nawigacją i po wyjściu z mobile
   ====================================================================== */
(() => {
  const nav = document.getElementById('primaryNav');
  if (!nav) return;

  const toggle  = nav.querySelector('#servicesToggle');
  const submenu = nav.querySelector('#servicesMenu');
  const wrapper = toggle?.closest('.has-sub');
  if (!toggle || !submenu || !wrapper) return;

  // Normalizacja a11y
  toggle.setAttribute('aria-haspopup', 'true');
  toggle.setAttribute('aria-expanded', 'false');
  submenu.setAttribute('aria-hidden', 'true');

  const setOpen = (open) => {
    wrapper.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    submenu.setAttribute('aria-hidden', String(!open));
  };

  // Klik/tap w „Usługi”
  toggle.addEventListener('click', (e) => {
    // jeśli to <a>, nie skacz do #:
    if (toggle.tagName === 'A') e.preventDefault();
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Klawiatura: Enter/Spacja = toggle, Esc zamyka; ArrowDown = fokus do 1. pozycji
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = submenu.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
      if (first) first.focus();
    }
  });
  submenu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); toggle.focus(); }
  });

  // Klik/pointer poza nawigacją — zamknij
  const outside = (e) => {
    if (!wrapper.classList.contains('open')) return;
    if (!nav.contains(e.target)) setOpen(false);
  };
  document.addEventListener('pointerdown', outside);
  document.addEventListener('click', outside);

  // Zmiana breakpointu: po wyjściu z mobile zamknij
  const mq = window.matchMedia('(max-width: 768px)');
  const onChange = () => { if (!mq.matches) setOpen(false); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener)   mq.addListener(onChange);
})();
