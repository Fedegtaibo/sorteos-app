import Link from 'next/link';
import { formatMonto, formatFecha, estadoColor } from '@/lib/utils';

async function getSorteos() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/sorteos`,
      { cache: 'no-store' }
    );

    const json = await res.json();

    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.data?.data)) return json.data.data;
    if (Array.isArray(json?.success?.data)) return json.success.data;

    return [];
  } catch {
    return [];
  }
}

export default async function ExplorarSorteosPage() {
  const sorteos = await getSorteos();

  return (
    <main className="space-y-6">
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 md:p-8 shadow-2xl">
        <Link
          href="/dashboard"
          className="mb-5 inline-flex rounded-2xl border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300"
        >
          ← Volver a mi cuenta
        </Link>

        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Participante
        </p>

        <h1 className="text-3xl md:text-4xl font-black text-white">
          Explorar sorteos
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Elegí un sorteo activo, seleccioná tus números y participá desde tu cuenta.
        </p>
      </section>

      {sorteos.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">
          <h2 className="text-xl font-black text-white">
            No hay sorteos activos
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Volvé pronto para ver nuevos premios disponibles.
          </p>

          <Link
  href="/dashboard/explorar"
  className="mt-6 inline-flex rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-black"
>
  Explorar sorteos
</Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorteos.map((s: any) => {
            const vendidos = Number(s.numeros_vendidos || 0);
            const total = Number(s.cant_numeros || 0);
            const porcentaje = total ? Math.round((vendidos / total) * 100) : 0;

            return (
              <Link
                key={s.id}
                href={`/sorteos/${s.id}`}
                className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl transition hover:-translate-y-0.5 hover:border-amber-400/50"
              >
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950">
                  <div className="grid h-20 w-20 place-items-center rounded-3xl bg-amber-400 text-3xl font-black text-black shadow-lg">
                    S
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-lg font-black leading-tight text-white">
                      {s.nombre}
                    </h2>

                    <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${estadoColor(s.estado)}`}>
                      {s.estado}
                    </span>
                  </div>

                  <p className="mb-4 text-xs font-semibold text-zinc-500">
                    {s.comercio_nombre}
                  </p>

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-zinc-500">Valor por número</p>
                      <p className="text-xl font-black text-amber-300">
                        {formatMonto(s.valor_numero)}
                      </p>
                    </div>

                    <p className="text-right text-xs text-zinc-500">
                      Sortea<br />
                      <span className="font-bold text-zinc-300">
                        {formatFecha(s.fecha_sorteo)}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 border-t border-zinc-800 pt-4">
                    <div className="mb-2 flex justify-between text-xs font-semibold text-zinc-500">
                      <span>{vendidos} vendidos de {total}</span>
                      <span>{porcentaje}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-amber-400 px-4 py-3 text-center text-sm font-black text-black">
                    Ver números
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}