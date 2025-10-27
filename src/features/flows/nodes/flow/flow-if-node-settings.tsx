import { NodeSettings } from '../node-settings';
import { SuperNodeTypes } from '../../types/node-types-2';

export class FlowIfNodeSettings extends NodeSettings {
  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      'out' in inConnections &&
      inConnections['out'] == 1 &&
      outConnections.length >= 2 &&
      'inIf' in outConnections &&
      'inThen' in outConnections &&
      outConnections['inIf'] == 1 &&
      outConnections['inThen'] >= 1
    );
  }

  override getAllowedConnections(
    handleType: 'source' | 'target',
    handleId: string
  ): number {
    if (handleType == 'target') return 1;
    if (handleId == 'inIf') return 1;
    return -1;
  }

  override getAllowedSupertypes(handleId: string): Array<SuperNodeTypes> {
    if (handleId == 'inIf')
      return [SuperNodeTypes.LogicOperator, SuperNodeTypes.Predicate];
    return [SuperNodeTypes.Flow, SuperNodeTypes.Action];
  }

  override getSupertype(): SuperNodeTypes {
    return SuperNodeTypes.Flow;
  }
}
