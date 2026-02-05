import { qs } from '../core/dom.js';
import { store } from '../core/store.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { formatDate } from '../utils/format.js';

const eventModalContent = (event = {}, clients = [], projects = []) => `
  <form id="eventForm" class="form-grid">
    <div class="input">
      <label class="input__label" for="title">Tytuł</label>
      <input class="input__field" id="title" name="title" value="${event.title || ''}" required />
      <span class="input__error" id="titleError"></span>
    </div>
    <div class="form-grid form-grid--two">
      <div class="input">
        <label class="input__label" for="date">Data</label>
        <input class="input__field" id="date" name="date" type="date" value="${event.date ? event.date.split('T')[0] : ''}" required />
      </div>
      <div class="input">
        <label class="input__label" for="client">Klient</label>
        <select class="input__select" id="client" name="client">
          ${clients.map((client) => `<option value="${client.id}">${client.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="input">
      <label class="input__label" for="project">Powiązany projekt</label>
      <select class="input__select" id="project" name="project">
        ${projects.map((project) => `<option value="${project.id}">${project.name}</option>`).join('')}
      </select>
    </div>
  </form>
`;

export const renderCalendarView = (container) => {
  const render = () => {
    const { events, clients, projects } = store.getState();

    container.innerHTML = `
      <main id="main" class="container">
        <header class="view-header">
          <h1 class="view-header__title">Kalendarz</h1>
          <p class="view-header__desc">Prosty widok nadchodzących wydarzeń powiązanych ze zleceniami.</p>
        </header>

        <section class="card">
          <button class="btn btn--primary" id="addEvent">Dodaj wydarzenie</button>
        </section>

        <section class="card">
          <h2 class="card__title">Nadchodzące wydarzenia</h2>
          <div class="calendar-list">
            ${events.length
              ? events
                  .map((event) => {
                    const client = clients.find((item) => item.id === event.clientId);
                    const project = projects.find((item) => item.id === event.projectId);
                    return `
                      <div class="list__item">
                        <div>
                          <strong>${event.title}</strong>
                          <div class="input__helper">${formatDate(event.date)} · ${client?.name || 'Brak klienta'}</div>
                        </div>
                        <div>
                          <span class="badge badge--info">${project?.name || 'Bez projektu'}</span>
                          <button class="btn btn--ghost" data-action="delete" data-id="${event.id}">Usuń</button>
                        </div>
                      </div>
                    `;
                  })
                  .join('')
              : '<p class="empty-state">Brak wydarzeń. Dodaj nowe spotkanie.</p>'}
          </div>
        </section>
      </main>
    `;
  };

  render();

  const bindEvents = () => {
    qs('#addEvent', container)?.addEventListener('click', () => {
      const { clients, projects } = store.getState();
      const close = openModal({
        title: 'Nowe wydarzenie',
        content: eventModalContent({}, clients, projects),
        footer: '<button class="btn btn--secondary" data-modal-close>Anuluj</button><button class="btn btn--primary" id="saveEvent">Zapisz</button>'
      });

      qs('#saveEvent', document)?.addEventListener('click', () => {
        const form = qs('#eventForm', document);
        const data = new FormData(form);
        const title = data.get('title');
        if (!title) {
          qs('#titleError', document).textContent = 'Wymagane pole.';
          return;
        }
        store.addEvent({
          title,
          date: data.get('date'),
          clientId: data.get('client'),
          projectId: data.get('project')
        });
        showToast('Dodano wydarzenie.');
        close();
        render();
        bindEvents();
      });
    });

    container.querySelectorAll('[data-action="delete"]').forEach((button) => {
      button.addEventListener('click', () => {
        store.deleteEvent(button.dataset.id);
        showToast('Usunięto wydarzenie.');
        render();
        bindEvents();
      });
    });
  };

  bindEvents();
};
