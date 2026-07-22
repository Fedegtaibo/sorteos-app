'use client';

import type { ReactNode } from 'react';

import { ActivaIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

import { BrandLogo, type BrandLogoProps } from './BrandLogo';
import { NavigationItem, type NavigationItemProps } from './NavigationItem';

export type DashboardSidebarItem = Omit<NavigationItemProps, 'collapsed' | 'className'>;

export interface DashboardSidebarProps {
  items: readonly DashboardSidebarItem[];
  collapsed: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  logoHref?: BrandLogoProps['href'];
  user?: ReactNode;
  footerAction?: ReactNode;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
}

export function DashboardSidebar({
  items,
  collapsed,
  onCollapsedChange,
  logoHref,
  user,
  footerAction,
  mobileOpen = false,
  onMobileClose,
  className,
}: DashboardSidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Cerrar navegación"
          onClick={onMobileClose}
          className="fixed inset-0 z-overlay bg-background-inverse/60 md:hidden"
        />
      ) : null}
      <aside
        aria-label="Navegación del panel"
        className={cn(
          'fixed inset-y-0 left-0 z-modal flex flex-col border-r border-border-default bg-background-surface shadow-activa-md transition-[width,transform] duration-base ease-activa md:z-sticky md:translate-x-0 md:shadow-none',
          collapsed ? 'w-20' : 'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          className,
        )}
      >
        <div className={cn('flex min-h-16 items-center border-b border-border-default px-activa-16', collapsed ? 'justify-center' : 'justify-between')}>
          <BrandLogo variant={collapsed ? 'symbol' : 'color'} size={collapsed ? 'md' : 'sm'} href={logoHref} />
          {onMobileClose ? (
            <button
              type="button"
              aria-label="Cerrar navegación"
              onClick={onMobileClose}
              className="relative flex size-10 items-center justify-center rounded-activa-sm text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus md:hidden"
            >
              <span aria-hidden="true" className="absolute h-0.5 w-4 rotate-45 bg-current" />
              <span aria-hidden="true" className="absolute h-0.5 w-4 -rotate-45 bg-current" />
            </button>
          ) : null}
        </div>

        <nav aria-label="Secciones del panel" className="flex-1 space-y-activa-4 overflow-y-auto p-activa-12">
          {items.map((item) => (
            <NavigationItem
              key={`${String(item.href)}-${item.label}`}
              {...item}
              collapsed={collapsed}
              onClick={(event) => {
                item.onClick?.(event);
                if (!event.defaultPrevented) onMobileClose?.();
              }}
            />
          ))}
        </nav>

        <div className="border-t border-border-default p-activa-12">
          {user ? <div className={cn('mb-activa-12 overflow-hidden', collapsed && 'flex justify-center')}>{user}</div> : null}
          {footerAction ? <div className={collapsed ? 'flex justify-center' : undefined}>{footerAction}</div> : null}
        </div>

        {onCollapsedChange ? (
          <button
            type="button"
            aria-label={collapsed ? 'Expandir navegación' : 'Contraer navegación'}
            aria-expanded={!collapsed}
            onClick={() => onCollapsedChange(!collapsed)}
            className="absolute -right-5 bottom-20 hidden size-10 items-center justify-center rounded-activa-full border border-border-default bg-background-surface text-text-secondary shadow-activa-sm transition-colors duration-fast ease-activa hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus md:flex"
          >
            <ActivaIcon name="chevron-down" size={18} className={cn('transition-transform duration-fast ease-activa', collapsed ? '-rotate-90' : 'rotate-90')} />
          </button>
        ) : null}
      </aside>
    </>
  );
}
