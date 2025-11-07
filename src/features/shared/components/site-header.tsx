import { cn } from '../utils/styles';
import { LanguageToggle } from './language-toggle';
import { BreadcrumbNav } from './breadcrumb-nav';
import { MarketStatusLED } from './market-status-led';
// import { NotificationPanel } from '@/features/notifications';
import { Separator } from '@/features/shared/components/ui/separator';
import {
  SidebarTrigger,
  useSidebar,
} from '@/features/shared/components/ui/sidebar';
import { ThemeToggle } from '@/features/shared/components/mode-toggle';

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  const { isMobile, open } = useSidebar();

  return (
    <header
      className={cn(
        'fixed z-1 top-0 right-0 bg-background/50 backdrop-blur-md',
        className
      )}
      style={{
        left: isMobile
          ? open
            ? 'calc(-1 * var(--sidebar-width))'
            : 'calc(-1 * var(--sidebar-width-icon))'
          : '0px',
      }}
    >
      <div
        data-tauri-drag-region
        className="h-(--header-height) border-b flex shrink-0 items-center gap-2 px-4"
        style={{
          marginLeft: open
            ? 'var(--sidebar-width)'
            : 'var(--sidebar-width-icon)',
          transitionTimingFunction: 'var(--ease-out)',
          transitionDuration: '200ms',
          transitionProperty: 'margin',
        }}
      >
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <BreadcrumbNav />
        <div
          className="ml-auto flex items-center gap-2"
          data-tauri-drag-region-ignore
        >
          <MarketStatusLED />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          {/* <NotificationPanel /> */}
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
