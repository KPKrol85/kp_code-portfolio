const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/clients', label: 'Klienci', icon: '👥' },
  { path: '/projects', label: 'Zlecenia', icon: '🧩' },
  { path: '/calendar', label: 'Kalendarz', icon: '🗓️' },
  { path: '/settings', label: 'Ustawienia', icon: '⚙️' }
];

export const renderSidebar = (activePath) => {
  return `
    <aside class="sidebar" aria-label="Nawigacja główna">
      <div class="sidebar__logo">FlowDesk</div>
      <nav class="sidebar__nav">
        ${navItems
          .map(
            (item) => `
            <a class="sidebar__link ${activePath === item.path ? 'sidebar__link--active' : ''}" href="#${item.path}">
              <span aria-hidden="true">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `
          )
          .join('')}
      </nav>
    </aside>
  `;
};

export const renderNavList = (activePath) => {
  return `
    <div class="sidebar__logo">FlowDesk</div>
    <nav class="sidebar__nav">
      ${navItems
        .map(
          (item) => `
          <a class="sidebar__link ${activePath === item.path ? 'sidebar__link--active' : ''}" href="#${item.path}">
            <span aria-hidden="true">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `
        )
        .join('')}
    </nav>
  `;
};
