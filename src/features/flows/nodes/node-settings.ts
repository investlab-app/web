import type { SuperNodeTypes } from '../types/node-types-2';

export abstract class NodeSettings {
  abstract isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean;

  abstract getAllowedConnections(
    handleType: 'source' | 'target',
    handleId: string
  ): number;

  abstract getAllowedSupertypes(handleId: string): Array<SuperNodeTypes>;

  abstract getSupertype(): SuperNodeTypes;
}
