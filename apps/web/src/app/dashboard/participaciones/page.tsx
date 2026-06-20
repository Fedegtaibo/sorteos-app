'use client';

import { useQuery } from '@tanstack/react-query';
import { pagosApi } from '@/lib/api';
import { formatMonto, formatFecha } from '@/lib/utils';
import Link from 'next/link';

function EstadoBadge({ estado, ganador }: { estado: string; ganador: boolean }) {
  if (ganador) {
    return (
      <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">
        🏆 GANADOR
      </span>
    );
  }

  if (estado === 'activo') {
    return (
      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300 ring-1 ring-blue-500/30">
        Participando
      </span>
    );
  }

  if (estado === 'finalizado') {
    return (
      <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs font-bold text-zinc-300">
        Finalizado
      </span>
    );
  }

  return (
    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-400">
      {estado}
    </span>
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
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-zinc-800" />
        <div className="h-32 animate-pulse rounded-3xl bg-zinc-900" />
        <div className="h-32 animate-pulse rounded-3xl bg-zinc-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-amber-400">
              Participante
            </p>
            <h1 className="text-3xl font-black text-white md:text-4xl">
              Mis participaciones
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Seguí tus números, revisá tus sorteos activos y consultá tus comprobantes desde un solo lugar.
            </p>
          </div>

<Link href="/dashboard/explorar" className="btn-primary inline-flex justify-center">
            Ver sorteos activos
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Participaciones
            </p>
            <p className="mt-3 text-3xl font-black text-white">
              {participaciones.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Sorteos activos
            </p>
            <p className="mt-3 text-3xl font-black text-blue-300">
              {activas}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Total participado
            </p>
            <p className="mt-3 text-3xl font-black text-amber-400">
              {formatMonto(totalInvertido)}
            </p>
          </div>
        </div>
      </section>

      {participaciones.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-800 text-4xl">
            🎟
          </div>
          <h2 className="text-xl font-black text-white">
            Todavía no participaste en ningún sorteo
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Elegí un sorteo activo, seleccioná tus números y seguí tus participaciones desde esta pantalla.
          </p>
          <Link href="/dashboard/explorar" className="btn-primary mt-6 inline-flex">
            Explorar sorteos
          </Link>
        </section>
      ) : (
        <section className="space-y-4">
          {participaciones.map((p: any) => {
            const esGanador = p.ganador_participacion_id === p.id;

            return (
              <article
                key={p.id}
                className={[
                  'group overflow-hidden rounded-3xl border bg-zinc-900 p-5 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl',
                  esGanador
                    ? 'border-amber-400/60 ring-1 ring-amber-400/30'
                    : 'border-zinc-800 hover:border-zinc-700',
                ].join(' ')}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <div
                    className={[
                      'flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border text-2xl font-black',
                      esGanador
                        ? 'border-amber-400 bg-amber-400 text-black'
                        : 'border-blue-500/30 bg-blue-500/10 text-blue-300',
                    ].join(' ')}
                  >
                    {p.numero_visible}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-black text-white">
                        {p.sorteo_nombre}
                      </h2>
                      <EstadoBadge estado={p.sorteo_estado} ganador={esGanador} />
                    </div>

                    <div className="mt-3 grid gap-3 text-sm text-zinc-400 md:grid-cols-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Comercio
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          {p.comercio}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Número
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          #{p.numero_visible}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Monto
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          {formatMonto(Number(p.monto_pagado))}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Fecha
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          {formatFecha(p.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {p.comprobante_url ? (
                      <a
                        href={p.comprobante_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost text-sm"
                      >
                        Comprobante
                      </a>
                    ) : (
                      <span className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-bold text-zinc-500">
                        Sin comprobante
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}