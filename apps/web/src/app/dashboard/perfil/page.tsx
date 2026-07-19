'use client';

import { useSession } from 'next-auth/react';
import PerfilComercio from './PerfilComercio';
import PerfilParticipante from './PerfilParticipante';

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;

  if (status === 'loading') {
    return (
      <div className="animate-pulse text-zinc-400">
        Cargando perfil...
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
    <section className="rounded-3xl border border-red-900 bg-red-950/30 p-8 text-red-200">
      Esta cuenta no tiene un perfil disponible en esta sección.
    </section>
  );
}