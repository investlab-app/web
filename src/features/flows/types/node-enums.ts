export enum BuySellAction {
  Buy = 'buy',
  Sell = 'sell',
}

export enum NotificationType {
  Email = 'email',
  Push = 'push',
}

export enum ComparisonDirection {
  Greater = 'greater',
  Lesser = 'lesser',
}

export enum TrendDirection {
  Risen = 'risen',
  Fell = 'fell',
}

export enum PositionDirection {
  Above = 'above',
  Below = 'below',
}

export enum TimeUnit {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export enum ShortTimeUnit {
  Hour = 'hour',
  Day = 'day',
}

export enum TransactionAction {
  Bought = 'bought',
  Sold = 'sold',
}

export enum PriceDirection {
  Over = 'over',
  Under = 'under',
}

export enum IndicatorType {
  RollingAvg = 'rolling_avg',
  Other = 'other',
}

export function getEnumValues<T extends Record<string, string>>(
  enumObj: T
): Array<T[keyof T]> {
  return Object.values(enumObj) as Array<T[keyof T]>;
}

export type EnumValue<T> = T[keyof T];
