// Tipos compartidos entre apps/api y apps/web

export type UserRole = 'admin' | 'comercio' | 'participante';
export type EstadoSorteo = 'borrador' | 'activo' | 'finalizado' | 'cancelado';
export type EstadoNumero = 'libre' | 'reservado' | 'vendido';
export type EstadoComercio = 'pendiente' | 'aprobado' | 'rechazado' | 'suspendido';
export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado' | 'devuelto' | 'cancelado';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export interface Comercio {
  id: string;
  userId: string;
  razonSocial: string;
  cuit: string;
  telefono?: string;
  estado: EstadoComercio;
  comisionPct: number;
  aprobadoAt?: string;
  createdAt: string;
}

export interface Sorteo {
  id: string;
  comercioId: string;
  comercioNombre?: string;
  nombre: string;
  descripcion?: string;
  imagenPrincipalUrl?: string;
  fechaSorteo: string;
  valorNumero: number;
  cantNumeros: number;
  chancesPorNumero: number;
  estado: EstadoSorteo;
  recaudacionTotal?: number;
  hashResultado?: string;
  activadoAt?: string;
  finalizadoAt?: string;
  createdAt: string;
  stats?: { libres: number; reservados: number; vendidos: number };
}

export interface Numero {
  id: string;
  sorteoId: string;
  numeroVisible: number;
  estado: EstadoNumero;
  reservadoHasta?: string;
}

export interface Participacion {
  id: string;
  usuarioId: string;
  numeroId: string;
  sorteoId: string;
  montoPagado: number;
  comprobanteUrl?: string;
  createdAt: string;
  // Campos unidos
  numeroVisible?: number;
  sorteoNombre?: string;
  sorteoEstado?: EstadoSorteo;
  comercio?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
  meta?: { page: number; limit: number; total: number; totalPages: number };
}
