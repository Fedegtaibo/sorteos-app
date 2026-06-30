'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCrearSorteo } from '@/hooks/use-sorteo';

export default function NuevoSorteoPage() {
  const router = useRouter();
  const crear = useCrearSorteo();
  const [form, setForm] = useState({
    nombre: '', descripcion: '', imagenPrincipalUrl: '', fechaSorteo: '',
    valorNumero: '', cantNumeros: '', chancesPorNumero: '1',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    crear.mutate({
      ...form,
      valorNumero: Number(form.valorNumero),
      cantNumeros: Number(form.cantNumeros),
      chancesPorNumero: Number(form.chancesPorNumero),
    }, {
      onSuccess: () => router.push('/dashboard/sorteos'),
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Nuevo sorteo</h1>
        <p className="text-gray-500 text-sm mt-1">El sorteo se crea en borrador. Podés editarlo antes de activarlo.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label">Nombre del premio *</label>
          <input className="input" placeholder="Ej: iPhone 16 Pro Max 256GB" required value={form.nombre} onChange={set('nombre')} />
        </div>
        <div>
          <label className="label">Descripción</label>
          <textarea className="input resize-none" rows={3} placeholder="Describí el premio y las condiciones del sorteo..." value={form.descripcion} onChange={set('descripcion')} />
        </div>
        <div>
          <label className="label">Imagen principal URL</label>
          <input
            type="url"
            className="input"
            placeholder="https://ejemplo.com/imagen-del-premio.jpg"
            value={form.imagenPrincipalUrl}
            onChange={set('imagenPrincipalUrl')}
          />
          <p className="text-xs text-gray-400 mt-1">
            Por ahora pegá una URL de imagen. Más adelante agregaremos carga directa desde archivo.
          </p>
        </div>

        <div>
          <label className="label">Fecha del sorteo *</label>
          <input type="datetime-local" className="input" required value={form.fechaSorteo} onChange={set('fechaSorteo')} min={new Date().toISOString().slice(0, 16)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Valor por número (ARS) *</label>
            <input type="number" className="input" placeholder="2500" required min="1" value={form.valorNumero} onChange={set('valorNumero')} />
          </div>
          <div>
            <label className="label">Cantidad de números *</label>
            <input type="number" className="input" placeholder="50" required min="2" max="10000" value={form.cantNumeros} onChange={set('cantNumeros')} />
          </div>
        </div>
        <div>
          <label className="label">Chances por número</label>
          <select className="input" value={form.chancesPorNumero} onChange={set('chancesPorNumero')}>
            {[1,2,3,5,10].map(n => <option key={n} value={n}>{n} chance{n > 1 ? 's' : ''} por número</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Con {form.chancesPorNumero} chance{Number(form.chancesPorNumero) > 1 ? 's' : ''}, cada número tiene {form.chancesPorNumero} oportunidad{Number(form.chancesPorNumero) > 1 ? 'es' : ''} de ganar.
          </p>
        </div>

        {form.cantNumeros && form.valorNumero && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-700 mb-2">Resumen del sorteo</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Números', value: form.cantNumeros },
                { label: 'Valor c/u', value: `$${Number(form.valorNumero).toLocaleString('es-AR')}` },
                { label: 'Recaudación máx.', value: `$${(Number(form.cantNumeros) * Number(form.valorNumero)).toLocaleString('es-AR')}` },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">{k.label}</div>
                  <div className="font-bold text-blue-700">{k.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="btn-ghost flex-1">Cancelar</button>
          <button type="submit" disabled={crear.isPending} className="btn-primary flex-1">
            {crear.isPending ? 'Creando...' : 'Crear sorteo en borrador'}
          </button>
        </div>
      </form>
    </div>
  );
}
