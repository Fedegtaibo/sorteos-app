import { useState, useEffect, useCallback } from 'react';
import { pagosApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function useReserva(sorteoId: string) {
  const [reservando, setReservando] = useState(false);
  const [reservaActiva, setReservaActiva] = useState<{
    numeroId: string;
    reservadoHasta: Date;
  } | null>(null);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (!reservaActiva) return;
    const interval = setInterval(() => {
      const restantes = Math.max(0, Math.floor((reservaActiva.reservadoHasta.getTime() - Date.now()) / 1000));
      setSegundosRestantes(restantes);
      if (restantes <= 0) {
        setReservaActiva(null);
        toast.error('La reserva expiró. El número volvió a estar disponible.');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [reservaActiva]);

  const reservar = useCallback(async (numeroId: string) => {
    setReservando(true);
    try {
      const res: any = await pagosApi.reservar(sorteoId, numeroId);
      setReservaActiva({
        numeroId,
        reservadoHasta: new Date(res.data.reservadoHasta),
      });
      setSegundosRestantes(res.data.minutosRestantes * 60);
      return true;
    } catch (err: any) {
      toast.error(err.message || 'No se pudo reservar el número');
      return false;
    } finally {
      setReservando(false);
    }
  }, [sorteoId]);

  const liberar = useCallback(async () => {
    if (!reservaActiva) return;
    try {
      await pagosApi.liberarReserva(sorteoId, reservaActiva.numeroId);
      setReservaActiva(null);
    } catch {
      // Ignorar errores al liberar
    }
  }, [sorteoId, reservaActiva]);

  const iniciarCheckout = useCallback(async () => {
    if (!reservaActiva) return null;
    try {
      const res: any = await pagosApi.checkout(sorteoId, reservaActiva.numeroId);
      return res.data.checkoutUrl as string;
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  }, [sorteoId, reservaActiva]);

  return {
    reservando, reservaActiva, segundosRestantes,
    reservar, liberar, iniciarCheckout,
    minutosRestantes: Math.floor(segundosRestantes / 60),
    segsRestantes: segundosRestantes % 60,
  };
}
