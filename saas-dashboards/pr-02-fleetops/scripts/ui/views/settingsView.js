function settingsView() {
  const root = dom.h('div');
  const escapeHtml = window.FleetUI.escapeHtml;
  const header = dom.h('div', 'module-header');
  header.innerHTML = `<div><h2>Ustawienia</h2><p class="muted small">Personalizacja i demo</p></div>`;
  root.appendChild(header);

  const grid = dom.h('div', 'settings-grid');

  const themeCard = dom.h('div', 'setting-card');
  themeCard.innerHTML = `
    <h3>Motyw</h3>
    <p class="muted small">Jasny / Ciemny</p>
    <div class="form-inline">
      <button class="button ${FleetStore.state.preferences.theme === 'light' ? 'button--secondary' : 'button--ghost'}" id="lightBtn">Jasny</button>
      <button class="button ${FleetStore.state.preferences.theme === 'dark' ? 'button--secondary' : 'button--ghost'}" id="darkBtn">Ciemny</button>
    </div>
  `;
  grid.appendChild(themeCard);

  const compactCard = dom.h('div', 'setting-card');
  compactCard.innerHTML = `
    <h3>Tryb kompaktowy</h3>
    <p class="muted small">Mniej odstępów</p>
    <label class="form-control settings-compact-toggle">
      <input type="checkbox" id="compactToggle" ${FleetStore.state.preferences.compact ? 'checked' : ''} /> Włącz
    </label>
  `;
  grid.appendChild(compactCard);

  const resetCard = dom.h('div', 'setting-card');
  resetCard.innerHTML = `
    <h3>Reset demo</h3>
    <p class="muted small">Czyści localStorage</p>
    <button class="button button--ghost" id="resetDemo">Resetuj</button>
  `;
  grid.appendChild(resetCard);

  const accountCard = dom.h('div', 'setting-card');
  const user = FleetStore.state.auth.user || { name: 'Użytkownik demo', email: 'demo@fleetops.app' };
  const currentUser = FleetStore.state.currentUser || window.FleetPermissions?.defaultUser;
  accountCard.innerHTML = `
    <h3>Konto</h3>
    <p>${escapeHtml(user.name)}</p>
    <p class="muted small">${escapeHtml(user.email)}</p>
    <p class="muted small">Rola: ${escapeHtml(currentUser ? currentUser.displayName || currentUser.role : 'Admin')}</p>
    <p class="muted small">ID: ${escapeHtml(currentUser ? currentUser.id : 'u_admin_1')}</p>
  `;
  grid.appendChild(accountCard);

  root.appendChild(grid);

  themeCard.querySelector('#lightBtn').addEventListener('click', () => FleetStore.setTheme('light'));
  themeCard.querySelector('#darkBtn').addEventListener('click', () => FleetStore.setTheme('dark'));
  compactCard.querySelector('#compactToggle').addEventListener('change', (e) => {
    FleetStore.setCompact(e.target.checked);
    document.body.dataset.compact = e.target.checked ? 'true' : 'false';
  });
  resetCard.querySelector("#resetDemo").addEventListener("click", () => {
    FleetStore.resetDemo();
    Toast.show("Dane lokalne wyczyszczone", "success");
    window.location.hash = "#/";
  });

  return root;
}

window.settingsView = settingsView;
