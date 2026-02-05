import { qs } from '../core/dom.js';
import { store } from '../core/store.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';

const renderDetails = (client) => {
  if (!client) {
    return `
      <div class="side-panel">
        <h3>Podgląd klienta</h3>
        <p class="input__helper">Wybierz klienta z listy, aby zobaczyć szczegóły.</p>
      </div>
    `;
  }

  return `
    <div class="side-panel">
      <h3>${client.name}</h3>
      <p class="input__helper">${client.status}</p>
      <div class="list">
        <div><strong>Email:</strong> ${client.email}</div>
        <div><strong>Telefon:</strong> ${client.phone}</div>
        <div><strong>Notatki:</strong> ${client.notes}</div>
      </div>
    </div>
  `;
};

const clientModalContent = (client = {}) => `
  <form id="clientForm" class="form-grid">
    <div class="form-grid form-grid--two">
      <div class="input">
        <label class="input__label" for="name">Nazwa</label>
        <input class="input__field" id="name" name="name" value="${client.name || ''}" required />
        <span class="input__error" id="nameError"></span>
      </div>
      <div class="input">
        <label class="input__label" for="status">Status</label>
        <select class="input__select" id="status" name="status">
          ${['Aktywny', 'Potencjalny', 'Zawieszony']
            .map((status) => `<option value="${status}" ${client.status === status ? 'selected' : ''}>${status}</option>`)
            .join('')}
        </select>
      </div>
    </div>
    <div class="form-grid form-grid--two">
      <div class="input">
        <label class="input__label" for="email">Email</label>
        <input class="input__field" id="email" name="email" type="email" value="${client.email || ''}" required />
        <span class="input__error" id="emailError"></span>
      </div>
      <div class="input">
        <label class="input__label" for="phone">Telefon</label>
        <input class="input__field" id="phone" name="phone" value="${client.phone || ''}" required />
      </div>
    </div>
    <div class="input">
      <label class="input__label" for="notes">Notatki</label>
      <textarea class="input__textarea" id="notes" name="notes" rows="3">${client.notes || ''}</textarea>
      <span class="input__helper">Krótki kontekst dla zespołu.</span>
    </div>
  </form>
`;

