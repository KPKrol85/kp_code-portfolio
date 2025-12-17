function dashboardView() {
  const root = dom.h('div');

  const kpis = dom.h('div', 'grid kpi-grid');
  const kpiData = [
    { label: 'Total orders', value: FleetSeed.orders.length },
    { label: 'On-time %', value: '94.2%' },
    { label: 'Active vehicles', value: FleetSeed.vehicles.filter((v) => v.status !== 'maintenance').length },
    { label: 'Incidents', value: FleetSeed.alerts.length }
  ];
  kpiData.forEach((item) => {
    const card = dom.h('div', 'panel');
    card.innerHTML = `<p class="muted small">${item.label}</p><h3>${item.value}</h3>`;
    kpis.appendChild(card);
  });
  root.appendChild(kpis);

  const activity = dom.h('div', 'panel');
  activity.innerHTML = `<div class="module-header"><h3>Activity</h3><span class="muted small">Live ops</span></div>`;
  const feed = dom.h('div', 'feed');
  FleetSeed.activities.forEach((a) => {
    const row = dom.h('div', 'activity-row');
    row.innerHTML = `<div><strong>${a.title}</strong><p class="muted small">${a.detail}</p></div><span class="muted small">${a.time}</span>`;
    feed.appendChild(row);
  });
  activity.appendChild(feed);

  const alerts = dom.h('div', 'panel');
  alerts.innerHTML = `<div class="module-header"><h3>Alerts</h3><button class="button ghost small">View rules</button></div>`;
  const alertsList = dom.h('div', 'alerts');
  FleetSeed.alerts.forEach((alert) => {
    const tag = dom.h('span', 'badge');
    tag.textContent = alert.type;
    const row = dom.h('div', 'alert');
    row.appendChild(tag);
    row.appendChild(dom.h('div', '', `<strong>${alert.message}</strong><p class="muted small">Severity: ${alert.severity}</p>`));
    alertsList.appendChild(row);
  });
  alerts.appendChild(alertsList);

  const columns = dom.h('div', 'grid');
  columns.style.gridTemplateColumns = '2fr 1fr';
  columns.style.gap = '16px';
  columns.appendChild(activity);
  columns.appendChild(alerts);
  root.appendChild(columns);

  return root;
}

window.dashboardView = dashboardView;
