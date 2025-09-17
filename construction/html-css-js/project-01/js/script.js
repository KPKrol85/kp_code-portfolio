/* ======================================================================
   SCRIPT — interakcje UI (bez zależności)
   Sekcje:
   0) Utility
   1) Nawigacja mobilna (toggle + Esc)
   2) Dropdowny w mobile (akordeon na tap)
   3) Rok w stopce
   4) Smooth scroll #top
   5) Formularz kontaktowy (mock, honeypot + UX + auto-hide)
   6) Scrollspy (aktywne linki + aria-current)
   7) Header: precyzyjne --header-h + shrink (FIXED)
   8) Scroll-cue: auto-ukrywanie
   9) Scroll-cue: skok do kolejnej sekcji
  10) Przełącznik motywu (z pamięcią)
  11) Ripple na „Wycena”
  12) HERO — ultra‑wide: blur sync z <picture>
   ====================================================================== */

/* ============================== 0) UTILS ============================== */
const getHeaderH = () => {
  const v = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  );
  return Number.isFinite(v) ? v : 74;
};

/* ============================== 1) NAWIGACJA MOBILNA ============================== */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  const setToggleLabel = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  };

  // stan początkowy labela
  setToggleLabel(menu.classList.contains('open'));

  // otwieranie/zamykanie przyciskiem
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    setToggleLabel(isOpen);
  });

  // zamykanie po kliknięciu w link anchor
  menu.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      setToggleLabel(false);
    });
  });

  // zamykanie klawiszem ESC (drobny UX bonus)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      setToggleLabel(false);
    }
  });
})();

/* ============================== 2) DROPDOWNY W MOBILE ============================== */
(() => {
  const nav = document.getElementById('navMenu');
  if (!nav) return;

  const isMobile = () => window.matchMedia('(max-width:1024px)').matches;

  // stan początkowy: wszystkie zamknięte
  nav.querySelectorAll('.has-dropdown').forEach(li => li.setAttribute('aria-expanded','false'));

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.dropdown-trigger');
    if (!btn || !isMobile()) return;

    const li = btn.closest('.has-dropdown');
    const open = li.getAttribute('aria-expanded') === 'true';

    // zamknij inne otwarte
    nav.querySelectorAll('.has-dropdown[aria-expanded="true"]').forEach(el => {
      if (el !== li) el.setAttribute('aria-expanded','false');
    });

    // przełącz bieżący
    li.setAttribute('aria-expanded', String(!open));
    btn.setAttribute('aria-expanded', String(!open));
    e.preventDefault();
  });

  // gdy wyjdziesz z mobile → zresetuj stan dropdownów
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      nav.querySelectorAll('.has-dropdown').forEach(li => li.setAttribute('aria-expanded','false'));
    }
  });
})();

