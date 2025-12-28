function driversView() {
  const root = dom.h("div");
  const permissions = window.FleetPermissions || {};
  const Actions = permissions.Actions || {};
  const can = permissions.can || (() => true);
  const explainDeny = permissions.explainDeny || (() => "");
  const applyDisabledState = permissions.applyDisabledState || ((el) => el && el.setAttribute("aria-disabled", "false"));
  const guard = permissions.guard || (() => true);
  const getPermissionContext = (record) => ({ user: FleetStore.state.currentUser, record });

  const header = dom.h("div", "module-header");
  header.innerHTML = `<div><h3>Kierowcy</h3><p class="muted small">Status i ostatnie kursy</p></div><div class="toolbar"><select class="input" id="driversSortBy" aria-label="Sortuj"><option value="name">Imie i nazwisko</option><option value="status">Status</option><option value="phone">Telefon</option><option value="lastTrip">Ostatni kurs</option></select><select class="input" id="driversSortDir" aria-label="Kierunek"><option value="asc">Rosnaco</option><option value="desc">Malejaco</option></select><button class="button primary" id="addDriver" type="button">Dodaj kierowce</button></div>`;
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
  searchInput.placeholder = "Szukaj kierowcy";
  [statusSelect, searchInput].forEach((el) => el.classList.add("input"));
  filterBar.appendChild(statusSelect);
  filterBar.appendChild(searchInput);
  root.appendChild(filterBar);

  const list = dom.h("div", "panel");
  list.innerHTML = '<div class="table-responsive"><table class="table"><thead><tr><th>Imię i nazwisko</th><th>Status</th><th>Ostatni kurs</th><th>Telefon</th><th>Akcje</th></tr></thead><tbody></tbody></table></div>';
  root.appendChild(list);

  const loadMoreWrap = dom.h("div");
  loadMoreWrap.style.marginTop = "12px";
  loadMoreWrap.style.display = "flex";
  loadMoreWrap.style.justifyContent = "center";
  const loadMoreBtn = dom.h("button", "button secondary", "Load more");
  loadMoreBtn.type = "button";
  loadMoreWrap.appendChild(loadMoreBtn);
  root.appendChild(loadMoreWrap);

  const tableWrap = list.querySelector(".table-responsive");

  const filters = FleetStore.state.filters.drivers;
  statusSelect.value = filters.status;
  searchInput.value = filters.search;

  const sortBySelect = header.querySelector("#driversSortBy");
  const sortDirSelect = header.querySelector("#driversSortDir");
  const listPrefsFallback = { sortBy: "name", sortDir: "asc", pageSize: 10, visibleCount: 10 };
  const getListPrefs = () => FleetStore.state.listPrefs?.drivers || listPrefsFallback;
  const syncSortControls = () => {
    const prefs = getListPrefs();
    if (sortBySelect) sortBySelect.value = prefs.sortBy || listPrefsFallback.sortBy;
    if (sortDirSelect) sortDirSelect.value = prefs.sortDir || listPrefsFallback.sortDir;
  };

  syncSortControls();
  if (sortBySelect) {
    sortBySelect.addEventListener("change", () => {
      const prefs = getListPrefs();
      FleetStore.setListPrefs("drivers", { sortBy: sortBySelect.value, visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
      renderRows();
    });
  }
  if (sortDirSelect) {
    sortDirSelect.addEventListener("change", () => {
      const prefs = getListPrefs();
      FleetStore.setListPrefs("drivers", { sortDir: sortDirSelect.value, visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
      renderRows();
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
  const getDriverSortValue = (driver, sortBy) => {
    if (sortBy === "name") return String(driver.name || "").toLowerCase();
    if (sortBy === "status") return statusOrder[driver.status] || 99;
    if (sortBy === "phone") return normalizePhone(driver.phone);
    if (sortBy === "lastTrip") return String(driver.lastTrip || "").toLowerCase();
    return String(driver.name || "").toLowerCase();
  };
  const normalizePhone = (value) => String(value || "").replace(/\D/g, "");
  const buildActivityEntry = (action, driver) => {
    const verb = { created: "added", updated: "updated", deleted: "deleted" }[action] || "updated";
    const label = driver ? `${driver.name || "Driver"} (${driver.id || "new"})` : "";
    FleetStore.addActivity({
      title: `Driver ${verb}: ${label}`.trim(),
      detail: driver && driver.phone ? `Phone: ${driver.phone}` : "",
      time: new Date().toISOString(),
    });
  };

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
    loadMoreWrap.style.display = "none";
    tableWrap.innerHTML = `
      <div class="skeleton-table">
        ${Array.from({ length: 6 })
          .map(
            () => `
          <div class="skeleton-row" style="grid-template-columns: 1.2fr 0.7fr 1fr 0.8fr 0.4fr;">
            <div class="skeleton skeleton-cell lg"></div>
            <div class="skeleton skeleton-cell"></div>
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

  const getDriverFormValues = (form) => {
    const data = new FormData(form);
    return {
      name: String(data.get("name") || "").trim(),
      status: String(data.get("status") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      lastTrip: String(data.get("lastTrip") || "").trim(),
    };
  };

  const validateDriverForm = (values, { isEdit = false, currentId = null } = {}) => {
    const errors = {};
    if (!values.name) errors.name = "Wymagane";
    else if (values.name.length > 80) errors.name = "Maks. 80 znakow";

    if (!values.status) errors.status = "Wybierz status";

    if (!values.phone) errors.phone = "Wymagane";
    const phoneDigits = normalizePhone(values.phone);
    if (!errors.phone && phoneDigits.length < 9) errors.phone = "Min. 9 cyfr";
    if (!errors.phone) {
      const duplicates = FleetStore.state.domain.drivers
        .filter((d) => (isEdit ? d.id !== currentId : true))
        .some((d) => normalizePhone(d.phone) === phoneDigits);
      if (duplicates) errors.phone = "Telefon juz istnieje";
    }

    if (values.lastTrip.length > 80) errors.lastTrip = "Maks. 80 znakow";
    return errors;
  };

  const openDriverForm = ({ mode = "add", driver = null } = {}) => {
    const isEdit = mode === "edit";
    const form = dom.h("form");
    form.noValidate = true;
    form.style.display = "grid";
    form.style.gap = "12px";
    form.innerHTML = `
      <label class="form-control">
        <span class="label">Imie i nazwisko</span>
        <input class="input" name="name" maxlength="80" placeholder="np. Anna Lewandowska" required />
        <span class="form-error" data-error-for="name"></span>
      </label>
      <label class="form-control">
        <span class="label">Status</span>
        <select class="input" name="status" required>
          ${statusOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
        </select>
        <span class="form-error" data-error-for="status"></span>
      </label>
      <label class="form-control">
        <span class="label">Telefon</span>
        <input class="input" name="phone" maxlength="20" placeholder="np. +48 600 200 111" required />
        <span class="form-error" data-error-for="phone"></span>
      </label>
      <label class="form-control">
        <span class="label">Ostatni kurs</span>
        <input class="input" name="lastTrip" maxlength="80" placeholder="np. Warszawa - Rzeszow" />
        <span class="form-error" data-error-for="lastTrip"></span>
      </label>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:4px;">
        <button class="button ghost" type="button" data-modal-cancel>Anuluj</button>
        <button class="button primary" type="submit">${isEdit ? "Zapisz zmiany" : "Dodaj kierowce"}</button>
      </div>
    `;

    const defaultValues = {
      name: "",
      status: "available",
      phone: "",
      lastTrip: "",
    };
    const values = driver ? { ...defaultValues, ...driver } : defaultValues;
    form.elements.name.value = values.name || "";
    form.elements.status.value = values.status || defaultValues.status;
    form.elements.phone.value = values.phone || "";
    form.elements.lastTrip.value = values.lastTrip || "";

    form.querySelector("[data-modal-cancel]").addEventListener("click", (e) => {
      e.preventDefault();
      Modal.close();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearFormErrors(form);
      const action = isEdit ? Actions.DRIVERS_EDIT : Actions.DRIVERS_CREATE;
      const context = getPermissionContext(driver);
      if (!guard(action, context)) return;
      const formValues = getDriverFormValues(form);
      const errors = validateDriverForm(formValues, { isEdit, currentId: driver ? driver.id : null });
      Object.keys(errors).forEach((name) => setFieldError(form, name, errors[name]));
      if (Object.keys(errors).length) return;

      const payload = {
        name: formValues.name,
        status: formValues.status,
        phone: formValues.phone,
        lastTrip: formValues.lastTrip,
      };

      if (isEdit && driver) {
        FleetStore.updateDriver(driver.id, payload);
        const updatedDriver = FleetStore.state.domain.drivers.find((d) => d.id === driver.id);
        buildActivityEntry("updated", updatedDriver || driver);
        Toast.show("Kierowca zaktualizowany", "success");
      } else {
        FleetStore.addDriver(payload);
        const createdDriver = FleetStore.state.domain.drivers[FleetStore.state.domain.drivers.length - 1];
        buildActivityEntry("created", createdDriver || payload);
        Toast.show("Kierowca dodany", "success");
      }

      Modal.close();
      renderRows();
    });

    Modal.open({ title: isEdit && driver ? `Edytuj ${driver.name}` : "Dodaj kierowce", body: form });
  };

  const openDeleteConfirm = (driver) => {
    if (!guard(Actions.DRIVERS_DELETE, getPermissionContext(driver))) return;
    const body = dom.h("div");
    body.innerHTML = `
      <p>Usunac kierowce <strong>${driver.name}</strong>?</p>
      <p class="muted small">${driver.phone || ""}</p>
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
      if (!guard(Actions.DRIVERS_DELETE, getPermissionContext(driver))) return;
      FleetStore.deleteDriver(driver.id);
      buildActivityEntry("deleted", driver);
      Toast.show("Kierowca usuniety", "success");
      Modal.close();
      renderRows();
    });

    Modal.open({ title: "Potwierdzenie usuniecia", body });
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

    tableWrap.innerHTML = '<table class="table"><thead><tr><th>Imię i nazwisko</th><th>Status</th><th>Ostatni kurs</th><th>Telefon</th><th>Akcje</th></tr></thead><tbody></tbody></table>';
  };

  const renderRows = () => {
    if (isLoading) {
      renderSkeleton();
      return;
    }

    const { status, search } = FleetStore.state.filters.drivers;

    const rows = FleetStore.state.domain.drivers
      .filter((d) => (status === "all" ? true : d.status === status))
      .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

    const prefs = getListPrefs();
    const sortBy = prefs.sortBy || listPrefsFallback.sortBy;
    const sortDir = prefs.sortDir === "desc" ? -1 : 1;
    const sortedRows = rows
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const aVal = getDriverSortValue(a.item, sortBy);
        const bVal = getDriverSortValue(b.item, sortBy);
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
        const prefs = getListPrefs();
        FleetStore.setListPrefs("drivers", { visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
        statusSelect.value = "all";
        searchInput.value = "";

        startFilterLoading();
      });

      return;
    }

    ensureTable();
    const tbody = list.querySelector("tbody");
    tbody.innerHTML = "";

    loadMoreWrap.style.display = canLoadMore ? "flex" : "none";
    loadMoreBtn.disabled = !canLoadMore;

    visibleRows.forEach((driver) => {
      const tr = dom.h("tr");
      tr.innerHTML = `
        <td>${driver.name}</td>
        <td><span class="badge">${format.statusLabel(driver.status)}</span></td>
        <td>${driver.lastTrip}</td>
        <td>${driver.phone}</td>
        <td>
          <div class="dropdown" data-driver-menu>
            <button class="button ghost dropdown-trigger" type="button" aria-haspopup="menu" aria-expanded="false">...</button>
            <div class="dropdown-menu" role="menu" aria-label="Akcje kierowcy">
              <button class="dropdown-item" type="button" data-driver-action="edit">Edytuj</button>
              <button class="dropdown-item" type="button" data-driver-action="delete">Usun</button>
            </div>
          </div>
        </td>`;

      tr.addEventListener("click", (event) => {
        if (event.target.closest("[data-driver-menu]")) return;
        openDriver(driver);
      });

      const trigger = tr.querySelector(".dropdown-trigger");
      const menu = tr.querySelector(".dropdown-menu");

      const editBtn = tr.querySelector('[data-driver-action="edit"]');
      const deleteBtn = tr.querySelector('[data-driver-action="delete"]');
      const editAllowed = can(Actions.DRIVERS_EDIT, getPermissionContext(driver));
      const deleteAllowed = can(Actions.DRIVERS_DELETE, getPermissionContext(driver));
      applyDisabledState(editBtn, editAllowed, explainDeny(Actions.DRIVERS_EDIT, getPermissionContext(driver)));
      applyDisabledState(deleteBtn, deleteAllowed, explainDeny(Actions.DRIVERS_DELETE, getPermissionContext(driver)));

      if (trigger && menu) {
        trigger.addEventListener("click", (event) => {
          event.stopPropagation();
          Dropdown.toggle(trigger, menu);
        });

        menu.addEventListener("click", (event) => {
          const action = event.target.closest("[data-driver-action]");
          if (!action) return;
          event.preventDefault();
          event.stopPropagation();

          if (action.dataset.driverAction === "edit") {
            if (!guard(Actions.DRIVERS_EDIT, getPermissionContext(driver))) return;
            openDriverForm({ mode: "edit", driver });
          } else if (action.dataset.driverAction === "delete") {
            if (!guard(Actions.DRIVERS_DELETE, getPermissionContext(driver))) return;
            openDeleteConfirm(driver);
          }

          Dropdown.toggle(trigger, menu);
        });
      }

      tbody.appendChild(tr);
    });
  };

  statusSelect.addEventListener("change", () => {
    saveFilters();
    const prefs = getListPrefs();
    FleetStore.setListPrefs("drivers", { visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
    startFilterLoading();
  });

  searchInput.addEventListener("input", () => {
    saveFilters();
    const prefs = getListPrefs();
    FleetStore.setListPrefs("drivers", { visibleCount: prefs.pageSize || listPrefsFallback.pageSize });
    startFilterLoading();
  });

  const addBtn = header.querySelector("#addDriver");
  if (addBtn) {
    const allowCreate = can(Actions.DRIVERS_CREATE, getPermissionContext());
    applyDisabledState(addBtn, allowCreate, explainDeny(Actions.DRIVERS_CREATE, getPermissionContext()));
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!guard(Actions.DRIVERS_CREATE, getPermissionContext())) return;
      openDriverForm({ mode: "add" });
    });
  }

  loadMoreBtn.addEventListener("click", () => {
    const prefs = getListPrefs();
    const pageSize = prefs.pageSize || listPrefsFallback.pageSize;
    const nextCount = (prefs.visibleCount || pageSize) + pageSize;
    FleetStore.setListPrefs("drivers", { visibleCount: nextCount });
    renderRows();
  });

  startLoading();

  CleanupRegistry.add(() => {
    if (loadingTimer) clearTimeout(loadingTimer);
    if (filterTimer) clearTimeout(filterTimer);
  });

  return root;
}

window.driversView = driversView;

