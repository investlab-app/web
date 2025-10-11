import { SuperNodeTypes } from '../types/node-types';

export const allowedConnections = {
  [SuperNodeTypes.Trigger]: [SuperNodeTypes.Rule],
  [SuperNodeTypes.Connector]: [SuperNodeTypes.Action, SuperNodeTypes.Connector],
  [SuperNodeTypes.Action]: [],
  [SuperNodeTypes.Rule]: [SuperNodeTypes.Connector, SuperNodeTypes.Action],
};

export const handleConnectionCount = {
  [SuperNodeTypes.Trigger]: { source: 1, target: 0 },
  [SuperNodeTypes.Connector]: { source: 1, target: 1 },
  [SuperNodeTypes.Action]: { source: 0, target: 1 },
  [SuperNodeTypes.Rule]: { source: 1, target: 1 },
};
