import Link from 'next/link';
import InstallAppButton from '@/components/InstallAppButton';
import { ActivaIcon } from '@/components/icons';
import { PublicHeader } from '@/components/layout';
import { Badge, Card, CardContent } from '@/components/ui';

const publicNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/login', label: 'Ingresar' },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
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

      <section className="border-b border-border-strong bg-background-inverse text-text-inverse">
        <div className="mx-auto grid max-w-7xl gap-activa-40 px-activa-16 py-activa-48 sm:px-activa-24 md:py-activa-64 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-activa-40 lg:py-activa-80">
          <div>
            <Badge variant="brand" className="bg-action-primary text-action-primary-text">
              Tecnología para acceder a tus objetivos
            </Badge>

            <h1 className="mt-activa-20 max-w-3xl font-display text-4xl font-semibold leading-tight text-text-inverse sm:text-5xl lg:text-6xl">
              Transformamos oportunidades en experiencias
            </h1>

            <p className="mt-activa-24 max-w-2xl text-lg leading-8 text-text-inverse/75">
              ACTIVA conecta personas y comercios mediante campañas claras, participaciones
              registradas y procesos confiables de principio a fin.
            </p>

            <div className="mt-activa-32 flex flex-col gap-activa-12 sm:flex-row sm:flex-wrap">
              <Link
                href="/registro"
                className="inline-flex h-[52px] items-center justify-center rounded-activa-sm bg-action-primary px-activa-20 text-base font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background-inverse"
              >
                Crear cuenta
              </Link>

              <Link
                href="/login"
                className="inline-flex h-[52px] items-center justify-center rounded-activa-sm border border-text-inverse/30 bg-transparent px-activa-20 text-base font-semibold text-text-inverse transition-colors duration-fast ease-activa hover:bg-background-surface/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background-inverse"
              >
                Ingresar a ACTIVA
              </Link>

              <InstallAppButton className="h-[52px] rounded-activa-sm border border-text-inverse/30 bg-transparent px-activa-20 text-base font-semibold text-text-inverse transition-colors duration-fast ease-activa hover:bg-background-surface/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background-inverse" />
            </div>
          </div>

          <Card
            variant="inverse"
            className="border-text-inverse/20 bg-background-surface/5 shadow-activa-lg"
          >
            <CardContent className="p-activa-20 sm:p-activa-24">
              <div className="grid gap-activa-12">
                {[
                  {
                    icon: 'campaign' as const,
                    title: 'Descubrís una campaña',
                    description: 'Conocé el comercio, el beneficio y todas las condiciones.',
                  },
                  {
                    icon: 'participation' as const,
                    title: 'Elegís tu participación',
                    description: 'Seleccioná una opción disponible y revisá el detalle antes de continuar.',
                  },
                  {
                    icon: 'card' as const,
                    title: 'El pago queda registrado',
                    description: 'La operación y la participación quedan vinculadas automáticamente.',
                  },
                  {
                    icon: 'result' as const,
                    title: 'Seguís todo el proceso',
                    description: 'Consultá la selección, el resultado y la entrega desde tu cuenta.',
                  },
                ].map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-activa-12 rounded-activa-md border border-text-inverse/15 bg-background-inverse/60 p-activa-16"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-activa-full bg-action-primary text-action-primary-text">
                      <ActivaIcon name={step.icon} size={20} />
                      <span className="sr-only">Paso {index + 1}</span>
                    </span>

                    <div>
                      <h2 className="font-display text-base font-semibold text-text-inverse">
                        {step.title}
                      </h2>
                      <p className="mt-activa-4 text-sm leading-6 text-text-inverse/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-activa-20 border-t border-text-inverse/15 pt-activa-16 text-sm font-semibold leading-6 text-text-inverse/80">
                Una experiencia ordenada, verificable y pensada para generar confianza.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-background-page text-text-primary">
        <div className="mx-auto max-w-7xl px-activa-16 py-activa-64 sm:px-activa-24 lg:px-activa-40 lg:py-activa-80">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-action-secondary">
              Una experiencia para todos
            </p>
            <h2 className="mt-activa-12 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Más claridad para participar y más herramientas para crecer
            </h2>
            <p className="mt-activa-16 text-base leading-7 text-text-secondary sm:text-lg">
              ACTIVA organiza cada campaña para que personas y comercios puedan avanzar con
              información clara, operaciones registradas y seguimiento de principio a fin.
            </p>
          </div>

          <div className="mt-activa-40 grid gap-activa-20 lg:grid-cols-3">
            {[
              {
                eyebrow: 'Para las personas',
                title: 'Participá con información clara',
                icon: 'participation' as const,
                items: [
                  'Conocé el comercio y las condiciones antes de elegir.',
                  'Consultá tus participaciones y comprobantes desde tu cuenta.',
                  'Seguí la selección, el resultado y la entrega en un mismo lugar.',
                ],
              },
              {
                eyebrow: 'Para los comercios',
                title: 'Convertí oportunidades en campañas medibles',
                icon: 'store' as const,
                items: [
                  'Presentá beneficios, productos o experiencias de forma ordenada.',
                  'Administrá participaciones y pagos con registros vinculados.',
                  'Construí confianza con procesos claros y verificables.',
                ],
              },
              {
                eyebrow: 'Para la confianza',
                title: 'Cada etapa deja un registro',
                icon: 'shield-check' as const,
                items: [
                  'Campaña, participación, pago, selección, resultado y entrega.',
                  'Información organizada para reducir dudas y tareas manuales.',
                  'Más trazabilidad para personas, comercios y administración.',
                ],
              },
            ].map((item) => (
              <Card key={item.title} variant="surface" className="h-full">
                <CardContent className="p-activa-24">
                  <span className="flex size-12 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary">
                    <ActivaIcon name={item.icon} size={24} />
                  </span>
                  <p className="mt-activa-20 text-sm font-semibold text-action-secondary">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-activa-8 font-display text-xl font-semibold leading-7 text-text-primary">
                    {item.title}
                  </h3>
                  <ul className="mt-activa-20 space-y-activa-12">
                    {item.items.map((text) => (
                      <li key={text} className="flex gap-activa-8 text-sm leading-6 text-text-secondary">
                        <ActivaIcon
                          name="check"
                          size={16}
                          className="mt-activa-4 shrink-0 text-action-secondary"
                        />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 md:grid-cols-4">
          {[
            ['Pagos seguros', 'Operaciones registradas.'],
            ['Comercios verificados', 'Negocios reales y activos.'],
            ['Comprobantes automáticos', 'Participaciones guardadas.'],
            ['Entregas auditables', 'Más trazabilidad del premio.'],
          ].map(([titulo, texto]) => (
            <div key={titulo} className="rounded-2xl bg-black/20 p-5">
              <p className="font-black text-white">{titulo}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-[2rem] bg-amber-400 p-8 text-black md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-black/60">
                Sortealo
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                Un lugar para participar, vender y confiar.
              </h2>

              <p className="mt-4 max-w-2xl font-semibold leading-7 text-black/70">
                La exploración de sorteos vive dentro de la cuenta.
                La home solo tiene que explicar el producto y abrir la puerta.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/registro"
                className="rounded-2xl bg-black px-7 py-4 text-center text-base font-black text-white hover:bg-zinc-900"
              >
                Crear cuenta
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-black/20 px-7 py-4 text-center text-base font-black text-black hover:bg-black/10"
              >
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      </section>
    
      {/* Footer de confianza Sortealo */}
      <footer className="mt-20 border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-zinc-300">Sortealo</p>
            <p className="mt-2 max-w-xl leading-6">
              Plataforma para crear sorteos online con registro de participantes, números, pagos y comprobantes.
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 font-bold">
            <Link href="/ayuda" className="hover:text-amber-300">
              Ayuda
            </Link>
            <Link href="/contacto" className="hover:text-amber-300">
              Contacto
            </Link>
            <Link href="/terminos" className="hover:text-amber-300">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-amber-300">
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
</main>
  );
}