/* ============================== 3) ROK W STOPCE ============================== */
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ============================== 4) SMOOTH SCROLL #top ============================== */
(() => {
  document.querySelectorAll('a.scroll-top, a[href="#top"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();

/* ============================== 5) FORMULARZ (mock, honeypot + UX + a11y) ============================== */
(() => {
  const form = document.querySelector('.form');
  const note = document.querySelector('.form-note');
  if (!form || !note) return;

  // a11y – czytaj cały komunikat jako jeden blok
  note.setAttribute('aria-atomic', 'true');

  const btnSubmit  = form.querySelector('button[type="submit"]');
  const hpInput    = form.querySelector('input[name="website"]'); // honeypot (id="hp-website" w HTML)
  const phoneInput = form.querySelector('input[name="phone"]');

  // Bezpiecznie ukryj honeypot, nawet jeśli z jakiegoś powodu zabraknie stylu CSS
  if (hpInput) {
    const wrap = hpInput.closest('label, div');
    if (wrap) {
      Object.assign(wrap.style, {
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      });
      wrap.setAttribute('aria-hidden', 'true');
      hpInput.setAttribute('tabindex', '-1');
      hpInput.setAttribute('autocomplete', 'off');
    }
  }

  // Ten sam wzorzec co w HTML (pattern) – PL, z opcjonalnym +48, spacje/kreski dozwolone
  const PL_PHONE = /^(?:\+?48)?[ \-]?(?:\d[ \-]?){9}$/;

  const setBusy = (busy) => {
    form.setAttribute('aria-busy', busy ? 'true' : 'false');
    if (btnSubmit) btnSubmit.disabled = !!busy;
  };

  const showNote = (msg, ok = false) => {
    note.textContent = msg;
    note.classList.toggle('is-ok', ok);
    note.classList.toggle('is-err', !ok);
    // nie zawsze przewijamy, by nie "skakało" przy krótkich formach
    // note.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  const markInvalid = (el, msg) => {
    if (!el) return;
    el.setAttribute('aria-invalid', 'true');
    if (typeof msg === 'string') el.setCustomValidity(msg);
  };

  const clearInvalid = (el) => {
    if (!el) return;
    el.removeAttribute('aria-invalid');
    el.setCustomValidity('');
  };

  // Czyść komunikaty / błędy podczas edycji
  form.addEventListener('input', (e) => {
    // czyść globalną notkę
    if (note.textContent) {
      note.textContent = '';
      note.classList.remove('is-ok', 'is-err');
    }
    // czyść stan błędu pola
    const t = e.target;
    if (t.matches('input, textarea')) clearInvalid(t);

    // dodatkowo: live-walidacja telefonu (opcjonalnie)
    if (t === phoneInput) {
      const raw = phoneInput.value.trim();
      if (raw === '' || PL_PHONE.test(raw)) clearInvalid(phoneInput);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1) HONEYPOT → jeśli wypełniony, traktuj jako spam i kończymy w ciszy
    if (hpInput && hpInput.value.trim() !== '') {
      form.reset();
      return;
    }

    // 2) Walidacja wbudowana
    if (!form.checkValidity()) {
      form.reportValidity();
      // zaznacz pierwsze niepoprawne pole aria-invalid i ustaw focus
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) {
        markInvalid(firstInvalid);
        firstInvalid.focus({ preventScroll: true });
      }
      showNote('Uzupełnij poprawnie wszystkie pola i zaznacz zgodę.', false);
      return;
    }

    // 3) Dodatkowa walidacja numeru
    if (phoneInput) {
      const raw = phoneInput.value.trim();
      if (!PL_PHONE.test(raw)) {
        markInvalid(phoneInput, 'Podaj poprawny numer (np. 600 700 800 lub +48 600 700 800).');
        form.reportValidity();
        showNote('Sprawdź format numeru telefonu.', false);
        phoneInput.focus({ preventScroll: true });
        return;
      }
      clearInvalid(phoneInput);
    }

    // 4) „Wysyłka” (mock)
    setBusy(true);
    showNote('Wysyłanie…', true);

    setTimeout(() => {
      setBusy(false);
      // wyczyść ewentualne aria-invalid
      form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
      form.reset();
      showNote('Dziękujemy! Skontaktujemy się wkrótce.', true);
      note.focus?.();
    }, 900);
  });
})();


/* ============================== 6) SCROLLSPY ============================== */
(() => {
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]:not(.btn)'));
  if (!navLinks.length) return;

  const mapHref = (href) => (href === '#top' ? '#strona-glowna' : href);
  const sections = navLinks
    .map(a => document.querySelector(mapHref(a.getAttribute('href'))))
    .filter(Boolean);

  // 🔹 ZMIANA: aria-current dla aktywnego linku
  const setActive = (id) => {
    navLinks.forEach(a => {
      const match = mapHref(a.getAttribute('href')) === id;
      a.classList.toggle('is-active', match);
      if (match) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  // kliknięcie w link od razu ustawia aktywność (oprócz obserwera)
  navLinks.forEach(a => a.addEventListener('click', () => setActive(mapHref(a.getAttribute('href')))));

  // obserwator sekcji
  const headerH = getHeaderH();
  const observer = new IntersectionObserver((entries) => {
    let best = null;
    for (const e of entries) {
      if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
    }
    if (best) setActive('#' + best.target.id);
  }, {
    rootMargin: `-${headerH + 10}px 0px -60% 0px`,
    threshold: [0, .2, .4, .6, .8, 1]
  });

  sections.forEach(sec => observer.observe(sec));
})();

/* ============================== 7) HEADER: dokładne --header-h + SHRINK ============================== */
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let isShrink = false;
  const ENTER = 16, EXIT = 4;

  const syncVar = () => {
    const h = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-h', `${h}px`);
  };

  // aktualizuj przy zmianie rozmiaru samego headera (wrapy, fonty, shrink)
  const ro = new ResizeObserver(syncVar);
  ro.observe(header);

  // po załadowaniu czcionek — wysokość może się nieznacznie zmienić
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncVar).catch(()=>{});
  }

  const apply = (want) => {
    if (want === isShrink) { syncVar(); return; }
    isShrink = want;
    header.classList.toggle('is-shrink', isShrink);
    // syncVar po klasie, aby body padding-top był zawsze równy (bez „prześwitu”)
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
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', syncVar);
})();


/* ============================== 10) MOTYW (z pamięcią) ============================== */
(() => {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const root = document.documentElement;
  const KEY = 'theme';
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const saved = localStorage.getItem(KEY);
  const initial = saved || (prefersDark ? 'dark' : 'light');

  const apply = (mode) => {
    root.setAttribute('data-theme', mode);
    btn.setAttribute('aria-label', mode === 'dark' ? 'Przełącz na jasny tryb' : 'Przełącz na ciemny tryb');
    btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false'); // a11y
    localStorage.setItem(KEY, mode);
  };

  apply(initial);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    apply(current === 'dark' ? 'light' : 'dark');
  });
})();


