'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { ActivaIcon } from '@/components/icons';
import { PublicFooter, PublicHeader } from '@/components/layout';
import { Button, Card, CardContent, Divider, Input } from '@/components/ui';

const publicNavigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar', active: true },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true';
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', { ...form, redirect: false });

    setLoading(false);

    if (res?.error) {
      toast.error('Email o contraseña incorrectos');
      return;
    }

    toast.success('¡Bienvenido!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background-page text-text-primary">
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

      <main className="mx-auto flex w-full max-w-7xl items-center justify-center px-activa-16 py-activa-48 sm:px-activa-24 lg:min-h-[calc(100vh-4rem)] lg:px-activa-40 lg:py-activa-64">
        <Card variant="surface" className="w-full max-w-lg shadow-activa-md">
          <CardContent className="p-activa-24 sm:p-activa-32">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-link">
                Acceso a ACTIVA
              </p>
              <h1 className="mt-activa-8 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                Ingresá a tu cuenta
              </h1>
              <p className="mt-activa-12 text-sm leading-7 text-text-secondary sm:text-base">
                Consultá tus campañas, participaciones, comprobantes y estados desde un mismo lugar.
              </p>
            </div>

            {googleEnabled && (
              <div className="mt-activa-24 space-y-activa-20">
                <Button
                  type="button"
                  variant="tertiary"
                  size="lg"
                  onClick={handleGoogleSignIn}
                  className="w-full"
                >
                  Continuar con Google
                </Button>

                <Divider label="o ingresá con email" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-activa-24 space-y-activa-20">
              <Input
                id="login-email"
                label="Email"
                type="email"
                placeholder="tu@email.com"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                leftIcon={<ActivaIcon name="mail" size={18} />}
              />

              <div className="relative">
                <Input
                  id="login-password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  leftIcon={<ActivaIcon name="lock" size={18} />}
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                  className="absolute bottom-0 right-0 flex size-11 items-center justify-center rounded-activa-sm text-text-secondary transition-colors duration-fast ease-activa hover:bg-background-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  <ActivaIcon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                loadingText="Ingresando..."
                className="w-full"
              >
                Ingresar
              </Button>
            </form>

            <p className="mt-activa-24 text-center text-sm text-text-secondary">
              ¿Todavía no tenés cuenta?{' '}
              <Link
                href="/registro"
                className="rounded-activa-xs font-semibold text-text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                Crear cuenta
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <PublicFooter />
    </div>
  );
}
