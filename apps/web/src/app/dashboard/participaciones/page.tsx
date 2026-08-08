'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { ActivaIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout';
import { Alert, Badge, Card, CardContent, Skeleton } from '@/components/ui';
import { pagosApi } from '@/lib/api';
import { formatMonto, formatFecha } from '@/lib/utils';

function EstadoBadge({ estado, ganador }: { estado: string; ganador: boolean }) {
  if (ganador) {
    return (
      <Badge
        variant="brand"
        size="sm"
        icon={<ActivaIcon name="selection" size={14} />}
      >
        Persona seleccionada
      </Badge>
    );
  }

  if (estado === 'activo') {
    return (
      <Badge variant="active" size="sm">
        Participando
      </Badge>
    );
  }

  if (estado === 'finalizado') {
    return (
      <Badge variant="neutral" size="sm">
        Finalizada
      </Badge>
    );
  }

  return (
    <Badge variant="neutral" size="sm">
      {estado || 'Registrada'}
    </Badge>
  );
}

function ComprobanteBadge({ codigo }: { codigo?: string | null }) {
  if (codigo) {
    return (
      <Badge
        variant="success"
        size="sm"
        icon={<ActivaIcon name="receipt" size={14} />}
      >
        Comprobante emitido
      </Badge>
    );
  }

  return (
    <Badge variant="warning" size="sm" icon={<ActivaIcon name="pending" size={14} />}>
      Comprobante pendiente
    </Badge>
  );
}

