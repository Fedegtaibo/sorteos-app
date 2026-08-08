import Link from 'next/link';

import { ActivaIcon } from '@/components/icons';
import { PublicHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';

const publicNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar' },
] as const;

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background-page text-text-primary">
      <PublicHeader navigation={publicNavigation} variant="light" logoHref="/" />

      <main className="flex flex-1 items-center justify-center px-activa-16 py-activa-48 sm:px-activa-24 lg:px-activa-40 lg:py-activa-64">
        <Card className="w-full max-w-2xl shadow-activa-md">
          <CardContent className="flex flex-col items-center p-activa-24 text-center sm:p-activa-40">
            <span className="flex size-14 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary sm:size-16">
              <ActivaIcon name="search" size={32} />
            </span>

            <p className="mt-activa-20 text-sm font-semibold uppercase tracking-widest text-action-secondary">
              Error 404
            </p>
            <h1 className="mt-activa-8 font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
              No encontramos esta página
            </h1>
            <p className="mt-activa-12 max-w-lg text-sm leading-7 text-text-secondary sm:text-base">
              Es posible que el enlace haya cambiado o que la página ya no esté disponible.
            </p>

            <div className="mt-activa-24 flex w-full flex-col gap-activa-12 sm:w-auto sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-[52px] items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-20 text-base font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                <ActivaIcon name="home" size={20} />
                Volver al inicio
              </Link>
              <Link
                href="/#marketplace"
                className="inline-flex h-[52px] items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-20 text-base font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                Explorar campañas
                <ActivaIcon name="arrow-right" size={20} />
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
