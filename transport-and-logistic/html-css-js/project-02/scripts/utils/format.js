const format = {
  statusLabel(value) {
    const map = { 'in-progress': 'In progress', delayed: 'Delayed', delivered: 'Delivered', pending: 'Pending', 'on-route': 'On route', available: 'Available', maintenance: 'Maintenance' };
    return map[value] || value;
  },
  badgeClass(status) {
    const map = {
      'in-progress': 'badge status in-progress',
      delayed: 'badge status delayed',
      delivered: 'badge status delivered',
      pending: 'badge status pending'
    };
    return map[status] || 'badge';
  },
  avatarInitials(name) {
    return name ? name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() : '?';
  },
  dateShort(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('pl-PL', { month: 'short', day: 'numeric' });
  }
};

window.format = format;