/* ============================== 11) RIPPLE — „Wycena” ============================== */
(() => {
  const btn = document.querySelector('.nav-menu li > a.btn.btn--sm');
  if (!btn) return;

  const prefersReduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const spawn = (x, y) => {
    const rect = btn.getBoundingClientRect();
    const d = Math.hypot(rect.width, rect.height);
    const old = btn.querySelector('.ripple'); if (old) old.remove();

    const ink = document.createElement('span');
    ink.className = 'ripple';
    ink.style.width = ink.style.height = `${d}px`;
    ink.style.left = `${x - rect.left - d/2}px`;
    ink.style.top  = `${y - rect.top  - d/2}px`;
    btn.appendChild(ink);
    ink.addEventListener('animationend', () => ink.remove());
  };

  btn.addEventListener('pointerdown', (e) => {
    if (!prefersReduced) spawn(e.clientX, e.clientY);
  });
  btn.addEventListener('keydown', (e) => {
    if (prefersReduced) return;
    const isEnter = e.key === 'Enter';
    const isSpace = e.key === ' ' || e.code === 'Space';
    if (!isEnter && !isSpace) return;
    const rect = btn.getBoundingClientRect();
    spawn(rect.left + rect.width/2, rect.top + rect.height/2);
    if (isSpace) { e.preventDefault(); btn.click(); }
  });
})();

