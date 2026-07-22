import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface PageHeaderBreadcrumb {
  label: string;
  href?: LinkProps['href'];
}

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: readonly PageHeaderBreadcrumb[];
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('w-full', className)}>
      {breadcrumbs?.length ? (
        <nav aria-label="Migas de pan" className="mb-activa-12">
          <ol className="flex flex-wrap items-center gap-activa-8 text-sm text-text-secondary">
            {breadcrumbs.map((breadcrumb, index) => {
              const current = index === breadcrumbs.length - 1;
              return (
                <li key={`${String(breadcrumb.href)}-${breadcrumb.label}`} className="flex items-center gap-activa-8">
                  {breadcrumb.href && !current ? (
                    <Link
                      href={breadcrumb.href}
                      className="rounded-activa-xs hover:text-text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                      {breadcrumb.label}
                    </Link>
                  ) : (
                    <span aria-current={current ? 'page' : undefined} className={current ? 'font-semibold text-text-primary' : undefined}>
                      {breadcrumb.label}
                    </span>
                  )}
                  {!current ? <span aria-hidden="true">/</span> : null}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      <div className="flex flex-col gap-activa-20 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-3xl">
          {eyebrow ? <p className="mb-activa-8 text-xs font-semibold uppercase tracking-widest text-text-link">{eyebrow}</p> : null}
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">{title}</h1>
          {description ? <p className="mt-activa-8 text-base text-text-secondary">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-activa-8">{actions}</div> : null}
      </div>
    </header>
  );
}
