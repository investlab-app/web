export function getDerivedPrimaryColor(level: number): string {
  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .trim();

  const match = primary.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);

  if (!match) {
    console.warn('Invalid --primary format:', primary);
    return '';
  }

  const [, lStr, cStr, hStr] = match;
  const l = parseFloat(lStr);
  const c = parseFloat(cStr);
  const h = parseFloat(hStr);

  const clamped = Math.min(Math.max(level, 0), 5);

  const newL = (l * (1 - clamped * 0.2)).toFixed(3);
  const newC = (c * (1 - clamped * 0.1)).toFixed(3);
  console.log(`oklch(${newL},${c},${h})`);

  return `oklch(${newL} ${newC} ${h})`;
}
