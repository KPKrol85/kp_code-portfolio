function settingsView() {
  const root = dom.h('div');
  const header = dom.h('div', 'module-header');
  header.innerHTML = `<div><h3>Settings</h3><p class="muted small">Personalizacja i demo</p></div>`;
  root.appendChild(header);

  const grid = dom.h('div', 'settings-grid');

  const themeCard = dom.h('div', 'setting-card');
  themeCard.innerHTML = `
    <h4>Theme</h4>
    <p class="muted small">Light / Dark</p>
    <div class="form-inline">
      <button class="button ${FleetStore.state.preferences.theme === 'light' ? 'secondary' : 'ghost'}" id="lightBtn">Light</button>
      <button class="button ${FleetStore.state.preferences.theme === 'dark' ? 'secondary' : 'ghost'}" id="darkBtn">Dark</button>
    </div>
  `;
  grid.appendChild(themeCard);

  const compactCard = dom.h('div', 'setting-card');
  compactCard.innerHTML = `
    <h4>Compact mode</h4>
    <p class="muted small">Mniej odstępów</p>
    <label class="form-control" style="flex-direction: row; align-items: center; gap: 10px;">
      <input type="checkbox" id="compactToggle" ${FleetStore.state.preferences.compact ? 'checked' : ''} /> Enable
    </label>
  `;
  grid.appendChild(compactCard);

  const resetCard = dom.h('div', 'setting-card');
  resetCard.innerHTML = `
    <h4>Reset demo</h4>
    <p class="muted small">Czyści localStorage</p>
    <button class="button ghost" id="resetDemo">Reset</button>
  `;
  grid.appendChild(resetCard);

  const accountCard = dom.h('div', 'setting-card');
  const user = FleetStore.state.auth.user || { name: 'Demo user', email: 'demo@fleetops.app' };
  accountCard.innerHTML = `
    <h4>Account</h4>
    <p>${user.name}</p>
    <p class="muted small">${user.email}</p>
    <p class="muted small">Role: Operations</p>
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
    Toast.show("Local data cleared", "success");
    window.location.hash = "#/";
  });

  return root;
}

window.settingsView = settingsView;
