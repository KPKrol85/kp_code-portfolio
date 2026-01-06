const STORAGE_KEY = 'vg_demo_terms_accepted';

const getLegalHref = (slug) => {
  return window.location.pathname.includes('/pages/') ? `${slug}.html` : `pages/${slug}.html`;
};

const showModal = (modal) => {
  modal.hidden = false;
  document.body.classList.add('demo-modal-open');
  requestAnimationFrame(() => {
    modal.classList.add('is-visible');
  });
};

const hideModal = (modal) => {
  modal.classList.remove('is-visible');
  document.body.classList.remove('demo-modal-open');
  const onEnd = () => {
    modal.hidden = true;
    modal.removeEventListener('transitionend', onEnd);
  };
  modal.addEventListener('transitionend', onEnd);
};

export const initDemoModal = () => {
  const modal = document.querySelector('[data-demo-modal]');
  if (!modal) return;

  const accepted = localStorage.getItem(STORAGE_KEY) === '1';
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
  if (accept) {
    accept.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, '1');
      hideModal(modal);
    });
  }

  showModal(modal);
};
