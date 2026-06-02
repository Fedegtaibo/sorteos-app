'use client';
import { useQuery } from '@tanstack/react-query';
import { pagosApi } from '@/lib/api';
import { formatMonto, formatFecha, estadoColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ParticipacionesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['mis-participaciones'],
    queryFn: () => pagosApi.misParticipaciones() as any,
  });

  const participaciones: any[] = (data as any)?.data || [];

  if (isLoading) return <div className="animate-pulse text-gray-400">Cargando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mis participaciones</h1>
      {participaciones.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">🎟</div>
          <h2 className="text-lg font-semibold mb-2">Todavía no participaste en ningún sorteo</h2>
          <Link href="/" className="btn-primary mt-4 inline-block">Ver sorteos activos</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {participaciones.map((p: any) => {
            const esGanador = p.ganador_participacion_id === p.id;
            return (
              <div key={p.id} className={cn('card p-5 flex items-center gap-5', esGanador && 'border-yellow-300 bg-yellow-50')}>
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shrink-0',
                  esGanador ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-300' :
                  p.sorteo_estado === 'activo' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                  'bg-gray-100 text-gray-500 border border-gray-200'
                )}>
                  {p.numero_visible}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 truncate">{p.sorteo_nombre}</span>
                    {esGanador && <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">🏆 GANADOR</span>}
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold', estadoColor(p.sorteo_estado))}>
                      {p.sorteo_estado}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {p.comercio} · Número {p.numero_visible} · {formatMonto(Number(p.monto_pagado))} · {formatFecha(p.created_at)}
                  </div>
                </div>
                {p.comprobante_url && (
                  <a href={p.comprobante_url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-xs shrink-0">
                    Comprobante
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
