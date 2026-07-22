'use client';

import Link, { type LinkProps } from 'next/link';
import type { MouseEventHandler, ReactNode } from 'react';

import { ActivaIcon, type ActivaIconName } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface NavigationItemProps {
  href: LinkProps['href'];
  label: string;
  icon?: ActivaIconName;
  active?: boolean;
  disabled?: boolean;
  badge?: ReactNode;
  collapsed?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}

const baseClasses =
  'relative flex min-h-11 items-center gap-activa-12 rounded-activa-sm border border-transparent px-activa-12 py-activa-8 text-sm font-semibold transition-colors duration-fast ease-activa';

export function NavigationItem({
  href,
  label,
  icon,
  active = false,
  disabled = false,
  badge,
  collapsed = false,
  onClick,
  className,
}: NavigationItemProps) {
  const content = (
    <>
      {icon ? <ActivaIcon name={icon} size={20} className="shrink-0" /> : null}
      <span className={collapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'}>{label}</span>
      {!collapsed && badge ? <span className="shrink-0">{badge}</span> : null}
      {collapsed && badge ? (
        <span aria-hidden="true" className="absolute right-1 top-1 size-2 rounded-activa-full bg-status-information" />
      ) : null}
    </>
  );
  const stateClasses = active
    ? 'border-l-4 border-l-action-primary bg-action-primary/15 text-text-primary shadow-activa-xs'
    : 'text-text-secondary hover:bg-background-surface-muted hover:text-text-primary';

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        title={collapsed ? label : undefined}
        className={cn(baseClasses, 'cursor-not-allowed opacity-50', collapsed && 'justify-center px-activa-8', className)}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        baseClasses,
        stateClasses,
        collapsed && 'justify-center px-activa-8',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
        className,
      )}
    >
      {content}
    </Link>
  );
}
