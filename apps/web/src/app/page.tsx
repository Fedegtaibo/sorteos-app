import Link from 'next/link';
import InstallAppButton from '@/components/InstallAppButton';
import { PublicHeader } from '@/components/layout';

const publicNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/login', label: 'Ingresar' },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PublicHeader
        navigation={publicNavigation}
        variant="light"
        logoHref="/"
        actions={(
          <Link
            href="/registro"
            className="inline-flex h-11 items-center justify-center rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
          >
            Crear cuenta
          </Link>
        )}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.24),transparent_34%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_32%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 md:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
          <div>
<h1 className="max-w-5xl text-4xl font-black leading-[1.04] text-white md:text-6xl">
              Comprá con confianza.
              <span className="mt-2 block text-amber-400">
                Vendé con sorteos que convierten.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
              Sortealo convierte sorteos informales en una experiencia ordenada:
              pagos seguros, números reservados, comprobantes automáticos y comercios verificados.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/registro"
                className="rounded-2xl bg-amber-400 px-7 py-4 text-center text-base font-black text-black shadow-2xl shadow-amber-400/20 hover:bg-amber-300"
              >
                Crear cuenta
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-white/15 px-7 py-4 text-center text-base font-black text-white hover:bg-white/10"
              >
                Ingresar a Sortealo
              </Link>

              <InstallAppButton className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-center text-base font-black text-zinc-200 hover:bg-white/10" />
            </div>

            <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-500">
              Al ingresar, cada usuario accede a su espacio para descubrir sorteos,
              seguir participaciones, ver comprobantes y gestionar publicaciones.
            </p>
          </div>

          <div className="rounded-[2rem] border border-amber-400/25 bg-zinc-950 p-5 shadow-2xl shadow-amber-950/20 md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
              La idea en una frase
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl">
              El sorteo deja de ser una promesa informal.
              <span className="block text-zinc-500">
                Pasa a ser una operación registrada.
              </span>
            </h2>

            <div className="mt-5 grid gap-2">
              {[
                ['1', 'Elegís un sorteo real', 'Publicado por un comercio identificado.'],
                ['2', 'Reservás tus números', 'La seleccion queda ordenada antes del pago.'],
                ['3', 'Pagás de forma segura', 'El sistema registra la operación.'],
                ['4', 'Recibís comprobante', 'Tu participacion queda guardada en tu cuenta.'],
              ].map(([numero, titulo, texto]) => (
                <div key={numero} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-400 text-sm font-black text-black">
                    {numero}
                  </div>

                  <div>
                    <p className="font-black text-white">{titulo}</p>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [
              'Para quien participa',
              'Compra números con mas claridad, ve sus comprobantes y puede seguir cada participacion desde su cuenta.',
            ],
            [
              'Para comercios',
              'Transforma un premio en una campaña de venta ordenada, con pagos, números y participantes centralizados.',
            ],
            [
              'Para la confianza',
              'Cada paso queda registrado: sorteo, comercio, numero elegido, pago, comprobante y entrega.',
            ],
          ].map(([titulo, texto]) => (
            <div key={titulo} className="rounded-[2rem] border border-white/10 bg-zinc-950 p-7 shadow-2xl shadow-black/20">
              <h2 className="text-2xl font-black text-white">{titulo}</h2>
              <p className="mt-4 leading-7 text-zinc-400">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 md:grid-cols-4">
          {[
            ['Pagos seguros', 'Operaciones registradas.'],
            ['Comercios verificados', 'Negocios reales y activos.'],
            ['Comprobantes automáticos', 'Participaciones guardadas.'],
            ['Entregas auditables', 'Más trazabilidad del premio.'],
          ].map(([titulo, texto]) => (
            <div key={titulo} className="rounded-2xl bg-black/20 p-5">
              <p className="font-black text-white">{titulo}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-[2rem] bg-amber-400 p-8 text-black md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-black/60">
                Sortealo
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
                Un lugar para participar, vender y confiar.
              </h2>

              <p className="mt-4 max-w-2xl font-semibold leading-7 text-black/70">
                La exploración de sorteos vive dentro de la cuenta.
                La home solo tiene que explicar el producto y abrir la puerta.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/registro"
                className="rounded-2xl bg-black px-7 py-4 text-center text-base font-black text-white hover:bg-zinc-900"
              >
                Crear cuenta
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-black/20 px-7 py-4 text-center text-base font-black text-black hover:bg-black/10"
              >
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      </section>
    
      {/* Footer de confianza Sortealo */}
      <footer className="mt-20 border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-black text-zinc-300">Sortealo</p>
            <p className="mt-2 max-w-xl leading-6">
              Plataforma para crear sorteos online con registro de participantes, números, pagos y comprobantes.
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 font-bold">
            <Link href="/ayuda" className="hover:text-amber-300">
              Ayuda
            </Link>
            <Link href="/contacto" className="hover:text-amber-300">
              Contacto
            </Link>
            <Link href="/terminos" className="hover:text-amber-300">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-amber-300">
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
</main>
  );
}
