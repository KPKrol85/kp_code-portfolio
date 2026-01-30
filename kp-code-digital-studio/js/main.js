const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('.nav');
const storageKey = 'theme-preference'
const onClick = () => { theme.value = theme.value === 'light' ? 'dark' : 'light'; setPreference() }
const getColorPreference = () => { if (localStorage.getItem(storageKey)) return localStorage.getItem(storageKey); else return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' }
const setPreference = () => { localStorage.setItem(storageKey, theme.value); reflectPreference() }
const reflectPreference = () => {
  document.firstElementChild.setAttribute('data-theme', theme.value)
  document.querySelector('#theme-toggle')?.setAttribute('aria-label', theme.value)
}
const theme = { value: getColorPreference() }
reflectPreference()
window.onload = () => {
  reflectPreference()
  document.querySelector('#theme-toggle')?.addEventListener('click', onClick)
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches:isDark}) => {
  theme.value = isDark ? 'dark' : 'light'
  setPreference()
})

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) {
      return;
    }
    event.preventDefault();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target.scrollIntoView();
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const revealElements = document.querySelectorAll('[data-reveal]');
if (revealElements.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal', 'is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealElements.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const formMessage = contactForm.querySelector('[data-form-message]');
  const fields = contactForm.querySelectorAll('.form__field');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let hasError = false;

    fields.forEach((field) => {
      field.classList.remove('form__field--error');
      const input = field.querySelector('input, textarea');
      if (!input) {
        return;
      }
      const isValid = input.checkValidity();
      if (!isValid) {
        field.classList.add('form__field--error');
        hasError = true;
      }
    });

    if (hasError) {
      formMessage.textContent = 'Uzupełnij wszystkie pola formularza.';
      return;
    }

    formMessage.textContent = 'Dziękuję! Wrócę z odpowiedzią w ciągu 24h.';
    contactForm.reset();
  });
}

const filterButtons = document.querySelectorAll('[data-filter]');
const projectGrid = document.querySelector('[data-project-grid]');
if (filterButtons.length && projectGrid) {
  const items = Array.from(projectGrid.children);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');

      const filter = button.getAttribute('data-filter');
      items.forEach((item) => {
        const category = item.getAttribute('data-category');
        const visible = filter === 'all' || filter === category;
        item.style.display = visible ? 'grid' : 'none';
      });
    });
  });
}
