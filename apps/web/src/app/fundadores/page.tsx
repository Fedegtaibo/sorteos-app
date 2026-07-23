import Link from 'next/link';

import { ActivaIcon } from '@/components/icons';
import { PageHeader, PublicFooter, PublicHeader } from '@/components/layout';
import { Badge, Card, CardContent } from '@/components/ui';

const publicNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores', active: true },
  { href: '/login', label: 'Ingresar' },
] as const;

const founderProfiles = [
  'Comercios, marcas o emprendimientos con una comunidad propia.',
  'Equipos que quieran presentar beneficios o experiencias de forma ordenada.',
  'Comercios dispuestos a comenzar con campañas chicas o medianas.',
  'Personas que puedan compartir observaciones directas sobre el uso de la plataforma.',
] as const;

const platformCapabilities = [
  'Publicación de campañas con beneficio, condiciones y opciones disponibles.',
  'Selección de participaciones desde una experiencia web pública.',
  'Registro vinculado de participantes, pagos y comprobantes.',
  'Panel para organizar campañas y consultar su actividad.',
  'Seguimiento de la selección, el resultado y la entrega.',
  'Acompañamiento inicial para aprender y mejorar con uso real.',
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
          eyebrow="Comercios fundadores"
          title="Construyamos juntos la primera etapa de ACTIVA"
          description="Una experiencia inicial acompañada para comercios que quieran organizar campañas claras, medibles y confiables."
          actions={(
            <div className="flex flex-col gap-activa-8 sm:flex-row">
              <Link
                href="/contacto"
                className="inline-flex h-11 items-center justify-center rounded-activa-sm bg-action-secondary px-activa-16 text-sm font-semibold text-action-secondary-text transition-colors duration-fast ease-activa hover:bg-action-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                Quiero conocer ACTIVA
              </Link>
              <Link
                href="/registro"
                className="inline-flex h-11 items-center justify-center rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                Crear cuenta
              </Link>
            </div>
          )}
        />

        <section aria-labelledby="initial-stage-title" className="mt-activa-40">
          <Card variant="inverse" className="border-text-inverse/15 shadow-activa-md">
            <CardContent className="grid gap-activa-32 p-activa-24 sm:p-activa-32 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <Badge variant="brand" className="bg-action-primary text-action-primary-text">
                  Primera etapa
                </Badge>
                <h2 id="initial-stage-title" className="mt-activa-20 font-display text-2xl font-semibold text-text-inverse sm:text-3xl">
                  Un lanzamiento controlado y acompañado
                </h2>
                <div className="mt-activa-16 space-y-activa-12 text-sm leading-7 text-text-inverse/75">
                  <p>
                    ACTIVA inicia su operación con pocos comercios para acompañar cada campaña,
                    revisar el recorrido completo y aprender a partir de experiencias concretas.
                  </p>
                  <p>
                    El objetivo es trabajar con información real, sostener una relación cercana y
                    mejorar el sistema sin perder claridad ni control.
                  </p>
                </div>
              </div>

              <div className="grid gap-activa-12 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  {
                    value: 'Acompañamiento cercano',
                    label: 'Seguimiento durante toda la primera etapa.',
                  },
                  {
                    value: 'Campañas iniciales',
                    label: 'Experiencias claras y medibles desde el comienzo.',
                  },
                  {
                    value: 'Uso real',
                    label: 'Aprendizaje y mejora continua de principio a fin.',
                  },
                ].map((item) => (
                  <div key={item.value} className="rounded-activa-md border border-text-inverse/15 bg-background-surface/5 p-activa-16">
                    <p className="font-display text-xl font-semibold text-action-primary">{item.value}</p>
                    <p className="mt-activa-4 text-sm leading-6 text-text-inverse/70">{item.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="mt-activa-24 grid gap-activa-24 lg:grid-cols-2">
          <Card variant="surface">
            <CardContent className="p-activa-24 sm:p-activa-32">
              <span className="flex size-12 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary">
                <ActivaIcon name="store" size={24} />
              </span>
              <h2 className="mt-activa-20 font-display text-xl font-semibold">¿Qué comercios buscamos?</h2>
              <ul className="mt-activa-16 space-y-activa-12">
                {founderProfiles.map((item) => (
                  <li key={item} className="flex gap-activa-8 text-sm leading-6 text-text-secondary">
                    <ActivaIcon name="check" size={16} className="mt-activa-4 text-action-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card variant="surface">
            <CardContent className="p-activa-24 sm:p-activa-32">
              <span className="flex size-12 items-center justify-center rounded-activa-md bg-action-primary/20 text-action-secondary">
                <ActivaIcon name="campaign" size={24} />
              </span>
              <h2 className="mt-activa-20 font-display text-xl font-semibold">Qué ofrece ACTIVA</h2>
              <ul className="mt-activa-16 space-y-activa-12">
                {platformCapabilities.map((item) => (
                  <li key={item} className="flex gap-activa-8 text-sm leading-6 text-text-secondary">
                    <ActivaIcon name="check" size={16} className="mt-activa-4 text-action-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card variant="muted">
            <CardContent className="p-activa-24 sm:p-activa-32">
              <ActivaIcon name="refresh" size={24} className="text-action-secondary" />
              <h2 className="mt-activa-16 font-display text-xl font-semibold">Aprendizaje y mejora continua</h2>
              <p className="mt-activa-12 text-sm leading-7 text-text-secondary">
                Esta primera etapa permite acompañar cada campaña, recibir observaciones directas y
                mejorar la plataforma a partir de experiencias concretas.
              </p>
            </CardContent>
          </Card>

          <Card variant="highlight">
            <CardContent className="p-activa-24 sm:p-activa-32">
              <ActivaIcon name="arrow-right" size={24} className="text-action-secondary" />
              <h2 className="mt-activa-16 font-display text-xl font-semibold">Cómo avanzar</h2>
              <p className="mt-activa-12 text-sm leading-7 text-text-secondary">
                Para conversar sobre esta primera etapa, compartí por el canal de contacto el nombre
                del comercio, rubro, ciudad, redes sociales y el tipo de beneficio que querés presentar.
              </p>
              <div className="mt-activa-20 flex flex-col gap-activa-8 sm:flex-row">
                <Link
                  href="/contacto"
                  className="inline-flex h-11 items-center justify-center rounded-activa-sm bg-action-secondary px-activa-16 text-sm font-semibold text-action-secondary-text transition-colors duration-fast ease-activa hover:bg-action-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                >
                  Quiero conocer ACTIVA
                </Link>
                <Link
                  href="/registro"
                  className="inline-flex h-11 items-center justify-center rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                >
                  Crear cuenta
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
