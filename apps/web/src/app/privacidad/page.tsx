
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
            Política de privacidad
          </h1>

          <p className="mt-5 text-base leading-8 text-zinc-300">
            Esta política explica qué información puede usar Sortealo para operar la plataforma y mejorar la experiencia de participantes y comercios.
          </p>

          <p className="mt-5 text-xs font-semibold text-zinc-500">
            Última actualización: julio de 2026
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="1. Datos que podemos solicitar">
            <p>
              Sortealo puede solicitar datos como nombre, email, teléfono, rol de usuario, información del comercio, datos de sorteos publicados, participaciones, pagos y comprobantes.
            </p>
          </Section>

          <Section title="2. Para qué usamos los datos">
            <p>
              Usamos la información para crear cuentas, verificar emails, permitir la participación en sorteos, registrar pagos, mostrar comprobantes, administrar comercios y mejorar la seguridad de la plataforma.
            </p>
          </Section>

          <Section title="3. Información de pagos">
            <p>
              Los pagos pueden ser procesados mediante proveedores externos como MercadoPago. Sortealo registra información necesaria para identificar el estado de la operación, pero no busca almacenar datos sensibles de tarjetas.
            </p>
          </Section>

          <Section title="4. Seguridad">
            <p>
              Sortealo aplica medidas técnicas razonables para proteger la información y limitar accesos indebidos. Aun así, ningún sistema digital puede garantizar seguridad absoluta.
            </p>
          </Section>

          <Section title="5. Contacto y solicitudes">
            <p>
              Si necesitás consultar, corregir o solicitar información relacionada con tus datos, podés comunicarte desde la página de contacto.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}
