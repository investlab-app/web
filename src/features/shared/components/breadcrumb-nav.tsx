import { Link, isMatch, useMatches } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';
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
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem className="fg-">
              <Link to={item.href} className="breadcrumb-link">
                {item.label}
              </Link>
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
