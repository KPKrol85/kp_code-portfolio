function settingsView() {
  const root = dom.h('div');
  const escapeHtml = window.FleetUI.escapeHtml;
  const getRoleLabel = window.FleetPermissions?.getRoleLabel || ((role) => role || "Użytkownik");
  const header = dom.h('div', 'module-header');
  header.innerHTML = `<div><h2>Ustawienia</h2><p class="muted small">Personalizacja i demo</p></div>`;
  root.appendChild(header);

  const grid = dom.h('div', 'settings-grid');

  const themeCard = dom.h('div', 'setting-card');
  themeCard.innerHTML = `
    <h3>Motyw</h3>
    <div class="form-inline">
      <button class="button ${FleetStore.state.preferences.theme === 'light' ? 'button--secondary' : 'button--ghost'}" id="lightBtn">Jasny</button>
      <button class="button ${FleetStore.state.preferences.theme === 'dark' ? 'button--secondary' : 'button--ghost'}" id="darkBtn">Ciemny</button>
    </div>
  `;
  grid.appendChild(themeCard);

  const compactCard = dom.h('div', 'setting-card');
  compactCard.innerHTML = `
    <h3>Tryb kompaktowy</h3>
    <p>Mniej odstępów</p>
    <label class="form-control settings-compact-toggle">
      <input type="checkbox" id="compactToggle" ${FleetStore.state.preferences.compact ? 'checked' : ''} /> Włącz
    </label>
  `;
  grid.appendChild(compactCard);

  const resetCard = dom.h('div', 'setting-card');
  resetCard.innerHTML = `
    <h3>Reset demo</h3>
    <p>Czyści localStorage</p>
    <button class="button button--ghost" id="resetDemo">Resetuj</button>
  `;
  grid.appendChild(resetCard);

  const accountCard = dom.h('div', 'setting-card');
  const user = FleetStore.state.auth.user || { name: 'Użytkownik demo', email: 'demo@fleetops.app' };
  const currentUser = FleetStore.state.currentUser || window.FleetPermissions?.defaultUser;
  const safeRoleLabel = escapeHtml(getRoleLabel(currentUser?.role));
  accountCard.innerHTML = `
    <h3>Konto</h3>
    <p>${escapeHtml(user.name)}</p>
    <p>${escapeHtml(user.email)}</p>
    <p>Rola: ${safeRoleLabel}</p>
    <p>ID: ${escapeHtml(currentUser ? currentUser.id : 'u_admin_1')}</p>
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
