'use client';

import Image from 'next/image';
import { useState } from 'react';

import {
  ActivaHero,
  ActivaPattern,
  ActivaProgressSteps,
  ActivaSurface,
} from '@/components/brand';
import { ActivaIcon, type ActivaIconName } from '@/components/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui';

const colorSamples = [
  {
    name: 'Ámbar ACTIVA',
    purpose: 'Acción primaria y énfasis de marca',
    token: 'bg-activa-amber / --color-activa-amber',
    className: 'bg-activa-amber',
  },
  {
    name: 'Verde azulado',
    purpose: 'Acción secundaria, enlaces y foco',
    token: 'bg-activa-teal / --color-activa-teal',
    className: 'bg-activa-teal',
  },
  {
    name: 'Grafito',
    purpose: 'Texto principal y superficies inversas',
    token: 'bg-activa-graphite / --color-activa-graphite',
    className: 'bg-activa-graphite',
  },
  {
    name: 'Blanco cálido',
    purpose: 'Fondo general de página',
    token: 'bg-activa-warm-white / --color-activa-warm-white',
    className: 'bg-activa-warm-white',
  },
  {
    name: 'Superficie',
    purpose: 'Contenedores principales',
    token: 'bg-background-surface / --color-background-surface',
    className: 'bg-background-surface',
  },
  {
    name: 'Superficie secundaria',
    purpose: 'Agrupación y contraste suave',
    token: 'bg-background-surface-muted / --color-background-surface-muted',
    className: 'bg-background-surface-muted',
  },
  {
    name: 'Success',
    purpose: 'Confirmaciones y resultados correctos',
    token: 'bg-status-success / --color-status-success',
    className: 'bg-status-success',
  },
  {
    name: 'Information',
    purpose: 'Información contextual',
    token: 'bg-status-information / --color-status-information',
    className: 'bg-status-information',
  },
  {
    name: 'Warning',
    purpose: 'Advertencias que requieren atención',
    token: 'bg-status-warning / --color-status-warning',
    className: 'bg-status-warning',
  },
  {
    name: 'Error',
    purpose: 'Errores y acciones destructivas',
    token: 'bg-status-error / --color-status-error',
    className: 'bg-status-error',
  },
] as const;

const previewIcons: ReadonlyArray<{ name: ActivaIconName; label: string }> = [
  { name: 'home', label: 'Inicio' },
  { name: 'search', label: 'Buscar' },
  { name: 'campaign', label: 'Campaña' },
  { name: 'participation', label: 'Participación' },
  { name: 'selection', label: 'Selección' },
  { name: 'store', label: 'Comercio' },
  { name: 'delivery', label: 'Entrega' },
  { name: 'profile', label: 'Perfil' },
  { name: 'shield-check', label: 'Seguridad' },
  { name: 'help', label: 'Ayuda' },
  { name: 'bell', label: 'Notificación' },
  { name: 'benefit', label: 'Beneficio' },
  { name: 'check-circle', label: 'Confirmado' },
  { name: 'pending', label: 'Pendiente' },
  { name: 'warning', label: 'Advertencia' },
  { name: 'error', label: 'Error' },
];

