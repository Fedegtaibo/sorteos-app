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
        <Link
          href="/"
          className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-black text-zinc-300 hover:bg-white/10"
        >
          ← Volver a Sortealo
        </Link>

        <div className="mt-8 rounded-[2.5rem] border border-amber-400/20 bg-amber-400/10 p-7 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            Soporte y consultas
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">
            Contacto
          </h1>

          <p className="mt-5 text-base leading-8 text-zinc-300">
            Usá esta página para saber qué información enviar cuando necesites ayuda con tu cuenta,
            una participación, un pago, un sorteo, un comercio o la entrega de un premio.
          </p>

          <p className="mt-5 text-xs font-semibold text-zinc-500">
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="1. Soporte para participantes">
            <p>
              Si tenés una consulta sobre tu cuenta, una participación, un número comprado o un
              comprobante, incluí siempre la mayor cantidad de información posible para poder revisar
              el caso.
            </p>

            <p>
              Es recomendable indicar el email con el que te registraste, el nombre del sorteo, el
              comercio organizador, los números comprados, la fecha aproximada del pago y una
              descripción clara de lo ocurrido.
            </p>
          </Section>

          <Section title="2. Problemas con pagos">
            <p>
              Si tu pago figura pendiente, rechazado, cancelado o no aparece reflejado en tu cuenta,
              primero revisá la sección de participaciones dentro de tu dashboard.
            </p>

            <p>
              Si el problema continúa, enviá el detalle de la operación, el sorteo relacionado, el
              medio de pago utilizado y cualquier comprobante disponible para facilitar la revisión.
            </p>
          </Section>

          <Section title="3. Reclamos sobre sorteos o premios">
            <p>
              Si querés reportar un problema con un sorteo, con el resultado, con un comercio o con
              la entrega de un premio, describí el caso con claridad e incluí toda la información que
              tengas disponible.
            </p>

            <p>
              Sortealo podrá revisar los datos registrados dentro de la plataforma, solicitar
              información adicional al participante o al comercio y tomar medidas razonables según el
              caso.
            </p>
          </Section>

          <Section title="4. Consultas de comercios">
            <p>
              Si representás un comercio, marca o emprendimiento y querés usar Sortealo para publicar
              sorteos online, podés contactarnos para recibir acompañamiento inicial.
            </p>

            <p>
              Para avanzar más rápido, indicá el nombre del comercio, rubro, ciudad, redes sociales,
              tipo de premio que querés sortear y una estimación del valor de cada número.
            </p>
          </Section>

          <Section title="5. Información útil para enviar">
            <p>
              Para ayudarnos a responder mejor, cuando hagas una consulta intentá incluir:
            </p>

            <ul className="list-disc space-y-2 pl-5">
              <li>Email de tu cuenta.</li>
              <li>Nombre del sorteo.</li>
              <li>Comercio organizador.</li>
              <li>Números seleccionados o comprados.</li>
              <li>Fecha aproximada de la operación.</li>
              <li>Comprobante o captura si corresponde.</li>
              <li>Descripción clara del problema.</li>
            </ul>
          </Section>

          <Section title="6. Canal de contacto">
            <p>
              Durante la etapa inicial, Sortealo podrá informar el canal de contacto de forma directa
              a los usuarios y comercios que estén utilizando la plataforma.
            </p>

            <p>
              Si recibiste una invitación para usar Sortealo, podés responder por el mismo canal por
              el que fuiste contactado.
            </p>

            <p>
              Más adelante esta página podrá incluir un formulario de soporte, email público o
              WhatsApp oficial de atención.
            </p>
          </Section>

          <Section title="7. Antes de escribirnos">
            <p>
              También podés revisar la página de ayuda, donde respondemos las dudas más comunes sobre
              participación, pagos, números reservados, comercios, premios y reclamos.
            </p>

            <div className="pt-2">
              <Link
                href="/ayuda"
                className="inline-flex rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-black hover:bg-amber-200"
              >
                Ir a ayuda
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}