/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeSettings } from '../node-settings';
import { SuperNodeTypes } from '../../types/node-types-2';

export class ActionNodeSettings extends NodeSettings {
  override isValid(
    inConnections: Record<string, number>,
    _outConnections: Record<string, number>
  ): boolean {
    for (const key in inConnections) {
      if (inConnections[key] != 1) return false;
    }
    return Object.keys(inConnections).length == 1;
  }

  override getAllowedConnections(
    handleType: 'source' | 'target',
    _handleId: string
  ): number {
    return handleType == 'target' ? 1 : 0;
  }

  override getAllowedSupertypes(_handleId: string): Array<SuperNodeTypes> {
    return [];
  }

  override getSupertype(): SuperNodeTypes {
    return SuperNodeTypes.Action;
  }
}
