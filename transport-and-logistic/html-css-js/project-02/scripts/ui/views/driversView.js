function driversView() {
  const root = dom.h("div");
  root.appendChild(dom.h("div", "module-header", `<div><h3>Drivers</h3><p class="muted small">Status i ostatnie kursy</p></div>`));

  const filterBar = dom.h("div", "table-filter");
  const statusSelect = dom.h("select");
  statusSelect.innerHTML = `
    <option value="all">Status: all</option>
    <option value="available">Available</option>
    <option value="on-route">On route</option>
    <option value="maintenance">Maintenance</option>`;
  const searchInput = dom.h("input");
  searchInput.type = "search";
  searchInput.placeholder = "Search driver";
  [statusSelect, searchInput].forEach((el) => el.classList.add("input"));
  filterBar.appendChild(statusSelect);
  filterBar.appendChild(searchInput);
  root.appendChild(filterBar);

  const list = dom.h("div", "panel");
  list.innerHTML = '<div class="table-responsive"><table class="table"><thead><tr><th>Name</th><th>Status</th><th>Last trip</th><th>Phone</th></tr></thead><tbody></tbody></table></div>';
  root.appendChild(list);

  const tableWrap = list.querySelector(".table-responsive");

  const filters = FleetStore.state.filters.drivers;
  statusSelect.value = filters.status;
  searchInput.value = filters.search;

  const openDriver = (driver) => {
    const body = dom.h("div");
    body.innerHTML = `
      <p><strong>${driver.name}</strong></p>
      <p>Status: ${format.statusLabel(driver.status)}</p>
      <p>Last trip: ${driver.lastTrip}</p>
      <p>Phone: ${driver.phone}</p>
    `;
    Modal.open({ title: "Driver details", body });
  };

  const saveFilters = () => {
    FleetStore.setDriverFilters({
      status: statusSelect.value,
      search: searchInput.value,
    });
  };

  const ensureTable = () => {
    if (list.querySelector("tbody")) return;

    tableWrap.innerHTML = '<table class="table"><thead><tr><th>Name</th><th>Status</th><th>Last trip</th><th>Phone</th></tr></thead><tbody></tbody></table>';
  };

  const renderRows = () => {
    const { status, search } = FleetStore.state.filters.drivers;

    const rows = FleetSeed.drivers.filter((d) => (status === "all" ? true : d.status === status)).filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

    if (rows.length === 0) {
      tableWrap.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__card">
            <p class="tag">Empty</p>
            <h3 class="empty-state__title">Brak wyników</h3>
            <p class="muted">Zmień filtry lub wyszukiwanie, żeby zobaczyć kierowców.</p>
            <button class="button secondary" id="clearDriversFilters" type="button">Wyczyść filtry</button>
          </div>
        </div>
      `;

      tableWrap.querySelector("#clearDriversFilters")?.addEventListener("click", () => {
        FleetStore.setDriverFilters({ status: "all", search: "" });
        statusSelect.value = "all";
        searchInput.value = "";
        renderRows();
      });

      return;
    }

    ensureTable();
    const tbody = list.querySelector("tbody");
    tbody.innerHTML = "";

    rows.forEach((driver) => {
      const tr = dom.h("tr");
      tr.innerHTML = `
        <td>${driver.name}</td>
        <td><span class="badge">${format.statusLabel(driver.status)}</span></td>
        <td>${driver.lastTrip}</td>
        <td>${driver.phone}</td>`;
      tr.addEventListener("click", () => openDriver(driver));
      tbody.appendChild(tr);
    });
  };

  statusSelect.addEventListener("change", () => {
    saveFilters();
    renderRows();
  });

  searchInput.addEventListener("input", () => {
    saveFilters();
    renderRows();
  });

  renderRows();
  return root;
}

window.driversView = driversView;
