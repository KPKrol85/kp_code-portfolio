/* ================================================================================
   ========== Animacje pojawiania sekcji przy scrollu =============================
   ================================================================================ */

const hiddenElements = document.querySelectorAll('.hidden');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  },
  { threshold: 0.2 }
);

hiddenElements.forEach((el) => observer.observe(el));

const przyciskPowrotu = document.getElementById('powrot-na-gore');

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    przyciskPowrotu.style.display = 'block';
  } else {
    przyciskPowrotu.style.display = 'none';
  }
});

przyciskPowrotu.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});











/* ================================================================================
   ========== Motyw + przełączanie logo + ikonka hamburgera (desktop+mobile) ======
   ================================================================================ */
(() => {
  // Przyciski przełącznika (mogą nie istnieć jednocześnie – sprawdzamy oba)
  const btnDesktop = document.getElementById('themeToggleDesktop');
  const btnMobile = document.getElementById('themeToggleMobile');

  // Logo i hamburger (podmiana źródeł w zależności od motywu)
  const logo = document.querySelector('.logo-img[data-light][data-dark]');
  const hamburgerIcon = document.getElementById('hamburgerIcon');

  // preferencje systemowe
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // Ścieżki do ikon hamburgera (Twoje pliki)
  const HAMBURGER_SRC = {
    light: 'assets/img/icon/hamburger-02-light-mode-40.svg',
    dark: 'assets/img/icon/hamburger-02-dark-mode-40.svg',
  };

  // ——— Pomocnicze ———
  const setLogo = (isDark) => {
    if (!logo) return;
    const next = isDark ? logo.dataset.dark : logo.dataset.light;
    if (logo.getAttribute('src') !== next) logo.setAttribute('src', next);
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

  // Jedyna funkcja ustawiająca motyw (aktualizuje wszystko w 1 miejscu)
  const setTheme = (mode, persist = true) => {
    const isDark = mode === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    setLogo(isDark);
    setHamburgerIcon(isDark);
    syncButtonsA11y(isDark);
    if (persist) localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // ——— Inicjalizacja: localStorage > prefers-color-scheme ———
  const saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
  if (saved === 'dark' || saved === 'light') setTheme(saved, false);
  else setTheme(mq && mq.matches ? 'dark' : 'light', false);

  // ——— Obsługa kliknięć (oba przyciski sterują tym samym stanem) ———
  const onToggle = () => {
    const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(next, true);
  };
  btnDesktop && btnDesktop.addEventListener('click', onToggle);
  btnMobile && btnMobile.addEventListener('click', onToggle);

  // ——— Reakcja na zmianę motywu systemowego (gdy brak zapisu w LS) ———
  if (!saved && mq) {
    const onSystemChange = (e) => setTheme(e.matches ? 'dark' : 'light', false);
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange); // Safari starsze
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
   ========== Przycisk na góre====== ==============================================
   ================================================================================ */

(() => {
  const btn = document.getElementById('powrot-na-gore') || document.querySelector('.powrot-na-gore');
  if (!btn) return;

  const THRESHOLD = 300; // px: po jakim przewinięciu pokazać

  const root = document.scrollingElement || document.documentElement;
  const update = () => {
    btn.classList.toggle('is-visible', root.scrollTop > THRESHOLD);
  };

  // ustaw od razu po załadowaniu/odtworzeniu strony
  window.addEventListener('load', update);
  // reaguj na scroll
  window.addEventListener('scroll', update, { passive: true });
  // powrót z bfcache / zmiana zakładki
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') update();
  });

  // płynny powrót do góry
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  });
})();
