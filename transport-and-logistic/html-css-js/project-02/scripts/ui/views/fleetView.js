function fleetView() {
  const root = dom.h("div");
  const permissions = window.FleetPermissions || {};
  const Actions = permissions.Actions || {};
  const can = permissions.can || (() => true);
  const explainDeny = permissions.explainDeny || (() => "");
  const applyDisabledState = permissions.applyDisabledState || ((el) => el && el.setAttribute("aria-disabled", "false"));
  const guard = permissions.guard || (() => true);
  const getPermissionContext = (record) => ({ user: FleetStore.state.currentUser, record });

  const header = dom.h("div", "module-header");
  header.innerHTML = `<div><h3>Flota</h3><p class="muted small">Zarządzaj pojazdami</p></div><div class="toolbar"><select class="input" id="fleetSortBy" aria-label="Sortuj"><option value="id">Rejestracja</option><option value="status">Status</option><option value="lastCheck">Ostatni przeglad</option><option value="type">Typ</option></select><select class="input" id="fleetSortDir" aria-label="Kierunek"><option value="asc">Rosnaco</option><option value="desc">Malejaco</option></select><button class="button primary" id="addVehicle" type="button">Dodaj pojazd</button></div>`;
  root.appendChild(header);

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

  const loadMoreWrap = dom.h("div");
  loadMoreWrap.style.marginTop = "12px";
  loadMoreWrap.style.display = "flex";
  loadMoreWrap.style.justifyContent = "center";
  const loadMoreBtn = dom.h("button", "button secondary", "Load more");
  loadMoreBtn.type = "button";
  loadMoreWrap.appendChild(loadMoreBtn);
  root.appendChild(loadMoreWrap);

  const filters = FleetStore.state.filters.fleet;
  statusSelect.value = filters.status;
  searchInput.value = filters.search;

  const sortBySelect = header.querySelector("#fleetSortBy");
  const sortDirSelect = header.querySelector("#fleetSortDir");
  const listPrefsFallback = { sortBy: "id", sortDir: "asc", pageSize: 10, visibleCount: 10 };
  const getListPrefs = () => FleetStore.state.listPrefs?.fleet || listPrefsFallback;
  const syncSortControls = () => {
    const prefs = getListPrefs();
    if (sortBySelect) sortBySelect.value = prefs.sortBy || listPrefsFallback.sortBy;
    if (sortDirSelect) sortDirSelect.value = prefs.sortDir || listPrefsFallback.sortDir;
  };

  syncSortControls();
  if (sortBySelect) {
    sortBySelect.addEventListener("change", () => {
      const prefs = getListPrefs();
      FleetStore.setListPrefs("fleet", { sortBy: sortBySelect.value, visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
      renderCards();
    });
  }
  if (sortDirSelect) {
    sortDirSelect.addEventListener("change", () => {
      const prefs = getListPrefs();
      FleetStore.setListPrefs("fleet", { sortDir: sortDirSelect.value, visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
      renderCards();
    });
  }

  let isLoading = true;
  let loadingTimer = null;

  let filterTimer = null;
  const FILTER_DELAY = 160;
  const statusOptions = [
    { value: "available", label: "Dostepny" },
    { value: "on-route", label: "W trasie" },
    { value: "maintenance", label: "Serwis" },
  ];
  const statusOrder = { available: 1, "on-route": 2, maintenance: 3 };
  const getFleetSortValue = (vehicle, sortBy) => {
    if (sortBy === "id") return String(vehicle.id || "").toLowerCase();
    if (sortBy === "status") return statusOrder[vehicle.status] || 99;
    if (sortBy === "lastCheck") return Date.parse(vehicle.lastCheck || "");
    if (sortBy === "type") return String(vehicle.type || "").toLowerCase();
    return String(vehicle.id || "").toLowerCase();
  };
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const buildActivityEntry = (action, vehicle) => {
    const verb = { created: "dodany", updated: "zaktualizowany", deleted: "usuniety" }[action] || "zaktualizowany";
    const detail = vehicle ? `${vehicle.type || "Pojazd"} (${vehicle.id || "nowy"})` : "";
    FleetStore.addActivity({
      title: vehicle && vehicle.id ? `Pojazd ${vehicle.id} ${verb}` : `Pojazd ${verb}`,
      detail,
      time: new Date().toISOString(),
    });
  };

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
    loadMoreWrap.style.display = "none";
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

  const clearFormErrors = (form) => {
    form.querySelectorAll("[data-error-for]").forEach((el) => {
      el.textContent = "";
    });
    form.querySelectorAll("[aria-invalid]").forEach((el) => {
      el.setAttribute("aria-invalid", "false");
    });
  };

  const setFieldError = (form, name, message) => {
    const field = form.querySelector(`[name="${name}"]`);
    const error = form.querySelector(`[data-error-for="${name}"]`);
    if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message || "";
  };

  const getVehicleFormValues = (form) => {
    const data = new FormData(form);
    return {
      id: String(data.get("id") || "").trim(),
      type: String(data.get("type") || "").trim(),
      status: String(data.get("status") || "").trim(),
      lastCheck: String(data.get("lastCheck") || "").trim(),
      driver: String(data.get("driver") || "").trim(),
    };
  };

  const validateVehicleForm = (values, { isEdit = false, existingIds = [] } = {}) => {
    const errors = {};
    if (!values.id) errors.id = "Wymagane";
    else if (values.id.length > 20) errors.id = "Maks. 20 znakow";
    else if (!isEdit && existingIds.includes(values.id)) errors.id = "ID pojazdu juz istnieje";

    if (!values.type) errors.type = "Wymagane";
    else if (values.type.length > 40) errors.type = "Maks. 40 znakow";

    if (!values.status) errors.status = "Wybierz status";

    if (!values.lastCheck) errors.lastCheck = "Wymagane";
    else if (!datePattern.test(values.lastCheck)) errors.lastCheck = "Format: YYYY-MM-DD";

    if (values.driver.length > 40) errors.driver = "Maks. 40 znakow";
    return errors;
  };

  const openVehicleForm = ({ mode = "add", vehicle = null } = {}) => {
    const isEdit = mode === "edit";
    const form = dom.h("form");
    form.noValidate = true;
    form.style.display = "grid";
    form.style.gap = "12px";
    form.innerHTML = `
      <label class="form-control">
        <span class="label">Rejestracja</span>
        <input class="input" name="id" maxlength="20" placeholder="np. GD-5402N" required ${isEdit ? "readonly" : ""} />
        <span class="form-error" data-error-for="id"></span>
      </label>
      <label class="form-control">
        <span class="label">Typ</span>
        <input class="input" name="type" maxlength="40" placeholder="np. Chlodnia" required />
        <span class="form-error" data-error-for="type"></span>
      </label>
      <label class="form-control">
        <span class="label">Status</span>
        <select class="input" name="status" required>
          ${statusOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
        </select>
        <span class="form-error" data-error-for="status"></span>
      </label>
      <label class="form-control">
        <span class="label">Ostatni przeglad</span>
        <input class="input" name="lastCheck" maxlength="10" placeholder="YYYY-MM-DD" required />
        <span class="form-error" data-error-for="lastCheck"></span>
      </label>
      <label class="form-control">
        <span class="label">Kierowca</span>
        <input class="input" name="driver" maxlength="40" placeholder="np. K. Mazur" />
        <span class="form-error" data-error-for="driver"></span>
      </label>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:4px;">
        <button class="button ghost" type="button" data-modal-cancel>Anuluj</button>
        <button class="button primary" type="submit">${isEdit ? "Zapisz zmiany" : "Dodaj pojazd"}</button>
      </div>
    `;

    const defaultValues = {
      id: "",
      type: "",
      status: "available",
      lastCheck: "",
      driver: "",
    };
    const values = vehicle ? { ...defaultValues, ...vehicle } : defaultValues;
    form.elements.id.value = values.id || "";
    form.elements.type.value = values.type || "";
    form.elements.status.value = values.status || defaultValues.status;
    form.elements.lastCheck.value = values.lastCheck || "";
    form.elements.driver.value = values.driver || "";

    form.querySelector("[data-modal-cancel]").addEventListener("click", (e) => {
      e.preventDefault();
      Modal.close();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearFormErrors(form);
      const action = isEdit ? Actions.FLEET_EDIT : Actions.FLEET_CREATE;
      const context = getPermissionContext(vehicle);
      if (!guard(action, context)) return;
      const formValues = getVehicleFormValues(form);
      const existingIds = FleetStore.state.domain.fleet.map((v) => v.id);
      const errors = validateVehicleForm(formValues, { isEdit, existingIds });
      Object.keys(errors).forEach((name) => setFieldError(form, name, errors[name]));
      if (Object.keys(errors).length) return;

      const payload = {
        id: formValues.id,
        type: formValues.type,
        status: formValues.status,
        lastCheck: formValues.lastCheck,
        driver: formValues.driver,
      };

      if (isEdit && vehicle) {
        if (!FleetStore.updateVehicle(vehicle.id, payload)) return;
        const updatedVehicle = FleetStore.state.domain.fleet.find((v) => v.id === vehicle.id);
        buildActivityEntry("updated", updatedVehicle || vehicle);
        Toast.show("Pojazd zaktualizowany", "success");
      } else {
        if (!FleetStore.addVehicle(payload)) return;
        const createdVehicle = FleetStore.state.domain.fleet.find((v) => v.id === payload.id);
        buildActivityEntry("created", createdVehicle || payload);
        Toast.show("Pojazd dodany", "success");
      }

      Modal.close();
      renderCards();
    });

    Modal.open({ title: isEdit && vehicle ? `Edytuj ${vehicle.id}` : "Dodaj pojazd", body: form });
  };

  const openDeleteConfirm = (vehicle) => {
    if (!guard(Actions.FLEET_DELETE, getPermissionContext(vehicle))) return;
    const body = dom.h("div");
    body.innerHTML = `
      <p>Usunac pojazd <strong>${vehicle.id}</strong>?</p>
      <p class="muted small">${vehicle.type}</p>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">
        <button class="button ghost" type="button" data-modal-cancel>Anuluj</button>
        <button class="button primary" type="button" data-modal-confirm>Usun</button>
      </div>
    `;

    body.querySelector("[data-modal-cancel]").addEventListener("click", (e) => {
      e.preventDefault();
      Modal.close();
    });

    body.querySelector("[data-modal-confirm]").addEventListener("click", (e) => {
      e.preventDefault();
      if (!guard(Actions.FLEET_DELETE, getPermissionContext(vehicle))) return;
      if (!FleetStore.deleteVehicle(vehicle.id)) return;
      buildActivityEntry("deleted", vehicle);
      Toast.show("Pojazd usuniety", "success");
      Modal.close();
      renderCards();
    });

    Modal.open({ title: "Potwierdzenie usuniecia", body });
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

    const rows = FleetStore.state.domain.fleet
      .filter((v) => (status === "all" ? true : v.status === status))
      .filter((v) => `${v.id} ${v.type}`.toLowerCase().includes(search.toLowerCase()));

    const prefs = getListPrefs();
    const sortBy = prefs.sortBy || listPrefsFallback.sortBy;
    const sortDir = prefs.sortDir === "desc" ? -1 : 1;
    const sortedRows = rows
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const aVal = getFleetSortValue(a.item, sortBy);
        const bVal = getFleetSortValue(b.item, sortBy);
        let diff = 0;
        if (typeof aVal === "string" || typeof bVal === "string") {
          diff = String(aVal).localeCompare(String(bVal));
        } else {
          diff = (aVal || 0) - (bVal || 0);
        }
        if (diff === 0) return a.index - b.index;
        return diff * sortDir;
      })
      .map((entry) => entry.item);

    const pageSize = prefs.pageSize || listPrefsFallback.pageSize;
    const visibleCount = prefs.visibleCount || pageSize;
    const visibleRows = sortedRows.slice(0, visibleCount);
    const canLoadMore = sortedRows.length > visibleRows.length;

    if (rows.length === 0) {
      loadMoreWrap.style.display = "none";
      
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
        const prefs = getListPrefs();
        FleetStore.setListPrefs("fleet", { visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
        statusSelect.value = "all";
        searchInput.value = "";

        startFilterLoading();
      });

      return;
    }

    dom.clear(cards);
    loadMoreWrap.style.display = canLoadMore ? "flex" : "none";
    loadMoreBtn.disabled = !canLoadMore;
    visibleRows.forEach((vehicle) => {
      const card = dom.h("div", "panel");
      card.innerHTML = `
        <div class="flex-between">
          <h4>${vehicle.id}</h4>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="badge">${format.statusLabel(vehicle.status)}</span>
            <div class="dropdown" data-vehicle-menu>
              <button class="button ghost dropdown-trigger" type="button" aria-haspopup="menu" aria-expanded="false">...</button>
              <div class="dropdown-menu" role="menu" aria-label="Akcje pojazdu">
                <button class="dropdown-item" type="button" data-vehicle-action="edit">Edytuj</button>
                <button class="dropdown-item" type="button" data-vehicle-action="delete">Usun</button>
              </div>
            </div>
          </div>
        </div>
        <p class="muted">${vehicle.type}</p>
        <p class="small">Kierowca: ${vehicle.driver}</p>
        <p class="small">Ostatni przegląd: ${format.dateShort(vehicle.lastCheck)}</p>
        <button class="button ghost small">Szczegóły</button>
      `;
      const detailsBtn = card.querySelector("button.button.ghost.small");
      detailsBtn.addEventListener("click", () => openVehicle(vehicle));

      const trigger = card.querySelector(".dropdown-trigger");
      const menu = card.querySelector(".dropdown-menu");

      const editBtn = card.querySelector('[data-vehicle-action="edit"]');
      const deleteBtn = card.querySelector('[data-vehicle-action="delete"]');
      const editAllowed = can(Actions.FLEET_EDIT, getPermissionContext(vehicle));
      const deleteAllowed = can(Actions.FLEET_DELETE, getPermissionContext(vehicle));
      applyDisabledState(editBtn, editAllowed, explainDeny(Actions.FLEET_EDIT, getPermissionContext(vehicle)));
      applyDisabledState(deleteBtn, deleteAllowed, explainDeny(Actions.FLEET_DELETE, getPermissionContext(vehicle)));

      if (trigger && menu) {
        trigger.addEventListener("click", (event) => {
          event.stopPropagation();
          Dropdown.toggle(trigger, menu);
        });

        menu.addEventListener("click", (event) => {
          const action = event.target.closest("[data-vehicle-action]");
          if (!action) return;
          event.preventDefault();
          event.stopPropagation();

          if (action.dataset.vehicleAction === "edit") {
            if (!guard(Actions.FLEET_EDIT, getPermissionContext(vehicle))) return;
            openVehicleForm({ mode: "edit", vehicle });
          } else if (action.dataset.vehicleAction === "delete") {
            if (!guard(Actions.FLEET_DELETE, getPermissionContext(vehicle))) return;
            openDeleteConfirm(vehicle);
          }

          Dropdown.toggle(trigger, menu);
        });
      }
      cards.appendChild(card);
    });
  };

  statusSelect.addEventListener("change", () => {
    saveFilters();
    const prefs = getListPrefs();
    FleetStore.setListPrefs("fleet", { visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
    startFilterLoading();
  });

  searchInput.addEventListener("input", () => {
    saveFilters();
    const prefs = getListPrefs();
    FleetStore.setListPrefs("fleet", { visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
    startFilterLoading();
  });

  const addBtn = header.querySelector("#addVehicle");
  if (addBtn) {
    const allowCreate = can(Actions.FLEET_CREATE, getPermissionContext());
    applyDisabledState(addBtn, allowCreate, explainDeny(Actions.FLEET_CREATE, getPermissionContext()));
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!guard(Actions.FLEET_CREATE, getPermissionContext())) return;
      openVehicleForm({ mode: "add" });
    });
  }

  loadMoreBtn.addEventListener("click", () => {
    const prefs = getListPrefs();
    const pageSize = prefs.pageSize || listPrefsFallback.pageSize;
    const nextCount = (prefs.visibleCount || pageSize) + pageSize;
    FleetStore.setListPrefs("fleet", { visibleCount: nextCount });
    renderCards();
  });

  startLoading();

  CleanupRegistry.add(() => {
    if (loadingTimer) clearTimeout(loadingTimer);
    if (filterTimer) clearTimeout(filterTimer);
  });

  return root;
}

window.fleetView = fleetView;
