'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] border border-amber-400/30 bg-zinc-950 p-6 text-white shadow-2xl shadow-black md:p-8">
        <div className="mb-5 inline-flex rounded-full bg-amber-400 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-black">
          Bienvenido a Sortealo
        </div>

        <h2 className="text-3xl font-black leading-tight">
          Sorteos online de comercios reales, más ordenados y transparentes.
        </h2>

        <p className="mt-4 text-sm leading-7 text-zinc-400">
          En Sortealo podés elegir un sorteo, seleccionar tus números, pagar online y tener tu participación registrada dentro de tu cuenta.
        </p>

        <div className="mt-5 grid gap-3 text-sm text-zinc-300">
          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <b className="text-amber-300">Para participantes:</b> elegís números disponibles y seguís tu participación desde el dashboard.
          </div>

          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <b className="text-amber-300">Para comercios:</b> publicás sorteos, ordenás ventas y construís confianza con tus clientes.
          </div>
        </div>

        <p className="mt-5 text-xs leading-6 text-zinc-500">
          Cada sorteo es organizado por el comercio que lo publica. Sortealo brinda la plataforma para ordenar, registrar y facilitar la participación.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={cerrar}
            className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-black text-white hover:bg-white/10 sm:flex-1"
          >
            Entendido
          </button>

          <Link
            href="#marketplace"
            onClick={cerrar}
            className="rounded-2xl bg-amber-400 px-5 py-3 text-center text-sm font-black text-black hover:bg-amber-300 sm:flex-1"
          >
            Ver sorteos
          </Link>
        </div>
      </div>
    </div>
  );
}