export default function UiPreviewPage() {
  const [showClosableAlert, setShowClosableAlert] = useState(true);

  return (
    <main className="min-h-screen bg-background-page text-text-primary">
      <div className="mx-auto w-full max-w-7xl px-activa-16 py-activa-40 sm:px-activa-24 lg:px-activa-40 lg:py-activa-64">
        <header className="flex flex-col gap-activa-16 border-b border-border-default pb-activa-32 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-activa-8 text-sm font-semibold uppercase tracking-widest text-text-link">
              Sistema visual ACTIVA
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              ACTIVA Design System
            </h1>
            <p className="mt-activa-8 text-base text-text-secondary sm:text-lg">
              Laboratorio visual de componentes y estados.
            </p>
          </div>
          <Badge variant="brand">Versión inicial</Badge>
        </header>

        <div className="space-y-activa-64 pt-activa-48">
          <section aria-labelledby="colors-title">
            <div className="mb-activa-24">
              <h2 id="colors-title" className="font-display text-2xl font-semibold">Colores</h2>
              <p className="mt-activa-8 text-text-secondary">Paleta funcional y semántica del sistema.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {colorSamples.map((color) => (
                <Card key={color.name} className="min-w-0 overflow-hidden">
                  <div className={`h-24 border-b border-border-default ${color.className}`} aria-hidden="true" />
                  <CardContent className="space-y-activa-8 pt-activa-16">
                    <h3 className="font-display font-semibold">{color.name}</h3>
                    <p className="text-sm text-text-secondary">{color.purpose}</p>
                    <code className="block break-words rounded-activa-xs bg-background-surface-muted p-activa-8 text-xs text-text-primary">
                      {color.token}
                    </code>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="typography-title">
            <div className="mb-activa-24">
              <h2 id="typography-title" className="font-display text-2xl font-semibold">Tipografía</h2>
              <p className="mt-activa-8 text-text-secondary">Jerarquías legibles con Sora e Inter.</p>
            </div>
            <Card>
              <CardContent className="divide-y divide-border-default pt-activa-24">
                <div className="grid gap-activa-8 py-activa-16 first:pt-0 md:grid-cols-[160px_1fr]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Display con Sora</p>
                  <p className="font-display text-3xl font-bold sm:text-4xl">Oportunidades que se convierten en experiencias.</p>
                </div>
                <div className="grid gap-activa-8 py-activa-16 md:grid-cols-[160px_1fr]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Heading 1</p>
                  <p className="font-display text-3xl font-semibold">Tecnología humana, clara y confiable.</p>
                </div>
                <div className="grid gap-activa-8 py-activa-16 md:grid-cols-[160px_1fr]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Heading 2</p>
                  <p className="font-display text-2xl font-semibold">Experiencias simples para decisiones importantes.</p>
                </div>
                <div className="grid gap-activa-8 py-activa-16 md:grid-cols-[160px_1fr]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Body con Inter</p>
                  <p className="text-base">ACTIVA conecta personas, comercios y oportunidades con claridad.</p>
                </div>
                <div className="grid gap-activa-8 py-activa-16 md:grid-cols-[160px_1fr]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Body small</p>
                  <p className="text-sm">Información precisa para avanzar con confianza.</p>
                </div>
                <div className="grid gap-activa-8 py-activa-16 last:pb-0 md:grid-cols-[160px_1fr]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Caption</p>
                  <p className="text-xs text-text-secondary">Actualizado por el equipo de diseño de ACTIVA.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="buttons-title">
            <div className="mb-activa-24">
              <h2 id="buttons-title" className="font-display text-2xl font-semibold">Button</h2>
              <p className="mt-activa-8 text-text-secondary">Variantes, escalas y estados de interacción.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Variantes</CardTitle>
                  <CardDescription>Jerarquías para cada tipo de acción.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-activa-12">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="tertiary">Tertiary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tamaños</CardTitle>
                  <CardDescription>Controles cómodos para cada contexto.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-activa-12">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" aria-label="Agregar elemento">
                    <span aria-hidden="true" className="relative block size-4">
                      <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-current" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Estados</CardTitle>
                  <CardDescription>Normal, deshabilitado y cargando.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-activa-12">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                  <Button isLoading loadingText="Procesando">Loading</Button>
                  <Button size="icon" isLoading aria-label="Procesando acción">Acción</Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section aria-labelledby="inputs-title">
            <div className="mb-activa-24">
              <h2 id="inputs-title" className="font-display text-2xl font-semibold">Input</h2>
              <p className="mt-activa-8 text-text-secondary">Campos con etiquetas visibles y mensajes claros.</p>
            </div>
            <Card>
              <CardContent className="grid grid-cols-1 gap-activa-24 pt-activa-24 md:grid-cols-2 lg:grid-cols-3">
                <Input label="Nombre completo" placeholder="Ingresá tu nombre" />
                <Input label="Correo electrónico" type="email" helperText="Usaremos este correo para confirmar tu cuenta." placeholder="nombre@ejemplo.com" />
                <Input label="Código de invitación" error="El código ingresado no es válido." defaultValue="ACTIVA-000" />
                <Input label="Identidad verificada" successMessage="La información fue validada." defaultValue="Verificación completa" />
                <Input label="Número de operación" readOnly defaultValue="OP-2048" />
                <Input label="Campo no disponible" disabled defaultValue="Temporalmente deshabilitado" />
                <Input label="Buscar oportunidad" placeholder="Buscar" leftIcon={<span aria-hidden="true" className="text-xs font-bold">B</span>} />
                <Input label="Estado de validación" defaultValue="Datos completos" rightIcon={<span aria-hidden="true" className="text-xs font-bold">OK</span>} />
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="badges-title">
            <div className="mb-activa-24">
              <h2 id="badges-title" className="font-display text-2xl font-semibold">Badge</h2>
              <p className="mt-activa-8 text-text-secondary">Estados breves expresados con texto y color.</p>
            </div>
            <Card>
              <CardContent className="flex flex-wrap gap-activa-12 pt-activa-24">
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="brand">Marca ACTIVA</Badge>
                <Badge variant="active">Activo</Badge>
                <Badge variant="information">Información</Badge>
                <Badge variant="success">Completado</Badge>
                <Badge variant="warning">Requiere atención</Badge>
                <Badge variant="error">Con error</Badge>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="alerts-title">
            <div className="mb-activa-24">
              <h2 id="alerts-title" className="font-display text-2xl font-semibold">Alert</h2>
              <p className="mt-activa-8 text-text-secondary">Mensajes contextuales con significado explícito.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 lg:grid-cols-2">
              <Alert variant="brand" title="Novedad ACTIVA">El nuevo lenguaje visual ya está disponible.</Alert>
              <Alert variant="information">Información: revisá los datos antes de continuar.</Alert>
              <Alert variant="success" title="Operación confirmada">La solicitud se procesó correctamente.</Alert>
              <Alert variant="warning">Advertencia: faltan datos obligatorios para completar el proceso.</Alert>
              <Alert
                variant="error"
                title="No pudimos completar la acción"
                action={<Button variant="tertiary" size="sm">Intentar nuevamente</Button>}
              >
                Error: verificá tu conexión y volvé a intentar.
              </Alert>
              {showClosableAlert ? (
                <Alert variant="information" title="Aviso cerrable" onClose={() => setShowClosableAlert(false)}>
                  Podés cerrar este mensaje con el control accesible.
                </Alert>
              ) : (
                <Card variant="muted">
                  <CardContent className="flex flex-wrap items-center justify-between gap-activa-12 pt-activa-24">
                    <p className="text-sm text-text-secondary">El aviso cerrable está oculto.</p>
                    <Button variant="tertiary" size="sm" onClick={() => setShowClosableAlert(true)}>Mostrar aviso</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          <section aria-labelledby="cards-title">
            <div className="mb-activa-24">
              <h2 id="cards-title" className="font-display text-2xl font-semibold">Card</h2>
              <p className="mt-activa-8 text-text-secondary">Superficies para organizar contenido y acciones.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 md:grid-cols-2 xl:grid-cols-3">
              <Card variant="surface">
                <CardHeader><CardTitle>Surface</CardTitle><CardDescription>Superficie principal para contenido cotidiano.</CardDescription></CardHeader>
                <CardContent><p className="text-sm">Información clara sobre una oportunidad activa.</p></CardContent>
                <CardFooter><Button size="sm">Continuar</Button></CardFooter>
              </Card>
              <Card variant="muted">
                <CardHeader><CardTitle>Muted</CardTitle><CardDescription>Agrupación secundaria de bajo énfasis.</CardDescription></CardHeader>
                <CardContent><p className="text-sm">Datos complementarios y contexto de la experiencia.</p></CardContent>
                <CardFooter><Badge variant="neutral">Secundaria</Badge></CardFooter>
              </Card>
              <Card variant="inverse">
                <CardHeader><CardTitle>Inverse</CardTitle><CardDescription className="text-activa-mist">Contraste alto para momentos destacados.</CardDescription></CardHeader>
                <CardContent><p className="text-sm">Una superficie expresiva con texto de alto contraste.</p></CardContent>
                <CardFooter><Button variant="primary" size="sm">Explorar</Button></CardFooter>
              </Card>
              <Card variant="interactive" tabIndex={0} role="button" aria-label="Vista interactiva de oportunidad">
                <CardHeader><CardTitle>Interactive</CardTitle><CardDescription>Usá Tab para comprobar su foco visible.</CardDescription></CardHeader>
                <CardContent><p className="text-sm">Presenta respuesta visual sin ejecutar ninguna acción.</p></CardContent>
                <CardFooter><Badge variant="active">En foco</Badge></CardFooter>
              </Card>
              <Card variant="highlight">
                <CardHeader><CardTitle>Highlight</CardTitle><CardDescription>Énfasis cálido para contenido relevante.</CardDescription></CardHeader>
                <CardContent><p className="text-sm">Oportunidades que merecen atención especial.</p></CardContent>
                <CardFooter><Button variant="secondary" size="sm">Ver detalle</Button></CardFooter>
              </Card>
            </div>
          </section>

          <section aria-labelledby="brand-identity-title">
            <div className="mb-activa-24">
              <h2 id="brand-identity-title" className="font-display text-2xl font-semibold">Identidad de marca</h2>
              <p className="mt-activa-8 text-text-secondary">Aplicaciones oficiales del logotipo sobre fondos de contraste controlado.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 md:grid-cols-2">
              <Card>
                <CardContent className="flex min-h-48 items-center justify-center pt-activa-24">
                  <Image
                    src="/brand/logos/activa-logo-horizontal-color.svg"
                    alt="ACTIVA"
                    width={1600}
                    height={300}
                    className="h-auto w-full max-w-md"
                  />
                </CardContent>
                <CardFooter><p className="text-sm text-text-secondary">Logo horizontal color sobre superficie clara</p></CardFooter>
              </Card>
              <Card variant="inverse" className="overflow-hidden">
                <CardContent className="flex min-h-48 items-center justify-center pt-activa-24">
                  <Image
                    src="/brand/logos/activa-logo-horizontal-white.svg"
                    alt="ACTIVA en blanco"
                    width={1600}
                    height={300}
                    className="h-auto w-full max-w-md"
                  />
                </CardContent>
                <CardFooter><p className="text-sm text-text-inverse/75">Logo horizontal blanco sobre grafito</p></CardFooter>
              </Card>
              <Card>
                <CardContent className="flex min-h-56 items-center justify-center pt-activa-24">
                  <Image
                    src="/brand/logos/activa-logo-horizontal-tagline-color.svg"
                    alt="ACTIVA, oportunidades que se convierten en experiencias"
                    width={1600}
                    height={420}
                    className="h-auto w-full max-w-md"
                  />
                </CardContent>
                <CardFooter><p className="text-sm text-text-secondary">Logo horizontal con tagline</p></CardFooter>
              </Card>
              <Card variant="muted">
                <CardContent className="flex min-h-56 items-center justify-center pt-activa-24">
                  <Image
                    src="/brand/logos/activa-isotipo-color.svg"
                    alt="Isotipo de ACTIVA"
                    width={1024}
                    height={1024}
                    className="size-36 sm:size-40"
                  />
                </CardContent>
                <CardFooter><p className="text-sm text-text-secondary">Isotipo color sobre superficie secundaria</p></CardFooter>
              </Card>
            </div>
          </section>

          <section aria-labelledby="iconography-title">
            <div className="mb-activa-24">
              <h2 id="iconography-title" className="font-display text-2xl font-semibold">Iconografía</h2>
              <p className="mt-activa-8 text-text-secondary">Muestra funcional a 24 y 32 píxeles con nombres visibles.</p>
            </div>
            <Card>
              <CardContent className="grid grid-cols-2 gap-activa-12 pt-activa-24 sm:grid-cols-4 lg:grid-cols-8">
                {previewIcons.map((icon, index) => (
                  <div
                    key={icon.name}
                    className="flex min-h-28 flex-col items-center justify-center gap-activa-12 rounded-activa-md border border-border-default bg-background-surface-muted p-activa-12 text-center"
                  >
                    <ActivaIcon
                      name={icon.name}
                      size={index % 2 === 0 ? 32 : 24}
                      title={icon.label}
                      className="text-action-secondary"
                    />
                    <span className="text-xs font-semibold text-text-primary">{icon.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="graphic-system-title">
            <div className="mb-activa-24">
              <h2 id="graphic-system-title" className="font-display text-2xl font-semibold">Sistema gráfico</h2>
              <p className="mt-activa-8 text-text-secondary">Superficies, patrones y progresión aplicados con moderación.</p>
            </div>
            <div className="space-y-activa-24">
              <div className="grid grid-cols-1 gap-activa-16 lg:grid-cols-3">
                <ActivaSurface variant="light" activeCut className="min-h-48 border border-border-default p-activa-24 shadow-activa-sm">
                  <Badge variant="brand">Superficie clara</Badge>
                  <h3 className="mt-activa-16 font-display text-xl font-semibold">Claridad para el contenido principal</h3>
                  <p className="mt-activa-8 max-w-sm text-sm text-text-secondary">Una base cálida con identidad sutil.</p>
                </ActivaSurface>
                <ActivaSurface variant="dark" className="min-h-48 p-activa-24 shadow-activa-sm">
                  <Badge variant="brand">Superficie oscura</Badge>
                  <h3 className="mt-activa-16 font-display text-xl font-semibold">Contraste para mensajes destacados</h3>
                  <p className="mt-activa-8 max-w-sm text-sm text-text-inverse/75">Grafito y luz para una lectura precisa.</p>
                </ActivaSurface>
                <ActivaSurface variant="teal" className="min-h-48 p-activa-24 shadow-activa-sm">
                  <Badge variant="brand">Superficie teal</Badge>
                  <h3 className="mt-activa-16 font-display text-xl font-semibold">Confianza en momentos clave</h3>
                  <p className="mt-activa-8 max-w-sm text-sm text-white/80">Una superficie institucional para orientar acciones.</p>
                </ActivaSurface>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Progreso</CardTitle>
                  <CardDescription>Estados reales del componente de pasos ACTIVA.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <div className="min-w-[560px] pb-activa-8">
                    <ActivaProgressSteps
                      steps={[
                        { label: 'Datos', state: 'done' },
                        { label: 'Validación', state: 'active' },
                        { label: 'Confirmación', state: 'pending' },
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>

              <ActivaHero className="p-activa-24 sm:p-activa-40">
                <div className="max-w-2xl">
                  <Badge variant="brand">ACTIVA</Badge>
                  <h3 className="mt-activa-16 font-display text-2xl font-semibold sm:text-3xl">Oportunidades que se convierten en experiencias.</h3>
                  <p className="mt-activa-12 text-sm text-white/80 sm:text-base">Tecnología humana, clara y confiable.</p>
                </div>
              </ActivaHero>

              <div className="grid grid-cols-1 gap-activa-16 md:grid-cols-3">
                <div className="relative min-h-44 overflow-hidden rounded-activa-lg border border-border-default bg-background-surface shadow-activa-sm">
                  <ActivaPattern type="diagonal-light" className="absolute inset-0" />
                  <p className="absolute bottom-4 left-4 rounded-activa-full bg-background-surface px-activa-12 py-activa-8 text-sm font-semibold shadow-activa-xs">Diagonal claro</p>
                </div>
                <div className="relative min-h-44 overflow-hidden rounded-activa-lg bg-background-inverse shadow-activa-sm">
                  <ActivaPattern type="diagonal-dark" className="absolute inset-0" />
                  <p className="absolute bottom-4 left-4 rounded-activa-full bg-background-inverse px-activa-12 py-activa-8 text-sm font-semibold text-text-inverse shadow-activa-xs">Diagonal oscuro</p>
                </div>
                <div className="relative min-h-44 overflow-hidden rounded-activa-lg bg-activa-teal-soft shadow-activa-sm">
                  <ActivaPattern type="nodes" className="absolute inset-0" />
                  <p className="absolute bottom-4 left-4 rounded-activa-full bg-background-surface px-activa-12 py-activa-8 text-sm font-semibold shadow-activa-xs">Nodos de oportunidad</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
