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
