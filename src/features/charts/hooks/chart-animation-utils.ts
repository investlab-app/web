export const ANIMATION_CONFIG = {
  expandDurationMs: 800,
  centerDotSize: 6,
  discs: [
    { maxGrow: 30, opacityFactor: 1.2 },
    { maxGrow: 22, opacityFactor: 0.9 },
    { maxGrow: 14, opacityFactor: 0.6 },
  ],
} as const;

export function hexOpacityToHexAlpha(opacity: number): string {
  return Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
}

export function extractYValue(value: number | [number, number, number, number]): number {
  return typeof value === 'number'
    ? value
    : Array.isArray(value)
      ? value[1] || value[0]
      : (undefined as unknown as number);
}