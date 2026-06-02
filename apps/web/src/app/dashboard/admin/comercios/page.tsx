'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { estadoColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminComerciosPage() {
  const qc = useQueryClient();
  const [filtroEstado, setFiltroEstado] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-comercios', filtroEstado],
    queryFn: () => adminApi.comercios({ estado: filtroEstado || undefined }) as any,
  });

  const aprobar = useMutation({
    mutationFn: (id: string) => adminApi.aprobarComercio(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-comercios'] }); toast.success('Comercio aprobado'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rechazar = useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) => adminApi.rechazarComercio(id, motivo),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-comercios'] }); toast.success('Comercio rechazado'); },
  });

  const suspender = useMutation({
    mutationFn: (id: string) => adminApi.suspenderComercio(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-comercios'] }); toast.success('Comercio suspendido'); },
  });

  const comercios: any[] = (data as any)?.data?.data || [];
  const pendientes = comercios.filter(c => c.estado === 'pendiente').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comercios</h1>
          {pendientes > 0 && (
            <p className="text-sm text-yellow-600 font-medium mt-1">⚠ {pendientes} pendiente{pendientes > 1 ? 's' : ''} de aprobación</p>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {['', 'pendiente', 'aprobado', 'suspendido', 'rechazado'].map(e => (
          <button key={e || 'todos'} onClick={() => setFiltroEstado(e)}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              filtroEstado === e ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>
            {e || 'Todos'}
          </button>
        ))}
      </div>

      {isLoading ? <div className="animate-pulse text-gray-400">Cargando...</div> : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Comercio', 'CUIT', 'Estado', 'Sorteos', 'Comisión', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {comercios.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-sm text-gray-900">{c.razon_social}</div>
                    <div className="text-xs text-gray-400">{c.email}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 font-mono">{c.cuit}</td>
                  <td className="px-4 py-4">
                    <span className={cn('text-xs px-2 py-1 rounded-full font-semibold', estadoColor(c.estado))}>{c.estado}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">—</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.comision_pct}%</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {c.estado === 'pendiente' && (
                        <>
                          <button onClick={() => aprobar.mutate(c.id)} disabled={aprobar.isPending}
                            className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-green-100">
                            Aprobar
                          </button>
                          <button onClick={() => {
                            const motivo = window.prompt('Motivo del rechazo:');
                            if (motivo) rechazar.mutate({ id: c.id, motivo });
                          }} className="btn-danger px-3 py-1 text-xs">Rechazar</button>
                        </>
                      )}
                      {c.estado === 'aprobado' && (
                        <button onClick={() => { if (window.confirm('¿Suspender este comercio? Se cancelarán sus sorteos activos.')) suspender.mutate(c.id); }}
                          className="btn-danger px-3 py-1 text-xs">Suspender</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {comercios.length === 0 && (
            <div className="text-center py-12 text-gray-400">No hay comercios con este filtro</div>
          )}
        </div>
      )}
    </div>
  );
}
