function driversView() {
  const root = dom.h("div");
  const header = dom.h("div", "module-header");
  header.innerHTML = `<div><h3>Kierowcy</h3><p class="muted small">Status i ostatnie kursy</p></div><div class="toolbar"><button class="button primary" id="addDriver" type="button">Dodaj kierowce</button></div>`;
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

  const tableWrap = list.querySelector(".table-responsive");

  const filters = FleetStore.state.filters.drivers;
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
            openDriverForm({ mode: "edit", driver });
          } else if (action.dataset.driverAction === "delete") {
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
    startFilterLoading();
  });

  searchInput.addEventListener("input", () => {
    saveFilters();
    startFilterLoading();
  });

  const addBtn = header.querySelector("#addDriver");
  if (addBtn) {
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openDriverForm({ mode: "add" });
    });
  }

  startLoading();

  CleanupRegistry.add(() => {
    if (loadingTimer) clearTimeout(loadingTimer);
    if (filterTimer) clearTimeout(filterTimer);
  });

  return root;
}

window.driversView = driversView;

