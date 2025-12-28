function driversView() {
  const root = dom.h("div");
  root.appendChild(dom.h("div", "module-header", `<div><h3>Kierowcy</h3><p class="muted small">Status i ostatnie kursy</p></div>`));

  const filterBar = dom.h("div", "table-filter");
  const statusSelect = dom.h("select");
  statusSelect.innerHTML = `
    <option value="all">Status: wszystkie</option>
    <option value="available">Dostępny</option>
    <option value="on-route">W trasie</option>
    <option value="maintenance">Serwis</option>`;
  const searchInput = dom.h("input");
  searchInput.type = "search";
  searchInput.placeholder = "Szukaj kierowcy";
  [statusSelect, searchInput].forEach((el) => el.classList.add("input"));
  filterBar.appendChild(statusSelect);
  filterBar.appendChild(searchInput);
  root.appendChild(filterBar);

  const list = dom.h("div", "panel");
  list.innerHTML = '<div class="table-responsive"><table class="table"><thead><tr><th>Imię i nazwisko</th><th>Status</th><th>Ostatni kurs</th><th>Telefon</th></tr></thead><tbody></tbody></table></div>';
  root.appendChild(list);

  const tableWrap = list.querySelector(".table-responsive");

  const filters = FleetStore.state.filters.drivers;
  statusSelect.value = filters.status;
  searchInput.value = filters.search;

  let isLoading = true;
  let loadingTimer = null;

  let filterTimer = null;
  const FILTER_DELAY = 160;

  const startFilterLoading = () => {
    if (filterTimer) clearTimeout(filterTimer);

    isLoading = true;
    renderSkeleton();

    filterTimer = setTimeout(() => {
      isLoading = false;
      renderRows();
    }, FILTER_DELAY);
  };

  const renderSkeleton = () => {
    tableWrap.innerHTML = `
      <div class="skeleton-table">
        ${Array.from({ length: 6 })
          .map(
            () => `
          <div class="skeleton-row" style="grid-template-columns: 1.2fr 0.7fr 1fr 0.8fr;">
            <div class="skeleton skeleton-cell lg"></div>
            <div class="skeleton skeleton-cell"></div>
            <div class="skeleton skeleton-cell"></div>
            <div class="skeleton skeleton-cell"></div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  };

  const startLoading = () => {
    isLoading = true;
    renderSkeleton();

    if (loadingTimer) clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
      isLoading = false;
      renderRows();
    }, 180);
  };

  const openDriver = (driver) => {
    const body = dom.h("div");
    body.innerHTML = `
      <p><strong>${driver.name}</strong></p>
      <p>Status: ${format.statusLabel(driver.status)}</p>
      <p>Ostatni kurs: ${driver.lastTrip}</p>
      <p>Telefon: ${driver.phone}</p>
    `;
    Modal.open({ title: "Szczegóły kierowcy", body });
  };

  const saveFilters = () => {
    FleetStore.setDriverFilters({
      status: statusSelect.value,
      search: searchInput.value,
    });
  };

  const ensureTable = () => {
    if (list.querySelector("tbody")) return;

    tableWrap.innerHTML = '<table class="table"><thead><tr><th>Imię i nazwisko</th><th>Status</th><th>Ostatni kurs</th><th>Telefon</th></tr></thead><tbody></tbody></table>';
  };

  const renderRows = () => {
    if (isLoading) {
      renderSkeleton();
      return;
    }

    const { status, search } = FleetStore.state.filters.drivers;

    const rows = FleetStore.state.domain.drivers.filter((d) => (status === "all" ? true : d.status === status)).filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

    if (rows.length === 0) {
      tableWrap.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__card">
            <p class="tag">Brak</p>
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

        startFilterLoading();
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
    startFilterLoading();
  });

  searchInput.addEventListener("input", () => {
    saveFilters();
    startFilterLoading();
  });

  startLoading();

  CleanupRegistry.add(() => {
    if (loadingTimer) clearTimeout(loadingTimer);
    if (filterTimer) clearTimeout(filterTimer);
  });

  return root;
}

window.driversView = driversView;

