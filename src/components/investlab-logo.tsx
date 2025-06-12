interface InvestLabLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function InvestLabLogo({
  className = '!size-5',
  width = 20,
  height = 20,
}: InvestLabLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 32"
      className={className}
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1f2937' }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" fill="url(#grad)" rx="4" />
      <rect x="4" y="24" width="4" height="8" fill="#10b981" rx="0.96" />
      <rect x="10" y="20" width="4" height="12" fill="#10b981" rx="0.96" />
      <rect x="16" y="16" width="4" height="16" fill="#10b981" rx="0.96" />
      <rect x="22" y="12" width="4" height="20" fill="#10b981" rx="0.96" />
      <path
        d="M 6 28 L 12 26 L 18 24 L 24 22"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 22 24 L 24 22 L 26 24"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
