import { store } from '../core/store.js';
import { formatDate, formatNumber } from '../utils/format.js';

export const renderDashboardView = (container) => {
  const { clients, projects, events } = store.getState();
  const activeProjects = projects.filter((project) => project.status !== 'Done');
  const overdue = projects.filter((project) => new Date(project.dueDate) < new Date());

  const nextActions = projects.slice(0, 5);

  container.innerHTML = `
    <main id="main" class="container">
      <header class="view-header">
        <h1 class="view-header__title">Dashboard</h1>
        <p class="view-header__desc">Szybki podgląd kluczowych działań i stanu operacji.</p>
      </header>

      <section class="dashboard-grid">
        <div class="dashboard-kpi">
          <div class="card kpi">
            <span class="kpi__value">${formatNumber(activeProjects.length)}</span>
            <span class="kpi__label">Aktywne zlecenia</span>
          </div>
          <div class="card kpi">
            <span class="kpi__value">${formatNumber(events.length)}</span>
            <span class="kpi__label">Wydarzenia w tym tygodniu</span>
          </div>
          <div class="card kpi">
            <span class="kpi__value">${formatNumber(clients.length)}</span>
            <span class="kpi__label">Klienci w bazie</span>
          </div>
          <div class="card kpi">
            <span class="kpi__value">${formatNumber(overdue.length)}</span>
            <span class="kpi__label">Zaległe zadania</span>
          </div>
        </div>

        <div class="dashboard-columns">
          <section class="card">
            <h2 class="card__title">Najbliższe działania</h2>
            <div class="list">
              ${nextActions.length
                ? nextActions
                    .map(
                      (item) => `
                    <div class="list__item">
                      <div>
                        <strong>${item.name}</strong>
                        <div class="input__helper">Termin: ${formatDate(item.dueDate)}</div>
                      </div>
                      <span class="badge badge--info">${item.status}</span>
                    </div>
                  `
                    )
                    .join('')
                : '<p class="empty-state">Brak zaplanowanych działań.</p>'}
            </div>
          </section>

          <section class="card">
            <h2 class="card__title">Ostatnie zlecenia</h2>
            <div class="list">
              ${projects.length
                ? projects
                    .slice(0, 4)
                    .map(
                      (item) => `
                    <div class="list__item">
                      <div>
                        <strong>${item.name}</strong>
                        <div class="input__helper">Priorytet: ${item.priority}</div>
                      </div>
                      <span class="badge badge--success">${item.status}</span>
                    </div>
                  `
                    )
                    .join('')
                : '<p class="empty-state">Brak zleceń do wyświetlenia.</p>'}
            </div>
          </section>
        </div>
      </section>
    </main>
  `;
};
