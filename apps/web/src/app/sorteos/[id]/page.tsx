'use client';

import '../../redesign/styles.css';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { ActivaIcon } from '@/components/icons';
import { PublicFooter, PublicHeader } from '@/components/layout';
import { MediaImage } from '@/components/media';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui';
import { useNumerosSorteo } from '@/hooks/use-sorteo';
import { pagosApi } from '@/lib/api';
import { formatMonto, formatFecha } from '@/lib/utils';

const publicNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar' },
] as const;

const estadoLabels: Record<string, string> = {
  activo: 'Activa',
  finalizado: 'Finalizada',
  pausado: 'Pausada',
  cancelado: 'Cancelada',
};

function estadoVisible(estado: unknown) {
  const value = String(estado || '');
  return estadoLabels[value.toLowerCase()] || value;
}

function getSorteoFromResponse(res: any) {
  if (!res) return null;
  if (res?.data?.data?.id) return res.data.data;
  if (res?.data?.id) return res.data;
  if (res?.id) return res;
  return null;
}

function getArrayFromResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

export default function SorteoPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const idFromParams = Array.isArray((params as any)?.id)
    ? (params as any).id[0]
    : (params as any)?.id;

  const idFromUrl =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/').filter(Boolean).pop()
      : '';
      const id = String(idFromParams || idFromUrl || '');
	const { data: numerosData, refetch } = useNumerosSorteo(id);

const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [procesando, setProcesando] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [sorteo, setSorteo] = useState<any>(null);

useEffect(() => {
  if (!id) return;

  let cancelled = false;

  const cargarSorteo = async () => {
    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';

      const res = await fetch(`${baseUrl}/sorteos/${id}`);
      const json = await res.json();

      if (!cancelled) {
        setSorteo(getSorteoFromResponse(json));
      }
    } catch (err) {
      console.error('Error cargando sorteo:', err);
      if (!cancelled) setSorteo(null);
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  };

  cargarSorteo();

  return () => {
    cancelled = true;
  };
}, [id]);

