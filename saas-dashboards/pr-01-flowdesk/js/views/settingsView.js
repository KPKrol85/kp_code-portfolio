import { qs } from '../core/dom.js';
import { store } from '../core/store.js';
import { showToast } from '../components/toast.js';

export const renderSettingsView = (container) => {
  const { ui } = store.getState();

  container.innerHTML = `
    <main id="main" class="container">
      <header class="view-header">
        <h1 class="view-header__title">Ustawienia</h1>
        <p class="view-header__desc">Zarządzaj profilem, preferencjami i narzędziami danych.</p>
      </header>

      <section class="settings-grid">
        <div class="card">
          <h2 class="card__title">Profil</h2>
          <div class="list">
            <div><strong>Imię i nazwisko:</strong> Alicja Maj</div>
            <div><strong>Rola:</strong> Owner</div>
            <div><strong>Email:</strong> alicja@flowdesk.pl</div>
          </div>
          <p class="input__helper">To jest mock danych profilu (bez backendu).</p>
        </div>

        <div class="card">
          <h2 class="card__title">Preferencje</h2>
          <div class="list">
            <label class="list__item">
              <span>Motyw ciemny</span>
              <input type="checkbox" id="themeSwitch" ${ui.theme === 'dark' ? 'checked' : ''} />
            </label>
            <label class="list__item">
              <span>Ogranicz animacje</span>
              <input type="checkbox" id="motionSwitch" ${ui.reducedMotion ? 'checked' : ''} />
            </label>
          </div>
        </div>
      </section>

      <section class="card">
        <h2 class="card__title">Narzędzia danych</h2>
        <div class="list">
          <button class="btn btn--secondary" id="exportData">Eksportuj JSON</button>
          <button class="btn btn--ghost" id="resetData">Reset demo danych</button>
        </div>
        <p class="input__helper">Reset przywróci dane demo zapisane w localStorage.</p>
      </section>
    </main>
  `;

  qs('#themeSwitch', container)?.addEventListener('change', (event) => {
    store.setTheme(event.target.checked ? 'dark' : 'light');
    showToast('Zaktualizowano motyw.');
  });

  qs('#motionSwitch', container)?.addEventListener('change', (event) => {
    store.setReducedMotion(event.target.checked);
    showToast('Zaktualizowano preferencje animacji.');
  });

  qs('#exportData', container)?.addEventListener('click', () => {
    const blob = new Blob([store.export()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowdesk-data.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Eksport danych gotowy.');
  });

  qs('#resetData', container)?.addEventListener('click', () => {
    const confirmed = window.confirm('Czy na pewno przywrócić dane demo?');
    if (!confirmed) return;
    store.reset();
    showToast('Dane demo zostały przywrócone.');
    renderSettingsView(container);
  });
};