export default function ParticipacionesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['mis-participaciones'],
    queryFn: () => pagosApi.misParticipaciones() as any,
  });

  const participaciones: any[] = (data as any)?.data || [];

  const totalInvertido = participaciones.reduce(
    (acc, p) => acc + Number(p.monto_pagado || 0),
    0,
  );

  const ganadas = participaciones.filter(
    (p) => p.ganador_participacion_id === p.id,
  ).length;

  const activas = participaciones.filter(
    (p) => p.sorteo_estado === 'activo',
  ).length;

  if (isLoading) {
    return (
      <div aria-label="Cargando participaciones" className="space-y-activa-24">
        <Card>
          <CardContent className="space-y-activa-12 p-activa-20 sm:p-activa-24">
            <Skeleton variant="text" className="h-8 max-w-sm" />
            <Skeleton variant="text" className="max-w-2xl" />
          </CardContent>
        </Card>
        <div className="grid gap-activa-16 md:grid-cols-2">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-w-0 space-y-activa-24 text-text-primary sm:space-y-activa-32">
      <section className="rounded-activa-lg border border-border-default bg-background-surface p-activa-20 shadow-activa-sm sm:p-activa-24 lg:p-activa-32">
        <PageHeader
          eyebrow="Participante"
          title="Mis participaciones"
          description="Consultá tus opciones registradas, la campaña asociada, el comercio impulsor, el monto abonado y el comprobante de cada participación."
          actions={(
            <Link
              href="/dashboard/explorar"
              className="inline-flex h-11 w-full items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 sm:w-auto"
            >
              <ActivaIcon name="search" size={18} />
              Explorar campañas
            </Link>
          )}
        />

        <div className="mt-activa-24 grid grid-cols-2 gap-activa-12 lg:grid-cols-4">
          {[
            { label: 'Participaciones', value: participaciones.length, icon: 'participation' as const },
            { label: 'Campañas activas', value: activas, icon: 'campaign' as const },
            { label: 'Seleccionadas', value: ganadas, icon: 'selection' as const },
          ].map((metric) => (
            <Card key={metric.label} variant="muted" className="min-w-0">
              <CardContent className="p-activa-16">
                <span className="flex size-9 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
                  <ActivaIcon name={metric.icon} size={18} />
                </span>
                <p className="mt-activa-12 break-words font-display text-2xl font-semibold text-text-primary">
                  {metric.value}
                </p>
                <p className="mt-activa-4 text-xs text-text-secondary">{metric.label}</p>
              </CardContent>
            </Card>
          ))}

          <Card variant="highlight" className="col-span-2 min-w-0 lg:col-span-1">
            <CardContent className="p-activa-16">
              <span className="flex size-9 items-center justify-center rounded-activa-full bg-action-primary text-action-primary-text">
                <ActivaIcon name="card" size={18} />
              </span>
              <p className="mt-activa-12 break-words font-display text-2xl font-semibold text-text-primary">
                {formatMonto(totalInvertido)}
              </p>
              <p className="mt-activa-4 text-xs text-text-secondary">Total participado</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Alert
        variant="information"
        title="Actualización de pagos"
        icon={<ActivaIcon name="info" size={16} />}
      >
        Si acabás de pagar y todavía no ves tu participación, esperá unos segundos y actualizá la
        página. Algunos pagos pueden demorar en impactar. Antes de repetir una operación, revisá
        esta sección.
      </Alert>

      {participaciones.length === 0 ? (
        <Card variant="muted" className="border-dashed">
          <CardContent className="py-activa-40 text-center sm:py-activa-48">
            <span className="mx-auto grid size-12 place-items-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
              <ActivaIcon name="participation" size={24} />
            </span>
            <h2 className="mt-activa-16 font-display text-xl font-semibold text-text-primary">
              Todavía no tenés participaciones registradas
            </h2>
            <p className="mx-auto mt-activa-8 max-w-md text-sm leading-6 text-text-secondary">
              Cuando elijas una opción en una campaña y el pago sea confirmado, tu participación
              aparecerá en esta pantalla.
            </p>
            <div className="mt-activa-20 flex flex-col justify-center gap-activa-12 sm:flex-row">
              <Link
                href="/dashboard/explorar"
                className="inline-flex h-11 items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                <ActivaIcon name="search" size={18} />
                Explorar campañas
              </Link>
              <Link
                href="/contacto"
                className="inline-flex h-11 items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                <ActivaIcon name="headset" size={18} />
                Contactar soporte
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <section aria-label="Participaciones registradas" className="space-y-activa-16">
          {participaciones.map((p: any) => {
            const esGanador = p.ganador_participacion_id === p.id;

            return (
              <Card key={p.id} variant={esGanador ? 'highlight' : 'surface'} className="min-w-0">
                <CardContent className="p-activa-16 sm:p-activa-20 lg:p-activa-24">
                  <div className="flex min-w-0 flex-col gap-activa-20 lg:flex-row lg:items-start">
                    <div
                      className={`flex size-16 shrink-0 items-center justify-center rounded-activa-md font-display text-xl font-semibold ${
                        esGanador
                          ? 'bg-action-primary text-action-primary-text'
                          : 'bg-activa-teal-soft text-action-secondary'
                      }`}
                    >
                      #{p.numero_visible}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-activa-8">
                        <h2 className="min-w-0 max-w-full break-words font-display text-lg font-semibold text-text-primary sm:text-xl">
                          {p.sorteo_nombre}
                        </h2>
                        <EstadoBadge estado={p.sorteo_estado} ganador={esGanador} />
                        <ComprobanteBadge codigo={p.comprobante_codigo} />
                      </div>

                      <div className="mt-activa-16 grid grid-cols-2 gap-activa-12 lg:grid-cols-5">
                        {[
                          { label: 'Comercio impulsor', value: p.comercio || 'No informado' },
                          { label: 'Opción registrada', value: `#${p.numero_visible}` },
                          { label: 'Monto abonado', value: formatMonto(Number(p.monto_pagado || 0)) },
                          { label: 'Fecha', value: formatFecha(p.created_at) },
                        ].map((detail) => (
                          <div key={detail.label} className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12">
                            <p className="text-xs text-text-secondary">{detail.label}</p>
                            <p className="mt-activa-4 break-words text-sm font-semibold text-text-primary">
                              {detail.value}
                            </p>
                          </div>
                        ))}

                        <div className="col-span-2 min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12 lg:col-span-1">
                          <p className="text-xs text-text-secondary">Comprobante</p>
                          <p className="mt-activa-4 break-all text-sm font-semibold text-text-primary">
                            {p.comprobante_codigo || 'Pendiente de emisión'}
                          </p>
                          {p.comprobante_emitido_at && (
                            <p className="mt-activa-4 text-xs text-text-secondary">
                              Emitido: {formatFecha(p.comprobante_emitido_at)}
                            </p>
                          )}
                        </div>
                      </div>

                      <Alert
                        variant={esGanador ? 'brand' : 'information'}
                        icon={<ActivaIcon name={esGanador ? 'selection' : 'info'} size={16} />}
                        className="mt-activa-16"
                      >
                        Esta participación queda asociada a tu cuenta. Cuando la campaña finalice,
                        si esta opción resulta seleccionada, el estado se actualizará en esta misma
                        pantalla.
                      </Alert>
                    </div>

                    <div className="flex min-w-0 shrink-0 flex-col gap-activa-8 sm:flex-row sm:flex-wrap lg:w-44 lg:flex-col">
                      {p.sorteo_id && (
                        <Link
                          href={`/sorteos/${p.sorteo_id}`}
                          className="inline-flex h-11 w-full items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 sm:w-auto lg:w-full"
                        >
                          <ActivaIcon name="eye" size={18} />
                          Ver campaña
                        </Link>
                      )}

                      {p.comprobante_url ? (
                        <a
                          href={p.comprobante_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 w-full items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 sm:w-auto lg:w-full"
                        >
                          <ActivaIcon name="receipt" size={18} />
                          Ver comprobante
                        </a>
                      ) : (
                        <span className="inline-flex h-11 w-full items-center justify-center rounded-activa-sm border border-border-default bg-background-surface-muted px-activa-16 text-sm font-semibold text-text-disabled sm:w-auto lg:w-full">
                          Sin PDF
                        </span>
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
