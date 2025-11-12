const plNotifications = {
  types: {
    price_alert: 'Alert cenowy',
    order: 'Aktualizacja zlecenia',
    transaction: 'Transakcja',
    system: 'System',
  },
  trigger_with_count: 'Powiadomienia ({{count}})',
  subtitle:
    'Bądź na bieżąco z alertami cenowymi, zleceniami i aktywnością konta.',
  empty_state: {
    subtitle: 'Wszystko przeczytane — poinformujemy Cię, gdy coś się zmieni.',
    description:
      'Alerty cenowe, zlecenia i aktualizacje portfela pojawią się tutaj natychmiast po ich otrzymaniu.',
  },
  count_one: '{{count}} powiadomienie',
  count_few: '{{count}} powiadomienia',
  count_many: '{{count}} powiadomień',
  count_other: '{{count}} powiadomień',
};

export default plNotifications;
