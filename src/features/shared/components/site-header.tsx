import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Minus, Square, X } from 'lucide-react';
import { cn } from '../utils/styles';
import { LanguageToggle } from './language-toggle';
import { BreadcrumbNav } from './breadcrumb-nav';
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
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const checkMaximized = async () => {
      try {
        const maximized = await invoke<boolean>('is_maximized');
        setIsMaximized(maximized);
      } catch (error) {
        console.error('Failed to check maximized state:', error);
      }
    };

    checkMaximized();
  }, []);

  const handleMinimize = async () => {
    try {
      await invoke('minimize_window');
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  };

  const handleMaximize = async () => {
    try {
      await invoke('maximize_window');
      setIsMaximized(!isMaximized);
    } catch (error) {
      console.error('Failed to maximize window:', error);
    }
  };

  const handleClose = async () => {
    try {
      await invoke('close_window');
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

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
          <LanguageToggle />
          <ThemeToggle />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <button
            onClick={handleMinimize}
            className={cn(
              'p-1.5 rounded hover:bg-accent transition-colors',
              'flex items-center justify-center'
            )}
            aria-label="Minimize window"
          >
            <Minus size={16} className="text-foreground" />
          </button>

          <button
            onClick={handleMaximize}
            className={cn(
              'p-1.5 rounded hover:bg-accent transition-colors',
              'flex items-center justify-center'
            )}
            aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
          >
            <Square size={16} className="text-foreground" />
          </button>

          <button
            onClick={handleClose}
            className={cn(
              'p-1.5 rounded hover:bg-destructive hover:text-destructive-foreground transition-colors',
              'flex items-center justify-center'
            )}
            aria-label="Close window"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
