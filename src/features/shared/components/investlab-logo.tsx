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
    <img
      src="/favicon.svg"
      alt="InvestLab Logo - Financial Analytics Platform"
      width={width}
      height={height}
      className={className}
      role="img"
    />
  );
}
