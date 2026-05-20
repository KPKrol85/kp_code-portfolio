import { qsa, qs, prefersReducedMotion } from '../utils.js';

const SELECTORS = {
  tabs: '[data-tabs]',
  tabButton: '[role="tab"]',
  tabPanel: '[role="tabpanel"]',
  modalTrigger: '[data-modal-open]',
  modal: '[data-modal]',
  closeModal: '[data-modal-close]',
  progress: '[data-scroll-progress]',
  stickyCta: '[data-sticky-cta]',
  navLinks: '.nav__link',
  sections: 'main section[id]',
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setAriaSelected(tab, isSelected) {
  tab.setAttribute('aria-selected', String(isSelected));
  tab.tabIndex = isSelected ? 0 : -1;
}

function activateTab(tabList, tab) {
  const tabs = qsa(SELECTORS.tabButton, tabList);
  const panels = qsa(SELECTORS.tabPanel, tabList.parentElement);

  tabs.forEach((item) => {
    const selected = item === tab;
    setAriaSelected(item, selected);
  });

  panels.forEach((panel) => {
    panel.hidden = panel.id !== tab.getAttribute('aria-controls');
  });
}

function bindTabs() {
  qsa(SELECTORS.tabs).forEach((root) => {
    const tabList = qs('[role="tablist"]', root);
    if (!tabList) return;

    const tabs = qsa(SELECTORS.tabButton, tabList);
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tabList, tab));

      tab.addEventListener('keydown', (event) => {
        const index = tabs.indexOf(tab);
        if (index < 0) return;

        let targetIndex = index;

        if (event.key === 'ArrowRight') targetIndex = clamp(index + 1, 0, tabs.length - 1);
        if (event.key === 'ArrowLeft') targetIndex = clamp(index - 1, 0, tabs.length - 1);
        if (event.key === 'Home') targetIndex = 0;
        if (event.key === 'End') targetIndex = tabs.length - 1;

        if (targetIndex !== index) {
          event.preventDefault();
          tabs[targetIndex].focus();
          activateTab(tabList, tabs[targetIndex]);
        }
      });
    });

    const firstSelected = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    activateTab(tabList, firstSelected);
  });
}

function lockBodyScroll(isLocked) {
  document.documentElement.classList.toggle('is-modal-open', isLocked);
  document.body.classList.toggle('is-modal-open', isLocked);
}

function bindModal() {
  const modal = qs(SELECTORS.modal);
  if (!modal) return;

  const closeButtons = qsa(SELECTORS.closeModal, modal);
  const triggers = qsa(SELECTORS.modalTrigger);

  const close = () => {
    modal.hidden = true;
    lockBodyScroll(false);
  };

  const open = () => {
    modal.hidden = false;
    lockBodyScroll(true);
    qs('[data-autofocus]', modal)?.focus();
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', open));
  closeButtons.forEach((button) => button.addEventListener('click', close));

  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) close();
  });
}

function bindScrollProgress() {
  const progress = qs(SELECTORS.progress);
  if (!progress) return;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable <= 0 ? 0 : (window.scrollY / scrollable) * 100;
    progress.style.setProperty('--scroll-progress', `${percent}%`);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function bindStickyCta() {
  const sticky = qs(SELECTORS.stickyCta);
  if (!sticky) return;

  const hero = qs('.hero');
  if (!hero || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sticky.classList.toggle('is-visible', !entry.isIntersecting);
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(hero);
}

function bindSectionSpy() {
  const links = qsa(SELECTORS.navLinks).filter((link) => link.hash && link.hash.length > 1);
  if (!links.length || !('IntersectionObserver' in window)) return;

  const linkMap = new Map();
  links.forEach((link) => {
    const section = qs(link.hash);
    if (section) linkMap.set(section.id, link);
  });

  const activate = (id) => {
    links.forEach((link) => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else if (link.getAttribute('aria-current') === 'location') link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      activate(visible.target.id);
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 },
  );

  Array.from(linkMap.keys())
    .map((id) => qs(`#${id}`))
    .filter(Boolean)
    .forEach((section) => observer.observe(section));
}

function bindAnimatedGradients() {
  if (prefersReducedMotion()) return;
  qsa('[data-animated-gradient]').forEach((el) => {
    let offset = 0;
    const tick = () => {
      offset += 0.4;
      el.style.setProperty('--gradient-pos', `${offset}%`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

export function initAdvancedUi() {
  bindTabs();
  bindModal();
  bindScrollProgress();
  bindStickyCta();
  bindSectionSpy();
  bindAnimatedGradients();
}
