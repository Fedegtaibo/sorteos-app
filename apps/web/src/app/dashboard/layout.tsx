'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import NotificationBell from '@/components/NotificationBell';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [reenviandoEmail, setReenviandoEmail] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const cargarEstadoEmail = async () => {
      try {
        const res: any = await authApi.me();
        const user = res?.data?.user || res?.user;
        setEmailVerified(user?.email_verified === true);
      } catch {
        setEmailVerified(null);
      }
    };

    cargarEstadoEmail();
  }, [status]);

  const reenviarEmailVerificacion = async () => {
    setReenviandoEmail(true);

    try {
      const res: any = await authApi.resendVerificationEmail();
      const data = res?.data || res;
      toast.success(data?.mensaje || 'Te enviamos un nuevo email de verificación.');
    } catch (err: any) {
      toast.error(err.message || 'No se pudo reenviar el email de verificación.');
    } finally {
      setReenviandoEmail(false);
    }
  };

  const mostrarAvisoEmail =
    status === 'authenticated' &&
    role !== 'admin' &&
    emailVerified === false;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-5xl animate-pulse">S</div>
      </div>
    );
  }

  const navLinks = {
    participante: [
      { href: '/dashboard', label: 'Inicio', icon: '●' },
      { href: '/dashboard/participaciones', label: 'Mis participaciones', icon: '🎟️' },
      { href: '/dashboard/premios', label: 'Mis premios', icon: '🏆' },
    ],
    comercio: [
      { href: '/dashboard', label: 'Inicio', icon: '●' },
      { href: '/dashboard/sorteos', label: 'Mis sorteos', icon: '🎯' },
      { href: '/dashboard/sorteos/nuevo', label: 'Nuevo sorteo', icon: '+' },
      { href: '/dashboard/entregas', label: 'Entregas', icon: '📦' },
{ href: '/dashboard/perfil', label: 'Mi perfil', icon: '◆' },
      ],
    admin: [
      { href: '/dashboard', label: 'Inicio', icon: '●' },
      { href: '/dashboard/admin/comercios', label: 'Comercios', icon: '🏪' },
      { href: '/dashboard/admin/sorteos', label: 'Todos los sorteos', icon: '🎯' },
      { href: '/dashboard/admin/usuarios', label: 'Usuarios', icon: '👥' },
      { href: '/dashboard/admin/reclamos', label: 'Reclamos', icon: '⚖️' },
    ],
  };

  const links = navLinks[role as keyof typeof navLinks] || navLinks.participante;

  const SidebarContent = () => (
    <>
      <div className="p-5 md:p-6 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-amber-400 text-black grid place-items-center text-xl font-black">
            S
          </span>
          <div>
            <p className="font-black text-lg leading-tight">Sortealo</p>
            <p className="text-xs text-zinc-500">Sorteos verificados</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border',
                active
                  ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-amber-400/10'
                  : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100',
              )}
            >
              <span className="text-base">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 mb-3">
          <p className="text-xs text-zinc-500 truncate mb-2">{session?.user?.email}</p>
          <span
            className={cn(
              'text-xs font-black px-3 py-1 rounded-full uppercase',
              role === 'admin'
                ? 'bg-red-950 text-red-300'
                : role === 'comercio'
                  ? 'bg-amber-950 text-amber-300'
                  : 'bg-sky-950 text-sky-300',
            )}
          >
            {role}
          </span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-red-300 hover:border-red-900 transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="hidden md:flex w-72 bg-zinc-950 border-r border-zinc-800 flex-col fixed h-full">
        <SidebarContent />
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            aria-label="Cerrar menú"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <aside className="relative z-[101] flex h-full w-[86vw] max-w-xs flex-col bg-zinc-950 border-r border-zinc-800 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="min-h-screen md:ml-72">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur md:justify-end md:px-8 md:py-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>

          <div className="md:hidden flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl bg-amber-400 text-black grid place-items-center font-black">
              S
            </span>
            <span className="font-black">Sortealo</span>
          </div>

          <NotificationBell />
        </header>

        <section className="p-4 md:p-8">
          {mostrarAvisoEmail && (
            <div className="mb-6 rounded-2xl border border-amber-700 bg-amber-950/40 p-5 shadow-lg shadow-amber-950/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-black text-amber-300">
                    Tu email todavía no está verificado
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Verificá tu casilla para poder comprar números o publicar sorteos.
                    Si no encontrás el correo, podés pedir uno nuevo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={reenviarEmailVerificacion}
                  disabled={reenviandoEmail}
                  className="btn-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reenviandoEmail ? 'Enviando...' : 'Reenviar email'}
                </button>
              </div>
            </div>
          )}

          {children}
        </section>
      </main>
    </div>
  );
}