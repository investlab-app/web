const plMarketStatus = {
  regular_hours_info:
    'Regularne godziny handlu {{openTime}} - {{closeTime}} ({{timeZone}}).\nCzas serwera: {{localTime}}',
  pre_market_info:
    'Obroty przed otwarciem. Regularne godziny rozpoczynają się o {{openTime}} ({{timeZone}}).\nCzas serwera: {{localTime}}',
  after_hours_info:
    'Rynek zamknął o {{closeTime}} ({{timeZone}}). Obroty after hours do {{afterHoursClose}} ({{timeZone}}).\nCzas serwera: {{localTime}}',
  weekend_closed:
    'Rynek zamknięty w weekendy.\nOtwiera się w poniedziałek o {{openTime}} ({{timeZone}}).\nCzas serwera: {{localTime}}',
  opens_in:
    'Rynek otwiera się o {{openTime}} ({{timeZone}}) za {{hours}}h {{minutes}}m.\nCzas serwera: {{localTime}}',
  opens_tomorrow:
    'Rynek otwiera się jutro o {{openTime}} ({{timeZone}}).\nCzas serwera: {{localTime}}',
  market_closed_default:
    'Rynek zamknięty.\nCzas serwera: {{localTime}}',
};

export default plMarketStatus;
