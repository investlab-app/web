import {
  BuySellAction,
  ComparisonDirection,
  IndicatorType,
  NotificationType,
  PositionDirection,
  PriceDirection,
  ShortTimeUnit,
  TimeUnit,
  TransactionAction,
  TrendDirection,
} from '../types/input-options-types';

export const BUY_SELL_OPTIONS = [
  { value: BuySellAction.Buy, labelKey: 'flows.nodes.buy' },
  { value: BuySellAction.Sell, labelKey: 'flows.nodes.sell' },
] as const;

export const NOTIFICATION_TYPE_OPTIONS = [
  { value: NotificationType.Email, labelKey: 'flows.nodes.email' },
  { value: NotificationType.Push, labelKey: 'flows.nodes.push' },
] as const;

export const COMPARISON_DIRECTION_OPTIONS = [
  { value: ComparisonDirection.Greater, labelKey: 'flows.nodes.greater' },
  { value: ComparisonDirection.Lesser, labelKey: 'flows.nodes.less' },
] as const;

export const TREND_DIRECTION_OPTIONS = [
  { value: TrendDirection.Risen, labelKey: 'flows.nodes.risen' },
  { value: TrendDirection.Fell, labelKey: 'flows.nodes.fell' },
] as const;

export const POSITION_DIRECTION_OPTIONS = [
  { value: PositionDirection.Above, labelKey: 'flows.nodes.over' },
  { value: PositionDirection.Below, labelKey: 'flows.nodes.under' },
] as const;

export const TIME_UNIT_OPTIONS = [
  { value: TimeUnit.Hour, labelKey: 'flows.nodes.hour' },
  { value: TimeUnit.Day, labelKey: 'flows.nodes.day' },
  { value: TimeUnit.Week, labelKey: 'flows.nodes.week' },
  { value: TimeUnit.Month, labelKey: 'flows.nodes.month' },
] as const;

export const SHORT_TIME_UNIT_OPTIONS = [
  { value: ShortTimeUnit.Hour, labelKey: 'flows.nodes.hour' },
  { value: ShortTimeUnit.Day, labelKey: 'flows.nodes.day' },
] as const;

export const TRANSACTION_ACTION_OPTIONS = [
  { value: TransactionAction.Bought, labelKey: 'flows.nodes.bought' },
  { value: TransactionAction.Sold, labelKey: 'flows.nodes.sold' },
] as const;

export const PRICE_DIRECTION_OPTIONS = [
  { value: PriceDirection.Over, labelKey: 'flows.nodes.over' },
  { value: PriceDirection.Under, labelKey: 'flows.nodes.under' },
] as const;

export const INDICATOR_TYPE_OPTIONS = [
  { value: IndicatorType.RollingAvg, labelKey: 'flows.nodes.rolling_avg' },
  { value: IndicatorType.Other, labelKey: 'flows.nodes.other' },
] as const;
