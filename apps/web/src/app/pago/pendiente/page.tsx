import Link from 'next/link';

export default function PagoPendientePage() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[2.5rem] border border-amber-400/20 bg-zinc-950 p-7 text-center md:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10 text-4xl">
            ⏳
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            Pago pendiente
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
            Tu pago todavía se está procesando.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-300">
            MercadoPago aún no confirmó la operación. Cuando el pago sea aprobado, Sortealo
            registrará automáticamente tu participación y asociará los números a tu cuenta.
          </p>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 text-left">
            <h2 className="text-lg font-black text-white">Qué hacer ahora</h2>

            <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
              <li>• Revisá Mis participaciones para ver si el pago ya impactó.</li>
              <li>• Si todavía no aparece, esperá unos minutos y actualizá la página.</li>
              <li>• No vuelvas a pagar el mismo sorteo sin revisar primero tu cuenta.</li>
              <li>• Si el estado no cambia después de un tiempo, contactá soporte.</li>
            </ul>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <Link
              href="/dashboard/participaciones"
              className="rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-black hover:bg-amber-200"
            >
              Ver mis participaciones
            </Link>

            <Link
              href="/contacto"
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-zinc-200 hover:bg-white/10"
            >
              Contactar soporte
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-zinc-200 hover:bg-white/10"
            >
              Volver al inicio
            </Link>
          </div>

          <p className="mt-6 text-xs leading-6 text-zinc-500">
            Algunos medios de pago pueden demorar más en confirmarse. La participación queda activa
            recién cuando el pago figure aprobado.
          </p>
        </section>
      </div>
    </main>
  );
}