import Link from 'next/link';

import { ActivaIcon } from '@/components/icons';
import { PageHeader, PublicFooter, PublicHeader } from '@/components/layout';
import { Alert, Badge, Card, CardContent } from '@/components/ui';

const publicNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda', active: true },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar' },
] as const;

const helpTopics = [
  {
    icon: 'profile' as const,
    title: 'Crear y verificar una cuenta',
    content: [
      'Para participar o gestionar campañas necesitás crear una cuenta e iniciar sesión.',
      'Los comercios completan su perfil antes de cargar la información principal de una campaña.',
    ],
  },
  {
    icon: 'participation' as const,
    title: 'Participar en una campaña',
    content: [
      'Antes de elegir, revisá el comercio, el beneficio, las condiciones y las opciones disponibles.',
      'Una opción puede quedar reservada mientras completás el pago. Si la operación no se confirma, puede volver a estar disponible.',
    ],
  },
  {
    icon: 'receipt' as const,
    title: 'Consultar participaciones y comprobantes',
    content: [
      'La sección de participaciones del dashboard reúne tus opciones elegidas, comprobantes y estados disponibles.',
      'Un pago pendiente puede demorar la confirmación. Cuando el proveedor informa el resultado, el sistema actualiza la participación correspondiente.',
    ],
  },
  {
    icon: 'campaign' as const,
    title: 'Gestionar campañas como comercio',
    content: [
      'Cada publicación organiza la descripción, las condiciones, el beneficio, la fecha estimada y las opciones disponibles.',
      'El comercio que impulsa la campaña es responsable por la información publicada y por coordinar la entrega del beneficio.',
    ],
  },
  {
    icon: 'result' as const,
    title: 'Seguimiento de resultados y entregas',
    content: [
      'Desde tu cuenta podés consultar la selección, el resultado y la información de entrega disponible.',
      'Si necesitás reportar un problema, indicá el email de tu cuenta, la campaña, el comercio, la fecha aproximada y una descripción clara del caso.',
    ],
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
          eyebrow="Centro de ayuda"
          title="Encontrá respuestas para avanzar"
          description="Información clara sobre cuentas, campañas, participaciones, pagos y seguimiento."
          actions={<Badge variant="neutral">Actualizado en julio de 2026</Badge>}
        />

        <div className="mt-activa-40 grid gap-activa-20 md:grid-cols-2">
          {helpTopics.map((topic) => (
            <Card key={topic.title} variant="surface" className="h-full">
              <CardContent className="p-activa-24">
                <span className="flex size-12 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary">
                  <ActivaIcon name={topic.icon} size={24} />
                </span>
                <h2 className="mt-activa-20 font-display text-xl font-semibold text-text-primary">
                  {topic.title}
                </h2>
                <div className="mt-activa-12 space-y-activa-12 text-sm leading-7 text-text-secondary">
                  {topic.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Alert
          variant="information"
          title="¿Necesitás revisar un caso particular?"
          icon={<ActivaIcon name="help" size={18} />}
          className="mt-activa-32"
          action={(
            <Link
              href="/contacto"
              className="inline-flex min-h-11 items-center rounded-activa-sm font-semibold text-text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              Ir a contacto
            </Link>
          )}
        >
          Reuní toda la información disponible antes de comunicarte para facilitar la revisión.
        </Alert>
      </main>

      <PublicFooter />
    </div>
  );
}
