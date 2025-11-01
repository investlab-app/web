const enMarketStatus = {
  regular_hours_info:
    'Regular trading hours {{openTime}} - {{closeTime}} ET.\nLocal time: {{localTime}} ({{timeZone}})',
  pre_market_info:
    'Pre-market trading. Regular hours start at {{openTime}} ET.\nLocal time: {{localTime}} ({{timeZone}})',
  after_hours_info:
    'Market closed at {{closeTime}} ET. After hours trading until {{afterHoursClose}} ET.\nLocal time: {{localTime}} ({{timeZone}})',
  weekend_closed:
    'Market closed on weekends.\nOpens Monday at {{openTime}} ET.\nLocal time: {{localTime}} ({{timeZone}})',
  opens_in:
    'Market opens at {{openTime}} ET (in {{hours}} {{hourLabel}}).\nLocal time: {{localTime}} ({{timeZone}})',
  opens_tomorrow:
    'Market opens tomorrow at {{openTime}} ET.\nLocal time: {{localTime}} ({{timeZone}})',
  market_closed_default:
    'Market closed.\nLocal time: {{localTime}} ({{timeZone}})',
};

export default enMarketStatus;
