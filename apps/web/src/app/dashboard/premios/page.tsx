'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import ChatPremio from '@/components/ChatPremio';
import { ActivaIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout';
import { Alert, Badge, Button, Card, CardContent, Skeleton } from '@/components/ui';
import { pagosApi } from '@/lib/api';
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

export default function PremiosPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['mis-premios'],
    queryFn: () => pagosApi.misPremios() as any,
  });

  const confirmarMutation = useMutation({
    mutationFn: (id: string) => pagosApi.confirmarPremio(id),
    onSuccess: () => {
      toast.success('Recepción confirmada');
      queryClient.invalidateQueries({ queryKey: ['mis-premios'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'No se pudo confirmar');
    },
  });

  const reclamarMutation = useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) =>
      pagosApi.reclamarPremio(id, motivo),
    onSuccess: () => {
      toast.success('Reclamo iniciado');
      queryClient.invalidateQueries({ queryKey: ['mis-premios'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'No se pudo iniciar el reclamo');
    },
  });

  const premios: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  const reclamar = (id: string) => {
    const motivo = window.prompt('Contanos brevemente qué pasó con el beneficio');
    if (!motivo) return;

    reclamarMutation.mutate({ id, motivo });
  };

  if (error) {
    return (
      <Alert variant="error" title="No pudimos cargar tus beneficios">
        {(error as any).message}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div aria-label="Cargando beneficios" className="space-y-activa-24">
        <Card>
          <CardContent className="space-y-activa-12 p-activa-20 sm:p-activa-24">
            <Skeleton variant="text" className="h-8 max-w-sm" />
            <Skeleton variant="text" className="max-w-2xl" />
          </CardContent>
        </Card>
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <main className="min-w-0 space-y-activa-24 text-text-primary sm:space-y-activa-32">
      <section className="rounded-activa-lg border border-border-default bg-background-surface p-activa-20 shadow-activa-sm sm:p-activa-24 lg:p-activa-32">
        <PageHeader
          eyebrow="Persona seleccionada"
          title="Mis beneficios"
          description="Seguí el estado de tus beneficios obtenidos, confirmá la recepción o iniciá un reclamo si hubo un problema."
        />
      </section>

      {premios.length === 0 ? (
        <Card variant="muted" className="border-dashed">
          <CardContent className="py-activa-40 text-center sm:py-activa-48">
            <span className="mx-auto grid size-12 place-items-center rounded-activa-full bg-action-primary/15 text-action-primary-text">
              <ActivaIcon name="benefit" size={24} />
            </span>
            <h2 className="mt-activa-16 font-display text-xl font-semibold text-text-primary">
              Todavía no tenés beneficios registrados
            </h2>
            <p className="mx-auto mt-activa-8 max-w-md text-sm leading-6 text-text-secondary">
              Cuando una de tus participaciones resulte seleccionada, el beneficio asociado
              aparecerá acá con su estado de entrega.
            </p>
          </CardContent>
        </Card>
      ) : (
        <section aria-label="Beneficios obtenidos" className="space-y-activa-16">
          {premios.map((p) => (
            <Card key={p.id} className="min-w-0">
              <CardContent className="p-activa-16 sm:p-activa-20 lg:p-activa-24">
                <div className="flex min-w-0 flex-col gap-activa-20 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-activa-8">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-activa-md bg-action-primary/15 text-action-primary-text">
                        <ActivaIcon name="benefit" size={22} />
                      </span>
                      <h2 className="min-w-0 max-w-full break-words font-display text-xl font-semibold text-text-primary">
                        {p.sorteo_nombre}
                      </h2>
                      <EstadoEntregaBadge estado={p.estado} />
                    </div>

                    <div className="mt-activa-16 grid grid-cols-2 gap-activa-12 lg:grid-cols-4">
                      <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12">
                        <p className="text-xs text-text-secondary">Envío</p>
                        <p className="mt-activa-4 break-words text-sm font-semibold text-text-primary">
                          {p.empresa_envio || 'Sin empresa'}
                        </p>
                        <p className="mt-activa-4 break-all text-xs text-text-secondary">
                          {p.codigo_seguimiento
                            ? `Código: ${p.codigo_seguimiento}`
                            : 'Sin seguimiento'}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12">
                        <p className="text-xs text-text-secondary">Opción seleccionada</p>
                        <p className="mt-activa-4 break-words text-sm font-semibold text-text-primary">
                          #{p.numero_visible}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12">
                        <p className="text-xs text-text-secondary">Registrado</p>
                        <p className="mt-activa-4 break-words text-sm font-semibold text-text-primary">
                          {formatFecha(p.created_at)}
                        </p>
                      </div>

                      <div className="min-w-0 rounded-activa-md bg-background-surface-muted p-activa-12">
                        <p className="text-xs text-text-secondary">Comercio impulsor</p>
                        <p className="mt-activa-4 break-words text-sm font-semibold text-text-primary">
                          {p.comercio_nombre}
                        </p>
                      </div>
                    </div>

                    {p.estado === 'entregado' && (
                      <Alert
                        variant="success"
                        title="Entrega informada"
                        icon={<ActivaIcon name="delivery" size={16} />}
                        className="mt-activa-16"
                      >
                        El comercio impulsor marcó este beneficio como entregado. Confirmá la
                        recepción sólo si realmente lo recibiste.
                      </Alert>
                    )}

                    {p.estado === 'confirmado' && (
                      <Alert
                        variant="success"
                        title="Recepción confirmada"
                        icon={<ActivaIcon name="check-circle" size={16} />}
                        className="mt-activa-16"
                      >
                        La plataforma puede liberar los fondos al comercio impulsor.
                      </Alert>
                    )}

                    {p.estado === 'reclamado' && (
                      <Alert
                        variant="error"
                        title="Reclamo iniciado"
                        icon={<ActivaIcon name="warning" size={16} />}
                        className="mt-activa-16"
                      >
                        Un administrador revisará el caso antes de liberar fondos.
                      </Alert>
                    )}

                    <ChatPremio entregaId={p.id} />
                  </div>

                  <div className="flex min-w-0 shrink-0 flex-col gap-activa-8 sm:flex-row sm:flex-wrap lg:w-52 lg:flex-col">
                    <Button
                      disabled={p.estado !== 'entregado' || confirmarMutation.isPending}
                      onClick={() => confirmarMutation.mutate(p.id)}
                      leftIcon={<ActivaIcon name="check-circle" size={18} />}
                      className="w-full sm:w-auto lg:w-full"
                    >
                      Confirmar recepción
                    </Button>

                    <Button
                      variant="tertiary"
                      disabled={
                        p.estado === 'confirmado' ||
                        p.estado === 'reclamado' ||
                        reclamarMutation.isPending
                      }
                      onClick={() => reclamar(p.id)}
                      leftIcon={<ActivaIcon name="warning" size={18} />}
                      className="w-full sm:w-auto lg:w-full"
                    >
                      Abrir reclamo
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
