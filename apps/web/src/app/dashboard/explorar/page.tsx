'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { ActivaIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout';
import { MediaImage } from '@/components/media';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Skeleton,
} from '@/components/ui';
import { formatFecha, formatMonto } from '@/lib/utils';

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
      className="group block rounded-activa-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
    >
      <Card
        variant="interactive"
        className="flex h-full flex-col overflow-hidden group-hover:border-border-strong group-hover:shadow-activa-md"
      >
        <div className="relative h-48 overflow-hidden bg-background-surface-muted">
          <MediaImage
            src={sorteo.imagen_principal_url}
            alt={sorteo.nombre}
            placeholderVariant="image"
            fit="cover"
            className="h-full w-full transition-transform duration-fast ease-activa group-hover:scale-105"
          />

          <Badge
            variant="brand"
            className="absolute bottom-activa-16 right-activa-16 shadow-activa-sm"
          >
            {porcentaje}% registrado
          </Badge>
        </div>

        <CardHeader>
          <div className="flex items-start justify-between gap-activa-12">
            <div className="min-w-0">
              <CardTitle className="line-clamp-2 text-xl">
                {sorteo.nombre}
              </CardTitle>
              <CardDescription className="truncate">
                {sorteo.comercio_nombre || 'Comercio impulsor'}
              </CardDescription>
            </div>

            {sorteo.estado ? (
              <Badge variant="neutral" size="sm" className="shrink-0">
                {sorteo.estado}
              </Badge>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col">
          {sorteo.descripcion ? (
            <p className="mb-activa-20 line-clamp-2 text-sm leading-6 text-text-secondary">
              {sorteo.descripcion}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-activa-12">
            <div className="rounded-activa-md bg-background-surface-muted p-activa-12">
              <p className="text-xs font-semibold text-text-secondary">
                Valor de participación
              </p>
              <p className="mt-activa-4 font-display text-lg font-semibold text-text-primary">
                {formatMonto(sorteo.valor_numero)}
              </p>
            </div>

            <div className="rounded-activa-md bg-background-surface-muted p-activa-12 text-right">
              <p className="text-xs font-semibold text-text-secondary">
                Fecha de selección
              </p>
              <p className="mt-activa-4 text-sm font-semibold text-text-primary">
                {formatFecha(sorteo.fecha_sorteo)}
              </p>
            </div>
          </div>

          <div className="mt-activa-20">
            <div className="mb-activa-8 flex justify-between gap-activa-12 text-xs text-text-secondary">
              <span>{vendidos} participaciones registradas</span>
              <span>{total} en total</span>
            </div>

            <div
              role="progressbar"
              aria-label="Participaciones registradas"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={porcentaje}
              className="h-2 overflow-hidden rounded-activa-full bg-background-surface-muted"
            >
              <div
                className="h-full rounded-activa-full bg-action-primary transition-all duration-fast ease-activa"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>

          <div className="mt-auto pt-activa-20">
            <div className="flex min-h-11 items-center justify-center gap-activa-8 rounded-activa-md bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa group-hover:bg-action-primary-hover">
              Ver campaña
              <ActivaIcon name="arrow-right" size={18} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CampaignSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton variant="rectangular" className="h-48 rounded-none" />
      <CardContent className="space-y-activa-16 pt-activa-20">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton variant="rectangular" className="h-20" />
        <Skeleton variant="text" />
        <Skeleton variant="rectangular" className="h-11" />
      </CardContent>
    </Card>
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
    <main className="space-y-activa-32 text-text-primary">
      <section className="rounded-activa-lg border border-border-default bg-background-surface p-activa-20 shadow-activa-sm md:p-activa-32">
        <Link
          href="/dashboard"
          className="mb-activa-24 inline-flex min-h-11 items-center gap-activa-8 rounded-activa-sm px-activa-8 text-sm font-semibold text-text-secondary transition-colors duration-fast ease-activa hover:bg-background-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <ActivaIcon name="arrow-left" size={18} />
          Volver a mi cuenta
        </Link>

        <PageHeader
          eyebrow="Explorar"
          title="Campañas disponibles"
          description="Descubrí oportunidades activas, compará opciones y elegí cómo participar."
        />

        <div className="mt-activa-28 grid gap-activa-12 sm:grid-cols-3">
          <Card variant="muted">
            <CardContent className="p-activa-16">
              <p className="font-display text-2xl font-semibold text-text-primary">
                {sorteos.length}
              </p>
              <p className="mt-activa-4 text-xs text-text-secondary">
                Campañas activas
              </p>
            </CardContent>
          </Card>

          <Card variant="muted">
            <CardContent className="p-activa-16">
              <p className="font-display text-2xl font-semibold text-text-primary">
                {totalVendidos}
              </p>
              <p className="mt-activa-4 text-xs text-text-secondary">
                Participaciones registradas
              </p>
            </CardContent>
          </Card>

          <Card variant="muted">
            <CardContent className="p-activa-16">
              <p className="font-display text-2xl font-semibold text-text-primary">
                {sorteosFiltrados.length}
              </p>
              <p className="mt-activa-4 text-xs text-text-secondary">
                Resultados filtrados
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar campañas</CardTitle>
          <CardDescription>
            Ajustá la búsqueda, la categoría o el orden de los resultados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-activa-16 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,0.35fr)_minmax(12rem,0.35fr)]">
            <Input
              label="Buscar"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por campaña, descripción o comercio impulsor"
              leftIcon={<ActivaIcon name="search" size={18} />}
            />

            <Select
              label="Categoría"
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>

            <Select
              label="Orden"
              value={orden}
              onChange={(event) => setOrden(event.target.value)}
            >
              <option value="proximos">Próximos</option>
              <option value="baratos">Más baratos</option>
              <option value="caros">Más caros</option>
              <option value="mas-vendidos">Más vendidos</option>
              <option value="destacados">Destacados</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <section
          aria-label="Cargando campañas"
          className="grid grid-cols-1 gap-activa-20 md:grid-cols-2 xl:grid-cols-3"
        >
          <CampaignSkeleton />
          <CampaignSkeleton />
          <CampaignSkeleton />
        </section>
      ) : sorteosFiltrados.length === 0 ? (
        <Card variant="muted" className="border-dashed">
          <CardContent className="py-activa-48 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-activa-full bg-action-primary/15 text-text-primary">
              <ActivaIcon name="search" size={24} />
            </span>
            <h2 className="mt-activa-16 font-display text-xl font-semibold text-text-primary">
              No encontramos campañas
            </h2>
            <p className="mx-auto mt-activa-8 max-w-md text-sm text-text-secondary">
              No hay resultados que coincidan con los filtros seleccionados.
            </p>
            <Button
              type="button"
              className="mt-activa-20"
              onClick={() => {
                setBusqueda('');
                setCategoria('Todos');
                setOrden('destacados');
              }}
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="grid grid-cols-1 gap-activa-20 md:grid-cols-2 xl:grid-cols-3">
          {sorteosFiltrados.map((s: any) => (
            <SorteoCard key={s.id} sorteo={s} />
          ))}
        </section>
      )}
    </main>
  );
}
