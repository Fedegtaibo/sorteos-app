import Link from 'next/link';
import { sorteosApi } from '@/lib/api';
import { formatMonto, formatFecha, estadoColor } from '@/lib/utils';

async function getSorteos() {
  try {
    const res: any = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/sorteos`,
      { next: { revalidate: 60 } } // Revalidar cada 60s (SSG incremental)
    );
    const data = await res.json();
    return data?.data?.data || [];
  } catch { return []; }
}

export default async function HomePage() {
  const sorteos = await getSorteos();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-lg">Sorteos Verificados</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Ingresar</Link>
            <Link href="/registro" className="btn-primary text-sm">Registrarse</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sorteos verificados y transparentes</h1>
          <p className="text-xl text-blue-100 mb-8">Participá con confianza. Cada sorteo es auditable y el resultado verificable por cualquier persona.</p>
          <Link href="#sorteos" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Ver sorteos activos
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: '🔒', title: 'Pagos seguros', desc: 'Procesado por MercadoPago. Tu dinero está protegido.' },
          { icon: '✅', title: 'Resultado verificable', desc: 'Podés comprobar que el ganador fue elegido de forma justa.' },
          { icon: '🏪', title: 'Comercios verificados', desc: 'Todos los comercios son aprobados antes de publicar sorteos.' },
        ].map(f => (
          <div key={f.title} className="card p-6 text-center">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Sorteos */}
      <section id="sorteos" className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-8">Sorteos activos</h2>
        {sorteos.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <p className="text-lg">No hay sorteos activos en este momento.</p>
            <p className="text-sm mt-2">¡Volvé pronto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorteos.map((s: any) => (
              <Link key={s.id} href={`/sorteos/${s.id}`} className="card hover:shadow-md transition-shadow group">
                <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-6xl">
                  🎁
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{s.nombre}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${estadoColor(s.estado)}`}>{s.estado}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{s.comercio_nombre}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-blue-600 text-lg">{formatMonto(s.valor_numero)}</span>
                    <span className="text-gray-400">por número</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{s.numeros_vendidos} vendidos de {s.cant_numeros}</span>
                      <span>{Math.round(s.numeros_vendidos / s.cant_numeros * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(s.numeros_vendidos / s.cant_numeros) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">{formatFecha(s.fecha_sorteo)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
