import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './language-toggle';
import { Separator } from '@/features/shared/components/ui/separator';
import { SidebarTrigger } from '@/features/shared/components/ui/sidebar';
import { ThemeToggle } from '@/features/shared/components/mode-toggle';

export function SiteHeader() {
  const { t } = useTranslation();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{t('common.app_name')}</h1>
        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
