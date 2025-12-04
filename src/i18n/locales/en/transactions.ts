const enTransactions = {
  tabs: {
    open_positions: 'Open positions',
    closed_positions: 'Closed positions',
    instrument_transaction_history: 'Open positions',
  },
  summary: {
    owned_assets: 'Owned volume',
    assets_value: 'Assets value',
  },
  table: {
    headers: {
      name: 'Name',
      transaction: 'Transaction',
      quantity: 'Quantity',
      share_price: 'Share Price',
      current_value: 'Current Value',
      market_value: 'Market Value',
      gain: 'Gain',
      realized_gain_loss: 'Realized gain / loss',
      realized_pct: 'Realized gain / loss %',
      unrealized_gain_loss: 'Unrealized gain / loss',
      unrealized_pct: 'Unrealized gain / loss %',
    },
  },
  badge: {
    buy: 'Buy',
    sell: 'Sell',
  },
  cards: {
    sold_at: 'Sold @',
    gain_loss: 'Gain / Loss',
    gain_loss_pct: 'Gain %',
    price_at_buy: 'Price at Buy',
    price_at_sell: 'Price at Sell',
    current_share_price: 'Current Share Price',
    sell_value: 'Sell Value',
    current_value: 'Current Value',
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
  error_invalid_data:
    'Invalid data format received from server. Please try again later.',
  no_open_positions: 'You have no open positions for this instrument.',
  end_of_history: 'End of transaction history',
  tooltips: {
    name: 'Name of the financial instrument',
    transaction: 'Date and type of transaction',
    quantity: 'Number of shares held in the position',
    share_price: 'Price per share at the time of the transaction',
    gain: 'Total profit from the position (volume × (current price - purchase price))',
    current_value: 'Total current value of the position',
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
