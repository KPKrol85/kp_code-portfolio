function ordersView() {
  const root = dom.h("div");

  const header = dom.h("div", "module-header");
  header.innerHTML = `<div><h3>Zlecenia</h3><p class="muted small">Monitoruj status dostaw</p></div><div class="toolbar"><button class="button secondary" id="exportOrders">Eksportuj CSV</button></div>`;
  root.appendChild(header);

  const filterBar = dom.h("div", "table-filter");
  const statusSelect = dom.h("select");
  statusSelect.innerHTML = `
    <option value="all">Status: wszystkie</option>
    <option value="in-progress">W realizacji</option>
    <option value="delayed">Opóźnione</option>
    <option value="delivered">Dostarczone</option>
    <option value="pending">Oczekujące</option>`;
  const prioritySelect = dom.h("select");
  prioritySelect.innerHTML = `
    <option value="all">Priorytet: wszystkie</option>
    <option value="high">Wysoki</option>
    <option value="medium">Średni</option>
    <option value="low">Niski</option>`;
  const searchInput = dom.h("input");
  searchInput.type = "search";
  searchInput.placeholder = "Szukaj klienta / trasy";
  [statusSelect, prioritySelect, searchInput].forEach((el) => el.classList.add("input"));
  filterBar.appendChild(statusSelect);
  filterBar.appendChild(prioritySelect);
  filterBar.appendChild(searchInput);
  root.appendChild(filterBar);

  const tableWrap = dom.h("div", "panel table-responsive");
  tableWrap.id = "ordersTable";
  root.appendChild(tableWrap);

  const filters = FleetStore.state.filters.orders;
  statusSelect.value = filters.status;
  prioritySelect.value = filters.priority;
  searchInput.value = filters.search;

  let isLoading = true;
  let filterTimer = null;
  const FILTER_DELAY = 160;
  const priorityLabel = (value) => ({ high: "Wysoki", medium: "Średni", low: "Niski" }[value] || value);

  const renderOrdersSkeleton = () => {
    tableWrap.innerHTML = `
      <div class="skeleton-table">
        ${Array.from({ length: 6 })
          .map(
            () => `
          <div class="skeleton-row">
            <div class="skeleton skeleton-cell lg"></div>
            <div class="skeleton skeleton-cell"></div>
            <div class="skeleton skeleton-cell"></div>
            <div class="skeleton skeleton-cell"></div>
            <div class="skeleton skeleton-cell"></div>
            <div class="skeleton skeleton-cell"></div>
          </div>`
          )
          .join("")}
      </div>
    `;
  };

  const startFilterLoading = () => {
    if (filterTimer) clearTimeout(filterTimer);

    isLoading = true;
    renderOrdersSkeleton();

    filterTimer = setTimeout(() => {
      isLoading = false;
      renderRows();
    }, FILTER_DELAY);
  };

  const renderRows = () => {
    if (isLoading) {
      renderOrdersSkeleton();
      return;
    }

    const { status, priority, search } = FleetStore.state.filters.orders;
    const rows = FleetSeed.orders
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) => (priority === "all" ? true : o.priority === priority))
      .filter((o) => `${o.client} ${o.route}`.toLowerCase().includes(search.toLowerCase()));

    if (rows.length === 0) {
      tableWrap.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__card">
            <p class="tag">Brak</p>
            <h3 class="empty-state__title">Brak wyników</h3>
            <p class="muted">Zmień filtry lub wyszukiwanie, żeby zobaczyć zlecenia.</p>
            <button class="button secondary" id="clearOrdersFilters" type="button">Wyczyść filtry</button>
          </div>
        </div>
      `;

      tableWrap.querySelector("#clearOrdersFilters")?.addEventListener("click", () => {
        FleetStore.setOrderFilters({ status: "all", priority: "all", search: "" });
        statusSelect.value = "all";
        prioritySelect.value = "all";
        searchInput.value = "";

        startFilterLoading();
      });

      return;
    }

    const renderedRows = rows.map(
      (order) => `
      <tr class="order-row" data-id="${order.id}">
        <td>${order.id}</td>
        <td>${order.client}</td>
        <td>${order.route}</td>
        <td><span class="${format.badgeClass(order.status)}">${format.statusLabel(order.status)}</span></td>
        <td>${order.eta}</td>
        <td><span class="badge">${priorityLabel(order.priority)}</span></td>
      </tr>`
    );

    tableWrap.innerHTML = Table.render(["ID", "Klient", "Trasa", "Status", "ETA", "Priorytet"], renderedRows);

    tableWrap.querySelectorAll("tr.order-row").forEach((row) => {
      row.addEventListener("click", () => openOrder(row.dataset.id));
    });
  };

  const openOrder = (id) => {
    const order = FleetSeed.orders.find((o) => o.id === id);
    if (!order) return;
    const body = dom.h("div");
    body.innerHTML = `
      <p><strong>Klient:</strong> ${order.client}</p>
      <p><strong>Trasa:</strong> ${order.route}</p>
      <p><strong>Status:</strong> ${format.statusLabel(order.status)}</p>
      <p><strong>ETA:</strong> ${order.eta}</p>
      <p><strong>Priorytet:</strong> ${priorityLabel(order.priority)}</p>
      <p class="muted small">Ostatnia aktualizacja: ${format.dateShort(order.updated)}</p>
    `;
    Modal.open({ title: `Zlecenie ${order.id}`, body });
  };

  const debounce = (fn, wait = 250) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const pushFilters = () => {
    FleetStore.setOrderFilters({
      status: statusSelect.value,
      priority: prioritySelect.value,
      search: searchInput.value,
    });
  };

  const applySelectFilters = () => {
    pushFilters();
    startFilterLoading();
  };

  statusSelect.addEventListener("change", applySelectFilters);
  prioritySelect.addEventListener("change", applySelectFilters);

  const applySearch = () => {
    pushFilters();

    isLoading = true;
    renderRows();

    setTimeout(() => {
      isLoading = false;
      renderRows();
    }, 140);
  };

  const applySearchDebounced = debounce(applySearch, 250);
  searchInput.addEventListener("input", applySearchDebounced);

  const exportOrders = () => {
    const data = FleetSeed.orders;
    const csv = ["id,client,route,status,eta,priority"];
    data.forEach((o) => csv.push([o.id, o.client, o.route, o.status, o.eta, o.priority].join(",")));
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fleetops-orders.csv";
    a.click();
    URL.revokeObjectURL(url);
    Toast.show("CSV wyeksportowano", "success");
  };

  const exportBtn = header.querySelector("#exportOrders");
  if (exportBtn) {
    exportBtn.disabled = true;
    exportBtn.title = "Brak uprawnień w wersji demo";
    exportBtn.addEventListener("click", (e) => {
      e.preventDefault();
      Toast.show("Brak uprawnień w wersji demo", "warning");
    });
  }

  renderRows();
  setTimeout(() => {
    isLoading = false;
    renderRows();
  }, 180);

  return root;
}

window.ordersView = ordersView;
