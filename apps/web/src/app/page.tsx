import Link from 'next/link';

import { BrandLogo, PublicHeader } from '@/components/layout';

const publicNavigation = [
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/terminos', label: 'Términos' },
  { href: '/privacidad', label: 'Privacidad' },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background-page text-text-primary">
      <PublicHeader navigation={publicNavigation} variant="light" logoHref="/" menuOnly />

      <main className="flex flex-1 items-center justify-center px-activa-16 py-activa-40 sm:px-activa-24 sm:py-activa-48 lg:px-activa-40">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          <BrandLogo variant="color" size="hero" alt="ACTIVA" priority />

          <h1 className="mt-activa-32 max-w-2xl font-display text-2xl font-semibold leading-tight text-text-primary sm:mt-activa-40 sm:text-3xl lg:text-4xl">
            Participá en campañas de comercios de forma simple, clara y segura.
          </h1>

          <div className="mt-activa-40 flex w-full max-w-sm flex-col gap-activa-12">
            <Link
              href="/registro"
              className="inline-flex min-h-[56px] w-full items-center justify-center rounded-activa-sm bg-action-primary px-activa-24 text-base font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
            >
              Registrate
            </Link>

            <Link
              href="/login"
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-activa-sm border border-action-secondary bg-background-surface px-activa-20 text-base font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </main>

      <footer className="px-activa-16 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-activa-16 text-center text-sm text-text-secondary sm:px-activa-24 sm:pb-activa-24">
        <nav
          aria-label="Enlaces legales"
          className="flex flex-wrap items-center justify-center gap-x-activa-8 gap-y-activa-4"
        >
          <Link
            href="/terminos"
            className="rounded-activa-xs underline-offset-4 hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            Términos
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="/privacidad"
            className="rounded-activa-xs underline-offset-4 hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            Privacidad
          </Link>
          <span aria-hidden="true">·</span>
          <span>© ACTIVA</span>
        </nav>
      </footer>
    </div>
  );
}
