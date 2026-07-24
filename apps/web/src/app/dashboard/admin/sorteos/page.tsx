"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { EstadoSorteo } from "@sorteos/types";
import { PageHeader } from "@/components/layout";
import {
  Badge,
  type BadgeVariant,
  Button,
  Card,
  CardContent,
  Skeleton,
} from "@/components/ui";
import { adminApi } from "@/lib/api";
import { formatFecha } from "@/lib/utils";

interface SorteoAdmin {
  id: string;
  nombre: string;
  comercio: string;
  estado: EstadoSorteo;
  created_at: string;
}

interface SorteosMeta {
  page?: number;
  limit?: number;
  total?: number;
}

interface SorteosPayload {
  data?: SorteoAdmin[] | { data?: SorteoAdmin[]; meta?: SorteosMeta };
  meta?: SorteosMeta;
}

const estadoVariant: Record<EstadoSorteo, BadgeVariant> = {
  borrador: "neutral",
  activo: "active",
  finalizado: "success",
  cancelado: "error",
};

function obtenerSorteos(payload: unknown): SorteoAdmin[] {
  if (Array.isArray(payload)) return payload;

  const response = payload as SorteosPayload | undefined;
  if (Array.isArray(response?.data)) return response.data;
  if (response?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  return [];
}

function obtenerMeta(payload: unknown): SorteosMeta {
  const response = payload as SorteosPayload | undefined;
  if (response?.data && !Array.isArray(response.data)) {
    return response.data.meta ?? {};
  }

  return response?.meta ?? {};
}

export default function AdminSorteosPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-sorteos", page],
    queryFn: () => adminApi.sorteos(page),
  });

  const sorteos = obtenerSorteos(data);
  const meta = obtenerMeta(data);
  const total = Number(meta.total ?? sorteos.length);
  const limit = Number(meta.limit ?? 30);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (isLoading) {
    return (
      <div aria-label="Cargando campañas" className="space-y-activa-24">
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
        title="Todas las campañas"
        description="Vista global de todas las campañas de la plataforma."
      />

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="border-b border-border-default bg-background-surface-muted text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <tr>
                  <th scope="col" className="px-activa-16 py-activa-12">
                    Nombre
                  </th>
                  <th scope="col" className="px-activa-16 py-activa-12">
                    Comercio
                  </th>
                  <th scope="col" className="px-activa-16 py-activa-12">
                    Estado
                  </th>
                  <th scope="col" className="px-activa-16 py-activa-12">
                    Fecha
                  </th>
                </tr>
              </thead>

              <tbody>
                {sorteos.map((sorteo) => (
                  <tr
                    key={sorteo.id}
                    className="border-b border-border-default text-text-secondary transition-colors duration-fast ease-activa last:border-b-0 hover:bg-background-surface-muted"
                  >
                    <td className="px-activa-16 py-activa-12 font-semibold text-text-primary">
                      {sorteo.nombre}
                    </td>
                    <td className="px-activa-16 py-activa-12">
                      {sorteo.comercio}
                    </td>
                    <td className="px-activa-16 py-activa-12">
                      <Badge
                        variant={estadoVariant[sorteo.estado] ?? "neutral"}
                        size="sm"
                        className="capitalize"
                      >
                        {sorteo.estado}
                      </Badge>
                    </td>
                    <td className="px-activa-16 py-activa-12">
                      {formatFecha(sorteo.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sorteos.length === 0 && (
              <div className="p-activa-32 text-center text-sm text-text-secondary">
                No hay campañas.
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
              Página {page} de {totalPages} · {total}{" "}
              {total === 1 ? "campaña" : "campañas"}
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
