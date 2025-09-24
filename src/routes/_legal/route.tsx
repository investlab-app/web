import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';
import { ThemeToggle } from '@/features/shared/components/mode-toggle';
import { LanguageToggle } from '@/features/shared/components/language-toggle';

export const Route = createFileRoute('/_legal')({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <div className="px-4 mx-auto max-w-4xl mb-16">
        <header className="flex justify-between items-center h-16 mb-8">
          <Link to="/" className="flex items-center gap-4">
            <InvestLabLogo width={32} height={32} className="!size-8" />
            <span className="text-xl font-bold">InvestLab</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="flex space-x-6">
              <Link
                to="/privacy-policy"
                className={`text-sm hover:text-foreground transition-colors ${
                  location.pathname === '/privacy-policy'
                    ? 'font-bold text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {t('common.privacy_policy')}
              </Link>
              <Link
                to="/terms-of-service"
                className={`text-sm hover:text-foreground transition-colors ${
                  location.pathname === '/terms-of-service'
                    ? 'font-bold text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {t('common.terms_of_service')}
              </Link>
              <Link
                to="/faq"
                className={`text-sm hover:text-foreground transition-colors ${
                  location.pathname === '/faq'
                    ? 'font-bold text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {t('common.faq')}
              </Link>
            </nav>
            <div className="h-6 mx-4 w-px bg-border" />
            <div className="flex items-center gap-3 text-muted-foreground">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
