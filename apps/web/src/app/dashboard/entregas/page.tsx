'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import ChatPremio from '@/components/ChatPremio';
import { ActivaIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout';
import { Badge, Button, Card, CardContent, Skeleton } from '@/components/ui';
import { comercioApi } from '@/lib/api';
import { formatFecha } from '@/lib/utils';

function EstadoEntregaBadge({ estado }: { estado: string }) {
  const variants: Record<
    string,
    'neutral' | 'information' | 'active' | 'success' | 'warning' | 'error'
  > = {
    pendiente: 'warning',
    preparando: 'information',
    enviado: 'active',
    entregado: 'success',
    confirmado: 'success',
    reclamado: 'error',
  };

  return (
    <Badge variant={variants[estado] || variants.pendiente} size="sm">
      {estado}
    </Badge>
  );
}

export default function EntregasPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['comercio-entregas'],
    queryFn: () => comercioApi.entregas() as any,
  });

  const mutation = useMutation({
    mutationFn: ({ id, payload }: any) => comercioApi.actualizarEntrega(id, payload),
    onSuccess: () => {
      toast.success('Entrega actualizada');
      queryClient.invalidateQueries({ queryKey: ['comercio-entregas'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'No se pudo actualizar la entrega');
    },
  });

  const entregas: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  const actualizar = (id: string, estado: string) => {
    const payload: any = { estado };

    if (estado === 'enviado') {
      const empresaEnvio = window.prompt('Empresa de envío', '');
      if (!empresaEnvio) return;

      const codigoSeguimiento = window.prompt('Código de seguimiento', '');
      if (!codigoSeguimiento) return;

      payload.empresaEnvio = empresaEnvio;
      payload.codigoSeguimiento = codigoSeguimiento;
    }

    if (estado === 'entregado') {
      const notasComercio = window.prompt(
        'Detalle o evidencia de entrega (opcional)',
        '',
      );

      if (notasComercio) {
        payload.notasComercio = notasComercio;
      }
    }

    mutation.mutate({ id, payload });
  };

  if (isLoading) {
    return (
      <div aria-label="Cargando entregas" className="space-y-activa-24">
        <Card>
          <CardContent className="space-y-activa-12 p-activa-20 sm:p-activa-24">
            <Skeleton variant="text" className="h-8 max-w-sm" />
            <Skeleton variant="text" className="max-w-2xl" />
          </CardContent>
        </Card>
        <div className="grid gap-activa-16 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-w-0 space-y-activa-24 text-text-primary sm:space-y-activa-32">
      <section className="rounded-activa-lg border border-border-default bg-background-surface p-activa-20 shadow-activa-sm sm:p-activa-24 lg:p-activa-32">
        <PageHeader
          eyebrow="Comercio impulsor"
          title="Entregas de beneficios"
          description="Gestioná cada entrega y mantené actualizada la información logística. Una vez confirmada la recepción, la plataforma podrá continuar con la liberación de fondos al comercio."
        />
      </section>

      {entregas.length === 0 ? (
        <Card variant="muted" className="border-dashed">
          <CardContent className="py-activa-40 text-center sm:py-activa-48">
            <span className="mx-auto grid size-12 place-items-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
              <ActivaIcon name="delivery" size={24} />
            </span>
            <h2 className="mt-activa-16 font-display text-xl font-semibold text-text-primary">
              Todavía no hay entregas pendientes
            </h2>
            <p className="mx-auto mt-activa-8 max-w-md text-sm leading-6 text-text-secondary">
              Cuando una campaña finalice y exista una persona seleccionada, la entrega del
              beneficio aparecerá en esta sección.
            </p>
          </CardContent>
        </Card>
      ) : (
        <section aria-label="Entregas de beneficios" className="space-y-activa-16">
          {entregas.map((e) => (
            <Card key={e.id} className="min-w-0">
              <CardContent className="p-activa-16 sm:p-activa-20 lg:p-activa-24">
                <div className="flex min-w-0 flex-col gap-activa-20 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-activa-8">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-activa-md bg-activa-teal-soft text-action-secondary">
                        <ActivaIcon name="delivery" size={22} />
                      </span>
                      <h2 className="min-w-0 max-w-full break-words font-display text-xl font-semibold text-text-primary">
                        {e.sorteo_nombre}
                      </h2>
                      <EstadoEntregaBadge estado={e.estado} />
                    </div>

                    <div className="mt-activa-16 grid grid-cols-2 gap-activa-12 lg:grid-cols-4">
                      <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12">
                        <p className="text-xs text-text-secondary">Persona seleccionada</p>
                        <p className="mt-activa-4 break-words [overflow-wrap:anywhere] text-sm font-semibold text-text-primary">
                          {e.ganador_email}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12">
                        <p className="text-xs text-text-secondary">Opción seleccionada</p>
                        <p className="mt-activa-4 break-words text-sm font-semibold text-text-primary">
                          #{e.numero_visible}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12">
                        <p className="text-xs text-text-secondary">Entrega registrada</p>
                        <p className="mt-activa-4 break-words text-sm font-semibold text-text-primary">
                          {formatFecha(e.created_at)}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12">
                        <p className="text-xs text-text-secondary">Seguimiento</p>
                        <p className="mt-activa-4 break-words [overflow-wrap:anywhere] text-sm font-semibold text-text-primary">
                          {e.codigo_seguimiento || 'Sin cargar'}
                        </p>
                      </div>
                    </div>

                    <ChatPremio entregaId={e.id} />
                  </div>

                  <div className="flex min-w-0 shrink-0 flex-col gap-activa-8 sm:flex-row sm:flex-wrap lg:w-52 lg:flex-col">
                    <Button
                      variant="tertiary"
                      disabled={mutation.isPending}
                      onClick={() => actualizar(e.id, 'preparando')}
                      leftIcon={<ActivaIcon name="package" size={18} />}
                      className="w-full sm:w-auto lg:w-full"
                    >
                      Preparar
                    </Button>
                    <Button
                      variant="tertiary"
                      disabled={mutation.isPending}
                      onClick={() => actualizar(e.id, 'enviado')}
                      leftIcon={<ActivaIcon name="delivery" size={18} />}
                      className="w-full sm:w-auto lg:w-full"
                    >
                      Marcar enviado
                    </Button>
                    <Button
                      disabled={mutation.isPending}
                      onClick={() => actualizar(e.id, 'entregado')}
                      leftIcon={<ActivaIcon name="check-circle" size={18} />}
                      className="w-full sm:w-auto lg:w-full"
                    >
                      Marcar entregado
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
