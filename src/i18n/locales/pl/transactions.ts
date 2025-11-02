const plTransactions = {
  tabs: {
    open_positions: 'Otwarte pozycje',
    closed_positions: 'Zamknięte pozycje',
  },
  table: {
    headers: {
      name: 'Nazwa',
      transaction: 'Transakcja',
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
  cards: {
    sold_at: 'Sprzedano @',
    avg_buy_price: 'Średnia cena kupna',
    realized_gain_loss: 'Zrealizowany zysk / strata',
    realized_pct: 'Zrealizowany %',
    current_price: 'Obecna cena',
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
  end_of_history: 'Koniec historii transakcji',
  tooltips: {
    name: 'Nazwa instrumentu finansowego',
    transaction: 'Data i typ transakcji (kupno lub sprzedaż)',
    quantity: 'Ilość akcji w pozycji',
    share_price: 'Cena za akcję w czasie transakcji',
    acquisition_price:
      'Cena nabycia pozycji (ilość × cena za akcję + prowizje)',
    market_value: 'Łączna aktualna wartość pozycji',
    gain_loss:
      'Dla KUPNA: (bieżąca cena - cena nabycia) × ilość. Dla SPRZEDAŻY: (cena sprzedaży - cena nabycia) × ilość',
    gain_loss_pct:
      'Procent zysku lub straty. Dla KUPNA: na podstawie bieżącej ceny vs cena nabycia. Dla SPRZEDAŻY: na podstawie ceny sprzedaży vs cena nabycia',
    expand_details: 'Rozwiń, aby zobaczyć szczegóły transakcji',
    hide_details: 'Ukryj szczegóły transakcji',
  },
};

export default plTransactions;
