import { PanelLeftIcon } from 'lucide-react';
import { cn } from '../utils/styles';
import { LanguageToggle } from './language-toggle';
import { BreadcrumbNav } from './breadcrumb-nav';
import { MarketStatusLED } from './market-status-led';
import { FixedFullWidthSidebarAware } from './fixed-full-width-sidebar-aware';
import { NotificationPanel } from '@/features/notifications/components/notification-panel';
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
    <FixedFullWidthSidebarAware
      isMobile={isMobile}
      open={open}
      className={cn('z-1 top-0 bg-background/50 backdrop-blur-md', className)}
    >
      <header className="h-(--header-height) border-b flex shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 text-foreground">
          <PanelLeftIcon />
          <span className="sr-only">Toggle Sidebar</span>
        </SidebarTrigger>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="min-w-0">
          <BreadcrumbNav />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <MarketStatusLED />
          <Separator
            orientation="vertical"
            className="ml-1 data-[orientation=vertical]:h-4"
          />
          <NotificationPanel />
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>
    </FixedFullWidthSidebarAware>
  );
}
