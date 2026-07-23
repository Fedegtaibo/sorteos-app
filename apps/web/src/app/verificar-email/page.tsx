'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';

import { ActivaIcon } from '@/components/icons';
import { PublicFooter, PublicHeader } from '@/components/layout';
import {
  Alert,
  Badge,
  Card,
  CardContent,
  Spinner,
} from '@/components/ui';

const navigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar' },
] as const;

const primaryLinkClass =
  'inline-flex min-h-11 items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-16 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2';

const secondaryLinkClass =
  'inline-flex min-h-11 items-center justify-center rounded-activa-sm px-activa-16 text-sm font-semibold text-text-link underline-offset-4 transition-colors duration-fast ease-activa hover:bg-background-surface-muted hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2';

function VerificarEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu email...');

  useEffect(() => {
    const verificar = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Falta el token de verificación.');
        return;
      }

      try {
        const res: any = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(res?.mensaje || 'Email verificado correctamente.');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'No se pudo verificar el email.');
      }
    };

    verificar();
  }, [token]);

  if (status === 'loading') {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center p-activa-24 text-center sm:p-activa-40">
          <Badge variant="information">Verificación de cuenta</Badge>
          <span className="mt-activa-24 flex size-16 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
            <Spinner
              size="lg"
              variant="brand"
              label="Verificando tu email"
            />
          </span>
          <h1 className="mt-activa-20 font-display text-3xl font-semibold leading-tight text-text-primary">
            Estamos verificando tu email
          </h1>
          <p className="mt-activa-12 text-base leading-7 text-text-secondary">
            Este proceso puede demorar unos segundos.
          </p>
          <p
            role="status"
            className="mt-activa-16 text-sm font-semibold text-text-primary"
          >
            {message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center p-activa-24 text-center sm:p-activa-40">
          <Badge variant="success">Email verificado</Badge>
          <span
            aria-hidden="true"
            className="mt-activa-24 flex size-16 items-center justify-center rounded-activa-full bg-status-success/10 text-status-success"
          >
            <ActivaIcon name="check-circle" size={32} />
          </span>
          <h1 className="mt-activa-20 font-display text-3xl font-semibold leading-tight text-text-primary">
            Tu email fue verificado
          </h1>
          <Alert
            variant="success"
            className="mt-activa-20 w-full text-left"
            icon={<ActivaIcon name="check" size={16} />}
          >
            {message}
          </Alert>
          <div className="mt-activa-24 flex w-full flex-col gap-activa-8 sm:w-auto sm:flex-row sm:items-center">
            <Link href="/login" className={primaryLinkClass}>
              Ingresar a mi cuenta
              <ActivaIcon name="arrow-right" size={16} />
            </Link>
            <Link href="/" className={secondaryLinkClass}>
              Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center p-activa-24 text-center sm:p-activa-40">
        <Badge variant="error">No pudimos verificar el email</Badge>
        <span
          aria-hidden="true"
          className="mt-activa-24 flex size-16 items-center justify-center rounded-activa-full bg-status-error/10 text-status-error"
        >
          <ActivaIcon name="error" size={32} />
        </span>
        <h1 className="mt-activa-20 font-display text-3xl font-semibold leading-tight text-text-primary">
          Revisá el enlace de verificación
        </h1>
        <Alert
          variant="error"
          className="mt-activa-20 w-full text-left"
          icon={<ActivaIcon name="error" size={16} />}
        >
          {message}
        </Alert>
        <div className="mt-activa-24 flex w-full flex-col gap-activa-8 sm:w-auto sm:flex-row sm:items-center">
          <Link href="/login" className={primaryLinkClass}>
            Ir a ingresar
            <ActivaIcon name="arrow-right" size={16} />
          </Link>
          <Link href="/" className={secondaryLinkClass}>
            Volver al inicio
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function VerificationFallback() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center p-activa-24 text-center sm:p-activa-40">
        <span className="flex size-16 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
          <Spinner
            size="lg"
            variant="brand"
            label="Cargando verificación"
          />
        </span>
        <h1 className="mt-activa-20 font-display text-2xl font-semibold text-text-primary">
          Cargando verificación…
        </h1>
      </CardContent>
    </Card>
  );
}

export default function VerificarEmailPage() {
  return (
    <div className="min-h-screen bg-background-page text-text-primary">
      <PublicHeader
        variant="light"
        logoHref="/"
        navigation={navigation}
        actions={
          <Link href="/registro" className={primaryLinkClass}>
            Crear cuenta
          </Link>
        }
      />

      <main className="px-activa-16 py-activa-48 sm:px-activa-24 sm:py-activa-64 lg:px-activa-40">
        <section
          aria-label="Verificación de email"
          className="mx-auto flex min-h-[28rem] max-w-xl items-center justify-center"
        >
          <Suspense fallback={<VerificationFallback />}>
            <VerificarEmailContent />
          </Suspense>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
