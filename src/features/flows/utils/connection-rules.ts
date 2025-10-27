import { SuperNodeTypes } from '../types/node-types';

// Rules for connections between given node supertypes.
// Keys are source node supertypes, values are arrays of allowed target node supertypes.
// An empty array means no connections allowed from that node supertype.
// If a node supertype is not listed, no connections are allowed from it.
export const allowedConnections = {
  [SuperNodeTypes.Connector]: [
    [SuperNodeTypes.Connector, SuperNodeTypes.Rule],
    [SuperNodeTypes.Connector, SuperNodeTypes.Rule],
  ],
  [SuperNodeTypes.Flow]: [
    [SuperNodeTypes.Rule, SuperNodeTypes.Connector],
    [SuperNodeTypes.Action, SuperNodeTypes.Flow],
    [SuperNodeTypes.Action, SuperNodeTypes.Flow],
  ],
  [SuperNodeTypes.Trigger]: [[SuperNodeTypes.Flow, SuperNodeTypes.Action]],
  [SuperNodeTypes.Action]: [],
  [SuperNodeTypes.Rule]: [],
};

// Rules for node supertypes defined as keys in the map.
// First two records are max allowed connection counts per handle type in the node.
// Last two records are min numbers of connections required for a node to be valid.
export const connectionCounts = {
  [SuperNodeTypes.Connector]: {
    source: [1, 1],
    target: [1],
    validIn: [1],
    validOut: [1, 1],
  },
  [SuperNodeTypes.Flow]: {
    source: [1, -1, -1],
    target: [1],
    validIn: [1],
    validOut: [1, 1, 0],
  },
  [SuperNodeTypes.Trigger]: {
    source: [-1],
    target: [0],
    validIn: [0],
    validOut: [1],
  },
  [SuperNodeTypes.Action]: {
    source: [0],
    target: [1],
    validIn: [1],
    validOut: [0],
  },
  [SuperNodeTypes.Rule]: {
    source: [0],
    target: [1],
    validIn: [1],
    validOut: [0],
  },
};
