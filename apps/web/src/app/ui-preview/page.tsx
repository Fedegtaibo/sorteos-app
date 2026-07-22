'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import {
  ActivaHero,
  ActivaPattern,
  ActivaProgressSteps,
  ActivaSurface,
} from '@/components/brand';
import { ActivaIcon, type ActivaIconName } from '@/components/icons';
import {
  BrandLogo,
  DashboardSidebar,
  MobileNavigation,
  NavigationItem,
  PageHeader,
  PublicHeader,
} from '@/components/layout';
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
  Checkbox,
  Divider,
  Input,
  Radio,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Textarea,
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

const publicNavigation = [
  { href: '/', label: 'Inicio', icon: 'home', active: true },
  { href: '/ayuda', label: 'Ayuda', icon: 'help' },
  { href: '/contacto', label: 'Contacto', icon: 'mail' },
  { href: '/login', label: 'Ingresar', icon: 'profile' },
] as const;

const dashboardNavigation = [
  { href: '/dashboard', label: 'Inicio', icon: 'home', active: true },
  { href: '/dashboard/explorar', label: 'Explorar', icon: 'search' },
  { href: '/dashboard/participaciones', label: 'Participaciones', icon: 'participation' },
  { href: '/dashboard/premios', label: 'Beneficios', icon: 'benefit' },
  { href: '/dashboard/perfil', label: 'Perfil', icon: 'profile' },
] as const;

const mobileNavigation = [
  { href: '/dashboard', label: 'Inicio', icon: 'home', active: true },
  { href: '/dashboard/explorar', label: 'Explorar', icon: 'search' },
  { href: '/dashboard/participaciones', label: 'Actividad', icon: 'participation' },
  { href: '/dashboard/perfil', label: 'Perfil', icon: 'profile' },
] as const;

