function fleetView() {
  const root = dom.h("div");
  root.appendChild(dom.h("div", "module-header", `<div><h3>Flota</h3><p class="muted small">Zarządzaj pojazdami</p></div>`));

  const filterBar = dom.h("div", "table-filter");
  const statusSelect = dom.h("select");
  statusSelect.innerHTML = `
    <option value="all">Status: wszystkie</option>
    <option value="available">Dostępny</option>
    <option value="on-route">W trasie</option>
    <option value="maintenance">Serwis</option>`;
  const searchInput = dom.h("input");
  searchInput.type = "search";
  searchInput.placeholder = "Szukaj rejestracji / typu";
  [statusSelect, searchInput].forEach((el) => el.classList.add("input"));
  filterBar.appendChild(statusSelect);
  filterBar.appendChild(searchInput);
  root.appendChild(filterBar);

  const cards = dom.h("div", "card-list");
  root.appendChild(cards);

  const filters = FleetStore.state.filters.fleet;
  statusSelect.value = filters.status;
  searchInput.value = filters.search;

  let isLoading = true;
  let loadingTimer = null;

  let filterTimer = null;
  const FILTER_DELAY = 160;

  const startFilterLoading = () => {
    if (filterTimer) clearTimeout(filterTimer);

    isLoading = true;
    renderSkeletonCards();

    filterTimer = setTimeout(() => {
      isLoading = false;
      renderCards();
    }, FILTER_DELAY);
  };

  const renderSkeletonCards = () => {
    cards.innerHTML = `
      ${Array.from({ length: 6 })
        .map(
          () => `
        <div class="panel skeleton-card">
          <div class="flex-between">
            <div class="skeleton line" style="width:120px;margin-top:0;"></div>
            <div class="skeleton" style="height:18px;width:70px;border-radius:999px;"></div>
          </div>

          <div class="skeleton line" style="width:160px;"></div>
          <div class="skeleton line" style="width:140px;"></div>
          <div class="skeleton line" style="width:150px;"></div>
          <div class="skeleton" style="height:30px;width:90px;border-radius:10px;margin-top:12px;"></div>
        </div>
      `
        )
        .join("")}
    `;
  };

  const startLoading = () => {
    isLoading = true;
    renderSkeletonCards();

    if (loadingTimer) clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
      isLoading = false;
      renderCards();
    }, 180);
  };

  const openVehicle = (vehicle) => {
    const body = dom.h("div");
    body.innerHTML = `
      <p><strong>Rejestracja:</strong> ${vehicle.id}</p>
      <p><strong>Typ:</strong> ${vehicle.type}</p>
      <p><strong>Status:</strong> ${format.statusLabel(vehicle.status)}</p>
      <p><strong>Kierowca:</strong> ${vehicle.driver}</p>
      <p><strong>Ostatni przegląd:</strong> ${format.dateShort(vehicle.lastCheck)}</p>
    `;
    Modal.open({ title: "Szczegóły pojazdu", body });
  };

  const saveFilters = () => {
    FleetStore.setFleetFilters({ status: statusSelect.value, search: searchInput.value });
  };

  const renderCards = () => {
    if (isLoading) {
      renderSkeletonCards();
      return;
    }

    const { status, search } = FleetStore.state.filters.fleet;

    const rows = FleetSeed.vehicles.filter((v) => (status === "all" ? true : v.status === status)).filter((v) => `${v.id} ${v.type}`.toLowerCase().includes(search.toLowerCase()));

    if (rows.length === 0) {
      cards.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__card">
            <p class="tag">Brak</p>
            <h3 class="empty-state__title">Brak pojazdów</h3>
            <p class="muted">Zmień filtry lub wyszukiwanie, żeby zobaczyć pojazdy we flocie.</p>
            <button class="button secondary" id="clearFleetFilters" type="button">Wyczyść filtry</button>
          </div>
        </div>
      `;

      cards.querySelector("#clearFleetFilters")?.addEventListener("click", () => {
        FleetStore.setFleetFilters({ status: "all", search: "" });
        statusSelect.value = "all";
        searchInput.value = "";

        startFilterLoading();
      });

      return;
    }

    dom.clear(cards);
    rows.forEach((vehicle) => {
      const card = dom.h("div", "panel");
      card.innerHTML = `
        <div class="flex-between">
          <h4>${vehicle.id}</h4>
          <span class="badge">${format.statusLabel(vehicle.status)}</span>
        </div>
        <p class="muted">${vehicle.type}</p>
        <p class="small">Kierowca: ${vehicle.driver}</p>
        <p class="small">Ostatni przegląd: ${format.dateShort(vehicle.lastCheck)}</p>
        <button class="button ghost small">Szczegóły</button>
      `;
      card.querySelector("button").addEventListener("click", () => openVehicle(vehicle));
      cards.appendChild(card);
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

window.fleetView = fleetView;
