import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatMonto(valor: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(valor);
}

export function formatFecha(fecha: string | Date): string {
  return new Date(fecha).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function estadoColor(estado: string): string {
  const map: Record<string, string> = {
    activo: 'bg-green-100 text-green-700',
    borrador: 'bg-blue-100 text-blue-700',
    finalizado: 'bg-gray-100 text-gray-600',
    cancelado: 'bg-red-100 text-red-700',
    pendiente: 'bg-yellow-100 text-yellow-700',
    aprobado: 'bg-green-100 text-green-700',
    suspendido: 'bg-red-100 text-red-700',
  };
  return map[estado] || 'bg-gray-100 text-gray-600';
}
