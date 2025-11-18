const enWallet = {
  wallet: 'Wallet',
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  deposit_funds: 'Deposit Funds',
  deposit_description: 'Add funds to your trading account to start investing.',
  amount: 'Amount',
  enter_amount: 'Enter amount',
  minimum_deposit: 'Minimum deposit: ${{amount}}',
  deposit_success: 'Successfully deposited ${{amount}}',
  invalid_amount_minimum:
    'Please enter a valid amount greater than ${{amount}}',
  invalid_amount_maximum: 'Please enter a valid amount less than ${{amount}}',
  deposit_error: 'Failed to process deposit. Please try again.',
  balance: 'Balance',
  blocked_funds: 'Blocked Funds: ',
  total_balance: 'Total Balance',
  available_balance: 'Available Balance',
  transaction_history: 'Transaction History',
  recent_deposits: 'Recent Deposits',
  no_transactions: 'No transactions yet',
  errors: {
    max_amount_per_24h_exceeded:
      'You can deposit a maximum of ${{maxAmount}} in 24 hours. Right now, you can deposit ${{amount}} more.',
    max_amount_per_deposit_exceeded:
      'The maximum amount per deposit is ${{amount}}.',
    deposit_failed: 'Deposit failed. Please try again later.',
  },
};

export default enWallet;
