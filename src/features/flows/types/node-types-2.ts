export enum SuperNodeTypes {
  Action = 'action',
  Flow = 'flow',
  LogicOperator = 'logicOperator',
  Math = 'math',
  Number = 'number',
  NumericFlow = 'numericFlow',
  Predicate = 'predicate',
  Trigger = 'trigger',
}

export enum CustomNodeTypes {
  // Action
  BuySellAmount = 'buySellAmount',
  BuySellPrice = 'buySellPrice',
  BuySellPercent = 'buySellPercent',
  SendNotification = 'sendNotification',

  // Flow
  FlowIf = 'flowIf',

  // Logic Operator
  And = 'and',
  Not = 'not',
  OccuredXTimes = 'occuredXTimes',
  Or = 'or',

  // Math
  Add = 'add',
  ChangeOverTime = 'changeOverTime',
  Divide = 'divide',
  Multiply = 'multiply',
  Subtract = 'subtract',

  // Number
  PriceOf = 'priceOf',
  Indicator = 'indicator',
  priceChange = 'priceChange',
  moneyAvailable = 'moneyAvailable',
  numberOfAssets = 'numberOfAssets',
  valueOfAssets = 'valueOfAsset',

  // Numeric Flow
  NumbericFlowIf = 'numbericFlowIf',

  // Predicate
  IsGreaterLesser = 'isGreaterLesser',
  StaysTheSame = 'staysTheSame',
  StaysAboveBelow = 'staysAboveBelow',
  HasRisenFallen = 'hasRisenFallen',

  // Trigger
  PriceChanges = 'priceChanges',
  InstrumentBoughtSold = 'boughtSold',
  CheckEvery = 'checkEvery',
}

export const TypesMapping = {
  [CustomNodeTypes.BuySellAmount]: SuperNodeTypes.Action,
  [CustomNodeTypes.BuySellPrice]: SuperNodeTypes.Action,
  [CustomNodeTypes.BuySellPercent]: SuperNodeTypes.Action,
  [CustomNodeTypes.SendNotification]: SuperNodeTypes.Action,
  
  [CustomNodeTypes.FlowIf]: SuperNodeTypes.Flow,

  [CustomNodeTypes.And]: SuperNodeTypes.LogicOperator,
  [CustomNodeTypes.Not]: SuperNodeTypes.LogicOperator,
  [CustomNodeTypes.OccuredXTimes]: SuperNodeTypes.LogicOperator,
  [CustomNodeTypes.Or]: SuperNodeTypes.LogicOperator,

  [CustomNodeTypes.Add]: SuperNodeTypes.Math,
  [CustomNodeTypes.ChangeOverTime]: SuperNodeTypes.Math,
  [CustomNodeTypes.Divide]: SuperNodeTypes.Math,
  [CustomNodeTypes.Multiply]: SuperNodeTypes.Math,
  [CustomNodeTypes.Subtract]: SuperNodeTypes.Math,

  [CustomNodeTypes.PriceOf]: SuperNodeTypes.Number,
  [CustomNodeTypes.Indicator]: SuperNodeTypes.Number,
  [CustomNodeTypes.priceChange]: SuperNodeTypes.Number,
  [CustomNodeTypes.moneyAvailable]: SuperNodeTypes.Number,
  [CustomNodeTypes.numberOfAssets]: SuperNodeTypes.Number,
  [CustomNodeTypes.valueOfAssets]: SuperNodeTypes.Number,

  [CustomNodeTypes.NumbericFlowIf]: SuperNodeTypes.NumericFlow,

  [CustomNodeTypes.IsGreaterLesser]: SuperNodeTypes.Predicate,
  [CustomNodeTypes.StaysTheSame]: SuperNodeTypes.Predicate,
  [CustomNodeTypes.StaysAboveBelow]: SuperNodeTypes.Predicate,
  [CustomNodeTypes.HasRisenFallen]: SuperNodeTypes.Predicate,
  
  [CustomNodeTypes.PriceChanges]: SuperNodeTypes.Trigger,
  [CustomNodeTypes.InstrumentBoughtSold]: SuperNodeTypes.Trigger,
  [CustomNodeTypes.CheckEvery]: SuperNodeTypes.Trigger,
};
