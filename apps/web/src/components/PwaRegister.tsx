'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const esSeguro =
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost';

    if (!esSeguro) return;

    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('No se pudo registrar el service worker:', error);
    });
  }, []);

  return null;
}