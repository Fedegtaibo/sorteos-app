
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCrearSorteo } from '@/hooks/use-sorteo';
import { uploadImageToCloudinary } from '@/lib/upload-image';
import { formatMonto } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NuevoSorteoPage() {
  const router = useRouter();
  const crear = useCrearSorteo();

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    imagenPrincipalUrl: '',
    fechaSorteo: '',
    valorNumero: '',
    cantNumeros: '',
    chancesPorNumero: '1',
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState('');
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const valorNumero = Number(form.valorNumero || 0);
  const cantNumeros = Number(form.cantNumeros || 0);
  const recaudacionMaxima = valorNumero * cantNumeros;

  const resumenActivo = valorNumero > 0 && cantNumeros > 0;

  const fechaMinima = useMemo(() => new Date().toISOString().slice(0, 16), []);

  const set = (k: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const seleccionarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImagenFile(null);
      setImagenPreview('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Seleccioná un archivo de imagen válido');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB');
      e.target.value = '';
      return;
    }

    setImagenFile(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubiendoImagen(true);

      let imagenPrincipalUrl = form.imagenPrincipalUrl;

      if (imagenFile) {
        imagenPrincipalUrl = await uploadImageToCloudinary(imagenFile);
      }

      crear.mutate(
        {
          ...form,
          imagenPrincipalUrl,
          valorNumero: Number(form.valorNumero),
          cantNumeros: Number(form.cantNumeros),
          chancesPorNumero: Number(form.chancesPorNumero),
        },
        {
          onSuccess: () => router.push('/dashboard/sorteos'),
        },
      );
    } catch (err: any) {
      toast.error(err.message || 'No se pudo subir la imagen');
    } finally {
      setSubiendoImagen(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-amber-400">
              Comercio
            </p>

            <h1 className="text-2xl font-black text-white md:text-3xl">
              Crear nuevo sorteo
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
              Cargá el premio, la descripción, la fecha, el valor por número y la cantidad de
              números disponibles. El sorteo se crea en borrador para que puedas revisarlo antes de
              activarlo.
            </p>
          </div>

          <Link href="/dashboard/sorteos" className="btn-ghost inline-flex justify-center">
            Volver a mis sorteos
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
        <p className="text-sm font-bold leading-7 text-amber-100">
          Antes de activar el sorteo, revisá que el premio, las condiciones, el valor del número y
          la cantidad total estén correctos. Una vez activo, los participantes podrán empezar a
          comprar números.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <label className="label">Nombre del premio *</label>
            <input
              className="input"
              placeholder="Ej: iPhone 16 Pro Max 256GB"
              required
              value={form.nombre}
              onChange={set('nombre')}
            />
            <p className="mt-2 text-xs leading-6 text-zinc-500">
              Usá un nombre claro y concreto. Es lo primero que va a ver el participante.
            </p>
          </div>

          <div>
            <label className="label">Descripción y condiciones</label>
            <textarea
              className="input resize-none"
              rows={5}
              placeholder="Describí el premio, estado, características, cómo se entrega y cualquier condición importante..."
              value={form.descripcion}
              onChange={set('descripcion')}
            />
            <p className="mt-2 text-xs leading-6 text-zinc-500">
              Mientras más clara sea la descripción, más confianza genera el sorteo.
            </p>
          </div>

          <div>
            <label className="label">Imagen principal</label>

            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                className="input"
                onChange={seleccionarImagen}
              />

              {imagenPreview && (
                <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-black">
                  <img
                    src={imagenPreview}
                    alt="Vista previa del premio"
                    className="h-64 w-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="label text-xs text-zinc-500">
                  O pegá una URL de imagen
                </label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://ejemplo.com/imagen-del-premio.jpg"
                  value={form.imagenPrincipalUrl}
                  onChange={set('imagenPrincipalUrl')}
                />
              </div>
            </div>

            <p className="mt-2 text-xs leading-6 text-zinc-500">
              Recomendado: JPG, PNG o WEBP. Tamaño máximo: 5MB.
            </p>
          </div>

          <div>
            <label className="label">Fecha del sorteo *</label>
            <input
              type="datetime-local"
              className="input"
              required
              value={form.fechaSorteo}
              onChange={set('fechaSorteo')}
              min={fechaMinima}
            />
            <p className="mt-2 text-xs leading-6 text-zinc-500">
              Indicá una fecha estimada. Podés usarla para comunicar cuándo se realizará el sorteo.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Valor por número (ARS) *</label>
              <input
                type="number"
                className="input"
                placeholder="2500"
                required
                min="1"
                value={form.valorNumero}
                onChange={set('valorNumero')}
              />
            </div>

            <div>
              <label className="label">Cantidad de números *</label>
              <input
                type="number"
                className="input"
                placeholder="50"
                required
                min="2"
                max="10000"
                value={form.cantNumeros}
                onChange={set('cantNumeros')}
              />
            </div>
          </div>

          <div>
            <label className="label">Chances por número</label>
            <select
              className="input"
              value={form.chancesPorNumero}
              onChange={set('chancesPorNumero')}
            >
              {[1, 2, 3, 5, 10].map((n) => (
                <option key={n} value={n}>
                  {n} chance{n > 1 ? 's' : ''} por número
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs leading-6 text-zinc-500">
              Con {form.chancesPorNumero} chance
              {Number(form.chancesPorNumero) > 1 ? 's' : ''}, cada número tiene{' '}
              {form.chancesPorNumero} oportunidad
              {Number(form.chancesPorNumero) > 1 ? 'es' : ''} de ganar.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-ghost flex-1"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={crear.isPending || subiendoImagen}
              className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {subiendoImagen
                ? 'Subiendo imagen...'
                : crear.isPending
                  ? 'Creando...'
                  : 'Crear sorteo en borrador'}
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
              Resumen
            </p>

            <h2 className="mt-3 text-xl font-black text-white">
              Vista rápida del sorteo
            </h2>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-600">
                  Premio
                </p>
                <p className="mt-1 font-bold text-zinc-200">
                  {form.nombre || 'Sin nombre todavía'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-600">
                    Números
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {form.cantNumeros || '0'}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-600">
                    Valor c/u
                  </p>
                  <p className="mt-1 text-lg font-black text-amber-300">
                    {valorNumero > 0 ? formatMonto(valorNumero) : '$0'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-emerald-300">
                  Recaudación máxima estimada
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-300">
                  {resumenActivo ? formatMonto(recaudacionMaxima) : '$0'}
                </p>
                <p className="mt-2 text-xs leading-6 text-zinc-400">
                  Estimación bruta si se venden todos los números.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-lg font-black text-white">
              Checklist antes de activar
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
              <li>• El premio está bien explicado.</li>
              <li>• La imagen representa claramente el premio.</li>
              <li>• El valor del número es correcto.</li>
              <li>• La cantidad de números es correcta.</li>
              <li>• La fecha del sorteo está cargada.</li>
              <li>• Las condiciones de entrega están aclaradas.</li>
            </ul>
          </section>
        </aside>
      </form>
    </div>
  );
}