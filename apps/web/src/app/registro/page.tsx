'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'participante', nombre: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register(form);
      // Auto login despues del registro
      const res = await signIn('credentials', {
        email: form.email, password: form.password, redirect: false,
      });
      if (!res?.error) {
        toast.success('¡Cuenta creada exitosamente!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🎯</span>
          <h1 className="text-2xl font-bold mt-3">Crear cuenta</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Tipo de cuenta</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ value: 'participante', label: '🙋 Participante', desc: 'Quiero comprar números' },
                { value: 'comercio', label: '🏪 Comercio', desc: 'Quiero crear sorteos' }].map(r => (
                <button key={r.value} type="button"
                  onClick={() => setForm(f => ({ ...f, role: r.value }))}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === r.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="font-semibold text-sm">{r.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>
          {form.role === 'comercio' && (
            <div>
              <label className="label">Razón social</label>
              <input className="input" placeholder="Mi Comercio SRL" required
                value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="tu@email.com" required
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input type="password" className="input" placeholder="Mínimo 8 caracteres" required minLength={8}
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta? <Link href="/login" className="text-blue-600 font-semibold">Ingresá</Link>
        </p>
      </div>
    </div>
  );
}
