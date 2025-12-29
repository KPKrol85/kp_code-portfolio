export const initHeader = () => {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('[data-nav-toggle]');
  const dropdowns = document.querySelectorAll('[data-dropdown]');

  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 12) {
      header.classList.add('shrink');
      header.style.boxShadow = 'var(--shadow-sm)';
    } else {
      header.classList.remove('shrink');
      header.style.boxShadow = 'none';
    }
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        dropdowns.forEach((item) => {
          item.classList.remove('is-open');
          item.querySelector('[data-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
        });
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        dropdowns.forEach((item) => {
          item.classList.remove('is-open');
          item.querySelector('[data-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  if (dropdowns.length) {
    const closeAll = () => {
      dropdowns.forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('[data-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
      });
    };

    dropdowns.forEach((item) => {
      const button = item.querySelector('[data-dropdown-toggle]');
      if (!button) return;

      button.addEventListener('click', (event) => {
        event.preventDefault();
        const isOpen = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(isOpen));
      });

      item.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeAll();
          button.focus();
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-dropdown]')) {
        closeAll();
      }
    });
  }
};
