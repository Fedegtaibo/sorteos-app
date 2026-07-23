'use client';

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
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Divider,
  Skeleton,
} from '@/components/ui';
import { useNumerosSorteo } from '@/hooks/use-sorteo';
import { pagosApi } from '@/lib/api';
import { cn, formatMonto, formatFecha } from '@/lib/utils';

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
            <CardContent className="space-y-activa-24">
              <Alert variant="brand" title="Antes de participar">
                <ol className="mt-activa-8 space-y-activa-8">
                  {[
                    'Elegís una o más participaciones disponibles.',
                    'La selección queda reservada por unos minutos mientras pagás.',
                    'El pago se realiza por Mercado Pago.',
                    'Si el pago se aprueba, la participación queda registrada.',
                    'Tu comprobante queda guardado en Mis participaciones.',
                  ].map((texto, index) => (
                    <li key={texto} className="flex items-start gap-activa-8 leading-6">
                      <span className="font-semibold text-text-primary">
                        {index + 1}.
                      </span>
                      <span>{texto}</span>
                    </li>
                  ))}
                </ol>
              </Alert>

              <Card variant="highlight">
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-link">
                    Gestionado con ACTIVA
                  </p>
                  <CardTitle>Participás con registro, pago y comprobante.</CardTitle>
                  <CardDescription>
                    ACTIVA organiza el proceso para vincular cada participación, pago y
                    comprobante. Podés seguir la operación desde tu panel.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-activa-12 sm:grid-cols-3">
                  {[
                    {
                      icon: 'lock' as const,
                      title: 'Pago registrado',
                      text: 'La operación queda asociada a tu cuenta.',
                    },
                    {
                      icon: 'participation' as const,
                      title: 'Participación asignada',
                      text: 'Si el pago se aprueba, queda registrada.',
                    },
                    {
                      icon: 'receipt' as const,
                      title: 'Comprobante',
                      text: 'Podés verlo luego en Mis participaciones.',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-activa-md border border-border-default bg-background-surface p-activa-12"
                    >
                      <ActivaIcon name={item.icon} size={20} className="text-text-link" />
                      <p className="mt-activa-8 text-sm font-semibold text-text-primary">
                        {item.title}
                      </p>
                      <p className="mt-activa-4 text-xs leading-5 text-text-secondary">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div>
                <div className="flex flex-col gap-activa-8 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-text-primary">
                      Opciones disponibles
                    </h2>
                    <p className="mt-activa-4 text-sm text-text-secondary">
                      Las disponibilidades se actualizan periódicamente.
                    </p>
                  </div>
                  <div
                    aria-label="Leyenda de estados"
                    className="flex flex-wrap gap-activa-8 text-xs"
                  >
                    <span className="inline-flex items-center gap-activa-4 rounded-activa-full border border-border-strong bg-background-surface px-activa-8 py-activa-4 text-text-primary">
                      <span aria-hidden="true" className="size-2 rounded-activa-full border border-border-strong" />
                      Disponible
                    </span>
                    <span className="inline-flex items-center gap-activa-4 rounded-activa-full border border-action-primary bg-action-primary/15 px-activa-8 py-activa-4 text-text-primary">
                      <ActivaIcon name="check" size={12} />
                      Seleccionada
                    </span>
                    <span className="inline-flex items-center gap-activa-4 rounded-activa-full border border-status-information bg-status-information/10 px-activa-8 py-activa-4 text-text-primary">
                      <ActivaIcon name="pending" size={12} />
                      Reservada
                    </span>
                    <span className="inline-flex items-center gap-activa-4 rounded-activa-full border border-border-default bg-background-surface-muted px-activa-8 py-activa-4 text-text-secondary">
                      <ActivaIcon name="close" size={12} />
                      No disponible
                    </span>
                  </div>
                </div>

                <div className="mt-activa-16 grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-activa-8">
                  {numeros.map((n: any) => {
                    const isSelected = selectedIds.includes(n.id);

                    let visualState = 'disponible';
                    let stateClasses =
                      'border-border-strong bg-background-surface text-text-primary hover:border-action-primary hover:bg-action-primary/10';
                    let stateIcon = null;

                    if (n.estado === 'vendido') {
                      visualState = 'no disponible';
                      stateClasses =
                        'cursor-not-allowed border-border-default bg-background-surface-muted text-text-disabled line-through';
                      stateIcon = <ActivaIcon name="close" size={12} />;
                    }

                    if (n.estado === 'reservado') {
                      visualState = 'reservada';
                      stateClasses =
                        'cursor-not-allowed border-status-information bg-status-information/10 text-text-secondary';
                      stateIcon = <ActivaIcon name="pending" size={12} />;
                    }

                    if (isSelected) {
                      visualState = 'seleccionada';
                      stateClasses =
                        'border-action-primary bg-action-primary text-action-primary-text shadow-activa-xs';
                      stateIcon = <ActivaIcon name="check" size={12} />;
                    }

                    return (
                      <button
                        key={n.id}
                        onClick={() => toggleNumero(n)}
                        disabled={procesando || n.estado !== 'libre'}
                        aria-label={`Participación ${n.numero_visible}, ${visualState}`}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-activa-sm border px-activa-4 py-activa-8 text-sm font-semibold transition-colors duration-fast ease-activa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 disabled:opacity-70',
                          stateClasses,
                        )}
                      >
                        <span>{n.numero_visible}</span>
                        <span aria-hidden="true" className="flex min-h-3 items-center">
                          {stateIcon}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Divider />

              <section aria-labelledby="selection-summary-title">
                <div className="flex flex-wrap items-center justify-between gap-activa-12">
                  <div>
                    <h2
                      id="selection-summary-title"
                      className="font-display text-xl font-semibold text-text-primary"
                    >
                      Participaciones seleccionadas
                    </h2>
                    <p className="mt-activa-4 text-sm text-text-secondary">
                      Revisá tu elección antes de continuar.
                    </p>
                  </div>
                  <Badge variant={selectedIds.length > 0 ? 'brand' : 'neutral'}>
                    {selectedIds.length} seleccionada{selectedIds.length === 1 ? '' : 's'}
                  </Badge>
                </div>

                {selectedIds.length > 0 ? (
                  <>
                    <div className="mt-activa-16 space-y-activa-8">
                      {seleccionados.map((n) => (
                        <div
                          key={n.id}
                          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-activa-12 rounded-activa-md bg-background-surface-muted p-activa-12"
                        >
                          <span className="grid size-10 place-items-center rounded-activa-sm bg-action-primary font-semibold text-action-primary-text">
                            {n.numero_visible}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary">
                              Participación {n.numero_visible}
                            </p>
                            <p className="truncate text-xs text-text-secondary">
                              {sorteo.nombre}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-text-secondary">
                              Valor por participación
                            </p>
                            <p className="text-sm font-semibold text-text-primary">
                              {formatMonto(sorteo.valor_numero)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-activa-16 flex items-center justify-between rounded-activa-md border border-border-default p-activa-16">
                      <span className="font-semibold text-text-primary">Total</span>
                      <strong className="font-display text-xl text-text-primary">
                        {formatMonto(totalSeleccion)}
                      </strong>
                    </div>

                    <div className="mt-activa-20 flex flex-wrap gap-activa-12">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSelectedIds([])}
                      >
                        Limpiar
                      </Button>

                      <Button
                        type="button"
                        onClick={reservarSeleccion}
                        disabled={procesando}
                        isLoading={procesando}
                        loadingText="Preparando pago"
                        rightIcon={<ActivaIcon name="arrow-right" size={18} />}
                      >
                        Continuar al pago
                      </Button>

                      {puedeSimularPago && (
                        <Button
                          type="button"
                          variant="tertiary"
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
                          Simular pago (desarrollo)
                        </Button>
                      )}
                    </div>

                    <div className="fixed inset-x-0 bottom-0 z-sticky border-t border-border-default bg-background-surface px-activa-16 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-activa-12 shadow-activa-lg md:hidden">
                      <div className="mx-auto flex max-w-lg items-center justify-between gap-activa-12">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text-primary">
                            {selectedIds.length} participación{selectedIds.length > 1 ? 'es' : ''}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {formatMonto(totalSeleccion)}
                          </p>
                        </div>

                        <Button
                          type="button"
                          onClick={reservarSeleccion}
                          disabled={procesando}
                          isLoading={procesando}
                          loadingText="Preparando"
                          className="shrink-0"
                        >
                          Continuar al pago
                        </Button>
                      </div>
                    </div>

                    <div aria-hidden="true" className="h-24 md:hidden" />
                  </>
                ) : (
                  <p className="mt-activa-16 rounded-activa-md bg-background-surface-muted p-activa-16 text-sm text-text-secondary">
                    Todavía no seleccionaste participaciones.
                  </p>
                )}
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
