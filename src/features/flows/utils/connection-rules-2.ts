import { SuperNodeTypes } from '../types/node-types-2';

// Rules for connections between given node supertypes.
// Keys are source node supertypes, values are arrays of allowed target node supertypes.
// An empty array means no connections allowed from that node supertype.
// If a node supertype is not listed, no connections are allowed from it.
export const allowedConnections = {
  [SuperNodeTypes.Action]: [],
  [SuperNodeTypes.LogicOperator]: [
    SuperNodeTypes.LogicOperator,
    SuperNodeTypes.Predicate,
  ],
  [SuperNodeTypes.Math]: [
    SuperNodeTypes.Number,
    SuperNodeTypes.Math,
    SuperNodeTypes.NumericFlow,
  ],
  [SuperNodeTypes.Number]: [],
  [SuperNodeTypes.Predicate]: [
    SuperNodeTypes.Number,
    SuperNodeTypes.NumericFlow,
    SuperNodeTypes.Math,
  ],
  [SuperNodeTypes.Trigger]: [SuperNodeTypes.Flow],
};

export const flowsAllowedConnections = {
  [SuperNodeTypes.NumericFlow]: [
    [SuperNodeTypes.Predicate, SuperNodeTypes.LogicOperator],
    [SuperNodeTypes.Number, SuperNodeTypes.NumericFlow, SuperNodeTypes.Math],
    [SuperNodeTypes.Number, SuperNodeTypes.NumericFlow, SuperNodeTypes.Math],
  ],
  [SuperNodeTypes.Flow]: [
    [SuperNodeTypes.Predicate, SuperNodeTypes.LogicOperator],
    [SuperNodeTypes.Action, SuperNodeTypes.Flow],
    [SuperNodeTypes.Action, SuperNodeTypes.Flow],
  ],
};

// Rules for node supertypes defined as keys in the map.
// First two records are max allowed connection counts per handle type in the node.
// Last two records are min numbers of connections required for a node to be valid.
export const connectionCounts = {
  [SuperNodeTypes.Action]: { source: 0, target: 1, validIn: 1, validOut: 0 },
  [SuperNodeTypes.LogicOperator]: {
    source: 1,
    target: 1,
    validIn: 1,
    validOut: 1,
  },
  [SuperNodeTypes.Math]: {
    source: 1,
    target: 1,
    validIn: 1,
    validOut: 1,
  },
  [SuperNodeTypes.Trigger]: { source: -1, target: 0, validIn: 0, validOut: 1 },
  [SuperNodeTypes.Number]: { source: 0, target: 1, validIn: 1, validOut: 0 },
  [SuperNodeTypes.Predicate]: { source: 1, target: 1, validIn: 1, validOut: 1 },
};

export const flowsConnectionCounts = {
  [SuperNodeTypes.NumericFlow]: {
    source: [1, -1, -1],
    target: [1],
    validIn: [1],
    validOut: [1, 1, 0],
  },
  [SuperNodeTypes.Flow]: {
    source: [1, -1, -1],
    target: [1],
    validIn: [1],
    validOut: [1, 1, 0],
  },
};
