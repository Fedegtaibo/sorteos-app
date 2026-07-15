'use client';

import '../redesign/styles.css';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true';
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

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
      <section className="content" style={{ minWidth: 'auto', paddingTop: 24, paddingBottom: 48 }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <Link
            href="/"
            className="back"
            style={{
              display: 'inline-flex',
              marginBottom: 10,
              textDecoration: 'none',
              padding: '10px 16px',
              fontSize: 15,
            }}
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="card form" style={{ maxWidth: 560, margin: '12px auto 40px', padding: 30 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 34, marginBottom: 12 }}>🎯</div>
            <p>SORTEALO</p>
            <h1 style={{ fontSize: 36, margin: '8px 0 14px' }}>Iniciá sesión</h1>
            <p>Accedé a tu cuenta para administrar o participar en sorteos verificados.</p>
          </div>

          {googleEnabled && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                style={{
                  width: '100%',
                  marginBottom: 18,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#fff',
                  borderRadius: 18,
                  padding: '14px 18px',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Continuar con Google
              </button>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: 12,
                  alignItems: 'center',
                  marginBottom: 18,
                  color: '#71717a',
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                }}
              >
                <span style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                <span>o ingresá con email</span>
                <span style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit}>
            <label style={{ marginTop: 18, fontSize: 15 }}>
              EMAIL
              <input
                type="email"
                placeholder="tu@email.com"
                required
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                style={{ padding: '16px 18px', marginTop: 10, fontSize: 16 }}
              />
            </label>

            <label style={{ marginTop: 18, fontSize: 15 }}>
              CONTRASEÑA
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ padding: '16px 105px 16px 18px', marginTop: 10, fontSize: 16 }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 0,
                    background: 'transparent',
                    color: '#facc15',
                    fontWeight: 900,
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </label>

            <button className="pay" style={{ width: '100%', marginTop: 22, padding: '16px 20px', fontSize: 16 }} disabled={loading}>
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