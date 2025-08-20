import { Link, isMatch, useMatches } from '@tanstack/react-router';
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

  const items =
    matchesWithCrumbs.length < 2
      ? []
      : matchesWithCrumbs.map(({ pathname, loaderData }) => {
          return {
            href: pathname,
            label: loaderData?.crumb,
          };
        });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index} className="fg-">
            <Link to={item.href} className="breadcrumb-link">
              {item.label}
            </Link>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
