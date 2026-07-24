"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout";
import {
  Badge,
  type BadgeVariant,
  Card,
  CardContent,
  Skeleton,
} from "@/components/ui";
import { adminApi } from "@/lib/api";
import { formatFecha } from "@/lib/utils";

function getBadgeVariant(accion: string): BadgeVariant {
  if (accion.includes("reclamado")) {
    return "error";
  }

  if (accion.includes("pago")) {
    return "success";
  }

  if (accion.includes("realizado")) {
    return "information";
  }

  if (accion.includes("activado")) {
    return "warning";
  }

  return "neutral";
}

export default function AdminAuditoriaPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-auditoria"],
    queryFn: () => adminApi.auditoria({ limit: 100 }) as any,
  });

  const eventos: any[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
      ? (data as any).data
      : Array.isArray((data as any)?.data?.data)
        ? (data as any).data.data
        : [];

  if (isLoading) {
    return (
      <div aria-label="Cargando auditoría" className="space-y-activa-24">
        <div className="space-y-activa-8">
          <Skeleton variant="text" className="h-8 max-w-sm" />
          <Skeleton variant="text" className="max-w-2xl" />
        </div>
        <div className="space-y-activa-16">
          <Skeleton variant="rectangular" className="h-48" />
          <Skeleton variant="rectangular" className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-activa-24 text-text-primary">
      <PageHeader
        eyebrow="Confianza y seguridad"
        title="Auditoría de acciones"
        description="Registro interno de acciones importantes de la plataforma."
      />

      {eventos.length === 0 ? (
        <Card variant="muted">
          <CardContent className="p-activa-32 text-center text-sm text-text-secondary">
            Todavía no hay eventos de auditoría.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-activa-16">
          {eventos.map((evento) => (
            <Card key={evento.id}>
              <CardContent className="p-activa-24">
                <div className="flex flex-wrap items-start justify-between gap-activa-16">
                  <div>
                    <Badge
                      variant={getBadgeVariant(evento.accion || "")}
                      size="sm"
                    >
                      {evento.accion}
                    </Badge>

                    <h2 className="mt-activa-12 text-xl font-bold text-text-primary">
                      {evento.entidad_tipo || "Evento"}{" "}
                      <span className="text-text-secondary">
                        · {evento.actor_role || "sin rol"}
                      </span>
                    </h2>

                    <p className="mt-activa-8 text-sm text-text-secondary">
                      {formatFecha(evento.created_at)}
                    </p>
                  </div>

                  <div className="text-left text-sm text-text-secondary sm:text-right">
                    <p>Actor</p>
                    <p className="font-semibold text-text-primary">
                      {evento.actor_email || evento.actor_id || "Sistema"}
                    </p>
                  </div>
                </div>

                <div className="mt-activa-20 grid gap-activa-12 text-sm md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-activa-lg bg-background-surface-muted p-activa-16">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Campaña
                    </p>
                    <p className="mt-activa-4 font-semibold text-text-primary">
                      {evento.sorteo_nombre ||
                        evento.sorteo_id ||
                        "Sin campaña"}
                    </p>
                  </div>

                  <div className="rounded-activa-lg bg-background-surface-muted p-activa-16">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Comercio
                    </p>
                    <p className="mt-activa-4 font-semibold text-text-primary">
                      {evento.comercio_nombre ||
                        evento.comercio_id ||
                        "Sin comercio"}
                    </p>
                  </div>

                  <div className="rounded-activa-lg bg-background-surface-muted p-activa-16">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      Entidad
                    </p>
                    <p className="mt-activa-4 break-all font-semibold text-text-primary">
                      {evento.entidad_id || "Sin entidad"}
                    </p>
                  </div>
                </div>

                <details className="mt-activa-16 rounded-activa-lg border border-border-default bg-background-surface-muted p-activa-16">
                  <summary className="cursor-pointer text-sm font-semibold text-action-secondary">
                    Ver metadata
                  </summary>

                  <pre className="mt-activa-16 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-text-secondary">
                    {JSON.stringify(evento.metadata || {}, null, 2)}
                  </pre>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
