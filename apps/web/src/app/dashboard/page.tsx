'use client';

import type { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { comercioApi, adminApi } from '@/lib/api';
import { formatMonto } from '@/lib/utils';
import Link from 'next/link';
import VentasChart from '@/components/VentasChart';
import EntregasChart from '@/components/EntregasChart';
import InstallAppButton from '@/components/InstallAppButton';
import { ActivaIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui';

type MetricCardVariant =
  | 'brand'
  | 'information'
  | 'success'
  | 'warning'
  | 'error';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  variant?: MetricCardVariant;
  sub?: ReactNode;
  compact?: boolean;
}

const metricValueClasses: Record<MetricCardVariant, string> = {
  brand: 'text-action-secondary',
  information: 'text-status-information',
  success: 'text-status-success',
  warning: 'text-status-warning',
  error: 'text-status-error',
};

function MetricCard({
  label,
  value,
  variant = 'warning',
  sub,
  compact = false,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className={compact ? 'p-activa-16' : 'p-activa-20'}>
        <p className="mb-activa-8 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </p>

        <div
          className={`${compact ? 'text-xl' : 'text-2xl'} font-display font-semibold ${metricValueClasses[variant]}`}
        >
          {value}
        </div>

        {sub && (
          <p className="mt-activa-4 text-xs text-text-secondary">
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  const {
    data: statsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['estadisticas', role],
    queryFn: () => (role === 'admin' ? adminApi.estadisticas() : comercioApi.estadisticas()),
    enabled: !!role && role !== 'participante',
  });

  const stats = (statsData as any)?.data?.data || (statsData as any)?.data;
  const requiereEstadisticas = role === 'comercio' || role === 'admin';
  const falloCargaEstadisticas = isError || error != null;

  if (role === 'participante') {
    return (
      <div className="mx-auto max-w-6xl space-y-activa-24">
        <PageHeader
          eyebrow="Participante"
          title="Mi cuenta"
          description={email || undefined}
        />

        <div className="grid gap-activa-16 md:grid-cols-2">
          <Card className="h-full">
            <CardContent className="flex h-full flex-col p-activa-24 sm:p-activa-32">
              <span className="flex size-12 items-center justify-center rounded-activa-md bg-action-primary/20 text-action-secondary">
                <ActivaIcon name="participation" size={24} />
              </span>

              <h2 className="mt-activa-20 font-display text-2xl font-semibold text-text-primary">
                Mis participaciones
              </h2>
              <p className="mt-activa-8 flex-1 text-sm leading-7 text-text-secondary">
                Revisá las campañas en las que participaste, tus números y comprobantes.
              </p>

              <Link
                href="/dashboard/participaciones"
                className="mt-activa-24 inline-flex h-11 w-fit items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                Ver participaciones
                <ActivaIcon name="arrow-right" size={18} />
              </Link>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="flex h-full flex-col p-activa-24 sm:p-activa-32">
              <span className="flex size-12 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary">
                <ActivaIcon name="campaign" size={24} />
              </span>

              <h2 className="mt-activa-20 font-display text-2xl font-semibold text-text-primary">
                Explorar campañas
              </h2>
              <p className="mt-activa-8 flex-1 text-sm leading-7 text-text-secondary">
                Buscá campañas activas y reservá tus próximos números.
              </p>

              <Link
                href="/dashboard/explorar"
                className="mt-activa-24 inline-flex h-11 w-fit items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                Ver campañas
                <ActivaIcon name="arrow-right" size={18} />
              </Link>
            </CardContent>
          </Card>

          <Card variant="muted" className="md:col-span-2">
            <CardContent className="flex flex-col gap-activa-20 p-activa-24 sm:flex-row sm:items-center sm:justify-between sm:p-activa-32">
              <div className="flex min-w-0 items-start gap-activa-16">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-activa-md bg-action-primary/20 text-action-secondary">
                  <ActivaIcon name="download" size={24} />
                </span>

                <div>
                  <h2 className="font-display text-2xl font-semibold text-text-primary">
                    Instalar ACTIVA
                  </h2>
                  <p className="mt-activa-8 max-w-2xl text-sm leading-7 text-text-secondary">
                    Agregá ACTIVA a la pantalla principal de tu celular y usala como una app.
                  </p>
                </div>
              </div>

              <InstallAppButton compact />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (requiereEstadisticas && isLoading) {
    return (
      <div
        aria-label="Cargando información del dashboard"
        className="space-y-activa-24"
      >
        <div className="space-y-activa-8">
          <Skeleton variant="text" className="h-8 max-w-sm" />
          <Skeleton variant="text" className="max-w-xl" />
        </div>

        <div className="grid gap-activa-16 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton variant="rectangular" className="h-28" />
          <Skeleton variant="rectangular" className="h-28" />
          <Skeleton variant="rectangular" className="h-28" />
          <Skeleton variant="rectangular" className="h-28" />
        </div>

        <Skeleton variant="rectangular" className="h-72" />
      </div>
    );
  }

  if (requiereEstadisticas && falloCargaEstadisticas) {
    return (
      <Alert
        variant="error"
        title="No pudimos cargar la información del dashboard."
        action={
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => void refetch()}
          >
            Reintentar
          </Button>
        }
      >
        Intentá nuevamente en unos instantes.
      </Alert>
    );
  }

  if (role === 'comercio' && stats) {
    if (stats.comercioEstado === 'sin_perfil') {
      return (
        <div className="mx-auto max-w-4xl space-y-activa-24">
          <PageHeader
            eyebrow="Comercio"
            title="Completá tu perfil de comercio"
            description="Necesitamos tus datos principales para habilitar las herramientas de ACTIVA."
          />

          <Card>
            <CardContent className="space-y-activa-24 p-activa-24 sm:p-activa-32">
              <div className="flex flex-col gap-activa-16 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex size-12 items-center justify-center rounded-activa-md bg-action-primary/20 text-action-secondary">
                  <ActivaIcon name="profile" size={24} />
                </span>
                <Badge variant="information" icon={<ActivaIcon name="info" size={14} />}>
                  Perfil incompleto
                </Badge>
              </div>

              <Alert
                variant="information"
                title="Completá los datos de tu comercio"
                icon={<ActivaIcon name="id-card" size={16} />}
              >
                Ingresá la razón social, el CUIT y el teléfono. Luego, el administrador
                revisará la solicitud.
              </Alert>

              <Link
                href="/dashboard/perfil"
                className="inline-flex h-11 w-fit items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                Completar mi perfil
                <ActivaIcon name="arrow-right" size={18} />
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (stats.comercioEstado && stats.comercioEstado !== 'aprobado') {
      const comercioRechazado = stats.comercioEstado === 'rechazado';
      const comercioSuspendido = stats.comercioEstado === 'suspendido';
      const estadoTitulo = comercioRechazado
        ? 'Tu comercio no fue aprobado'
        : comercioSuspendido
          ? 'Tu comercio está suspendido'
          : 'Tu comercio está pendiente de aprobación';
      const estadoDescripcion = comercioRechazado
        ? 'La solicitud no fue aprobada. Revisá tu perfil para comprobar que la información esté completa.'
        : comercioSuspendido
          ? 'El acceso a las herramientas del comercio está temporalmente suspendido.'
          : 'Recibimos tus datos y la solicitud está siendo revisada por un administrador.';
      const estadoBadge = comercioRechazado
        ? 'Solicitud no aprobada'
        : comercioSuspendido
          ? 'Comercio suspendido'
          : 'Revisión pendiente';

      return (
        <div className="mx-auto max-w-4xl space-y-activa-24">
          <PageHeader
            eyebrow="Estado del comercio"
            title={estadoTitulo}
            description={estadoDescripcion}
          />

          <Card>
            <CardContent className="space-y-activa-24 p-activa-24 sm:p-activa-32">
              <div className="flex flex-col gap-activa-16 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex size-12 items-center justify-center rounded-activa-md bg-background-surface-muted text-text-secondary">
                  <ActivaIcon
                    name={comercioRechazado ? 'error' : comercioSuspendido ? 'warning' : 'pending'}
                    size={24}
                  />
                </span>
                <Badge
                  variant={comercioRechazado ? 'error' : 'warning'}
                  icon={
                    <ActivaIcon
                      name={comercioRechazado ? 'error' : comercioSuspendido ? 'warning' : 'pending'}
                      size={14}
                    />
                  }
                >
                  {estadoBadge}
                </Badge>
              </div>

              <Alert
                variant={comercioRechazado ? 'error' : 'warning'}
                title={estadoTitulo}
                icon={
                  <ActivaIcon
                    name={comercioRechazado ? 'error' : comercioSuspendido ? 'warning' : 'pending'}
                    size={16}
                  />
                }
              >
                {comercioSuspendido
                  ? 'No podés publicar campañas ni consultar estadísticas completas mientras el acceso esté suspendido.'
                  : comercioRechazado
                    ? 'Podés revisar los datos registrados desde tu perfil.'
                    : 'Cuando finalice la revisión podrás publicar campañas y consultar estadísticas completas.'}
              </Alert>

              <div className="flex flex-col gap-activa-12 sm:flex-row">
                <Link
                  href="/dashboard/perfil"
                  className="inline-flex h-11 items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                >
                  <ActivaIcon name="profile" size={18} />
                  Ver mi perfil
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                >
                  Ir al inicio público
                  <ActivaIcon name="arrow-right" size={18} />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    const {
  sorteos,
  recaudacion,
  participantes = { unicos: 0, ventasTotales: 0 },
  entregas = { pendientes: 0, enviados: 0, entregados: 0, confirmados: 0, reclamados: 0 },
  topSorteos = [],
  ventasUltimos30Dias = [],
topCompradores = [],
} = stats;

const ticketPromedio =
  participantes.ventasTotales > 0
    ? recaudacion.bruta / participantes.ventasTotales
    : 0;

const porcentajePromedio =
  topSorteos.length > 0
    ? Math.round(
        topSorteos.reduce(
          (acc: number, s: any) => acc + s.porcentajeVendido,
          0,
        ) / topSorteos.length,
      )
    : 0;

const mejorSorteo = topSorteos[0]?.nombre || '-';

    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <PageHeader
            eyebrow="Panel de comercio"
            title="Dashboard"
            description="Resumen avanzado de ventas, comisiones y logística."
            className="mb-activa-32"
            actions={
              <>
                <InstallAppButton compact className="w-full sm:w-auto" />
                <Link
                  href="/dashboard/sorteos/nuevo"
                  className="inline-flex h-9 w-full items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-12 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 sm:w-auto"
                >
                  <ActivaIcon name="plus" size={16} />
                  Nueva campaña
                </Link>
              </>
            }
          />
            
          <div className="mb-activa-32">
  <VentasChart data={ventasUltimos30Dias} />
</div>

<div className="mb-activa-32 grid gap-activa-24 lg:grid-cols-2">

  <EntregasChart entregas={entregas} />

  <Card>
    <CardHeader>
      <CardTitle>Resumen de logística</CardTitle>
      <CardDescription>Estado actual de todos los beneficios.</CardDescription>
    </CardHeader>

    <CardContent>
      <div className="space-y-activa-12">
        <div className="flex items-center justify-between gap-activa-16 rounded-activa-sm bg-background-surface-muted px-activa-16 py-activa-12">
          <span className="text-sm text-text-secondary">Pendientes</span>
          <Badge variant="warning">{entregas.pendientes}</Badge>
        </div>

        <div className="flex items-center justify-between gap-activa-16 rounded-activa-sm bg-background-surface-muted px-activa-16 py-activa-12">
          <span className="text-sm text-text-secondary">Enviados</span>
          <Badge variant="information">{entregas.enviados}</Badge>
        </div>

        <div className="flex items-center justify-between gap-activa-16 rounded-activa-sm bg-background-surface-muted px-activa-16 py-activa-12">
          <span className="text-sm text-text-secondary">Entregados</span>
          <Badge variant="success">{entregas.entregados}</Badge>
        </div>

        <div className="flex items-center justify-between gap-activa-16 rounded-activa-sm bg-background-surface-muted px-activa-16 py-activa-12">
          <span className="text-sm text-text-secondary">Confirmados</span>
          <Badge variant="active">{entregas.confirmados}</Badge>
        </div>

        <div className="flex items-center justify-between gap-activa-16 rounded-activa-sm bg-background-surface-muted px-activa-16 py-activa-12">
          <span className="text-sm text-text-secondary">Reclamos</span>
          <Badge variant="error">{entregas.reclamados}</Badge>
        </div>
      </div>
    </CardContent>
  </Card>

</div>


<div className="mb-activa-32 grid gap-activa-16 md:grid-cols-2 lg:grid-cols-4">

  <MetricCard
    label="Ticket promedio"
    value={formatMonto(ticketPromedio)}
    variant="warning"
  />

  <MetricCard
    label="Ventas totales"
    value={participantes.ventasTotales}
    variant="information"
  />

  <MetricCard
    label="% promedio vendido"
    value={`${porcentajePromedio}%`}
    variant="success"
  />

  <MetricCard
    label="Mejor campaña"
    value={mejorSorteo}
    variant="brand"
  />

</div>



          <div className="mb-activa-32 grid gap-activa-16 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard label="Recaudación bruta" value={formatMonto(recaudacion.bruta)} variant="warning" />
            <MetricCard label="Comisión" value={formatMonto(recaudacion.comision)} variant="error" />
            <MetricCard label="Ganancia neta" value={formatMonto(recaudacion.neta)} variant="success" />
            <MetricCard label="Campañas activas" value={sorteos.activos} variant="information" />
            <MetricCard label="Participantes" value={participantes.unicos} variant="brand" />
            <MetricCard label="Reclamos" value={entregas.reclamados} variant="error" />
          </div>

          <div className="mb-activa-32 grid gap-activa-24 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-activa-16">
                <div>
                  <CardTitle>Campañas destacadas</CardTitle>
                  <CardDescription>Las campañas con mayor recaudación.</CardDescription>
                </div>
                <Link
                  href="/dashboard/sorteos"
                  className="inline-flex shrink-0 items-center gap-activa-4 rounded-activa-xs text-sm font-semibold text-text-link transition-colors duration-fast ease-activa hover:text-action-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  Ver todas
                  <ActivaIcon name="arrow-right" size={16} />
                </Link>
              </CardHeader>

              <CardContent>
              {topSorteos.length === 0 ? (
                <Alert variant="information" icon={<ActivaIcon name="chart" size={16} />}>
                  Todavía no hay ventas registradas.
                </Alert>
              ) : (
                <div className="space-y-activa-12">
                  {topSorteos.map((s: any) => (
                    <div
                      key={s.id}
                      className="rounded-activa-md border border-border-default bg-background-surface-muted p-activa-16"
                    >
                      <div className="flex items-center justify-between gap-activa-16">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-text-primary">{s.nombre}</p>
                          <p className="mt-activa-4 text-xs text-text-secondary">
                            {s.vendidos}/{s.totalNumeros} vendidos · {s.porcentajeVendido}%
                          </p>
                        </div>
                        <p className="shrink-0 font-display font-semibold text-status-success">
                          {formatMonto(s.recaudacion)}
                        </p>
                      </div>
                      <div className="mt-activa-12 h-2 overflow-hidden rounded-activa-full bg-border-default">
                        <div
                          className="h-full rounded-activa-full bg-action-primary"
                          style={{ width: `${Math.min(s.porcentajeVendido, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participantes destacados</CardTitle>
                <CardDescription>Participantes con más compras.</CardDescription>
              </CardHeader>

              <CardContent>
                {topCompradores.length === 0 ? (
                  <Alert variant="information" icon={<ActivaIcon name="user" size={16} />}>
                    Todavía no hay datos suficientes.
                  </Alert>
                ) : (
                  <div className="space-y-activa-12">
                    {topCompradores.map((u: any, index: number) => (
                      <div
                        key={u.email}
                        className="flex items-center justify-between gap-activa-16 rounded-activa-md border border-border-default bg-background-surface-muted p-activa-16"
                      >
                        <div className="min-w-0">
                          <Badge variant="brand" size="sm">
                            #{index + 1}
                          </Badge>
                          <p className="mt-activa-4 truncate text-sm text-text-secondary">
                            {u.email}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="font-display text-xl font-semibold text-action-secondary">
                            {u.total}
                          </p>
                          <p className="text-xs text-text-secondary">
                            compras
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logística</CardTitle>
                <CardDescription>Estado general de entregas y beneficios.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-activa-12">
                  <MetricCard label="Pendientes" value={entregas.pendientes} variant="warning" compact />
                  <MetricCard label="Enviados" value={entregas.enviados} variant="brand" compact />
                  <MetricCard label="Entregados" value={entregas.entregados} variant="success" compact />
                  <MetricCard label="Confirmados" value={entregas.confirmados} variant="success" compact />
                </div>

                <Link
                  href="/dashboard/entregas"
                  className="mt-activa-20 inline-flex h-11 items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                >
                  <ActivaIcon name="delivery" size={18} />
                  Gestionar entregas
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-activa-16 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Mis campañas</CardTitle>
                <CardDescription>
                  Administrá tus campañas activas, borradores y finalizadas.
                </CardDescription>
              </div>
              <Link
                href="/dashboard/sorteos"
                className="inline-flex shrink-0 items-center gap-activa-4 rounded-activa-xs text-sm font-semibold text-text-link transition-colors duration-fast ease-activa hover:text-action-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                Ver todos
                <ActivaIcon name="arrow-right" size={16} />
              </Link>
            </CardHeader>

            <CardContent>
              <Link
                href="/dashboard/sorteos"
                className="inline-flex h-11 items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                <ActivaIcon name="campaign" size={18} />
                Ir al listado
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  if (role === 'admin' && stats) {
    const { usuarios, comercios, sorteos, finanzas } = stats;

    return (
      <div className="mx-auto max-w-7xl space-y-activa-24">
        <PageHeader
          eyebrow="Panel de administración"
          title="Dashboard"
          description="Control general de comercios, usuarios, campañas y comisiones."
        />

        {comercios.pendientes > 0 && (
          <Alert
            variant="warning"
            title={`${comercios.pendientes} comercio(s) pendiente(s) de aprobación`}
            icon={<ActivaIcon name="pending" size={16} />}
            action={
              <Link
                href="/dashboard/admin/comercios"
                className="inline-flex h-9 items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-12 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                Revisar ahora
                <ActivaIcon name="arrow-right" size={16} />
              </Link>
            }
          >
            Revisá las solicitudes para habilitar nuevas campañas.
          </Alert>
        )}

        <div className="grid gap-activa-16 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Volumen operado" value={formatMonto(finanzas.volumenTotal)} variant="warning" />
          <MetricCard label="Comercios activos" value={comercios.aprobados} variant="success" />
          <MetricCard label="Campañas activas" value={sorteos.activos} variant="information" />
          <MetricCard label="Participantes" value={usuarios.participantes} variant="brand" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-page text-text-primary">
      <div className="flex w-full max-w-xs flex-col items-center gap-activa-12 px-activa-24 text-center">
        <Skeleton variant="text" className="w-24" />
        <p className="text-sm font-semibold text-text-secondary">Cargando...</p>
      </div>
    </main>
  );
}
