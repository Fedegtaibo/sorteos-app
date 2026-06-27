import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { formatMonto, formatFecha, estadoColor } from '@/lib/utils';

async function getPerfilComercio(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/comercios/${id}/publico`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) return null;

    const json = await res.json();

    if (json?.data?.comercio) return json.data;
    if (json?.comercio) return json;

    return null;
  } catch {
    return null;
  }
}

function porcentajeVendido(sorteo: any) {
  const vendidos = Number(sorteo.numeros_vendidos || 0);
  const total = Number(sorteo.cant_numeros || 0);

  if (!total) return 0;

  return Math.min(100, Math.round((vendidos / total) * 100));
}

function SorteoCard({ sorteo }: { sorteo: any }) {
  const vendidos = Number(sorteo.numeros_vendidos || 0);
  const total = Number(sorteo.cant_numeros || 0);
  const porcentaje = porcentajeVendido(sorteo);

  return (
    <Link
      href={`/sorteos/${sorteo.id}`}
      className="group overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-xl transition hover:-translate-y-1 hover:border-amber-400/60"
    >
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-amber-300 via-orange-500 to-zinc-950">
        {sorteo.imagen_principal_url ? (
          <img
            src={sorteo.imagen_principal_url}
            alt={sorteo.nombre}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-24 w-24 place-items-center rounded-[2rem] bg-black/30 text-5xl font-black text-white shadow-2xl backdrop-blur">
            S
          </div>
        )}

        <span className="absolute bottom-4 right-4 rounded-full bg-amber-300 px-4 py-2 text-xs font-black text-black shadow-xl">
          {porcentaje}% vendido
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-xl font-black leading-tight text-white transition group-hover:text-amber-300">
              {sorteo.nombre}
            </h2>

            <p className="mt-2 text-xs font-semibold text-zinc-500">
              {sorteo.comercio_nombre || 'Comercio verificado'}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${estadoColor(
              sorteo.estado,
            )}`}
          >
            {sorteo.estado}
          </span>
        </div>

        {sorteo.descripcion && (
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-zinc-400">
            {sorteo.descripcion}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-zinc-900 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              Valor número
            </p>
            <p className="mt-1 text-lg font-black text-amber-300">
              {formatMonto(sorteo.valor_numero)}
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-3 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              Sortea
            </p>
            <p className="mt-1 text-xs font-black text-zinc-200">
              {formatFecha(sorteo.fecha_sorteo)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs font-semibold text-zinc-500">
            <span>{vendidos} vendidos</span>
            <span>{total} números</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-amber-400 px-4 py-3 text-center text-sm font-black text-black transition group-hover:bg-amber-300">
          Participar
        </div>
      </div>
    </Link>
  );
}

export default async function ComercioPublicoPage({
  params,
}: {
  params: { id: string };
}) {
  const perfil = await getPerfilComercio(params.id);

  if (!perfil) {
    notFound();
  }

  const { comercio, reputacion, scoreConfianza, sorteos } = perfil;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.24),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-16">
          
        <Link
  href="/"
  className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
>
  <ArrowLeft size={17} />
  Volver al inicio
</Link>



          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                <BadgeCheck size={16} />
                Comercio verificado
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[2rem] bg-amber-400 text-4xl font-black text-black shadow-2xl">
                  {String(comercio.razon_social || 'S').slice(0, 1)}
                </div>

                <div>
                  <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
                    {comercio.razon_social}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                    Perfil público del comercio dentro de Sortealo. Acá podés ver sus sorteos activos, historial básico y señales de confianza.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
                Contacto
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-black p-4">
                  <Phone size={18} className="text-amber-300" />
                  <div>
                    <p className="text-xs text-zinc-500">Teléfono</p>
                    <p className="text-sm font-bold text-white">
                      {comercio.telefono || 'No informado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-black p-4">
                  <CalendarDays size={18} className="text-amber-300" />
                  <div>
                    <p className="text-xs text-zinc-500">En Sortealo desde</p>
                    <p className="text-sm font-bold text-white">
                      {formatFecha(comercio.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-black p-4">
                  <ShieldCheck size={18} className="text-emerald-300" />
                  <div>
                    <p className="text-xs text-zinc-500">Estado</p>
                    <p className="text-sm font-bold text-emerald-300">
                      {reputacion.verificado ? 'Verificado' : 'No verificado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-amber-400/30 bg-zinc-950 p-6 shadow-2xl">
  <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
    <div className="text-center lg:text-left">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
        Nivel de confianza
      </p>

      <div className="mt-4 inline-flex h-36 w-36 items-center justify-center rounded-full border-8 border-amber-400 bg-black shadow-2xl">
        <div>
          <p className="text-4xl font-black text-white">
            {scoreConfianza?.puntaje ?? 0}
          </p>
          <p className="text-xs font-black text-zinc-500">/100</p>
        </div>
      </div>

      <p className="mt-4 text-xl font-black text-amber-300">
        {scoreConfianza?.nivel || 'Inicial'}
      </p>
    </div>

    <div>
      <h2 className="text-2xl font-black text-white">
        Señales de confianza del comercio
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
        Este puntaje se calcula con datos internos de Sortealo: verificación del comercio,
        sorteos realizados, entregas confirmadas, antigüedad y reclamos registrados.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {(scoreConfianza?.motivos || []).map((motivo: string) => (
          <div
            key={motivo}
            className="rounded-2xl border border-zinc-800 bg-black p-4 text-sm font-bold text-zinc-300"
          >
            {motivo}
          </div>
        ))}
      </div>
    </div>
  </div>
</div> 

         

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-3xl font-black text-amber-300">
                {reputacion.totalSorteos}
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-500">
                Sorteos creados
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-3xl font-black text-amber-300">
                {reputacion.sorteosFinalizados}
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-500">
                Sorteos finalizados
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-3xl font-black text-emerald-300">
                {reputacion.entregasConfirmadas}
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-500">
                Entregas confirmadas
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-3xl font-black text-red-300">
                {reputacion.reclamos}
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-500">
                Reclamos registrados
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
              Sorteos del comercio
            </p>

            <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
              Sorteos activos
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Participá en sorteos publicados por {comercio.razon_social}.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-black text-zinc-300">
            <Star size={17} className="text-amber-300" />
            Nivel de confianza inicial
          </div>
        </div>

        {sorteos.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-zinc-700 bg-zinc-950 p-12 text-center">
            <p className="text-xl font-black text-white">
              Este comercio no tiene sorteos activos ahora.
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Podés volver más tarde o explorar otros comercios.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300"
            >
              Explorar marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sorteos.map((s: any) => (
              <SorteoCard key={s.id} sorteo={s} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}