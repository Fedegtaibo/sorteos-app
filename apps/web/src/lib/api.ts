import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1',
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession() as any;

  if ((session as any)?.accessToken) {
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.log('ERROR API:', err.response?.data);
    console.log('STATUS:', err.response?.status);

    const msg =
      err.response?.data?.error?.message ||
      err.message ||
      'Error de red';

    return Promise.reject(new Error(msg));
  }
);

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.post('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const sorteosApi = {
  listar: (params?: any) => api.get('/sorteos', { params }),
  obtener: (id: string) => api.get(`/sorteos/${id}`),
  obtenerNumeros: (id: string) => api.get(`/sorteos/${id}/numeros`),
  verificar: (id: string) => api.get(`/sorteos/${id}/verificar`),

  misSorteos: () => api.get('/comercio/sorteos'),
  crear: (data: any) => api.post('/comercio/sorteos', data),
  activar: (id: string) => api.post(`/comercio/sorteos/${id}/activar`),
  sortear: (id: string, seedExterno: string) =>
    api.post(`/comercio/sorteos/${id}/sortear`, { seedExterno }),
};

export const pagosApi = {
  reservar: (sorteoId: string, numeroId: string) =>
    api.post(`/sorteos/${sorteoId}/numeros/${numeroId}/reservar`),

  liberarReserva: (sorteoId: string, numeroId: string) =>
    api.delete(`/sorteos/${sorteoId}/numeros/${numeroId}/reservar`),

  checkout: (sorteoId: string, numeroId: string) =>
    api.post(`/sorteos/${sorteoId}/numeros/${numeroId}/checkout`),

  simularPago: (sorteoId: string, numeroId: string) =>
    api.post(`/dev/sorteos/${sorteoId}/numeros/${numeroId}/simular-pago`),

  checkoutMultiple: (sorteoId: string, numeroIds: string[]) =>
    api.post(`/sorteos/${sorteoId}/checkout`, { numeroIds }),

  misParticipaciones: () => api.get('/me/participaciones'),

  misPremios: () => api.get('/me/premios'),

  confirmarPremio: (id: string) =>
    api.patch(`/me/premios/${id}/confirmar`),

  reclamarPremio: (id: string, motivo: string) =>
    api.patch(`/me/premios/${id}/reclamar`, { motivo }),
};

export const comercioApi = {
  perfil: () => api.get('/comercio/perfil'),

  actualizarPerfil: (data: any) =>
    api.patch('/comercio/perfil', data),

  estadisticas: () => api.get('/comercio/estadisticas'),

  entregas: () => api.get('/comercio/entregas'),

  actualizarEntrega: (id: string, data: any) =>
    api.patch(`/comercio/entregas/${id}`, data),
};

export const adminApi = {
  estadisticas: () => api.get('/admin/estadisticas'),

  sorteos: () => api.get('/admin/sorteos'),

  usuarios: () => api.get('/admin/usuarios'),

  bloquearUsuario: (id: string) =>
    api.post(`/admin/usuarios/${id}/bloquear`),

  desbloquearUsuario: (id: string) =>
    api.post(`/admin/usuarios/${id}/desbloquear`),

  comercios: (params?: any) =>
    api.get('/admin/comercios', { params }),

  aprobarComercio: (id: string) =>
    api.post(`/admin/comercios/${id}/aprobar`),

  rechazarComercio: (id: string, motivo: string) =>
    api.post(`/admin/comercios/${id}/rechazar`, { motivo }),

  suspenderComercio: (id: string) =>
    api.post(`/admin/comercios/${id}/suspender`),

  reclamos: () =>
    api.get('/admin/reclamos'),

  liberarReclamo: (id: string) =>
    api.patch(`/admin/reclamos/${id}/liberar`),

  ponerEnRevision: (id: string) =>
    api.patch(`/admin/reclamos/${id}/revision`),

  cerrarReclamo: (id: string) =>
    api.patch(`/admin/reclamos/${id}/cerrar`),
};

export const notificationsApi = {
  listar: () => api.get('/me/notificaciones'),

  marcarLeida: (id: string) =>
    api.patch(`/me/notificaciones/${id}/leida`),

  marcarTodas: () =>
    api.patch('/me/notificaciones/leer-todas'),
};

export const chatApi = {
  mensajesEntrega: (entregaId: string) =>
    api.get(`/chat/entrega/${entregaId}`),

  enviarMensaje: (entregaId: string, mensaje: string) =>
    api.post(`/chat/entrega/${entregaId}`, { mensaje }),
};

export default api;
