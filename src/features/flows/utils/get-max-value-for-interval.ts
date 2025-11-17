export const getMaxValue = (unit: 'day' | 'hour' | 'month' | 'week') => {
  switch (unit) {
    case 'hour':
      return 24;
    case 'day':
      return 99;
    case 'week':
      return 42;
    case 'month':
      return 36;
    default:
      return 99;
  }
};
