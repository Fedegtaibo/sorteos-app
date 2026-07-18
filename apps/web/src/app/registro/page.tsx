'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

const roles = [
  {
    value: 'participante',
    label: 'Participante',
    icon: '\u{1F64B}',
    desc: 'Quiero comprar n\u00fameros',
  },
  {
    value: 'comercio',
    label: 'Comercio',
    icon: '\u{1F3EA}',
    desc: 'Quiero crear sorteos',
  },
] as const;

function obtenerFechaMaxima(): string {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() - 18);

  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'participante' as 'participante' | 'comercio',
    nombre: '',
    apellido: '',
    telefono: '',
    fechaNacimiento: '',
    dni: '',
    nacionalidad: 'Argentina',
    provincia: '',
    ciudad: '',
    direccion: '',
    codigoPostal: '',
    mayor18Declarado: false,
    terminosAceptados: false,
  });

  const telefonoLocal = form.telefono.replace(/^\+54\s?/, '');
  const fechaMaxima = obtenerFechaMaxima();

  const inputClass =
    'w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-base font-bold text-white outline-none placeholder:text-zinc-600 focus:border-amber-400';

  const labelClass =
    'mb-2 block text-xs font-black uppercase tracking-[0.2em] text-zinc-500';

  const handleTelefonoChange = (value: string) => {
    const limpio = value.replace(/^\+54\s*/, '').trimStart();

    setForm((actual) => ({
      ...actual,
      telefono: limpio ? `+54 ${limpio}` : '',
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload =
        form.role === 'participante'
          ? {
              email: form.email.trim(),
              password: form.password,
              role: form.role,
              nombre: form.nombre.trim(),
              apellido: form.apellido.trim(),
              telefono: form.telefono.trim(),
              fechaNacimiento: form.fechaNacimiento,
              dni: form.dni,
              nacionalidad: form.nacionalidad.trim(),
              provincia: form.provincia.trim(),
              ciudad: form.ciudad.trim(),
              direccion: form.direccion.trim(),
              codigoPostal: form.codigoPostal.trim(),
              mayor18Declarado: form.mayor18Declarado,
              terminosAceptados: form.terminosAceptados,
            }
          : {
              email: form.email.trim(),
              password: form.password,
              role: form.role,
              nombre: form.nombre.trim(),
              telefono: form.telefono.trim(),
            };

      await authApi.register(payload);

      const result = await signIn('credentials', {
        email: form.email.trim(),
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        toast.success(
          'Cuenta creada. Ya pod\u00e9s ingresar con tu email y contrase\u00f1a.',
        );
        router.push('/login');
        return;
      }

      toast.success('\u00a1Cuenta creada exitosamente!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_680px] lg:items-start">
        <div className="hidden lg:sticky lg:top-10 lg:block">
          <Link
            href="/"
            className="mb-8 inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
          >
            &larr; Volver al inicio
          </Link>

          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-amber-300">
            Sortealo
          </p>

          <h1 className="max-w-xl text-5xl font-black leading-tight">
            Cre&aacute; tu cuenta y empez&aacute; a participar.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
            Compr&aacute; n&uacute;meros, segu&iacute; tus participaciones,
            recib&iacute; comprobantes y acced&eacute; a sorteos verificados desde
            tu panel.
          </p>

          <div className="mt-8 max-w-lg rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
            <p className="font-black text-amber-200">
              Registro responsable y entrega ordenada
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Los participantes deben ser mayores de 18 a&ntilde;os. El
              domicilio registrado se utilizar&aacute; como referencia para
              coordinar la entrega de un premio y podr&aacute; confirmarse antes
              del env&iacute;o.
            </p>
          </div>
        </div>

        <div>
          <div className="mb-5 flex justify-center lg:hidden">
            <Link
              href="/"
              className="inline-flex rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10"
            >
              &larr; Volver al inicio
            </Link>
          </div>

          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8 md:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-400 text-3xl shadow-xl">
                {'\u{1F3AF}'}
              </div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-amber-300">
                Crear cuenta
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Sumate a Sortealo
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
                Eleg&iacute; el tipo de cuenta y complet&aacute; los datos
                solicitados.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                  Tipo de cuenta
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() =>
                        setForm((actual) => ({
                          ...actual,
                          role: role.value,
                        }))
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
                        form.role === role.value
                          ? 'border-amber-400 bg-amber-400 text-black'
                          : 'border-zinc-800 bg-black text-white hover:border-amber-400/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-base font-black">
                        <span>{role.icon}</span>
                        <span>{role.label}</span>
                      </div>

                      <div
                        className={`mt-1 text-xs font-semibold ${
                          form.role === role.value
                            ? 'text-black/60'
                            : 'text-zinc-500'
                        }`}
                      >
                        {role.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {form.role === 'participante' ? (
                <>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm font-black text-white">
                      Datos de identidad
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Se utilizan para verificar la participaci&oacute;n y
                      coordinar una eventual entrega. No se muestran
                      p&uacute;blicamente.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Nombre</label>
                      <input
                        className={inputClass}
                        placeholder="Juan"
                        required
                        autoComplete="given-name"
                        maxLength={120}
                        value={form.nombre}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            nombre: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Apellido</label>
                      <input
                        className={inputClass}
                        placeholder={'P\u00e9rez'}
                        required
                        autoComplete="family-name"
                        maxLength={120}
                        value={form.apellido}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            apellido: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Fecha de nacimiento
                      </label>
                      <input
                        type="date"
                        className={inputClass}
                        required
                        min="1900-01-01"
                        max={fechaMaxima}
                        value={form.fechaNacimiento}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            fechaNacimiento: event.target.value,
                          }))
                        }
                      />
                      <p className="mt-2 text-xs font-semibold text-zinc-500">
                        Deb&eacute;s tener 18 a&ntilde;os o m&aacute;s.
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>DNI</label>
                      <input
                        className={inputClass}
                        placeholder="30123456"
                        required
                        inputMode="numeric"
                        autoComplete="off"
                        minLength={7}
                        maxLength={9}
                        pattern="[0-9]{7,9}"
                        value={form.dni}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            dni: event.target.value
                              .replace(/\D/g, '')
                              .slice(0, 9),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Nacionalidad</label>
                    <input
                      className={inputClass}
                      placeholder="Argentina"
                      required
                      autoComplete="country-name"
                      maxLength={80}
                      value={form.nacionalidad}
                      onChange={(event) =>
                        setForm((actual) => ({
                          ...actual,
                          nacionalidad: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm font-black text-white">
                      Domicilio para coordinar entregas
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Guardaremos este domicilio como referencia. Si
                      result&aacute;s ganador, se confirmar&aacute; antes de
                      realizar cualquier env&iacute;o.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Provincia</label>
                      <input
                        className={inputClass}
                        placeholder={'Entre R\u00edos'}
                        required
                        autoComplete="address-level1"
                        maxLength={120}
                        value={form.provincia}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            provincia: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Ciudad</label>
                      <input
                        className={inputClass}
                        placeholder={'Paran\u00e1'}
                        required
                        autoComplete="address-level2"
                        maxLength={120}
                        value={form.ciudad}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            ciudad: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
                    <div>
                      <label className={labelClass}>Direcci&oacute;n</label>
                      <input
                        className={inputClass}
                        placeholder="Urquiza 1234, piso 2, departamento A"
                        required
                        autoComplete="street-address"
                        maxLength={255}
                        value={form.direccion}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            direccion: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className={labelClass}>C&oacute;digo postal</label>
                      <input
                        className={inputClass}
                        placeholder="3100"
                        required
                        autoComplete="postal-code"
                        maxLength={20}
                        value={form.codigoPostal}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            codigoPostal: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className={labelClass}>Raz&oacute;n social</label>
                  <input
                    className={inputClass}
                    placeholder="Mi Comercio SRL"
                    required
                    autoComplete="organization"
                    maxLength={120}
                    value={form.nombre}
                    onChange={(event) =>
                      setForm((actual) => ({
                        ...actual,
                        nombre: event.target.value,
                      }))
                    }
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((actual) => ({
                      ...actual,
                      email: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Celular</label>

                <div className="flex overflow-hidden rounded-2xl border border-zinc-800 bg-black focus-within:border-amber-400">
                  <div className="flex items-center border-r border-zinc-800 bg-amber-400 px-4 text-base font-black text-black">
                    +54
                  </div>

                  <input
                    type="tel"
                    className="w-full bg-black px-5 py-4 text-base font-bold text-white outline-none placeholder:text-zinc-600"
                    placeholder="9 341 1234567"
                    required
                    autoComplete="tel"
                    maxLength={25}
                    value={telefonoLocal}
                    onChange={(event) =>
                      handleTelefonoChange(event.target.value)
                    }
                  />
                </div>

                <p className="mt-2 text-xs font-semibold leading-5 text-zinc-500">
                  Ingres&aacute; 9 + caracter&iacute;stica + n&uacute;mero.
                  Ejemplo: 9 341 1234567.
                </p>
              </div>

              <div>
                <label className={labelClass}>Contrase&ntilde;a</label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`${inputClass} pr-28`}
                    placeholder={'M\u00ednimo 8 caracteres'}
                    required
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) =>
                      setForm((actual) => ({
                        ...actual,
                        password: event.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-amber-300"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              {form.role === 'participante' && (
                <div className="space-y-4 rounded-3xl border border-zinc-800 bg-black p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      checked={form.mayor18Declarado}
                      onChange={(event) =>
                        setForm((actual) => ({
                          ...actual,
                          mayor18Declarado: event.target.checked,
                        }))
                      }
                      className="mt-1 h-5 w-5 accent-amber-400"
                    />
                    <span className="text-sm font-semibold leading-6 text-zinc-300">
                      Declaro que tengo 18 a&ntilde;os o m&aacute;s y que los
                      datos ingresados son verdaderos.
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      checked={form.terminosAceptados}
                      onChange={(event) =>
                        setForm((actual) => ({
                          ...actual,
                          terminosAceptados: event.target.checked,
                        }))
                      }
                      className="mt-1 h-5 w-5 accent-amber-400"
                    />
                    <span className="text-sm font-semibold leading-6 text-zinc-300">
                      Acepto los{' '}
                      <Link
                        href="/terminos"
                        target="_blank"
                        className="font-black text-amber-300 hover:underline"
                      >
                        T&eacute;rminos y condiciones
                      </Link>{' '}
                      y la{' '}
                      <Link
                        href="/privacidad"
                        target="_blank"
                        className="font-black text-amber-300 hover:underline"
                      >
                        Pol&iacute;tica de privacidad
                      </Link>
                      .
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-amber-400 px-6 py-4 text-base font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta \u2192'}
              </button>
            </form>

            <p className="mt-7 text-center text-sm font-semibold text-zinc-500">
              &iquest;Ya ten&eacute;s cuenta?{' '}
              <Link href="/login" className="font-black text-amber-300">
                Ingres&aacute;
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
