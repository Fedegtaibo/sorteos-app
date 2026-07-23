import Link from 'next/link';

import { ActivaIcon } from '@/components/icons';
import { PublicFooter, PublicHeader } from '@/components/layout';
import {
  Alert,
  Badge,
  Card,
  CardContent,
  Divider,
  Spinner,
} from '@/components/ui';

const navigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar' },
] as const;

const primaryLinkClass =
  'inline-flex min-h-11 items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2';

const secondaryLinkClass =
  'inline-flex min-h-11 items-center justify-center rounded-activa-sm border border-border-strong bg-background-surface px-activa-16 text-sm font-semibold text-text-primary transition-colors duration-fast ease-activa hover:bg-background-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2';

export default function PagoPendientePage() {
  return (
    <div className="min-h-screen bg-background-page text-text-primary">
      <PublicHeader
        variant="light"
        logoHref="/"
        navigation={navigation}
        actions={
          <Link href="/registro" className={primaryLinkClass}>
            Crear cuenta
          </Link>
        }
      />

      <main className="px-activa-16 py-activa-48 sm:px-activa-24 sm:py-activa-64 lg:px-activa-40">
        <section className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="flex flex-col items-center p-activa-24 text-center sm:p-activa-40">
              <Badge variant="warning">Pago pendiente</Badge>

              <span className="mt-activa-24 flex size-16 items-center justify-center rounded-activa-full bg-status-warning/15 text-action-secondary">
                <Spinner
                  size="lg"
                  variant="brand"
                  decorative
                />
              </span>

              <h1 className="mt-activa-20 font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
                Tu pago todavía se está procesando
              </h1>

              <Alert
                variant="information"
                className="mt-activa-20 w-full text-left"
                icon={<ActivaIcon name="pending" size={16} />}
              >
                <p className="leading-6">
                  Mercado Pago aún no confirmó el resultado definitivo de la
                  operación.
                </p>
                <p className="mt-activa-8 font-semibold">
                  Esta pantalla no se actualiza automáticamente.
                </p>
              </Alert>

              <div className="mt-activa-24 w-full rounded-activa-md border border-border-default bg-background-surface-muted p-activa-20 text-left">
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  Qué hacer ahora
                </h2>
                <ul className="mt-activa-12 space-y-activa-12 text-sm leading-6 text-text-secondary">
                  <li className="flex gap-activa-8">
                    <ActivaIcon
                      name="pending"
                      size={16}
                      className="mt-1 text-status-warning"
                    />
                    <span>
                      La confirmación puede demorar según el medio de pago.
                    </span>
                  </li>
                  <li className="flex gap-activa-8">
                    <ActivaIcon
                      name="pending"
                      size={16}
                      className="mt-1 text-status-warning"
                    />
                    <span>
                      Revisá Mis participaciones más adelante para comprobar si
                      la operación quedó registrada.
                    </span>
                  </li>
                  <li className="flex gap-activa-8">
                    <ActivaIcon
                      name="pending"
                      size={16}
                      className="mt-1 text-status-warning"
                    />
                    <span>
                      Contactá soporte si la demora es prolongada.
                    </span>
                  </li>
                </ul>
              </div>

              <Divider className="my-activa-24" />

              <div className="grid w-full gap-activa-8 sm:grid-cols-3">
                <Link
                  href="/dashboard/participaciones"
                  className={primaryLinkClass}
                >
                  Ver mis participaciones
                </Link>
                <Link href="/contacto" className={secondaryLinkClass}>
                  Contactar soporte
                </Link>
                <Link href="/" className={secondaryLinkClass}>
                  Volver al inicio
                </Link>
              </div>

              <p className="mt-activa-20 text-sm font-semibold leading-6 text-text-secondary">
                No vuelvas a pagar mientras el resultado siga pendiente.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
