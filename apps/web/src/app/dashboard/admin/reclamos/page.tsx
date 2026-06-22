'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { formatFecha, formatMonto } from '@/lib/utils';
import toast from 'react-hot-toast';

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

  if (isLoading) return <div className="text-zinc-400">Cargando reclamos...</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-3xl font-black text-white">Reclamos</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Premios reclamados y fondos retenidos pendientes de revisión.
        </p>
      </section>

      {reclamos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center text-zinc-400">
          No hay reclamos abiertos.
        </div>
      ) : (
        <div className="space-y-4">
          {reclamos.map((r) => (
            <article key={r.id} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-xl font-black text-white">{r.sorteo_nombre}</h2>

              <p className="mt-2 text-sm text-zinc-400">Ganador: {r.ganador_email}</p>
              <p className="text-sm text-zinc-400">Comercio: {r.comercio_nombre}</p>
              <p className="text-sm text-zinc-400">
                Fecha reclamo: {formatFecha(r.reclamado_at)}
              </p>

              <div className="mt-4 rounded-2xl bg-red-500/10 p-4 text-sm text-red-300">
                {r.notas_ganador || 'Sin detalle del reclamo'}
              </div>

              <div className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-3">
                <div>Fondos: {r.fondos_estado || 'retenido'}</div>
                <div>Bruto: {formatMonto(Number(r.monto_bruto || 0))}</div>
                <div>Neto: {formatMonto(Number(r.monto_neto || 0))}</div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  className="btn-primary text-sm"
                  disabled={liberar.isPending}
                  onClick={() => liberar.mutate(r.id)}
                >
                  Liberar fondos
                </button>

                <button
                  className="btn-ghost text-sm"
                  disabled={revision.isPending}
                  onClick={() => revision.mutate(r.id)}
                >
                  En revisión
                </button>

                <button
                  className="btn-ghost text-sm"
                  disabled={cerrar.isPending}
                  onClick={() => cerrar.mutate(r.id)}
                >
                  Cerrar reclamo
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}