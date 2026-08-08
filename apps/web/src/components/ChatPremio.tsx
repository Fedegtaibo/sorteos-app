'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { ActivaIcon } from '@/components/icons';
import { Badge, Button, Card, CardContent, Input, Skeleton } from '@/components/ui';
import { chatApi } from '@/lib/api';

export default function ChatPremio({ entregaId }: { entregaId: string }) {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const queryClient = useQueryClient();
  const [mensaje, setMensaje] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['chat-entrega', entregaId],
    queryFn: () => chatApi.mensajesEntrega(entregaId) as any,
    enabled: !!entregaId,
    refetchInterval: 10000,
  });

  const mensajes: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  const enviar = useMutation({
    mutationFn: () => chatApi.enviarMensaje(entregaId, mensaje),
    onSuccess: () => {
      setMensaje('');
      queryClient.invalidateQueries({ queryKey: ['chat-entrega', entregaId] });
    },
    onError: (err: any) => toast.error(err.message || 'No se pudo enviar el mensaje'),
  });

  return (
    <Card variant="muted" className="mt-activa-20 min-w-0 shadow-none">
      <CardContent className="p-activa-16 sm:p-activa-20">
        <div className="flex min-w-0 flex-col gap-activa-12 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-activa-12">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
              <ActivaIcon name="chat" size={20} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Comunicación sobre la entrega
              </h3>
              <p className="mt-activa-4 text-xs leading-5 text-text-secondary">
                Conversá con el comercio impulsor. Los mensajes quedan registrados como evidencia.
              </p>
            </div>
          </div>
          <Badge variant="active" size="sm">
            Canal activo
          </Badge>
        </div>

        <div className="mt-activa-16 max-h-72 min-w-0 space-y-activa-12 overflow-y-auto rounded-activa-md border border-border-default bg-background-surface p-activa-12 sm:p-activa-16">
          {isLoading ? (
            <div aria-label="Cargando mensajes" className="space-y-activa-12">
              <Skeleton variant="text" className="max-w-[70%]" />
              <Skeleton variant="text" className="ml-auto max-w-[60%]" />
              <Skeleton variant="text" className="max-w-[75%]" />
            </div>
          ) : mensajes.length === 0 ? (
            <div className="py-activa-20 text-center">
              <span className="mx-auto grid size-10 place-items-center rounded-activa-full bg-background-surface-muted text-text-secondary">
                <ActivaIcon name="chat" size={20} />
              </span>
              <p className="mt-activa-12 text-sm font-semibold text-text-primary">
                Todavía no hay mensajes
              </p>
              <p className="mt-activa-4 text-xs text-text-secondary">
                Escribí el primero para iniciar la conversación.
              </p>
            </div>
          ) : (
            mensajes.map((m) => {
              const mio = m.sender_email === email;

              return (
                <div key={m.id} className={`flex min-w-0 ${mio ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`min-w-0 max-w-[85%] rounded-activa-md px-activa-12 py-activa-8 text-sm sm:max-w-[78%] ${
                      mio
                        ? 'bg-action-primary text-action-primary-text'
                        : 'bg-background-surface-muted text-text-primary'
                    }`}
                  >
                    <p className="mb-activa-4 break-all text-[10px] font-semibold opacity-70">
                      {mio ? 'Vos' : m.sender_email}
                    </p>
                    <p className="break-words [overflow-wrap:anywhere]">{m.mensaje}</p>

                    {mio && (
                      <p className="mt-activa-4 text-right text-[10px] font-semibold opacity-60">
                        {m.leido ? 'Leído' : 'Enviado'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-activa-16 grid min-w-0 grid-cols-1 gap-activa-8 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribí un mensaje..."
            aria-label="Mensaje"
          />

          <Button
            disabled={!mensaje.trim() || enviar.isPending}
            onClick={() => enviar.mutate()}
            leftIcon={<ActivaIcon name="arrow-right" size={18} />}
            className="w-full sm:w-auto"
          >
            Enviar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