export default function UiPreviewPage() {
  const [showClosableAlert, setShowClosableAlert] = useState(true);
  const [basicSwitch, setBasicSwitch] = useState(false);
  const [activeSwitch, setActiveSwitch] = useState(true);
  const [describedSwitch, setDescribedSwitch] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

          <section aria-labelledby="textarea-select-title">
            <div className="mb-activa-24">
              <h2 id="textarea-select-title" className="font-display text-2xl font-semibold">Textarea y Select</h2>
              <p className="mt-activa-8 text-text-secondary">Campos extensos y selecciones nativas para campañas y comercios.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-24 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Textarea</CardTitle>
                  <CardDescription>Mensajes, estados y restricciones de edición.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-activa-24 pt-activa-12 md:grid-cols-2">
                  <Textarea label="Descripción de campaña" placeholder="Contá de qué se trata la campaña" />
                  <Textarea
                    label="Condiciones de participación"
                    helperText="Explicá las condiciones con un lenguaje claro."
                    placeholder="Ingresá las condiciones"
                  />
                  <Textarea
                    label="Mensaje promocional"
                    error="El mensaje debe incluir una descripción de la propuesta."
                    defaultValue="Promoción disponible"
                  />
                  <Textarea
                    label="Resumen para revisión"
                    success="El resumen está listo para continuar."
                    defaultValue="Campaña preparada para la revisión del comercio."
                  />
                  <Textarea
                    label="Nota aprobada"
                    readOnly
                    defaultValue="Contenido validado por el equipo responsable."
                  />
                  <Textarea
                    label="Observaciones cerradas"
                    disabled
                    defaultValue="La campaña finalizada no admite cambios."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select</CardTitle>
                  <CardDescription>Opciones nativas con estados claramente comunicados.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-activa-24 pt-activa-12 md:grid-cols-2">
                  <Select label="Tipo de campaña" placeholder="Seleccioná una opción" defaultValue="">
                    <option value="beneficio">Beneficio</option>
                    <option value="experiencia">Experiencia</option>
                    <option value="promocion">Promoción</option>
                  </Select>
                  <Select label="Rubro del comercio" defaultValue="gastronomia">
                    <option value="gastronomia">Gastronomía</option>
                    <option value="bienestar">Bienestar</option>
                    <option value="tecnologia">Tecnología</option>
                  </Select>
                  <Select label="Alcance de campaña" error="Seleccioná un alcance válido." placeholder="Elegí el alcance" defaultValue="">
                    <option value="local">Local</option>
                    <option value="regional">Regional</option>
                  </Select>
                  <Select label="Estado editorial" success="La campaña está lista para revisión." defaultValue="lista">
                    <option value="borrador">Borrador</option>
                    <option value="lista">Lista para revisión</option>
                  </Select>
                  <Select label="Comercio asignado" readOnly defaultValue="comercio-demo">
                    <option value="comercio-demo">Comercio de demostración</option>
                  </Select>
                  <Select label="Categoría archivada" disabled defaultValue="archivo">
                    <option value="archivo">Campañas archivadas</option>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </section>

          <section aria-labelledby="selection-preferences-title">
            <div className="mb-activa-24">
              <h2 id="selection-preferences-title" className="font-display text-2xl font-semibold">Selección y preferencias</h2>
              <p className="mt-activa-8 text-text-secondary">Controles nativos y preferencias binarias con etiquetas explícitas.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Checkbox</CardTitle>
                  <CardDescription>Selecciones independientes y estados mixtos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-activa-16">
                  <Checkbox label="Incluir comercios asociados" />
                  <Checkbox label="Campaña destacada" defaultChecked />
                  <Checkbox label="Selección parcial" indeterminate />
                  <Checkbox
                    label="Aceptar revisión comercial"
                    description="El comercio podrá sugerir ajustes antes de publicar."
                  />
                  <Checkbox label="Confirmar condiciones" error="Debés confirmar las condiciones para continuar." />
                  <Checkbox label="Opción no disponible" disabled />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Radio</CardTitle>
                  <CardDescription>Una elección dentro de un conjunto relacionado.</CardDescription>
                </CardHeader>
                <CardContent>
                  <fieldset className="space-y-activa-16">
                    <legend className="mb-activa-16 text-sm font-semibold text-text-primary">Visibilidad de campaña</legend>
                    <Radio name="campaign-visibility" value="public" label="Pública" defaultChecked />
                    <Radio name="campaign-visibility" value="private" label="Privada" />
                    <Radio
                      name="campaign-visibility"
                      value="scheduled"
                      label="Programada"
                      description="Se publicará en la fecha definida por el comercio."
                    />
                    <Radio
                      name="campaign-visibility"
                      value="invalid"
                      label="Sin configuración"
                      error="Elegí una configuración disponible."
                    />
                    <Radio name="campaign-visibility" value="archived" label="Archivada" disabled />
                  </fieldset>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Switch</CardTitle>
                  <CardDescription>Preferencias inmediatas con estado anunciado.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-activa-16">
                  <Switch
                    checked={basicSwitch}
                    onCheckedChange={setBasicSwitch}
                    label="Notificaciones apagadas"
                  />
                  <Switch
                    checked={activeSwitch}
                    onCheckedChange={setActiveSwitch}
                    label="Alertas de campaña encendidas"
                  />
                  <Switch
                    checked={describedSwitch}
                    onCheckedChange={setDescribedSwitch}
                    label="Resumen semanal"
                    description="Recibí un resumen de actividad de campañas y comercios."
                  />
                  <Switch checked={false} disabled label="Preferencia no disponible" />
                </CardContent>
              </Card>
            </div>
          </section>

          <section aria-labelledby="loading-structure-title">
            <div className="mb-activa-24">
              <h2 id="loading-structure-title" className="font-display text-2xl font-semibold">Carga y estructura</h2>
              <p className="mt-activa-8 text-text-secondary">Indicadores de progreso, contenido provisional y separadores.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Spinner</CardTitle>
                  <CardDescription>Tamaños y variantes para distintos fondos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-activa-20">
                  <div className="flex flex-wrap items-end gap-activa-24">
                    <div className="flex flex-col items-center gap-activa-8">
                      <Spinner size="sm" label="Carga pequeña" />
                      <span className="text-xs text-text-secondary">Small</span>
                    </div>
                    <div className="flex flex-col items-center gap-activa-8">
                      <Spinner size="md" label="Carga mediana" />
                      <span className="text-xs text-text-secondary">Medium</span>
                    </div>
                    <div className="flex flex-col items-center gap-activa-8">
                      <Spinner size="lg" label="Carga grande" />
                      <span className="text-xs text-text-secondary">Large</span>
                    </div>
                    <div className="flex flex-col items-center gap-activa-8">
                      <Spinner variant="brand" label="Carga de marca" />
                      <span className="text-xs text-text-secondary">Brand</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-activa-md bg-background-inverse p-activa-16 text-text-inverse">
                    <span className="text-sm font-semibold">Inverse sobre grafito</span>
                    <Spinner variant="inverse" label="Cargando contenido inverso" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skeleton</CardTitle>
                  <CardDescription>Formas básicas que respetan reduced motion.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-activa-20">
                  <div>
                    <p className="mb-activa-8 text-xs font-semibold text-text-secondary">Texto</p>
                    <Skeleton variant="text" className="max-w-xs" />
                  </div>
                  <div>
                    <p className="mb-activa-8 text-xs font-semibold text-text-secondary">Circular</p>
                    <Skeleton variant="circular" />
                  </div>
                  <div>
                    <p className="mb-activa-8 text-xs font-semibold text-text-secondary">Rectangular</p>
                    <Skeleton variant="rectangular" />
                  </div>
                </CardContent>
              </Card>

              <Card aria-label="Tarjeta de campaña cargando" aria-busy="true">
                <CardHeader>
                  <CardTitle>Tarjeta en carga</CardTitle>
                  <CardDescription>Composición breve de contenido provisional.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-activa-16">
                  <Skeleton variant="rectangular" className="h-32" />
                  <div className="flex items-center gap-activa-12">
                    <Skeleton variant="circular" />
                    <div className="flex-1 space-y-activa-8">
                      <Skeleton variant="text" className="w-3/4" />
                      <Skeleton variant="text" className="w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-activa-16">
              <CardHeader>
                <CardTitle>Divider</CardTitle>
                <CardDescription>Separación semántica en contextos claros y oscuros.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-activa-24 pt-activa-12 lg:grid-cols-2">
                <div className="space-y-activa-16">
                  <p className="text-sm font-semibold">Separador horizontal</p>
                  <Divider />
                  <p className="text-sm text-text-secondary">Contenido posterior al separador.</p>
                  <Divider label="Nueva sección" />
                  <div className="flex h-12 items-center gap-activa-16">
                    <span className="text-sm font-semibold">Campaña</span>
                    <Divider orientation="vertical" />
                    <span className="text-sm text-text-secondary">Comercio asociado</span>
                  </div>
                </div>
                <div className="rounded-activa-md bg-background-inverse p-activa-20 text-text-inverse">
                  <p className="text-sm font-semibold">Contexto inverso</p>
                  <Divider color="inverse" label="Información" className="my-activa-16" />
                  <p className="text-sm text-text-inverse/75">El divisor mantiene contraste sobre la superficie grafito.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="brand-headers-title">
            <div className="mb-activa-24">
              <h2 id="brand-headers-title" className="font-display text-2xl font-semibold">Marca y encabezados</h2>
              <p className="mt-activa-8 text-text-secondary">Escalas de marca y estructura editorial para páginas ACTIVA.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>BrandLogo</CardTitle>
                  <CardDescription>Variantes oficiales en sus tres tamaños.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-activa-20">
                  <div>
                    <p className="mb-activa-12 text-xs font-semibold uppercase tracking-wider text-text-secondary">Color</p>
                    <div className="flex flex-wrap items-center gap-activa-24">
                      <BrandLogo variant="color" size="sm" alt="ACTIVA color pequeño" />
                      <BrandLogo variant="color" size="md" alt="ACTIVA color mediano" />
                      <BrandLogo variant="color" size="lg" alt="ACTIVA color grande" />
                    </div>
                  </div>
                  <div className="rounded-activa-md bg-background-inverse p-activa-20">
                    <p className="mb-activa-12 text-xs font-semibold uppercase tracking-wider text-text-inverse/75">Blanco sobre grafito</p>
                    <div className="flex flex-wrap items-center gap-activa-24">
                      <BrandLogo variant="white" size="sm" alt="ACTIVA blanco pequeño" />
                      <BrandLogo variant="white" size="md" alt="ACTIVA blanco mediano" />
                      <BrandLogo variant="white" size="lg" alt="ACTIVA blanco grande" />
                    </div>
                  </div>
                  <div>
                    <p className="mb-activa-12 text-xs font-semibold uppercase tracking-wider text-text-secondary">Símbolo</p>
                    <div className="flex flex-wrap items-center gap-activa-24">
                      <BrandLogo variant="symbol" size="sm" alt="Símbolo ACTIVA pequeño" />
                      <BrandLogo variant="symbol" size="md" alt="Símbolo ACTIVA mediano" />
                      <BrandLogo variant="symbol" size="lg" alt="Símbolo ACTIVA grande" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>PageHeader</CardTitle>
                  <CardDescription>Jerarquía, contexto, breadcrumbs y acciones.</CardDescription>
                </CardHeader>
                <CardContent className="pt-activa-24">
                  <PageHeader
                    eyebrow="Gestión de campañas"
                    title="Campañas activas"
                    description="Organizá oportunidades, revisá su estado y coordiná acciones con los comercios participantes."
                    breadcrumbs={[
                      { label: 'Inicio', href: '/dashboard' },
                      { label: 'Campañas', href: '/dashboard/sorteos' },
                      { label: 'Campañas activas' },
                    ]}
                    actions={(
                      <>
                        <Button variant="tertiary">Exportar</Button>
                        <Button>Nueva campaña</Button>
                      </>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          <section aria-labelledby="public-navigation-title">
            <div className="mb-activa-24">
              <h2 id="public-navigation-title" className="font-display text-2xl font-semibold">Navegación pública</h2>
              <p className="mt-activa-8 text-text-secondary">Headers claros y transparentes con navegación recibida por props.</p>
            </div>
            <div className="space-y-activa-16">
              <Card className="overflow-visible">
                <CardHeader>
                  <CardTitle>Variante light</CardTitle>
                  <CardDescription>Reducí el viewport para probar su menú móvil accesible.</CardDescription>
                </CardHeader>
                <CardContent className="pt-activa-12">
                  <div className="rounded-activa-md border border-border-default">
                    <PublicHeader
                      navigation={publicNavigation}
                      variant="light"
                      logoHref="/"
                      actions={<Button size="sm">Crear cuenta</Button>}
                      className="rounded-activa-md"
                    />
                  </div>
                </CardContent>
              </Card>

              <ActivaHero className="overflow-visible p-activa-16 sm:p-activa-24">
                <PublicHeader
                  navigation={publicNavigation}
                  variant="transparent"
                  logoVariant="white"
                  logoHref="/"
                  actions={(
                    <Link
                      href="/registro"
                      className="inline-flex h-9 items-center justify-center rounded-activa-sm bg-action-primary px-activa-12 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                    >
                      Crear cuenta
                    </Link>
                  )}
                  className="rounded-activa-md border-white/20 [&_nav_a]:!text-text-inverse"
                />
                <div className="px-activa-16 pb-activa-24 pt-activa-32 sm:px-activa-24">
                  <p className="font-display text-xl font-semibold text-text-inverse">Header transparente sobre sistema gráfico oscuro</p>
                  <p className="mt-activa-8 text-sm text-text-inverse/75">La estructura permanece legible sin agregar navegación específica.</p>
                </div>
              </ActivaHero>
            </div>
          </section>

          <section aria-labelledby="dashboard-navigation-title">
            <div className="mb-activa-24">
              <h2 id="dashboard-navigation-title" className="font-display text-2xl font-semibold">Navegación de dashboard</h2>
              <p className="mt-activa-8 text-text-secondary">Sidebar desacoplado de sesión, roles y autenticación.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 xl:grid-cols-[1fr_280px]">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Sidebar interactivo: {sidebarCollapsed ? 'colapsado' : 'desplegado'}</CardTitle>
                  <CardDescription>Usá el control lateral para alternar su estado.</CardDescription>
                </CardHeader>
                <CardContent className="pt-activa-12">
                  <div className="relative h-[520px] overflow-hidden rounded-activa-md border border-border-default bg-background-surface-muted">
                    <DashboardSidebar
                      items={dashboardNavigation}
                      collapsed={sidebarCollapsed}
                      onCollapsedChange={setSidebarCollapsed}
                      logoHref="/dashboard"
                      user={(
                        <div className="flex items-center gap-activa-8 rounded-activa-sm bg-background-surface-muted p-activa-8">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-activa-full bg-action-primary text-xs font-bold text-action-primary-text">UA</span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-text-primary">Usuario de ejemplo</p>
                            <p className="truncate text-xs text-text-secondary">Perfil demostrativo</p>
                          </div>
                        </div>
                      )}
                      footerAction={<Button variant="ghost" size="sm" className="w-full">Cerrar sesión</Button>}
                      className="!absolute !translate-x-0"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Sidebar colapsado</CardTitle>
                  <CardDescription>Iconos con tooltip nativo.</CardDescription>
                </CardHeader>
                <CardContent className="pt-activa-12">
                  <div className="relative h-[520px] overflow-hidden rounded-activa-md border border-border-default bg-background-surface-muted">
                    <DashboardSidebar
                      items={dashboardNavigation}
                      collapsed
                      logoHref="/dashboard"
                      user={<Badge variant="active">UA</Badge>}
                      footerAction={<Button variant="ghost" size="icon" aria-label="Cerrar sesión"><ActivaIcon name="logout" size={20} /></Button>}
                      className="!absolute !translate-x-0"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section aria-labelledby="items-mobile-navigation-title">
            <div className="mb-activa-24">
              <h2 id="items-mobile-navigation-title" className="font-display text-2xl font-semibold">Items y navegación móvil</h2>
              <p className="mt-activa-8 text-text-secondary">Estados individuales y una barra inferior de cuatro destinos reales.</p>
            </div>
            <div className="grid grid-cols-1 gap-activa-16 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>NavigationItem</CardTitle>
                  <CardDescription>Estados normal, activo, badge, disabled y collapsed.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-activa-8 pt-activa-12 sm:grid-cols-2">
                  <NavigationItem href="/ayuda" label="Normal" icon="help" />
                  <NavigationItem href="/dashboard" label="Activo" icon="home" active />
                  <NavigationItem href="/dashboard/participaciones" label="Con novedades" icon="participation" badge={<Badge variant="information" size="sm">3 nuevas</Badge>} />
                  <NavigationItem href="/contacto" label="No disponible" icon="mail" disabled />
                  <div className="w-20 rounded-activa-md border border-border-default p-activa-8">
                    <NavigationItem href="/dashboard/perfil" label="Perfil colapsado" icon="profile" collapsed />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>MobileNavigation</CardTitle>
                  <CardDescription>Simulación contenida; en uso real permanece fija y sólo móvil.</CardDescription>
                </CardHeader>
                <CardContent className="pt-activa-12">
                  <div className="relative mx-auto h-80 max-w-sm overflow-hidden rounded-activa-xl border-4 border-border-strong bg-background-surface-muted shadow-activa-md">
                    <div className="p-activa-20">
                      <BrandLogo variant="symbol" size="sm" />
                      <p className="mt-activa-24 font-display text-lg font-semibold">Vista móvil de ejemplo</p>
                      <p className="mt-activa-8 text-sm text-text-secondary">La navegación inferior conserva icono, texto y estado activo.</p>
                    </div>
                    <MobileNavigation items={mobileNavigation} className="!absolute md:!block" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
