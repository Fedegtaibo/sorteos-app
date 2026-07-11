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
            Centro de ayuda
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">
            Ayuda y preguntas frecuentes
          </h1>

          <p className="mt-5 text-base leading-8 text-zinc-300">
            Acá encontrás respuestas rápidas para entender cómo participar, cómo crear sorteos,
            qué pasa con los pagos, dónde ver tus números y cómo pedir soporte.
          </p>

          <p className="mt-5 text-xs font-semibold text-zinc-500">
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="1. ¿Qué es Sortealo?">
            <p>
              Sortealo es una plataforma para que comercios, marcas y emprendimientos puedan crear
              sorteos online de forma más ordenada, segura y transparente.
            </p>

            <p>
              Los participantes pueden elegir números, pagar desde la web y ver sus participaciones
              registradas dentro de su cuenta.
            </p>
          </Section>

          <Section title="2. ¿Cómo participo en un sorteo?">
            <p>
              Para participar, creás una cuenta, iniciás sesión, elegís un sorteo activo,
              seleccionás uno o más números disponibles y completás el pago.
            </p>

            <p>
              Cuando el pago se confirma, tus números quedan registrados en la plataforma y podés
              verlos desde tu cuenta.
            </p>
          </Section>

          <Section title="3. ¿Dónde veo mis números comprados?">
            <p>
              Desde tu dashboard, en la sección de participaciones, podés ver los sorteos en los
              que participaste, los números asociados y el estado de cada participación.
            </p>

            <p>
              También podés consultar los comprobantes disponibles cuando la operación queda
              registrada correctamente.
            </p>
          </Section>

          <Section title="4. ¿Qué significa que un número esté reservado?">
            <p>
              Cuando seleccionás un número y avanzás al pago, ese número puede quedar reservado
              durante unos minutos para que puedas completar la operación.
            </p>

            <p>
              Si el pago no se confirma dentro del tiempo disponible, la reserva puede liberarse y
              el número puede volver a estar disponible para otros participantes.
            </p>
          </Section>

          <Section title="5. ¿Qué pasa si mi pago queda pendiente?">
            <p>
              Si el pago queda pendiente, la participación puede demorar en confirmarse. Esto puede
              depender del proveedor de pagos o del medio de pago elegido.
            </p>

            <p>
              Cuando Sortealo recibe la confirmación del pago, el sistema actualiza el estado de la
              participación y asocia los números correspondientes.
            </p>
          </Section>

          <Section title="6. ¿Qué pasa si mi pago fue rechazado o cancelado?">
            <p>
              Si el pago fue rechazado, cancelado o no confirmado, la participación puede no quedar
              activa y los números seleccionados pueden volver a estar disponibles.
            </p>

            <p>
              En ese caso, podés intentar participar nuevamente seleccionando números disponibles y
              realizando un nuevo pago.
            </p>
          </Section>

          <Section title="7. ¿Quién organiza y entrega el premio?">
            <p>
              Cada sorteo es organizado por el comercio, marca o emprendimiento que lo publica.
              Ese comercio es responsable por la veracidad del premio, las condiciones del sorteo y
              la entrega al ganador.
            </p>

            <p>
              Sortealo brinda la plataforma para registrar el proceso, ordenar la información y
              mejorar la transparencia de la participación.
            </p>
          </Section>

          <Section title="8. ¿Cómo sé si un sorteo es confiable?">
            <p>
              En cada sorteo podés revisar el comercio organizador, el premio publicado, el valor
              del número, la cantidad de números, el estado del sorteo y la información disponible
              antes de participar.
            </p>

            <p>
              Sortealo puede revisar sorteos, pausar publicaciones o tomar medidas si detecta
              actividad sospechosa, reclamos o información incompleta.
            </p>
          </Section>

          <Section title="9. Soy comercio, ¿cómo publico un sorteo?">
            <p>
              Para publicar un sorteo, tenés que crear una cuenta como comercio, completar tu
              perfil y cargar los datos principales: premio, descripción, fecha, valor del número y
              cantidad de números disponibles.
            </p>

            <p>
              Durante la etapa inicial, Sortealo puede acompañar a comercios seleccionados para
              revisar la carga del sorteo, validar el funcionamiento y recibir feedback real.
            </p>
          </Section>

          <Section title="10. ¿Qué datos debería cargar un comercio?">
            <p>
              Es importante cargar información clara sobre el premio, condiciones de participación,
              fecha estimada del sorteo, valor de cada número, cantidad de números y forma de
              entrega del premio.
            </p>

            <p>
              Mientras más clara sea la publicación, más confianza genera en los participantes.
            </p>
          </Section>

          <Section title="11. Tengo un problema con un pago o participación">
            <p>
              Si tuviste un problema con un pago, una participación o un número comprado, revisá
              primero tu sección de participaciones dentro del dashboard.
            </p>

            <p>
              Si el problema continúa, podés comunicarte desde la página de contacto indicando tu
              email de cuenta, el sorteo, el comercio y una descripción clara de lo ocurrido.
            </p>
          </Section>

          <Section title="12. Tengo un reclamo sobre un premio">
            <p>
              Si ganaste un sorteo o tenés un reclamo relacionado con la entrega del premio, podés
              contactar al comercio organizador y también reportar el caso a Sortealo.
            </p>

            <p>
              Sortealo podrá revisar la información disponible dentro de la plataforma y tomar
              medidas razonables según el caso.
            </p>
          </Section>

          <Section title="13. ¿Cómo contacto soporte?">
            <p>
              Podés usar la página de contacto para enviar una consulta o reportar un problema
              relacionado con tu cuenta, un pago, un sorteo, una participación, un comercio o un
              premio.
            </p>

            <p>
              Para ayudarnos a responder mejor, incluí siempre la mayor cantidad de datos posible:
              email de tu cuenta, nombre del sorteo, comercio organizador, fecha aproximada y detalle
              del problema.
            </p>

            <div className="pt-2">
              <Link
                href="/contacto"
                className="inline-flex rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-black hover:bg-amber-200"
              >
                Ir a contacto
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
