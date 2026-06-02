'use client';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { comercioApi, adminApi } from '@/lib/api';
import { formatMonto } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  const { data: statsData } = useQuery({
    queryKey: ['estadisticas', role],
    queryFn: () => role === 'admin' ? adminApi.estadisticas() : comercioApi.estadisticas(),
    enabled: !!role && role !== 'participante',
  });

  const stats = (statsData as any)?.data;

  if (role === 'participante') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Mi cuenta</h1>
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">🎟</div>
          <h2 className="text-lg font-semibold mb-2">Mis participaciones</h2>
          <p className="text-gray-500 mb-4">Revisá todos los sorteos en los que participaste</p>
          <Link href="/dashboard/participaciones" className="btn-primary">Ver participaciones</Link>
        </div>
      </div>
    );
  }

  if (role === 'comercio' && stats) {
    const { sorteos, recaudacion } = stats;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Panel del comercio</h1>
          <Link href="/dashboard/sorteos/nuevo" className="btn-primary">+ Nuevo sorteo</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Recaudación bruta', value: formatMonto(recaudacion.bruta), color: 'text-blue-600' },
            { label: 'Comisión plataforma', value: formatMonto(recaudacion.comision), color: 'text-red-500' },
            { label: 'Ganancia neta', value: formatMonto(recaudacion.neta), color: 'text-green-600' },
            { label: 'Sorteos activos', value: sorteos.activos, color: 'text-blue-600' },
          ].map(k => (
            <div key={k.label} className="card p-5">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">{k.label}</div>
              <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            </div>
          ))}
        </div>
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Mis sorteos</h2>
            <Link href="/dashboard/sorteos" className="text-sm text-blue-600">Ver todos →</Link>
          </div>
          <Link href="/dashboard/sorteos" className="btn-ghost w-full text-center">Ver mis sorteos</Link>
        </div>
      </div>
    );
  }

  if (role === 'admin' && stats) {
    const { usuarios, comercios, sorteos, finanzas } = stats;
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Panel de administración</h1>
        {comercios.pendientes > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-yellow-500 text-xl">⚠</span>
              <div>
                <p className="font-semibold text-yellow-800">{comercios.pendientes} comercio(s) pendiente(s) de aprobación</p>
              </div>
            </div>
            <Link href="/dashboard/admin/comercios" className="btn-primary text-sm">Revisar ahora</Link>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Volumen operado', value: formatMonto(finanzas.volumenTotal), color: 'text-blue-600' },
            { label: 'Comercios activos', value: comercios.aprobados, color: 'text-green-600' },
            { label: 'Sorteos activos', value: sorteos.activos, color: 'text-blue-600' },
            { label: 'Participantes', value: usuarios.participantes, color: 'text-purple-600' },
          ].map(k => (
            <div key={k.label} className="card p-5">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">{k.label}</div>
              <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-gray-400">Cargando...</div>
    </div>
  );
}
