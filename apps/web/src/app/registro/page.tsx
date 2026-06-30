'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'participante',
    nombre: '',
    telefono: '',
  });

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
        toast.success('¡Cuenta creada exitosamente!');
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
              ← Volver al inicio
            </Link>

            <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-amber-300">
              Sortealo
            </p>

            <h1 className="max-w-xl text-6xl font-black leading-tight">
              Creá tu cuenta y empezá a participar.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
              Comprá números, seguí tus participaciones, recibí notificaciones y accedé a premios verificados desde tu panel.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-2xl font-black text-amber-300">100%</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">
                  Online
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-2xl font-black text-amber-300">OK</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">
                  Verificado
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-2xl font-black text-amber-300">24/7</p>
                <p className="mt-1 text-xs font-bold text-zinc-500">
                  Disponible
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-5 flex justify-center lg:hidden">
              <Link
                href="/"
                className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
              >
                ← Volver al inicio
              </Link>
            </div>

            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8 md:p-10">
              <div className="mb-8 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-400 text-3xl shadow-xl">
                  🎯
                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-amber-300">
                  Crear cuenta
                </p>

                <h2 className="mt-3 text-3xl font-black text-white">
                  Sumate a Sortealo
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500">
                  Elegí el tipo de cuenta y completá tus datos para empezar.
                </p>
              </div>

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
                        icon: '🙋',
                        desc: 'Quiero comprar números',
                      },
                      {
                        value: 'comercio',
                        label: 'Comercio',
                        icon: '🏪',
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
                      Razón social
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

                  <input
                    type="tel"
                    className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-base font-bold text-white outline-none placeholder:text-zinc-600 focus:border-amber-400"
                    placeholder="+54 9 341 1234567"
                    required
                    value={form.telefono}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, telefono: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    Contraseña
                  </label>

                  <input
                    type="password"
                    className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-base font-bold text-white outline-none placeholder:text-zinc-600 focus:border-amber-400"
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-amber-400 px-6 py-4 text-base font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
                </button>
              </form>

              <p className="mt-7 text-center text-sm font-semibold text-zinc-500">
                ¿Ya tenés cuenta?{' '}
                <Link href="/login" className="font-black text-amber-300">
                  Ingresá
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}