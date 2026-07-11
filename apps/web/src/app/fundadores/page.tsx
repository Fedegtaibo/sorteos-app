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
    <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-zinc-300">
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

        <section className="mt-8 overflow-hidden rounded-[2.5rem] border border-amber-400/20 bg-zinc-950">
          <div className="grid gap-8 p-7 md:grid-cols-[1.25fr_0.75fr] md:p-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
                Comercios fundadores
              </p>

              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                Lanzamiento inicial controlado de Sortealo.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
                Estamos abriendo la primera etapa operativa con comercios reales que quieran vender
                números, ordenar sus sorteos y empezar a usar Sortealo en casos concretos.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400">
                La idea es simple: salir a la luz, operar con comercios reales, cobrar desde el
                inicio, aprender del uso diario y mejorar rápido sin perder control ni confianza.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contacto"
                  className="rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-black hover:bg-amber-200"
                >
                  Quiero sumarme
                </Link>

                <Link
                  href="/ayuda"
                  className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-zinc-200 hover:bg-white/10"
                >
                  Ver cómo funciona
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                Primera etapa
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-3xl font-black text-amber-300">3 a 10</p>
                  <p className="mt-1 text-sm text-zinc-400">comercios fundadores iniciales</p>
                </div>

                <div>
                  <p className="text-3xl font-black text-amber-300">8%</p>
                  <p className="mt-1 text-sm text-zinc-400">comisión inicial sobre lo vendido</p>
                </div>

                <div>
                  <p className="text-3xl font-black text-amber-300">Real</p>
                  <p className="mt-1 text-sm text-zinc-400">uso acompañado con sorteos concretos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-5">
          <Section title="¿Qué es esta etapa?">
            <p>
              Es el lanzamiento inicial controlado de Sortealo con comercios reales. No es una demo
              cerrada ni una prueba sin valor comercial: es el inicio operativo del producto.
            </p>

            <p>
              La diferencia es que, durante esta primera etapa, vamos a trabajar con pocos comercios
              para acompañar el uso, revisar el flujo completo y mejorar el sistema con información
              real.
            </p>
          </Section>

          <Section title="¿Qué comercios buscamos?">
            <ul className="grid gap-3 md:grid-cols-2">
              <Item>Comercios, marcas o emprendimientos con comunidad propia.</Item>
              <Item>Negocios que quieran vender números de sorteos online.</Item>
              <Item>Comercios dispuestos a hacer sorteos chicos o medianos al inicio.</Item>
              <Item>Equipos que puedan dar feedback directo sobre el uso de la plataforma.</Item>
            </ul>
          </Section>

          <Section title="Qué ofrece Sortealo">
            <ul className="grid gap-3 md:grid-cols-2">
              <Item>Publicación del sorteo con premio, valor del número y cantidad disponible.</Item>
              <Item>Selección de números desde una web pública.</Item>
              <Item>Registro de participantes, pagos, números vendidos y comprobantes.</Item>
              <Item>Panel para que el comercio pueda ordenar sus sorteos y ver actividad.</Item>
              <Item>Mayor transparencia frente al sorteo informal por redes o WhatsApp.</Item>
              <Item>Acompañamiento inicial para validar el funcionamiento en casos reales.</Item>
            </ul>
          </Section>

          <Section title="Modelo económico">
            <p>
              Sortealo cobra una comisión inicial del 8% sobre lo vendido. Esto nos permite validar
              desde el primer día el modelo económico real, financiar mejoras y construir una
              plataforma sostenible.
            </p>

            <p>
              El objetivo no es regalar el sistema, sino demostrar que puede ayudar a los comercios a
              vender mejor y operar sorteos de forma más profesional.
            </p>
          </Section>

          <Section title="Cómo avanzar">
            <p>
              Si querés sumar tu comercio a esta primera etapa, escribinos con el nombre del negocio,
              rubro, ciudad, redes sociales, tipo de premio que querés sortear y una estimación del
              valor de cada número.
            </p>

            <div className="pt-2">
              <Link
                href="/contacto"
                className="inline-flex rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-black hover:bg-amber-200"
              >
                Contactar a Sortealo
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}