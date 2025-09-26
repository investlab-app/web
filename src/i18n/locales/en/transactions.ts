const enTransactions = {
  tabs: {
    open_positions: 'Open positions',
    closed_positions: 'Closed positions',
  },
  table: {
    headers: {
      name: 'Name',
      quantity: 'Quantity',
      share_price: 'Share Price',
      acquisition_price: 'Acquisition Price',
      market_value: 'Market Value',
      gain_loss: 'Gain / Loss',
      gain_loss_pct: 'Gain / Loss %',
    },
  },
  badge: {
    buy: 'Buy',
    sell: 'Sell',
  },
  actions: {
    instrument_details: 'Instrument details',
  },
  error_loading: 'Sorry, the transaction history could not be loaded.',
  no_open_positions: 'You have no open positions for this instrument.',
  tooltips: {
    name: 'Name of the financial instrument',
    quantity: 'Number of shares owned',
    share_price: 'Current price per share',
    acquisition_price: 'Average price paid per share',
    market_value: 'Total current value of the position',
    gain_loss: 'Absolute profit or loss amount',
    gain_loss_pct: 'Percentage profit or loss',
    expand_details: 'Expand to view transaction details',
  },
};

export default enTransactions;
