import type { HistoryEntry } from '@/client';

export type PositionsCardHelpers = ReturnType<typeof usePositionsCardHelpers>;

export function usePositionsCardHelpers(history: Array<HistoryEntry>) {
  const calculateAverageBuyPrice = (upToIndex: number): number | null => {
    let totalCost = 0;
    let totalQuantity = 0;

    for (let i = 0; i < upToIndex; i++) {
      const entry = history[i];
      const quantity = Number(entry.quantity);
      if (entry.is_buy) {
        totalCost += entry.share_price * quantity;
        totalQuantity += quantity;
      } else {
        totalQuantity -= quantity;
      }
    }

    if (totalQuantity <= 0) return null;
    return totalCost / totalQuantity;
  };

  const calculateNumericalGain = (
    entry: HistoryEntry,
    entryIndex: number,
    currentPrice?: number
  ): number | null => {
    if (entry.is_buy) {
      if (!currentPrice) return null;
      return (currentPrice - entry.share_price) * Number(entry.quantity);
    } else {
      const avgBuyPrice = calculateAverageBuyPrice(entryIndex);
      if (avgBuyPrice === null) return null;
      return (entry.share_price - avgBuyPrice) * Number(entry.quantity);
    }
  };

  const calculatePercentageGain = (
    entry: HistoryEntry,
    numericalGain: number | null | undefined,
    entryIndex?: number
  ): number | null => {
    if (numericalGain === undefined || numericalGain === null) return null;

    let totalAcquisitionCost = 0;
    if (entry.is_buy) {
      totalAcquisitionCost = entry.share_price * Number(entry.quantity);
    } else {
      if (entryIndex === undefined) return null;
      const avgBuyPrice = calculateAverageBuyPrice(entryIndex);
      if (avgBuyPrice === null) return null;
      totalAcquisitionCost = avgBuyPrice * Number(entry.quantity);
    }

    if (totalAcquisitionCost === 0) return null;
    return (numericalGain / totalAcquisitionCost) * 100;
  };

  const formatCurrency = (value: number, language: string): string => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getGainColor = (value: number): string => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  return {
    calculateNumericalGain,
    calculatePercentageGain,
    formatCurrency,
    formatPercentage,
    getGainColor,
    calculateAverageBuyPrice,
  };
}
