export function getDerivedPrimaryColor(level: number): string {
  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .trim();

  // Accepts both oklch(0.54 .281 293.009) and oklch(54.1% .281 293.009)
  const match = primary.match(
    /oklch\(\s*([\d.]+)(%)?\s+([\d.]+)\s+([\d.]+)\s*\)/
  );

  if (!match) {
    console.warn('Invalid --primary format:', primary);
    return '';
  }

  const [, lStr, percent, cStr, hStr] = match;
  let l = parseFloat(lStr);
  if (percent) {
    // Convert percentage to 0-1 scale
    l = l / 100;
  }
  const c = parseFloat(cStr);
  const h = parseFloat(hStr);

  const clamped = Math.min(Math.max(level, 0), 5);

  const newL = (l * (1 - clamped * 0.2)).toFixed(3);
  const newC = (c * (1 - clamped * 0.1)).toFixed(3);

  return `oklch(${newL} ${newC} ${h})`;
}
