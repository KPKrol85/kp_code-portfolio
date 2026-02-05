import { qs } from '../core/dom.js';
import { store } from '../core/store.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { formatDate } from '../utils/format.js';

const statusColumns = ['Draft', 'In progress', 'Review', 'Done'];
const priorityOptions = ['Low', 'Medium', 'High'];

const projectModalContent = (project = {}, clients = []) => `
  <form id="projectForm" class="form-grid">
    <div class="input">
      <label class="input__label" for="name">Nazwa</label>
      <input class="input__field" id="name" name="name" value="${project.name || ''}" required />
      <span class="input__error" id="nameError"></span>
    </div>
    <div class="form-grid form-grid--two">
      <div class="input">
        <label class="input__label" for="client">Klient</label>
        <select class="input__select" id="client" name="client" required>
          ${clients
            .map(
              (client) => `<option value="${client.id}" ${project.clientId === client.id ? 'selected' : ''}>${client.name}</option>`
            )
            .join('')}
        </select>
      </div>
      <div class="input">
        <label class="input__label" for="status">Status</label>
        <select class="input__select" id="status" name="status">
          ${statusColumns
            .map((status) => `<option value="${status}" ${project.status === status ? 'selected' : ''}>${status}</option>`)
            .join('')}
        </select>
      </div>
    </div>
    <div class="form-grid form-grid--two">
      <div class="input">
        <label class="input__label" for="priority">Priorytet</label>
        <select class="input__select" id="priority" name="priority">
          ${priorityOptions
            .map((priority) => `<option value="${priority}" ${project.priority === priority ? 'selected' : ''}>${priority}</option>`)
            .join('')}
        </select>
      </div>
      <div class="input">
        <label class="input__label" for="dueDate">Termin</label>
        <input class="input__field" id="dueDate" name="dueDate" type="date" value="${project.dueDate ? project.dueDate.split('T')[0] : ''}" />
      </div>
    </div>
    <div class="input">
      <label class="input__label" for="notes">Notatki</label>
      <textarea class="input__textarea" id="notes" name="notes" rows="3">${project.notes || ''}</textarea>
    </div>
  </form>
`;

const badgeClass = (value) => {
  if (value === 'High' || value === 'Review') return 'badge--warning';
  if (value === 'Done') return 'badge--success';
  return 'badge--info';
};

