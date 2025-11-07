import { BuySellAmountNodeSettings } from '../nodes/action/buy-sell-amount-node-settings';
import { BuySellPercentNodeSettings } from '../nodes/action/buy-sell-percent-node-settings';
import { BuySellPriceNodeSettings } from '../nodes/action/buy-sell-price-node-settings';
import { SendNotificationNodeSettings } from '../nodes/action/send-notification-node-settings';
import { CheckEveryNodeSettings } from '../nodes/trigger/check-every-node-settings';
import { InstrumentBoughtSoldNodeSettings } from '../nodes/trigger/instrument-bought-sold-node-settings';
import { PriceChangesNodeSettings } from '../nodes/trigger/price-changes-node-settings';
import { CustomNodeTypes } from '../types/node-types';
import type { NodeSettings } from '../nodes/node-settings';

type SettingsFactory = (data: Record<string, unknown>) => NodeSettings;

const settingsClassMap: Partial<Record<CustomNodeTypes, SettingsFactory>> = {
  // Action nodes
  [CustomNodeTypes.BuySellAmount]: (data) =>
    Object.assign(new BuySellAmountNodeSettings(), data),
  [CustomNodeTypes.BuySellPrice]: (data) =>
    Object.assign(new BuySellPriceNodeSettings(), data),
  [CustomNodeTypes.BuySellPercent]: (data) =>
    Object.assign(new BuySellPercentNodeSettings(), data),
  [CustomNodeTypes.SendNotification]: (data) =>
    Object.assign(new SendNotificationNodeSettings(), data),

  // Trigger nodes
  [CustomNodeTypes.CheckEvery]: (data) =>
    Object.assign(new CheckEveryNodeSettings(), data),
  [CustomNodeTypes.PriceChanges]: (data) =>
    Object.assign(new PriceChangesNodeSettings(), data),
  [CustomNodeTypes.InstrumentBoughtSold]: (data) =>
    Object.assign(new InstrumentBoughtSoldNodeSettings(), data),
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
