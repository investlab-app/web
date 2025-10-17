import { SuperNodeTypes } from '../types/node-types';

// Rules for connections between given node supertypes.
// Keys are source node supertypes, values are arrays of allowed target node supertypes.
// An empty array means no connections allowed from that node supertype.
// If a node supertype is not listed, no connections are allowed from it.
export const allowedConnections = {
  [SuperNodeTypes.Connector]: [
    SuperNodeTypes.Connector,
    SuperNodeTypes.FlowThenElse,
    SuperNodeTypes.FlowThen,
  ],
  [SuperNodeTypes.FlowIf]: [SuperNodeTypes.Rule],
  [SuperNodeTypes.FlowThenElse]: [SuperNodeTypes.Action, SuperNodeTypes.FlowIf],
  [SuperNodeTypes.FlowThen]: [SuperNodeTypes.Action, SuperNodeTypes.FlowIf],
  [SuperNodeTypes.Trigger]: [SuperNodeTypes.FlowIf, SuperNodeTypes.FlowThen],
  [SuperNodeTypes.Action]: [],
  [SuperNodeTypes.Rule]: [
    SuperNodeTypes.Connector,
    SuperNodeTypes.FlowThenElse,
    SuperNodeTypes.FlowThen,
  ],
};

// Rules for node supertypes defined as keys in the map.
// First two records are max allowed connection counts per handle type in the node.
// Last two records are min numbers of connections required for a node to be valid.
export const connectionCounts = {
  [SuperNodeTypes.Connector]: { source: 1, target: 1, validIn: 2, validOut: 1 },
  [SuperNodeTypes.FlowIf]: { source: 1, target: 1, validIn: 1, validOut: 1 },
  [SuperNodeTypes.FlowThen]: { source: -1, target: 1, validIn: 1, validOut: 1 },
  [SuperNodeTypes.FlowThenElse]: {
    source: -1,
    target: 1,
    validIn: 1,
    validOut: 1,
  },
  [SuperNodeTypes.Trigger]: { source: 1, target: 0, validIn: 0, validOut: 1 },
  [SuperNodeTypes.Action]: { source: 0, target: 1, validIn: 1, validOut: 0 },
  [SuperNodeTypes.Rule]: { source: 1, target: 1, validIn: 0, validOut: 1 },
};
