import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';
import { ThemeToggle } from '@/features/shared/components/mode-toggle';
import { LanguageToggle } from '@/features/shared/components/language-toggle';
import { Button } from '@/features/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/features/shared/components/ui/sheet';
import { cn } from '@/features/shared/utils/styles';

export const Route = createFileRoute('/_legal')({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/privacy-policy', label: t('common.privacy_policy') },
    { to: '/terms-of-service', label: t('common.terms_of_service') },
    { to: '/faq', label: t('common.faq') },
  ];

  return (
    <div className="min-h-screen">
      <div className="px-4 mx-auto max-w-4xl mb-16">
        <header className="flex justify-between items-center h-16 mb-8">
          <Link to="/" className="flex items-center gap-4">
            <InvestLabLogo width={32} height={32} className="!size-8" />
            <span className="text-xl font-bold">InvestLab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <nav className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm hover:text-foreground transition-colors ${
                    location.pathname === link.to
                      ? 'font-bold text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="h-6 mx-4 w-px bg-border" />
            <div className="flex items-center gap-3 text-muted-foreground">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className="">
                  <SheetTitle>{t('common.navigation')}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 px-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'text-base hover:text-foreground transition-colors',
                        location.pathname === link.to
                          ? 'font-bold text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
