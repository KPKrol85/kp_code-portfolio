function dashboardView() {
  const root = dom.h("div");
  // ===== KPI =====
  const rangeHeader = dom.h("div", "module-header");
  rangeHeader.innerHTML = `
    <div>
      <h3>Przeglad KPI</h3>
      <p class="muted small">Zakres czasu</p>
    </div>
    <div class="toolbar">
      <select class="input" id="dashboardRange" aria-label="Zakres czasu">
        <option value="7">7 dni</option>
        <option value="30">30 dni</option>
        <option value="90">90 dni</option>
      </select>
    </div>
  `;
  root.appendChild(rangeHeader);

  const rangeSelect = rangeHeader.querySelector("#dashboardRange");
  const getRangeDays = () => Number(FleetStore.state.preferences.dashboardRangeDays) || 30;
  if (rangeSelect) rangeSelect.value = String(getRangeDays());

  const kpis = dom.h("div", "grid kpi-grid");
  const isInRange = (value, rangeDays) => {
    const ts = Date.parse(value);
    if (Number.isNaN(ts)) return false;
    const rangeMs = rangeDays * 24 * 60 * 60 * 1000;
    return ts >= Date.now() - rangeMs;
  };

  const renderKpis = () => {
    const rangeDays = getRangeDays();
    const ordersInRange = FleetStore.state.domain.orders.filter((o) => isInRange(o.updated || o.updatedAt, rangeDays));
    const deliveredCount = ordersInRange.filter((o) => o.status === "delivered").length;
    const onTimePct = ordersInRange.length ? `${((deliveredCount / ordersInRange.length) * 100).toFixed(1)}%` : "0%";
    const activeVehicles = FleetStore.state.domain.fleet
      .filter((v) => v.status !== "maintenance")
      .filter((v) => isInRange(v.lastCheck, rangeDays));
    const activityInRange = (FleetStore.state.activity || []).filter((a) => isInRange(a.time, rangeDays));

    const kpiData = [
      { label: "Laczna liczba zlecen", value: ordersInRange.length, action: "orders" },
      { label: "Terminowosc", value: onTimePct, action: "ontime" },
      { label: "Aktywne pojazdy", value: activeVehicles.length, action: "fleet" },
      { label: "Zdarzenia", value: activityInRange.length, action: "alerts" },
    ];

    dom.clear(kpis);
    kpiData.forEach((item) => {
      const card = dom.h("button", "panel");
      card.type = "button";
      card.style.textAlign = "left";
      card.style.width = "100%";
      card.style.cursor = "pointer";
      card.setAttribute("aria-label", item.label);
      card.innerHTML = `<p class="muted small">${item.label}</p><h3>${item.value}</h3>`;
      card.addEventListener("click", () => handleKpiClick(item.action));
      kpis.appendChild(card);
    });
  };

  const handleKpiClick = (action) => {
    if (action === "orders") {
      window.location.hash = "#/app/orders";
      return;
    }
    if (action === "ontime") {
      FleetStore.setOrderFilters({ status: "delayed" });
      const prefs = FleetStore.state.listPrefs?.orders;
      if (prefs) FleetStore.setListPrefs("orders", { visibleCount: prefs.pageSize || 10 });
      window.location.hash = "#/app/orders";
      return;
    }
    if (action === "fleet") {
      FleetStore.setFleetFilters({ status: "on-route" });
      const prefs = FleetStore.state.listPrefs?.fleet;
      if (prefs) FleetStore.setListPrefs("fleet", { visibleCount: prefs.pageSize || 10 });
      window.location.hash = "#/app/fleet";
      return;
    }
    if (action === "alerts") {
      window.location.hash = "#/app";
      window.setTimeout(() => {
        document.getElementById("dashboard-alerts")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  };

  if (rangeSelect) {
    rangeSelect.addEventListener("mousedown", (e) => e.stopPropagation());
    rangeSelect.addEventListener("click", (e) => e.stopPropagation());
    rangeSelect.addEventListener("change", () => {
      const next = Number(rangeSelect.value) || 30;
      FleetStore.setDashboardRangeDays(next);
      renderKpis();
    });
  }

  renderKpis();
  root.appendChild(kpis);

  // ===== Activity =====
  const activity = dom.h("div", "panel");
  activity.id = "dashboard-activity";
  activity.innerHTML = `<div class="module-header"><h3>Aktywność</h3><span class="muted small">Operacje na żywo</span></div>`;

  const formatActivityTime = (value) => {
    if (!value) return "";
    const ts = Date.parse(value);
    if (Number.isNaN(ts)) return value;
    const diffMinutes = Math.floor((Date.now() - ts) / 60000);
    if (diffMinutes < 1) return "przed chwila";
    if (diffMinutes < 60) return `${diffMinutes} min temu`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} h temu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} d temu`;
  };

  const feed = dom.h("div", "feed");
  const activities = FleetStore.state.activity && FleetStore.state.activity.length
    ? FleetStore.state.activity
    : FleetSeed.activities;
  activities.forEach((a) => {
    const row = dom.h("div", "activity-row");
    row.innerHTML = `<div><strong>${a.title}</strong><p class="muted small">${a.detail}</p></div><span class="muted small">${formatActivityTime(a.time)}</span>`;
    feed.appendChild(row);
  });

  activity.appendChild(feed);

  // ===== Alerts =====
  const alerts = dom.h("div", "panel");
  alerts.id = "dashboard-alerts";

  alerts.innerHTML = `
    <div class="module-header">
      <h3>Alerty</h3>

      <div class="dropdown" data-dropdown="alerts-rules">
        <button class="button ghost small dropdown-trigger" type="button" aria-expanded="false">
          Zobacz reguły
        </button>

        <div class="dropdown-menu" role="menu" aria-label="Reguły alertów">
          <div style="padding:8px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span class="muted small">Reguły alertów</span>
            <button class="button ghost small" type="button" data-alerts-reset>Reset</button>
          </div>

          <div style="padding:6px 10px;">
            <div class="muted small" style="padding:6px 0;">Priorytety</div>

            <label class="muted small" style="display:flex;gap:8px;align-items:center;">
              <input type="checkbox" data-rule-severity="wysoki" checked />
              Wysoki
            </label>

            <label class="muted small" style="display:flex;gap:8px;align-items:center;margin-top:6px;">
              <input type="checkbox" data-rule-severity="średni" checked />
              Średni
            </label>

            <label class="muted small" style="display:flex;gap:8px;align-items:center;margin-top:6px;">
              <input type="checkbox" data-rule-severity="niski" checked />
              Niski
            </label>
          </div>

          <div class="muted small" style="padding:8px 10px;">Typy (widok)</div>

          <div style="padding:6px 10px;">
            <label class="muted small" style="display:flex;gap:8px;align-items:center;">
              <input type="checkbox" data-rule-type="SLA" checked />
              SLA
            </label>

            <label class="muted small" style="display:flex;gap:8px;align-items:center;margin-top:6px;">
              <input type="checkbox" data-rule-type="Opóźnienie" checked />
              Opóźnienie
            </label>

            <label class="muted small" style="display:flex;gap:8px;align-items:center;margin-top:6px;">
              <input type="checkbox" data-rule-type="Serwis" checked />
              Serwis
            </label>
          </div>
        </div>
      </div>
    </div>
  `;

  const alertsList = dom.h("div", "alerts");

  const normalizeSeverity = (value) => {
    const sev = String(value || "").toLowerCase();
    if (sev === "wysoki" || sev === "średni" || sev === "niski") return sev;
    return "niski";
  };

  FleetSeed.alerts.forEach((alert) => {
    const tag = dom.h("span", "badge");
    tag.textContent = alert.type;

    const content = dom.h(
      "div",
      "alert-content",
      `<strong>${alert.message}</strong>
       <p class="muted small">Priorytet: ${alert.severity}</p>`
    );

    const row = dom.h("div", "alert");
    // dataset -> data-alert-type / data-alert-severity
    row.dataset.alertType = alert.type;
    row.dataset.alertSeverity = normalizeSeverity(alert.severity);

    row.appendChild(tag);
    row.appendChild(content);

    alertsList.appendChild(row);
  });

  alerts.appendChild(alertsList);

  // ===== Layout columns =====
  const columns = dom.h("div", "grid");
  columns.style.gridTemplateColumns = "2fr 1fr";
  columns.style.gap = "16px";
  columns.appendChild(activity);
  columns.appendChild(alerts);

  root.appendChild(columns);

  // ===== INIT dropdown/events (MUSI być po renderze widoku) =====
  initAlertsRulesDropdown(root);

  return root;
}

window.dashboardView = dashboardView;

let alertsRulesDocListenersBound = false;
let alertsRulesState = {
  dd: null,
  btn: null,
  menu: null,
  setOpen: null,
};
let alertsRulesDocClickHandler = null;
let alertsRulesDocKeydownHandler = null;

function initAlertsRulesDropdown(scopeEl) {
  const dd = scopeEl.querySelector('[data-dropdown="alerts-rules"]');
  if (!dd) return;

  const btn = dd.querySelector(".dropdown-trigger");
  const menu = dd.querySelector(".dropdown-menu");
  if (!btn || !menu) return;

  const setOpen = (open, returnFocus = false) => {
    const wasOpen = menu.classList.contains("open");
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (wasOpen && !open && returnFocus) btn.focus();
  };

  const normalizeSeverity = (value) => {
    const sev = String(value || "").toLowerCase();
    if (sev === "wysoki" || sev === "średni" || sev === "niski") return sev;
    return "niski";
  };

  const applyRules = () => {
    const enabledTypes = new Set(
      Array.from(dd.querySelectorAll("input[data-rule-type]"))
        .filter((i) => i.checked)
        .map((i) => i.getAttribute("data-rule-type"))
    );

    const enabledSeverities = new Set(
      Array.from(dd.querySelectorAll("input[data-rule-severity]"))
        .filter((i) => i.checked)
        .map((i) => i.getAttribute("data-rule-severity"))
    );

    scopeEl.querySelectorAll(".alert[data-alert-type]").forEach((el) => {
      const type = el.getAttribute("data-alert-type");
      const sev = normalizeSeverity(el.getAttribute("data-alert-severity"));

      const typeOff = !enabledTypes.has(type);
      const sevOff = !enabledSeverities.has(sev);

      el.classList.toggle("is-muted", typeOff || sevOff);
    });
  };

  scopeEl.addEventListener("click", (e) => {
    const trigger = e.target.closest(".dropdown-trigger");
    if (!trigger || !dd.contains(trigger)) return;
    e.preventDefault();
    const isOpen = menu.classList.contains("open");
    setOpen(!isOpen, isOpen);
  });

  dd.addEventListener("change", (e) => {
    if (e.target.matches("input[type='checkbox']")) applyRules();
  });

  dd.addEventListener("click", (e) => {
    const reset = e.target.closest("[data-alerts-reset]");
    if (!reset) return;
    e.preventDefault();
    dd.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.checked = true;
    });
    applyRules();
  });

  alertsRulesState = {
    dd,
    btn,
    menu,
    setOpen,
  };

  if (!alertsRulesDocListenersBound) {
    alertsRulesDocClickHandler = (e) => {
      const { dd: activeDd, setOpen: activeSetOpen } = alertsRulesState;
      if (!activeDd || !activeSetOpen) return;
      if (!activeDd.isConnected) {
        alertsRulesState = { dd: null, btn: null, menu: null, setOpen: null };
        return;
      }
      if (!activeDd.contains(e.target)) activeSetOpen(false, true);
    };

    alertsRulesDocKeydownHandler = (e) => {
      const { dd: activeDd, setOpen: activeSetOpen } = alertsRulesState;
      if (!activeDd || !activeSetOpen) return;
      if (!activeDd.isConnected) {
        alertsRulesState = { dd: null, btn: null, menu: null, setOpen: null };
        return;
      }
      if (e.key === "Escape") activeSetOpen(false, true);
    };

    document.addEventListener("click", alertsRulesDocClickHandler);
    document.addEventListener("keydown", alertsRulesDocKeydownHandler);

    CleanupRegistry.add(() => {
      if (alertsRulesDocClickHandler) {
        document.removeEventListener("click", alertsRulesDocClickHandler);
        alertsRulesDocClickHandler = null;
      }
      if (alertsRulesDocKeydownHandler) {
        document.removeEventListener("keydown", alertsRulesDocKeydownHandler);
        alertsRulesDocKeydownHandler = null;
      }
      alertsRulesDocListenersBound = false;
      alertsRulesState = { dd: null, btn: null, menu: null, setOpen: null };
    });

    alertsRulesDocListenersBound = true;
  }

  applyRules();
}

