export const withCurrency = (
  val: number,
  locale: string,
  precision: number = 2,
  currency: string = 'USD'
) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (val === undefined || val === null) {
    console.warn('withCurrency called with undefined or null value');
    return '';
  }
  return val.toLocaleString(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    style: 'currency',
    currency,
  });
};

// Decode HTML entities (&nbsp;) to regular spaces so text can wrap naturally
export const decodeHtmlEntities = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value.replace(/\s+/g, ' ');
};
