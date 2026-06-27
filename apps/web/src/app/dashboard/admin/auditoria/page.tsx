'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { formatFecha } from '@/lib/utils';

function getBadgeClass(accion: string) {
  if (accion.includes('reclamado')) {
    return 'bg-red-500/10 text-red-300 border-red-500/30';
  }

  if (accion.includes('pago')) {
    return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  }

  if (accion.includes('realizado')) {
    return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
  }

  if (accion.includes('activado')) {
    return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  }

  return 'bg-zinc-800 text-zinc-300 border-zinc-700';
}

export default function AdminAuditoriaPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-auditoria'],
    queryFn: () => adminApi.auditoria({ limit: 100 }) as any,
  });

  const eventos: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  if (isLoading) {
    return <div className="text-zinc-400">Cargando auditoría...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
          Confianza y seguridad
        </p>

        <h1 className="mt-2 text-3xl font-black text-white">
          Auditoría de acciones
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
          Registro interno de acciones importantes: creación de sorteos,
          activaciones, sorteos realizados, pagos simulados y reclamos de premios.
        </p>
      </section>

      {eventos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center text-zinc-400">
          Todavía no hay eventos de auditoría.
        </div>
      ) : (
        <div className="space-y-4">
          {eventos.map((evento) => (
            <article
              key={evento.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${getBadgeClass(
                      evento.accion || '',
                    )}`}
                  >
                    {evento.accion}
                  </span>

                  <h2 className="mt-3 text-xl font-black text-white">
                    {evento.entidad_tipo || 'Evento'}{' '}
                    <span className="text-zinc-500">
                      · {evento.actor_role || 'sin rol'}
                    </span>
                  </h2>

                  <p className="mt-2 text-sm text-zinc-400">
                    {formatFecha(evento.created_at)}
                  </p>
                </div>

                <div className="text-right text-sm text-zinc-500">
                  <p>Actor</p>
                  <p className="font-bold text-zinc-300">
                    {evento.actor_email || evento.actor_id || 'Sistema'}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl bg-black p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Sorteo
                  </p>
                  <p className="mt-1 font-bold text-zinc-200">
                    {evento.sorteo_nombre || evento.sorteo_id || 'Sin sorteo'}
                  </p>
                </div>

                <div className="rounded-2xl bg-black p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Comercio
                  </p>
                  <p className="mt-1 font-bold text-zinc-200">
                    {evento.comercio_nombre || evento.comercio_id || 'Sin comercio'}
                  </p>
                </div>

                <div className="rounded-2xl bg-black p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                    Entidad
                  </p>
                  <p className="mt-1 break-all font-bold text-zinc-200">
                    {evento.entidad_id || 'Sin entidad'}
                  </p>
                </div>
              </div>

              <details className="mt-4 rounded-2xl border border-zinc-800 bg-black p-4">
                <summary className="cursor-pointer text-sm font-black text-amber-300">
                  Ver metadata
                </summary>

                <pre className="mt-4 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-zinc-300">
                  {JSON.stringify(evento.metadata || {}, null, 2)}
                </pre>
              </details>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}