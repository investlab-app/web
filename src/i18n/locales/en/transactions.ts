const enTransactions = {
  tabs: {
    open_positions: 'Open positions',
    closed_positions: 'Closed positions',
  },
  table: {
    headers: {
      name: 'Name',
      transaction: 'Transaction',
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
  cards: {
    sold_at: 'Sold @',
    avg_buy_price: 'Avg Buy Price',
    realized_gain_loss: 'Realized Gain / Loss',
    realized_pct: 'Realized %',
    current_price: 'Current Price',
  },
  actions: {
    instrument_details: 'Instrument details',
  },
  position: {
    summary: {
      transactions_count_one: '1 trade recorded',
      transactions_count_other: '{{count}} trades recorded',
      last_transaction: 'Last {{action}} on {{date}}',
      no_transactions: 'No trades recorded yet',
    },
  },
  error_loading: 'Sorry, the transaction history could not be loaded.',
  error_invalid_data: 'Invalid data format received from server. Please try again later.',
  no_open_positions: 'You have no open positions for this instrument.',
  end_of_history: 'End of transaction history',
  tooltips: {
    name: 'Name of the financial instrument',
    transaction: 'Date and type of transaction (buy or sell)',
    quantity: 'Number of shares held in the position',
    share_price: 'Price per share at the time of the transaction',
    acquisition_price: 'Price of acquisition (quantity × share price + fees)',
    market_value: 'Total current value of the position',
    gain_loss:
      'For BUY: (current price - purchase price) × quantity. For SELL: (sell price - purchase price) × quantity',
    gain_loss_pct:
      'Profit or loss percentage. For BUY: based on current price vs purchase price. For SELL: based on sell price vs purchase price',
    expand_details: 'Expand to view transaction details',
    hide_details: 'Hide transaction details',
  },
};

export default enTransactions;
