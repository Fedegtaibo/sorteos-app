'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { ActivaIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout';
import { MediaImage } from '@/components/media';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Textarea,
} from '@/components/ui';
import { useCrearSorteo } from '@/hooks/use-sorteo';
import { uploadImageToCloudinary } from '@/lib/upload-image';
import { formatMonto } from '@/lib/utils';

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
    <main className="mx-auto max-w-6xl space-y-activa-24 text-text-primary sm:space-y-activa-32">
      <section className="rounded-activa-lg border border-border-default bg-background-surface p-activa-20 shadow-activa-sm sm:p-activa-24 lg:p-activa-32">
        <PageHeader
          eyebrow="Comercio"
          title="Crear campaña"
          description="Presentá el producto o experiencia, definí las condiciones y revisá la información antes de activar la campaña."
          breadcrumbs={[
            { label: 'Mis campañas', href: '/dashboard/sorteos' },
            { label: 'Crear campaña' },
          ]}
          actions={(
            <Link
              href="/dashboard/sorteos"
              className="inline-flex h-11 w-full items-center justify-center gap-activa-8 rounded-activa-sm border border-action-secondary bg-background-surface px-activa-16 text-sm font-semibold text-action-secondary transition-colors duration-fast ease-activa hover:bg-activa-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 sm:w-auto"
            >
              <ActivaIcon name="arrow-left" size={18} />
              Volver a mis campañas
            </Link>
          )}
        />
      </section>

      <Alert
        variant="warning"
        title="La campaña se guardará como borrador"
        icon={<ActivaIcon name="info" size={16} />}
      >
        Revisá el producto o experiencia, las condiciones, el valor y la cantidad total. Una vez
        activa, las personas podrán comenzar a participar.
      </Alert>

      <form onSubmit={handleSubmit} className="grid min-w-0 grid-cols-1 gap-activa-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
        <Card className="min-w-0">
          <CardContent className="space-y-activa-24 p-activa-16 sm:p-activa-24">
            <div className="flex items-start gap-activa-12">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-activa-full bg-activa-teal-soft text-action-secondary">
                <ActivaIcon name="campaign" size={20} />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  Información de la campaña
                </h2>
                <p className="mt-activa-4 text-sm leading-6 text-text-secondary">
                  Completá los datos que verán las personas antes de participar.
                </p>
              </div>
            </div>

            <Input
              label="Producto o experiencia *"
              placeholder="Ej: Smartphone de última generación"
              required
              value={form.nombre}
              onChange={set('nombre')}
              helperText="Usá un nombre claro y concreto. Será la referencia principal de la campaña."
            />

            <Textarea
              label="Descripción y condiciones"
              rows={5}
              placeholder="Describí el producto o experiencia, sus características, cómo se entrega y cualquier condición importante..."
              value={form.descripcion}
              onChange={set('descripcion')}
              helperText="Una descripción clara ayuda a que las personas comprendan la propuesta."
            />

            <div className="space-y-activa-16">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Imagen principal</h3>
                <p className="mt-activa-4 text-sm text-text-secondary">
                  Recomendado: JPG, PNG o WEBP. Tamaño máximo: 5MB.
                </p>
              </div>

              <Input
                label="Subir imagen"
                type="file"
                accept="image/*"
                onChange={seleccionarImagen}
              />

              <div className="h-56 overflow-hidden rounded-activa-md border border-border-default bg-background-surface-muted sm:h-64">
                <MediaImage
                  src={imagenPreview || form.imagenPrincipalUrl}
                  alt="Vista previa del producto o experiencia"
                  placeholderVariant="image"
                  placeholderText="Imagen de la campaña pendiente"
                />
              </div>

              <Input
                label="O pegá una URL de imagen"
                type="url"
                placeholder="https://ejemplo.com/imagen-de-la-campana.jpg"
                value={form.imagenPrincipalUrl}
                onChange={set('imagenPrincipalUrl')}
              />
            </div>

            <Input
              label="Fecha estimada de selección *"
              type="datetime-local"
              required
              value={form.fechaSorteo}
              onChange={set('fechaSorteo')}
              min={fechaMinima}
              helperText="Indicá una fecha estimada para comunicar cuándo se realizará la selección."
            />

            <div className="grid gap-activa-16 sm:grid-cols-2">
              <Input
                label="Valor por opción (ARS) *"
                type="number"
                placeholder="2500"
                required
                min="1"
                value={form.valorNumero}
                onChange={set('valorNumero')}
              />

              <Input
                label="Cantidad de opciones *"
                type="number"
                placeholder="50"
                required
                min="2"
                max="10000"
                value={form.cantNumeros}
                onChange={set('cantNumeros')}
              />
            </div>

            <Select
              label="Oportunidades por opción"
              value={form.chancesPorNumero}
              onChange={set('chancesPorNumero')}
              helperText={`Cada opción tendrá ${form.chancesPorNumero} oportunidad${Number(form.chancesPorNumero) > 1 ? 'es' : ''} en el proceso de selección.`}
            >
              {[1, 2, 3, 5, 10].map((n) => (
                <option key={n} value={n}>
                  {n} oportunidad{n > 1 ? 'es' : ''} por opción
                </option>
              ))}
            </Select>

            <div className="flex flex-col-reverse gap-activa-12 border-t border-border-default pt-activa-20 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="tertiary"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={crear.isPending || subiendoImagen}
                leftIcon={<ActivaIcon name="campaign" size={18} />}
                className="w-full sm:w-auto"
              >
                {subiendoImagen
                  ? 'Subiendo imagen...'
                  : crear.isPending
                    ? 'Creando...'
                    : 'Crear campaña en borrador'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <aside className="min-w-0 space-y-activa-16 lg:sticky lg:top-activa-24">
          <Card>
            <CardContent className="p-activa-16 sm:p-activa-20">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-link">Resumen</p>
              <h2 className="mt-activa-8 font-display text-xl font-semibold text-text-primary">
                Vista previa de la campaña
              </h2>

              <div className="mt-activa-20 space-y-activa-12">
                <div className="rounded-activa-md bg-background-surface-muted p-activa-16">
                  <p className="text-xs text-text-secondary">Producto o experiencia</p>
                  <p className="mt-activa-4 break-words font-semibold text-text-primary">
                    {form.nombre || 'Sin nombre todavía'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-activa-12">
                  <div className="rounded-activa-md bg-background-surface-muted p-activa-16">
                    <p className="text-xs text-text-secondary">Opciones</p>
                    <p className="mt-activa-4 font-display text-xl font-semibold text-text-primary">
                      {form.cantNumeros || '0'}
                    </p>
                  </div>

                  <div className="rounded-activa-md bg-background-surface-muted p-activa-16">
                    <p className="text-xs text-text-secondary">Valor por opción</p>
                    <p className="mt-activa-4 font-display text-xl font-semibold text-text-primary">
                      {valorNumero > 0 ? formatMonto(valorNumero) : '$0'}
                    </p>
                  </div>
                </div>

                <Card variant="highlight">
                  <CardContent className="p-activa-16">
                    <p className="text-xs font-semibold text-text-secondary">
                      Recaudación máxima estimada
                    </p>
                    <p className="mt-activa-4 font-display text-2xl font-semibold text-text-primary">
                      {resumenActivo ? formatMonto(recaudacionMaxima) : '$0'}
                    </p>
                    <p className="mt-activa-8 text-xs leading-5 text-text-secondary">
                      Estimación bruta si se registran todas las opciones disponibles.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card variant="muted">
            <CardContent className="p-activa-16 sm:p-activa-20">
              <div className="flex items-center gap-activa-8">
                <ActivaIcon name="check-circle" size={20} className="text-action-secondary" />
                <h2 className="font-display text-lg font-semibold text-text-primary">
                  Checklist antes de activar
                </h2>
              </div>

              <ul className="mt-activa-16 space-y-activa-12">
                {[
                  'El producto o experiencia está bien explicado.',
                  'La imagen representa claramente la propuesta.',
                  'El valor por opción es correcto.',
                  'La cantidad de opciones es correcta.',
                  'La fecha estimada de selección está cargada.',
                  'Las condiciones de entrega están aclaradas.',
                ].map((item) => (
                  <li key={item} className="flex gap-activa-8 text-sm leading-6 text-text-secondary">
                    <ActivaIcon name="check" size={16} className="mt-1 shrink-0 text-action-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </form>
    </main>
  );
}
