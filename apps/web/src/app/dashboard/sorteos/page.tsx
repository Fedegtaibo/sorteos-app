'use client';

import {
  useMisSorteos,
  useActivarSorteo,
  useSortearSorteo,
} from '@/hooks/use-sorteo';
import { formatMonto, estadoColor } from '@/lib/utils';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
              Comercio
            </p>

            <h1 className="text-2xl font-black text-white md:text-3xl">
              Mis sorteos
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
              Administrá tus sorteos, revisá números vendidos, controlá la recaudación estimada y
              seguí el estado de cada publicación desde un solo lugar.
            </p>
          </div>

          <Link
            href="/dashboard/sorteos/nuevo"
            className="btn-primary inline-flex justify-center"
          >
            + Nuevo sorteo
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Sorteos
            </p>
            <p className="mt-3 text-2xl font-black text-white">
              {totalSorteos}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Activos
            </p>
            <p className="mt-3 text-2xl font-black text-blue-300">
              {activos}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Borradores
            </p>
            <p className="mt-3 text-2xl font-black text-zinc-300">
              {borradores}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Finalizados
            </p>
            <p className="mt-3 text-2xl font-black text-amber-400">
              {finalizados}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Recaudado
            </p>
            <p className="mt-3 text-2xl font-black text-emerald-300">
              {formatMonto(recaudacionTotal)}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
        <p className="text-sm font-bold leading-7 text-amber-100">
          Antes de activar un sorteo, revisá bien el premio, el valor del número, la cantidad de
          números y la información publicada. Una vez activo, los participantes pueden empezar a
          comprar números.
        </p>
      </section>

      {sorteos.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-800 text-3xl">
            🎯
          </div>

          <h2 className="text-xl font-black text-white">
            Todavía no creaste sorteos
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-400">
            Creá tu primer sorteo cargando el premio, descripción, cantidad de números, valor por
            número y fecha estimada.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/sorteos/nuevo"
              className="btn-primary inline-flex justify-center"
            >
              Crear primer sorteo
            </Link>

            <Link
              href="/ayuda"
              className="btn-ghost inline-flex justify-center"
            >
              Ver ayuda
            </Link>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
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
              <article
                key={s.id}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl transition-all hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-2xl"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-amber-400/30 bg-amber-400/10 text-3xl">
                    🎁
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-black text-white">
                        {s.nombre}
                      </h2>

                      <span
                        className={cn(
                          'shrink-0 rounded-full px-3 py-1 text-xs font-bold',
                          estadoColor(s.estado),
                        )}
                      >
                        {s.estado}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-5">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Vendidos
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          {vendidos}/{totalNumeros} números
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Disponibles
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          {disponibles}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Valor número
                        </p>
                        <p className="mt-1 font-semibold text-zinc-300">
                          {formatMonto(valorNumero)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Recaudado
                        </p>
                        <p className="mt-1 font-semibold text-emerald-300">
                          {formatMonto(recaudacion)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                          Potencial total
                        </p>
                        <p className="mt-1 font-semibold text-amber-300">
                          {formatMonto(potencial)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs font-bold text-zinc-500">
                        <span>Avance de venta</span>
                        <span>{pct}%</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-zinc-500">
                      Este panel muestra una estimación basada en los números vendidos y el valor
                      publicado por número. La información final puede depender del estado de pagos y
                      comprobantes.
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 lg:w-48">
                    {s.estado === 'borrador' && (
                      <button
                        onClick={() => activar.mutate(s.id)}
                        disabled={activar.isPending}
                        className="rounded-xl bg-amber-300 px-4 py-2 text-center text-sm font-black text-black hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Activar sorteo
                      </button>
                    )}

                    {(s.estado === 'activo' || s.estado === 'finalizado') && (
                      <Link
                        href={`/sorteos/${s.id}`}
                        className="rounded-xl border border-zinc-700 px-4 py-2 text-center text-sm font-bold text-zinc-200 hover:bg-white/10"
                      >
                        Ver página pública
                      </Link>
                    )}

                    {s.estado === 'activo' && (
                      <button
                        className="rounded-xl bg-blue-500 px-4 py-2 text-center text-sm font-black text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={sortear.isPending}
                        onClick={() =>
                          sortear.mutate({
                            id: s.id,
                            seedExterno: `${Date.now()}-${Math.random()}`,
                          })
                        }
                      >
                        Realizar sorteo
                      </button>
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