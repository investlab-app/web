import { useTranslation } from 'react-i18next';
import type { ChangeEvent } from 'react';

interface EnumSelectProps<T extends string> {
  value?: T;
  onChange?: (value: T) => void;
  options: ReadonlyArray<{ readonly value: T; readonly labelKey: string }>;
  className?: string;
}

export function EnumSelect<T extends string>({
  value,
  onChange,
  options,
  className = 'px-2 py-1 border rounded',
}: EnumSelectProps<T>) {
  const { t } = useTranslation();

  return (
    <select
      className={className}
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onChange?.(e.target.value as T)
      }
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {t(option.labelKey)}
        </option>
      ))}
    </select>
  );
}
