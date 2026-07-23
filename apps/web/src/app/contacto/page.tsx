import Link from 'next/link';

import { ActivaIcon } from '@/components/icons';
import { PageHeader, PublicFooter, PublicHeader } from '@/components/layout';
import { Alert, Card, CardContent } from '@/components/ui';

const publicNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto', active: true },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar' },
] as const;

const usefulLinks = [
  {
    href: '/ayuda',
    label: 'Consultar Ayuda',
    description: 'Revisá información sobre cuentas, campañas, participaciones, pagos y entregas.',
    icon: 'help' as const,
  },
  {
    href: '/login',
    label: 'Ingresar a ACTIVA',
    description: 'Consultá desde tu cuenta las participaciones, comprobantes y estados disponibles.',
    icon: 'profile' as const,
  },
  {
    href: '/registro',
    label: 'Crear cuenta',
    description: 'Registrate para participar o comenzar la experiencia de tu comercio.',
    icon: 'plus' as const,
  },
] as const;

export default function Page() {
  return (
    <div className="min-h-screen bg-background-page text-text-primary">
      <PublicHeader
        navigation={publicNavigation}
        variant="light"
        logoHref="/"
        actions={(
          <Link
            href="/registro"
            className="inline-flex h-11 items-center justify-center rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
          >
            Crear cuenta
          </Link>
        )}
      />

      <main className="mx-auto max-w-7xl px-activa-16 py-activa-48 sm:px-activa-24 lg:px-activa-40 lg:py-activa-64">
        <PageHeader
          eyebrow="Contacto"
          title="Estamos para ayudarte"
          description="Consultas sobre el uso de ACTIVA, cuentas, campañas y experiencia comercial."
        />

        <Alert
          variant="brand"
          title="Canal de contacto durante la etapa inicial"
          icon={<ActivaIcon name="mail" size={18} />}
          className="mt-activa-40"
        >
          Si recibiste una invitación para usar ACTIVA, podés responder por el mismo canal por el
          que fuiste contactado. Todavía no hay un email, teléfono o formulario público confirmado.
        </Alert>

        <section aria-labelledby="before-contact-title" className="mt-activa-32">
          <Card variant="surface">
            <CardContent className="p-activa-24 sm:p-activa-32">
              <span className="flex size-12 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary">
                <ActivaIcon name="file" size={24} />
              </span>
              <h2 id="before-contact-title" className="mt-activa-20 font-display text-xl font-semibold">
                Información útil para revisar una consulta
              </h2>
              <p className="mt-activa-12 max-w-3xl text-sm leading-7 text-text-secondary">
                Cuando utilices un canal habilitado, incluí el email de tu cuenta, la campaña y el
                comercio relacionados, la fecha aproximada, cualquier comprobante disponible y una
                descripción clara de lo ocurrido. No compartas contraseñas ni datos innecesarios.
              </p>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="useful-links-title" className="mt-activa-40">
          <h2 id="useful-links-title" className="font-display text-2xl font-semibold">
            Enlaces útiles
          </h2>
          <div className="mt-activa-20 grid gap-activa-20 md:grid-cols-3">
            {usefulLinks.map((item) => (
              <Card key={item.href} variant="surface" className="h-full">
                <CardContent className="flex h-full flex-col p-activa-24">
                  <ActivaIcon name={item.icon} size={24} className="text-action-secondary" />
                  <h3 className="mt-activa-16 font-display text-lg font-semibold">{item.label}</h3>
                  <p className="mt-activa-8 flex-1 text-sm leading-6 text-text-secondary">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    className="mt-activa-20 inline-flex min-h-11 items-center font-semibold text-text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  >
                    {item.label}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
