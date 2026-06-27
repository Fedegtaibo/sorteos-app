
import Link from 'next/link';
import { formatMonto, formatFecha, estadoColor } from '@/lib/utils';

async function getSorteos() {
  try {
    const res: any = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/sorteos?limit=24`,
      { next: { revalidate: 60 } }
    );

    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.data)) return data.data.data;
    if (Array.isArray(data?.success?.data)) return data.success.data;

    return [];
  } catch {
    return [];
  }
}

function porcentajeVendido(sorteo: any) {
  const vendidos = Number(sorteo.numeros_vendidos || 0);
  const total = Number(sorteo.cant_numeros || 0);

  if (!total) return 0;

  return Math.min(100, Math.round((vendidos / total) * 100));
}

function SorteoCard({ sorteo, compact = false }: { sorteo: any; compact?: boolean }) {
  const porcentaje = porcentajeVendido(sorteo);
  const vendidos = Number(sorteo.numeros_vendidos || 0);
  const total = Number(sorteo.cant_numeros || 0);

  return (
    <Link
      href={`/sorteos/${sorteo.id}`}
      className="group overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-amber-400/60"
    >
      <div className={`${compact ? 'h-36' : 'h-52'} relative overflow-hidden bg-gradient-to-br from-amber-300 via-orange-500 to-zinc-950`}>
        {sorteo.imagen_principal_url ? (
          <img
            src={sorteo.imagen_principal_url}
            alt={sorteo.nombre}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="grid h-24 w-24 place-items-center rounded-[2rem] bg-black/30 text-5xl font-black text-white shadow-2xl backdrop-blur">
              S
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-black uppercase text-white backdrop-blur">
          {sorteo.estado || 'activo'}
        </div>

        <div className="absolute bottom-4 right-4 rounded-full bg-amber-300 px-4 py-2 text-xs font-black text-black shadow-xl">
          {porcentaje}% vendido
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={`${compact ? 'text-base' : 'text-xl'} line-clamp-2 font-black leading-tight text-white transition group-hover:text-amber-300`}>
              {sorteo.nombre}
            </h3>

            <p className="mt-2 truncate text-xs font-semibold text-zinc-500">
              {sorteo.comercio_nombre || 'Comercio verificado'}
            </p>
          </div>

          <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${estadoColor(sorteo.estado)}`}>
            {sorteo.estado}
          </span>
        </div>

        {sorteo.descripcion && !compact && (
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
          Participar ahora
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const sorteos = await getSorteos();

  const destacados = [...sorteos]
    .sort((a: any, b: any) => porcentajeVendido(b) - porcentajeVendido(a))
    .slice(0, 3);

  const proximos = [...sorteos]
    .sort(
      (a: any, b: any) =>
        new Date(a.fecha_sorteo).getTime() - new Date(b.fecha_sorteo).getTime()
    )
    .slice(0, 3);

  const ultimoPublicado = sorteos[0];

  const categorias = [
    { nombre: 'Tecnología', icono: '💻' },
    { nombre: 'Autos', icono: '🚗' },
    { nombre: 'Motos', icono: '🏍️' },
    { nombre: 'Viajes', icono: '✈️' },
    { nombre: 'Gaming', icono: '🎮' },
    { nombre: 'Hogar', icono: '🏠' },
    { nombre: 'Moda', icono: '👟' },
    { nombre: 'Dinero', icono: '💸' },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-400 text-lg font-black text-black">
              S
            </span>

            <div className="min-w-0">
              <p className="truncate text-lg font-black text-white">
                Sortealo
              </p>
              <p className="hidden text-xs text-zinc-500 sm:block">
                Marketplace de sorteos verificados
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/dashboard/explorar"
              className="hidden rounded-xl px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 sm:inline-flex"
            >
              Explorar
            </Link>

            <Link
              href="/login"
              className="rounded-xl px-3 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
            >
              Ingresar
            </Link>

            <Link
              href="/registro"
              className="rounded-xl bg-amber-400 px-3 py-2 text-sm font-black text-black hover:bg-amber-300 sm:px-4"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-amber-300">
              Sorteos verificados · Pagos seguros · Entregas auditables
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">
              Descubrí premios reales en sorteos confiables.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Sortealo conecta comercios verificados con participantes que buscan premios, transparencia y una experiencia simple de compra.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#marketplace"
                className="rounded-2xl bg-amber-400 px-7 py-4 text-center text-base font-black text-black shadow-2xl shadow-amber-400/20 hover:bg-amber-300"
              >
                Explorar sorteos
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white/15 px-7 py-4 text-center text-base font-black text-white hover:bg-white/10"
              >
                Publicar como comercio
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-black text-amber-300">{sorteos.length}</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">Sorteos activos</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-black text-amber-300">
                  {sorteos.reduce((acc: number, s: any) => acc + Number(s.numeros_vendidos || 0), 0)}
                </p>
                <p className="mt-1 text-xs font-bold text-zinc-500">Números vendidos</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-black text-amber-300">24/7</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">Marketplace online</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-4 shadow-2xl">
            {ultimoPublicado ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
                      Sorteo destacado
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-white">
                      {ultimoPublicado.nombre}
                    </h2>
                  </div>

                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300">
                    Activo
                  </span>
                </div>

                <SorteoCard sorteo={ultimoPublicado} />
              </>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-zinc-700 p-10 text-center">
                <p className="text-xl font-black text-white">Todavía no hay sorteos activos</p>
                <p className="mt-2 text-sm text-zinc-500">Cuando un comercio publique uno, aparecerá acá.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-4 shadow-2xl md:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-zinc-500">
              Buscar por premio, comercio o categoría
            </div>

            <Link
              href="/dashboard/explorar"
              className="rounded-2xl bg-amber-400 px-6 py-4 text-center text-sm font-black text-black hover:bg-amber-300"
            >
              Ir al buscador
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categorias.map((cat) => (
              <div
                key={cat.nombre}
                className="rounded-2xl border border-zinc-800 bg-black p-4 text-center transition hover:border-amber-400/50"
              >
                <div className="text-2xl">{cat.icono}</div>
                <p className="mt-2 text-xs font-black text-zinc-300">
                  {cat.nombre}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="marketplace" className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
              Marketplace
            </p>
            <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
              Sorteos activos
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Elegí un premio, comprá tu número y seguí todo el proceso desde tu cuenta.
            </p>
          </div>

          <Link
            href="/dashboard/explorar"
            className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-white hover:bg-white/10"
          >
            Ver todos
          </Link>
        </div>

        {sorteos.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-zinc-700 bg-zinc-950 p-12 text-center">
            <p className="text-xl font-black text-white">No hay sorteos activos en este momento.</p>
            <p className="mt-2 text-sm text-zinc-500">Volvé pronto para ver nuevos premios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sorteos.map((s: any) => (
              <SorteoCard key={s.id} sorteo={s} />
            ))}
          </div>
        )}
      </section>

      {destacados.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
              Más vendidos
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Los más elegidos por la comunidad
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {destacados.map((s: any) => (
              <SorteoCard key={s.id} sorteo={s} compact />
            ))}
          </div>
        </section>
      )}

      {proximos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
              Próximos a finalizar
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Sorteos que se acercan a la fecha
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {proximos.map((s: any) => (
              <SorteoCard key={s.id} sorteo={s} compact />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="overflow-hidden rounded-[2.5rem] border border-amber-400/30 bg-gradient-to-br from-amber-300 to-orange-500 p-8 text-black shadow-2xl shadow-amber-400/20 md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-black/60">
                Para comercios
              </p>

              <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-5xl">
                Convertí tus productos en una campaña de ventas.
              </h2>

              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-black/70">
                Publicá sorteos, vendé números, gestioná entregas y construí reputación dentro de una plataforma preparada para crecer.
              </p>
            </div>

            <Link
              href="/registro"
              className="rounded-2xl bg-black px-8 py-5 text-center text-base font-black text-white hover:bg-zinc-900"
            >
              Crear cuenta comercio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}