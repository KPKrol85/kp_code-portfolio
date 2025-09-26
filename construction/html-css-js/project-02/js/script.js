/* =============== Motyw + przełączanie logo (spójny moduł) =============== */
(() => {
  const btn = document.getElementById('themeToggle'); // nowy dyskretny przycisk
  const logo = document.querySelector('.logo-img[data-light][data-dark]');
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  // Podmień src logo zależnie od motywu
  const setLogo = (isDark) => {
    if (!logo) return;
    const next = isDark ? logo.dataset.dark : logo.dataset.light;
    if (logo.getAttribute('src') !== next) logo.setAttribute('src', next);
  };

  // Jedyna funkcja ustawiająca motyw w całej aplikacji
  const setTheme = (mode, persist = true) => {
    const isDark = mode === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    if (btn) btn.setAttribute('aria-pressed', String(isDark));
    setLogo(isDark);
    if (persist) localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // Start: localStorage > prefers-color-scheme
  const saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
  if (saved === 'dark' || saved === 'light') setTheme(saved, false);
  else setTheme(mq && mq.matches ? 'dark' : 'light', false);

  // Klik przycisku
  if (btn) {
    btn.addEventListener('click', () => {
      const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
      setTheme(next, true);
    });
  }

  // Gdy brak zapisanej preferencji — śledź zmianę systemową
  if (!saved && mq) {
    const onSystemChange = (e) => setTheme(e.matches ? 'dark' : 'light', false);
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange); // starsze Safari
  }
})();











// Animacje pojawiania sekcji przy scrollu
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






















