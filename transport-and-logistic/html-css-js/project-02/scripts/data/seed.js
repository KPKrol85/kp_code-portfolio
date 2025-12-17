const FleetSeed = {
  orders: [
    { id: 'FO-1021', client: 'Nordic Retail', route: 'Gdańsk → Poznań', status: 'in-progress', eta: '2h 15m', priority: 'high', updated: '2025-12-15T09:00:00Z' },
    { id: 'FO-0988', client: 'Baltic Fresh', route: 'Warszawa → Berlin', status: 'delayed', eta: '4h 40m', priority: 'high', updated: '2025-12-15T07:20:00Z' },
    { id: 'FO-0975', client: 'AeroParts', route: 'Wrocław → Hamburg', status: 'delivered', eta: 'Delivered', priority: 'medium', updated: '2025-12-14T21:00:00Z' },
    { id: 'FO-0991', client: 'PharmaOne', route: 'Łódź → Kraków', status: 'pending', eta: '6h 00m', priority: 'low', updated: '2025-12-15T08:10:00Z' },
    { id: 'FO-1004', client: 'Green Market', route: 'Katowice → Lublin', status: 'in-progress', eta: '3h 35m', priority: 'medium', updated: '2025-12-15T09:30:00Z' },
    { id: 'FO-1009', client: 'MedLog', route: 'Poznań → Brno', status: 'delayed', eta: '5h 15m', priority: 'high', updated: '2025-12-15T06:50:00Z' },
    { id: 'FO-1015', client: 'FreshBox', route: 'Gdynia → Szczecin', status: 'in-progress', eta: '1h 50m', priority: 'low', updated: '2025-12-15T09:40:00Z' }
  ],
  vehicles: [
    { id: 'GD-5402N', type: 'Reefer', status: 'on-route', lastCheck: '2025-12-14', driver: 'K. Mazur' },
    { id: 'WA-9932K', type: 'Mega trailer', status: 'available', lastCheck: '2025-12-10', driver: 'L. Kowal' },
    { id: 'PO-2201X', type: 'Tautliner', status: 'maintenance', lastCheck: '2025-12-12', driver: 'A. Lewandowski' },
    { id: 'KR-4412J', type: 'Van', status: 'available', lastCheck: '2025-12-15', driver: 'S. Wójcik' },
    { id: 'LU-7811L', type: 'Tautliner', status: 'on-route', lastCheck: '2025-12-13', driver: 'E. Piątek' }
  ],
  drivers: [
    { name: 'Kinga Mazur', status: 'on-route', lastTrip: 'Gdańsk → Poznań', phone: '+48 600 200 111' },
    { name: 'Łukasz Kowal', status: 'available', lastTrip: 'Warszawa → Rzeszów', phone: '+48 600 200 112' },
    { name: 'Anna Lewandowska', status: 'maintenance', lastTrip: 'Poznań → Brno', phone: '+48 600 200 113' },
    { name: 'Szymon Wójcik', status: 'available', lastTrip: 'Kraków → Ostrava', phone: '+48 600 200 114' },
    { name: 'Ewelina Piątek', status: 'on-route', lastTrip: 'Katowice → Lublin', phone: '+48 600 200 115' }
  ],
  activities: [
    { title: 'Order FO-1021 updated', detail: 'ETA recalculated via border delay', time: '12 min ago' },
    { title: 'Vehicle LU-7811L check passed', detail: 'Maintenance complete, ready to dispatch', time: '34 min ago' },
    { title: 'Driver Szymon Wójcik clocked in', detail: 'Ready for assignment', time: '1h ago' },
    { title: 'Report exported', detail: 'On-time performance Q4 draft saved', time: '3h ago' }
  ],
  alerts: [
    { type: 'Delay', message: 'Border queue on A2 adds +45m to FO-0988', severity: 'high' },
    { type: 'Maintenance', message: 'Vehicle PO-2201X requires brake check', severity: 'medium' },
    { type: 'SLA', message: 'On-time performance dipped to 94.2%', severity: 'low' }
  ],
  reports: {
    performance: [
      { label: 'On-time', value: 94 },
      { label: 'Delayed', value: 4 },
      { label: 'Incidents', value: 2 }
    ],
    summary: [
      { metric: 'Avg. ETA accuracy', value: '96.4%' },
      { metric: 'Mileage (week)', value: '41,200 km' },
      { metric: 'CO₂ est.', value: '12.4 t' },
      { metric: 'Utilization', value: '82%' }
    ]
  }
};

window.FleetSeed = FleetSeed;
