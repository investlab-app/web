export function toDate(input: Date | string | number): Date {
  if (input instanceof Date) return new Date(input.getTime());

  const d = new Date(input);

  if (Number.isNaN(d.getTime())) {
    throw new TypeError(
      `Invalid date input: ${String(input)} (cannot construct a valid Date)`
    );
  }

  return d;
}

export function dateToLocale(
  input: Date | string | number,
  locale: string
): string {
  const date = toDate(input);
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function roundDateToInterval(date: Date, interval: number): Date {
  return new Date(Math.floor(date.getTime() / interval) * interval);
}
