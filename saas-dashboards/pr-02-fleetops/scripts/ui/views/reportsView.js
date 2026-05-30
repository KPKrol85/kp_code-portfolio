function reportsView() {
  const root = dom.h('div');
  const escapeHtml = window.FleetUI.escapeHtml;
  const header = dom.h('div', 'module-header');
  header.innerHTML = `<div><h2>Raporty</h2><p class="muted small">Wydajność i SLA</p></div><div class="toolbar"><button class="button button--secondary" id="exportReports">Eksportuj JSON</button></div>`;
  root.appendChild(header);

  const chart = dom.h('div', 'panel');
  chart.innerHTML = '<h3 class="panel-heading">Miks wydajności</h3><div class="grid report-mix-grid"></div>';
  const bars = chart.querySelector('.grid');
  FleetSeed.reports.performance.forEach((item) => {
    const wrap = dom.h('div');
    const value = Number(item.value) || 0;
    wrap.innerHTML = `<p class="muted small">${escapeHtml(item.label)}</p><div class="progress-bar"><span style="width:${value}%;"></span></div><strong>${escapeHtml(value)}%</strong>`;
    bars.appendChild(wrap);
  });
  root.appendChild(chart);

  const summary = dom.h('div', 'panel table-responsive');
  const rows = FleetSeed.reports.summary.map((row) => `<tr><td>${escapeHtml(row.metric)}</td><td>${escapeHtml(row.value)}</td></tr>`);
  summary.innerHTML = Table.render(['Metryka', 'Wartość'], rows);
  root.appendChild(summary);

  header.querySelector('#exportReports').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(FleetSeed.reports, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fleetops-reports.json'; a.click();
    URL.revokeObjectURL(url);
    Toast.show('Raport wyeksportowany', 'success');
  });

  return root;
}

window.reportsView = reportsView;
