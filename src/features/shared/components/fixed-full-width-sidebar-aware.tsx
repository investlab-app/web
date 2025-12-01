import { cn } from '../utils/styles';

export function FixedFullWidthSidebarAware({
  children,
  className,
  open,
  isMobile,
}: React.PropsWithChildren<{
  className?: string;
  isMobile: boolean;
  open: boolean;
}>) {
  return (
    <div
      className={cn('fixed left-0 right-0', className)}
      style={{
        left: isMobile
          ? open
            ? 'calc(-1 * var(--sidebar-width))'
            : 'calc(-1 * var(--sidebar-width-icon))'
          : '0px',
      }}
    >
      <div
        style={{
          marginLeft: open
            ? 'var(--sidebar-width)'
            : 'var(--sidebar-width-icon)',
          transitionTimingFunction: 'var(--ease-out)',
          transitionDuration: '200ms',
          transitionProperty: 'margin',
        }}
      >
        {children}
      </div>
    </div>
  );
}
