'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { comercioApi } from '@/lib/api';
import toast from 'react-hot-toast';

import { ActivaIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout';
import { MediaImage } from '@/components/media';
import { Alert, Badge, Button, Card, CardContent, Input, Skeleton } from '@/components/ui';

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
  const [whatsapp, setWhatsapp] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [portadaUrl, setPortadaUrl] = useState('');
  const [direccion, setDireccion] = useState('');
  const [instagram, setInstagram] = useState('');

  useEffect(() => {
    if (!perfil) return;

    setRazonSocial(perfil.razon_social || '');
    setCuit(perfil.cuit || '');
    setTelefono(perfil.telefono || '');
    setWhatsapp(perfil.whatsapp || '');
    setLogoUrl(perfil.logo_url || '');
    setPortadaUrl(perfil.portada_url || '');
    setDireccion(perfil.direccion || '');
    setInstagram(perfil.instagram || '');
  }, [perfil]);

  const mutation = useMutation({
    mutationFn: () =>
      comercioApi.actualizarPerfil({
        razonSocial,
        cuit,
        telefono,
        whatsapp,
        logoUrl,
        portadaUrl,
        direccion,
        instagram,
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
    return (
      <div aria-label="Cargando perfil del comercio" className="space-y-activa-24">
        <Card>
          <CardContent className="space-y-activa-12 p-activa-20 sm:p-activa-24">
            <Skeleton variant="text" className="h-8 max-w-sm" />
            <Skeleton variant="text" className="max-w-2xl" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-activa-16 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!perfil) {
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
          <PageHeader
            eyebrow="Comercio impulsor"
            title="Mi perfil"
            description="Configurá los datos principales de tu comercio para gestionar campañas y organizar entregas de beneficios con información clara y actualizada."
            actions={
              perfil.id ? (
                <Link
                  href={`/comercios/${perfil.id}`}
                  target="_blank"
                  className="inline-flex h-11 w-full items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 sm:w-auto"
                >
                  <ActivaIcon name="external-link" size={18} />
                  Ver perfil público
                </Link>
              ) : null
            }
          />
        </CardContent>
      </Card>

      <section aria-label="Resumen del comercio" className="grid min-w-0 grid-cols-1 gap-activa-16 sm:grid-cols-3">
        <Card variant="muted" className="min-w-0">
          <CardContent className="p-activa-20">
            <span className="flex size-10 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary"><ActivaIcon name="mail" size={20} /></span>
            <p className="mt-activa-12 text-xs font-semibold uppercase tracking-wide text-text-secondary">Email de acceso</p>
            <p className="mt-activa-4 max-w-full break-words text-base font-semibold text-text-primary [overflow-wrap:anywhere]">{perfil.email}</p>
          </CardContent>
        </Card>

        <Card variant="muted" className="min-w-0">
          <CardContent className="p-activa-20">
            <span className="flex size-10 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary"><ActivaIcon name="shield-check" size={20} /></span>
            <p className="mt-activa-12 text-xs font-semibold uppercase tracking-wide text-text-secondary">Estado</p>
            <Badge variant="active" className="mt-activa-8 max-w-full"><span className="break-words [overflow-wrap:anywhere]">{perfil.estado}</span></Badge>
          </CardContent>
        </Card>

        <Card variant="highlight" className="min-w-0">
          <CardContent className="p-activa-20">
            <span className="flex size-10 items-center justify-center rounded-activa-full bg-action-primary text-action-primary-text"><ActivaIcon name="chart" size={20} /></span>
            <p className="mt-activa-12 text-xs font-semibold uppercase tracking-wide text-text-secondary">Comisión</p>
            <p className="mt-activa-4 break-words font-display text-2xl font-semibold text-text-primary">{Number(perfil.comision_pct || 0)}%</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-activa-20 sm:p-activa-24 lg:p-activa-32">
          <div className="flex items-start gap-activa-12">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary"><ActivaIcon name="store" size={20} /></span>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-semibold text-text-primary sm:text-2xl">Datos fiscales y contacto</h2>
              <p className="mt-activa-4 text-sm leading-6 text-text-secondary">Mantené actualizada la información que identifica a tu comercio y facilita el contacto.</p>
            </div>
          </div>

          <div className="mt-activa-24 grid min-w-0 grid-cols-1 gap-activa-20 sm:grid-cols-2">
            <Input label="Razón social" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} placeholder="Ej: Tech Store Córdoba SRL" />
            <Input label="CUIT" value={cuit} onChange={(e) => setCuit(e.target.value)} placeholder="Ej: 30-12345678-9" />
            <div className="sm:col-span-2"><Input label="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: +54 9 351 1234567" /></div>
            <Input label="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Ej: +54 9 351 1234567" />
            <div className="sm:col-span-2"><Input label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Ej: Rosario, Santa Fe" /></div>
            <Input label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Ej: @mi_comercio" />

            <div className="min-w-0">
              <Input label="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." helperText="Usá una imagen clara y reconocible para identificar tu comercio." />
              <div className="mt-activa-16 flex min-w-0 flex-col gap-activa-16 rounded-activa-md border border-border-default bg-background-surface-muted p-activa-16 sm:flex-row sm:items-center">
                <div className="h-32 w-full shrink-0 rounded-activa-md border border-border-default bg-background-surface sm:w-40">
                  <MediaImage src={logoUrl} alt="Vista previa del logo del comercio" placeholderVariant="logo" placeholderText="Logo del comercio no disponible" fit="contain" className="rounded-activa-md" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Vista previa</p>
                  <p className="mt-activa-4 break-words text-sm text-text-secondary">Así se mostrará el logo del comercio.</p>
                </div>
              </div>
            </div>

            <div className="min-w-0 sm:col-span-2">
              <Input label="Portada URL" value={portadaUrl} onChange={(e) => setPortadaUrl(e.target.value)} placeholder="https://..." helperText="Elegí una imagen horizontal que represente la identidad del comercio." />
              <div className="mt-activa-16 overflow-hidden rounded-activa-md border border-border-default bg-background-surface-muted">
                <div className="h-44 w-full max-w-full"><MediaImage src={portadaUrl} alt="Vista previa de la portada del comercio" placeholderVariant="cover" placeholderText="Portada del comercio no disponible" /></div>
                <div className="p-activa-16">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Vista previa</p>
                  <p className="mt-activa-4 text-sm text-text-secondary">Así se mostrará la portada en el perfil público del comercio.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-activa-24 flex min-w-0 flex-col gap-activa-16 border-t border-border-default pt-activa-24 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 break-words text-sm leading-6 text-text-secondary">Estos datos ayudan a validar el comercio y fortalecen la confianza en su perfil público.</p>
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} isLoading={mutation.isPending} loadingText="Guardando..." leftIcon={<ActivaIcon name="check" size={18} />} className="w-full shrink-0 sm:w-auto">Guardar cambios</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
