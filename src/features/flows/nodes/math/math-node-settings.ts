/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeSettings } from '../node-settings';
import { SuperNodeTypes } from '../../types/node-types-2';

export class NumberNodeSettings extends NodeSettings {
  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      'out' in inConnections &&
      inConnections['out'] == 1 &&
      outConnections.length == 2
    );
  }

  override getAllowedConnections(
    handleType: 'source' | 'target',
    handleId: string
  ): number {
    return 1;
  }

  override getAllowedSupertypes(handleId: string): Array<SuperNodeTypes> {
    return [
      SuperNodeTypes.Math,
      SuperNodeTypes.Number,
      SuperNodeTypes.NumericFlow,
    ];
  }

  override getSupertype(): SuperNodeTypes {
    return SuperNodeTypes.Math;
  }
}
