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
            Política de privacidad
          </h1>

          <p className="mt-5 text-base leading-8 text-zinc-300">
            Esta política explica qué información puede utilizar Sortealo para operar la plataforma,
            registrar participaciones, procesar pagos, mejorar la seguridad y acompañar a comercios
            y participantes.
          </p>

          <p className="mt-5 text-xs font-semibold text-zinc-500">
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="1. Información que podemos solicitar">
            <p>
              Sortealo puede solicitar o registrar datos como nombre, email, teléfono, contraseña
              protegida, rol de usuario, información del comercio, datos de sorteos publicados,
              números seleccionados, participaciones, pagos, comprobantes, reclamos y actividad
              básica dentro de la plataforma.
            </p>

            <p>
              En el caso de comercios, también podemos solicitar información necesaria para
              identificar el emprendimiento, validar su perfil, publicar sorteos y facilitar la
              comunicación con participantes o ganadores.
            </p>
          </Section>

          <Section title="2. Para qué usamos la información">
            <p>
              Usamos la información para crear y administrar cuentas, verificar usuarios, permitir
              la compra de números, registrar participaciones, mostrar comprobantes, gestionar
              sorteos, identificar ganadores y mejorar el funcionamiento de Sortealo.
            </p>

            <p>
              También podemos utilizar datos de uso para prevenir fraudes, detectar actividad
              sospechosa, responder consultas, ordenar reclamos, mejorar la experiencia y brindar
              soporte a participantes y comercios.
            </p>
          </Section>

          <Section title="3. Datos de pagos">
            <p>
              Los pagos dentro de Sortealo pueden ser procesados mediante proveedores externos, como
              MercadoPago u otros servicios habilitados.
            </p>

            <p>
              Sortealo puede registrar información necesaria para identificar el estado de una
              operación, como pago pendiente, aprobado, rechazado o cancelado, junto con el sorteo,
              usuario y números asociados.
            </p>

            <p>
              Sortealo no busca almacenar datos sensibles completos de tarjetas, claves bancarias ni
              información confidencial de medios de pago. Ese procesamiento corresponde al proveedor
              de pagos utilizado en cada operación.
            </p>
          </Section>

          <Section title="4. Información visible para otros usuarios">
            <p>
              Algunos datos pueden mostrarse dentro de la plataforma para permitir el funcionamiento
              del sistema. Por ejemplo, información pública de un comercio, datos básicos de un
              sorteo, números vendidos, estado del sorteo o resultado del ganador.
            </p>

            <p>
              Sortealo buscará mostrar solo la información necesaria para brindar transparencia y
              trazabilidad, evitando exponer datos personales sensibles cuando no sea necesario.
            </p>
          </Section>

          <Section title="5. Proveedores externos">
            <p>
              Para operar correctamente, Sortealo puede utilizar servicios externos de hosting,
              base de datos, autenticación, pagos, almacenamiento de archivos, email, analítica o
              monitoreo técnico.
            </p>

            <p>
              Estos proveedores pueden procesar información necesaria para prestar sus servicios.
              Sortealo procurará utilizar herramientas confiables y limitar el uso de datos a fines
              operativos, técnicos, comerciales o de seguridad vinculados a la plataforma.
            </p>
          </Section>

          <Section title="6. Seguridad de la información">
            <p>
              Sortealo aplica medidas técnicas razonables para proteger la información, limitar
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
              Podemos conservar información de cuentas, sorteos, pagos, participaciones,
              comprobantes, ganadores y reclamos durante el tiempo necesario para operar la
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
              su cuenta mediante los canales de contacto habilitados por Sortealo.
            </p>

            <p>
              En algunos casos, la eliminación total de datos puede no ser inmediata o completa si
              existe información necesaria para conservar registros de operaciones, pagos, sorteos,
              reclamos, seguridad o cumplimiento de obligaciones.
            </p>
          </Section>

          <Section title="9. Comunicaciones">
            <p>
              Sortealo puede enviar comunicaciones relacionadas con la cuenta, verificación de email,
              pagos, participaciones, comprobantes, sorteos, soporte, seguridad, reclamos o cambios
              importantes en la plataforma.
            </p>

            <p>
              También podremos contactar a comercios para acompañar el uso de la plataforma,
              solicitar información adicional o mejorar la experiencia durante la etapa inicial.
            </p>
          </Section>

          <Section title="10. Menores de edad">
            <p>
              Sortealo no está pensado para ser utilizado por menores de edad sin autorización o
              supervisión correspondiente. Los comercios organizadores deberán publicar sorteos que
              respeten las condiciones aplicables al tipo de premio ofrecido.
            </p>
          </Section>

          <Section title="11. Cambios en esta política">
            <p>
              Sortealo podrá actualizar esta política de privacidad a medida que la plataforma
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
              canales informados por Sortealo.
            </p>

            <p>
              Durante la etapa inicial, Sortealo podrá brindar soporte directo a determinados
              comercios y usuarios para validar el funcionamiento del sistema en casos reales.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
