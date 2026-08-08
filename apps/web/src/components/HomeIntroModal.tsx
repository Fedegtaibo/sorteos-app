'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { ActivaIcon } from '@/components/icons';
import { Button, Card, CardContent } from '@/components/ui';

const STORAGE_KEY = 'sortealo_intro_visto';

export default function HomeIntroModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const visto = window.localStorage.getItem(STORAGE_KEY);
      if (!visto) setVisible(true);
    } catch {
      setVisible(false);
    }
  }, []);

  const cerrar = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {}

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-modal grid place-items-center overflow-y-auto bg-background-inverse/80 px-activa-16 py-activa-24 backdrop-blur-sm sm:px-activa-24">
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="activa-intro-title"
        aria-describedby="activa-intro-description"
        className="w-full max-w-2xl overflow-hidden shadow-activa-lg"
      >
        <CardContent className="p-activa-20 sm:p-activa-32">
          <div className="inline-flex items-center gap-activa-8 rounded-activa-full bg-action-primary/15 px-activa-12 py-activa-8 text-xs font-semibold uppercase tracking-widest text-action-primary-text">
            <ActivaIcon name="campaign" size={16} />
            Bienvenido a ACTIVA
          </div>

          <h2
            id="activa-intro-title"
            className="mt-activa-20 font-display text-3xl font-semibold leading-tight text-text-primary sm:text-4xl"
          >
            Oportunidades que conectan personas y comercios.
          </h2>

          <p
            id="activa-intro-description"
            className="mt-activa-12 text-sm leading-7 text-text-secondary sm:text-base"
          >
            ACTIVA es una plataforma para descubrir campañas de comercios reales, participar de
            forma simple y seguir cada paso con información clara.
          </p>

          <div className="mt-activa-24 grid gap-activa-12 md:grid-cols-2">
            <div className="rounded-activa-md border border-border-default bg-background-surface-muted p-activa-16 sm:p-activa-20">
              <span className="flex size-10 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
                <ActivaIcon name="participation" size={20} />
              </span>
              <h3 className="mt-activa-12 font-display text-base font-semibold text-text-primary">
                Para personas
              </h3>
              <p className="mt-activa-4 text-sm leading-6 text-text-secondary">
                Explorás campañas, elegís tus oportunidades y consultás tus participaciones desde
                un solo lugar.
              </p>
            </div>

            <div className="rounded-activa-md border border-border-default bg-background-surface-muted p-activa-16 sm:p-activa-20">
              <span className="flex size-10 items-center justify-center rounded-activa-full bg-action-primary/15 text-action-primary-text">
                <ActivaIcon name="store" size={20} />
              </span>
              <h3 className="mt-activa-12 font-display text-base font-semibold text-text-primary">
                Para comercios
              </h3>
              <p className="mt-activa-4 text-sm leading-6 text-text-secondary">
                Como comercio impulsor, presentás un producto o experiencia y organizás tu campaña
                con una gestión clara.
              </p>
            </div>
          </div>

          <div className="mt-activa-16 flex gap-activa-12 rounded-activa-md border border-border-default bg-background-surface p-activa-16">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
              <ActivaIcon name="shield-check" size={20} />
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold text-text-primary">
                Registro claro y verificable
              </h3>
              <p className="mt-activa-4 text-sm leading-6 text-text-secondary">
                Cada participación y cada selección quedan registradas para que puedas consultar el
                proceso y el beneficio asociado con claridad.
              </p>
            </div>
          </div>

          <div className="mt-activa-24 flex flex-col-reverse gap-activa-12 sm:flex-row sm:justify-end">
            <Button variant="tertiary" size="lg" onClick={cerrar} className="w-full sm:w-auto">
              Entendido
            </Button>

            <Link
              href="#marketplace"
              onClick={cerrar}
              className="inline-flex h-[52px] w-full items-center justify-center gap-activa-8 rounded-activa-sm bg-action-primary px-activa-20 text-base font-semibold text-action-primary-text transition-colors duration-fast ease-activa hover:bg-action-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 sm:w-auto"
            >
              Explorar campañas
              <ActivaIcon name="arrow-right" size={20} />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
