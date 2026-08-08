'use client';

import Link from 'next/link';

import { ActivaIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  Skeleton,
} from '@/components/ui';
import {
  useMisSorteos,
  useActivarSorteo,
  useSortearSorteo,
} from '@/hooks/use-sorteo';
import { formatMonto } from '@/lib/utils';

export default function MisSorteosPage() {
  const { data, isLoading } = useMisSorteos();
  const activar = useActivarSorteo();
  const sortear = useSortearSorteo();

  const sorteos: any[] = (data as any)?.data?.data || [];

  const totalSorteos = sorteos.length;
  const activos = sorteos.filter((s) => s.estado === 'activo').length;
  const borradores = sorteos.filter((s) => s.estado === 'borrador').length;
  const finalizados = sorteos.filter((s) => s.estado === 'finalizado').length;

  const numerosVendidos = sorteos.reduce(
    (acc, s) => acc + Number(s.stats?.vendidos || 0),
    0,
  );

  const recaudacionTotal = sorteos.reduce((acc, s) => {
    const vendidos = Number(s.stats?.vendidos || 0);
    const valorNumero = Number(s.valor_numero || 0);

    return acc + vendidos * valorNumero;
  }, 0);

  if (isLoading) {
    return (
      <div aria-label="Cargando campañas" className="space-y-activa-24">
        <Card>
          <CardContent className="space-y-activa-12 p-activa-20 sm:p-activa-24">
            <Skeleton variant="text" className="h-8 max-w-sm" />
            <Skeleton variant="text" className="max-w-2xl" />
          </CardContent>
        </Card>
        <div className="grid gap-activa-16 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
          <Skeleton className="h-56 sm:col-span-2 xl:col-span-1" />
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-activa-24 text-text-primary sm:space-y-activa-32">
      <section className="rounded-activa-lg border border-border-default bg-background-surface p-activa-20 shadow-activa-sm sm:p-activa-24 lg:p-activa-32">
        <PageHeader
          eyebrow="Comercio"
          title="Mis campañas"
          description="Administrá tus campañas, revisá las participaciones registradas, controlá la recaudación estimada y seguí cada publicación desde un solo lugar."
          actions={(
            <Link
              href="/dashboard/sorteos/nuevo"
              className="inline-flex h-11 w-full items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 sm:w-auto"
            >
              <ActivaIcon name="plus" size={18} />
              Crear campaña
            </Link>
          )}
        />

        <div className="mt-activa-24 grid grid-cols-2 gap-activa-12 lg:grid-cols-5">
          {[
            { label: 'Campañas', value: totalSorteos, icon: 'campaign' as const },
            { label: 'Activas', value: activos, icon: 'check-circle' as const },
            { label: 'Borradores', value: borradores, icon: 'edit' as const },
            { label: 'Finalizadas', value: finalizados, icon: 'result' as const },
          ].map((metric) => (
            <Card key={metric.label} variant="muted">
              <CardContent className="p-activa-16">
                <span className="flex size-9 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
                  <ActivaIcon name={metric.icon} size={18} />
                </span>
                <p className="mt-activa-12 font-display text-2xl font-semibold text-text-primary">
                  {metric.value}
                </p>
                <p className="mt-activa-4 text-xs text-text-secondary">{metric.label}</p>
              </CardContent>
            </Card>
          ))}

          <Card variant="highlight" className="col-span-2 lg:col-span-1">
            <CardContent className="p-activa-16">
              <span className="flex size-9 items-center justify-center rounded-activa-full bg-action-primary text-action-primary-text">
                <ActivaIcon name="trend-up" size={18} />
              </span>
              <p className="mt-activa-12 break-words font-display text-2xl font-semibold text-text-primary">
                {formatMonto(recaudacionTotal)}
              </p>
              <p className="mt-activa-4 text-xs text-text-secondary">Recaudación estimada</p>
            </CardContent>
          </Card>
        </div>

        <p className="mt-activa-12 text-xs text-text-secondary">
          {numerosVendidos} participaciones registradas en total.
        </p>
      </section>

      <Alert
        variant="warning"
        title="Revisá la información antes de activar"
        icon={<ActivaIcon name="warning" size={16} />}
      >
        Antes de activar una campaña, verificá el beneficio, el valor y la cantidad de opciones
        disponibles. Una vez activa, las personas podrán comenzar a participar.
      </Alert>

      {sorteos.length === 0 ? (
        <Card variant="muted" className="border-dashed">
          <CardContent className="py-activa-40 text-center sm:py-activa-48">
            <span className="mx-auto grid size-12 place-items-center rounded-activa-full bg-action-primary/15 text-action-primary-text">
              <ActivaIcon name="campaign" size={24} />
            </span>
            <h2 className="mt-activa-16 font-display text-xl font-semibold text-text-primary">
              Todavía no creaste campañas
            </h2>
            <p className="mx-auto mt-activa-8 max-w-md text-sm leading-6 text-text-secondary">
              Creá tu primera campaña presentando el producto o experiencia, las condiciones, las
              opciones disponibles y la fecha estimada de selección.
            </p>
            <div className="mt-activa-20 flex flex-col justify-center gap-activa-12 sm:flex-row">
              <Link
                href="/dashboard/sorteos/nuevo"
                className="inline-flex h-11 items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                <ActivaIcon name="plus" size={18} />
                Crear primera campaña
              </Link>
              <Link
                href="/ayuda"
                className="inline-flex h-11 items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                <ActivaIcon name="help" size={18} />
                Ver ayuda
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <section aria-label="Campañas" className="space-y-activa-16">
          {sorteos.map((s: any) => {
            const vendidos = Number(s.stats?.vendidos || 0);
            const totalNumeros = Number(s.cant_numeros || 0);
            const valorNumero = Number(s.valor_numero || 0);
            const disponibles = Math.max(totalNumeros - vendidos, 0);
            const pct =
              totalNumeros > 0
                ? Math.min(100, Math.round((vendidos / totalNumeros) * 100))
                : 0;
            const recaudacion = vendidos * valorNumero;
            const potencial = totalNumeros * valorNumero;

            return (
              <Card key={s.id}>
                <CardContent className="p-activa-16 sm:p-activa-20 lg:p-activa-24">
                  <div className="flex flex-col gap-activa-20 lg:flex-row lg:items-start">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary">
                      <ActivaIcon name="campaign" size={24} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-activa-8">
                        <h2 className="min-w-0 max-w-full break-words font-display text-lg font-semibold text-text-primary sm:text-xl">
                          {s.nombre}
                        </h2>
                        <Badge
                          variant={
                            s.estado === 'activo'
                              ? 'active'
                              : s.estado === 'finalizado'
                                ? 'success'
                                : 'neutral'
                          }
                          size="sm"
                        >
                          {s.estado}
                        </Badge>
                      </div>

                      <div className="mt-activa-16 grid grid-cols-2 gap-activa-12 sm:grid-cols-3 xl:grid-cols-5">
                        {[
                          { label: 'Registradas', value: `${vendidos}/${totalNumeros}` },
                          { label: 'Disponibles', value: disponibles },
                          { label: 'Valor por opción', value: formatMonto(valorNumero) },
                          { label: 'Recaudación', value: formatMonto(recaudacion) },
                          { label: 'Potencial total', value: formatMonto(potencial) },
                        ].map((detail) => (
                          <div
                            key={detail.label}
                            className="rounded-activa-md bg-background-surface-muted p-activa-12"
                          >
                            <p className="text-xs text-text-secondary">{detail.label}</p>
                            <p className="mt-activa-4 break-words text-sm font-semibold text-text-primary">
                              {detail.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-activa-16 rounded-activa-md border border-border-default bg-background-surface p-activa-16">
                        <div className="flex items-end justify-between gap-activa-12">
                          <div>
                            <p className="text-sm font-semibold text-text-primary">Avance de participación</p>
                            <p className="mt-activa-4 text-xs text-text-secondary">
                              {vendidos} de {totalNumeros} opciones registradas
                            </p>
                          </div>
                          <p className="font-display text-2xl font-semibold text-action-secondary">{pct}%</p>
                        </div>
                        <div className="mt-activa-12 h-2 overflow-hidden rounded-activa-full bg-background-surface-muted">
                          <div
                            className="h-full rounded-activa-full bg-action-secondary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <p className="mt-activa-12 text-xs leading-5 text-text-secondary">
                        Estimación basada en las opciones registradas y el valor publicado. La
                        información final puede depender del estado de pagos y comprobantes.
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-activa-8 sm:flex-row sm:flex-wrap lg:w-48 lg:flex-col">
                      {s.estado === 'borrador' && (
                        <Button
                          onClick={() => activar.mutate(s.id)}
                          disabled={activar.isPending}
                          leftIcon={<ActivaIcon name="check-circle" size={18} />}
                          className="w-full sm:w-auto lg:w-full"
                        >
                          Activar campaña
                        </Button>
                      )}

                      {(s.estado === 'activo' || s.estado === 'finalizado') && (
                        <Link
                          href={`/sorteos/${s.id}`}
                          className="inline-flex h-11 w-full items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 sm:w-auto lg:w-full"
                        >
                          <ActivaIcon name="eye" size={18} />
                          Ver página pública
                        </Link>
                      )}

                      {s.estado === 'activo' && (
                        <Button
                          variant="secondary"
                          disabled={sortear.isPending}
                          onClick={() =>
                            sortear.mutate({
                              id: s.id,
                              seedExterno: `${Date.now()}-${Math.random()}`,
                            })
                          }
                          leftIcon={<ActivaIcon name="selection" size={18} />}
                          className="w-full sm:w-auto lg:w-full"
                        >
                          Realizar selección
                        </Button>
                      )}

                      <Link
                        href="/contacto"
                        className="inline-flex h-11 w-full items-center justify-center gap-activa-8 rounded-activa-sm px-activa-16 text-sm font-semibold text-text-secondary transition-colors duration-fast ease-activa hover:bg-background-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus sm:w-auto lg:w-full"
                      >
                        <ActivaIcon name="help" size={18} />
                        Ayuda
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </main>
  );
}
