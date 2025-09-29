/* ================================================================================
   ========== Animacje pojawiania sekcji przy scrollu (powtarzalne + initial) =====
   ================================================================================ */
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

  const statusBox = form.querySelector('#formStatus');
  const submitBtn = form.querySelector('.submit-btn');
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Wyślij wiadomość';

  const requiredFields = ['name', 'email', 'subject', 'service', 'message']; // phone opcjonalny

  const msg = form.querySelector('#message');
  const counter = document.getElementById('messageCounter');
  const MAX = 500;

  const setInvalid = (el) => { el.classList.add('is-invalid'); el.setAttribute('aria-invalid', 'true'); };
  const clearInvalid = (el) => { el.classList.remove('is-invalid'); el.removeAttribute('aria-invalid'); };
  const showStatus = (msg, ok = false) => {
    statusBox.classList.toggle('ok', ok);
    statusBox.classList.toggle('err', !ok);
    statusBox.textContent = msg;
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

  form.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('#name, #email, #subject, #service, #message, #phone, #consent')) clearInvalid(t);
    if (t === msg) updateCounter();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showStatus('', false);

    let valid = true;

    // 1) required
    requiredFields.forEach((id) => {
      const el = form.querySelector('#' + id);
      if (!el.value.trim()) { setInvalid(el); valid = false; }
    });

    // 2) email
    const email = form.querySelector('#email');
    const emailVal = email.value.trim();
    if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { setInvalid(email); valid = false; showStatus('Wpisz poprawny adres e-mail.', false); }

    // 3) phone (opcjonalny)
    const phone = form.querySelector('#phone');
    if (phone) {
      const phoneVal = phone.value.trim();
      if (phoneVal && !/^[0-9 +()-]{7,20}$/.test(phoneVal)) { setInvalid(phone); valid = false; showStatus('Wpisz poprawny numer telefonu (np. +48 600 000 000).', false); }
    }

    // 4) RODO
    const consent = form.querySelector('#consent');
    if (consent && !consent.checked) { consent.classList.add('is-invalid'); valid = false; showStatus('Zaznacz zgodę na przetwarzanie danych.', false); }

    // 5) limit
    if (msg && msg.value.length > MAX) { setInvalid(msg); valid = false; showStatus(`Wiadomość może mieć maks. ${MAX} znaków.`, false); }

    if (!valid) {
      if (!statusBox.textContent) showStatus('Uzupełnij wymagane pola.', false);
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // === SENDING UI ===
    form.setAttribute('aria-busy', 'true');
    submitBtn.disabled = true;
    submitBtn.classList.add('sending');
    submitBtn.textContent = 'Wysyłanie…';
    showStatus('Wysyłanie…', true);

    // --- Netlify POST (działa po deployu na Netlify) ---
    const isLocal = /localhost|127\.0\.0\.1/.test(location.hostname);
    const formData = new FormData(form); // zawiera też hidden 'form-name'
    const body = new URLSearchParams(formData).toString();

    try {
      if (!isLocal) {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });
        if (!res.ok) throw new Error('Netlify response not OK');
      } else {
        // lokalnie: symulujemy sukces (Netlify nie obsługuje POST na localhost)
        await new Promise(r => setTimeout(r, 500));
      }

      // === SUCCESS ===
      form.setAttribute('aria-busy', 'false');
      form.reset();
      updateCounter();
      showStatus('Dziękujemy! Wiadomość została wysłana.', true);
      submitBtn.classList.remove('sending');
      submitBtn.classList.add('sent');
      submitBtn.textContent = 'Wysłano ✓';
      setTimeout(() => { submitBtn.disabled = false; }, 1200);
      setTimeout(() => {
        showStatus('', true);
        submitBtn.classList.remove('sent');
        submitBtn.textContent = originalBtnText;
      }, 6000);
    } catch (err) {
      // Błąd: dajmy czytelny komunikat
      form.setAttribute('aria-busy', 'false');
      submitBtn.disabled = false;
      submitBtn.classList.remove('sending');
      submitBtn.textContent = originalBtnText;
      showStatus('Ups! Nie udało się wysłać. Spróbuj ponownie za chwilę.', false);
      console.error(err);
    }
  });
})();
