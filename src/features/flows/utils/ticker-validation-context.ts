import { createContext, useContext } from 'react';

interface TickerValidationContextType {
  validTickers: Set<string>;
  isValidTicker: (ticker: string) => boolean;
}

const TickerValidationContext = createContext<TickerValidationContextType>({
  validTickers: new Set(),
  isValidTicker: () => false,
});

export const useValidTickers = () => {
  const context = useContext(TickerValidationContext);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!context) {
    throw new Error(
      'useValidTickers must be used within a TickerValidationProvider'
    );
  }
  return context;
};

export const TickerValidationProvider = TickerValidationContext.Provider;