const numeros: any[] = getArrayFromResponse(numerosData);

  const seleccionados = useMemo(
    () => numeros.filter((n) => selectedIds.includes(n.id)),
    [numeros, selectedIds],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-page text-text-primary">
        <PublicHeader
          navigation={publicNavigation}
          variant="light"
          logoHref="/"
          actions={
            <Link
              href="/registro"
              className="inline-flex min-h-11 items-center justify-center rounded-activa-md bg-action-primary px-activa-20 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
            >
              Crear cuenta
            </Link>
          }
        />
        <main
          aria-label="Cargando campaña"
          className="mx-auto grid max-w-7xl gap-activa-24 px-activa-16 py-activa-40 sm:px-activa-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-activa-40"
        >
          <Card className="overflow-hidden">
            <Skeleton variant="rectangular" className="h-72 rounded-none" />
            <CardContent className="space-y-activa-16 pt-activa-24">
              <Skeleton variant="text" className="w-1/3" />
              <Skeleton variant="text" className="h-8 w-4/5" />
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-2/3" />
              <div className="grid grid-cols-2 gap-activa-12">
                <Skeleton variant="rectangular" className="h-20" />
                <Skeleton variant="rectangular" className="h-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-activa-16 py-activa-32">
              <Skeleton variant="text" className="h-8 w-2/3" />
              <Skeleton variant="text" className="w-4/5" />
              <Skeleton variant="rectangular" className="h-64" />
            </CardContent>
          </Card>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!sorteo) {
    return (
      <div className="min-h-screen bg-background-page text-text-primary">
        <PublicHeader
          navigation={publicNavigation}
          variant="light"
          logoHref="/"
          actions={
            <Link
              href="/registro"
              className="inline-flex min-h-11 items-center justify-center rounded-activa-md bg-action-primary px-activa-20 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
            >
              Crear cuenta
            </Link>
          }
        />
        <main className="mx-auto max-w-3xl px-activa-16 py-activa-64 sm:px-activa-24 lg:px-activa-40">
          <Card variant="muted" className="border-dashed">
            <CardContent className="py-activa-48 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-activa-full bg-action-primary/15 text-text-primary">
                <ActivaIcon name="search" size={24} />
              </span>
              <p className="mt-activa-16 text-xs font-semibold uppercase tracking-widest text-text-link">
                Campaña no disponible
              </p>
              <h1 className="mt-activa-8 font-display text-3xl font-semibold text-text-primary">
                No encontramos esta campaña
              </h1>
              <p className="mx-auto mt-activa-8 max-w-lg text-base text-text-secondary">
                Es posible que ya no esté publicada o que el enlace no sea válido.
              </p>
              <Button
                type="button"
                className="mt-activa-24"
                leftIcon={<ActivaIcon name="arrow-left" size={18} />}
                onClick={() => router.push('/')}
              >
                Volver
              </Button>
            </CardContent>
          </Card>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const vendidos = sorteo.stats?.vendidos || sorteo.numeros_vendidos || 0;
  const reservados = numeros.filter((n) => n.estado === 'reservado').length;
  const libres = numeros.filter((n) => n.estado === 'libre').length;
  const pct = Math.round((vendidos / Number(sorteo.cant_numeros)) * 100);
  const totalSeleccion = seleccionados.length * Number(sorteo.valor_numero);
  const puedeSimularPago = process.env.NODE_ENV === 'development';

  const toggleNumero = (numero: any) => {
    if (numero.estado !== 'libre') return;

    if (!session) {
      router.push('/login');
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(numero.id)
        ? prev.filter((numeroId) => numeroId !== numero.id)
        : [...prev, numero.id],
    );
  };

  const mensajeEmailNoVerificadoCompra =
    'Necesitás verificar tu email antes de comprar números. Revisá tu casilla o usá el botón “Reenviar email” en el dashboard.';

  const esErrorEmailNoVerificado = (err: any) =>
    String(err?.message || '').toLowerCase().includes('verificar tu email');

  const reservarSeleccion = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (selectedIds.length === 0) {
      toast.error('Elegí al menos un número');
      return;
    }

    const idsParaPagar = [...selectedIds];

    setProcesando(true);

    try {
      for (const numeroId of idsParaPagar) {
        await pagosApi.reservar(id, numeroId);
      }

      const checkoutRes: any = await pagosApi.checkoutMultiple(id, idsParaPagar);
      const checkoutUrl = checkoutRes?.data?.checkoutUrl || checkoutRes?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error('No se recibió el link de pago');
      }

      toast.success('Reserva creada. Redirigiendo al pago...');
      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error(
        esErrorEmailNoVerificado(err)
          ? mensajeEmailNoVerificadoCompra
          : err.message || 'No se pudo iniciar el pago',
      );
      await refetch();
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-page text-text-primary">
      <PublicHeader
        navigation={publicNavigation}
        variant="light"
        logoHref="/"
        actions={
          <Link
            href="/registro"
            className="inline-flex min-h-11 items-center justify-center rounded-activa-md bg-action-primary px-activa-20 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
          >
            Crear cuenta
          </Link>
        }
      />

      <main className="mx-auto max-w-7xl px-activa-16 py-activa-32 sm:px-activa-24 lg:px-activa-40">
        <Button
          type="button"
          variant="ghost"
          className="mb-activa-24"
          leftIcon={<ActivaIcon name="arrow-left" size={18} />}
          onClick={() => router.push('/dashboard/explorar')}
        >
          Volver a explorar
        </Button>

        <div className="grid gap-activa-24 lg:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <Card className="overflow-hidden lg:sticky lg:top-activa-24">
            <div className="relative h-72 overflow-hidden bg-background-surface-muted sm:h-96">
              <MediaImage
                src={sorteo.imagen_principal_url}
                alt={sorteo.nombre}
                placeholderVariant="image"
                fit="cover"
                className="h-full w-full"
              />
              {sorteo.estado ? (
                <Badge
                  variant="neutral"
                  className="absolute bottom-activa-16 left-activa-16 shadow-activa-sm"
                >
                  {estadoVisible(sorteo.estado)}
                </Badge>
              ) : null}
            </div>

            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-link">
                Campaña
              </p>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
                {sorteo.nombre}
              </h1>
              {sorteo.descripcion ? (
                <p className="mt-activa-8 text-sm leading-6 text-text-secondary">
                  {sorteo.descripcion}
                </p>
              ) : null}
            </CardHeader>

            <CardContent className="space-y-activa-20">
              {sorteo.comercio_id ? (
                <Link
                  href={`/comercios/${sorteo.comercio_id}`}
                  className="flex min-h-16 items-center justify-between gap-activa-12 rounded-activa-md border border-border-default bg-background-surface-muted p-activa-12 transition-colors duration-fast ease-activa hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  <div className="flex min-w-0 items-center gap-activa-12">
                    <span className="grid size-11 shrink-0 place-items-center rounded-activa-md bg-action-primary font-display font-semibold text-action-primary-text">
                      {String(sorteo.comercio_nombre || 'C').slice(0, 1)}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-text-secondary">
                        Impulsada por
                      </span>
                      <span className="block truncate text-sm font-semibold text-text-primary">
                        {sorteo.comercio_nombre}
                      </span>
                    </span>
                  </div>
                  <ActivaIcon
                    name="arrow-right"
                    size={18}
                    className="shrink-0 text-text-secondary"
                  />
                </Link>
              ) : (
                <div className="flex items-center gap-activa-12 rounded-activa-md bg-background-surface-muted p-activa-12">
                  <span className="grid size-11 shrink-0 place-items-center rounded-activa-md bg-action-primary font-display font-semibold text-action-primary-text">
                    C
                  </span>
                  <span>
                    <span className="block text-xs text-text-secondary">
                      Comercio impulsor
                    </span>
                    <span className="block text-sm font-semibold text-text-primary">
                      {sorteo.comercio_nombre}
                    </span>
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-activa-12">
                <Card variant="muted">
                  <CardContent className="p-activa-12">
                    <p className="text-xs text-text-secondary">
                      Valor de participación
                    </p>
                    <p className="mt-activa-4 font-display text-lg font-semibold text-text-primary">
                      {formatMonto(sorteo.valor_numero)}
                    </p>
                  </CardContent>
                </Card>
                <Card variant="muted">
                  <CardContent className="p-activa-12">
                    <p className="text-xs text-text-secondary">
                      Fecha de selección
                    </p>
                    <p className="mt-activa-4 text-sm font-semibold text-text-primary">
                      {formatFecha(sorteo.fecha_sorteo)}
                    </p>
                  </CardContent>
                </Card>
                <Card variant="muted">
                  <CardContent className="p-activa-12">
                    <p className="text-xs text-text-secondary">
                      Participaciones registradas
                    </p>
                    <p className="mt-activa-4 font-display text-lg font-semibold text-text-primary">
                      {vendidos}
                    </p>
                  </CardContent>
                </Card>
                <Card variant="muted">
                  <CardContent className="p-activa-12">
                    <p className="text-xs text-text-secondary">
                      Total disponible
                    </p>
                    <p className="mt-activa-4 font-display text-lg font-semibold text-text-primary">
                      {sorteo.cant_numeros}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="mb-activa-8 flex justify-between gap-activa-12 text-xs text-text-secondary">
                  <span>Porcentaje registrado</span>
                  <span>{pct}%</span>
                </div>
                <div
                  role="progressbar"
                  aria-label="Participaciones registradas"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  className="h-2 overflow-hidden rounded-activa-full bg-background-surface-muted"
                >
                  <div
                    className="h-full rounded-activa-full bg-action-primary transition-all duration-fast ease-activa"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-activa-8 text-xs text-text-secondary">
                  {libres} disponibles, {reservados} reservadas y {vendidos} registradas.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Elegí tus participaciones</CardTitle>
              <CardDescription>
                Seleccioná una o más opciones disponibles para continuar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <section className="chooser">

                        <section
              className="card"
              style={{
                marginBottom: 28,
                border: '1px solid rgba(245, 158, 11, 0.28)',
                background: 'rgba(245, 158, 11, 0.08)',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#fbbf24',
                }}
              >
                Antes de participar
              </p>

              <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
                {[
                  'Elegís uno o más números disponibles.',
                  'La selección queda reservada por unos minutos mientras pagás.',
                  'El pago se realiza por MercadoPago.',
                  'Si el pago se aprueba, el número pasa a vendido.',
                  'Tu comprobante queda guardado en Mis participaciones.',
                ].map((texto, index) => (
                  <div
                    key={texto}
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: '#d4d4d8',
                    }}
                  >
                    <b style={{ color: '#fbbf24' }}>{index + 1}.</b>
                    <span>{texto}</span>
                  </div>
                ))}
              </div>
            </section>


            <section
              className="card"
              style={{
                marginBottom: 28,
                border: '1px solid rgba(251, 191, 36, 0.22)',
                background:
                  'linear-gradient(135deg, rgba(251,191,36,0.10), rgba(24,24,27,0.92))',
              }}
            >
              <p
                style={{
                  color: '#fbbf24',
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                Gestionado con Sortealo
              </p>

              <h2 style={{ marginTop: 10, marginBottom: 10 }}>
                Participás con registro, pago y comprobante.
              </h2>

              <p style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                Sortealo ordena el proceso para que cada número, pago y participación quede
                registrado. Así el comercio puede administrar el sorteo con más transparencia y vos
                podés seguir tu compra desde tu panel.
              </p>

              <div
                style={{
                  display: 'grid',
                  gap: 10,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  marginTop: 18,
                }}
              >
                {[
                  {
                    icon: '🔒',
                    title: 'Pago registrado',
                    text: 'La operación queda asociada a tu cuenta.',
                  },
                  {
                    icon: '\u{1F39F}\uFE0F',
                    title: 'Número asignado',
                    text: 'Si el pago se aprueba, el número queda vendido.',
                  },
                  {
                    icon: '🧾',
                    title: 'Comprobante',
                    text: 'Podés verlo luego en Mis participaciones.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 18,
                      padding: 14,
                      background: 'rgba(0,0,0,0.22)',
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                    <b style={{ display: 'block', color: '#fff', marginBottom: 4 }}>
                      {item.title}
                    </b>
                    <span style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 1.5 }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </section>
            <div className="legend">
              <span>□ Libre</span>
              <span className="yellow">□ Seleccionado</span>
              <span className="green">□ Vendido</span>
              <span className="blue">□ Reservado</span>
            </div>

            {selectedIds.length > 0 && (
              <>
                <section className="card checkout" style={{ marginBottom: 32 }}>
                  <h2>Resumen de compra</h2>

                  {seleccionados.map((n) => (
                    <div className="buy-row" key={n.id}>
                      <b>{n.numero_visible}</b>
                      <div>
                        Número {n.numero_visible}
                        <small>{sorteo.nombre}</small>
                      </div>
                      <strong>{formatMonto(sorteo.valor_numero)}</strong>
                    </div>
                  ))}

                  <div className="total">
                    <b>Total</b>
                    <strong>{formatMonto(totalSeleccion)}</strong>
                  </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
  <button className="back" onClick={() => setSelectedIds([])}>
    Limpiar
  </button>

  <button className="pay" onClick={reservarSeleccion} disabled={procesando}>
    {procesando ? 'Preparando pago...' : 'Reservar y pagar →'}
  </button>

  {puedeSimularPago && (
  <button
    className="pay"
    style={{ background: '#16a34a' }}
    disabled={procesando}
    onClick={async () => {
      try {
        setProcesando(true);

        if (selectedIds.length === 0) {
          toast.error('Seleccioná al menos un número');
          return;
        }

        for (const numeroId of selectedIds) {
          await pagosApi.reservar(id, numeroId);
          await pagosApi.simularPago(id, numeroId);
        }

        toast.success('Pago simulado correctamente');
        setSelectedIds([]);
        await refetch();
        router.push('/dashboard/participaciones');
      } catch (err: any) {
        toast.error(
          esErrorEmailNoVerificado(err)
            ? mensajeEmailNoVerificadoCompra
            : err.message || 'Error simulando pago',
        );
        await refetch();
      } finally {
        setProcesando(false);
      }
    }}
   >
    Simular pago 🧪
  </button>
)}
</div>
                </section>

                <div className="mobile-buy-bar">
                  <div>
                    <b>
                      {selectedIds.length} número{selectedIds.length > 1 ? 's' : ''}
                    </b>
                    <span>{formatMonto(totalSeleccion)}</span>
                  </div>

                  <button onClick={reservarSeleccion} disabled={procesando}>
                    {procesando ? 'Preparando...' : 'Reservar y pagar'}
                  </button>
                </div>
              </>
            )}

            <div className="number-grid">
              {numeros.map((n: any) => {
                const isSelected = selectedIds.includes(n.id);

                let cls = 'free';
                if (n.estado === 'vendido') cls = 'sold';
                if (n.estado === 'reservado') cls = 'reserved';
                if (isSelected) cls = 'selected';

                return (
                  <button
                    key={n.id}
                    onClick={() => toggleNumero(n)}
                    disabled={procesando || n.estado !== 'libre'}
                    className={`num ${cls}`}
                  >
                    {n.numero_visible}
                  </button>
                );
              })}
            </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
