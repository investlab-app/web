import { SuperNodeTypes } from '../types/node-types';

export const allowedConnections = {
  [SuperNodeTypes.Connector]: [
    SuperNodeTypes.Connector,
    SuperNodeTypes.FlowThenElse,
  ],
  [SuperNodeTypes.FlowIf]: [SuperNodeTypes.Rule],
  [SuperNodeTypes.FlowThenElse]: [SuperNodeTypes.Action, SuperNodeTypes.FlowIf],
  [SuperNodeTypes.FlowThen]: [SuperNodeTypes.Action],
  [SuperNodeTypes.Trigger]: [SuperNodeTypes.FlowIf, SuperNodeTypes.FlowThen],
  [SuperNodeTypes.Action]: [],
  [SuperNodeTypes.Rule]: [
    SuperNodeTypes.Connector,
    SuperNodeTypes.FlowThenElse,
  ],
};

export const handleConnectionCount = {
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
