function fleetView() {
  const root = dom.h('div');
  root.appendChild(dom.h('div', 'module-header', `<div><h3>Fleet</h3><p class="muted small">Zarządzaj pojazdami</p></div>`));

  const filterBar = dom.h('div', 'table-filter');
  const statusSelect = dom.h('select');
  statusSelect.innerHTML = `
    <option value="all">Status: all</option>
    <option value="available">Available</option>
    <option value="on-route">On route</option>
    <option value="maintenance">Maintenance</option>`;
  const searchInput = dom.h('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Search plate / type';
  [statusSelect, searchInput].forEach((el) => el.classList.add('input'));
  filterBar.appendChild(statusSelect);
  filterBar.appendChild(searchInput);
  root.appendChild(filterBar);

  const cards = dom.h('div', 'card-list');
  root.appendChild(cards);

  const filters = FleetStore.state.filters.fleet;
  statusSelect.value = filters.status;
  searchInput.value = filters.search;

  const renderCards = () => {
    const { status, search } = FleetStore.state.filters.fleet;
    dom.clear(cards);
    FleetSeed.vehicles
      .filter((v) => (status === 'all' ? true : v.status === status))
      .filter((v) => `${v.id} ${v.type}`.toLowerCase().includes(search.toLowerCase()))
      .forEach((vehicle) => {
        const card = dom.h('div', 'panel');
        card.innerHTML = `
          <div class="flex-between">
            <h4>${vehicle.id}</h4>
            <span class="badge">${format.statusLabel(vehicle.status)}</span>
          </div>
          <p class="muted">${vehicle.type}</p>
          <p class="small">Driver: ${vehicle.driver}</p>
          <p class="small">Last check: ${format.dateShort(vehicle.lastCheck)}</p>
          <button class="button ghost small">Details</button>
        `;
        card.querySelector('button').addEventListener('click', () => openVehicle(vehicle));
        cards.appendChild(card);
      });
  };

  const openVehicle = (vehicle) => {
    const body = dom.h('div');
    body.innerHTML = `
      <p><strong>Plate:</strong> ${vehicle.id}</p>
      <p><strong>Type:</strong> ${vehicle.type}</p>
      <p><strong>Status:</strong> ${format.statusLabel(vehicle.status)}</p>
      <p><strong>Driver:</strong> ${vehicle.driver}</p>
      <p><strong>Last check:</strong> ${format.dateShort(vehicle.lastCheck)}</p>
    `;
    Modal.open({ title: 'Vehicle details', body });
  };

  const saveFilters = () => {
    FleetStore.state.filters.fleet = { status: statusSelect.value, search: searchInput.value };
    FleetStore.persist();
  };

  statusSelect.addEventListener('change', () => { saveFilters(); renderCards(); });
  searchInput.addEventListener('input', () => { saveFilters(); renderCards(); });

  renderCards();
  return root;
}

window.fleetView = fleetView;
