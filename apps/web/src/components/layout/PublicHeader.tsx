'use client';

import { useId, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { BrandLogo, type BrandLogoProps } from './BrandLogo';
import { NavigationItem, type NavigationItemProps } from './NavigationItem';

export type PublicHeaderVariant = 'light' | 'transparent';
export type PublicHeaderItem = Omit<NavigationItemProps, 'collapsed' | 'className'>;

export interface PublicHeaderProps {
  navigation: readonly PublicHeaderItem[];
  variant?: PublicHeaderVariant;
  logoVariant?: BrandLogoProps['variant'];
  logoHref?: BrandLogoProps['href'];
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PublicHeader({
  navigation,
  variant = 'light',
  logoVariant = 'color',
  logoHref,
  actions,
  children,
  className,
}: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const generatedId = useId();
  const menuId = `public-navigation-${generatedId.replace(/:/g, '')}`;
  const actionSlot = actions ?? children;

  return (
    <header
      className={cn(
        'relative z-sticky w-full border-b border-border-default text-text-primary',
        variant === 'light' ? 'bg-background-surface' : 'bg-transparent',
        className,
      )}
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-activa-16 px-activa-16 sm:px-activa-24 lg:px-activa-40">
        <BrandLogo variant={logoVariant} size="md" href={logoHref} priority />

        <nav aria-label="Navegación principal" className="hidden items-center gap-activa-4 md:flex">
          {navigation.map((item) => (
            <NavigationItem key={`${String(item.href)}-${item.label}`} {...item} className="w-auto" />
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-activa-8 md:flex">{actionSlot}</div>

        <button
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
          className="relative flex size-11 items-center justify-center rounded-activa-sm border border-border-default bg-background-surface text-text-primary transition-colors duration-fast ease-activa hover:bg-background-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus md:hidden"
        >
          <span aria-hidden="true" className={cn('absolute h-0.5 w-5 bg-current transition-transform duration-fast ease-activa', menuOpen ? 'rotate-45' : '-translate-y-1.5')} />
          <span aria-hidden="true" className={cn('absolute h-0.5 w-5 bg-current transition-opacity duration-fast ease-activa', menuOpen && 'opacity-0')} />
          <span aria-hidden="true" className={cn('absolute h-0.5 w-5 bg-current transition-transform duration-fast ease-activa', menuOpen ? '-rotate-45' : 'translate-y-1.5')} />
        </button>
      </div>

      <div
        id={menuId}
        hidden={!menuOpen}
        className="absolute inset-x-0 top-full border-b border-border-default bg-background-surface p-activa-16 shadow-activa-md md:hidden"
      >
        <nav aria-label="Navegación móvil" className="space-y-activa-4">
          {navigation.map((item) => (
            <NavigationItem
              key={`${String(item.href)}-${item.label}`}
              {...item}
              onClick={(event) => {
                item.onClick?.(event);
                if (!event.defaultPrevented) setMenuOpen(false);
              }}
            />
          ))}
        </nav>
        {actionSlot ? <div className="mt-activa-16 flex flex-wrap gap-activa-8 border-t border-border-default pt-activa-16">{actionSlot}</div> : null}
      </div>
    </header>
  );
}
