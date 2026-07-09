'use client';

import { useEffect, useState } from 'react';

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
      <button
        type="button"
        onClick={handleInstall}
        className={
          className ||
          'rounded-2xl border border-amber-400/40 bg-amber-400/10 px-6 py-4 text-center text-sm font-black text-amber-300 hover:bg-amber-400 hover:text-black'
        }
      >
        {compact ? 'Instalar app' : 'Instalar Sortealo'}
      </button>

      {showHelp && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
              Instalar Sortealo
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Usá Sortealo como una app en tu celular
            </h2>

            {isStandalone ? (
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                Sortealo ya parece estar instalado o abierto en modo app.
              </p>
            ) : isIos ? (
              <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
                <p>
                  En iPhone, la instalación se hace desde Safari.
                </p>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>Abrí Sortealo en Safari.</li>
                  <li>Tocá el botón de compartir.</li>
                  <li>Elegí “Agregar a pantalla de inicio”.</li>
                  <li>Confirmá con “Agregar”.</li>
                </ol>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
                <p>
                  Si no aparece la instalación automática, podés agregar Sortealo manualmente:
                </p>
                <ol className="list-decimal space-y-2 pl-5">
                  <li>Abrí Sortealo en Chrome.</li>
                  <li>Tocá los tres puntitos del navegador.</li>
                  <li>Elegí “Instalar app” o “Agregar a pantalla principal”.</li>
                  <li>Confirmá la instalación.</li>
                </ol>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300"
              >
                Entendido
              </button>

              <a
                href="/"
                className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-zinc-300 hover:bg-white/10"
              >
                Ir al inicio
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}