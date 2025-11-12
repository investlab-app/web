export const SuperNodeTypes = {
  Action: 'action',
  Flow: 'flow',
  LogicOperator: 'logicOperator',
  Math :'math',
  Number: 'number',
  NumericFlow: 'numericFlow',
  Predicate: 'predicate',
  Trigger :'trigger',
} as const;

export type SuperNodeTypes =
  typeof SuperNodeTypes[keyof typeof SuperNodeTypes];

export const CustomNodeTypes = {
  // Action
  BuySellAmount: 'buySellAmount',
  BuySellPrice: 'buySellPrice',
  BuySellPercent: 'buySellPercent',
  SendNotification: 'sendNotification',

  // Flow
  FlowIf: 'flowIf',

  // Logic Operator
  And: 'and',
  Not: 'not',
  OccurredXTimes: 'occurredXTimes',
  Or: 'or',

  // Math
  Add: 'add',
  ChangeOverTime: 'changeOverTime',
  Divide: 'divide',
  Multiply: 'multiply',
  Subtract: 'subtract',

  // Number
  PriceOf: 'priceOf',
  Indicator: 'indicator',
  PriceChange: 'priceChange',
  MoneyAvailable: 'moneyAvailable',
  NumberOfAssets: 'numberOfAssets',
  ValueOfAssets: 'valueOfAsset',

  // Numeric Flow
  NumbericFlowIf: 'numbericFlowIf',

  // Predicate
  IsGreaterLesser: 'isGreaterLesser',
  StaysTheSame: 'staysTheSame',
  StaysAboveBelow: 'staysAboveBelow',
  HasRisenFallen: 'hasRisenFallen',

  // Trigger
  PriceChanges: 'priceOverUnder',
  InstrumentBoughtSold: 'boughtSold',
  CheckEvery: 'checkEvery',
} as const;

export type CustomNodeTypes =
  typeof CustomNodeTypes[keyof typeof CustomNodeTypes];
