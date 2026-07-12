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
      {estado || 'Registrada'}
    </span>
  );
}

function ComprobanteBadge({ codigo }: { codigo?: string | null }) {
  if (codigo) {
    return (
      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30">
        Comprobante emitido
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-500/30">
      Comprobante pendiente
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

            <h1 className="text-2xl font-black text-white md:text-3xl">
              Mis participaciones
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
              Acá podés revisar tus números comprados, el sorteo asociado, el comercio organizador,
              el monto pagado y el comprobante de cada participación registrada.
            </p>
          </div>

          <Link
            href="/dashboard/explorar"
            className="btn-primary inline-flex justify-center"
          >
            Ver sorteos activos
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Participaciones
            </p>
            <p className="mt-3 text-2xl font-black text-white">
              {participaciones.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Sorteos activos
            </p>
            <p className="mt-3 text-2xl font-black text-blue-300">
              {activas}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Ganadas
            </p>
            <p className="mt-3 text-2xl font-black text-amber-400">
              {ganadas}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Total participado
            </p>
            <p className="mt-3 text-2xl font-black text-amber-400">
              {formatMonto(totalInvertido)}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
        <p className="text-sm font-bold leading-7 text-amber-100">
          Si acabás de pagar y todavía no ves tu participación, esperá unos segundos y actualizá la
          página. Algunos pagos pueden demorar en impactar. No vuelvas a pagar el mismo sorteo sin
          revisar primero esta sección.
        </p>
      </section>

      {participaciones.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-800 text-3xl">
            🎟
          </div>

          <h2 className="text-xl font-black text-white">
            Todavía no tenés participaciones registradas
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-400">
            Cuando compres números en un sorteo y el pago sea confirmado, tus participaciones van a
            aparecer en esta pantalla.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard/explorar" className="btn-primary inline-flex justify-center">
              Explorar sorteos
            </Link>

            <Link href="/contacto" className="btn-ghost inline-flex justify-center">
              Contactar soporte
            </Link>
          </div>
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
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <div
                    className={[
                      'flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border text-2xl font-black',
                      esGanador
                        ? 'border-amber-400 bg-amber-400 text-black'
                        : 'border-blue-500/30 bg-blue-500/10 text-blue-300',
                    ].join(' ')}
                  >
                    #{p.numero_visible}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-black text-white">
                        {p.sorteo_nombre}
                      </h2>

                      <EstadoBadge estado={p.sorteo_estado} ganador={esGanador} />

                      <ComprobanteBadge codigo={p.comprobante_codigo} />
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-5">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Comercio
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          {p.comercio || 'No informado'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Número comprado
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          #{p.numero_visible}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Monto pagado
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          {formatMonto(Number(p.monto_pagado || 0))}
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

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Comprobante
                        </p>

                        <p className="mt-1 break-all font-semibold text-amber-300">
                          {p.comprobante_codigo || 'Pendiente de emisión'}
                        </p>

                        {p.comprobante_emitido_at && (
                          <p className="mt-1 text-xs text-zinc-500">
                            Emitido: {formatFecha(p.comprobante_emitido_at)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-zinc-400">
                      Esta participación queda asociada a tu cuenta. Si el sorteo finaliza y este
                      número resulta ganador, el estado se actualizará en esta misma pantalla.
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 md:w-44">
                    {p.sorteo_id && (
                      <Link
                        href={`/sorteos/${p.sorteo_id}`}
                        className="rounded-xl border border-zinc-700 px-4 py-2 text-center text-sm font-bold text-zinc-200 hover:bg-white/10"
                      >
                        Ver sorteo
                      </Link>
                    )}

                    {p.comprobante_url ? (
                      <a
                        href={p.comprobante_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-amber-300 px-4 py-2 text-center text-sm font-black text-black hover:bg-amber-200"
                      >
                        Ver comprobante
                      </a>
                    ) : (
                      <span className="rounded-xl border border-zinc-800 px-4 py-2 text-center text-sm font-bold text-zinc-500">
                        Sin PDF
                      </span>
                    )}

                    <Link
                      href="/contacto"
                      className="rounded-xl border border-zinc-800 px-4 py-2 text-center text-sm font-bold text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                    >
                      Ayuda
                    </Link>
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