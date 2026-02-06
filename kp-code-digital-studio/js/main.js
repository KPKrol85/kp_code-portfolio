const navToggle = document.querySelector('[data-nav-toggle]');
const navBackdrop = document.querySelector('[data-nav-backdrop]');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const navDesktopQuery = window.matchMedia('(min-width: 1024px)');

const getFocusableNavItems = () => {
  if (!navLinks) {
    return [];
  }
  return Array.from(
    navLinks.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
  ).filter((el) => el.getClientRects().length);
};

const setNavAria = (isOpen) => {
  if (!navToggle || !navLinks) {
    return;
  }
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
  navLinks.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
};

const openNav = () => {
  if (!nav || !navLinks || !navToggle || navDesktopQuery.matches) {
    return;
  }
  if (nav.classList.contains('nav--open')) {
    return;
  }
  nav.classList.add('nav--open');
  document.body.classList.add('nav-open');
  setNavAria(true);
  document.addEventListener('keydown', handleNavKeydown);
  requestAnimationFrame(() => {
    const focusTarget = navLinks.querySelector('.nav__link');
    focusTarget?.focus();
  });
};

const closeNav = (returnFocus = true) => {
  if (!nav || !navLinks || !navToggle) {
    return;
  }
  if (!nav.classList.contains('nav--open')) {
    setNavAria(false);
    document.body.classList.remove('nav-open');
    return;
  }
  nav.classList.remove('nav--open');
  document.body.classList.remove('nav-open');
  setNavAria(false);
  document.removeEventListener('keydown', handleNavKeydown);
  if (returnFocus) {
    navToggle.focus();
  }
};

const handleNavKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeNav();
    return;
  }
  if (event.key !== 'Tab') {
    return;
  }
  const focusable = getFocusableNavItems();
  if (!focusable.length) {
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!navLinks.contains(document.activeElement)) {
    event.preventDefault();
    first.focus();
    return;
  }
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return;
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const syncNavToViewport = () => {
  if (!navLinks) {
    return;
  }
  if (navDesktopQuery.matches) {
    closeNav(false);
    navLinks.removeAttribute('aria-hidden');
    return;
  }
  const isOpen = nav?.classList.contains('nav--open');
  navLinks.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
};

if (navToggle) {
  navToggle.addEventListener('click', () => {
    if (nav?.classList.contains('nav--open')) {
      closeNav();
      return;
    }
    openNav();
  });
}

if (navBackdrop) {
  navBackdrop.addEventListener('click', () => closeNav());
}

if (navLinks) {
  navLinks.addEventListener('click', (event) => {
    const link = event.target.closest('.nav__link');
    if (link && !navDesktopQuery.matches) {
      closeNav();
    }
  });
}

syncNavToViewport();
navDesktopQuery.addEventListener('change', syncNavToViewport);

