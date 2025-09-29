/* ===
   ========== Animacje pojawiania sekcji przy scrollu (powtarzalne + initial) =====
   =======*/
(() => {
  const hiddenElements = document.querySelectorAll('.hidden');
  if (!hiddenElements.length) return;

  // Fallback dla bardzo starych przeglądarek
  if (!('IntersectionObserver' in window)) {
    hiddenElements.forEach((el) => el.classList.add('show'));
    return;
  }

  // Histereza: dodajemy show gdy ratio > ENTER, zdejmujemy gdy ratio == 0
  const ENTER_RATIO = 0.12; // ok. 12% w kadrze wystarcza
  const ROOT_MARGIN = '0px 0px -10% 0px'; // lekko wcześniej na dole

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Dodaj, gdy sensownie widać
        if (entry.intersectionRatio > ENTER_RATIO) {
          entry.target.classList.add('show');
        }
        // Zdejmij dopiero, gdy całkiem zniknie z widoku
        else if (entry.intersectionRatio === 0) {
          entry.target.classList.remove('show');
        }
      });
    },
    {
      root: null,
      rootMargin: ROOT_MARGIN,
      threshold: [0, ENTER_RATIO, 0.5, 1],
    }
  );

  hiddenElements.forEach((el) => observer.observe(el));

  // Initial reveal: pokaż wszystko, co już jest w kadrze na starcie
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

  // Odpal najszybciej jak się da i przy standardowych wejściach
  initialReveal();
  window.addEventListener('load', initialReveal, { once: true });
  window.addEventListener('pageshow', initialReveal, { once: true });
})();

/* ================================================================================
   ========== Motyw + przełączanie logo + ikonka hamburgera (desktop+mobile) ======
   ================================================================================ */
(() => {
  const btnDesktop = document.getElementById('themeToggleDesktop');
  const btnMobile = document.getElementById('themeToggleMobile');
  const logos = document.querySelectorAll('.logo-img[data-light][data-dark]');
  const hamburgerIcon = document.getElementById('hamburgerIcon');

  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const HAMBURGER_SRC = {
    light: 'assets/img/icon/hamburger-02-light-mode-40.svg',
    dark: 'assets/img/icon/hamburger-02-dark-mode-40.svg',
  };

  const setLogo = (isDark) => {
    logos.forEach((img) => {
      const next = isDark ? img.dataset.dark : img.dataset.light;
      if (img.src !== new URL(next, document.baseURI).href) img.setAttribute('src', next);
    });
  };

  const setHamburgerIcon = (isDark) => {
    if (!hamburgerIcon) return;
    const next = isDark ? HAMBURGER_SRC.dark : HAMBURGER_SRC.light;
    if (hamburgerIcon.getAttribute('src') !== next) hamburgerIcon.setAttribute('src', next);
  };

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

  const safeSetItem = (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* np. tryb prywatny Safari */
    }
  };
  const safeGetItem = (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };

  // Jedyna funkcja ustawiająca motyw
  const setTheme = (mode, persist = true) => {
    const isDark = mode === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    setLogo(isDark);
    setHamburgerIcon(isDark);
    syncButtonsA11y(isDark);
    if (persist) safeSetItem('theme', isDark ? 'dark' : 'light');
  };

  // Inicjalizacja: localStorage > prefers-color-scheme
  const saved = safeGetItem('theme'); // 'dark' | 'light' | null
  if (saved === 'dark' || saved === 'light') setTheme(saved, false);
  else setTheme(mq && mq.matches ? 'dark' : 'light', false);

  // Obsługa kliknięć
  const onToggle = () => {
    const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(next, true);
  };
  if (btnDesktop) btnDesktop.addEventListener('click', onToggle);
  if (btnMobile) btnMobile.addEventListener('click', onToggle);

  // Reakcja na zmianę motywu systemowego (gdy brak zapisu w LS)
  if (!saved && mq) {
    const onSystemChange = (e) => setTheme(e.matches ? 'dark' : 'light', false);
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }
})();

/* ================================================================================
   ========== Hamburger (mobile nav) ==============================================
   ================================================================================ */
