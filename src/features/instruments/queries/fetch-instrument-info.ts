interface InstrumentInfo {
  name: string;
  symbol: string;
  currentPrice: number;
  volume: number;
  dayChange: number;
}

interface FetchInstrumentInfo {
  // token: string;
  symbol: string;
}

export const fetchInstrumentInfo = async ({
  // token,
  symbol,
}: FetchInstrumentInfo): Promise<InstrumentInfo> => {
  const mockData = {
    name: symbol,
    symbol: symbol,
    currentPrice: 155.5,
    volume: 1000000,
    dayChange: 2.5,
  };

  return Promise.resolve(mockData);
};
