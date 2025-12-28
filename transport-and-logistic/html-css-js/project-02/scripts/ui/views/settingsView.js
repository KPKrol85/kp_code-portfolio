function settingsView() {
  const root = dom.h('div');
  const header = dom.h('div', 'module-header');
  header.innerHTML = `<div><h3>Ustawienia</h3><p class="muted small">Personalizacja i demo</p></div>`;
  root.appendChild(header);

  const grid = dom.h('div', 'settings-grid');

  const themeCard = dom.h('div', 'setting-card');
  themeCard.innerHTML = `
    <h4>Motyw</h4>
    <p class="muted small">Jasny / Ciemny</p>
    <div class="form-inline">
      <button class="button ${FleetStore.state.preferences.theme === 'light' ? 'secondary' : 'ghost'}" id="lightBtn">Jasny</button>
      <button class="button ${FleetStore.state.preferences.theme === 'dark' ? 'secondary' : 'ghost'}" id="darkBtn">Ciemny</button>
    </div>
  `;
  grid.appendChild(themeCard);

  const compactCard = dom.h('div', 'setting-card');
  compactCard.innerHTML = `
    <h4>Tryb kompaktowy</h4>
    <p class="muted small">Mniej odstępów</p>
    <label class="form-control" style="flex-direction: row; align-items: center; gap: 10px;">
      <input type="checkbox" id="compactToggle" ${FleetStore.state.preferences.compact ? 'checked' : ''} /> Włącz
    </label>
  `;
  grid.appendChild(compactCard);

  const resetCard = dom.h('div', 'setting-card');
  resetCard.innerHTML = `
    <h4>Reset demo</h4>
    <p class="muted small">Czyści localStorage</p>
    <button class="button ghost" id="resetDemo">Resetuj</button>
  `;
  grid.appendChild(resetCard);

  const accountCard = dom.h('div', 'setting-card');
  const user = FleetStore.state.auth.user || { name: 'Użytkownik demo', email: 'demo@fleetops.app' };
  const currentUser = FleetStore.state.currentUser || window.FleetPermissions?.defaultUser;
  accountCard.innerHTML = `
    <h4>Konto</h4>
    <p>${user.name}</p>
    <p class="muted small">${user.email}</p>
    <p class="muted small">Rola: ${currentUser ? currentUser.displayName || currentUser.role : 'Admin'}</p>
    <p class="muted small">ID: ${currentUser ? currentUser.id : 'u_admin_1'}</p>
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
