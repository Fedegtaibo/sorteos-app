"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { formatFecha } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminUsuariosPage() {
  const qc = useQueryClient();
  const verificarEmail = useMutation({
    mutationFn: (id: string) => adminApi.verificarEmail(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-usuarios"] });
      toast.success("Email verificado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "No se pudo verificar el email");
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-usuarios"],
    queryFn: () => adminApi.usuarios() as any,
  });

  const usuarios: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  if (isLoading)
    return <div className="text-zinc-400">Cargando usuarios...</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-3xl font-black text-white">Usuarios</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Listado general de usuarios registrados en Sortealo.
        </p>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr>
                <th className="p-3">Email</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Verificado</th>
                <th className="p-3">Bloqueado</th>
                <th className="p-3">Creado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-zinc-800 text-zinc-300"
                >
                  <td className="p-3 font-semibold text-white">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">
                    {u.email_verified ? (
                      <span className="font-semibold text-emerald-400">Sí</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => verificarEmail.mutate(u.id)}
                        disabled={
                          verificarEmail.isPending &&
                          verificarEmail.variables === u.id
                        }
                        className="rounded-xl bg-amber-400 px-3 py-2 text-xs font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {verificarEmail.isPending &&
                        verificarEmail.variables === u.id
                          ? "Verificando..."
                          : "Verificar email"}
                      </button>
                    )}
                  </td>
                  <td className="p-3">{u.is_blocked ? "Sí" : "No"}</td>
                  <td className="p-3">{formatFecha(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {usuarios.length === 0 && (
            <div className="p-8 text-center text-zinc-500">
              No hay usuarios.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
