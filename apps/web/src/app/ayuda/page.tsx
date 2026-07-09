
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

          <h1 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">
            Ayuda
          </h1>

          <p className="mt-5 text-base leading-8 text-zinc-300">
            Preguntas frecuentes para entender cómo funciona Sortealo y qué hacer ante dudas comunes.
          </p>

          <p className="mt-5 text-xs font-semibold text-zinc-500">
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="¿Cómo participo en un sorteo?">
            <p>
              Creás una cuenta, verificás tu email, elegís un sorteo activo, seleccionás números disponibles y completás el pago. Cuando el pago se confirma, tus números quedan registrados.
            </p>
          </Section>

          <Section title="¿Dónde veo mis números?">
            <p>
              Desde tu dashboard, en la sección de participaciones, podés ver los sorteos en los que participaste y los números asociados.
            </p>
          </Section>

          <Section title="¿Qué pasa si mi pago queda pendiente?">
            <p>
              Si el pago queda pendiente, la participación puede demorar en confirmarse. Cuando el sistema recibe la confirmación, actualiza el estado correspondiente.
            </p>
          </Section>

          <Section title="¿Quién entrega el premio?">
            <p>
              El premio es entregado por el comercio organizador del sorteo. Sortealo ordena y registra el proceso dentro de la plataforma.
            </p>
          </Section>

          <Section title="Soy comercio, ¿cómo publico un sorteo?">
            <p>
              Creás una cuenta como comercio, completás tu perfil, verificás tu email y cargás los datos del sorteo: premio, descripción, fecha, valor del número y cantidad de números.
            </p>
          </Section>

          <Section title="¿Cómo contacto soporte?">
            <p>
              Podés usar la página de contacto para enviar una consulta o reportar un problema relacionado con tu cuenta, un pago, un sorteo o un comercio.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
