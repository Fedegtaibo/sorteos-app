'use client';

import { useSession } from 'next-auth/react';
import { ActivaIcon } from '@/components/icons';
import { Alert, Card, CardContent, Skeleton } from '@/components/ui';
import PerfilComercio from './PerfilComercio';
import PerfilParticipante from './PerfilParticipante';

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;

  if (status === 'loading') {
    return (
      <div aria-label="Cargando perfil" className="space-y-activa-24">
        <Card>
          <CardContent className="space-y-activa-12 p-activa-20 sm:p-activa-24"><Skeleton variant="text" className="h-8 max-w-sm" /><Skeleton variant="text" className="max-w-2xl" /></CardContent>
        </Card>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (role === 'comercio') {
    return <PerfilComercio />;
  }

  if (role === 'participante') {
    return <PerfilParticipante />;
  }

  return (
    <Alert variant="information" title="Perfil no disponible" icon={<ActivaIcon name="info" size={18} />}>
      Esta cuenta no tiene un perfil disponible en esta sección.
    </Alert>
  );
}
