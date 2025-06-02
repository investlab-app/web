const mockInstrumentHistory = (
  range: string
): Promise<Array<{ date: string; price: number }>> => {
  // Here you would call your API
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const days =
        range === '1h'
          ? 1
          : range === '1d'
            ? 1
            : range === '1w'
              ? 7
              : range === '1m'
                ? 30
                : range === '1y'
                  ? 365
                  : 730;
      const data = Array.from({ length: days }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (days - i));
        return {
          date: date.toISOString().split('T')[0],
          price: 100 + Math.random() * 20,
        };
      });
      resolve(data);
    }, 500);
  });
};
