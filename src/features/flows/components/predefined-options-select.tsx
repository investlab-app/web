import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/shared/components/ui/select';
import { cn } from '@/features/shared/utils/styles';

interface PredefinedOptionsSelectProps<T extends string> {
  value?: T;
  onChange?: (value: T) => void;
  options: ReadonlyArray<{ readonly value: T; readonly labelKey: string }>;
  className?: string;
}

export function PredefinedOptionsSelect<T extends string>({
  value,
  onChange,
  options,
  className = 'px-2 py-1 border rounded',
}: PredefinedOptionsSelectProps<T>) {
  const { t } = useTranslation();

  return (
   <Select
                value={value}
                onValueChange={(v) =>
                  onChange?.(v as T)
                }
              >
                <SelectTrigger className={cn(className, 'min-w-[100px]')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))} 
                </SelectContent>
              </Select>
  );
}
