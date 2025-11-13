import { BuySellAmountNodeSettings } from '../nodes/action/buy-sell-amount-node-settings';
import { BuySellPercentNodeSettings } from '../nodes/action/buy-sell-percent-node-settings';
import { BuySellPriceNodeSettings } from '../nodes/action/buy-sell-price-node-settings';
import { SendNotificationNodeSettings } from '../nodes/action/send-notification-node-settings';
import { CheckEveryNodeSettings } from '../nodes/trigger/check-every-node-settings';
import { InstrumentBoughtSoldNodeSettings } from '../nodes/trigger/instrument-bought-sold-node-settings';
import { PriceChangesNodeSettings } from '../nodes/trigger/price-changes-node-settings';
import { NotNodeSettings } from '../nodes/logic-operator/not-node-settings';
import { AndNodeSettings } from '../nodes/logic-operator/and-node-settings';
import { OrNodeSettings } from '../nodes/logic-operator/or-node-settings';
import { OccurredXTimesNodeSettings } from '../nodes/logic-operator/occurred-x-times-node-settings';
import { AddNodeSettings } from '../nodes/math/add-node-settings';
import { SubtractNodeSettings } from '../nodes/math/subtract-node-settings';
import { MultiplyNodeSettings } from '../nodes/math/multiply-node-settings';
import { DivideNodeSettings } from '../nodes/math/divide-node-settings';
import { ChangeOverTimeNodeSettings } from '../nodes/math/change-over-time-node-settings';
import { FlowIfNodeSettings } from '../nodes/flow/flow-if-node-settings';
import { NumericFlowIfNodeSettings } from '../nodes/flow/numeric-flow-if-node-settings';
import { StaysAboveBelowNodeSettings } from '../nodes/predicate/stays-above-below-node-settings';
import { HasRisenFallenNodeSettings } from '../nodes/predicate/has-risen-fallen-node-settings';
import { IsGreaterLessNodeSettings } from '../nodes/predicate/is-greater-less-node-settings';
import { StaysTheSameNodeSettings } from '../nodes/predicate/stays-the-same-node-settings';
import { PriceOfNodeSettings } from '../nodes/number/price-of-node-settings';
import { MoneyAvailableNodeSettings } from '../nodes/number/money-available-node-settings';
import { NumberOfAssetsNodeSettings } from '../nodes/number/number-of-assets-node-settings';
import { ValueOfAssetsNodeSettings } from '../nodes/number/value-of-assets-node-settings';
import { IndicatorNodeSettings } from '../nodes/number/indicator-node-settings';
import { PriceChangeNodeSettings } from '../nodes/number/price-change-node-settings';
import { CustomNodeTypes } from '../types/node-types';
import type { NodeSettings } from '../nodes/node-settings';

type SettingsFactory = (data: Record<string, unknown>) => NodeSettings;

const settingsClassMap: Partial<Record<CustomNodeTypes, SettingsFactory>> = {
  // Logic Operator nodes
  [CustomNodeTypes.Not]: (data) => Object.assign(new NotNodeSettings(), data),
  [CustomNodeTypes.And]: (data) => Object.assign(new AndNodeSettings(), data),
  [CustomNodeTypes.Or]: (data) => Object.assign(new OrNodeSettings(), data),
  [CustomNodeTypes.OccurredXTimes]: (data) =>
    Object.assign(new OccurredXTimesNodeSettings(), data),

  // Math nodes
  [CustomNodeTypes.Add]: (data) => Object.assign(new AddNodeSettings(), data),
  [CustomNodeTypes.Subtract]: (data) =>
    Object.assign(new SubtractNodeSettings(), data),
  [CustomNodeTypes.Multiply]: (data) =>
    Object.assign(new MultiplyNodeSettings(), data),
  [CustomNodeTypes.Divide]: (data) =>
    Object.assign(new DivideNodeSettings(), data),
  [CustomNodeTypes.ChangeOverTime]: (data) =>
    Object.assign(new ChangeOverTimeNodeSettings(), data),

  // Flow nodes
  [CustomNodeTypes.FlowIf]: (data) =>
    Object.assign(new FlowIfNodeSettings(), data),
  [CustomNodeTypes.NumbericFlowIf]: (data) =>
    Object.assign(new NumericFlowIfNodeSettings(), data),

  // Predicate nodes
  [CustomNodeTypes.StaysAboveBelow]: (data) =>
    Object.assign(new StaysAboveBelowNodeSettings(), data),
  [CustomNodeTypes.HasRisenFallen]: (data) =>
    Object.assign(new HasRisenFallenNodeSettings(), data),
  [CustomNodeTypes.IsGreaterLesser]: (data) =>
    Object.assign(new IsGreaterLessNodeSettings(), data),
  [CustomNodeTypes.StaysTheSame]: (data) =>
    Object.assign(new StaysTheSameNodeSettings(), data),

  // Number nodes
  [CustomNodeTypes.PriceOf]: (data) =>
    Object.assign(new PriceOfNodeSettings(), data),
  [CustomNodeTypes.MoneyAvailable]: (data) =>
    Object.assign(new MoneyAvailableNodeSettings(), data),
  [CustomNodeTypes.NumberOfAssets]: (data) =>
    Object.assign(new NumberOfAssetsNodeSettings(), data),
  [CustomNodeTypes.ValueOfAssets]: (data) =>
    Object.assign(new ValueOfAssetsNodeSettings(), data),
  [CustomNodeTypes.Indicator]: (data) =>
    Object.assign(new IndicatorNodeSettings(), data),
  [CustomNodeTypes.PriceChange]: (data) =>
    Object.assign(new PriceChangeNodeSettings(), data),

  // Trigger nodes
  [CustomNodeTypes.CheckEvery]: (data) =>
    Object.assign(new CheckEveryNodeSettings(), data),
  [CustomNodeTypes.PriceChanges]: (data) =>
    Object.assign(new PriceChangesNodeSettings(), data),
  [CustomNodeTypes.InstrumentBoughtSold]: (data) =>
    Object.assign(new InstrumentBoughtSoldNodeSettings(), data),

  // Action nodes
  [CustomNodeTypes.BuySellAmount]: (data) =>
    Object.assign(new BuySellAmountNodeSettings(), data),
  [CustomNodeTypes.BuySellPrice]: (data) =>
    Object.assign(new BuySellPriceNodeSettings(), data),
  [CustomNodeTypes.BuySellPercent]: (data) =>
    Object.assign(new BuySellPercentNodeSettings(), data),
  [CustomNodeTypes.SendNotification]: (data) =>
    Object.assign(new SendNotificationNodeSettings(), data),
};

export function restoreNodeSettings(
  nodeType: CustomNodeTypes,
  settingsData: Record<string, unknown>
): NodeSettings {
  const factory = settingsClassMap[nodeType];

  if (!factory) {
    throw new Error(
      `No settings factory found for node type: ${nodeType}. ` +
        `This node type may not be supported for restoration yet.`
    );
  }

  return factory(settingsData);
}

export function hasSettingsFactory(nodeType: CustomNodeTypes): boolean {
  return nodeType in settingsClassMap;
}
