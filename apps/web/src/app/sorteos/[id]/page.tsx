'use client';

import '../../redesign/styles.css';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useSorteo, useNumerosSorteo } from '@/hooks/use-sorteo';
import { useReserva } from '@/hooks/use-reserva';
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

export default function SorteoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const { data: sorteoData, isLoading } = useSorteo(id);
  const { data: numerosData, refetch } = useNumerosSorteo(id);

  const {
    reservando,
    reservaActiva,
    minutosRestantes,
    segsRestantes,
    reservar,
    liberar,
    iniciarCheckout,
  } = useReserva(id);

  const sorteo = (sorteoData as any)?.data?.data || (sorteoData as any)?.data;
  const numeros: any[] =
    (numerosData as any)?.data?.data ||
    (numerosData as any)?.data ||
    [];

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

  const numeroReservado = numeros.find((n) => n.id === reservaActiva?.numeroId);

  const handleNumeroClick = async (numero: any) => {
    if (numero.estado !== 'libre') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (reservaActiva) {
      toast.error('Ya tenés un número reservado. Completá el pago o liberalo primero.');
      return;
    }

    const ok = await reservar(numero.id);
    if (ok) refetch();
  };

  const handleComprar = async () => {
    const url = await iniciarCheckout();
    if (url) window.location.href = url;
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
        <button className="back" onClick={() => router.back()}>
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

            <div className="shop-dot">
              T <span>{sorteo.comercio_nombre}</span>
            </div>

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
              Elegí tu
              <br />
              número
            </h1>
            <p>Tocá un número libre para reservarlo</p>

            <div className="legend">
              <span>□ Libre</span>
              <span className="yellow">□ Seleccionado</span>
              <span className="green">□ Vendido</span>
              <span className="blue">□ Reservado</span>
            </div>

            {reservaActiva && (
              <section className="card checkout" style={{ marginBottom: 32 }}>
                <h2>Número reservado para vos</h2>

                <div className="buy-row">
                  <b>{numeroReservado?.numero_visible || '—'}</b>
                  <div>
                    Número reservado
                    <small>
                      Expira en {minutosRestantes}:{String(segsRestantes).padStart(2, '0')}
                    </small>
                  </div>
                  <strong>{formatMonto(sorteo.valor_numero)}</strong>
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                  <button className="back" onClick={liberar}>
                    Liberar
                  </button>

                  <button className="pay" onClick={handleComprar}>
                    Pagar ahora →
                  </button>
                </div>
              </section>
            )}

            <div className="number-grid">
              {numeros.map((n: any) => {
                const isSelected = reservaActiva?.numeroId === n.id;

                let cls = 'free';
                if (n.estado === 'vendido') cls = 'sold';
                if (n.estado === 'reservado') cls = 'reserved';
                if (isSelected) cls = 'selected';

                return (
                  <button
                    key={n.id}
                    onClick={() => handleNumeroClick(n)}
                    disabled={reservando || (n.estado !== 'libre' && !isSelected)}
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