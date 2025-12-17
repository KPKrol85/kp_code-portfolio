function ordersView() {
  const root = dom.h("div");

  const header = dom.h("div", "module-header");
  header.innerHTML = `<div><h3>Orders</h3><p class="muted small">Monitoruj status dostaw</p></div><div class="toolbar"><button class="button secondary" id="exportOrders">Export CSV</button></div>`;
  root.appendChild(header);

  const filterBar = dom.h("div", "table-filter");
  const statusSelect = dom.h("select");
  statusSelect.innerHTML = `
    <option value="all">Status: all</option>
    <option value="in-progress">In progress</option>
    <option value="delayed">Delayed</option>
    <option value="delivered">Delivered</option>
    <option value="pending">Pending</option>`;
  const prioritySelect = dom.h("select");
  prioritySelect.innerHTML = `
    <option value="all">Priority: all</option>
    <option value="high">High</option>
    <option value="medium">Medium</option>
    <option value="low">Low</option>`;
  const searchInput = dom.h("input");
  searchInput.type = "search";
  searchInput.placeholder = "Search client / route";
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

  const renderRows = () => {
    const { status, priority, search } = FleetStore.state.filters.orders;
    const rows = FleetSeed.orders
      .filter((o) => (status === "all" ? true : o.status === status))
      .filter((o) => (priority === "all" ? true : o.priority === priority))
      .filter((o) => `${o.client} ${o.route}`.toLowerCase().includes(search.toLowerCase()));

    const renderedRows = rows.map(
      (order) => `
      <tr class="order-row" data-id="${order.id}">
        <td>${order.id}</td>
        <td>${order.client}</td>
        <td>${order.route}</td>
        <td><span class="${format.badgeClass(order.status)}">${format.statusLabel(order.status)}</span></td>
        <td>${order.eta}</td>
        <td><span class="badge">${order.priority}</span></td>
      </tr>`
    );

    tableWrap.innerHTML = Table.render(["ID", "Client", "Route", "Status", "ETA", "Priority"], renderedRows);

    tableWrap.querySelectorAll("tr.order-row").forEach((row) => {
      row.addEventListener("click", () => openOrder(row.dataset.id));
    });
  };

  const openOrder = (id) => {
    const order = FleetSeed.orders.find((o) => o.id === id);
    if (!order) return;
    const body = dom.h("div");
    body.innerHTML = `
      <p><strong>Client:</strong> ${order.client}</p>
      <p><strong>Route:</strong> ${order.route}</p>
      <p><strong>Status:</strong> ${format.statusLabel(order.status)}</p>
      <p><strong>ETA:</strong> ${order.eta}</p>
      <p><strong>Priority:</strong> ${order.priority}</p>
      <p class="muted small">Last update: ${format.dateShort(order.updated)}</p>
    `;
    Modal.open({ title: `Order ${order.id}`, body });
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

  const applyFilters = () => {
    pushFilters();
    renderRows();
  };

  statusSelect.addEventListener("change", applyFilters);
  prioritySelect.addEventListener("change", applyFilters);

  const applyFiltersDebounced = debounce(applyFilters, 250);
  searchInput.addEventListener("input", applyFiltersDebounced);

  header.querySelector("#exportOrders")?.addEventListener("click", () => exportOrders());

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
    Toast.show("CSV exported", "success");
  };

  renderRows();
  return root;
}

window.ordersView = ordersView;
