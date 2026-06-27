'use client';

import '../redesign/styles.css';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', { ...form, redirect: false });

    setLoading(false);

    if (res?.error) {
      toast.error('Email o contraseña incorrectos');
      return;
    }

    toast.success('¡Bienvenido!');
    router.push('/dashboard');
  };

  return (
    <main className="phone">
      <section className="content" style={{ minWidth: 'auto' }}>
  <div style={{ maxWidth: 620, margin: '40px auto 0' }}>
    <Link
      href="/"
      className="back"
      style={{
        display: 'inline-flex',
        marginBottom: 18,
        textDecoration: 'none',
      }}
    >
      ← Volver al inicio
    </Link>
  </div>

  <div className="card form" style={{ maxWidth: 620, margin: '18px auto 80px' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 42, marginBottom: 18 }}>🎯</div>
            <p>SORTEALO</p>
            <h1>Iniciá sesión</h1>
            <p>Accedé a tu cuenta para administrar o participar en sorteos verificados.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              EMAIL
              <input
                type="email"
                placeholder="tu@email.com"
                required
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </label>

            <label>
              CONTRASEÑA
              <input
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </label>

            <button className="pay" style={{ width: '100%', marginTop: 32 }} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar →'}
            </button>
          </form>

          <p style={{ marginTop: 28 }}>
            ¿No tenés cuenta? <Link href="/registro" className="yellow">Registrate</Link>
          </p>
        </div>
      </section>
    </main>
  );
}