(() => {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('primaryNav');
  if (!btn || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('mobile-open');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Otwórz menu');
    document.body.classList.remove('menu-open');
  };

  const toggleMenu = () => {
    const isOpen = !nav.classList.contains('mobile-open');
    nav.classList.toggle('mobile-open', isOpen);
    btn.classList.toggle('active', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
    document.body.classList.toggle('menu-open', isOpen);
  };

  btn.addEventListener('click', toggleMenu);

  // ESC zamyka
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Klik w link w nawigacji zamyka
  nav.addEventListener('click', (e) => {
    if (e.target.matches('a')) closeMenu();
  });

  // Wyjście z mobile (np. rotacja/resize > 768px) – zamknij menu
  const mql = window.matchMedia('(max-width: 768px)');
  const onChange = () => {
    if (!mql.matches) closeMenu();
  };
  if (mql.addEventListener) mql.addEventListener('change', onChange);
  else if (mql.addListener) mql.addListener(onChange);
})();

/* ================================================================================
   ========== Przycisk „Powrót na górę” ===========================================
   ================================================================================ */
(() => {
  const btn = document.getElementById('powrot-na-gore') || document.querySelector('.powrot-na-gore');
  if (!btn) return;

  const THRESHOLD = 300; // px

  const getScrollTop = () =>
    typeof window.pageYOffset === 'number'
      ? window.pageYOffset
      : (document.scrollingElement || document.documentElement).scrollTop;

  const update = () => {
    btn.classList.toggle('is-visible', getScrollTop() > THRESHOLD);
  };

  // rAF: delikatne „odszumienie” eventów scroll
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  // Ustaw stan na starcie i przy typowych powrotach z bfcache
  update();
  window.addEventListener('load', update, { once: true });
  window.addEventListener('pageshow', update, { once: true }); // Safari/FF bfcache
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') update();
  });

  // Reaguj na scroll
  window.addEventListener('scroll', onScroll, { passive: true });

  // Płynny powrót do góry
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  });
})();

