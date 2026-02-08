import { router } from './core/router.js';
import { renderSidebar, renderNavList } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { createDrawer } from './components/drawer.js';
import { auth } from './core/auth.js';
import { store } from './core/store.js';
import { openModal } from './components/modal.js';
import { qs } from './core/dom.js';
import { showToast } from './components/toast.js';

const app = document.getElementById('app');

const applyTheme = () => {
  const { ui } = store.getState();
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${ui.theme}`);
  document.documentElement.style.setProperty(
    'scroll-behavior',
    ui.reducedMotion ? 'auto' : 'smooth'
  );
};

let userMenuHandler = null;

const renderShell = (activePath, view) => {
  app.innerHTML = `
    <div class="app__shell">
      ${renderSidebar(activePath)}
      <div class="app__content">
        ${renderTopbar()}
        <section id="view"></section>
      </div>
    </div>
  `;

  const drawer = createDrawer({ content: renderNavList(activePath) });
  const toggleBtn = qs('#drawerToggle', app);
  toggleBtn?.addEventListener('click', () => {
    const isOpen = drawer.drawer.classList.contains('drawer--open');
    drawer.drawer.classList.toggle('drawer--open');
    document.body.style.overflow = isOpen ? '' : 'hidden';
    toggleBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  const viewContainer = qs('#view', app);
  view(viewContainer);

  const userMenuBtn = qs('#userMenuBtn', app);
  const userMenuPanel = qs('#userMenuPanel', app);
  userMenuBtn?.addEventListener('click', () => {
    const isOpen = userMenuPanel.classList.toggle('user-menu__panel--open');
    userMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });
  if (userMenuHandler) document.removeEventListener('click', userMenuHandler);
  userMenuHandler = (event) => {
    if (!userMenuPanel.contains(event.target) && !userMenuBtn.contains(event.target)) {
      userMenuPanel.classList.remove('user-menu__panel--open');
      userMenuBtn.setAttribute('aria-expanded', 'false');
    }
  };
  document.addEventListener('click', userMenuHandler);

  qs('#logoutBtn', app)?.addEventListener('click', () => {
    auth.logout();
    showToast('Wylogowano.');
    window.location.hash = '#/login';
  });

  qs('#themeToggle', app)?.addEventListener('click', () => {
    const current = store.getState().ui.theme;
    store.setTheme(current === 'light' ? 'dark' : 'light');
  });

  qs('#quickAdd', app)?.addEventListener('click', () => {
    const close = openModal({
      title: 'Szybkie dodanie',
      content: `
        <div class="list">
          <p>Wybierz typ rekordu do utworzenia. Dane zostaną zapisane w demo store.</p>
          <button class="btn btn--secondary" data-quick="client">Nowy klient</button>
          <button class="btn btn--secondary" data-quick="project">Nowe zlecenie</button>
        </div>
      `,
      footer: '<button class="btn btn--secondary" data-modal-close>Zamknij</button>'
    });

    document.querySelectorAll('[data-quick]').forEach((button) => {
      button.addEventListener('click', () => {
        showToast(`Dodano szkic: ${button.dataset.quick === 'client' ? 'klient' : 'zlecenie'}.`);
        close();
      });
    });
  });
};

const renderLogin = (view) => {
  app.innerHTML = '';
  view(app);
};

store.subscribe(() => {
  applyTheme();
});

applyTheme();

router.init({
  onRoute: ({ path, view }) => {
    if (path === '/login') {
      renderLogin(view);
      return;
    }
    renderShell(path, view);
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
