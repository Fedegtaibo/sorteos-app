'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { comercioApi, adminApi } from '@/lib/api';
import { formatMonto } from '@/lib/utils';
import Link from 'next/link';

function MetricCard({ label, value, tone = 'text-amber-300', sub }: any) {
  return (
    <div className="card p-6">
      <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-4">{label}</p>
      <div className={`text-3xl font-black ${tone}`}>{value}</div>
      {sub && <p className="text-sm text-zinc-500 mt-2">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const email = session?.user?.email;

  const { data: statsData } = useQuery({
    queryKey: ['estadisticas', role],
    queryFn: () => (role === 'admin' ? adminApi.estadisticas() : comercioApi.estadisticas()),
    enabled: !!role && role !== 'participante',
  });

  const stats = (statsData as any)?.data?.data || (statsData as any)?.data;

  if (role === 'participante') {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-10">
            <p className="text-xs text-amber-300 uppercase tracking-[0.25em]">PARTICIPANTE</p>
            <h1 className="text-4xl font-black mt-3">Mi cuenta</h1>
            <p className="text-zinc-500 mt-3">{email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8">
              <div className="text-5xl mb-6">🎟️</div>
              <h2 className="text-2xl font-black mb-3">Mis participaciones</h2>
              <p className="text-zinc-500 mb-8">
                Revisá los sorteos en los que participaste, tus números y comprobantes.
              </p>
              <Link href="/dashboard/participaciones" className="btn-primary inline-block">
                Ver participaciones →
              </Link>
            </div>

            <div className="card p-8">
              <div className="text-5xl mb-6">🎯</div>
              <h2 className="text-2xl font-black mb-3">Explorar sorteos</h2>
              <p className="text-zinc-500 mb-8">
                Buscá sorteos activos y reservá tus próximos números.
              </p>
              <Link href="/" className="btn-ghost inline-block">
                Ver sorteos
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (role === 'comercio' && stats) {
    const { sorteos, recaudacion } = stats;

    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <p className="text-xs text-amber-300 uppercase tracking-[0.25em]">PANEL DE COMERCIO</p>
              <h1 className="text-4xl font-black mt-3">Dashboard</h1>
              <p className="text-zinc-500 mt-3">Resumen de ventas, comisiones y sorteos.</p>
            </div>
            <Link href="/dashboard/sorteos/nuevo" className="btn-primary">
              + Nuevo sorteo
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <MetricCard label="Recaudación bruta" value={formatMonto(recaudacion.bruta)} tone="text-amber-300" />
            <MetricCard label="Comisión plataforma" value={formatMonto(recaudacion.comision)} tone="text-red-400" sub="8% del total" />
            <MetricCard label="Ganancia neta" value={formatMonto(recaudacion.neta)} tone="text-emerald-400" />
            <MetricCard label="Sorteos activos" value={sorteos.activos} tone="text-sky-400" />
          </div>

          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black">Mis sorteos</h2>
                <p className="text-zinc-500 mt-2">Administrá tus sorteos activos, borradores y finalizados.</p>
              </div>
              <Link href="/dashboard/sorteos" className="text-amber-300 font-bold">
                Ver todos →
              </Link>
            </div>

            <Link href="/dashboard/sorteos" className="btn-ghost inline-block">
              Ir al listado
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (role === 'admin' && stats) {
    const { usuarios, comercios, sorteos, finanzas } = stats;

    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-10">
            <p className="text-xs text-red-300 uppercase tracking-[0.25em]">PANEL DE ADMINISTRACIÓN</p>
            <h1 className="text-4xl font-black mt-3">Plataforma Sortealo</h1>
            <p className="text-zinc-500 mt-3">Control general de comercios, usuarios, sorteos y comisiones.</p>
          </div>

          {comercios.pendientes > 0 && (
            <div className="mb-8 rounded-2xl border border-amber-700 bg-amber-950/40 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-amber-300 font-black">
                  ⚠ {comercios.pendientes} comercio(s) pendiente(s) de aprobación
                </p>
                <p className="text-zinc-500 text-sm mt-1">Revisá las solicitudes para habilitar nuevos sorteos.</p>
              </div>
              <Link href="/dashboard/admin/comercios" className="btn-primary">
                Revisar ahora
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <MetricCard label="Volumen operado" value={formatMonto(finanzas.volumenTotal)} tone="text-amber-300" />
            <MetricCard label="Comercios activos" value={comercios.aprobados} tone="text-emerald-400" />
            <MetricCard label="Sorteos activos" value={sorteos.activos} tone="text-sky-400" />
            <MetricCard label="Participantes" value={usuarios.participantes} tone="text-purple-400" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="animate-pulse text-zinc-500">Cargando...</div>
    </main>
  );
}