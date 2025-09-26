// === Tryb jasny/ciemny + przełączanie logo (1 <img>) ===
(() => {
  const toggle = document.getElementById('darkModeToggle');
  const logo = document.querySelector('.logo-img[data-light][data-dark]');
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const setLogo = (isDark) => {
    if (!logo) return;
    const nextSrc = isDark ? logo.dataset.dark : logo.dataset.light;
    if (logo.getAttribute('src') !== nextSrc) {
      logo.setAttribute('src', nextSrc);
    }
  };

  const applyTheme = (isDark, persist = true) => {
    document.body.classList.toggle('dark-mode', isDark);
    if (toggle) toggle.checked = isDark;
    setLogo(isDark);
    if (persist) localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // Stan startowy: preferencja zapisana lub systemowa
  const saved = localStorage.getItem('theme'); // 'dark' | 'light' | null
  const startIsDark = saved ? saved === 'dark' : (mq ? mq.matches : false);
  applyTheme(startIsDark, false);

  // Zmiana przez użytkownika
  toggle?.addEventListener('change', (e) => {
    applyTheme(e.target.checked, true);
  });

  // Jeśli brak zapisanej preferencji, reaguj na zmianę motywu systemowego
  if (!saved && mq) {
    const onSystemChange = (e) => applyTheme(e.matches, false);
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange); // Safari starsze
  }
})();








// Animacje pojawiania sekcji przy scrollu
const hiddenElements = document.querySelectorAll('.hidden');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.2 });

hiddenElements.forEach(el => observer.observe(el));

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
  



// Płynny powrót na górę po kliknięciu logo
const logoLink = document.querySelector('.logo');
if (logoLink) {
  logoLink.addEventListener('click', (e) => {
    // Jeśli logo ma href="#" albo bieżącą stronę, przewiń płynnie zamiast skakać
    const href = logoLink.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
