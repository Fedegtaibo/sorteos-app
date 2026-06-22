'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Gift, X, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { notificationsApi } from '@/lib/api';


export default function NotificationBell() {

  const queryClient = useQueryClient();
 
  const [open, setOpen] = useState(false);
  const [winnerNotification, setWinnerNotification] = useState<any>(null);

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.listar() as any,
    refetchInterval: 30000,
  });

  const notifications = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  const unread = notifications.filter((n: any) => !n.leida).length;

  const winnerNotificationAvailable = notifications.find(
  (n: any) => n.tipo === 'premio_ganado' && !n.leida,
);

  const fireConfetti = () => {
    confetti({
      particleCount: 350,
      spread: 180,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      confetti({
        particleCount: 220,
        spread: 120,
        origin: { x: 0.15, y: 0.45 },
      });

      confetti({
        particleCount: 220,
        spread: 120,
        origin: { x: 0.85, y: 0.45 },
      });
    }, 350);

    setTimeout(() => {
      confetti({
        particleCount: 260,
        spread: 160,
        origin: { y: 0.25 },
      });
    }, 850);
  };

  const handleBellClick = async () => {
  if (winnerNotificationAvailable) {
    setWinnerNotification(winnerNotificationAvailable);
    setOpen(false);

    await notificationsApi.marcarLeida(winnerNotificationAvailable.id);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });

    setTimeout(() => {
      fireConfetti();
    }, 100);

    return;
  }

  setOpen(!open);
};

  const celebration =
    winnerNotification && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed inset-0 z-[2147483647] flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-pink-500 to-purple-900" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_32%,rgba(0,0,0,0.72))]" />

            <div className="absolute left-10 top-10 text-white/30 animate-pulse">
              <Sparkles size={120} />
            </div>

            <div className="absolute right-10 bottom-10 text-white/30 animate-pulse">
              <Trophy size={140} />
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 70 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-3 w-3 rounded-full bg-yellow-300 animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${0.8 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setWinnerNotification(null)}
              className="absolute top-6 right-6 z-20 rounded-full bg-black/40 p-3 text-white hover:bg-black/70"
            >
              <X size={36} />
            </button>

            <div className="relative z-10 mx-4 max-w-5xl text-center">
              <div className="mb-8 inline-flex h-32 w-32 items-center justify-center rounded-full bg-yellow-300 text-black shadow-2xl animate-pulse">
                <Gift size={76} />
              </div>

              <div className="text-xl md:text-3xl font-black tracking-[0.35em] text-yellow-200 drop-shadow-xl">
                SORTEALO
              </div>

              <h1 className="mt-6 text-7xl md:text-[10rem] leading-none font-black text-white drop-shadow-2xl">
                GANASTE
              </h1>

              <p className="mt-8 text-2xl md:text-4xl font-black text-white drop-shadow-xl">
                {winnerNotification.mensaje}
              </p>

              <p className="mt-5 text-lg md:text-2xl font-semibold text-white/90">
                Tu premio te esta esperando
              </p>

              <button
                onClick={() => {
                  window.location.href = winnerNotification.url || '/dashboard/premios';
                }}
                className="mt-12 rounded-2xl bg-yellow-300 px-12 py-6 text-2xl font-black text-black shadow-2xl transition hover:scale-105 hover:bg-yellow-200"
              >
                Ver mi premio
              </button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="relative">
        <button
          onClick={handleBellClick}
          className="relative p-2 rounded-lg hover:bg-white/10 transition"
        >
          <Bell size={22} />

          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
              {unread}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-96 bg-white text-zinc-900 border rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b font-semibold">
              Notificaciones
            </div>

            <div className="max-h-96 overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm">
                  No hay notificaciones
                </div>
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b ${!n.leida ? 'bg-blue-50' : ''}`}
                  >
                    <div className="font-medium">{n.titulo}</div>
                    <div className="text-sm text-gray-600">{n.mensaje}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {celebration}
    </>
  );
}