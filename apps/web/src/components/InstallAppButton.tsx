'use client';

import { useEffect, useState } from 'react';

import { ActivaIcon } from '@/components/icons';
import { Alert, Button, Card, CardContent } from '@/components/ui';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type Props = {
  className?: string;
  compact?: boolean;
};

export default function InstallAppButton({ className = '', compact = false }: Props) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const esIos = /iphone|ipad|ipod/.test(userAgent);
    const estaInstalada =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsIos(esIos);
    setIsStandalone(estaInstalada);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (isStandalone) {
      setShowHelp(true);
      return;
    }

    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
      return;
    }

    setShowHelp(true);
  };

  return (
    <>
      <Button
        variant="tertiary"
        size={compact ? 'sm' : 'lg'}
        onClick={handleInstall}
        leftIcon={<ActivaIcon name="download" size={18} />}
        className={className || undefined}
      >
        Instalar ACTIVA
      </Button>

      {showHelp && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background-inverse/80 px-activa-16 py-activa-24 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-activa-title"
          aria-describedby="install-activa-description"
        >
          <Card className="max-h-full w-full max-w-lg overflow-y-auto shadow-activa-lg">
            <CardContent className="p-activa-24 sm:p-activa-32">
              <span className="flex size-12 items-center justify-center rounded-activa-md bg-action-primary/20 text-action-secondary">
                <ActivaIcon name="download" size={24} />
              </span>

              <h2
                id="install-activa-title"
                className="mt-activa-20 font-display text-2xl font-semibold text-text-primary"
              >
                Instalá ACTIVA en tu dispositivo
              </h2>

              <p
                id="install-activa-description"
                className="mt-activa-12 text-sm leading-7 text-text-secondary"
              >
                Accedé más rápido a tus campañas, participaciones y comprobantes desde tu
                pantalla de inicio.
              </p>

              {isStandalone ? (
                <Alert
                  variant="success"
                  icon={<ActivaIcon name="check-circle" size={18} />}
                  className="mt-activa-20"
                >
                  ACTIVA ya está instalada o abierta en modo aplicación.
                </Alert>
              ) : isIos ? (
                <div className="mt-activa-20 space-y-activa-16 text-sm leading-7 text-text-secondary">
                  <Alert variant="information">
                    <p>La instalación automática no está disponible en este momento.</p>
                    <p className="mt-activa-4">
                      Podés agregar ACTIVA manualmente desde el menú de tu navegador.
                    </p>
                  </Alert>
                  <ol className="list-decimal space-y-activa-8 pl-activa-20 marker:font-semibold marker:text-action-secondary">
                    <li>Abrí ACTIVA en Safari.</li>
                    <li>Tocá el botón Compartir.</li>
                    <li>Seleccioná ‘Agregar a inicio’.</li>
                    <li>Confirmá para instalar ACTIVA.</li>
                  </ol>
                </div>
              ) : (
                <div className="mt-activa-20 space-y-activa-16 text-sm leading-7 text-text-secondary">
                  <Alert variant="information">
                    <p>La instalación automática no está disponible en este momento.</p>
                    <p className="mt-activa-4">
                      Podés agregar ACTIVA manualmente desde el menú de tu navegador.
                    </p>
                  </Alert>
                  <ol className="list-decimal space-y-activa-8 pl-activa-20 marker:font-semibold marker:text-action-secondary">
                    <li>Abrí ACTIVA en Chrome.</li>
                    <li>Abrí el menú del navegador.</li>
                    <li>Seleccioná ‘Instalar aplicación’ o ‘Agregar a pantalla principal’.</li>
                    <li>Confirmá para instalar ACTIVA.</li>
                  </ol>
                </div>
              )}

              <div className="mt-activa-24 flex flex-col gap-activa-12 sm:flex-row">
                <Button onClick={() => setShowHelp(false)}>
                  Cerrar
                </Button>

                <a
                  href="/"
                  className="inline-flex h-11 items-center justify-center rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-center text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2"
                >
                  Ir al inicio
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
