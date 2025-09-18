import { cn } from '@/features/shared/utils/styles';
import { hashCode } from '@/features/shared/utils/pseudo-crypto';

interface InstrumentIconCircleProps {
  icon: string | null;
  symbol: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-sm',
  md: 'h-10 w-10 text-lg',
  lg: 'h-16 w-16 text-4xl',
} as const;

export function InstrumentIconCircle({
  icon,
  symbol,
  name,
  size = 'md',
  className,
}: InstrumentIconCircleProps) {
  const sizeClass = sizeClasses[size];
  return icon ? (
    <img
      src={icon}
      alt=""
      className={cn([sizeClass, 'rounded-full border border-muted', className])}
    />
  ) : (
    <div
      className={cn([
        sizeClass,
        `rounded-full border border-muted flex items-center justify-center leading-none text-white`,
        className,
      ])}
      style={{
        backgroundColor: `hsl(${hashCode(symbol) % 360}, 60%, 50%)`,
      }}
    >
      {name.charAt(0)}
    </div>
  );
}
