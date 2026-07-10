'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegistroPage() {
  const router = useRouter();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true';
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'participante',
    nombre: '',
    telefono: '',
  });

  const telefonoLocal = form.telefono.replace(/^\+54\s?/, '');

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleTelefonoChange = (value: string) => {
    const limpio = value.replace(/^\+54\s*/, '').trimStart();

    setForm((f) => ({
      ...f,
      telefono: limpio ? `+54 ${limpio}` : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.register(form);

      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (!res?.error) {
        toast.success('Â¡Cuenta creada exitosamente!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_560px] lg:items-center">
          <div className="hidden lg:block">
            <Link
              href="/"
              className="mb-8 inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
            >
              â† Volver al inicio
            </Link>

            <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-amber-300">
              Sortealo
            </p>

            <h1 className="max-w-xl text-5xl font-black leading-tight">
              CreÃ¡ tu cuenta y empezÃ¡ a participar.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
              ComprÃ¡ nÃºmeros, seguÃ­ tus participaciones, recibÃ­ comprobantes y accedÃ© a sorteos verificados desde tu panel.
            </p>
          </div>

          <div>
            <div className="mb-5 flex justify-center lg:hidden">
              <Link
                href="/"
                className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
              >
                â† Volver al inicio
              </Link>
            </div>

            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8 md:p-10">
              <div className="mb-8 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-400 text-3xl shadow-xl">
                  ðŸŽ¯
                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-amber-300">
                  Crear cuenta
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  Sumate a Sortealo
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500">
                  ElegÃ­ el tipo de cuenta y completÃ¡ tus datos para empezar.
                </p>
              </div>

              {googleEnabled && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="mb-5 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-base font-black text-white transition hover:bg-white/10"
                  >
                    Continuar con Google
                  </button>

                  <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-600">
                    <span className="h-px bg-white/10" />
                    <span>o creÃ¡ tu cuenta con email</span>
                    <span className="h-px bg-white/10" />
                  </div>
                </>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    Tipo de cuenta
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      {
                        value: 'participante',
                        label: 'Participante',
                        icon: 'ðŸ™‹',
                        desc: 'Quiero comprar nÃºmeros',
                      },
                      {
                        value: 'comercio',
                        label: 'Comercio',
                        icon: 'ðŸª',
                        desc: 'Quiero crear sorteos',
                      },
                    ].map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, role: r.value }))
                        }
                        className={`rounded-2xl border p-4 text-left transition ${
                          form.role === r.value
                            ? 'border-amber-400 bg-amber-400 text-black'
                            : 'border-zinc-800 bg-black text-white hover:border-amber-400/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-base font-black">
                          <span>{r.icon}</span>
                          <span>{r.label}</span>
                        </div>

                        <div
                          className={`mt-1 text-xs font-semibold ${
                            form.role === r.value
                              ? 'text-black/60'
                              : 'text-zinc-500'
                          }`}
                        >
                          {r.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {form.role === 'comercio' && (
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                      RazÃ³n social
                    </label>

                    <input
                      className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-base font-bold text-white outline-none placeholder:text-zinc-600 focus:border-amber-400"
                      placeholder="Mi Comercio SRL"
                      required
                      value={form.nombre}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, nombre: e.target.value }))
                      }
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    Email
                  </label>

                  <input
                    type="email"
                    className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-base font-bold text-white outline-none placeholder:text-zinc-600 focus:border-amber-400"
                    placeholder="tu@email.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    Celular
                  </label>

                  <div className="flex overflow-hidden rounded-2xl border border-zinc-800 bg-black focus-within:border-amber-400">
                    <div className="flex items-center border-r border-zinc-800 bg-amber-400 px-4 text-base font-black text-black">
                      +54
                    </div>

                    <input
                      type="tel"
                      className="w-full bg-black px-5 py-4 text-base font-bold text-white outline-none placeholder:text-zinc-600"
                      placeholder="9 341 1234567"
                      required
                      value={telefonoLocal}
                      onChange={(e) => handleTelefonoChange(e.target.value)}
                    />
                  </div>

                  <p className="mt-2 text-xs font-semibold leading-5 text-zinc-500">
                    IngresÃ¡ 9 + caracterÃ­stica + nÃºmero. Ejemplo: 9 341 1234567.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    ContraseÃ±a
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 pr-28 text-base font-bold text-white outline-none placeholder:text-zinc-600 focus:border-amber-400"
                      placeholder="MÃ­nimo 8 caracteres"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-amber-300"
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-amber-400 px-6 py-4 text-base font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta â†’'}
                </button>
              </form>

              <p className="mt-7 text-center text-sm font-semibold text-zinc-500">
                Â¿Ya tenÃ©s cuenta?{' '}
                <Link href="/login" className="font-black text-amber-300">
                  IngresÃ¡
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}