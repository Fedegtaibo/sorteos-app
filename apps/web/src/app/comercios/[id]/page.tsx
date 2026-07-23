import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ActivaIcon } from '@/components/icons';
import { PublicFooter, PublicHeader } from '@/components/layout';
import { MediaImage } from '@/components/media';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Divider,
} from '@/components/ui';
import { formatFecha, formatMonto } from '@/lib/utils';

const publicNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar' },
] as const;

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
      className="group block rounded-activa-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
    >
      <Card
        variant="interactive"
        className="h-full overflow-hidden group-hover:border-border-strong group-hover:shadow-activa-md"
      >
        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-background-surface-muted">
          <MediaImage
            src={sorteo.imagen_principal_url}
            alt={sorteo.nombre}
            placeholderVariant="image"
            fit="cover"
            className="h-full w-full transition-transform duration-fast ease-activa group-hover:scale-105"
          />

          <Badge variant="brand" className="absolute bottom-activa-16 right-activa-16 shadow-activa-sm">
            {porcentaje}% registrado
          </Badge>
        </div>

        <CardHeader>
          <div className="flex items-start justify-between gap-activa-12">
            <div className="min-w-0">
              <CardTitle className="line-clamp-2 text-xl">{sorteo.nombre}</CardTitle>
              <CardDescription>
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

        <CardContent>
          {sorteo.descripcion ? (
            <p className="mb-activa-20 line-clamp-2 text-sm leading-6 text-text-secondary">
              {sorteo.descripcion}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-activa-12">
            <div className="rounded-activa-md bg-background-surface-muted p-activa-12">
              <p className="text-xs font-semibold text-text-secondary">Valor por participación</p>
              <p className="mt-activa-4 font-display text-lg font-semibold text-text-primary">
                {formatMonto(sorteo.valor_numero)}
              </p>
            </div>
            <div className="rounded-activa-md bg-background-surface-muted p-activa-12 text-right">
              <p className="text-xs font-semibold text-text-secondary">Fecha de selección</p>
              <p className="mt-activa-4 text-sm font-semibold text-text-primary">
                {formatFecha(sorteo.fecha_sorteo)}
              </p>
            </div>
          </div>

          <div className="mt-activa-20">
            <div className="mb-activa-8 flex justify-between gap-activa-12 text-xs text-text-secondary">
              <span>{vendidos} participaciones registradas</span>
              <span>{total} disponibles en total</span>
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

          <div className="mt-activa-20 flex min-h-11 items-center justify-center gap-activa-8 rounded-activa-md bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text">
            Conocer campaña
            <ActivaIcon name="arrow-right" size={18} />
          </div>
        </CardContent>
      </Card>
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

  const whatsappLimpio = String(comercio.whatsapp || '').replace(/\D/g, '');
  const whatsappHref = whatsappLimpio ? `https://wa.me/${whatsappLimpio}` : null;

  const instagramValor = String(comercio.instagram || '').trim();
  const instagramUsuario = instagramValor
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
    .replace(/\/$/, '');

  const instagramHref = instagramValor
    ? instagramValor.startsWith('http')
      ? instagramValor
      : `https://instagram.com/${instagramUsuario}`
    : null;

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

      <main>
        <section className="relative overflow-hidden border-b border-border-default bg-background-inverse text-text-inverse">
          <MediaImage
            src={comercio.portada_url}
            alt={`Portada de ${comercio.razon_social}`}
            placeholderVariant="cover"
            fit="cover"
            className="absolute inset-0 h-full w-full"
            imageClassName="opacity-25"
          />

          <div className="relative mx-auto max-w-7xl px-activa-16 py-activa-40 sm:px-activa-24 md:py-activa-64 lg:px-activa-40">
            <Link
              href="/"
              className="mb-activa-32 inline-flex min-h-11 items-center gap-activa-8 rounded-activa-sm px-activa-8 text-sm font-semibold text-text-inverse/80 transition-colors duration-fast ease-activa hover:bg-background-surface/10 hover:text-text-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <ActivaIcon name="arrow-left" size={18} />
              Volver al inicio
            </Link>

            <div className="grid gap-activa-32 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
              <div>
                {reputacion.verificado ? (
                  <Badge
                    variant="success"
                    icon={<ActivaIcon name="shield-check" size={16} />}
                    className="mb-activa-20"
                  >
                    Perfil verificado
                  </Badge>
                ) : null}

                <div className="flex flex-col gap-activa-20 sm:flex-row sm:items-center">
                  <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-activa-lg bg-action-primary font-display text-4xl font-semibold text-action-primary-text shadow-activa-md">
                    <MediaImage
                      src={comercio.logo_url}
                      alt={`Logo de ${comercio.razon_social}`}
                      placeholderVariant="logo"
                      fit="contain"
                      className="h-full w-full"
                    />
                  </div>

                  <div>
                    <p className="mb-activa-8 text-xs font-semibold uppercase tracking-widest text-action-primary">
                      Comercio en ACTIVA
                    </p>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-text-inverse md:text-6xl">
                      {comercio.razon_social}
                    </h1>
                    {comercio.descripcion ? (
                      <p className="mt-activa-12 max-w-2xl text-base leading-7 text-text-inverse/75">
                        {comercio.descripcion}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <Card variant="inverse" className="border-text-inverse/15">
                <CardHeader>
                  <CardTitle>Información del comercio</CardTitle>
                  <CardDescription>Datos de contacto disponibles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-activa-16">
                  <div className="flex items-start gap-activa-12">
                    <ActivaIcon name="headset" size={20} className="mt-0.5 text-action-primary" />
                    <div>
                      <p className="text-xs text-text-inverse/65">Teléfono</p>
                      <p className="text-sm font-semibold text-text-inverse">
                        {comercio.telefono || 'No informado'}
                      </p>
                    </div>
                  </div>

                  <Divider color="inverse" />

                  <div className="flex items-start gap-activa-12">
                    <ActivaIcon name="chat" size={20} className="mt-0.5 text-action-primary" />
                    <div>
                      <p className="text-xs text-text-inverse/65">WhatsApp</p>
                      {whatsappHref ? (
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-activa-xs text-sm font-semibold text-text-inverse underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                        >
                          {comercio.whatsapp}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-text-inverse">No informado</p>
                      )}
                    </div>
                  </div>

                  <Divider color="inverse" />

                  <div className="flex items-start gap-activa-12">
                    <ActivaIcon name="profile" size={20} className="mt-0.5 text-action-primary" />
                    <div>
                      <p className="text-xs text-text-inverse/65">Instagram</p>
                      {instagramHref ? (
                        <a
                          href={instagramHref}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-activa-xs text-sm font-semibold text-text-inverse underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                        >
                          {comercio.instagram}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-text-inverse">No informado</p>
                      )}
                    </div>
                  </div>

                  <Divider color="inverse" />

                  <div className="flex items-start gap-activa-12">
                    <ActivaIcon name="location" size={20} className="mt-0.5 text-action-primary" />
                    <div>
                      <p className="text-xs text-text-inverse/65">Dirección</p>
                      <p className="text-sm font-semibold text-text-inverse">
                        {comercio.direccion || 'No informada'}
                      </p>
                    </div>
                  </div>

                  <Divider color="inverse" />

                  <div className="flex items-start gap-activa-12">
                    <ActivaIcon name="calendar" size={20} className="mt-0.5 text-action-primary" />
                    <div>
                      <p className="text-xs text-text-inverse/65">En ACTIVA desde</p>
                      <p className="text-sm font-semibold text-text-inverse">
                        {formatFecha(comercio.created_at)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-activa-16 py-activa-48 sm:px-activa-24 lg:px-activa-40">
          <div className="grid gap-activa-24 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
            <Card variant="highlight">
              <CardHeader>
                <div className="flex items-center gap-activa-12">
                  <span className="grid size-10 place-items-center rounded-activa-full bg-action-primary text-action-primary-text">
                    <ActivaIcon name="shield-check" size={22} />
                  </span>
                  <div>
                    <CardTitle>Indicador de confianza</CardTitle>
                    <CardDescription>
                      Información construida a partir de la actividad registrada.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-activa-24 sm:grid-cols-[10rem_1fr] sm:items-center">
                  <div className="rounded-activa-lg bg-background-surface p-activa-20 text-center shadow-activa-sm">
                    {scoreConfianza?.puntaje !== undefined &&
                    scoreConfianza?.puntaje !== null ? (
                      <>
                        <p className="font-display text-4xl font-semibold text-text-primary">
                          {scoreConfianza.puntaje}
                        </p>
                        <p className="text-xs text-text-secondary">sobre 100</p>
                      </>
                    ) : null}
                    {scoreConfianza?.nivel ? (
                      <Badge variant="brand" className="mt-activa-12">
                        {scoreConfianza.nivel}
                      </Badge>
                    ) : null}
                  </div>

                  {scoreConfianza?.motivos?.length ? (
                    <ul className="space-y-activa-8">
                      {scoreConfianza.motivos.map((motivo: string) => (
                        <li
                          key={motivo}
                          className="flex items-start gap-activa-8 text-sm leading-6 text-text-secondary"
                        >
                          <ActivaIcon
                            name="check-circle"
                            size={18}
                            className="mt-0.5 text-status-success"
                          />
                          <span>{motivo}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad registrada</CardTitle>
                <CardDescription>Indicadores disponibles del comercio.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-activa-12">
                {[
                  ['Campañas', reputacion.totalSorteos],
                  ['Campañas finalizadas', reputacion.sorteosFinalizados],
                  ['Entregas confirmadas', reputacion.entregasConfirmadas],
                  ['Reclamos', reputacion.reclamos],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-activa-md bg-background-surface-muted p-activa-16"
                  >
                    <p className="font-display text-2xl font-semibold text-text-primary">
                      {value}
                    </p>
                    <p className="mt-activa-4 text-xs leading-5 text-text-secondary">
                      {label}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t border-border-default bg-background-surface">
          <div className="mx-auto max-w-7xl px-activa-16 py-activa-48 sm:px-activa-24 lg:px-activa-40">
            <div className="mb-activa-28">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-link">
                Oportunidades del comercio
              </p>
              <h2 className="mt-activa-8 font-display text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                Campañas activas
              </h2>
              <p className="mt-activa-8 text-base text-text-secondary">
                Conocé las oportunidades disponibles de este comercio.
              </p>
            </div>

            {sorteos.length === 0 ? (
              <Card variant="muted" className="border-dashed">
                <CardContent className="py-activa-48 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-activa-full bg-action-primary/15 text-text-primary">
                    <ActivaIcon name="campaign" size={24} />
                  </span>
                  <h2 className="mt-activa-16 font-display text-xl font-semibold text-text-primary">
                    Este comercio todavía no tiene campañas activas
                  </h2>
                  <p className="mt-activa-8 text-sm text-text-secondary">
                    Podés volver más adelante para conocer nuevas oportunidades.
                  </p>
                  <Link
                    href="/"
                    className="mt-activa-20 inline-flex min-h-11 items-center justify-center rounded-activa-md bg-action-primary px-activa-20 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                  >
                    Volver al inicio
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-activa-20 md:grid-cols-2 xl:grid-cols-3">
                {sorteos.map((s: any) => (
                  <SorteoCard key={s.id} sorteo={s} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
