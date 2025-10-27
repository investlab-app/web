/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeSettings } from '../node-settings';
import { SuperNodeTypes } from '../../types/node-types-2';

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
    return inConnections.length == 1 && outConnections.length == 2;
  }

  override getAllowedConnections(
    handleType: 'source' | 'target',
    handleId: string
  ): number {
    return handleType == 'target' ? 1 : 0;
  }

  override getAllowedSupertypes(handleId: string): Array<SuperNodeTypes> {
    return [];
  }

  override getSupertype(): SuperNodeTypes {
    return SuperNodeTypes.LogicOperator;
  }
}