/* ============================================================
   07) KONTAKT — submit + walidacja + licznik + success state + Netlify
============================================================ */
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // USTAWIENIA / REFERENCJE
  const IS_LOCAL = /localhost|127\.0\.0\.1/.test(location.hostname); // ← 1x deklaracja, używamy wszędzie
  const statusBox = form.querySelector('#formStatus');
  const submitBtn = form.querySelector('.submit-btn');
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Wyślij wiadomość';
  const requiredFields = ['name', 'email', 'subject', 'service', 'message']; // phone opcjonalny

  const msg = form.querySelector('#message');
  const counter = document.getElementById('messageCounter');
  const MAX = 500;

  // A11y: odwołania do elementów z HTML (już istnieją)
  const a11ySummary = form.querySelector('#errorSummary');
  const skipLink = form.querySelector('#skipToError');
  if (skipLink) {
    skipLink.addEventListener('click', (ev) => {
      ev.preventDefault();
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
    });
  }
  // Skrót: Alt+Shift+E → fokus na 1. błędnym polu
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

  // UTILS
  const setInvalid = (el) => {
    if (!el) return;
    el.classList.add('is-invalid');
    el.setAttribute('aria-invalid', 'true');
  };
  const clearInvalid = (el) => {
    if (!el) return;
    el.classList.remove('is-invalid');
    el.removeAttribute('aria-invalid');
  };
  const showStatus = (message, ok = false) => {
    if (!statusBox) return; // bezpiecznik
    statusBox.classList.toggle('ok', !!ok);
    statusBox.classList.toggle('err', !ok);
    statusBox.textContent = message;
  };

  function updateCounter() {
    if (!msg || !counter) return;
    if (msg.value.length > MAX) msg.value = msg.value.slice(0, MAX);
    const len = msg.value.length;
    counter.textContent = `${len}/${MAX}`;
    counter.classList.toggle('warn', len >= MAX - 50 && len < MAX);
    counter.classList.toggle('limit', len >= MAX);
  }
  updateCounter();

  // AUTO-SAVE szkicu wiadomości (localStorage)
  const MSG_KEY = 'contactFormMessage';
  if (msg) {
    // Przy starcie: odczytaj poprzedni szkic
    const savedMsg = localStorage.getItem(MSG_KEY);
    if (savedMsg) {
      msg.value = savedMsg;
      updateCounter();
    }

    // Na każdą zmianę: zapisz
    msg.addEventListener('input', () => {
      try {
        localStorage.setItem(MSG_KEY, msg.value);
      } catch {
        // np. tryb prywatny Safari
      }
    });
  }

  form.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('#name, #email, #subject, #service, #message, #phone, #consent')) clearInvalid(t);
    if (t === msg) updateCounter();

    // Jeśli nie ma już błędów — schowaj summary/skip
    if (![...form.querySelectorAll('.is-invalid')].length) {
      if (a11ySummary) a11ySummary.classList.add('visually-hidden');
      if (skipLink) skipLink.classList.add('visually-hidden');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.getAttribute('aria-busy') === 'true') return; // hard guard
    showStatus('', false);

    let valid = true;

    // 1) required
    requiredFields.forEach((id) => {
      const el = form.querySelector('#' + id);
      if (!el || !el.value || !el.value.trim()) {
        setInvalid(el);
        valid = false;
      }
    });

    // 2) email
    const email = form.querySelector('#email');
    const emailVal = email ? email.value.trim() : '';
    if (email && emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setInvalid(email);
      valid = false;
      showStatus('Wpisz poprawny adres e-mail.', false);
    }

    // 3) phone (opcjonalny)
    const phone = form.querySelector('#phone');
    if (phone) {
      const phoneVal = phone.value.trim();
      if (phoneVal && !/^[0-9 +()-]{7,20}$/.test(phoneVal)) {
        setInvalid(phone);
        valid = false;
        showStatus('Wpisz poprawny numer telefonu (np. +48 600 000 000).', false);
      }
    }

    // 4) RODO
    const consent = form.querySelector('#consent');
    if (consent && !consent.checked) {
      setInvalid(consent);
      valid = false;
      showStatus('Zaznacz zgodę na przetwarzanie danych.', false);
    }

    // 4.5) reCAPTCHA (tylko kiedy Netlify wstawi widget i nie jesteśmy lokalnie)
    const recaptchaWrap = form.querySelector('[data-recaptcha]');
    if (recaptchaWrap && !IS_LOCAL) {
      const tokenField = form.querySelector('[name="g-recaptcha-response"]');
      if (!tokenField || !tokenField.value) {
        valid = false;
        showStatus('Potwierdź, że nie jesteś robotem (reCAPTCHA).', false);
      }
    }

    // 5) limit
    if (msg && msg.value.length > MAX) {
      setInvalid(msg);
      valid = false;
      showStatus(`Wiadomość może mieć maks. ${MAX} znaków.`, false);
    }

    if (!valid) {
      // ARIA SUMMARY + SKIP (tylko gdy są błędy)
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

    // === SENDING UI ===
    form.setAttribute('aria-busy', 'true');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('sending');
      submitBtn.textContent = 'Wysyłanie…';
    }
    showStatus('Wysyłanie…', true);

    // --- Netlify POST (działa po deployu na Netlify) ---
    const formData = new FormData(form); // zawiera też hidden 'form-name' i g-recaptcha-response (po rozwiązaniu)
    const body = new URLSearchParams(formData).toString();

    try {
      if (!IS_LOCAL) {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
        });
        if (!res.ok) throw new Error('Netlify response not OK');
      } else {
        // lokalnie: symulujemy sukces
        await new Promise((r) => setTimeout(r, 500));
      }

      // === SUCCESS ===
      form.setAttribute('aria-busy', 'false');
      form.reset();
      try {
        localStorage.removeItem(MSG_KEY);
      } catch {}

      updateCounter();
      showStatus('Dziękujemy! Wiadomość została wysłana.', true);
      if (submitBtn) {
        submitBtn.classList.remove('sending');
        submitBtn.classList.add('sent');
        submitBtn.textContent = 'Wysłano ✓';
        setTimeout(() => {
          submitBtn.disabled = false;
        }, 1200);
        setTimeout(() => {
          showStatus('', true);
          submitBtn.classList.remove('sent');
          submitBtn.textContent = originalBtnText;
        }, 6000);
      }

      // Sprzątanie A11y po sukcesie
      if (a11ySummary) a11ySummary.classList.add('visually-hidden');
      if (skipLink) skipLink.classList.add('visually-hidden');

      /* TRACKING — GA4 + Meta (tylko po sukcesie i nie lokalnie) */
      if (!IS_LOCAL) {
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', { event_category: 'Formularz', event_label: 'Kontakt — Budownictwo' });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'Lead');
        }
      }
    } catch (err) {
      // Błąd: dajmy czytelny komunikat
      form.setAttribute('aria-busy', 'false');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('sending');
        submitBtn.textContent = originalBtnText;
      }
      showStatus('Ups! Nie udało się wysłać. Spróbuj ponownie za chwilę.', false);
      console.error(err);
    }
  }); // ← koniec addEventListener('submit', ...)
})(); // ← koniec IIFE



