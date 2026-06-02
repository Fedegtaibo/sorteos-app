'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-4xl animate-pulse">🎯</div>
    </div>
  );

  const navLinks = {
    participante: [
      { href: '/dashboard', label: 'Inicio', icon: '◉' },
      { href: '/dashboard/participaciones', label: 'Mis participaciones', icon: '🎟' },
    ],
    comercio: [
      { href: '/dashboard', label: 'Inicio', icon: '◉' },
      { href: '/dashboard/sorteos', label: 'Mis sorteos', icon: '🎯' },
      { href: '/dashboard/sorteos/nuevo', label: 'Nuevo sorteo', icon: '+' },
      { href: '/dashboard/perfil', label: 'Mi perfil', icon: '◈' },
    ],
    admin: [
      { href: '/dashboard', label: 'Inicio', icon: '◉' },
      { href: '/dashboard/admin/comercios', label: 'Comercios', icon: '🏪' },
      { href: '/dashboard/admin/sorteos', label: 'Todos los sorteos', icon: '🎯' },
      { href: '/dashboard/admin/usuarios', label: 'Usuarios', icon: '👥' },
    ],
  };

  const links = navLinks[role as keyof typeof navLinks] || navLinks.participante;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="font-bold text-sm">Sorteos</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === l.href
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}>
              <span className="text-base">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="px-3 py-2 text-xs text-gray-400 mb-1 truncate">{session?.user?.email}</div>
          <div className="px-3 py-1 mb-2">
            <span className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              role === 'admin' ? 'bg-red-100 text-red-600' :
              role === 'comercio' ? 'bg-orange-100 text-orange-600' :
              'bg-blue-100 text-blue-600'
            )}>{role}</span>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 p-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}
