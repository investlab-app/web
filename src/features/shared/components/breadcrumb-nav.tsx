import { Link, isMatch, useMatches } from '@tanstack/react-router';
import {
  Fragment,
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cn } from '../utils/styles';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Skeleton } from './ui/skeleton';
import type { ReactNode } from 'react';

export interface BreadcrumbItemConfig {
  href: string;
  label: string;
  loading?: boolean;
}

type BreadcrumbCustomizer = (
  items: Array<BreadcrumbItemConfig>
) => Array<BreadcrumbItemConfig>;

interface BreadcrumbContextValue {
  customizer?: BreadcrumbCustomizer;
  setCustomizer: (customizer: BreadcrumbCustomizer | undefined) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [customizer, setCustomizer] = useState<
    BreadcrumbCustomizer | undefined
  >();

  const updateCustomizer = (
    newCustomizer: BreadcrumbCustomizer | undefined
  ) => {
    setCustomizer(() => newCustomizer);
  };

  return (
    <BreadcrumbContext.Provider
      value={{ customizer, setCustomizer: updateCustomizer }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbCustomizer(
  customizer: BreadcrumbCustomizer,
  deps: React.DependencyList = []
) {
  const context = use(BreadcrumbContext);

  if (!context) {
    throw new Error(
      'useBreadcrumbCustomizer must be used within BreadcrumbProvider'
    );
  }

  useEffect(() => {
    context.setCustomizer(customizer);
    return () => {
      context.setCustomizer(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function BreadcrumbNav() {
  const matches = useMatches();
  const context = useContext(BreadcrumbContext);

  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, 'loaderData.crumb')
  );

  let items: Array<BreadcrumbItemConfig> = matchesWithCrumbs.map(
    ({ pathname, loaderData }) => ({
      href: pathname,
      label: loaderData?.crumb,
      loading: loaderData?.crumbLoading,
    })
  );

  if (context?.customizer) {
    items = context.customizer(items);
  }

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={index}>
              <BreadcrumbItem className={cn(isLast && 'min-w-0 shrink')}>
                <Link
                  to={item.href}
                  className={cn('breadcrumb-link', isLast && 'truncate block')}
                >
                  {item.loading ? (
                    <Skeleton className="h-3 w-20" />
                  ) : (
                    <span>{item.label}</span>
                  )}
                </Link>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