/* ============================== 12) HERO — ultra‑wide: blur sync z <picture> ============================== */
(() => {
  const picImg = document.querySelector('.hero-bg img');
  const blurLay = document.querySelector('.hero__bg-blur');
  if (!picImg || !blurLay) return;

  let rafId, debTimer;

  // Ustaw tło na faktycznie użyty plik z <picture>/<srcset> (format + rozdzielczość)
  const syncBlurBg = () => {
    const url = picImg.currentSrc || picImg.src;
    if (!url) return;
    // tylko jeśli się zmieniło — mniej repaintów
    const want = `url("${url}")`;
    if (blurLay.style.backgroundImage !== want) {
      blurLay.style.backgroundImage = want;
    }
  };

  // Po załadowaniu konkretnego wariantu obrazka
  const onImgLoad = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(syncBlurBg);
  };

  // Przy zmianie rozmiaru okna (może zmienić się wariant z srcset/sizes/DPR)
  const onResize = () => {
    clearTimeout(debTimer);
    debTimer = setTimeout(syncBlurBg, 150);
  };

  // Gdy karta wraca do aktywności (czasem przeglądarki przełączają wariant „po cichu”)
  const onVis = () => {
    if (document.visibilityState === 'visible') syncBlurBg();
  };

  // Gdy <img src/srcset> zostanie przestawione programowo (np. lazy-hydration)
  const mo = new MutationObserver(() => syncBlurBg());
  mo.observe(picImg, { attributes: true, attributeFilter: ['src', 'srcset', 'sizes'] });

  // Start
  if (document.readyState === 'complete') syncBlurBg();
  else window.addEventListener('load', syncBlurBg, { once: true });

  picImg.addEventListener('load', onImgLoad);
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVis);

  // Sprzątanie (opcjonalne, jeśli masz router SPA możesz wywołać ręcznie)
  window.addEventListener('pagehide', () => {
    mo.disconnect();
    picImg.removeEventListener('load', onImgLoad);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    cancelAnimationFrame(rafId);
    clearTimeout(debTimer);
  });
})();


/* ============================== FLOATING SCROLL BUTTONS (mijanka w połowie) ============================== */
(() => {
  const init = () => {
    const btnTop = document.querySelector('.scroll-top-float');       // ↑ do góry (na dole ekranu)
    const btnBottom = document.querySelector('.scroll-bottom-float'); // ↓ na dół (na górze ekranu)
    const navMenu = document.getElementById('navMenu');

    if (!btnTop && !btnBottom) return;

    // Kliknięcia
    btnTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    btnBottom?.addEventListener('click', () => {
      const doc = document.documentElement;
      const total = Math.max(doc.scrollHeight, document.body.scrollHeight);
      window.scrollTo({ top: total, behavior: 'smooth' });
    });

    // Pokazywanie/ukrywanie
    const update = () => {
      const doc = document.documentElement;
      const scrollY = window.scrollY || doc.scrollTop || 0;
      const viewport = window.innerHeight;
      const total = Math.max(doc.scrollHeight, document.body.scrollHeight);
      const maxScroll = Math.max(0, total - viewport);
      const mid = maxScroll / 2;

      const nearTop = scrollY < 40;                 // chowaj „↑” tuż przy szczycie
      const nearBottom = scrollY > maxScroll - 40;  // chowaj „↓” tuż przy dole
      const menuOpen = !!(navMenu && navMenu.classList.contains('open'));

      // Mijanka: górna połowa → tylko „↓”; dolna połowa → tylko „↑”
      btnTop?.classList.toggle('is-hidden', (scrollY <= mid) || nearTop);
      btnBottom?.classList.toggle('is-hidden', (scrollY > mid) || nearBottom || menuOpen);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // Reaguj także na otwieranie/zamykanie menu (bez scrolla)
    if (navMenu) {
      const mo = new MutationObserver(update);
      mo.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
      window.addEventListener('pagehide', () => mo.disconnect(), { once: true });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* ============================== NAV — zamknij menu po kliknięciu linku i wróć focusem na toggle ============================== */
(() => {
  const menu = document.getElementById('navMenu');
  const toggle = document.querySelector('.nav-toggle');
  if (!menu || !toggle) return;

  const isMobile = () => window.matchMedia('(max-width: 1024px)').matches;
  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  };

  // Linki przewijające w obrębie strony
  menu.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => { if (isMobile()) closeMenu(); });
  });

  // (opcjonalnie) Zamykaj też po Esc, gdy menu jest otwarte
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobile() && menu.classList.contains('open')) {
      closeMenu();
    }
  });
})();
