'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { comercioApi } from '@/lib/api';
import toast from 'react-hot-toast';

function getPerfil(res: any) {
  if (!res) return null;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
}

export default function PerfilComercioPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['comercio-perfil'],
    queryFn: () => comercioApi.perfil() as any,
  });

  const perfil = getPerfil(data);

  const [razonSocial, setRazonSocial] = useState('');
  const [cuit, setCuit] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if (!perfil) return;

    setRazonSocial(perfil.razon_social || '');
    setCuit(perfil.cuit || '');
    setTelefono(perfil.telefono || '');
  }, [perfil]);

  const mutation = useMutation({
    mutationFn: () =>
      comercioApi.actualizarPerfil({
        razonSocial,
        cuit,
        telefono,
      }),
    onSuccess: () => {
      toast.success('Perfil actualizado');
      queryClient.invalidateQueries({ queryKey: ['comercio-perfil'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'No se pudo actualizar el perfil');
    },
  });

  if (isLoading) {
    return <div className="animate-pulse text-zinc-400">Cargando perfil...</div>;
  }

  if (!perfil) {
    return (
      <section className="rounded-3xl border border-red-900 bg-red-950/30 p-8 text-red-200">
        No se pudo cargar el perfil del comercio.
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 shadow-2xl">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-amber-400">
          Comercio
        </p>

        <h1 className="text-3xl font-black text-white">Mi perfil</h1>

        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Configurá los datos principales del comercio. Estos datos se usarán para validar el comercio, gestionar sorteos y organizar entregas de premios.
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
            Estado
          </p>
          <p className="mt-3 text-lg font-black text-emerald-300">
            {perfil.estado}
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
            Comisión
          </p>
          <p className="mt-3 text-lg font-black text-amber-300">
            {Number(perfil.comision_pct || 0)}%
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-black text-white">
          Datos fiscales y contacto
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Razón social
            </span>
            <input
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-amber-400"
              placeholder="Ej: Tech Store Córdoba SRL"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              CUIT
            </span>
            <input
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-amber-400"
              placeholder="Ej: 30-12345678-9"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-400">
              Teléfono
            </span>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none focus:border-amber-400"
              placeholder="Ej: +54 9 351 1234567"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-500">
            Más adelante agregaremos logo, dirección de despacho, datos bancarios y conexión con Mercado Pago.
          </p>

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="btn-primary"
          >
            {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </section>
    </div>
  );
}