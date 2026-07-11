
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
            Información importante
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">
            Términos y condiciones
          </h1>

          <p className="mt-5 text-base leading-8 text-zinc-300">
            Estos términos establecen las reglas básicas para usar Sortealo como participante,
            comercio organizador o usuario de la plataforma.
          </p>

          <p className="mt-5 text-xs font-semibold text-zinc-500">
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="1. Qué es Sortealo">
            <p>
              Sortealo es una plataforma digital que permite a comercios, marcas y emprendimientos
              crear sorteos online, publicar premios, vender números y registrar participaciones de
              forma más ordenada, trazable y transparente.
            </p>

            <p>
              Sortealo no es el organizador directo de cada sorteo publicado por terceros. Cada
              sorteo es organizado por el comercio, marca o emprendimiento que lo publica dentro de
              la plataforma.
            </p>

            <p>
              La función de Sortealo es brindar la herramienta tecnológica para registrar usuarios,
              números, pagos, participaciones, comprobantes, ganadores y estados del sorteo.
            </p>
          </Section>

          <Section title="2. Aceptación de los términos">
            <p>
              Al registrarte, crear un sorteo, comprar números, participar o utilizar cualquier
              funcionalidad de Sortealo, aceptás estos términos y condiciones.
            </p>

            <p>
              Si no estás de acuerdo con estas condiciones, no deberías utilizar la plataforma.
            </p>
          </Section>

          <Section title="3. Cuentas de usuario">
            <p>
              Para utilizar ciertas funciones de Sortealo puede ser necesario crear una cuenta,
              informar datos reales y mantener actualizada la información de contacto.
            </p>

            <p>
              El usuario es responsable de proteger el acceso a su cuenta y de no compartir sus
              credenciales con terceros.
            </p>

            <p>
              Sortealo podrá solicitar verificación de email u otros controles básicos de seguridad
              antes de permitir determinadas acciones, como comprar números, crear sorteos o cobrar
              premios.
            </p>
          </Section>

          <Section title="4. Responsabilidad del comercio organizador">
            <p>
              El comercio que publica un sorteo es responsable por la veracidad del premio, la
              descripción publicada, las condiciones ofrecidas, la disponibilidad del premio y su
              entrega al ganador.
            </p>

            <p>
              También es responsabilidad del comercio cumplir con las reglas del sorteo, responder
              consultas, gestionar la entrega del premio y actuar de buena fe frente a participantes
              y ganadores.
            </p>

            <p>
              Sortealo podrá revisar, pausar, ocultar, suspender o cancelar sorteos cuando detecte
              información incompleta, actividad sospechosa, reclamos, incumplimientos o cualquier uso
              indebido de la plataforma.
            </p>
          </Section>

          <Section title="5. Participación de usuarios">
            <p>
              Para participar en un sorteo, el usuario debe elegir uno o más números disponibles y
              completar el pago correspondiente mediante los medios habilitados.
            </p>

            <p>
              La selección de números puede quedar reservada durante un tiempo limitado mientras se
              completa el pago. Si el pago no se confirma, la reserva puede liberarse y los números
              pueden volver a estar disponibles.
            </p>

            <p>
              La participación queda registrada cuando el sistema confirma el pago y asocia los
              números comprados a la cuenta del participante.
            </p>
          </Section>

          <Section title="6. Pagos, comprobantes y estados">
            <p>
              Los pagos realizados dentro de Sortealo se vinculan con la cuenta del participante, el
              sorteo elegido y los números seleccionados.
            </p>

            <p>
              Si un pago queda pendiente, rechazado, cancelado o no confirmado por el proveedor de
              pagos, la participación puede no quedar activa hasta que el sistema reciba la
              confirmación correspondiente.
            </p>

            <p>
              Los comprobantes disponibles en la plataforma funcionan como registro interno de la
              operación y pueden ser consultados desde la cuenta del usuario.
            </p>
          </Section>

          <Section title="7. Sorteo, ganador y entrega del premio">
            <p>
              Cada sorteo tendrá sus propias condiciones publicadas, incluyendo premio, valor del
              número, cantidad de números, fecha estimada del sorteo y comercio organizador.
            </p>

            <p>
              El comercio organizador es responsable de entregar el premio al ganador según lo
              informado en la publicación y de actualizar el estado de entrega cuando corresponda.
            </p>

            <p>
              Sortealo podrá registrar el resultado del sorteo, el ganador, el estado de entrega y
              eventuales reclamos para mejorar la transparencia del proceso.
            </p>
          </Section>

          <Section title="8. Reclamos y soporte">
            <p>
              Los usuarios podrán reportar problemas relacionados con pagos, participaciones,
              sorteos, comercios o entrega de premios mediante los canales de contacto habilitados
              por Sortealo.
            </p>

            <p>
              Ante un reclamo, Sortealo podrá revisar la información disponible dentro de la
              plataforma, solicitar datos adicionales al participante o al comercio, pausar acciones
              vinculadas al sorteo y tomar medidas razonables según el caso.
            </p>

            <p>
              Sortealo no garantiza la resolución inmediata de todos los reclamos, pero podrá
              intervenir como plataforma para ordenar la información y facilitar una revisión del
              caso.
            </p>
          </Section>

          <Section title="9. Uso indebido de la plataforma">
            <p>
              No está permitido usar Sortealo para publicar sorteos falsos, engañosos, ilegales,
              ofensivos, fraudulentos o que puedan perjudicar a participantes, comercios, terceros o
              a la propia plataforma.
            </p>

            <p>
              Tampoco está permitido manipular números, pagos, cuentas, identidades, resultados,
              comprobantes o cualquier información del sistema.
            </p>

            <p>
              Sortealo podrá suspender cuentas, pausar sorteos, limitar funciones, cancelar
              publicaciones o bloquear usuarios cuando detecte actividad sospechosa o incumplimiento
              de estos términos.
            </p>
          </Section>

          <Section title="10. Disponibilidad y cambios del servicio">
            <p>
              Sortealo es una plataforma en evolución. Algunas funciones pueden modificarse,
              pausarse, mejorarse o eliminarse con el tiempo.
            </p>

            <p>
              Aunque buscamos ofrecer un servicio estable, no podemos garantizar que la plataforma
              esté disponible de forma ininterrumpida o libre de errores en todo momento.
            </p>
          </Section>

          <Section title="11. Cambios en estos términos">
            <p>
              Sortealo podrá actualizar estos términos y condiciones cuando sea necesario para
              reflejar cambios en la plataforma, nuevas funcionalidades, mejoras operativas o ajustes
              comerciales.
            </p>

            <p>
              La versión vigente será siempre la publicada en esta página.
            </p>
          </Section>

          <Section title="12. Contacto">
            <p>
              Para consultas, reclamos o solicitudes relacionadas con el uso de Sortealo, los
              usuarios pueden utilizar la página de contacto o los canales informados por la
              plataforma.
            </p>

            <p>
              Durante la etapa inicial, Sortealo podrá brindar acompañamiento directo a determinados
              comercios y usuarios para validar el funcionamiento del sistema en casos reales.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
