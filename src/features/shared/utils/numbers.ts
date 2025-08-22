export const toFixedLocalized = (
  val: number,
  locale: string,
  precision: number = 2
) => {
  return val.toLocaleString(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
};
