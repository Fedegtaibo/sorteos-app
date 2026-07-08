import Link from 'next/link';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6 md:p-8">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-400">
        {children}
      </div>
    </section>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-semibold leading-6 text-zinc-300">
      {children}
    </li>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-black text-zinc-300 hover:bg-white/10"
        >
          ← Volver a Sortealo
        </Link>

        <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-amber-400/20 bg-amber-400/10 p-7 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            Beta pública controlada
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">
            Buscamos comercios fundadores para lanzar los primeros sorteos reales.
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300">
            Sortealo es una plataforma para que comercios, marcas y emprendimientos puedan crear sorteos online de forma más ordenada, transparente y profesional.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contacto"
              className="rounded-2xl bg-amber-400 px-6 py-4 text-center text-sm font-black text-black hover:bg-amber-300"
            >
              Quiero sumarme a la beta
            </Link>

            <Link
              href="/dashboard/explorar"
              className="rounded-2xl border border-white/10 px-6 py-4 text-center text-sm font-black text-white hover:bg-white/10"
            >
              Ver sorteos activos
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <p className="text-3xl font-black text-amber-300">3 a 5</p>
            <p className="mt-2 text-sm font-bold text-zinc-400">
              comercios fundadores
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <p className="text-3xl font-black text-amber-300">8%</p>
            <p className="mt-2 text-sm font-bold text-zinc-400">
              comisión inicial
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
            <p className="text-3xl font-black text-amber-300">Beta</p>
            <p className="mt-2 text-sm font-bold text-zinc-400">
              acompañada y controlada
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="¿Qué es la beta de Sortealo?">
            <p>
              Es una etapa inicial para probar Sortealo con comercios reales, sorteos chicos o medianos y acompañamiento directo durante todo el proceso.
            </p>
            <p>
              No buscamos lanzar de forma masiva desde el primer día. Buscamos validar que el sistema funcione bien en casos reales, detectar mejoras y construir confianza.
            </p>
          </Section>

          <Section title="¿Qué tipo de comercios buscamos?">
            <ul className="grid gap-3 md:grid-cols-2">
              <Item>Comercios, marcas o emprendimientos con productos reales.</Item>
              <Item>Negocios dispuestos a probar una forma más ordenada de sortear.</Item>
              <Item>Sorteos chicos o medianos, fáciles de controlar.</Item>
              <Item>Comercios que puedan entregar el premio de forma clara.</Item>
            </ul>
          </Section>

          <Section title="¿Cómo funciona?">
            <ul className="grid gap-3 md:grid-cols-2">
              <Item>El comercio publica el sorteo con premio, precio y cantidad de números.</Item>
              <Item>Los participantes eligen números disponibles desde la web.</Item>
              <Item>El pago y la participación quedan registrados.</Item>
              <Item>El comercio puede seguir la actividad desde su panel.</Item>
            </ul>
          </Section>

          <Section title="Condición comercial">
            <p>
              La beta no es con comisión cero. Sortealo cobra una comisión inicial del 8% sobre lo vendido para validar también el modelo económico real.
            </p>
            <p>
              La idea es que el producto salga a la luz de forma seria desde el inicio, con acompañamiento y control manual cuando sea necesario.
            </p>
          </Section>

          <Section title="Qué incluye el acompañamiento">
            <ul className="grid gap-3 md:grid-cols-2">
              <Item>Ayuda para crear el primer sorteo.</Item>
              <Item>Revisión del premio, precio y cantidad de números.</Item>
              <Item>Seguimiento manual de pagos y participaciones.</Item>
              <Item>Soporte directo durante la beta.</Item>
            </ul>
          </Section>

          <div className="rounded-[2.5rem] border border-amber-400/30 bg-gradient-to-br from-amber-300 to-orange-500 p-8 text-black md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-black/60">
              Comercios fundadores
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              Si querés probar Sortealo con tu comercio, sumate a la beta.
            </h2>

            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-black/70">
              Vamos a trabajar con pocos comercios al inicio para acompañar bien cada sorteo, escuchar feedback real y mejorar la plataforma antes de escalar.
            </p>

            <Link
              href="/contacto"
              className="mt-7 inline-flex rounded-2xl bg-black px-6 py-4 text-sm font-black text-white hover:bg-zinc-900"
            >
              Contactar a Sortealo
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}