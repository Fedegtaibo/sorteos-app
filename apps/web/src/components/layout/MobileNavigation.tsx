'use client';

import Link, { type LinkProps } from 'next/link';
import type { MouseEventHandler } from 'react';

import { ActivaIcon, type ActivaIconName } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface MobileNavigationItem {
  href: LinkProps['href'];
  label: string;
  icon: ActivaIconName;
  active?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export type MobileNavigationItems =
  | readonly [MobileNavigationItem, MobileNavigationItem, MobileNavigationItem]
  | readonly [MobileNavigationItem, MobileNavigationItem, MobileNavigationItem, MobileNavigationItem]
  | readonly [
      MobileNavigationItem,
      MobileNavigationItem,
      MobileNavigationItem,
      MobileNavigationItem,
      MobileNavigationItem,
    ];

export interface MobileNavigationProps {
  items: MobileNavigationItems;
  className?: string;
}

export function MobileNavigation({ items, className }: MobileNavigationProps) {
  return (
    <nav
      aria-label="Navegación inferior"
      className={cn(
        'fixed inset-x-0 bottom-0 z-sticky border-t border-border-default bg-background-surface px-activa-8 pb-[env(safe-area-inset-bottom)] shadow-activa-md md:hidden',
        className,
      )}
    >
      <div className="mx-auto grid min-h-16 max-w-lg grid-flow-col auto-cols-fr">
        {items.map((item) => {
          const content = (
            <>
              <ActivaIcon name={item.icon} size={22} />
              <span className="max-w-full truncate text-[11px] font-semibold">{item.label}</span>
            </>
          );
          const itemClasses = cn(
            'relative flex min-w-0 flex-col items-center justify-center gap-activa-4 border-t-2 px-activa-4 py-activa-8 text-center',
            item.active
              ? 'border-action-primary bg-action-primary/10 text-text-primary'
              : 'border-transparent text-text-secondary',
          );

          if (item.disabled) {
            return <span key={`${String(item.href)}-${item.label}`} aria-disabled="true" className={cn(itemClasses, 'opacity-50')}>{content}</span>;
          }

          return (
            <Link
              key={`${String(item.href)}-${item.label}`}
              href={item.href}
              onClick={item.onClick}
              aria-current={item.active ? 'page' : undefined}
              className={cn(itemClasses, 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus')}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
