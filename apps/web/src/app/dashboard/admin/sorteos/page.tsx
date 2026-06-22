'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { formatFecha } from '@/lib/utils';

export default function AdminSorteosPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-sorteos'],
    queryFn: () => adminApi.sorteos() as any,
  });

  const sorteos: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  if (isLoading) {
    return <div className="text-zinc-400">Cargando sorteos...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-3xl font-black text-white">
          Todos los sorteos
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Vista global de todos los sorteos de la plataforma.
        </p>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-zinc-500 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Comercio</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {sorteos.map((s) => (
              <tr
                key={s.id}
                className="border-t border-zinc-800 text-zinc-300"
              >
                <td className="p-3 font-semibold text-white">
                  {s.nombre}
                </td>

                <td className="p-3">
                  {s.comercio}
                </td>

                <td className="p-3">
                  {s.estado}
                </td>

                <td className="p-3">
                  {formatFecha(s.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sorteos.length === 0 && (
          <div className="text-center p-10 text-zinc-500">
            No hay sorteos.
          </div>
        )}
      </section>
    </div>
  );
}