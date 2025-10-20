export enum SuperNodeTypes {
  Connector = 'connector',
  Flow = 'flow',
  Rule = 'rule',
  Action = 'action',
  Trigger = 'trigger',
}

export enum CustomNodeTypes {
  // Connector
  And = 'and',
  Or = 'or',

  // Flow
  IfThenElse = 'ifThenElse',

  // Trigger
  PriceChanges = 'priceChanges',
  InstrumentBoughtSold = 'instrumentBoughtSold',

  // Rule
  PriceOverUnder = 'priceOverUnder',
  HappensWithin = 'happensWithin',
  HappensBetween = 'happensBetween',

  // Action
  BuySellAmount = 'buySellAmount',
  BuySellPrice = 'buySellPrice',
  BuySellPercent = 'buySellPercent',
  SendNotification = 'sendNotification',
}

export const TypesMapping = {
  [CustomNodeTypes.And]: SuperNodeTypes.Connector,
  [CustomNodeTypes.Or]: SuperNodeTypes.Connector,
  [CustomNodeTypes.IfThenElse]: SuperNodeTypes.Flow,
  [CustomNodeTypes.PriceOverUnder]: SuperNodeTypes.Rule,
  [CustomNodeTypes.HappensBetween]: SuperNodeTypes.Rule,
  [CustomNodeTypes.HappensWithin]: SuperNodeTypes.Rule,
  [CustomNodeTypes.PriceChanges]: SuperNodeTypes.Trigger,
  [CustomNodeTypes.InstrumentBoughtSold]: SuperNodeTypes.Trigger,
  [CustomNodeTypes.BuySellAmount]: SuperNodeTypes.Action,
  [CustomNodeTypes.BuySellPrice]: SuperNodeTypes.Action,
  [CustomNodeTypes.BuySellPercent]: SuperNodeTypes.Action,
  [CustomNodeTypes.SendNotification]: SuperNodeTypes.Action,
};
