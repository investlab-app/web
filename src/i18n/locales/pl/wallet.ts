const plWallet = {
  wallet: 'Portfel',
  deposit: 'Wpłata',
  withdraw: 'Wypłata',
  deposit_funds: 'Wpłata Środków',
  deposit_description:
    'Dodaj środki na swoje konto handlowe, aby rozpocząć inwestowanie.',
  amount: 'Kwota',
  enter_amount: 'Wprowadź kwotę',
  minimum_deposit: 'Minimalna wpłata: ${{amount}}',
  deposit_success: 'Pomyślnie wpłacono ${{amount}}',
  invalid_amount_minimum:
    'Proszę wprowadzić prawidłową kwotę większą niż ${{amount}}',
  invalid_amount_maximum:
    'Proszę wprowadzić prawidłową kwotę mniejszą niż ${{amount}}',
  deposit_error: 'Nie udało się przetworzyć wpłaty. Spróbuj ponownie.',
  balance: 'Saldo',
  blocked_funds: 'Zablokowane Środki: ',
  total_balance: 'Saldo Całkowite',
  available_balance: 'Dostępne Saldo',
  transaction_history: 'Historia Transakcji',
  recent_deposits: 'Ostatnie Wpłaty',
  no_transactions: 'Brak transakcji',
  errors: {
    max_amount_per_24h_exceeded:
      'Możesz wpłacić maksymalnie ${{maxAmount}} w ciągu 24 godzin. Obecnie możesz wpłacić jeszcze ${{amount}}.',
    max_amount_per_deposit_exceeded:
      'Maksymalna kwota na jedną wpłatę to ${{amount}}.',
    deposit_failed: 'Wpłata nie powiodła się. Spróbuj ponownie później.',
  },
};

export default plWallet;
