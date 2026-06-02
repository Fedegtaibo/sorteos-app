'use client';
import { useMisSorteos, useActivarSorteo } from '@/hooks/use-sorteo';
import { formatMonto, estadoColor } from '@/lib/utils';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MisSorteosPage() {
  const { data, isLoading } = useMisSorteos();
  const activar = useActivarSorteo();
  const sorteos: any[] = (data as any)?.data?.data || [];

  if (isLoading) return <div className="animate-pulse text-gray-400">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis sorteos</h1>
        <Link href="/dashboard/sorteos/nuevo" className="btn-primary">+ Nuevo sorteo</Link>
      </div>

      {sorteos.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-lg font-semibold mb-2">Todavía no tenés sorteos</h2>
          <p className="text-gray-500 mb-6">Creá tu primer sorteo y empezá a vender números.</p>
          <Link href="/dashboard/sorteos/nuevo" className="btn-primary">Crear primer sorteo</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorteos.map((s: any) => {
            const vendidos = s.stats?.vendidos || 0;
            const pct = Math.round((vendidos / s.cant_numeros) * 100);
            const recaudacion = vendidos * Number(s.valor_numero);
            return (
              <div key={s.id} className="card p-5 flex items-center gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{s.nombre}</h3>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-semibold shrink-0', estadoColor(s.estado))}>
                      {s.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{vendidos}/{s.cant_numeros} números</span>
                    <span>{formatMonto(Number(s.valor_numero))} c/u</span>
                    <span className="font-semibold text-green-600">Recaudado: {formatMonto(recaudacion)}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden w-48">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {s.estado === 'borrador' && (
                    <button
                      onClick={() => activar.mutate(s.id)}
                      disabled={activar.isPending}
                      className="btn-primary text-sm">
                      Activar
                    </button>
                  )}
                  {s.estado === 'activo' && (
                    <Link href={`/sorteos/${s.id}`} className="btn-ghost text-sm">
                      Ver página pública
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
