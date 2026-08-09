'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout';
import {
  Badge,
  type BadgeVariant,
  Button,
  Card,
  CardContent,
  Skeleton,
} from '@/components/ui';
import { adminApi } from '@/lib/api';
import { formatFecha, formatMonto } from '@/lib/utils';
import toast from 'react-hot-toast';

const fondosBadge: Record<string, BadgeVariant> = {
  retenido: 'warning',
  liberado: 'success',
};

export default function AdminReclamosPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reclamos'],
    queryFn: () => adminApi.reclamos() as any,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-reclamos'] });
  };

  const liberar = useMutation({
    mutationFn: (id: string) => adminApi.liberarReclamo(id),
    onSuccess: () => {
      toast.success('Fondos liberados');
      refresh();
    },
    onError: (err: any) => toast.error(err.message || 'Error al liberar'),
  });

  const revision = useMutation({
    mutationFn: (id: string) => adminApi.ponerEnRevision(id),
    onSuccess: () => {
      toast.success('Reclamo en revisión');
      refresh();
    },
    onError: (err: any) => toast.error(err.message || 'Error al actualizar'),
  });

  const cerrar = useMutation({
    mutationFn: (id: string) => adminApi.cerrarReclamo(id),
    onSuccess: () => {
      toast.success('Reclamo cerrado');
      refresh();
    },
    onError: (err: any) => toast.error(err.message || 'Error al cerrar'),
  });

  const reclamos: any[] = Array.isArray(data)
  ? data
  : Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray((data as any)?.data?.data)
      ? (data as any).data.data
      : [];

  if (isLoading) {
    return (
      <div aria-label="Cargando reclamos" className="max-w-full space-y-activa-24">
        <div className="space-y-activa-8">
          <Skeleton variant="text" className="h-8 max-w-sm" />
          <Skeleton variant="text" className="max-w-2xl" />
        </div>
        <div className="space-y-activa-16">
          <Skeleton variant="rectangular" className="h-72" />
          <Skeleton variant="rectangular" className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-activa-24 text-text-primary">
      <PageHeader
        eyebrow="Administración"
        title="Reclamos"
        description="Realizá el seguimiento de reclamos de beneficios y administrá la resolución de fondos retenidos."
      />

      {reclamos.length === 0 ? (
        <Card variant="muted">
          <CardContent className="p-activa-32 text-center text-sm text-text-secondary">
            No hay reclamos abiertos.
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-full space-y-activa-16">
          {reclamos.map((r) => (
            <Card key={r.id} className="max-w-full">
              <CardContent className="p-activa-16 sm:p-activa-24">
                <div className="flex min-w-0 flex-col gap-activa-16 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-link">
                      Campaña
                    </p>
                    <h2 className="mt-activa-4 break-words font-display text-xl font-semibold text-text-primary [overflow-wrap:anywhere] sm:text-2xl">
                      {r.sorteo_nombre}
                    </h2>
                  </div>

                  <Badge variant={fondosBadge[r.fondos_estado || 'retenido'] || 'neutral'} size="sm">
                    Fondos: {r.fondos_estado || 'retenido'}
                  </Badge>
                </div>

                <dl className="mt-activa-20 grid min-w-0 gap-activa-12 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-16">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Persona seleccionada
                    </dt>
                    <dd className="mt-activa-4 break-words font-semibold text-text-primary [overflow-wrap:anywhere]">
                      {r.ganador_email}
                    </dd>
                  </div>

                  <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-16">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Comercio impulsor
                    </dt>
                    <dd className="mt-activa-4 break-words font-semibold text-text-primary [overflow-wrap:anywhere]">
                      {r.comercio_nombre}
                    </dd>
                  </div>

                  <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-16 sm:col-span-2 lg:col-span-1">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Fecha del reclamo
                    </dt>
                    <dd className="mt-activa-4 break-words font-semibold text-text-primary">
                      {formatFecha(r.reclamado_at)}
                    </dd>
                  </div>
                </dl>

                <section className="mt-activa-16 rounded-activa-md border border-border-default bg-background-surface-muted p-activa-16">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Detalle del reclamo
                  </h3>
                  <p className="mt-activa-8 break-words text-sm text-text-primary [overflow-wrap:anywhere]">
                    {r.notas_ganador || 'Sin detalle del reclamo'}
                  </p>
                </section>

                <dl className="mt-activa-16 grid min-w-0 grid-cols-1 gap-activa-12 sm:grid-cols-2">
                  <div className="min-w-0 rounded-activa-md border border-border-default p-activa-16">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Importe bruto
                    </dt>
                    <dd className="mt-activa-4 break-words font-display text-lg font-semibold text-text-primary [overflow-wrap:anywhere]">
                      {formatMonto(Number(r.monto_bruto || 0))}
                    </dd>
                  </div>

                  <div className="min-w-0 rounded-activa-md border border-border-default p-activa-16">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Importe neto
                    </dt>
                    <dd className="mt-activa-4 break-words font-display text-lg font-semibold text-text-primary [overflow-wrap:anywhere]">
                      {formatMonto(Number(r.monto_neto || 0))}
                    </dd>
                  </div>
                </dl>

                <div className="mt-activa-20 flex flex-col gap-activa-8 sm:flex-row sm:flex-wrap">
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    disabled={liberar.isPending}
                    onClick={() => liberar.mutate(r.id)}
                  >
                    Liberar fondos
                  </Button>

                  <Button
                    type="button"
                    variant="tertiary"
                    className="w-full sm:w-auto"
                    disabled={revision.isPending}
                    onClick={() => revision.mutate(r.id)}
                  >
                    En revisión
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full sm:w-auto"
                    disabled={cerrar.isPending}
                    onClick={() => cerrar.mutate(r.id)}
                  >
                    Cerrar reclamo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
