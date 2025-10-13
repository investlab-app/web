const enInstruments = {
  current_price: 'Current price',
  buy: 'Buy',
  sell: 'Sell',
  volume: 'Volume',
  price: 'Price',
  market_capital: 'Market capital',
  exchange: 'Exchange',
  sector: 'Sector',
  name: 'Name',
  symbol: 'Symbol',
  day_change: 'Day change',
  news: 'News',
  overview: 'Overview',
  instrument_details: 'Instrument details',
  see_details: 'See details',
  general_info: 'General info',
  no_description_available: 'No description available',
  history_empty:
    "History couldn't be found for ticker {{ticker}} for interval {{interval}}",
  errors: {
    loading_price_history:
      'Sorry, the information for this time range could not be loaded.',
    info_loading: 'Sorry, the instrument information could not be loaded.',
    news_unavailable: 'News are currently unavailable for this instrument.',
  },
  tooltips: {
    symbol: 'Stock ticker symbol for identification',
    name: 'Full company or instrument name',
    current_price: 'Current market price per share',
    day_change: 'Price change percentage from previous trading day',
    volume: 'Number of shares traded today',
    load_more: 'Load more instruments from the list',
  },
};

export default enInstruments;
