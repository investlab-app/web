/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeSettings } from '../node-settings';
import { SuperNodeTypes } from '../../types/node-types';

export class LogicOperatorNodeSettings extends NodeSettings {
  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    for (const key in inConnections) {
      if (inConnections[key] != 1) return false;
    }
    for (const key in outConnections) {
      if (outConnections[key] != 1) return false;
    }
    return (
      Object.keys(inConnections).length == 1 &&
      Object.keys(outConnections).length == 2
    );
  }

  override getAllowedConnections(
    _handleType: 'source' | 'target',
    _handleId: string
  ): number {
    return 1;
  }

  override getAllowedSupertypes(_handleId: string): Array<SuperNodeTypes> {
    return [SuperNodeTypes.LogicOperator, SuperNodeTypes.Predicate];
  }

  override getSupertype(): SuperNodeTypes {
    return SuperNodeTypes.LogicOperator;
  }
}
