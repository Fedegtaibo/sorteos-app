'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import { ActivaIcon } from '@/components/icons';
import { Button, Card } from '@/components/ui';
import { notificationsApi } from '@/lib/api';


export default function NotificationBell() {

  const queryClient = useQueryClient();
  const router = useRouter();
 
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

const handleNotificationClick = async (notification: any) => {
  if (!notification.leida) {
    await notificationsApi.marcarLeida(notification.id);

    await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    await queryClient.refetchQueries({ queryKey: ['notifications'] });
  }

  setOpen(false);

  if (notification.url) {
    router.push(notification.url);
  }
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
          <div className="fixed inset-0 z-[2147483647] flex items-center justify-center overflow-hidden bg-background-inverse">
            <div className="absolute inset-0 bg-gradient-to-br from-action-primary via-action-secondary to-background-inverse" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent_32%,rgba(26,29,33,0.78))]" />

            <div className="absolute left-10 top-10 animate-pulse text-text-inverse/25">
              <ActivaIcon name="star" size={120} strokeWidth={1.25} />
            </div>

            <div className="absolute bottom-10 right-10 animate-pulse text-text-inverse/25">
              <ActivaIcon name="benefit" size={140} strokeWidth={1.25} />
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 70 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-3 w-3 animate-bounce rounded-activa-full bg-action-primary"
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
              type="button"
              onClick={() => setWinnerNotification(null)}
              aria-label="Cerrar celebración"
              className="absolute right-6 top-6 z-20 flex size-12 items-center justify-center rounded-activa-full bg-background-inverse/60 text-text-inverse transition-colors duration-fast ease-activa hover:bg-background-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background-inverse"
            >
              <ActivaIcon name="close" size={28} />
            </button>

            <div className="relative z-10 mx-activa-16 max-w-5xl text-center">
              <div className="mb-activa-32 inline-flex size-32 animate-pulse items-center justify-center rounded-activa-full bg-action-primary text-action-primary-text shadow-activa-lg">
                <ActivaIcon name="benefit" size={76} strokeWidth={1.75} />
              </div>

              <div className="font-display text-xl font-semibold tracking-[0.35em] text-action-primary md:text-3xl">
                ACTIVA
              </div>

              <h1 className="mt-activa-24 font-display text-5xl font-semibold leading-none text-text-inverse drop-shadow-2xl sm:text-7xl md:text-[8rem]">
                ¡Fuiste seleccionado!
              </h1>

              <p className="mt-activa-32 text-2xl font-semibold text-text-inverse drop-shadow-xl md:text-4xl">
                {winnerNotification.mensaje}
              </p>

              <p className="mt-activa-20 text-lg font-semibold text-text-inverse/85 md:text-2xl">
                Tenés un beneficio disponible
              </p>

              <Button
                onClick={() => {
                  window.location.href = winnerNotification.url || '/dashboard/premios';
                }}
                size="lg"
                className="mt-activa-48 h-auto min-h-[52px] px-activa-32 py-activa-16 text-lg shadow-activa-lg sm:text-xl"
                rightIcon={<ActivaIcon name="arrow-right" size={20} />}
              >
                Ver mi beneficio
              </Button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={handleBellClick}
          aria-label="Notificaciones"
          aria-expanded={open}
          aria-controls="notifications-panel"
          className="relative flex size-11 items-center justify-center rounded-activa-sm border border-border-default bg-background-surface text-text-primary transition-colors duration-fast ease-activa hover:bg-background-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
        >
          <ActivaIcon name="bell" size={22} />

          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-activa-full bg-status-error px-1 text-xs font-semibold leading-none text-white">
              {unread}
            </span>
          )}
        </button>

        {open && (
          <Card
            id="notifications-panel"
            className="absolute right-0 z-50 mt-activa-8 w-[calc(100vw-2rem)] max-w-96 overflow-hidden shadow-activa-lg"
          >
            <div className="border-b border-border-default px-activa-16 py-activa-12 font-display font-semibold text-text-primary">
              Notificaciones
            </div>

            <div className="max-h-96 overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-activa-16 text-sm text-text-secondary">
                  No hay notificaciones
                </div>
              ) : (
                notifications.map((n: any) => (
  <button
    key={n.id}
    type="button"
    onClick={() => handleNotificationClick(n)}
    className={`w-full border-b border-border-default p-activa-12 text-left transition-colors duration-fast ease-activa last:border-b-0 hover:bg-background-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus ${
      !n.leida ? 'bg-action-primary/10' : 'bg-background-surface'
    }`}
  >
    <div className="font-semibold text-text-primary">{n.titulo}</div>
    <div className="mt-activa-4 text-sm leading-5 text-text-secondary">{n.mensaje}</div>
  </button>
))
              )}
            </div>
          </Card>
        )}
      </div>

      {celebration}
    </>
  );
}
