const plInstruments = {
  current_price: 'Aktualna cena',
  buy: 'Kup',
  sell: 'Sprzedaj',
  volume: 'Wolumen',
  price: 'Cena',
  name: 'Nazwa',
  market_capital: 'Kapitał rynkowy',
  exchange: 'Giełda',
  sector: 'Sektor',
  cik: 'CIK',
  website: 'Strona internetowa',
  symbol: 'Symbol',
  day_change: 'Dzienna zmiana',
  news: 'Wiadomości',
  general_info: 'Informacje ogólne',
  see_details: 'Zobacz szczegóły',
  overview: 'Przegląd',
  instrument_details: 'Szczegóły instrumentu',
  no_description_available: 'Brak opisu',
  history_empty:
    'Nie znaleziono historii dla instrumentu {{ticker}} w interwale {{interval}}',
  errors: {
    loading_price_history:
      'Przepraszamy, informacje o cenie w tym okresie nie mogły zostać załadowane.',
    info_loading:
      'Przepraszamy, informacje o instrumencie nie mogły zostać załadowane.',
    news_unavailable: 'Wiadomości są obecnie niedostępne dla tego instrumentu.',
  },
  price_alert_invalid_threshold: 'Proszę wprowadzić prawidłową wartość progową',
  price_alert: {
    set_alert: 'Ustaw alert',
    set_price_alert_for: 'Ustaw alert cenowy dla {{ticker}}',
    alert_description: 'Otrzymuj powiadomienia, gdy cena przekroczy Twój próg.',
    form: {
      select_notification_method:
        'Wybierz co najmniej jedną metodę powiadomień',
      push_subscription_failed: 'Nie udało się zapisać do powiadomień push',
      alert_created_successfully: 'Alert cenowy został utworzony pomyślnie',
      alert_type: 'Typ alertu',
      alert_when_above: 'Alert gdy cena wzrośnie powyżej',
      alert_when_below: 'Alert gdy cena spadnie poniżej',
      threshold_value: 'Wartość progowa',
      enter_price_threshold: 'Wprowadź próg cenowy',
      notification_methods: 'Metody powiadomień',
      in_app_notification: 'Powiadomienie w aplikacji',
      push_notification: 'Powiadomienie push',
      email_notification: 'Powiadomienie e-mail',
      create_alert: 'Utwórz alert',
    },
  },
  tooltips: {
    symbol: 'Symbol giełdowy instrumentu do identyfikacji',
    name: 'Pełna nazwa spółki lub instrumentu',
    current_price: 'Aktualna cena rynkowa za akcję',
    day_change: 'Procentowa zmiana ceny od poprzedniego dnia handlowego',
    volume: 'Liczba akcji handlowanych dzisiaj',
    load_more: 'Załaduj więcej instrumentów z listy',
  },
  browse_instruments: 'Przeglądaj instrumenty',
  no_instruments_found: 'Nie znaleziono instrumentów',
};

export default plInstruments;
