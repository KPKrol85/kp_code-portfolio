function reportsView() {
  const root = dom.h('div');
  const header = dom.h('div', 'module-header');
  header.innerHTML = `<div><h3>Reports</h3><p class="muted small">Performance & SLA</p></div><div class="toolbar"><button class="button secondary" id="exportReports">Export JSON</button></div>`;
  root.appendChild(header);

  const chart = dom.h('div', 'panel');
  chart.innerHTML = '<h4>Performance mix</h4><div class="grid" style="grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 12px;"></div>';
  const bars = chart.querySelector('.grid');
  FleetSeed.reports.performance.forEach((item) => {
    const wrap = dom.h('div');
    wrap.innerHTML = `<p class="muted small">${item.label}</p><div class="progress-bar"><span style="width:${item.value}%;"></span></div><strong>${item.value}%</strong>`;
    bars.appendChild(wrap);
  });
  root.appendChild(chart);

  const summary = dom.h('div', 'panel table-responsive');
  const rows = FleetSeed.reports.summary.map((row) => `<tr><td>${row.metric}</td><td>${row.value}</td></tr>`);
  summary.innerHTML = Table.render(['Metric', 'Value'], rows);
  root.appendChild(summary);

  header.querySelector('#exportReports').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(FleetSeed.reports, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fleetops-reports.json'; a.click();
    URL.revokeObjectURL(url);
    Toast.show('Report exported', 'success');
  });

  return root;
}

window.reportsView = reportsView;
