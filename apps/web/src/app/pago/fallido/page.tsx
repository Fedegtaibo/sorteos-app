import Link from 'next/link';

import { ActivaIcon } from '@/components/icons';
import { PublicFooter, PublicHeader } from '@/components/layout';
import {
  Alert,
  Badge,
  Card,
  CardContent,
  Divider,
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

export default function PagoFallidoPage() {
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
              <Badge variant="error">Pago no aprobado</Badge>

              <span
                aria-hidden="true"
                className="mt-activa-24 flex size-16 items-center justify-center rounded-activa-full bg-status-error/10 text-status-error"
              >
                <ActivaIcon name="error" size={32} />
              </span>

              <h1 className="mt-activa-20 font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
                No pudimos confirmar tu pago
              </h1>

              <Alert
                variant="error"
                className="mt-activa-20 w-full text-left"
                icon={<ActivaIcon name="error" size={16} />}
              >
                La operación pudo haber sido rechazada, cancelada o no
                completada.
              </Alert>

              <div className="mt-activa-24 w-full rounded-activa-md border border-border-default bg-background-surface-muted p-activa-20 text-left">
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  Qué hacer ahora
                </h2>
                <ul className="mt-activa-12 space-y-activa-12 text-sm leading-6 text-text-secondary">
                  <li className="flex gap-activa-8">
                    <ActivaIcon
                      name="info"
                      size={16}
                      className="mt-1 text-status-error"
                    />
                    <span>
                      Revisá primero Mis participaciones para comprobar si la
                      operación quedó registrada.
                    </span>
                  </li>
                  <li className="flex gap-activa-8">
                    <ActivaIcon
                      name="info"
                      size={16}
                      className="mt-1 text-status-error"
                    />
                    <span>
                      No repitas el pago si la participación aparece registrada.
                    </span>
                  </li>
                  <li className="flex gap-activa-8">
                    <ActivaIcon
                      name="info"
                      size={16}
                      className="mt-1 text-status-error"
                    />
                    <span>
                      Si no aparece, volvé a la campaña correspondiente desde el
                      sitio.
                    </span>
                  </li>
                  <li className="flex gap-activa-8">
                    <ActivaIcon
                      name="info"
                      size={16}
                      className="mt-1 text-status-error"
                    />
                    <span>Contactá soporte ante cualquier duda.</span>
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
                Ante una operación pendiente o dudosa, no repitas el pago sin
                revisar antes Mis participaciones.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
