
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
            Términos y condiciones
          </h1>

          <p className="mt-5 text-base leading-8 text-zinc-300">
            Estos términos explican las reglas básicas para usar Sortealo como participante, comercio o usuario administrador.
          </p>

          <p className="mt-5 text-xs font-semibold text-zinc-500">
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="1. Qué es Sortealo">
            <p>
              Sortealo es una plataforma digital que permite a comercios, marcas y emprendimientos publicar sorteos online, vender números y registrar participaciones de forma más ordenada y transparente.
            </p>
            <p>
              Cada sorteo es organizado por el comercio que lo publica. Sortealo brinda la herramienta tecnológica para ordenar, registrar y facilitar la participación.
            </p>
          </Section>

          <Section title="2. Responsabilidad del comercio organizador">
            <p>
              El comercio que publica un sorteo es responsable por la veracidad del premio, las condiciones de participación, la entrega del premio y el cumplimiento de las reglas anunciadas.
            </p>
            <p>
              Sortealo puede acompañar, auditar información disponible dentro de la plataforma y tomar medidas si detecta incumplimientos, reclamos o uso indebido.
            </p>
          </Section>

          <Section title="3. Participación de usuarios">
            <p>
              Para participar, el usuario debe crear una cuenta, verificar su email cuando sea solicitado, elegir números disponibles y completar el pago correspondiente.
            </p>
            <p>
              La participación queda registrada cuando el sistema confirma el pago y asocia los números al usuario.
            </p>
          </Section>

          <Section title="4. Pagos, números y comprobantes">
            <p>
              Los pagos realizados dentro de Sortealo se vinculan con los números seleccionados y con la cuenta del participante. Los comprobantes disponibles en la plataforma sirven como registro interno de la operación.
            </p>
            <p>
              Si un pago queda pendiente, rechazado o no confirmado, la participación puede no quedar activa hasta que el sistema reciba la confirmación correspondiente.
            </p>
          </Section>

          <Section title="5. Uso indebido">
            <p>
              No está permitido usar Sortealo para publicar sorteos falsos, engañosos, ilegales, ofensivos o que puedan perjudicar a participantes, comercios o a la plataforma.
            </p>
            <p>
              Sortealo podrá pausar, suspender o eliminar cuentas, sorteos o participaciones cuando detecte actividad sospechosa o incumplimientos.
            </p>
          </Section>

          <Section title="6. Cambios en estos términos">
            <p>
              Estos términos pueden actualizarse a medida que la plataforma evolucione. La versión vigente será la publicada en esta página.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
