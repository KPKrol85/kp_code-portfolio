import { safeStorage } from '../services/storage.js';
import { createFocusTrap } from './focus-trap.js';

const STORAGE_KEY = 'vg_demo_terms_accepted';

const getLegalHref = (slug) => {
  return window.location.pathname.includes('/pages/') ? `${slug}.html` : `pages/${slug}.html`;
};

const showModal = (modal, trap) => {
  modal.hidden = false;
  document.body.classList.add('demo-modal-open');
  requestAnimationFrame(() => {
    modal.classList.add('is-visible');
    trap.activate();
  });
};

const hideModal = (modal, trap) => {
  modal.classList.remove('is-visible');
  document.body.classList.remove('demo-modal-open');
  trap.deactivate();
  const onEnd = () => {
    modal.hidden = true;
    modal.removeEventListener('transitionend', onEnd);
  };
  modal.addEventListener('transitionend', onEnd);
};

export const initDemoModal = () => {
  const modal = document.querySelector('[data-demo-modal]');
  if (!modal) return;

  const trap = createFocusTrap(modal);
  const accepted = safeStorage.get(STORAGE_KEY) === '1';

  if (accepted) {
    modal.hidden = true;
    return;
  }

  const regulamin = modal.querySelector('[data-demo-regulamin]');
  const privacy = modal.querySelector('[data-demo-privacy]');
  const cookies = modal.querySelector('[data-demo-cookies]');

  if (regulamin) regulamin.setAttribute('href', getLegalHref('regulamin'));
  if (privacy) privacy.setAttribute('href', getLegalHref('polityka-prywatnosci'));
  if (cookies) cookies.setAttribute('href', getLegalHref('cookies'));

  const accept = modal.querySelector('[data-demo-accept]');
  const closeButtons = modal.querySelectorAll('[data-demo-close]');

  const closeModal = () => hideModal(modal, trap);

  if (accept) {
    accept.addEventListener('click', () => {
      safeStorage.set(STORAGE_KEY, '1');
      closeModal();
    });
  }

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const onBackdropClick = (event) => {
    if (event.target === modal || event.target.classList.contains('demo-modal__backdrop')) {
      closeModal();
    }
  };

  modal.addEventListener('click', onBackdropClick);
  document.addEventListener('keydown', onKeyDown);

  showModal(modal, trap);

  const teardown = () => {
    modal.removeEventListener('click', onBackdropClick);
    document.removeEventListener('keydown', onKeyDown);
  };

  modal.addEventListener('transitionend', teardown, { once: true });
};
