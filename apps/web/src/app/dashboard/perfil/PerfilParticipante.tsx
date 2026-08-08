'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

import { ActivaIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout';
import { Alert, Badge, Button, Card, CardContent, Input, Skeleton } from '@/components/ui';

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
      <div aria-label="Cargando perfil del participante" className="space-y-activa-24">
        <Card>
          <CardContent className="space-y-activa-12 p-activa-20 sm:p-activa-24"><Skeleton variant="text" className="h-8 max-w-sm" /><Skeleton variant="text" className="max-w-2xl" /></CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-activa-16 sm:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (isError || !perfil) {
    return (
      <Alert variant="error" title="No pudimos cargar tu perfil" icon={<ActivaIcon name="error" size={18} />}>
        Intentá nuevamente en unos minutos. Si el problema continúa, contactá a soporte.
      </Alert>
    );
  }

  return (
    <main className="min-w-0 space-y-activa-24 text-text-primary sm:space-y-activa-32">
      <Card>
        <CardContent className="p-activa-20 sm:p-activa-24 lg:p-activa-32">
          <PageHeader eyebrow="Participante" title="Mi perfil" description="Revisá y mantené actualizados tus datos personales y de contacto. Esta información permite identificarte y organizar la entrega de beneficios." />
        </CardContent>
      </Card>

      <section aria-label="Resumen de la cuenta" className="grid min-w-0 grid-cols-1 gap-activa-16 sm:grid-cols-3">
        <Card variant="muted" className="min-w-0">
          <CardContent className="p-activa-20">
            <span className="flex size-10 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary"><ActivaIcon name="mail" size={20} /></span>
            <p className="mt-activa-12 text-xs font-semibold uppercase tracking-wide text-text-secondary">Email de acceso</p>
            <p className="mt-activa-4 max-w-full break-words text-base font-semibold text-text-primary [overflow-wrap:anywhere]">{perfil.email}</p>
          </CardContent>
        </Card>
        <Card variant="muted" className="min-w-0">
          <CardContent className="p-activa-20">
            <span className="flex size-10 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary"><ActivaIcon name={perfil.email_verified ? 'shield-check' : 'pending'} size={20} /></span>
            <p className="mt-activa-12 text-xs font-semibold uppercase tracking-wide text-text-secondary">Estado del email</p>
            <Badge variant={perfil.email_verified ? 'active' : 'warning'} className="mt-activa-8">{perfil.email_verified ? 'Verificado' : 'Pendiente'}</Badge>
          </CardContent>
        </Card>
        <Card variant="muted" className="min-w-0">
          <CardContent className="p-activa-20">
            <span className="flex size-10 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary"><ActivaIcon name="calendar" size={20} /></span>
            <p className="mt-activa-12 text-xs font-semibold uppercase tracking-wide text-text-secondary">Fecha de nacimiento</p>
            <p className="mt-activa-4 break-words text-base font-semibold text-text-primary">{formatearFecha(perfil.fecha_nacimiento)}</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-activa-20 sm:p-activa-24 lg:p-activa-32">
          <div className="flex items-start gap-activa-12">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary"><ActivaIcon name="id-card" size={20} /></span>
            <div className="min-w-0"><h2 className="font-display text-xl font-semibold text-text-primary sm:text-2xl">Datos personales</h2><p className="mt-activa-4 text-sm leading-6 text-text-secondary">Estos datos nos ayudan a mantener tu cuenta correctamente identificada.</p></div>
          </div>
          <div className="mt-activa-24 grid min-w-0 grid-cols-1 gap-activa-20 sm:grid-cols-2">
            <Input label="Nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} required placeholder="Ej: Juan" />
            <Input label="Apellido" value={apellido} onChange={(event) => setApellido(event.target.value)} required placeholder="Ej: Pérez" />
            <Input label="DNI" value={perfil.dni || ''} readOnly helperText="El DNI no puede modificarse desde el perfil." />
            <Input label="Nacionalidad" value={nacionalidad} onChange={(event) => setNacionalidad(event.target.value)} required placeholder="Ej: Argentina" />
            <div className="sm:col-span-2"><Input label="Teléfono celular" value={telefono} onChange={(event) => setTelefono(event.target.value)} required placeholder="Ej: +54 9 343 1234567" /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-activa-20 sm:p-activa-24 lg:p-activa-32">
          <div className="flex items-start gap-activa-12">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary"><ActivaIcon name="location" size={20} /></span>
            <div className="min-w-0"><h2 className="font-display text-xl font-semibold text-text-primary sm:text-2xl">Dirección y entrega</h2><p className="mt-activa-4 text-sm leading-6 text-text-secondary">Los cambios realizados se aplicarán a futuras entregas de beneficios.</p></div>
          </div>
          <div className="mt-activa-24 grid min-w-0 grid-cols-1 gap-activa-20 sm:grid-cols-2">
            <Input label="Provincia" value={provincia} onChange={(event) => setProvincia(event.target.value)} required placeholder="Ej: Entre Ríos" />
            <Input label="Ciudad" value={ciudad} onChange={(event) => setCiudad(event.target.value)} required placeholder="Ej: Paraná" />
            <div className="sm:col-span-2"><Input label="Dirección" value={direccion} onChange={(event) => setDireccion(event.target.value)} required placeholder="Ej: Urquiza 1234, piso 2" /></div>
            <Input label="Código postal" value={codigoPostal} onChange={(event) => setCodigoPostal(event.target.value)} required placeholder="Ej: 3100" />
          </div>
          <div className="mt-activa-24 flex justify-stretch border-t border-border-default pt-activa-24 sm:justify-end">
            <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending} isLoading={mutation.isPending} loadingText="Guardando..." leftIcon={<ActivaIcon name="check" size={18} />} className="w-full sm:w-auto">Guardar cambios</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
