'use client';

import '../../redesign/styles.css';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useNumerosSorteo } from '@/hooks/use-sorteo';
import { pagosApi } from '@/lib/api';
import { formatMonto, formatFecha } from '@/lib/utils';

function Badge({ children, tone = 'green' }: any) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Progress({ value }: { value: number }) {
  return <div className="progress"><i style={{ width: `${value}%` }} /></div>;
}

function Stat({ label, value, tone, sub }: any) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
      {sub && <small>{sub}</small>}
    </div>
  );
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
      <main className="phone">
        <section className="content">
          <h1>Cargando sorteo...</h1>
        </section>
      </main>
    );
  }

  if (!sorteo) {
    return (
      <main className="phone">
        <section className="content">
          <button className="back" onClick={() => router.push('/')}>
            <ArrowLeft size={18} /> Volver
          </button>
          <h1>Sorteo no encontrado</h1>
        </section>
      </main>
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
    <main className="phone">
      <nav className="topbar">
        <div className="brand">
          <span>🎯</span>
          <b>Sortealo</b>
        </div>

        <div className="tabs">
          <button className="tab active blue">
            <span>🎯 Detalle Sorteo</span>
            <em>participante</em>
          </button>
        </div>
      </nav>

      <section className="content">
        <button className="back" onClick={() => router.push('/dashboard/explorar')}>
          <ArrowLeft size={18} /> Volver
        </button>

        <div className="detail-layout">
          <aside className="prize-card">
            <div className="hero">
              {sorteo.imagen_principal_url ? (
                <img
                  src={sorteo.imagen_principal_url}
                  alt={sorteo.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: 92 }}>🎁</span>
              )}
              <Badge tone="green">● ACTIVO</Badge>
            </div>

            <p>PREMIO</p>
            <h1>{sorteo.nombre}</h1>

            {sorteo.comercio_id ? (
  <Link
    href={`/comercios/${sorteo.comercio_id}`}
    className="mt-4 flex items-center justify-between gap-4 rounded-3xl border border-amber-400/40 bg-amber-400/10 p-4 text-left transition hover:border-amber-300 hover:bg-amber-400/20"
  >
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-400 text-lg font-black text-black shadow-lg">
        {String(sorteo.comercio_nombre || 'S').slice(0, 1)}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
          Comercio verificado
        </p>

        <p className="truncate text-base font-black text-white">
          {sorteo.comercio_nombre}
        </p>

        <p className="text-xs font-semibold text-zinc-400">
          Ver perfil, reputación y otros sorteos
        </p>
      </div>
    </div>

    <span className="shrink-0 rounded-2xl bg-amber-400 px-4 py-2 text-xs font-black text-black">
      Ver local →
    </span>
  </Link>
) : (
  <div className="shop-dot">
    T <span>{sorteo.comercio_nombre}</span>
  </div>
)}

            {sorteo.descripcion && <p className="desc">{sorteo.descripcion}</p>}

            <div className="sold-box">
              <div>
                <span>Números vendidos</span>
                <b>
                  {vendidos}/{sorteo.cant_numeros}
                </b>
              </div>

              <Progress value={pct} />

              <div className="mini-stats">
                <Stat label="VALOR" value={formatMonto(sorteo.valor_numero)} tone="yellow" />
                <Stat label="DISPONIBLES" value={libres} />
                <Stat label="RESERVADOS" value={reservados} tone="blue" />
                <Stat label="VENDIDOS" value={vendidos} tone="green" />
              </div>
            </div>

            <div className="countdown">
              <p>FECHA DEL SORTEO</p>
              <small>{formatFecha(sorteo.fecha_sorteo)}</small>
            </div>
          </aside>

          <section className="chooser">
            <h1>
              Elegí tus
              <br />
              números
            </h1>
            <p>Podés seleccionar varios números libres antes de pagar.</p>

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
        </div>
      </section>
    </main>
  );
}