export const toFixedLocalized = (
  val: number,
  locale: string,
  precision: number = 2,
  currency: string = 'USD'
) => {
  return val.toLocaleString(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    style: 'currency',
    currency,
  });
};

/**
 * Format large numbers with language-specific suffixes (K, M, B, T)
 * Uses toLocaleString for proper number formatting based on locale
 * @param value - The number to format
 * @param locale - The locale string (e.g., 'en-US', 'pl-PL')
 * @param precision - Number of decimal places to show (default: 1)
 * @returns Formatted string with suffix (e.g., '1.5M', '2.3B')
 */
export const formatNumberWithSuffix = (
  value: number,
  locale: string,
  precision: number = 1
): string => {
  // Handle null, undefined, zero, and small numbers
  if (!value || value === 0 || Math.abs(value) < 1000) {
    return value.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // Define suffixes for different scales
  const suffixes = [
    { threshold: 1e12, suffix: 'T' }, // Trillion
    { threshold: 1e9, suffix: 'B' }, // Billion
    { threshold: 1e6, suffix: 'M' }, // Million
    { threshold: 1e3, suffix: 'K' }, // Thousand
  ];

  for (const { threshold, suffix } of suffixes) {
    if (Math.abs(value) >= threshold) {
      const scaled = value / threshold;
      const formatted = scaled.toLocaleString(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
      return `${formatted}${suffix}`;
    }
  }

  // Fallback for very small numbers
  return value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
