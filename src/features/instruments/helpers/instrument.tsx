export type Instrument = {
  name: string;
  volume: number;
  currentPrice: number;
  dayChange: number;
  symbol: string;
};

export const convertToInstrument = (apiInstrument: any): Instrument => {
  return {
    name: apiInstrument.name || '',
    volume: Number(apiInstrument.volume) || 0,
    currentPrice: Number(apiInstrument.current_price) || 0,
    dayChange: Number(apiInstrument.day_change) || 0,
    symbol: apiInstrument.ticker || '',
  };
};

// You can also create a version that handles arrays of instruments
export const convertToInstruments = (apiInstruments: any[]): Instrument[] => {
  return apiInstruments.map(convertToInstrument);
};
