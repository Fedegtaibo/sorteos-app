
import Link from 'next/link';
import { formatMonto, formatFecha, estadoColor } from '@/lib/utils';

async function getSorteos() {
  try {
    const res: any = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/sorteos`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return data?.data?.data || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const sorteos = await getSorteos();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-600 text-lg font-black text-white">
              S
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-black text-gray-900 sm:text-lg">
                Sortealo
              </p>
              <p className="hidden text-xs text-gray-500 sm:block">
                Sorteos verificados
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
            >
              Ingresar
            </Link>
            <Link
              href="/registro"
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-black text-white hover:bg-blue-700 sm:px-4"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-600 to-blue-900 px-4 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-blue-200">
            Sorteos seguros
          </p>

          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            Sorteos verificados y transparentes
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-xl">
            Participá con confianza. Cada sorteo es auditable y el resultado puede ser verificado por cualquier persona.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="#sorteos"
              className="rounded-2xl bg-white px-6 py-4 text-center text-base font-black text-blue-700 shadow-lg hover:bg-blue-50"
            >
              Ver sorteos activos
            </Link>

            <Link
              href="/registro"
              className="rounded-2xl border border-white/30 px-6 py-4 text-center text-base font-black text-white hover:bg-white/10"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 py-10 sm:py-16 md:grid-cols-3 md:gap-8">
        {[
          { icon: 'MP', title: 'Pagos seguros', desc: 'Procesado por MercadoPago. Tu dinero está protegido.' },
          { icon: 'OK', title: 'Resultado verificable', desc: 'Podés comprobar que el ganador fue elegido de forma justa.' },
          { icon: 'ID', title: 'Comercios verificados', desc: 'Los comercios son revisados antes de publicar sorteos.' },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">
              {f.icon}
            </div>
            <h3 className="mb-2 text-lg font-black text-gray-900">{f.title}</h3>
            <p className="text-sm leading-6 text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>

      <section id="sorteos" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
              Participá ahora
            </p>
            <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
              Sorteos activos
            </h2>
          </div>
        </div>

        {sorteos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-400">
            <p className="text-lg font-bold">No hay sorteos activos en este momento.</p>
            <p className="mt-2 text-sm">Volvé pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {sorteos.map((s: any) => {
              const porcentaje = s.cant_numeros
                ? Math.round((s.numeros_vendidos / s.cant_numeros) * 100)
                : 0;

              return (
                <Link
                  key={s.id}
                  href={`/sorteos/${s.id}`}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-44 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 sm:h-48">
                    <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white text-3xl font-black text-blue-600 shadow-sm">
                      S
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="min-w-0 text-lg font-black leading-tight text-gray-900 transition group-hover:text-blue-600">
                        {s.nombre}
                      </h3>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${estadoColor(s.estado)}`}>
                        {s.estado}
                      </span>
                    </div>

                    <p className="mb-4 text-xs font-semibold text-gray-400">
                      {s.comercio_nombre}
                    </p>

                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Valor por número</p>
                        <p className="text-xl font-black text-blue-600">
                          {formatMonto(s.valor_numero)}
                        </p>
                      </div>

                      <p className="text-right text-xs text-gray-400">
                        Sortea<br />
                        <span className="font-bold text-gray-600">{formatFecha(s.fecha_sorteo)}</span>
                      </p>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <div className="mb-2 flex justify-between text-xs font-semibold text-gray-400">
                        <span>{s.numeros_vendidos} vendidos de {s.cant_numeros}</span>
                        <span>{porcentaje}%</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}