'use client';

import '../../redesign/styles.css';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useSorteo, useNumerosSorteo } from '@/hooks/use-sorteo';
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

export default function SorteoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const { data: sorteoData, isLoading } = useSorteo(id);
  const { data: numerosData, refetch } = useNumerosSorteo(id);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [procesando, setProcesando] = useState(false);

  const sorteo = (sorteoData as any)?.data?.data || (sorteoData as any)?.data;

  const numeros: any[] =
    (numerosData as any)?.data?.data ||
    (numerosData as any)?.data ||
    [];

  const seleccionados = useMemo(
    () => numeros.filter((n) => selectedIds.includes(n.id)),
    [numeros, selectedIds]
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
         <button className="back" onClick={() => router.push('/dashboard/explorar')}>
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

  const toggleNumero = (numero: any) => {
    if (numero.estado !== 'libre') return;

    if (!session) {
      router.push('/login');
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(numero.id)
        ? prev.filter((id) => id !== numero.id)
        : [...prev, numero.id]
    );
  };

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
      toast.error(err.message || 'No se pudo iniciar el pago');
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
                <b>{vendidos}/{sorteo.cant_numeros}</b>
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
            <h1>Elegí tus<br />números</h1>
            <p>Podés seleccionar varios números libres antes de pagar.</p>

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

      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        <button className="back" onClick={() => setSelectedIds([])}>
          Limpiar
        </button>

        <button
          className="pay"
          onClick={reservarSeleccion}
          disabled={procesando}
        >
          {procesando ? 'Preparando pago...' : 'Reservar y pagar →'}
        </button>
      </div>
    </section>

    <div className="mobile-buy-bar">
      <div>
        <b>{selectedIds.length} número{selectedIds.length > 1 ? 's' : ''}</b>
        <span>{formatMonto(totalSeleccion)}</span>
      </div>

      <button
        onClick={reservarSeleccion}
        disabled={procesando}
      >
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