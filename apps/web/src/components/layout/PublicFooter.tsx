import Link from 'next/link';

import { BrandLogo } from './BrandLogo';

const footerLinks = [
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/terminos', label: 'Términos' },
  { href: '/privacidad', label: 'Privacidad' },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-text-inverse/15 bg-background-inverse text-text-inverse">
      <div className="mx-auto max-w-7xl px-activa-16 py-activa-48 sm:px-activa-24 lg:px-activa-40">
        <div className="flex flex-col gap-activa-40 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <BrandLogo variant="white" size="md" alt="ACTIVA" href="/" />
            <p className="mt-activa-20 text-base font-semibold leading-7 text-text-inverse">
              ACTIVA es una plataforma que transforma oportunidades en experiencias.
            </p>
            <p className="mt-activa-8 text-sm leading-6 text-text-inverse/70">
              Campañas, participaciones y procesos organizados para personas y comercios.
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <ul className="grid gap-activa-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 lg:gap-x-activa-32">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-activa-sm px-activa-8 text-sm font-semibold text-text-inverse/75 transition-colors duration-fast ease-activa hover:bg-background-surface/10 hover:text-text-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background-inverse"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-activa-40 border-t border-text-inverse/15 pt-activa-20">
          <p className="text-sm text-text-inverse/60">
            © ACTIVA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
