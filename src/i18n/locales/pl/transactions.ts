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
  error_loading:
    'Przepraszamy, historia transakcji nie mogła zostać załadowana.',
  no_open_positions: 'Nie masz otwartych pozycji dla tego instrumentu.',
  tooltips: {
    name: 'Nazwa instrumentu finansowego',
    quantity: 'Liczba posiadanych akcji',
    share_price: 'Aktualna cena za akcję',
    acquisition_price: 'Średnia cena zapłacona za akcję',
    market_value: 'Łączna aktualna wartość pozycji',
    gain_loss: 'Bezwzględna kwota zysku lub straty',
    gain_loss_pct: 'Procentowy zysk lub strata',
    expand_details: 'Rozwiń, aby zobaczyć szczegóły transakcji',
  },
};

export default plTransactions;
