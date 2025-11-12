export const BuySellAction = {
  Buy: 'buy',
  Sell: 'sell',
} as const;
export type BuySellAction = (typeof BuySellAction)[keyof typeof BuySellAction];

export const NotificationType = {
  Email: 'email',
  Push: 'push',
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const ComparisonDirection = {
  Greater: 'greater',
  Lesser: 'less',
} as const;
export type ComparisonDirection =
  (typeof ComparisonDirection)[keyof typeof ComparisonDirection];

export const TrendDirection = {
  Risen: 'risen',
  Fell: 'fell',
} as const;
export type TrendDirection =
  (typeof TrendDirection)[keyof typeof TrendDirection];

export const PositionDirection = {
  Above: 'above',
  Below: 'below',
} as const;
export type PositionDirection =
  (typeof PositionDirection)[keyof typeof PositionDirection];

export const TimeUnit = {
  Hour: 'hour',
  Day: 'day',
  Week: 'week',
  Month: 'month',
} as const;
export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit];

export const ShortTimeUnit = {
  Hour: 'hour',
  Day: 'day',
} as const;
export type ShortTimeUnit = (typeof ShortTimeUnit)[keyof typeof ShortTimeUnit];

export const TransactionAction = {
  Bought: 'bought',
  Sold: 'sold',
} as const;
export type TransactionAction =
  (typeof TransactionAction)[keyof typeof TransactionAction];

export const PriceDirection = {
  Over: 'over',
  Under: 'under',
} as const;
export type PriceDirection =
  (typeof PriceDirection)[keyof typeof PriceDirection];

export const IndicatorType = {
  RollingAvg: 'rolling_avg',
  Other: 'other',
} as const;
export type IndicatorType = (typeof IndicatorType)[keyof typeof IndicatorType];

export function getEnumValues<T extends Record<string, string>>(
  enumObj: T
): Array<T[keyof T]> {
  return Object.values(enumObj) as Array<T[keyof T]>;
}

export type EnumValue<T> = T[keyof T];