export const renderClientsView = (container) => {
  const state = store.getState();
  let selectedId = state.clients[0]?.id || null;
  let filterState = { term: '', sort: 'name' };

  const render = (clients) => {
    const sorted = [...clients].sort((a, b) => {
      if (filterState.sort === 'status') return a.status.localeCompare(b.status);
      return a.name.localeCompare(b.name);
    });
    const filtered = sorted.filter(
      (client) =>
        client.name.toLowerCase().includes(filterState.term.toLowerCase()) ||
        client.email.toLowerCase().includes(filterState.term.toLowerCase())
    );
    const rows = filtered
      .map(
        (client) => `
        <tr data-id="${client.id}">
          <td>${client.name}</td>
          <td>${client.email}</td>
          <td>${client.status}</td>
          <td>
            <div class="table__actions">
              <button class="btn btn--ghost" data-action="edit" data-id="${client.id}">Edytuj</button>
              <button class="btn btn--ghost" data-action="delete" data-id="${client.id}">Usuń</button>
            </div>
          </td>
        </tr>
      `
      )
      .join('');

    container.innerHTML = `
      <main id="main" class="container">
        <header class="view-header">
          <h1 class="view-header__title">Klienci</h1>
          <p class="view-header__desc">Baza klientów, statusy współpracy i szybkie akcje.</p>
        </header>
        <section class="clients-layout">
          <div class="card">
            <div class="list">
              <div class="form-grid form-grid--two">
                <div class="input">
                  <label class="input__label" for="filterInput">Filtruj</label>
                  <input class="input__field" id="filterInput" placeholder="Wpisz nazwę lub email" value="${filterState.term}" />
                </div>
                <div class="input">
                  <label class="input__label" for="sortSelect">Sortuj</label>
                  <select class="input__select" id="sortSelect">
                    <option value="name" ${filterState.sort === 'name' ? 'selected' : ''}>Nazwa</option>
                    <option value="status" ${filterState.sort === 'status' ? 'selected' : ''}>Status</option>
                  </select>
                </div>
              </div>
              <button class="btn btn--primary" id="addClient">Dodaj klienta</button>
            </div>
            <div class="table-wrapper">
              ${
                rows.length
                  ? `
                <table class="table">
                  <thead>
                    <tr>
                      <th>Klient</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${rows}
                  </tbody>
                </table>
              `
                  : '<p class="empty-state">Brak klientów. Dodaj pierwszy rekord.</p>'
              }
            </div>
          </div>
          ${renderDetails(clients.find((client) => client.id === selectedId))}
        </section>
      </main>
    `;
  };

  render(state.clients);

  const updateHandlers = () => {
    const filterInput = qs('#filterInput', container);
    const sortSelect = qs('#sortSelect', container);

    const filterAndRender = () => {
      filterState = { term: filterInput.value, sort: sortSelect.value };
      render(store.getState().clients);
      updateHandlers();
    };

    filterInput?.addEventListener('input', filterAndRender);
    sortSelect?.addEventListener('change', filterAndRender);

    qs('#addClient', container)?.addEventListener('click', () => {
      const close = openModal({
        title: 'Nowy klient',
        content: clientModalContent(),
        footer: '<button class="btn btn--secondary" data-modal-close>Anuluj</button><button class="btn btn--primary" id="saveClient">Zapisz</button>'
      });

      const saveBtn = qs('#saveClient', document);
      saveBtn?.addEventListener('click', () => {
        const form = qs('#clientForm', document);
        const data = new FormData(form);
        const name = data.get('name');
        const email = data.get('email');
        if (!name || !email) {
          qs('#nameError', document).textContent = name ? '' : 'Wymagane pole.';
          qs('#emailError', document).textContent = email ? '' : 'Wymagane pole.';
          return;
        }
        store.addClient({
          name,
          email,
          phone: data.get('phone'),
          status: data.get('status'),
          notes: data.get('notes')
        });
        showToast('Dodano klienta.');
        close();
        render(store.getState().clients);
        updateHandlers();
      });
    });

    container.querySelectorAll('[data-action="edit"]').forEach((button) => {
      button.addEventListener('click', () => {
        const client = store.getState().clients.find((item) => item.id === button.dataset.id);
        const close = openModal({
          title: 'Edytuj klienta',
          content: clientModalContent(client),
          footer: '<button class="btn btn--secondary" data-modal-close>Anuluj</button><button class="btn btn--primary" id="updateClient">Zapisz</button>'
        });
        qs('#updateClient', document)?.addEventListener('click', () => {
          const form = qs('#clientForm', document);
          const data = new FormData(form);
          store.updateClient(client.id, {
            name: data.get('name'),
            email: data.get('email'),
            phone: data.get('phone'),
            status: data.get('status'),
            notes: data.get('notes')
          });
          showToast('Zaktualizowano klienta.');
          close();
          render(store.getState().clients);
          updateHandlers();
        });
      });
    });

    container.querySelectorAll('[data-action="delete"]').forEach((button) => {
      button.addEventListener('click', () => {
        const client = store.getState().clients.find((item) => item.id === button.dataset.id);
        const close = openModal({
          title: 'Usuń klienta',
          content: `<p>Czy na pewno usunąć <strong>${client.name}</strong>? Znikną też powiązane zlecenia.</p>`,
          footer: '<button class="btn btn--secondary" data-modal-close>Anuluj</button><button class="btn btn--primary" id="confirmDelete">Usuń</button>'
        });
        qs('#confirmDelete', document)?.addEventListener('click', () => {
          store.deleteClient(client.id);
          showToast('Usunięto klienta.');
          close();
          render(store.getState().clients);
          updateHandlers();
        });
      });
    });

    container.querySelectorAll('tbody tr').forEach((row) => {
      row.addEventListener('click', () => {
        selectedId = row.dataset.id || null;
        render(store.getState().clients);
        updateHandlers();
      });
    });
  };

  updateHandlers();
};
