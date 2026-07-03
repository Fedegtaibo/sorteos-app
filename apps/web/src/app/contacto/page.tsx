
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


export default function Page() {
  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-black text-zinc-300 hover:bg-white/10">
          ← Volver a Sortealo
        </Link>

        <div className="mt-8 rounded-[2.5rem] border border-amber-400/20 bg-amber-400/10 p-7 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            Información importante
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
            Contacto
          </h1>

          <p className="mt-5 text-base leading-8 text-zinc-300">
            Usá esta página para saber cómo comunicarte con Sortealo durante la etapa beta.
          </p>

          <p className="mt-5 text-xs font-semibold text-zinc-500">
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="Soporte general">
            <p>
              Si tenés dudas sobre tu cuenta, una participación, un pago o un sorteo, escribinos indicando tu email de registro, el sorteo relacionado y una descripción clara del problema.
            </p>
          </Section>

          <Section title="Comercios">
            <p>
              Si representás un comercio y querés publicar sorteos en Sortealo, podés contactarnos para recibir acompañamiento inicial durante la beta.
            </p>
          </Section>

          <Section title="Reclamos">
            <p>
              Si querés reportar un problema con un sorteo o con la entrega de un premio, incluí todos los datos posibles: comercio, sorteo, número comprado, fecha de pago y comprobantes disponibles.
            </p>
          </Section>

          <Section title="Canal de contacto">
            <p>
              Durante la beta, el canal de contacto podrá ser informado por Sortealo de forma directa a los usuarios y comercios participantes.
            </p>
            <p>
              Más adelante esta página podrá incluir formulario, email público o WhatsApp de soporte.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
