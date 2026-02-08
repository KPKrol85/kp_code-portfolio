import { auth } from './auth.js';
import { renderLoginView } from '../views/loginView.js';
import { renderDashboardView } from '../views/dashboardView.js';
import { renderClientsView } from '../views/clientsView.js';
import { renderProjectsView } from '../views/projectsView.js';
import { renderCalendarView } from '../views/calendarView.js';
import { renderSettingsView } from '../views/settingsView.js';
import { renderNotFoundView } from '../views/notFoundView.js';

const routes = {
  '/login': renderLoginView,
  '/dashboard': renderDashboardView,
  '/clients': renderClientsView,
  '/projects': renderProjectsView,
  '/calendar': renderCalendarView,
  '/settings': renderSettingsView
};

const parseRoute = () => {
  const hash = window.location.hash.replace('#', '') || '/dashboard';
  return hash.startsWith('/') ? hash : `/${hash}`;
};

export const router = {
  init({ onRoute }) {
    const handleRoute = () => {
      const path = parseRoute();
      const isAuthed = auth.isAuthenticated();
      if (!isAuthed && path !== '/login') {
        window.location.hash = '#/login';
        return;
      }
      if (isAuthed && path === '/login') {
        window.location.hash = '#/dashboard';
        return;
      }
      const view = routes[path] || renderNotFoundView;
      onRoute({ path, view });
    };

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('load', handleRoute);
    handleRoute();
  }
};
