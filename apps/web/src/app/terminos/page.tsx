
import Link from 'next/link';

import { PageHeader, PublicFooter, PublicHeader } from '@/components/layout';
import { Badge, Card, CardContent, Divider } from '@/components/ui';

const navigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar' },
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <Card>
        <CardContent className="p-activa-20 sm:p-activa-24">
          <h2 className="font-display text-xl font-semibold text-text-primary sm:text-2xl">
            {title}
          </h2>
          <Divider className="my-activa-16" />
          <div className="space-y-activa-16 text-sm leading-7 text-text-secondary sm:text-base">
            {children}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background-page text-text-primary">
      <PublicHeader
        variant="light"
        logoHref="/"
        navigation={navigation}
        actions={
          <Link
            href="/registro"
            className="inline-flex min-h-9 items-center justify-center rounded-activa-sm bg-action-primary px-activa-12 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
          >
            Crear cuenta
          </Link>
        }
      />

      <main className="px-activa-16 py-activa-40 sm:px-activa-24 sm:py-activa-48 lg:px-activa-40 lg:py-activa-64">
        <article className="mx-auto max-w-4xl">
          <PageHeader
            eyebrow="Información importante"
            title="Términos y condiciones"
            description="Estos términos establecen las reglas básicas para usar ACTIVA como participante, comercio organizador o usuario de la plataforma."
            breadcrumbs={[
              { label: 'Inicio', href: '/' },
              { label: 'Términos y condiciones' },
            ]}
            actions={
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-activa-sm border border-border-strong bg-background-surface px-activa-16 text-sm font-semibold text-text-primary transition-colors duration-fast ease-activa hover:bg-background-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
              >
                Volver a ACTIVA
              </Link>
            }
          />

          <Badge variant="neutral" className="mt-activa-20">
            Última actualización: julio de 2026
          </Badge>

          <div className="mt-activa-32 space-y-activa-16">
          <Section title="1. Qué es ACTIVA">
            <p>
              ACTIVA es una plataforma digital que permite a comercios, marcas y emprendimientos
              crear sorteos online, publicar premios, vender números y registrar participaciones de
              forma más ordenada, trazable y transparente.
            </p>

            <p>
              ACTIVA no es el organizador directo de cada sorteo publicado por terceros. Cada
              sorteo es organizado por el comercio, marca o emprendimiento que lo publica dentro de
              la plataforma.
            </p>

            <p>
              La función de ACTIVA es brindar la herramienta tecnológica para registrar usuarios,
              números, pagos, participaciones, comprobantes, ganadores y estados del sorteo.
            </p>
          </Section>

          <Section title="2. Aceptación de los términos">
            <p>
              Al registrarte, crear un sorteo, comprar números, participar o utilizar cualquier
              funcionalidad de ACTIVA, aceptás estos términos y condiciones.
            </p>

            <p>
              Si no estás de acuerdo con estas condiciones, no deberías utilizar la plataforma.
            </p>
          </Section>

          <Section title="3. Cuentas de usuario">
            <p>
              Para utilizar ciertas funciones de ACTIVA puede ser necesario crear una cuenta,
              informar datos reales y mantener actualizada la información de contacto.
            </p>

            <p>
              El usuario es responsable de proteger el acceso a su cuenta y de no compartir sus
              credenciales con terceros.
            </p>

            <p>
              ACTIVA podrá solicitar verificación de email u otros controles básicos de seguridad
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
              ACTIVA podrá revisar, pausar, ocultar, suspender o cancelar sorteos cuando detecte
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
              Los pagos realizados dentro de ACTIVA se vinculan con la cuenta del participante, el
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
              ACTIVA podrá registrar el resultado del sorteo, el ganador, el estado de entrega y
              eventuales reclamos para mejorar la transparencia del proceso.
            </p>
          </Section>

          <Section title="8. Reclamos y soporte">
            <p>
              Los usuarios podrán reportar problemas relacionados con pagos, participaciones,
              sorteos, comercios o entrega de premios mediante los canales de contacto habilitados
              por ACTIVA.
            </p>

            <p>
              Ante un reclamo, ACTIVA podrá revisar la información disponible dentro de la
              plataforma, solicitar datos adicionales al participante o al comercio, pausar acciones
              vinculadas al sorteo y tomar medidas razonables según el caso.
            </p>

            <p>
              ACTIVA no garantiza la resolución inmediata de todos los reclamos, pero podrá
              intervenir como plataforma para ordenar la información y facilitar una revisión del
              caso.
            </p>
          </Section>

          <Section title="9. Uso indebido de la plataforma">
            <p>
              No está permitido usar ACTIVA para publicar sorteos falsos, engañosos, ilegales,
              ofensivos, fraudulentos o que puedan perjudicar a participantes, comercios, terceros o
              a la propia plataforma.
            </p>

            <p>
              Tampoco está permitido manipular números, pagos, cuentas, identidades, resultados,
              comprobantes o cualquier información del sistema.
            </p>

            <p>
              ACTIVA podrá suspender cuentas, pausar sorteos, limitar funciones, cancelar
              publicaciones o bloquear usuarios cuando detecte actividad sospechosa o incumplimiento
              de estos términos.
            </p>
          </Section>

          <Section title="10. Disponibilidad y cambios del servicio">
            <p>
              ACTIVA es una plataforma en evolución. Algunas funciones pueden modificarse,
              pausarse, mejorarse o eliminarse con el tiempo.
            </p>

            <p>
              Aunque buscamos ofrecer un servicio estable, no podemos garantizar que la plataforma
              esté disponible de forma ininterrumpida o libre de errores en todo momento.
            </p>
          </Section>

          <Section title="11. Cambios en estos términos">
            <p>
              ACTIVA podrá actualizar estos términos y condiciones cuando sea necesario para
              reflejar cambios en la plataforma, nuevas funcionalidades, mejoras operativas o ajustes
              comerciales.
            </p>

            <p>
              La versión vigente será siempre la publicada en esta página.
            </p>
          </Section>

          <Section title="12. Contacto">
            <p>
              Para consultas, reclamos o solicitudes relacionadas con el uso de ACTIVA, los
              usuarios pueden utilizar la página de contacto o los canales informados por la
              plataforma.
            </p>

            <p>
              Durante la etapa inicial, ACTIVA podrá brindar acompañamiento directo a determinados
              comercios y usuarios para validar el funcionamiento del sistema en casos reales.
            </p>
          </Section>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
