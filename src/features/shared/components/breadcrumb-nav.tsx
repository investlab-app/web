import { Link, isMatch, useMatches } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';
import { cn } from '../utils/styles';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export function BreadcrumbNav() {
  const matches = useMatches();
  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, 'loaderData.crumb')
  );

  const items = matchesWithCrumbs.map(({ pathname, loaderData }) => {
    return {
      href: pathname,
      label: loaderData?.crumb,
    };
  });

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={index}>
              <BreadcrumbItem
                className={cn(
                  'shrink-0',
                  isLast && 'max-w-[200px] sm:max-w-xs min-w-0 shrink'
                )}
              >
                <Link
                  to={item.href}
                  className={cn('breadcrumb-link', isLast && 'truncate block')}
                >
                  {item.label}
                </Link>
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
