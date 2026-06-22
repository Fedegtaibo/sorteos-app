'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { comercioApi } from '@/lib/api';
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

export default function EntregasPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['comercio-entregas'],
    queryFn: () => comercioApi.entregas() as any,
  });

  const mutation = useMutation({
    mutationFn: ({ id, payload }: any) => comercioApi.actualizarEntrega(id, payload),
    onSuccess: () => {
      toast.success('Entrega actualizada');
      queryClient.invalidateQueries({ queryKey: ['comercio-entregas'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'No se pudo actualizar la entrega');
    },
  });

  const entregas: any[] = Array.isArray(data)
  ? data
  : Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray((data as any)?.data?.data)
      ? (data as any).data.data
      : [];

  const actualizar = (id: string, estado: string) => {
  const payload: any = { estado };

  if (estado === 'enviado') {
    const empresaEnvio = window.prompt('Empresa de envío', '');
    if (!empresaEnvio) return;

    const codigoSeguimiento = window.prompt('Código de seguimiento', '');
    if (!codigoSeguimiento) return;

    payload.empresaEnvio = empresaEnvio;
    payload.codigoSeguimiento = codigoSeguimiento;
  }

  if (estado === 'entregado') {
    const notasComercio = window.prompt(
      'Detalle o evidencia de entrega (opcional)',
      ''
    );

    if (notasComercio) {
      payload.notasComercio = notasComercio;
    }
  }

  mutation.mutate({ id, payload });
};

  if (isLoading) {
    return <div className="animate-pulse text-zinc-400">Cargando entregas...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 shadow-2xl">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Comercio
        </p>
        <h1 className="text-3xl font-black text-white">Entregas de premios</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Gestioná el estado de entrega de los premios ganados. Este flujo será la base para liberar fondos al comercio una vez confirmada la entrega.
        </p>
      </section>

      {entregas.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-800 text-4xl">
            📦
          </div>
          <h2 className="text-xl font-black text-white">Todavía no hay entregas pendientes</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Cuando finalices un sorteo y haya un ganador, aparecerá acá la entrega del premio.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {entregas.map((e) => (
            <article
              key={e.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black text-white">{e.sorteo_nombre}</h2>
                    <Badge estado={e.estado} />
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-600">Ganador</p>
                      <p className="mt-1 font-semibold text-zinc-300">{e.ganador_email}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-600">Número</p>
                      <p className="mt-1 font-semibold text-zinc-300">#{e.numero_visible}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-600">Creada</p>
                      <p className="mt-1 font-semibold text-zinc-300">{formatFecha(e.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-600">Seguimiento</p>
                      <p className="mt-1 font-semibold text-zinc-300">{e.codigo_seguimiento || 'Sin cargar'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="btn-ghost text-sm"
                    disabled={mutation.isPending}
                    onClick={() => actualizar(e.id, 'preparando')}
                  >
                    Preparar
                  </button>
                  <button
                    className="btn-ghost text-sm"
                    disabled={mutation.isPending}
                    onClick={() => actualizar(e.id, 'enviado')}
                  >
                    Marcar enviado
                  </button>
                  <button
                    className="btn-primary text-sm"
                    disabled={mutation.isPending}
                    onClick={() => actualizar(e.id, 'entregado')}
                  >
                    Marcar entregado
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