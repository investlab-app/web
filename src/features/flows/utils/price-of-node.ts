import type { CustomNodeTypes } from "../types/node-types-2";

export class PriceOfNodeProps {
    ticker: string;

    constructor() {
        this.ticker = "";
    }

    getUpdated(ticker: string): PriceOfNodeProps {
        this.ticker = ticker;
        return this;
    }

    isValid(inConnections: Record<string, number>, outConnections: Record<string, number>): boolean {
        for (const key in inConnections) {
            if (inConnections[key] < 1) return false;
        }
        return inConnections.length == 1 && this.ticker.trim().length > 0;
    }

     getAllowedConnections(handleType: 'source' | 'target', handleId: string):  number {
        return handleType == "target" ? 1 : 0;
    }

    getAllowedSupertypes(handleType: 'source' | 'target', handleId: string): Array<CustomNodeTypes> {
        return [];
    }


}