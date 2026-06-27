'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { formatMonto, formatFecha, estadoColor } from '@/lib/utils';

function porcentajeVendido(sorteo: any) {
  const vendidos = Number(sorteo.numeros_vendidos || 0);
  const total = Number(sorteo.cant_numeros || 0);

  if (!total) return 0;

  return Math.min(100, Math.round((vendidos / total) * 100));
}

function textoSorteo(sorteo: any) {
  return [
    sorteo.nombre,
    sorteo.descripcion,
    sorteo.comercio_nombre,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function SorteoCard({ sorteo }: { sorteo: any }) {
  const vendidos = Number(sorteo.numeros_vendidos || 0);
  const total = Number(sorteo.cant_numeros || 0);
  const porcentaje = porcentajeVendido(sorteo);

  return (
    <Link
      href={`/sorteos/${sorteo.id}`}
      className="group overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-xl transition hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-2xl"
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

        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-black uppercase text-white backdrop-blur">
          Verificado
        </span>

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

            <p className="mt-2 truncate text-xs font-semibold text-zinc-500">
              {sorteo.comercio_nombre || 'Comercio verificado'}
            </p>
          </div>

          <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${estadoColor(sorteo.estado)}`}>
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
          Ver números
        </div>
      </div>
    </Link>
  );
}

export default function ExplorarSorteosPage() {
  const [sorteos, setSorteos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [orden, setOrden] = useState('destacados');

  useEffect(() => {
    let cancelled = false;

    const cargarSorteos = async () => {
      setLoading(true);

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';

        const res = await fetch(`${baseUrl}/sorteos?limit=100`, {
          cache: 'no-store',
        });

        const json = await res.json();

        const data = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.data?.data)
              ? json.data.data
              : Array.isArray(json?.success?.data)
                ? json.success.data
                : [];

        if (!cancelled) {
          setSorteos(data);
        }
      } catch (err) {
        console.error('Error cargando sorteos:', err);
        if (!cancelled) setSorteos([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    cargarSorteos();

    return () => {
      cancelled = true;
    };
  }, []);

  const categorias = [
    'Todos',
    'Tecnología',
    'Autos',
    'Motos',
    'Viajes',
    'Gaming',
    'Hogar',
    'Moda',
    'Dinero',
  ];

  const sorteosFiltrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();

    let result = [...sorteos];

    if (query) {
      result = result.filter((s) => textoSorteo(s).includes(query));
    }

    if (categoria !== 'Todos') {
      const cat = categoria.toLowerCase();

      result = result.filter((s) => textoSorteo(s).includes(cat));
    }

    result.sort((a, b) => {
      if (orden === 'proximos') {
        return (
          new Date(a.fecha_sorteo).getTime() -
          new Date(b.fecha_sorteo).getTime()
        );
      }

      if (orden === 'baratos') {
        return Number(a.valor_numero || 0) - Number(b.valor_numero || 0);
      }

      if (orden === 'caros') {
        return Number(b.valor_numero || 0) - Number(a.valor_numero || 0);
      }

      if (orden === 'mas-vendidos') {
        return porcentajeVendido(b) - porcentajeVendido(a);
      }

      return porcentajeVendido(b) - porcentajeVendido(a);
    });

    return result;
  }, [sorteos, busqueda, categoria, orden]);

  const totalVendidos = sorteos.reduce(
    (acc, s) => acc + Number(s.numeros_vendidos || 0),
    0,
  );

  return (
    <main className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6 shadow-2xl md:p-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/5"
        >
          <ArrowLeft size={17} />
          Volver a mi cuenta
        </Link>

        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Marketplace
        </p>

        <h1 className="text-3xl font-black text-white md:text-5xl">
          Explorá sorteos activos
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
          Buscá premios, compará comercios y participá en sorteos verificados desde tu cuenta.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-2xl font-black text-amber-300">
              {sorteos.length}
            </p>
            <p className="mt-1 text-xs font-bold text-zinc-500">
              Sorteos activos
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-2xl font-black text-amber-300">
              {totalVendidos}
            </p>
            <p className="mt-1 text-xs font-bold text-zinc-500">
              Números vendidos
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-2xl font-black text-amber-300">
              {sorteosFiltrados.length}
            </p>
            <p className="mt-1 text-xs font-bold text-zinc-500">
              Resultados filtrados
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-4 shadow-2xl md:p-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por premio, comercio o descripción"
              className="w-full rounded-2xl border border-zinc-800 bg-black px-12 py-4 text-sm font-bold text-white outline-none placeholder:text-zinc-600 focus:border-amber-400"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />

            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-zinc-800 bg-black px-12 py-4 text-sm font-bold text-white outline-none focus:border-amber-400"
            >
              <option value="destacados">Destacados</option>
              <option value="mas-vendidos">Más vendidos</option>
              <option value="proximos">Próximos a finalizar</option>
              <option value="baratos">Menor precio</option>
              <option value="caros">Mayor precio</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoria(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                categoria === cat
                  ? 'bg-amber-400 text-black'
                  : 'border border-zinc-800 bg-black text-zinc-400 hover:border-amber-400/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-10 text-center">
          <p className="animate-pulse text-sm font-bold text-zinc-500">
            Cargando sorteos...
          </p>
        </section>
      ) : sorteosFiltrados.length === 0 ? (
        <section className="rounded-[2rem] border border-dashed border-zinc-700 bg-zinc-950 p-12 text-center">
          <h2 className="text-xl font-black text-white">
            No encontramos sorteos con esos filtros
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">
            Probá cambiando la búsqueda, la categoría o el orden seleccionado.
          </p>

          <button
            type="button"
            onClick={() => {
              setBusqueda('');
              setCategoria('Todos');
              setOrden('destacados');
            }}
            className="mt-6 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300"
          >
            Limpiar filtros
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sorteosFiltrados.map((s: any) => (
            <SorteoCard key={s.id} sorteo={s} />
          ))}
        </section>
      )}
    </main>
  );
}