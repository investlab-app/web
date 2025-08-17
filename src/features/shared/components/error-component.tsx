import * as React from 'react';
import { FileText, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/features/shared/components/ui/alert';
import { ScrollArea } from '@/features/shared/components/ui/scroll-area';
import { IS_PROD } from '@/features/shared/utils/constants';

type ErrorComponentProps = {
  error: Error;
};

export function ErrorComponent({ error }: ErrorComponentProps) {
  const { t } = useTranslation();
  const title = t('common.something_went_wrong');
  const subtitle = t('common.unexpected_error_try_again_or_home');

  const [showDetails, setShowDetails] = React.useState(!IS_PROD);

  const details = React.useMemo(() => {
    const lines = [
      `Name: ${error.name || 'Error'}`,
      `Message: ${error.message || '(no message)'}`,
      '',
      'Stack:',
      error.stack || '(no stack available)',
    ];
    return lines.join('\n');
  }, [error]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Card className="w-full max-w-xl border-border/50 shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="mt-1">{subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>{error.name || t('common.error')}</AlertTitle>
            <AlertDescription className="mt-1">
              {error.message || t('common.unknown_error')}
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails((v) => !v)}
            >
              <FileText className="mr-2 h-4 w-4" />
              {showDetails
                ? t('common.hide_details')
                : t('common.show_details')}
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
      </Card>
    </div>
  );
}
