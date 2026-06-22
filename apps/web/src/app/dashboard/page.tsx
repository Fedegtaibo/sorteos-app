'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { comercioApi, adminApi } from '@/lib/api';
import { formatMonto } from '@/lib/utils';
import Link from 'next/link';
import VentasChart from '@/components/VentasChart';
import EntregasChart from '@/components/EntregasChart';

function MetricCard({
  label,
  value,
  tone = 'text-amber-300',
  sub,
  compact = false,
}: any) {
  return (
    <div className={`card ${compact ? 'p-4' : 'p-5'}`}>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>

      <div className={`${compact ? 'text-xl' : 'text-2xl'} font-black ${tone}`}>
        {value}
      </div>

      {sub && (
        <p className="mt-1 text-xs text-zinc-500">
          {sub}
        </p>
      )}
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
              <Link href="/dashboard/explorar" className="btn-ghost inline-block">
                Ver sorteos
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (role === 'comercio' && stats) {
    const {
  sorteos,
  recaudacion,
  participantes = { unicos: 0, ventasTotales: 0 },
  entregas = { pendientes: 0, enviados: 0, entregados: 0, confirmados: 0, reclamados: 0 },
  topSorteos = [],
  ventasUltimos30Dias = [],
topCompradores = [],
} = stats;

const ticketPromedio =
  participantes.ventasTotales > 0
    ? recaudacion.bruta / participantes.ventasTotales
    : 0;

const porcentajePromedio =
  topSorteos.length > 0
    ? Math.round(
        topSorteos.reduce(
          (acc: number, s: any) => acc + s.porcentajeVendido,
          0,
        ) / topSorteos.length,
      )
    : 0;

const mejorSorteo = topSorteos[0]?.nombre || '-';

    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <p className="text-xs text-amber-300 uppercase tracking-[0.25em]">PANEL DE COMERCIO</p>
              <h1 className="text-4xl font-black mt-3">Dashboard</h1>
              <p className="text-zinc-500 mt-3">Resumen avanzado de ventas, comisiones y logística.</p>
            </div>
            <Link href="/dashboard/sorteos/nuevo" className="btn-primary">
              + Nuevo sorteo
            </Link>
          </div>
            
          <div className="mb-8">
  <VentasChart data={ventasUltimos30Dias} />
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

  <EntregasChart entregas={entregas} />

  <section className="card p-8">
    <h2 className="text-2xl font-black">Resumen de logística</h2>

    <p className="text-zinc-500 mt-2 mb-6">
      Estado actual de todos los premios.
    </p>

    <div className="space-y-3">

      <div className="flex justify-between">
        <span className="text-zinc-400">Pendientes</span>
        <span className="font-bold text-amber-300">{entregas.pendientes}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-zinc-400">Enviados</span>
        <span className="font-bold text-purple-300">{entregas.enviados}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-zinc-400">Entregados</span>
        <span className="font-bold text-green-300">{entregas.entregados}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-zinc-400">Confirmados</span>
        <span className="font-bold text-emerald-300">{entregas.confirmados}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-zinc-400">Reclamos</span>
        <span className="font-bold text-red-300">{entregas.reclamados}</span>
      </div>

    </div>

  </section>

</div>


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

  <MetricCard
    label="Ticket promedio"
    value={formatMonto(ticketPromedio)}
    tone="text-amber-300"
  />

  <MetricCard
    label="Ventas totales"
    value={participantes.ventasTotales}
    tone="text-sky-400"
  />

  <MetricCard
    label="% promedio vendido"
    value={`${porcentajePromedio}%`}
    tone="text-emerald-400"
  />

  <MetricCard
    label="Mejor sorteo"
    value={mejorSorteo}
    tone="text-purple-300"
  />

</div>



          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
            <MetricCard label="Recaudación bruta" value={formatMonto(recaudacion.bruta)} tone="text-amber-300" />
            <MetricCard label="Comisión" value={formatMonto(recaudacion.comision)} tone="text-red-400" />
            <MetricCard label="Ganancia neta" value={formatMonto(recaudacion.neta)} tone="text-emerald-400" />
            <MetricCard label="Sorteos activos" value={sorteos.activos} tone="text-sky-400" />
            <MetricCard label="Participantes" value={participantes.unicos} tone="text-purple-400" />
            <MetricCard label="Reclamos" value={entregas.reclamados} tone="text-red-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <section className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black">Top sorteos</h2>
                  <p className="text-zinc-500 mt-2">Los sorteos con mayor recaudación.</p>
                </div>
                <Link href="/dashboard/sorteos" className="text-amber-300 font-bold">
                  Ver todos →
                </Link>
              </div>

              {topSorteos.length === 0 ? (
                <p className="text-zinc-500">Todavía no hay ventas registradas.</p>
              ) : (
                <div className="space-y-4">
                  {topSorteos.map((s: any) => (
                    <div key={s.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-black text-white">{s.nombre}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {s.vendidos}/{s.totalNumeros} vendidos · {s.porcentajeVendido}%
                          </p>
                        </div>
                        <p className="font-black text-emerald-400">
                          {formatMonto(s.recaudacion)}
                        </p>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${Math.min(s.porcentajeVendido, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

<section className="card p-8">
  <h2 className="text-2xl font-black">
    Top compradores
  </h2>

  <p className="mt-2 mb-6 text-zinc-500">
    Participantes con más compras.
  </p>

  {topCompradores.length === 0 ? (
    <p className="text-zinc-500">
      Todavía no hay datos suficientes.
    </p>
  ) : (
    <div className="space-y-4">
      {topCompradores.map((u: any, index: number) => (
        <div
          key={u.email}
          className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
        >
          <div>
            <p className="font-black text-white">
              #{index + 1}
            </p>

            <p className="mt-1 text-sm text-zinc-400">
              {u.email}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xl font-black text-amber-300">
              {u.total}
            </p>

            <p className="text-xs text-zinc-500">
              compras
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

            <section className="card p-8">
              <h2 className="text-2xl font-black">Logística</h2>
              <p className="text-zinc-500 mt-2 mb-6">Estado general de entregas y premios.</p>

              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="Pendientes" value={entregas.pendientes} tone="text-amber-300" compact />
<MetricCard label="Enviados" value={entregas.enviados} tone="text-purple-300" compact />
<MetricCard label="Entregados" value={entregas.entregados} tone="text-green-300" compact />
<MetricCard label="Confirmados" value={entregas.confirmados} tone="text-emerald-300" compact />
              </div>

              <Link href="/dashboard/entregas" className="btn-ghost mt-6 inline-block">
                Gestionar entregas
              </Link>
            </section>
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
            <h1 className="mt-2 text-3xl font-black">Dashboard</h1>
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