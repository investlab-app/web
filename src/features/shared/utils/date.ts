export function dateToLocale(date: Date, locale: string) {
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDate(date: Date): string {
  return date.toISOString().split('.')[0];
}
