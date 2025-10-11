// // Enums
// export enum SuperNodeTypes {
//   Connector = 'connector',
//   Rule = 'rule',
//   Action = 'action',
//   Trigger = 'trigger'
// }

// export enum ConnectorNodeTypes {
//   And = 'and',
//   Or = 'or',
// }

// export enum RuleNodeTypes {
//   PriceOverUnder = 'priceOverUnder',
//   HappensBetween = 'happensBetween',
// }
// export enum TriggerNodeTypes {
//   PriceChanges = 'priceChanges',
// }

// // Mapped relationships
// type NodeTypeMap =
//   | { super: SuperNodeTypes.Connector, sub: ConnectorNodeTypes.And }
//   | { super: SuperNodeTypes.Connector, sub: ConnectorNodeTypes.Or }
//   | { super: SuperNodeTypes.Rule, sub: RuleNodeTypes.PriceOverUnder }
//   | { super: SuperNodeTypes.Rule, sub: RuleNodeTypes.HappensBetween }
//   | { super: SuperNodeTypes.Trigger, sub: TriggerNodeTypes.PriceChanges }
//   ;

// type AllSubtypes = NodeTypeMap['sub'];
// type AllSupertypes = NodeTypeMap['super'];

// export type SuperTypeOf<TSub extends AllSubtypes> =
//   Extract<NodeTypeMap, { sub: TSub }>['super'];

// // Runtime map
// const subtypeToSupertypeMap: Record<AllSubtypes, AllSupertypes> = {
//   [ConnectorNodeTypes.And]: SuperNodeTypes.Connector,
//   [ConnectorNodeTypes.Or]: SuperNodeTypes.Connector,
//   [RuleNodeTypes.PriceOverUnder]: SuperNodeTypes.Rule,
//   [RuleNodeTypes.HappensBetween]: SuperNodeTypes.Rule,
//   [TriggerNodeTypes.PriceChanges]: SuperNodeTypes.Trigger,

// };

// // Function 1: get subtype string
// export function getSubtypeString(subtype: AllSubtypes): string {
//   return subtype;
// }

// // Function 2: get supertype from subtype
// export function getSupertype(subtype: AllSubtypes): AllSupertypes {
//   return subtypeToSupertypeMap[subtype];
// }

// Enums
export enum SuperNodeTypes {
  Connector = 'connector',
  Rule = 'rule',
  Action = 'action',
  Trigger = 'trigger',
}

export enum ConnectorNodeTypes {
  And = 'and',
  Or = 'or',
}

export enum RuleNodeTypes {
  PriceOverUnder = 'priceOverUnder',
  HappensBetween = 'happensBetween',
}

export enum TriggerNodeTypes {
  PriceChanges = 'priceChanges',
}

export const TypesMapping = {
  [ConnectorNodeTypes.And]: SuperNodeTypes.Connector,
  [ConnectorNodeTypes.Or]: SuperNodeTypes.Connector,
  [RuleNodeTypes.PriceOverUnder]: SuperNodeTypes.Rule,
  [RuleNodeTypes.HappensBetween]: SuperNodeTypes.Rule,
  [TriggerNodeTypes.PriceChanges]: SuperNodeTypes.Trigger,
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
