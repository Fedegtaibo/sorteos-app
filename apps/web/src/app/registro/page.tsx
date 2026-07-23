'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

import { ActivaIcon, type ActivaIconName } from '@/components/icons';
import { PublicFooter, PublicHeader } from '@/components/layout';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Input,
} from '@/components/ui';

const navigation = [
  { href: '/', label: 'Inicio' },
  { href: '/ayuda', label: 'Ayuda' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/fundadores', label: 'Fundadores' },
  { href: '/login', label: 'Ingresar' },
] as const;

const roles: readonly {
  value: 'participante' | 'comercio';
  title: string;
  description: string;
  icon: ActivaIconName;
}[] = [
  {
    value: 'participante',
    title: 'Quiero participar',
    description:
      'Accedé a campañas, elegí participaciones y consultá tus comprobantes y resultados.',
    icon: 'participation',
  },
  {
    value: 'comercio',
    title: 'Quiero impulsar campañas',
    description:
      'Organizá oportunidades, administrá participaciones y seguí cada etapa desde tu cuenta.',
    icon: 'campaign',
  },
];

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
          'Cuenta creada. Ya podés ingresar con tu email y contraseña.',
        );
        router.push('/login');
        return;
      }

      toast.success('¡Cuenta creada exitosamente!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-page text-text-primary">
      <PublicHeader
        variant="light"
        logoHref="/"
        navigation={navigation}
        actions={
          <Link
            href="/registro"
            aria-current="page"
            className="inline-flex min-h-9 items-center justify-center rounded-activa-sm bg-action-primary px-activa-12 text-sm font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
          >
            Crear cuenta
          </Link>
        }
      />

      <main className="px-activa-16 py-activa-40 sm:px-activa-24 sm:py-activa-48 lg:px-activa-40 lg:py-activa-64">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="brand">Registro en ACTIVA</Badge>
            <h1 className="mt-activa-16 font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
              Creá tu cuenta
            </h1>
            <p className="mt-activa-12 text-base leading-7 text-text-secondary sm:text-lg">
              Elegí cómo vas a usar ACTIVA y completá la información necesaria
              para comenzar.
            </p>
          </div>

          <Card className="mt-activa-32 sm:mt-activa-40">
            <CardContent className="p-activa-20 sm:p-activa-32">
              <form onSubmit={handleSubmit} className="space-y-activa-32">
                <fieldset>
                  <legend className="font-display text-lg font-semibold text-text-primary">
                    ¿Cómo querés usar ACTIVA?
                  </legend>
                  <p className="mt-activa-4 text-sm leading-6 text-text-secondary">
                    Podés elegir una cuenta personal o una cuenta para tu
                    comercio.
                  </p>

                  <div className="mt-activa-16 grid gap-activa-12 sm:grid-cols-2">
                    {roles.map((role) => {
                      const selected = form.role === role.value;

                      return (
                        <button
                          key={role.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            setForm((actual) => ({
                              ...actual,
                              role: role.value,
                            }))
                          }
                          className={`min-h-32 rounded-activa-md border p-activa-20 text-left transition-[background-color,border-color,box-shadow] duration-fast ease-activa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 ${
                            selected
                              ? 'border-action-secondary bg-activa-teal-soft shadow-activa-sm'
                              : 'border-border-default bg-background-surface hover:border-border-strong hover:bg-background-surface-muted'
                          }`}
                        >
                          <span className="flex items-center gap-activa-12">
                            <span
                              aria-hidden="true"
                              className={`flex size-10 shrink-0 items-center justify-center rounded-activa-full ${
                                selected
                                  ? 'bg-action-secondary text-action-secondary-text'
                                  : 'bg-background-surface-muted text-action-secondary'
                              }`}
                            >
                              <ActivaIcon name={role.icon} size={20} />
                            </span>
                            <span className="font-display text-base font-semibold text-text-primary">
                              {role.title}
                            </span>
                          </span>
                          <span className="mt-activa-12 block text-sm leading-6 text-text-secondary">
                            {role.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {form.role === 'participante' ? (
                  <section aria-labelledby="identity-title">
                    <div className="flex items-start gap-activa-12">
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-activa-full bg-action-primary/15 text-action-primary-text"
                      >
                        <ActivaIcon name="id-card" size={20} />
                      </span>
                      <div>
                        <h2
                          id="identity-title"
                          className="font-display text-lg font-semibold text-text-primary"
                        >
                          Datos de identidad
                        </h2>
                        <p className="mt-activa-4 text-sm leading-6 text-text-secondary">
                          Esta información permite identificar tu cuenta y
                          coordinar las etapas que lo requieran.
                        </p>
                      </div>
                    </div>

                    <div className="mt-activa-20 grid gap-activa-20 sm:grid-cols-2">
                      <Input
                        label="Nombre"
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
                      <Input
                        label="Apellido"
                        placeholder="Pérez"
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
                      <Input
                        label="Fecha de nacimiento"
                        type="date"
                        required
                        min="1900-01-01"
                        max={fechaMaxima}
                        helperText="Debés tener 18 años o más."
                        value={form.fechaNacimiento}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            fechaNacimiento: event.target.value,
                          }))
                        }
                      />
                      <Input
                        label="DNI"
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
                      <div className="sm:col-span-2">
                        <Input
                          label="Nacionalidad"
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
                    </div>
                  </section>
                ) : (
                  <section aria-labelledby="commerce-title">
                    <div className="flex items-start gap-activa-12">
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-activa-full bg-action-primary/15 text-action-primary-text"
                      >
                        <ActivaIcon name="store" size={20} />
                      </span>
                      <div>
                        <h2
                          id="commerce-title"
                          className="font-display text-lg font-semibold text-text-primary"
                        >
                          Datos del comercio
                        </h2>
                        <p className="mt-activa-4 text-sm leading-6 text-text-secondary">
                          Ingresá la información principal con la que vas a
                          operar en ACTIVA.
                        </p>
                      </div>
                    </div>

                    <div className="mt-activa-20">
                      <Input
                        label="Razón social"
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
                  </section>
                )}

                {form.role === 'participante' ? (
                  <section aria-labelledby="address-title">
                    <div className="flex items-start gap-activa-12">
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-activa-full bg-action-primary/15 text-action-primary-text"
                      >
                        <ActivaIcon name="location" size={20} />
                      </span>
                      <div>
                        <h2
                          id="address-title"
                          className="font-display text-lg font-semibold text-text-primary"
                        >
                          Domicilio
                        </h2>
                        <p className="mt-activa-4 text-sm leading-6 text-text-secondary">
                          Se guarda como referencia para coordinar entregas y
                          puede confirmarse antes de cualquier envío.
                        </p>
                      </div>
                    </div>

                    <div className="mt-activa-20 grid gap-activa-20 sm:grid-cols-2">
                      <Input
                        label="Provincia"
                        placeholder="Entre Ríos"
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
                      <Input
                        label="Ciudad"
                        placeholder="Paraná"
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
                      <Input
                        label="Dirección"
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
                      <Input
                        label="Código postal"
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
                  </section>
                ) : null}

                <section aria-labelledby="access-title">
                  <div className="flex items-start gap-activa-12">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-activa-full bg-action-primary/15 text-action-primary-text"
                    >
                      <ActivaIcon name="lock" size={20} />
                    </span>
                    <div>
                      <h2
                        id="access-title"
                        className="font-display text-lg font-semibold text-text-primary"
                      >
                        Contacto y acceso
                      </h2>
                      <p className="mt-activa-4 text-sm leading-6 text-text-secondary">
                        Usaremos estos datos para identificar tu acceso y
                        mantenerte al tanto de tu actividad.
                      </p>
                    </div>
                  </div>

                  <div className="mt-activa-20 grid gap-activa-20 sm:grid-cols-2">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="tu@email.com"
                      required
                      autoComplete="email"
                      leftIcon={<ActivaIcon name="mail" size={20} />}
                      value={form.email}
                      onChange={(event) =>
                        setForm((actual) => ({
                          ...actual,
                          email: event.target.value,
                        }))
                      }
                    />
                    <Input
                      label="Celular"
                      type="tel"
                      className="pl-16"
                      placeholder="9 341 1234567"
                      required
                      autoComplete="tel"
                      maxLength={25}
                      leftIcon={
                        <span className="font-semibold text-text-primary">
                          +54
                        </span>
                      }
                      helperText="Ingresá 9 + característica + número. Ejemplo: 9 341 1234567."
                      value={telefonoLocal}
                      onChange={(event) =>
                        handleTelefonoChange(event.target.value)
                      }
                    />
                    <div className="relative sm:col-span-2">
                      <Input
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        className="pr-14"
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        maxLength={72}
                        autoComplete="new-password"
                        helperText="Usá entre 8 y 72 caracteres."
                        leftIcon={<ActivaIcon name="lock" size={20} />}
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
                        aria-label={
                          showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                        aria-pressed={showPassword}
                        onClick={() =>
                          setShowPassword((visible) => !visible)
                        }
                        className="absolute right-1 top-7 flex size-10 items-center justify-center rounded-activa-sm text-text-secondary transition-colors duration-fast ease-activa hover:bg-background-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      >
                        <ActivaIcon
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={20}
                        />
                      </button>
                    </div>
                  </div>
                </section>

                {form.role === 'participante' ? (
                  <Card variant="muted">
                    <CardContent className="space-y-activa-16 p-activa-20">
                      <Checkbox
                        required
                        checked={form.mayor18Declarado}
                        onChange={(event) =>
                          setForm((actual) => ({
                            ...actual,
                            mayor18Declarado: event.target.checked,
                          }))
                        }
                        label="Declaro que tengo 18 años o más y que los datos ingresados son verdaderos."
                      />

                      <label className="flex min-h-10 cursor-pointer items-start gap-activa-12">
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
                          className="mt-0.5 size-5 shrink-0 rounded-activa-xs border-border-strong text-action-secondary accent-action-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                        />
                        <span className="text-sm font-semibold leading-6 text-text-primary">
                          Acepto los{' '}
                          <Link
                            href="/terminos"
                            target="_blank"
                            className="rounded-activa-xs text-text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                          >
                            Términos y condiciones
                          </Link>{' '}
                          y la{' '}
                          <Link
                            href="/privacidad"
                            target="_blank"
                            className="rounded-activa-xs text-text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                          >
                            Política de privacidad
                          </Link>
                          .
                        </span>
                      </label>
                    </CardContent>
                  </Card>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  isLoading={loading}
                  loadingText="Creando cuenta"
                  className="w-full"
                  rightIcon={<ActivaIcon name="arrow-right" size={20} />}
                >
                  Crear cuenta
                </Button>
              </form>

              <p className="mt-activa-24 text-center text-sm text-text-secondary">
                ¿Ya tenés cuenta?{' '}
                <Link
                  href="/login"
                  className="rounded-activa-xs font-semibold text-text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  Ingresá
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
