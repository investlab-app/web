import { type } from 'arktype';

const historyEntry = type({
  date: 'Date',
  type: 'string',
  quantity: 'number',
  sharePrice: 'number',
  acquisitionPrice: 'number | null',
  marketValue: 'number',
  gainLoss: 'number',
  gainLossPct: 'number',
});
export type HistoryEntry = typeof historyEntry.infer;

const position = type({
  name: 'string',
  quantity: 'number',
  marketValue: 'number',
  gainLoss: 'number',
  gainLossPct: 'number',
  history: historyEntry.array(),
});
export type Position = typeof position.infer;

const transactionHistoryResponse = type({
  open: position.array(),
  closed: position.array(),
});
export type TransactionsHistoryResponse =
  typeof transactionHistoryResponse.infer;

const generateRandomTickerTransactionHistory = () => {
  const names = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NFLX', 'FB'];
  const generateRandomHistory = () => {
    const transactionCount = Math.floor(Math.random() * 5) + 1;
    return Array.from({ length: transactionCount }, () =>
      (() => {
        const transactionType = Math.random() > 0.5 ? 'BUY' : 'SELL';
        return {
          date: new Date(
            Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
          ),
          type: transactionType,
          quantity: Math.floor(Math.random() * 10) + 1,
          sharePrice: Math.random() * 1000,
          acquisitionPrice:
            transactionType === 'BUY'
              ? Math.floor(Math.random() * 10) + 1
              : null,
          marketValue: Math.random() * 1000,
          gainLoss: Math.random() * 100 - 50,
          gainLossPct: Math.random() * 100 - 50,
        };
      })()
    );
  };
  const transactions = names.map((symbol) => ({
    name: symbol,
    quantity: Math.floor(Math.random() * 10) + 1,
    marketValue: Math.random() * 1000,
    gainLoss: Math.random() * 100 - 50,
    gainLossPct: Math.random() * 100 - 50,
    history: generateRandomHistory(),
  }));
  return {
    open: transactions.slice(0, 3),
    closed: transactions.slice(3),
  };
};

// interface FetchTransactionsHistory {
//   token: string;
// }

export const fetchTransactionsHistory = async () => {
  const response = await new Promise((resolve) => {
    setTimeout(() => {
      const history = generateRandomTickerTransactionHistory();
      resolve(history);
    }, 3000);
  });

  // const transactions = await fetchWithAuth<TransactionsHistoryResponse>(
  //   '/api/investors/me/transactions',
  //   token
  // );

  const result = transactionHistoryResponse(response);
  if (result instanceof type.errors) {
    console.error('Invalid transactions history response:', result.summary);
    throw new Error(`Invalid transactions history response: ${result.summary}`);
  }

  return result;
};
