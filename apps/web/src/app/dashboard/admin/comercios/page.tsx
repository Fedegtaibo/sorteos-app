'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout';
import {
  Alert,
  Badge,
  type BadgeVariant,
  Button,
  Card,
  CardContent,
  Skeleton,
} from '@/components/ui';
import { adminApi } from '@/lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

const estadoBadge: Record<string, BadgeVariant> = {
  pendiente: 'warning',
  aprobado: 'success',
  suspendido: 'error',
  rechazado: 'error',
};

const filtros = [
  { value: '', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'aprobado', label: 'Aprobados' },
  { value: 'suspendido', label: 'Suspendidos' },
  { value: 'rechazado', label: 'Rechazados' },
] as const;

export default function AdminComerciosPage() {
  const qc = useQueryClient();
  const [filtroEstado, setFiltroEstado] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-comercios', filtroEstado],
    queryFn: () => adminApi.comercios({ estado: filtroEstado || undefined }) as any,
  });

  const aprobar = useMutation({
    mutationFn: (id: string) => adminApi.aprobarComercio(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-comercios'] }); toast.success('Comercio impulsor aprobado'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rechazar = useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) => adminApi.rechazarComercio(id, motivo),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-comercios'] }); toast.success('Comercio impulsor rechazado'); },
  });

  const suspender = useMutation({
    mutationFn: (id: string) => adminApi.suspenderComercio(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-comercios'] }); toast.success('Comercio impulsor suspendido'); },
  });

  const comercios: any[] = (data as any)?.data?.data || [];
  const pendientes = comercios.filter(c => c.estado === 'pendiente').length;

  if (isLoading) {
    return (
      <div aria-label="Cargando comercios impulsores" className="max-w-full space-y-activa-24">
        <div className="space-y-activa-8">
          <Skeleton variant="text" className="h-8 max-w-sm" />
          <Skeleton variant="text" className="max-w-2xl" />
        </div>
        <Skeleton variant="rectangular" className="h-12 max-w-3xl" />
        <Skeleton variant="rectangular" className="h-80" />
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-activa-24 text-text-primary">
      <PageHeader
        eyebrow="Administración"
        title="Comercios impulsores"
        description="Revisá solicitudes, consultá estados y administrá los comercios que impulsan campañas en ACTIVA."
      />

      {pendientes > 0 && (
        <Alert variant="warning" title="Solicitudes pendientes de aprobación">
          Hay {pendientes} comercio{pendientes > 1 ? 's impulsores pendientes' : ' impulsor pendiente'} de aprobación.
        </Alert>
      )}

      <section aria-label="Filtrar comercios impulsores" className="flex max-w-full flex-wrap gap-activa-8">
        {filtros.map((filtro) => (
          <Button
            key={filtro.value || 'todos'}
            type="button"
            size="sm"
            variant={filtroEstado === filtro.value ? 'secondary' : 'tertiary'}
            aria-pressed={filtroEstado === filtro.value}
            onClick={() => setFiltroEstado(filtro.value)}
          >
            {filtro.label}
          </Button>
        ))}
      </section>

      <Card className="max-w-full overflow-hidden">
        <CardContent className="p-0">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[58rem] text-left text-sm">
              <thead className="border-b border-border-default bg-background-surface-muted text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <tr>
                  {['Comercio impulsor', 'CUIT', 'Estado', 'Campañas', 'Comisión', 'Acciones'].map(h => (
                    <th key={h} scope="col" className="px-activa-16 py-activa-12">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comercios.map((c: any) => (
                  <tr key={c.id} className="border-b border-border-default text-text-secondary transition-colors duration-fast ease-activa last:border-b-0 hover:bg-background-surface-muted">
                    <td className="max-w-72 px-activa-16 py-activa-12">
                      <div className="break-words font-semibold text-text-primary [overflow-wrap:anywhere]">{c.razon_social}</div>
                      <div className="mt-activa-4 break-words text-xs [overflow-wrap:anywhere]">{c.email}</div>
                    </td>
                    <td className="px-activa-16 py-activa-12 font-mono">{c.cuit}</td>
                    <td className="px-activa-16 py-activa-12">
                      <Badge variant={estadoBadge[c.estado] || 'neutral'} size="sm">{c.estado}</Badge>
                    </td>
                    <td className="px-activa-16 py-activa-12">—</td>
                    <td className="px-activa-16 py-activa-12">{c.comision_pct}%</td>
                    <td className="px-activa-16 py-activa-12">
                      <div className="flex flex-wrap gap-activa-8">
                        {c.estado === 'pendiente' && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => aprobar.mutate(c.id)}
                              disabled={aprobar.isPending}
                            >
                              Aprobar
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const motivo = window.prompt('Motivo del rechazo:');
                                if (motivo) rechazar.mutate({ id: c.id, motivo });
                              }}
                            >
                              Rechazar
                            </Button>
                          </>
                        )}
                        {c.estado === 'aprobado' && (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => { if (window.confirm('¿Suspender este comercio impulsor? Se cancelarán sus campañas activas.')) suspender.mutate(c.id); }}
                          >
                            Suspender
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {comercios.length === 0 && (
            <div className="border-t border-border-default p-activa-32 text-center text-sm text-text-secondary">
              No hay comercios impulsores con este filtro.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
