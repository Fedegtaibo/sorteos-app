import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sorteosApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function useSorteos(params?: any) {
  return useQuery({
    queryKey: ['sorteos', params],
    queryFn: () => sorteosApi.listar(params) as any,
  });
}

export function useSorteo(id: string) {
  return useQuery({
    queryKey: ['sorteo', id],
    queryFn: () => sorteosApi.obtener(id) as any,
    enabled: !!id,
  });
}

export function useNumerosSorteo(id: string) {
  return useQuery({
    queryKey: ['sorteo-numeros', id],
    queryFn: () => sorteosApi.obtenerNumeros(id) as any,
    enabled: !!id,
    refetchInterval: 10000,
  });
}

export function useMisSorteos() {
  return useQuery({
    queryKey: ['mis-sorteos'],
    queryFn: () => sorteosApi.misSorteos() as any,
  });
}

export function useCrearSorteo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sorteosApi.crear,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mis-sorteos'] });
      toast.success('Sorteo creado en borrador');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useActivarSorteo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sorteosApi.activar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mis-sorteos'] });
      toast.success('Sorteo activado correctamente');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSortearSorteo() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, seedExterno }: { id: string; seedExterno: string }) =>
      sorteosApi.sortear(id, seedExterno),
    onSuccess: (data: any) => {
      qc.invalidateQueries({ queryKey: ['mis-sorteos'] });
      toast.success(`Sorteo realizado. Número ganador: ${data?.numeroGanador}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
