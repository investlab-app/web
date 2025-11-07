const enMarketStatus = {
  regular_hours_info:
    'Regular trading hours {{openTime}} - {{closeTime}} ({{timeZone}}).\nServer time: {{localTime}}',
  pre_market_info:
    'Pre-market trading. Regular hours start at {{openTime}} ({{timeZone}}).\nServer time: {{localTime}}',
  after_hours_info:
    'Market closed at {{closeTime}} ({{timeZone}}). After hours trading until {{afterHoursClose}} ({{timeZone}}).\nServer time: {{localTime}}',
  weekend_closed:
    'Market closed on weekends.\nOpens Monday at {{openTime}} ({{timeZone}}).\nServer time: {{localTime}}',
  opens_in:
    'Market opens at {{openTime}} ({{timeZone}}) in {{hours}}h {{minutes}}m.\nServer time: {{localTime}}',
  opens_tomorrow:
    'Market opens tomorrow at {{openTime}} ({{timeZone}}).\nServer time: {{localTime}}',
  market_closed_default: 'Market closed.\nServer time: {{localTime}}',
};

export default enMarketStatus;
