'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pagosApi } from '@/lib/api';
import { formatFecha } from '@/lib/utils';
import toast from 'react-hot-toast';

function Badge({ estado }: { estado: string }) {
  const styles: Record<string, string> = {
    pendiente: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
    preparando: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
    enviado: 'bg-purple-500/15 text-purple-300 ring-purple-500/30',
    entregado: 'bg-green-500/15 text-green-300 ring-green-500/30',
    confirmado: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
    reclamado: 'bg-red-500/15 text-red-300 ring-red-500/30',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ring-1 ${styles[estado] || styles.pendiente}`}>
      {estado}
    </span>
  );
}

export default function PremiosPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['mis-premios'],
    queryFn: () => pagosApi.misPremios() as any,
  });

  const confirmarMutation = useMutation({
    mutationFn: (id: string) => pagosApi.confirmarPremio(id),
    onSuccess: () => {
      toast.success('Recepción confirmada');
      queryClient.invalidateQueries({ queryKey: ['mis-premios'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'No se pudo confirmar');
    },
  });

  const reclamarMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) =>
      pagosApi.reclamarPremio(id, motivo),
    onSuccess: () => {
      toast.success('Reclamo iniciado');
      queryClient.invalidateQueries({ queryKey: ['mis-premios'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'No se pudo iniciar el reclamo');
    },
  });

  const premios: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  const reclamar = (id: string) => {
    const motivo = window.prompt('Contanos brevemente qué pasó con el premio');
    if (!motivo) return;

    reclamarMutation.mutate({ id, motivo });
  };

  if (isLoading) {
    return <div className="animate-pulse text-zinc-400">Cargando premios...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 shadow-2xl">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Ganador
        </p>
        <h1 className="text-3xl font-black text-white">Mis premios</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Acá podés seguir el estado de tus premios ganados, confirmar la recepción o iniciar un reclamo si hubo un problema.
        </p>
      </section>

      {premios.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-800 text-4xl">
            🏆
          </div>
          <h2 className="text-xl font-black text-white">Todavía no tenés premios ganados</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Cuando ganes un sorteo, el premio aparecerá acá con su estado de entrega.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {premios.map((p) => (
            <article
              key={p.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black text-white">{p.sorteo_nombre}</h2>
                    <Badge estado={p.estado} />
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-600">Envío</p>
                      <p className="mt-1 font-semibold text-zinc-300">
                        {p.empresa_envio || 'Sin empresa'}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {p.codigo_seguimiento
                          ? `Código: ${p.codigo_seguimiento}`
                          : 'Sin seguimiento'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-600">Número ganador</p>
                      <p className="mt-1 font-semibold text-zinc-300">#{p.numero_visible}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-600">Creado</p>
                      <p className="mt-1 font-semibold text-zinc-300">{formatFecha(p.created_at)}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-600">Comercio</p>
                      <p className="mt-1 font-semibold text-zinc-300">{p.comercio_nombre}</p>
                    </div>
                  </div>

                  {p.estado === 'entregado' && (
                    <p className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-semibold text-green-300">
                      El comercio marcó este premio como entregado. Confirmá la recepción sólo si realmente lo recibiste.
                    </p>
                  )}

                  {p.estado === 'confirmado' && (
                    <p className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-300">
                      Recepción confirmada. La plataforma puede liberar los fondos al comercio.
                    </p>
                  )}

                  {p.estado === 'reclamado' && (
                    <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
                      Reclamo iniciado. Un administrador revisará el caso antes de liberar fondos.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="btn-primary text-sm"
                    disabled={p.estado !== 'entregado' || confirmarMutation.isPending}
                    onClick={() => confirmarMutation.mutate(p.id)}
                  >
                    Confirmar recepción
                  </button>

                  <button
                    className="btn-ghost text-sm"
                    disabled={
                      p.estado === 'confirmado' ||
                      p.estado === 'reclamado' ||
                      reclamarMutation.isPending
                    }
                    onClick={() => reclamar(p.id)}
                  >
                    Abrir reclamo
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}