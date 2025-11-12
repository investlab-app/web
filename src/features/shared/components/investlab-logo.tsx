import { cn } from '../utils/styles';

interface InvestLabLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function InvestLabLogo({
  className,
  width = 20,
  height = 20,
}: InvestLabLogoProps) {
  return (
    <div
      role="img"
      area-label="InvestLab Logo - Financial Analytics Platform"
      className={cn(
        'bg-foreground mask-[url(/favicon.svg)] mask-no-repeat mask-center mask-contain',
        className
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}
