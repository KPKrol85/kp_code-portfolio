function fleetView() {
  const root = dom.h("div");
  const header = dom.h("div", "module-header");
  header.innerHTML = `<div><h3>Flota</h3><p class="muted small">Zarządzaj pojazdami</p></div><div class="toolbar"><button class="button primary" id="addVehicle" type="button">Dodaj pojazd</button></div>`;
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

  const filters = FleetStore.state.filters.fleet;
  statusSelect.value = filters.status;
  searchInput.value = filters.search;

  let isLoading = true;
  let loadingTimer = null;

  let filterTimer = null;
  const FILTER_DELAY = 160;
  const statusOptions = [
    { value: "available", label: "Dostepny" },
    { value: "on-route", label: "W trasie" },
    { value: "maintenance", label: "Serwis" },
  ];
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
        FleetStore.updateVehicle(vehicle.id, payload);
        const updatedVehicle = FleetStore.state.domain.fleet.find((v) => v.id === vehicle.id);
        buildActivityEntry("updated", updatedVehicle || vehicle);
        Toast.show("Pojazd zaktualizowany", "success");
      } else {
        FleetStore.addVehicle(payload);
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
      FleetStore.deleteVehicle(vehicle.id);
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

    const rows = FleetStore.state.domain.fleet.filter((v) => (status === "all" ? true : v.status === status)).filter((v) => `${v.id} ${v.type}`.toLowerCase().includes(search.toLowerCase()));

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
            openVehicleForm({ mode: "edit", vehicle });
          } else if (action.dataset.vehicleAction === "delete") {
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
    startFilterLoading();
  });

  searchInput.addEventListener("input", () => {
    saveFilters();
    startFilterLoading();
  });

  const addBtn = header.querySelector("#addVehicle");
  if (addBtn) {
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openVehicleForm({ mode: "add" });
    });
  }

  startLoading();

  CleanupRegistry.add(() => {
    if (loadingTimer) clearTimeout(loadingTimer);
    if (filterTimer) clearTimeout(filterTimer);
  });

  return root;
}

window.fleetView = fleetView;
