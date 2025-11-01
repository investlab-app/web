const plTransactions = {
  tabs: {
    open_positions: 'Otwarte pozycje',
    closed_positions: 'Zamknięte pozycje',
  },
  table: {
    headers: {
      name: 'Nazwa',
      quantity: 'Ilość',
      share_price: 'Cena akcji',
      acquisition_price: 'Cena nabycia',
      market_value: 'Wartość rynkowa',
      gain_loss: 'Zysk / Strata',
      gain_loss_pct: 'Zysk / Strata %',
    },
  },
  badge: {
    buy: 'Kupno',
    sell: 'Sprzedaż',
  },
  actions: {
    instrument_details: 'Szczegóły instrumentu',
  },
  position: {
    summary: {
      transactions_count_one: '1 transakcja',
      transactions_count_few: '{{count}} transakcje',
      transactions_count_many: '{{count}} transakcji',
      transactions_count_other: '{{count}} transakcji',
      last_transaction: 'Ostatnia transakcja: {{action}} {{date}}',
      no_transactions: 'Brak zarejestrowanych transakcji',
    },
  },
  error_loading:
    'Przepraszamy, historia transakcji nie mogła zostać załadowana.',
  no_open_positions: 'Nie masz otwartych pozycji dla tego instrumentu.',
  tooltips: {
    name: 'Nazwa instrumentu finansowego',
    quantity: 'Ilość akcji w pozycji',
    share_price: 'Cena za akcję w czasie transakcji',
    acquisition_price:
      'Cena nabycia pozycji (ilość × cena za akcję + prowizje)',
    market_value: 'Łączna aktualna wartość pozycji',
    gain_loss: 'Bezwzględna kwota zysku lub straty',
    gain_loss_pct: 'Procentowy zysk lub strata',
    expand_details: 'Rozwiń, aby zobaczyć szczegóły transakcji',
    hide_details: 'Ukryj szczegóły transakcji',
  },
};

export default plTransactions;
