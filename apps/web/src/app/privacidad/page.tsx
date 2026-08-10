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
            title="Política de privacidad"
            description="Esta política explica qué información puede utilizar ACTIVA para operar la plataforma, registrar participaciones, procesar pagos, mejorar la seguridad y acompañar a comercios y participantes."
            breadcrumbs={[
              { label: 'Inicio', href: '/' },
              { label: 'Política de privacidad' },
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
          <Section title="1. Información que podemos solicitar">
            <p>
              ACTIVA puede solicitar o registrar datos como nombre, email, teléfono, contraseña
              protegida, rol de usuario, información del comercio impulsor, datos de campañas publicadas,
              números seleccionados, participaciones, pagos, comprobantes, reclamos y actividad
              básica dentro de la plataforma.
            </p>

            <p>
              En el caso de comercios impulsores, también podemos solicitar información necesaria para
              identificar el emprendimiento, validar su perfil, publicar campañas y facilitar la
              comunicación con participantes o personas seleccionadas.
            </p>
          </Section>

          <Section title="2. Para qué usamos la información">
            <p>
              Usamos la información para crear y administrar cuentas, verificar usuarios, permitir
              la compra de números, registrar participaciones, mostrar comprobantes, gestionar
              campañas, identificar personas seleccionadas y mejorar el funcionamiento de ACTIVA.
            </p>

            <p>
              También podemos utilizar datos de uso para prevenir fraudes, detectar actividad
              sospechosa, responder consultas, ordenar reclamos, mejorar la experiencia y brindar
              soporte a participantes y comercios.
            </p>
          </Section>

          <Section title="3. Datos de pagos">
            <p>
              Los pagos dentro de ACTIVA pueden ser procesados mediante proveedores externos, como
              MercadoPago u otros servicios habilitados.
            </p>

            <p>
              ACTIVA puede registrar información necesaria para identificar el estado de una
              operación, como pago pendiente, aprobado, rechazado o cancelado, junto con la campaña,
              usuario y números asociados.
            </p>

            <p>
              ACTIVA no busca almacenar datos sensibles completos de tarjetas, claves bancarias ni
              información confidencial de medios de pago. Ese procesamiento corresponde al proveedor
              de pagos utilizado en cada operación.
            </p>
          </Section>

          <Section title="4. Información visible para otros usuarios">
            <p>
              Algunos datos pueden mostrarse dentro de la plataforma para permitir el funcionamiento
              del sistema. Por ejemplo, información pública de un comercio impulsor, datos básicos de una
              campaña, números vendidos, estado de la campaña o información sobre el resultado del mecanismo de selección.
            </p>

            <p>
              ACTIVA buscará mostrar solo la información necesaria para brindar transparencia y
              trazabilidad, evitando exponer datos personales sensibles cuando no sea necesario.
            </p>
          </Section>

          <Section title="5. Proveedores externos">
            <p>
              Para operar correctamente, ACTIVA puede utilizar servicios externos de hosting,
              base de datos, autenticación, pagos, almacenamiento de archivos, email, analítica o
              monitoreo técnico.
            </p>

            <p>
              Estos proveedores pueden procesar información necesaria para prestar sus servicios.
              ACTIVA procurará utilizar herramientas confiables y limitar el uso de datos a fines
              operativos, técnicos, comerciales o de seguridad vinculados a la plataforma.
            </p>
          </Section>

          <Section title="6. Seguridad de la información">
            <p>
              ACTIVA aplica medidas técnicas razonables para proteger la información, limitar
              accesos indebidos, proteger contraseñas y reducir riesgos de uso no autorizado.
            </p>

            <p>
              Aun así, ningún sistema digital puede garantizar seguridad absoluta. El usuario también
              debe proteger su cuenta, utilizar una contraseña segura y evitar compartir sus accesos
              con terceros.
            </p>
          </Section>

          <Section title="7. Conservación de datos">
            <p>
              Podemos conservar información de cuentas, campañas, pagos, participaciones,
              comprobantes, personas seleccionadas y reclamos durante el tiempo necesario para operar la
              plataforma, resolver consultas, prevenir fraudes, cumplir obligaciones aplicables y
              mantener registros de seguridad.
            </p>

            <p>
              Algunos datos pueden mantenerse incluso después de cerrar una cuenta cuando sean
              necesarios para respaldar operaciones ya realizadas, comprobantes, historial de pagos,
              reclamos o auditoría interna.
            </p>
          </Section>

          <Section title="8. Consultas, correcciones o eliminación">
            <p>
              Los usuarios pueden solicitar información, corrección o revisión de datos asociados a
              su cuenta mediante los canales de contacto habilitados por ACTIVA.
            </p>

            <p>
              En algunos casos, la eliminación total de datos puede no ser inmediata o completa si
              existe información necesaria para conservar registros de operaciones, pagos, campañas,
              reclamos, seguridad o cumplimiento de obligaciones.
            </p>
          </Section>

          <Section title="9. Comunicaciones">
            <p>
              ACTIVA puede enviar comunicaciones relacionadas con la cuenta, verificación de email,
              pagos, participaciones, comprobantes, campañas, soporte, seguridad, reclamos o cambios
              importantes en la plataforma.
            </p>

            <p>
              También podremos contactar a comercios para acompañar el uso de la plataforma,
              solicitar información adicional o mejorar la experiencia durante la etapa inicial.
            </p>
          </Section>

          <Section title="10. Menores de edad">
            <p>
              ACTIVA no está pensado para ser utilizado por menores de edad sin autorización o
              supervisión correspondiente. Los comercios impulsores deberán publicar campañas que
              respeten las condiciones aplicables al tipo de beneficio ofrecido.
            </p>
          </Section>

          <Section title="11. Cambios en esta política">
            <p>
              ACTIVA podrá actualizar esta política de privacidad a medida que la plataforma
              incorpore nuevas funciones, proveedores, medidas de seguridad o cambios operativos.
            </p>

            <p>
              La versión vigente será siempre la publicada en esta página.
            </p>
          </Section>

          <Section title="12. Contacto">
            <p>
              Para consultas relacionadas con privacidad, datos personales, cuentas, pagos,
              participaciones o reclamos, los usuarios pueden utilizar la página de contacto o los
              canales informados por ACTIVA.
            </p>

            <p>
              Durante la etapa inicial, ACTIVA podrá brindar soporte directo a determinados
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
