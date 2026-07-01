'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';

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

  return (
    <div className="w-full rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl shadow-black/40">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-400 text-3xl text-black shadow-xl">
        {status === 'loading' ? '⌛' : status === 'success' ? '✅' : '⚠️'}
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-amber-300">
        Sortealo
      </p>

      <h1 className="mt-3 text-3xl font-black">
        Verificación de email
      </h1>

      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400">
        {message}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/login" className="btn-primary">
          Ir a iniciar sesión
        </Link>

        <Link href="/" className="btn-ghost">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default function VerificarEmailPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4 py-10">
        <Suspense
          fallback={
            <div className="w-full rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl shadow-black/40">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-400 text-3xl text-black shadow-xl">
                ⌛
              </div>
              <h1 className="mt-6 text-3xl font-black">Verificación de email</h1>
              <p className="mt-4 text-sm text-zinc-400">Cargando verificación...</p>
            </div>
          }
        >
          <VerificarEmailContent />
        </Suspense>
      </section>
    </main>
  );
}
