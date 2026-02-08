(() => {
  const root = document.documentElement;
  root.classList.add('js-enabled');
  const STORAGE_KEY = 'easy-move-theme-v1';
  const themeToggle = document.querySelector('[data-theme-toggle]');

  const getPreferredTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.version === 1 && parsed.theme) {
          return parsed.theme;
        }
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const applyTheme = (theme) => {
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  };

  const updateThemeToggle = (theme) => {
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-pressed', theme === 'dark');
    themeToggle.querySelector('span').textContent = theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny';
  };

  const initTheme = () => {
    const stored = getPreferredTheme();
    if (stored) {
      applyTheme(stored);
      updateThemeToggle(stored);
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
    updateThemeToggle(prefersDark ? 'dark' : 'light');
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      updateThemeToggle(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, theme: next }));
    });
  }

  initTheme();

  const header = document.querySelector('[data-header]');
  let lastKnownScroll = 0;
  let ticking = false;
  const onScroll = () => {
    lastKnownScroll = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (header) {
          header.classList.toggle('header--shrink', lastKnownScroll > 10);
        }
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  let lastFocusedElement = null;

  const trapFocus = (event) => {
    if (!mobileNav) return;
    const focusable = mobileNav.querySelectorAll('a, button, summary');
    const focusableArray = Array.from(focusable);
    if (!focusableArray.length) return;
    const first = focusableArray[0];
    const last = focusableArray[focusableArray.length - 1];
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const closeMenu = () => {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.remove('mobile-nav--open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', trapFocus);
    document.removeEventListener('keydown', handleEscape);
    document.removeEventListener('click', handleOutside);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  };

  const handleOutside = (event) => {
    if (!mobileNav || !menuToggle) return;
    if (!mobileNav.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMenu();
    }
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMenu();
        return;
      }
      lastFocusedElement = document.activeElement;
      mobileNav.classList.add('mobile-nav--open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      document.addEventListener('keydown', trapFocus);
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleOutside);
      const firstLink = mobileNav.querySelector('a, button, summary');
      if (firstLink) {
        firstLink.focus();
      }
    });
  }

  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      reveals.forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
      });
    } else {
      reveals.forEach((el) => el.classList.add('reveal--visible'));
    }
  }

  const accordionButtons = document.querySelectorAll('[data-accordion-button]');
  accordionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion__item');
      const isOpen = item.classList.contains('accordion__item--open');
      accordionButtons.forEach((btn) => {
        const parent = btn.closest('.accordion__item');
        parent.classList.remove('accordion__item--open');
        btn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('accordion__item--open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const tabLists = document.querySelectorAll('[data-tabs]');
  tabLists.forEach((tabList) => {
    const tabs = tabList.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll(`[data-tab-panel="${tabList.dataset.tabs}"]`);
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((btn) => btn.setAttribute('aria-selected', 'false'));
        panels.forEach((panel) => panel.classList.remove('tabs__panel--active'));
        tab.setAttribute('aria-selected', 'true');
        const target = document.getElementById(tab.getAttribute('aria-controls'));
        if (target) {
          target.classList.add('tabs__panel--active');
        }
      });
    });
  });

  const backToTop = document.querySelector('[data-back-to-top]');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('back-to-top--visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const status = document.querySelector('[data-form-status]');
    const summary = document.querySelector('[data-form-summary]');

    const validators = {
      name: (value) => value.trim().length >= 3,
      phone: (value) => /^[+\d\s()-]{7,}$/.test(value.trim()),
      email: (value) => /\S+@\S+\.\S+/.test(value.trim()),
      required: (value) => value.trim() !== '',
      consent: (value) => value === true,
    };

    const setError = (field, message) => {
      const error = field.parentElement.querySelector('.form__error');
      const input = field;
      if (error) {
        error.textContent = message;
      }
      input.classList.add('form__field--error');
      input.setAttribute('aria-invalid', 'true');
    };

    const clearError = (field) => {
      const error = field.parentElement.querySelector('.form__error');
      if (error) {
        error.textContent = '';
      }
      field.classList.remove('form__field--error');
      field.setAttribute('aria-invalid', 'false');
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const errors = [];

      const name = form.querySelector('[name="fullName"]');
      const phone = form.querySelector('[name="phone"]');
      const email = form.querySelector('[name="email"]');
      const type = form.querySelector('[name="moveType"]');
      const cityStart = form.querySelector('[name="cityStart"]');
      const cityEnd = form.querySelector('[name="cityEnd"]');
      const date = form.querySelector('[name="moveDate"]');
      const consent = form.querySelector('[name="consent"]');

      const checks = [
        { field: name, valid: validators.name(name.value), message: 'Podaj pełne imię i nazwisko.' },
        { field: phone, valid: validators.phone(phone.value), message: 'Podaj poprawny numer telefonu.' },
        { field: email, valid: validators.email(email.value), message: 'Podaj poprawny adres e-mail.' },
        { field: type, valid: validators.required(type.value), message: 'Wybierz typ przeprowadzki.' },
        { field: cityStart, valid: validators.required(cityStart.value), message: 'Podaj miasto startowe.' },
        { field: cityEnd, valid: validators.required(cityEnd.value), message: 'Podaj miasto docelowe.' },
        { field: date, valid: validators.required(date.value), message: 'Wybierz termin przeprowadzki.' },
        { field: consent, valid: validators.consent(consent.checked), message: 'Potrzebujemy zgody na kontakt.' },
      ];

      checks.forEach(({ field, valid, message }) => {
        if (!valid) {
          errors.push(message);
          setError(field, message);
        } else {
          clearError(field);
        }
      });

      if (summary) {
        summary.innerHTML = '';
      }
      if (status) {
        status.textContent = '';
      }

      if (errors.length) {
        if (summary) {
          const list = document.createElement('ul');
          errors.forEach((errorMessage) => {
            const item = document.createElement('li');
            item.textContent = errorMessage;
            list.appendChild(item);
          });
          summary.appendChild(list);
          summary.focus();
        }
        return;
      }

      form.reset();
      checks.forEach(({ field }) => clearError(field));
      if (status) {
        status.textContent = 'Dziękujemy! Twoje zgłoszenie zostało wysłane. Skontaktujemy się w ciągu 24 godzin.';
      }
    });
  }
})();
