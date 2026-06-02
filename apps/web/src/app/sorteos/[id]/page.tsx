'use client';
import { useParams, useRouter } from 'next/navigation';
import { useSorteo, useNumerosSorteo } from '@/hooks/use-sorteo';
import { useReserva } from '@/hooks/use-reserva';
import { useSession } from 'next-auth/react';
import { formatMonto, formatFecha } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const ESTADO_NUMERO = {
  libre: { bg: 'bg-gray-50 border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer', text: 'text-gray-700' },
  reservado: { bg: 'bg-blue-50 border-blue-300 cursor-not-allowed', text: 'text-blue-500' },
  vendido: { bg: 'bg-green-50 border-green-300 cursor-not-allowed', text: 'text-green-600' },
  seleccionado: { bg: 'bg-blue-500 border-blue-600 cursor-pointer scale-105', text: 'text-white' },
};

export default function SorteoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: sorteoData, isLoading } = useSorteo(id);
  const { data: numerosData, refetch } = useNumerosSorteo(id);
  const { reservando, reservaActiva, minutosRestantes, segsRestantes, reservar, liberar, iniciarCheckout } = useReserva(id);

  const sorteo = (sorteoData as any)?.data;
  const numeros: any[] = (numerosData as any)?.data || [];

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">🎯</div>
        <p className="text-gray-500">Cargando sorteo...</p>
      </div>
    </div>
  );

  if (!sorteo) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500">Sorteo no encontrado</p>
      </div>
    </div>
  );

  const handleNumeroClick = async (numero: any) => {
    if (numero.estado !== 'libre') return;
    if (!session) { router.push('/login'); return; }
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

  const pct = sorteo.stats ? Math.round((sorteo.stats.vendidos / sorteo.cant_numeros) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">← Volver</button>
          <span className="font-bold">Sorteos Verificados</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info lateral */}
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-6xl">🎁</div>
            <div className="p-5">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{sorteo.nombre}</h1>
              <p className="text-sm text-gray-400 mb-3">{sorteo.comercio_nombre}</p>
              {sorteo.descripcion && <p className="text-sm text-gray-500 leading-relaxed">{sorteo.descripcion}</p>}
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vendidos</span>
              <span className="font-semibold">{sorteo.stats?.vendidos || 0}/{sorteo.cant_numeros}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { label: 'Por número', value: formatMonto(sorteo.valor_numero), highlight: true },
                { label: 'Disponibles', value: sorteo.stats?.libres || 0 },
                { label: 'Fecha', value: formatFecha(sorteo.fecha_sorteo), span: true },
              ].map(s => (
                <div key={s.label} className={cn('bg-gray-50 rounded-lg p-3', s.span && 'col-span-2')}>
                  <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                  <div className={cn('font-bold text-sm', s.highlight && 'text-blue-600 text-base')}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grilla de números */}
        <div className="lg:col-span-2 space-y-4">
          {reservaActiva && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-700">Número reservado para vos</p>
                <p className="text-sm text-blue-500">
                  Expira en {minutosRestantes}:{String(segsRestantes).padStart(2, '0')}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={liberar} className="btn-ghost text-sm text-red-500 border-red-200">Liberar</button>
                <button onClick={handleComprar} className="btn-primary text-sm">
                  Pagar {formatMonto(sorteo.valor_numero)} →
                </button>
              </div>
            </div>
          )}

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Elegí tu número</h2>
              <div className="flex gap-4 text-xs text-gray-400">
                {[['bg-gray-100', 'Libre'], ['bg-green-100', 'Vendido'], ['bg-blue-500', 'Reservado']].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded ${c}`} />
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
              {numeros.map((n: any) => {
                const isReservado = reservaActiva?.numeroId === n.id;
                const estadoKey = isReservado ? 'seleccionado' : n.estado as keyof typeof ESTADO_NUMERO;
                const estilos = ESTADO_NUMERO[estadoKey] || ESTADO_NUMERO.libre;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleNumeroClick(n)}
                    disabled={reservando || (n.estado !== 'libre' && !isReservado)}
                    className={cn(
                      'aspect-square flex items-center justify-center rounded-lg border-2 font-bold text-sm transition-all',
                      estilos.bg, estilos.text,
                    )}
                  >
                    {n.numero_visible}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
