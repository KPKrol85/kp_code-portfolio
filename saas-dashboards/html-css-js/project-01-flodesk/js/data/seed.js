export const seedData = {
  clients: [
    {
      id: 'c1',
      name: 'Nova Studio',
      email: 'hello@novastudio.pl',
      phone: '+48 605 010 120',
      status: 'Aktywny',
      notes: 'Stały klient od 2022. Preferuje kontakt mailowy.'
    },
    {
      id: 'c2',
      name: 'Klinika Aurora',
      email: 'kontakt@aurora.pl',
      phone: '+48 512 333 442',
      status: 'Aktywny',
      notes: 'Umowa na obsługę serwisową.'
    },
    {
      id: 'c3',
      name: 'EventLine',
      email: 'ops@eventline.pl',
      phone: '+48 698 220 110',
      status: 'Potencjalny',
      notes: 'Lead z polecenia, czeka na ofertę.'
    }
  ],
  projects: [
    {
      id: 'p1',
      name: 'Wdrożenie panelu klienta',
      clientId: 'c1',
      status: 'In progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Oczekuje na feedback do makiet.'
    },
    {
      id: 'p2',
      name: 'Audyt SLA',
      clientId: 'c2',
      status: 'Review',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Przygotować raport PDF.'
    },
    {
      id: 'p3',
      name: 'Obsługa eventu Q3',
      clientId: 'c3',
      status: 'Draft',
      priority: 'Low',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Wycenę wysłać do piątku.'
    }
  ],
  events: [
    {
      id: 'e1',
      title: 'Weekly status call',
      date: new Date().toISOString(),
      clientId: 'c1',
      projectId: 'p1'
    },
    {
      id: 'e2',
      title: 'Przegląd SLA',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      clientId: 'c2',
      projectId: 'p2'
    }
  ],
  ui: {
    theme: 'light',
    reducedMotion: false
  }
};
