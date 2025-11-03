export const getProfabilityColor = (value: number | null) =>
  value === null || value === 0
    ? 'text-foreground'
    : value >= 0
      ? 'text-[var(--green)]'
      : 'text-[var(--red)]';