export const renderProjectsView = (container) => {
  let filterState = { status: 'all', priority: 'all' };

  const render = () => {
    const { clients, projects } = store.getState();
    const filtered = projects.filter((project) => {
      const statusMatch = filterState.status === 'all' || project.status === filterState.status;
      const priorityMatch = filterState.priority === 'all' || project.priority === filterState.priority;
      return statusMatch && priorityMatch;
    });

    container.innerHTML = `
      <main id="main" class="container">
        <header class="view-header">
          <h1 class="view-header__title">Zlecenia</h1>
          <p class="view-header__desc">Śledź statusy zleceń i priorytety bez przeciążenia narzędziem.</p>
        </header>
        <section class="card">
          <div class="form-grid form-grid--two">
            <div class="input">
              <label class="input__label" for="statusFilter">Status</label>
              <select class="input__select" id="statusFilter">
                <option value="all">Wszystkie</option>
                ${statusColumns
                  .map(
                    (status) =>
                      `<option value="${status}" ${filterState.status === status ? 'selected' : ''}>${status}</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="input">
              <label class="input__label" for="priorityFilter">Priorytet</label>
              <select class="input__select" id="priorityFilter">
                <option value="all">Wszystkie</option>
                ${priorityOptions
                  .map(
                    (priority) =>
                      `<option value="${priority}" ${filterState.priority === priority ? 'selected' : ''}>${priority}</option>`
                  )
                  .join('')}
              </select>
            </div>
          </div>
          <button class="btn btn--primary" id="addProject">Dodaj zlecenie</button>
        </section>

        <section class="kanban">
          ${statusColumns
            .map((status) => {
              const columnItems = filtered.filter((project) => project.status === status);
              return `
                <div class="kanban__column">
                  <div class="kanban__title">${status} (${columnItems.length})</div>
                  <div class="list">
                    ${columnItems.length
                      ? columnItems
                          .map((project) => {
                            const client = clients.find((item) => item.id === project.clientId);
                            return `
                              <article class="kanban__card">
                                <strong>${project.name}</strong>
                                <span class="input__helper">${client?.name || 'Bez klienta'}</span>
                                <div>
                                  <span class="badge ${badgeClass(project.priority)}">${project.priority}</span>
                                  <span class="badge ${badgeClass(project.status)}">${project.status}</span>
                                </div>
                                <span class="input__helper">Termin: ${formatDate(project.dueDate)}</span>
                                <div class="table__actions">
                                  <button class="btn btn--ghost" data-action="edit" data-id="${project.id}">Edytuj</button>
                                  <button class="btn btn--ghost" data-action="delete" data-id="${project.id}">Usuń</button>
                                </div>
                              </article>
                            `;
                          })
                          .join('')
                      : '<p class="input__helper">Brak elementów.</p>'}
                  </div>
                </div>
              `;
            })
            .join('')}
        </section>
      </main>
    `;
  };

  render();

  const bindEvents = () => {
    const statusFilter = qs('#statusFilter', container);
    const priorityFilter = qs('#priorityFilter', container);

    statusFilter?.addEventListener('change', () => {
      filterState.status = statusFilter.value;
      render();
      bindEvents();
    });
    priorityFilter?.addEventListener('change', () => {
      filterState.priority = priorityFilter.value;
      render();
      bindEvents();
    });

    qs('#addProject', container)?.addEventListener('click', () => {
      const close = openModal({
        title: 'Nowe zlecenie',
        content: projectModalContent({}, store.getState().clients),
        footer: '<button class="btn btn--secondary" data-modal-close>Anuluj</button><button class="btn btn--primary" id="saveProject">Zapisz</button>'
      });
      qs('#saveProject', document)?.addEventListener('click', () => {
        const form = qs('#projectForm', document);
        const data = new FormData(form);
        const name = data.get('name');
        if (!name) {
          qs('#nameError', document).textContent = 'Wymagane pole.';
          return;
        }
        store.addProject({
          name,
          clientId: data.get('client'),
          status: data.get('status'),
          priority: data.get('priority'),
          dueDate: data.get('dueDate'),
          notes: data.get('notes')
        });
        showToast('Dodano zlecenie.');
        close();
        render();
        bindEvents();
      });
    });

    container.querySelectorAll('[data-action="edit"]').forEach((button) => {
      button.addEventListener('click', () => {
        const project = store.getState().projects.find((item) => item.id === button.dataset.id);
        const close = openModal({
          title: 'Edytuj zlecenie',
          content: projectModalContent(project, store.getState().clients),
          footer: '<button class="btn btn--secondary" data-modal-close>Anuluj</button><button class="btn btn--primary" id="updateProject">Zapisz</button>'
        });
        qs('#updateProject', document)?.addEventListener('click', () => {
          const form = qs('#projectForm', document);
          const data = new FormData(form);
          store.updateProject(project.id, {
            name: data.get('name'),
            clientId: data.get('client'),
            status: data.get('status'),
            priority: data.get('priority'),
            dueDate: data.get('dueDate'),
            notes: data.get('notes')
          });
          showToast('Zaktualizowano zlecenie.');
          close();
          render();
          bindEvents();
        });
      });
    });

    container.querySelectorAll('[data-action="delete"]').forEach((button) => {
      button.addEventListener('click', () => {
        const project = store.getState().projects.find((item) => item.id === button.dataset.id);
        const close = openModal({
          title: 'Usuń zlecenie',
          content: `<p>Czy na pewno usunąć <strong>${project.name}</strong>?</p>`,
          footer: '<button class="btn btn--secondary" data-modal-close>Anuluj</button><button class="btn btn--primary" id="confirmProjectDelete">Usuń</button>'
        });
        qs('#confirmProjectDelete', document)?.addEventListener('click', () => {
          store.deleteProject(project.id);
          showToast('Usunięto zlecenie.');
          close();
          render();
          bindEvents();
        });
      });
    });
  };

  bindEvents();
};
