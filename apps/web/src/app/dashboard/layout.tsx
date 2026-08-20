'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import NotificationBell from '@/components/NotificationBell';
import { ActivaIcon, type ActivaIconName } from '@/components/icons';
import { BrandLogo, NavigationItem } from '@/components/layout';
import { Alert, Badge, Button, Divider, Spinner } from '@/components/ui';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

type DashboardNavLink = {
  href: string;
  label: string;
  icon: ActivaIconName;
};

const roleLabels: Record<string, string> = {
  participante: 'Participante',
  comercio: 'Comercio',
  admin: 'Administrador',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [reenviandoEmail, setReenviandoEmail] = useState(false);
  const refreshSignOutStarted = useRef(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (
      session?.error === 'RefreshAccessTokenError' &&
      !refreshSignOutStarted.current
    ) {
      refreshSignOutStarted.current = true;
      void signOut({ callbackUrl: '/login' });
    }
  }, [session?.error]);

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-activa-12 bg-background-page text-text-primary">
        <BrandLogo variant="symbol" size="lg" alt="ACTIVA" />
        <div className="flex items-center gap-activa-8 text-sm font-semibold text-text-secondary">
          <Spinner decorative size="sm" variant="brand" />
          <span>Cargando tu cuenta…</span>
        </div>
      </div>
    );
  }

  const navLinks: Record<'participante' | 'comercio' | 'admin', DashboardNavLink[]> = {
    participante: [
      { href: '/dashboard', label: 'Inicio', icon: 'home' },
      { href: '/dashboard/participaciones', label: 'Mis participaciones', icon: 'participation' },
      { href: '/dashboard/premios', label: 'Mis beneficios', icon: 'benefit' },
      { href: '/dashboard/perfil', label: 'Mi perfil', icon: 'profile' },
    ],
    comercio: [
      { href: '/dashboard', label: 'Inicio', icon: 'home' },
      { href: '/dashboard/sorteos', label: 'Mis campañas', icon: 'campaign' },
      { href: '/dashboard/sorteos/nuevo', label: 'Crear campaña', icon: 'plus' },
      { href: '/dashboard/entregas', label: 'Entregas', icon: 'delivery' },
      { href: '/dashboard/perfil', label: 'Mi perfil', icon: 'profile' },
    ],
    admin: [
      { href: '/dashboard', label: 'Inicio', icon: 'home' },
      { href: '/dashboard/admin/comercios', label: 'Comercios', icon: 'store' },
      { href: '/dashboard/admin/sorteos', label: 'Todas las campañas', icon: 'campaign' },
      { href: '/dashboard/admin/usuarios', label: 'Usuarios', icon: 'user' },
      { href: '/dashboard/admin/reclamos', label: 'Reclamos', icon: 'warning' },
    ],
  };

  const links = navLinks[role as keyof typeof navLinks] || navLinks.participante;

  const SidebarContent = () => (
    <>
      <div className="border-b border-border-default px-activa-20 py-activa-20 md:px-activa-24">
        <BrandLogo variant="color" size="md" href="/dashboard" alt="ACTIVA" />
        <p className="mt-activa-8 text-xs font-medium text-text-secondary">
          Oportunidades y experiencias
        </p>
      </div>

      <nav
        aria-label="Secciones del panel"
        className="flex-1 space-y-activa-4 overflow-y-auto p-activa-16"
      >
        {links.map((link) => (
          <NavigationItem
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            active={pathname === link.href}
          />
        ))}
      </nav>

      <div className="border-t border-border-default p-activa-16">
        <div className="mb-activa-12 rounded-activa-md border border-border-default bg-background-surface-muted p-activa-12">
          <p className="truncate text-xs text-text-secondary">
            {session?.user?.email}
          </p>
          <Badge
            variant={role === 'comercio' ? 'brand' : role === 'admin' ? 'information' : 'active'}
            size="sm"
            className="mt-activa-8"
          >
            {roleLabels[role] || role}
          </Badge>
        </div>

        <Divider className="mb-activa-12" />

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          leftIcon={<ActivaIcon name="logout" size={18} />}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Cerrar sesión
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background-page text-text-primary">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-border-default bg-background-surface md:flex">
        <SidebarContent />
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-overlay md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-background-inverse/70"
          />

          <aside
            id="dashboard-mobile-navigation"
            aria-label="Navegación del panel"
            className="relative z-modal flex h-full w-[86vw] max-w-xs flex-col border-r border-border-default bg-background-surface shadow-activa-lg"
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="min-h-screen md:ml-72">
        <header className="sticky top-0 z-sticky flex min-h-16 items-center justify-between border-b border-border-default bg-background-surface/95 px-activa-16 backdrop-blur md:justify-end md:px-activa-32">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex size-11 items-center justify-center rounded-activa-sm border border-border-default bg-background-surface text-text-primary transition-colors duration-fast ease-activa hover:bg-background-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus md:hidden"
            aria-label="Abrir menú"
            aria-expanded={mobileMenuOpen}
            aria-controls="dashboard-mobile-navigation"
          >
            <ActivaIcon name="menu" size={22} />
          </button>

          <div className="flex items-center md:hidden">
            <BrandLogo variant="color" size="sm" href="/dashboard" alt="ACTIVA" />
          </div>

          <NotificationBell />
        </header>

        <section className="p-activa-16 md:p-activa-32">
          {mostrarAvisoEmail && (
            <Alert
              variant="warning"
              title="Verificá tu email"
              icon={<ActivaIcon name="mail" size={16} />}
              className="mb-activa-24"
              action={
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={reenviarEmailVerificacion}
                  disabled={reenviandoEmail}
                  isLoading={reenviandoEmail}
                  loadingText="Enviando..."
                  className="whitespace-nowrap"
                >
                  Reenviar email
                </Button>
              }
            >
              Revisá tu casilla para comprar participaciones o publicar campañas. Si no encontrás
              el correo, podés solicitar uno nuevo.
            </Alert>
          )}

          {children}
        </section>
      </main>
    </div>
  );
}
