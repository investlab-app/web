/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeSettings } from '../node-settings';
import { SuperNodeTypes } from '../../types/node-types-2';

export class TriggerNodeSettings extends NodeSettings {
  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    for (const key in inConnections) {
      if (outConnections[key] != 1) return false;
    }
    return Object.keys(outConnections).length == 1;
  }

  override getAllowedConnections(
    handleType: 'source' | 'target',
    handleId: string
  ): number {
    return handleType == 'source' ? 1 : 0;
  }

  override getAllowedSupertypes(handleId: string): Array<SuperNodeTypes> {
    return [SuperNodeTypes.Flow, SuperNodeTypes.Action];
  }

  override getSupertype(): SuperNodeTypes {
    return SuperNodeTypes.Trigger;
  }
}
