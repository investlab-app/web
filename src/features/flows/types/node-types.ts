export enum SuperNodeTypes {
  Connector = 'connector',
  FlowIf = 'flowIf',
  FlowThenElse = 'flowThenElse',
  FlowThen = 'flowThen',
  Rule = 'rule',
  Action = 'action',
  Trigger = 'trigger',
}

export enum CustomNodeTypes {
  // Connector
  And = 'and',
  Or = 'or',

  // Flow
  If = 'if',
  ThenElse = 'thenElse',
  Then = 'then',

  // Trigger
  PriceChanges = 'priceChanges',

  // Rule
  PriceOverUnder = 'priceOverUnder',
  HappensWithin = 'happensWithin',
  HappensBetween = 'happensBetween',

  // Action
  BuySellAmount = 'buySellAmount',
}

export const TypesMapping = {
  [CustomNodeTypes.And]: SuperNodeTypes.Connector,
  [CustomNodeTypes.Or]: SuperNodeTypes.Connector,
  [CustomNodeTypes.If]: SuperNodeTypes.FlowIf,
  [CustomNodeTypes.ThenElse]: SuperNodeTypes.FlowThenElse,
  [CustomNodeTypes.Then]: SuperNodeTypes.FlowThen,
  [CustomNodeTypes.PriceOverUnder]: SuperNodeTypes.Rule,
  [CustomNodeTypes.HappensBetween]: SuperNodeTypes.Rule,
  [CustomNodeTypes.HappensWithin]: SuperNodeTypes.Rule,
  [CustomNodeTypes.PriceChanges]: SuperNodeTypes.Trigger,
  [CustomNodeTypes.BuySellAmount]: SuperNodeTypes.Action,
};

// // Single source of truth mapping
// const nodeTypesBySupertype = {
//   [SuperNodeTypes.Connector]: {
//     And: ConnectorNodeTypes.And,
//     Or: ConnectorNodeTypes.Or,
//   },
//   [SuperNodeTypes.Rule]: {
//     PriceOverUnder: RuleNodeTypes.PriceOverUnder,
//     HappensBetween: RuleNodeTypes.HappensBetween,
//   },
//   [SuperNodeTypes.Trigger]: {
//     PriceChanges: TriggerNodeTypes.PriceChanges,
//   },
// } as const;

// // Derived types
// type NodeTypesBySupertype = typeof nodeTypesBySupertype;
// type AllSupertypes = keyof NodeTypesBySupertype;
// type AllSubtypes = NodeTypesBySupertype[AllSupertypes][keyof NodeTypesBySupertype[AllSupertypes]];

// export type NodeTypeMap = {
//   [S in AllSupertypes]: {
//     super: S;
//     sub: NodeTypesBySupertype[S][keyof NodeTypesBySupertype[S]];
//   }
// }[AllSupertypes];

// const subtypeToSupertypeMap: Record<AllSubtypes, AllSupertypes> = Object.entries(nodeTypesBySupertype).reduce(
//   (acc, [supertype, subtypes]) => {
//     (Object.values(subtypes) as Array<AllSubtypes>).forEach(subtype => {
//       // @ts-ignore trust me
//       acc[subtype] = supertype as AllSupertypes;
//     });
//     return acc;
//   }, {} as Record<AllSubtypes, AllSupertypes>

// );

// export function getSupertype(subtype: AllSubtypes): AllSupertypes {
//   return subtypeToSupertypeMap[subtype];
// }
