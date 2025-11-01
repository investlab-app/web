const plMarketStatus = {
  regular_hours_info:
    'Regularne godziny handlu {{openTime}} - {{closeTime}}.\nCzas lokalny: {{localTime}} ({{timeZone}})',
  pre_market_info:
    'Obroty przed otwarciem. Regularne godziny rozpoczynają się o {{openTime}}.\nCzas lokalny: {{localTime}} ({{timeZone}})',
  after_hours_info:
    'Rynek zamknął o {{closeTime}}. Obroty after hours do {{afterHoursClose}}.\nCzas lokalny: {{localTime}} ({{timeZone}})',
  weekend_closed:
    'Rynek zamknięty w weekendy.\nOtwiera się w poniedziałek o {{openTime}}.\nCzas lokalny: {{localTime}} ({{timeZone}})',
  opens_in:
    'Rynek otwiera się o {{openTime}} (za {{hours}} {{hourLabel}}).\nCzas lokalny: {{localTime}} ({{timeZone}})',
  opens_tomorrow:
    'Rynek otwiera się jutro o {{openTime}}.\nCzas lokalny: {{localTime}} ({{timeZone}})',
  market_closed_default:
    'Rynek zamknięty.\nCzas lokalny: {{localTime}} ({{timeZone}})',
};

export default plMarketStatus;
