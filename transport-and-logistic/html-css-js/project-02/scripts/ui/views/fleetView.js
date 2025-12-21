function fleetView() {
  const root = dom.h("div");
  root.appendChild(dom.h("div", "module-header", `<div><h3>Fleet</h3><p class="muted small">Zarządzaj pojazdami</p></div>`));

  const filterBar = dom.h("div", "table-filter");
  const statusSelect = dom.h("select");
  statusSelect.innerHTML = `
    <option value="all">Status: all</option>
    <option value="available">Available</option>
    <option value="on-route">On route</option>
    <option value="maintenance">Maintenance</option>`;
  const searchInput = dom.h("input");
  searchInput.type = "search";
  searchInput.placeholder = "Search plate / type";
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
        <div class="panel">
          <div class="flex-between">
            <div class="skeleton" style="height:14px;width:120px;"></div>
            <div class="skeleton" style="height:18px;width:70px;border-radius:999px;"></div>
          </div>

          <div style="margin-top:10px;">
            <div class="skeleton" style="height:12px;width:160px;"></div>
          </div>

          <div style="margin-top:8px;">
            <div class="skeleton" style="height:12px;width:140px;"></div>
          </div>

          <div style="margin-top:8px;">
            <div class="skeleton" style="height:12px;width:150px;"></div>
          </div>

          <div style="margin-top:12px;">
            <div class="skeleton" style="height:30px;width:90px;border-radius:10px;"></div>
          </div>
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
      <p><strong>Plate:</strong> ${vehicle.id}</p>
      <p><strong>Type:</strong> ${vehicle.type}</p>
      <p><strong>Status:</strong> ${format.statusLabel(vehicle.status)}</p>
      <p><strong>Driver:</strong> ${vehicle.driver}</p>
      <p><strong>Last check:</strong> ${format.dateShort(vehicle.lastCheck)}</p>
    `;
    Modal.open({ title: "Vehicle details", body });
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
            <p class="tag">Empty</p>
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
        <p class="small">Driver: ${vehicle.driver}</p>
        <p class="small">Last check: ${format.dateShort(vehicle.lastCheck)}</p>
        <button class="button ghost small">Details</button>
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
  return root;
}

window.fleetView = fleetView;