/* ======================================================================
   LIGHTBOX — prosty podgląd zdjęcia (bez karuzeli)
   - Otwiera się po kliknięciu w .gallery-link (delegacja zdarzeń)
   - Zamknięcie: Esc, klik w tło lub przycisk ×
   - Dostępność: focus-trap, aria-modal, przywracanie fokusu
   ====================================================================== */
(() => {
  const lb = document.getElementById('lightbox');
  if (!lb) return; // brak kontenera — nic nie robimy

  const imgEl = lb.querySelector('.lb__img');
  const captionEl = lb.querySelector('.lb__caption');
  const closeBtn = lb.querySelector('.lb__close');
  const backdrop = lb.querySelector('.lb__backdrop');

  let lastActive = null;
  let focusables = [], firstF = null, lastF = null;

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
  };

  const close = () => {
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-open');
    imgEl.removeAttribute('src');
    trapRelease();
    if (lastActive) lastActive.focus();
  };

  // Delegacja: kliknięcie w miniaturę/link w obrębie .gallery-container
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.gallery-link');
    if (!link) return;
    if (!link.closest('.gallery-container')) return; // tylko galeria
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

  // Drobny UX: prefetch dużego zdjęcia po najechaniu (opcjonalnie, lekko)
  document.addEventListener('mouseenter', (e) => {
    const link = e.target.closest('.gallery-link');
    if (!link || !link.closest('.gallery-container')) return;
    const href = link.getAttribute('href');
    if (!href) return;
    const pre = new Image();
    pre.decoding = 'async';
    pre.src = href;
  }, true);
})();





/* ===== ACCENT SWITCH (optional) =================================== */
(() => {
  const KEY = 'accent';
  const html = document.documentElement;

  const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  const applyAccent = (name, persist = true) => {
    if (!name) return;
    html.setAttribute('data-accent', name);
    if (persist) safeSet(KEY, name);
  };

  // Init: localStorage > atrybut w HTML > 'ocean'
  const saved = safeGet(KEY);
  const initial = saved || html.getAttribute('data-accent') || 'ocean';
  applyAccent(initial, false);

  // API globalnie (ułatwia testy w konsoli)
  window.setAccent = applyAccent;

  // Delegacja: dowolny element z [data-accent-pick="nazwa"]
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accent-pick]');
    if (!btn) return;
    applyAccent(btn.getAttribute('data-accent-pick'), true);
  });
})();
/* ===== KONIEC ===== */


/* ===== Accent Picker UI (toggle + a11y) ========================== */
(() => {
  const picker = document.querySelector('[data-accent-panel]');
  if (!picker) return;
  const toggle = picker.querySelector('[data-accent-toggle]');
  const panel = picker.querySelector('.accent-picker__panel');
  const swatches = Array.from(picker.querySelectorAll('[data-accent-pick]'));
  picker.hidden = false;

  const open = () => { picker.dataset.open = 'true'; toggle.setAttribute('aria-expanded', 'true'); panel.focus({ preventScroll: true }); };
  const close = () => { picker.dataset.open = 'false'; toggle.setAttribute('aria-expanded', 'false'); };

  toggle.addEventListener('click', () => { (picker.dataset.open === 'true') ? close() : open(); });

  document.addEventListener('click', (e) => {
    if (picker.dataset.open !== 'true') return;
    if (e.target.closest('[data-accent-panel]')) return;
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (picker.dataset.open === 'true' && e.key === 'Escape') { close(); toggle.focus(); }
  });

  // Nawigacja klawiszami w gridzie
  panel.addEventListener('keydown', (e) => {
    const cols = 4;
    const i = swatches.indexOf(document.activeElement);
    if (i === -1) return;
    let n = null;
    if (e.key === 'ArrowRight') n = i + 1;
    if (e.key === 'ArrowLeft') n = i - 1;
    if (e.key === 'ArrowDown') n = i + cols;
    if (e.key === 'ArrowUp') n = i - cols;
    if (n != null) { e.preventDefault(); const next = swatches[(n + swatches.length) % swatches.length]; next?.focus(); }
  });
})();
