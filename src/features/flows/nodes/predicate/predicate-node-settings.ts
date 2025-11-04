/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeSettings } from '../node-settings';
import { SuperNodeTypes } from '../../types/node-types';

export class PredicateNodeSettings extends NodeSettings {
  inX?: number;

  constructor() {
    super();
  }

  getUpdatedValue(value?: number): PredicateNodeSettings {
    this.inX = value;
    return this;
  }

  override isValid(
    inConnections: Record<string, number>,
    outConnections: Record<string, number>
  ): boolean {
    return (
      Object.keys(inConnections).length == 1 &&
      (Object.keys(outConnections).length == 2 ||
        ('inValue' in outConnections && this.inX != undefined))
    );
  }

  override getAllowedConnections(
    _handleType: 'source' | 'target',
    _handleId: string
  ): number {
    return 1;
  }

  override getAllowedSupertypes(_handleId: string): Array<SuperNodeTypes> {
    return [
      SuperNodeTypes.Number,
      SuperNodeTypes.NumericFlow,
      SuperNodeTypes.Math,
    ];
  }

  override getSupertype(): SuperNodeTypes {
    return SuperNodeTypes.Predicate;
  }
}
