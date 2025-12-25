function dashboardView() {
  const root = dom.h("div");

  // ===== KPI =====
  const kpis = dom.h("div", "grid kpi-grid");
  const kpiData = [
    { label: "Łączna liczba zleceń", value: FleetSeed.orders.length },
    { label: "Terminowość", value: "94.2%" },
    { label: "Aktywne pojazdy", value: FleetSeed.vehicles.filter((v) => v.status !== "maintenance").length },
    { label: "Zdarzenia", value: FleetSeed.alerts.length },
  ];

  kpiData.forEach((item) => {
    const card = dom.h("div", "panel");
    card.innerHTML = `<p class="muted small">${item.label}</p><h3>${item.value}</h3>`;
    kpis.appendChild(card);
  });

  root.appendChild(kpis);

  // ===== Activity =====
  const activity = dom.h("div", "panel");
  activity.innerHTML = `<div class="module-header"><h3>Aktywność</h3><span class="muted small">Operacje na żywo</span></div>`;

  const feed = dom.h("div", "feed");
  FleetSeed.activities.forEach((a) => {
    const row = dom.h("div", "activity-row");
    row.innerHTML = `<div><strong>${a.title}</strong><p class="muted small">${a.detail}</p></div><span class="muted small">${a.time}</span>`;
    feed.appendChild(row);
  });

  activity.appendChild(feed);

  // ===== Alerts =====
  const alerts = dom.h("div", "panel");

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

function initAlertsRulesDropdown(scopeEl) {
  const dd = scopeEl.querySelector('[data-dropdown="alerts-rules"]');
  if (!dd) return;

  const btn = dd.querySelector(".dropdown-trigger");
  const menu = dd.querySelector(".dropdown-menu");
  if (!btn || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
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
    setOpen(!menu.classList.contains("open"));
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
    document.addEventListener("click", (e) => {
      const { dd: activeDd, setOpen: activeSetOpen } = alertsRulesState;
      if (!activeDd || !activeSetOpen) return;
      if (!activeDd.isConnected) {
        alertsRulesState = { dd: null, btn: null, menu: null, setOpen: null };
        return;
      }
      if (!activeDd.contains(e.target)) activeSetOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      const { dd: activeDd, setOpen: activeSetOpen } = alertsRulesState;
      if (!activeDd || !activeSetOpen) return;
      if (!activeDd.isConnected) {
        alertsRulesState = { dd: null, btn: null, menu: null, setOpen: null };
        return;
      }
      if (e.key === "Escape") activeSetOpen(false);
    });

    alertsRulesDocListenersBound = true;
  }

  applyRules();
}
