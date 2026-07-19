'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

function getPerfil(res: any) {
  if (!res) return null;
  if (res?.data?.data?.perfil) return res.data.data.perfil;
  if (res?.data?.perfil) return res.data.perfil;
  if (res?.perfil) return res.perfil;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
}

function formatearFecha(fecha: string | null | undefined) {
  if (!fecha) return 'No informada';

  const valor = String(fecha).slice(0, 10);
  const partes = valor.split('-');

  if (partes.length !== 3) return valor;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function PerfilParticipante() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['participante-perfil'],
    queryFn: () => authApi.perfilParticipante() as any,
  });

  const perfil = getPerfil(data);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');

  useEffect(() => {
    if (!perfil) return;

    setNombre(perfil.nombre || '');
    setApellido(perfil.apellido || '');
    setTelefono(perfil.telefono || '');
    setNacionalidad(perfil.nacionalidad || '');
    setProvincia(perfil.provincia || '');
    setCiudad(perfil.ciudad || '');
    setDireccion(perfil.direccion || '');
    setCodigoPostal(perfil.codigo_postal || '');
  }, [perfil]);

  const mutation = useMutation({
    mutationFn: () =>
      authApi.actualizarPerfilParticipante({
        nombre,
        apellido,
        telefono,
        nacionalidad,
        provincia,
        ciudad,
        direccion,
        codigoPostal,
      }),
    onSuccess: () => {
      toast.success('Perfil actualizado correctamente');
      queryClient.invalidateQueries({
        queryKey: ['participante-perfil'],
      });
    },
    onError: (err: any) => {
      toast.error(err.message || 'No se pudo actualizar el perfil');
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse text-zinc-400">
        Cargando perfil...
      </div>
    );
  }

  if (isError || !perfil) {
    return (
      <section className="rounded-3xl border border-red-900 bg-red-950/30 p-8 text-red-200">
        No se pudo cargar el perfil del participante.
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 shadow-2xl">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-sky-400">
          Participante
        </p>

        <h1 className="text-3xl font-black text-white">
          Mi perfil
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Revisá y mantené actualizados tus datos personales y de contacto.
          Esta información se utilizará para identificarte y organizar la
          entrega de premios.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Email de acceso
          </p>

          <p className="mt-3 break-all text-lg font-black text-white">
            {perfil.email}
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Estado del email
          </p>

          <p
            className={`mt-3 text-lg font-black ${
              perfil.email_verified
                ? 'text-emerald-300'
                : 'text-amber-300'
            }`}
          >
            {perfil.email_verified ? 'Verificado' : 'Pendiente'}
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Fecha de nacimiento
          </p>

          <p className="mt-3 text-lg font-black text-white">
            {formatearFecha(perfil.fecha_nacimiento)}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-black text-white">
          Datos personales
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Nombre
            </span>

            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Ej: Juan"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Apellido
            </span>

            <input
              value={apellido}
              onChange={(event) => setApellido(event.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Ej: Pérez"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              DNI
            </span>

            <input
              value={perfil.dni || ''}
              readOnly
              className="w-full cursor-not-allowed rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-500 outline-none"
            />

            <span className="mt-2 block text-xs text-zinc-600">
              El DNI no puede modificarse desde el perfil.
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Nacionalidad
            </span>

            <input
              value={nacionalidad}
              onChange={(event) => setNacionalidad(event.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Ej: Argentina"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Teléfono celular
            </span>

            <input
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Ej: +54 9 343 1234567"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <h2 className="mb-2 text-2xl font-black text-white">
          Dirección y entrega
        </h2>

        <p className="mb-6 text-sm text-zinc-500">
          Los cambios realizados se aplicarán a futuras entregas de premios.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Provincia
            </span>

            <input
              value={provincia}
              onChange={(event) => setProvincia(event.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Ej: Entre Ríos"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Ciudad
            </span>

            <input
              value={ciudad}
              onChange={(event) => setCiudad(event.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Ej: Paraná"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Dirección
            </span>

            <input
              value={direccion}
              onChange={(event) => setDireccion(event.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Ej: Urquiza 1234, piso 2"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Código postal
            </span>

            <input
              value={codigoPostal}
              onChange={(event) => setCodigoPostal(event.target.value)}
              required
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-sky-400"
              placeholder="Ej: 3100"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending
              ? 'Guardando...'
              : 'Guardar cambios'}
          </button>
        </div>
      </section>
    </div>
  );
}