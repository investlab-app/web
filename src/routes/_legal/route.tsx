import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router';
import { InvestLabLogo } from '@/features/shared/components/investlab-logo';

export const Route = createFileRoute('/_legal')({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <div className="px-4 mx-auto max-w-4xl mb-16">
        <header className="flex justify-between items-center h-16 mb-8">
          <Link to="/" className="flex items-center gap-4">
            <InvestLabLogo width={32} height={32} className="!size-8" />
            <span className="text-xl font-bold">InvestLab</span>
          </Link>
          <nav className="flex space-x-6">
            <Link
              to="/privacy-policy"
              className={`text-sm hover:text-foreground transition-colors ${
                location.pathname === '/privacy-policy'
                  ? 'font-bold text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className={`text-sm hover:text-foreground transition-colors ${
                location.pathname === '/terms-of-service'
                  ? 'font-bold text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Terms of Service
            </Link>
            <Link
              to="/faq"
              className={`text-sm hover:text-foreground transition-colors ${
                location.pathname === '/faq'
                  ? 'font-bold text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              FAQ
            </Link>
          </nav>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
