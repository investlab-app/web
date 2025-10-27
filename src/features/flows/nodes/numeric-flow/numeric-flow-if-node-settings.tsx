/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeSettings } from '../node-settings';
import { SuperNodeTypes } from '../../types/node-types-2';

export class NumericFlowIfNodeSettings extends NodeSettings {
  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      'out' in inConnections &&
      outConnections.length >= 2 &&
      'inIf' in outConnections &&
      'inThen' in outConnections
    );
  }

  override getAllowedConnections(
    handleType: 'source' | 'target',
    handleId: string
  ): number {
    return 1;
  }

  override getAllowedSupertypes(handleId: string): Array<SuperNodeTypes> {
    if (handleId == 'inIf')
      return [SuperNodeTypes.LogicOperator, SuperNodeTypes.Predicate];
    return [
      SuperNodeTypes.Number,
      SuperNodeTypes.NumericFlow,
      SuperNodeTypes.Math,
    ];
  }

  override getSupertype(): SuperNodeTypes {
    return SuperNodeTypes.NumericFlow;
  }
}
