const plTransactions = {
  tabs: {
    open_positions: 'Otwarte pozycje',
    closed_positions: 'Zamknięte pozycje',
    instrument_transaction_history: 'Otwarte pozycje',
  },
  summary: {
    owned_assets: 'Posiadany wolumen',
    assets_value: 'Wartość aktywów',
  },
  table: {
    headers: {
      name: 'Nazwa',
      transaction: 'Transakcja',
      quantity: 'Ilość',
      share_price: 'Cena akcji',
      current_value: 'Obecna wartość',
      market_value: 'Wartość rynkowa',
      gain: 'Zysk',
      realized_gain_loss: 'Zrealizowany zysk / strata',
      realized_pct: 'Zrealizowany % zysk / strata',
      unrealized_gain_loss: 'Niezrealizowany zysk / strata',
      unrealized_pct: 'Niezrealizowany % zysk / strata',
    },
  },
  badge: {
    buy: 'Kupno',
    sell: 'Sprzedaż',
  },
  cards: {
    sold_at: 'Sprzedano @',
    gain_loss: 'Zysk / Strata',
    gain_loss_pct: 'Zysk %',
    price_at_buy: 'Cena przy kupnie',
    price_at_sell: 'Cena przy sprzedaży',
    current_share_price: 'Obecna cena akcji',
    sell_value: 'Wartość sprzedaży',
    current_value: 'Obecna wartość',
  },
  actions: {
    instrument_details: 'Szczegóły instrumentu',
  },
  position: {
    summary: {
      transactions_count_one: '1 zarejestrowana transakcja',
      transactions_count_other: '{{count}} zarejestrowanych transakcji',
      last_transaction: 'Ostatnia {{action}} {{date}}',
      no_transactions: 'Brak zarejestrowanych transakcji',
    },
  },
  error_loading:
    'Przepraszamy, historia transakcji nie mogła zostać załadowana.',
  error_invalid_data:
    'Nieprawidłowy format danych otrzymanych z serwera. Spróbuj ponownie później.',
  no_open_positions: 'Nie masz otwartych pozycji dla tego instrumentu.',
  end_of_history: 'Koniec historii transakcji',
  tooltips: {
    name: 'Nazwa instrumentu finansowego',
    transaction: 'Data i typ transakcji',
    quantity: 'Ilość akcji w pozycji',
    gain: 'Całkowity zysk z pozycji (ilość × (cena bieżąca - cena zakupu))',
    share_price: 'Cena za akcję w czasie transakcji',
    current_value: 'Całkowita bieżąca wartość pozycji',
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
