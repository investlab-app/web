const enNotifications = {
  types: {
    price_alert: 'Price alert',
    order: 'Order update',
    transaction: 'Transaction',
    system: 'System',
  },
  trigger_with_count: 'Notifications ({{count}})',
  subtitle: 'Keep up with price alerts, orders, and account activity.',
  empty_state: {
    subtitle: 'You\'re all caught up — we\'ll let you know when something changes.',
    description: 'Price alerts, orders, and portfolio updates will appear here as soon as they arrive.',
  },
  count_one: '{{count}} notification',
  count_few: '{{count}} notifications',
  count_many: '{{count}} notifications',
  count_other: '{{count}} notifications',
};

export default enNotifications;