import { Skeleton } from '@/features/shared/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/features/shared/components/ui/card';
import AppFrame from '@/features/shared/components/app-frame';

export function InstrumentDetailPending() {
  return (
    <AppFrame>
      <div className="flex flex-col gap-4">
        {/* Instrument Header */}
        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-shrink-0">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex gap-2 flex-col items-start sm:gap-4 sm:flex-row">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row flex-wrap gap-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Stock Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                <Skeleton className="h-6 w-20" />
              </CardTitle>
              <CardAction>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </CardAction>
            </div>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="h-96">
            <div className="h-full w-full flex flex-col">
              <div className="flex-1 relative">
                <div className="ml-8 mb-3 mt-1 h-full flex flex-col">
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-px w-full" />
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 top-0">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,90 L3,85 L6,83 L9,80 L12,75 L15,79 L18,67 L21,60 L24,58 L27,51 L30,48 L33,40 L36,39 L39,43 L42,48 L45,45 L48,40 L51,37 L54,38 L57,30 L60,25 L63,23 L66,18 L69,13 L72,18 L75,15 L78,18 L81,34 L84,45 L87,52 L90,55 L93,58 L96,68 L100,75 L100,100 L0,100 Z"
                          className="animate-pulse fill-foreground/50"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders and Transactions Sections */}
        <div className="flex gap-4 flex-col 2xl:flex-row">
          {/* Orders Section */}
          <Card className="2xl:flex-1">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transactions History Section */}
          <Card className="2xl:flex-2">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-20" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex gap-4 items-start">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppFrame>
  );
}