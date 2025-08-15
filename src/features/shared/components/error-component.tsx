import * as React from 'react';
import {
  Bug,
  Copy,
  FileText,
  Home,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

type NiceErrorPageProps = {
  error: Error;
  onRetry?: () => void;
  homeHref?: string;
  reportUrl?: string; // e.g. mailto:... or issue tracker URL
  title?: string;
  subtitle?: string;
  className?: string;
};

export function NiceErrorPage(props: NiceErrorPageProps) {
  const {
    error,
    onRetry,
    homeHref = '/',
    reportUrl = `mailto:support@example.com?subject=${encodeURIComponent(
      'Bug report'
    )}&body=${encodeURIComponent(
      'Please describe what you were doing when the error occurred.'
    )}`,
    title = 'Something went wrong',
    subtitle = 'An unexpected error occurred. You can try again, or go home.',
    className,
  } = props;

  const [copied, setCopied] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(
    process.env.NODE_ENV !== 'production'
  );

  const ref = React.useMemo(() => {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const ts = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, '')
      .slice(0, 14);
    return `${ts}-${rand}`;
  }, []);

  React.useEffect(() => {
    // Useful for error boundaries to surface in DevTools

    console.error(error);
  }, [error]);

  const details = React.useMemo(() => {
    const lines = [
      `Ref: ${ref}`,
      `Name: ${error.name || 'Error'}`,
      `Message: ${error.message || '(no message)'}`,
      '',
      'Stack:',
      error.stack || '(no stack available)',
    ];
    return lines.join('\n');
  }, [error, ref]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }

  function handleRetry() {
    if (onRetry) {
      onRetry();
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  function handleHome() {
    if (typeof window !== 'undefined') {
      window.location.href = homeHref;
    }
  }

  return (
    <div
      className={[
        'relative min-h-screen w-full',
        'flex items-center justify-center p-6',
        'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]',
        'from-primary/10 via-background to-background',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Card className="w-full max-w-xl border-border/50 shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={[
                'inline-flex h-11 w-11 items-center justify-center rounded-full',
                'bg-primary/10 text-primary ring-1 ring-primary/20',
              ].join(' ')}
            >
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="mt-1">{subtitle}</CardDescription>
            </div>
            <Badge variant="secondary" className="shrink-0">
              Ref: {ref}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>{error.name || 'Error'}</AlertTitle>
            <AlertDescription className="mt-1">
              {error.message || 'Unknown error'}
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Need help? Report with the reference above.
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails((v) => !v)}
            >
              <FileText className="mr-2 h-4 w-4" />
              {showDetails ? 'Hide details' : 'Show details'}
            </Button>
          </div>

          {showDetails && (
            <div className="rounded-md border bg-muted/30 p-2">
              <ScrollArea className="h-48 w-full rounded-md">
                <pre className="whitespace-pre-wrap break-words p-3 text-xs">
                  {details}
                </pre>
              </ScrollArea>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-3 justify-end">
          <Button variant="outline" onClick={handleHome}>
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open(reportUrl, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <Bug className="mr-2 h-4 w-4" />
            Report
          </Button>
          <Button variant="secondary" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? 'Copied' : 'Copy details'}
          </Button>
          <Button onClick={handleRetry}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

/*
Usage:

// As a simple page
export default function Page() {
  const error = new Error("Example failure");
  return <NiceErrorPage error={error} />;
}

// In an error boundary (React 18)
function ErrorFallback({ error, resetErrorBoundary }) {
  return <NiceErrorPage error={error} onRetry={resetErrorBoundary} />;
}

Note:
- Requires shadcn/ui components: button, card, alert, scroll-area, badge.
- Icons from lucide-react.
*/
