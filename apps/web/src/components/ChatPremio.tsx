'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api';
import toast from 'react-hot-toast';

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
    <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white">Chat con el comercio</h3>
          <p className="text-xs text-zinc-500">
            Los mensajes quedan guardados como evidencia.
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
          MVP-07
        </span>
      </div>

      <div className="max-h-72 space-y-3 overflow-y-auto rounded-2xl border border-zinc-800 bg-black/30 p-4">
        {isLoading ? (
          <p className="text-sm text-zinc-500">Cargando mensajes...</p>
        ) : mensajes.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Todavía no hay mensajes. Escribí el primero.
          </p>
        ) : (
          mensajes.map((m) => {
            const mio = m.sender_email === email;

            return (
              <div key={m.id} className={`flex ${mio ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                    mio
                      ? 'bg-amber-400 text-black'
                      : 'bg-zinc-800 text-zinc-100'
                  }`}
                >
                  <p className="mb-1 text-[10px] font-bold opacity-70">
                    {mio ? 'Vos' : m.sender_email}
                  </p>
                  <p>{m.mensaje}</p>

{mio && (
  <p className="mt-1 text-right text-[10px] font-semibold opacity-60">
    {m.leido ? 'Leído' : 'Enviado'}
  </p>
)}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribí un mensaje..."
          className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
        />

        <button
          className="btn-primary text-sm"
          disabled={!mensaje.trim() || enviar.isPending}
          onClick={() => enviar.mutate()}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}