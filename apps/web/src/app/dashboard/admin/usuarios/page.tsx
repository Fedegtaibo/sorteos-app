"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/layout";
import { Badge, Button, Card, CardContent, Skeleton } from "@/components/ui";
import { adminApi } from "@/lib/api";
import { formatFecha } from "@/lib/utils";

export default function AdminUsuariosPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);

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
    queryKey: ["admin-usuarios", page],
    queryFn: () => adminApi.usuarios(page) as any,
  });

  const usuarios: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  const meta = (data as any)?.data?.meta || (data as any)?.meta || {};
  const total = Number(meta.total || usuarios.length);
  const limit = Number(meta.limit || 20);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (isLoading) {
    return (
      <div aria-label="Cargando usuarios" className="space-y-activa-24">
        <div className="space-y-activa-8">
          <Skeleton variant="text" className="h-8 max-w-xs" />
          <Skeleton variant="text" className="max-w-lg" />
        </div>
        <Skeleton variant="rectangular" className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-activa-24 text-text-primary">
      <PageHeader
        eyebrow="Administración"
        title="Usuarios"
        description="Listado general de usuarios registrados en ACTIVA."
      />

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-b border-border-default bg-background-surface-muted text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <tr>
                  <th scope="col" className="px-activa-16 py-activa-12">Email</th>
                  <th scope="col" className="px-activa-16 py-activa-12">Rol</th>
                  <th scope="col" className="px-activa-16 py-activa-12">Verificado</th>
                  <th scope="col" className="px-activa-16 py-activa-12">Bloqueado</th>
                  <th scope="col" className="px-activa-16 py-activa-12">Creado</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border-default text-text-secondary transition-colors duration-fast ease-activa last:border-b-0 hover:bg-background-surface-muted"
                  >
                    <td className="px-activa-16 py-activa-12 font-semibold text-text-primary">
                      {u.email}
                    </td>
                    <td className="px-activa-16 py-activa-12">
                      <Badge variant="neutral" size="sm">{u.role}</Badge>
                    </td>

                    <td className="px-activa-16 py-activa-12">
                      {u.email_verified ? (
                        <Badge variant="success" size="sm">Sí</Badge>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => verificarEmail.mutate(u.id)}
                          disabled={
                            verificarEmail.isPending &&
                            verificarEmail.variables === u.id
                          }
                          isLoading={
                            verificarEmail.isPending &&
                            verificarEmail.variables === u.id
                          }
                          loadingText="Verificando..."
                        >
                          Verificar email
                        </Button>
                      )}
                    </td>

                    <td className="px-activa-16 py-activa-12">
                      <Badge variant={u.is_blocked ? "error" : "neutral"} size="sm">
                        {u.is_blocked ? "Sí" : "No"}
                      </Badge>
                    </td>

                    <td className="px-activa-16 py-activa-12">
                      {formatFecha(u.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuarios.length === 0 && (
              <div className="p-activa-32 text-center text-sm text-text-secondary">
                No hay usuarios.
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-between gap-activa-12 border-t border-border-default p-activa-16 sm:flex-row">
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => setPage((actual) => Math.max(1, actual - 1))}
              disabled={page <= 1}
              className="w-full sm:w-auto"
            >
              Anterior
            </Button>

            <span className="text-center text-sm font-semibold text-text-secondary">
              Página {page} de {totalPages} · {total} usuarios
            </span>

            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() =>
                setPage((actual) => Math.min(totalPages, actual + 1))
              }
              disabled={page >= totalPages}
              className="w-full sm:w-auto"
            >
              Siguiente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
