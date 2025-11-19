const plOrders = {
  place_order: 'Złóż zlecenie',
  tabs: {
    market_order: 'Zlecenie rynkowe',
    stop_limit_order: 'Zlecenie z limitem',
  },
  switch_to_price: 'Przełącz na cenę',
  switch_to_volume: 'Przełącz na wolumen',
  current_price_error:
    'Przepraszamy, bieżąca cena nie mogła zostać załadowana.',
  order_success: 'Zlecenie złożone pomyślnie!',
  errors: {
    insufficient_funds: 'Nie masz wystarczających środków.',
    insufficient_assets: 'Nie masz wystarczających aktywów do sprzedaży.',
    unknown_error: 'Spróbuj ponownie później.',
    order_failed: 'Nie udało się złożyć zlecenia. {{message}}',
  },
  pending_orders: 'Oczekujące zlecenia',
  pending_market_orders: 'Oczekujące zlecenia rynkowe',
  pending_limit_orders: 'Oczekujące zlecenia z limitem',
  refresh_orders: 'Odśwież oczekujące zlecenia',
  pending_orders_error:
    'Nie udało się załadować oczekujących zleceń. Spróbuj ponownie później.',
  no_pending_orders: 'Brak oczekujących zleceń dla tego instrumentu.',
  no_pending_market_orders:
    'Brak oczekujących zleceń rynkowych dla tego instrumentu.',
  no_pending_limit_orders:
    'Brak oczekujących zleceń z limitem dla tego instrumentu.',
  table: {
    type: 'Typ',
    side: 'Strona',
    volume: 'Wolumen',
    processed: 'Przetworzone',
    limit_price: 'Cena limit',
    limit: 'Limit',
    market: 'Rynek',
    actions: 'Akcje',
  },
  cancel_order: 'Anuluj zlecenie',
  cancel_order_success: 'Zlecenie anulowane pomyślnie',
  cancel_order_failed: 'Nie udało się anulować zlecenia. Spróbuj ponownie.',
  modal: {
    title: 'Potwierdź wykonanie operacji',
    subtitle: 'Masz zamiar złożyć zlecenie {{orderType}}.',
    buy: 'Kupno',
    sell: 'Sprzedaż',
    ticker_label: 'Ticker: {{ticker}}',
    volume_label: 'Wolumen: {{volume}}',
    approx_price_label: 'Przybliżona cena: {{price}} USD',
    price_label: 'Cena: {{price}} USD',
    confirm: 'Potwierdź',
    close: 'Zamknij',
  },
};

export default plOrders;