const initHeaderShrink = () => {
  const header = document.querySelector('.header');
  if (!header) {
    return;
  }

  const enter = 18;
  const exit = 8;
  let isShrink = false;
  let ticking = false;

  const apply = () => {
    ticking = false;
    const y = window.scrollY || window.pageYOffset;

    if (y <= 0) {
      if (isShrink) {
        isShrink = false;
        header.classList.remove('is-shrink');
      }
      return;
    }

    if (!isShrink && y >= enter) {
      isShrink = true;
      header.classList.add('is-shrink');
      return;
    }

    if (isShrink && y <= exit) {
      isShrink = false;
      header.classList.remove('is-shrink');
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  apply();
};

initHeaderShrink();

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
  const formSummary = contactForm.querySelector('[data-form-summary]');
  const fields = Array.from(contactForm.querySelectorAll('.form__field'));
  const fieldInputs = fields
    .map((field) => field.querySelector('input, textarea, select'))
    .filter(Boolean);

  const getFieldErrorElement = (field) => field.querySelector('.form__error');

  const getBaseDescribedBy = (input) => {
    if (!input.dataset.describedbyBase) {
      input.dataset.describedbyBase = input.getAttribute('aria-describedby') || '';
    }
    return input.dataset.describedbyBase;
  };

  const setDescribedBy = (input, errorId) => {
    const base = getBaseDescribedBy(input);
    const ids = new Set(base.split(' ').filter(Boolean));
    if (errorId) {
      ids.add(errorId);
    } else {
      ids.delete(errorId);
    }
    const describedBy = Array.from(ids).join(' ');
    if (describedBy) {
      input.setAttribute('aria-describedby', describedBy);
    } else {
      input.removeAttribute('aria-describedby');
    }
  };

  const validateField = (input) => {
    const value = input.value.trim();
    if (input.hasAttribute('required') && !value) {
      return { valid: false, message: 'To pole jest wymagane.' };
    }
    if (input.type === 'email' && value && input.validity.typeMismatch) {
      return { valid: false, message: 'Podaj poprawny adres e-mail.' };
    }
    if (input.tagName === 'TEXTAREA' && input.hasAttribute('minlength')) {
      const minLength = Number(input.getAttribute('minlength'));
      if (value.length < minLength) {
        return { valid: false, message: 'Wiadomość jest za krótka.' };
      }
    }
    return { valid: true, message: '' };
  };

  const setFieldError = (field, message) => {
    const input = field.querySelector('input, textarea, select');
    const errorElement = getFieldErrorElement(field);
    if (!input || !errorElement) {
      return;
    }
    field.classList.add('form__field--error');
    errorElement.textContent = message;
    errorElement.hidden = false;
    errorElement.setAttribute('aria-hidden', 'false');
    input.setAttribute('aria-invalid', 'true');
    setDescribedBy(input, errorElement.id);
  };

  const clearFieldError = (field) => {
    const input = field.querySelector('input, textarea, select');
    const errorElement = getFieldErrorElement(field);
    if (!input || !errorElement) {
      return;
    }
    field.classList.remove('form__field--error');
    errorElement.textContent = '';
    errorElement.hidden = true;
    errorElement.setAttribute('aria-hidden', 'true');
    input.removeAttribute('aria-invalid');
    const base = getBaseDescribedBy(input);
    if (base) {
      input.setAttribute('aria-describedby', base);
    } else {
      input.removeAttribute('aria-describedby');
    }
  };

  const renderSummary = (errors) => {
    if (!formSummary) {
      return;
    }
    if (!errors.length) {
      formSummary.hidden = true;
      formSummary.innerHTML = '';
      return;
    }
    formSummary.hidden = false;
    formSummary.innerHTML = '';
    const heading = document.createElement('p');
    heading.textContent = 'Popraw błędy w formularzu:';
    const list = document.createElement('ul');
    errors.forEach(({ input, message }) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${input.id}`;
      link.textContent = message;
      item.appendChild(link);
      list.appendChild(item);
    });
    formSummary.append(heading, list);
  };

  const handleFieldEvent = (event) => {
    const input = event.target;
    const field = input.closest('.form__field');
    if (!field) {
      return;
    }
    const { valid, message } = validateField(input);
    if (valid) {
      clearFieldError(field);
      return;
    }
    if (event.type === 'blur' || field.classList.contains('form__field--error')) {
      setFieldError(field, message);
    }
  };

  fieldInputs.forEach((input) => {
    input.addEventListener('input', handleFieldEvent);
    input.addEventListener('blur', handleFieldEvent);
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const errors = [];

    fields.forEach((field) => {
      const input = field.querySelector('input, textarea, select');
      if (!input) {
        return;
      }
      const result = validateField(input);
      if (!result.valid) {
        setFieldError(field, result.message);
        errors.push({ input, message: result.message });
      } else {
        clearFieldError(field);
      }
    });

    if (errors.length) {
      renderSummary(errors);
      if (formMessage) {
        formMessage.textContent = 'Uzupełnij wymagane pola formularza.';
      }
      errors[0].input.focus();
      return;
    }

    renderSummary([]);
    if (formMessage) {
      formMessage.textContent = 'Dziękuję! Wrócę z odpowiedzią w ciągu 24h.';
    }
    contactForm.reset();
  });
}

const filterWrapper = document.querySelector('.project-filter');
const projectGrid = document.querySelector('[data-project-grid]');
if (filterWrapper && projectGrid) {
  const filterButtons = Array.from(filterWrapper.querySelectorAll('[data-filter]'));
  if (filterButtons.length) {
    const items = Array.from(projectGrid.children);
    // This UI filters a single grid (not separate panels), so we use toggle buttons instead of ARIA tabs.
    const setActiveFilter = (filterKey) => {
      filterButtons.forEach((button) => {
        const isActive = button.getAttribute('data-filter') === filterKey;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      items.forEach((item) => {
        const category = item.getAttribute('data-category');
        const visible = filterKey === 'all' || filterKey === category;
        item.style.display = visible ? 'grid' : 'none';
      });
    };

    const defaultButton = filterButtons.find((button) => button.classList.contains('is-active'))
      ?? filterButtons.find((button) => button.getAttribute('data-filter') === 'all')
      ?? filterButtons[0];
    if (defaultButton) {
      setActiveFilter(defaultButton.getAttribute('data-filter'));
    }

    filterWrapper.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button || !filterWrapper.contains(button)) {
        return;
      }
      setActiveFilter(button.getAttribute('data-filter'));
    });
  }
}
