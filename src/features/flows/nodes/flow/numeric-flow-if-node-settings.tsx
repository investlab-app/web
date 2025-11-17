/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeSettings } from '../node-settings';
import { SuperNodeTypes } from '../../types/node-types';
import { NumericFlowIfNodeUI } from './numeric-flow-if-node-ui';
import type { CustomNodeTypes } from '../../types/node-types';
import type { Node, NodeProps } from '@xyflow/react';

export class NumericFlowIfNodeSettings extends NodeSettings {
  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      'out' in inConnections &&
      Object.keys(outConnections).length >= 2 &&
      'inIf' in outConnections &&
      'inThen' in outConnections
    );
  }

  override getAllowedConnections(
    _handleType: 'source' | 'target',
    _handleId: string
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

export type NumericFlowNode = Node<
  { settings: NumericFlowIfNodeSettings },
  typeof CustomNodeTypes.NumbericFlowIf
>;

export const NumericFlowNode = (props: NodeProps<NumericFlowNode>) => {
  return <NumericFlowIfNodeUI nodeId={props.id} />;
};
