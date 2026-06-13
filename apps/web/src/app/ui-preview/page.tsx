'use client';

export default function UiPreviewPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0c0e0f',
      color: '#f0f2f3',
      padding: 32,
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Sorteos</h1>
      <p style={{ color: '#8a9099', marginBottom: 32 }}>
        Vista previa del nuevo diseño profesional
      </p>

      <section style={{
        background: '#131617',
        border: '1px solid #242729',
        borderRadius: 18,
        padding: 24,
        maxWidth: 900
      }}>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>iPhone 16 Pro Max 256GB</h2>
        <p style={{ color: '#8a9099', marginBottom: 20 }}>
          Sorteo verificado. Elegí tus números y participá.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: 8,
          marginBottom: 24
        }}>
          {Array.from({ length: 50 }, (_, i) => (
            <button
              key={i}
              style={{
                aspectRatio: '1',
                borderRadius: 10,
                border: '1px solid #2e3234',
                background: i < 8 ? '#f5c842' : '#1a1d1e',
                color: i < 8 ? '#0c0e0f' : '#f0f2f3',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#1a1d1e',
          borderRadius: 14,
          padding: 18
        }}>
          <div>
            <strong>8 números seleccionados</strong>
            <p style={{ color: '#8a9099', margin: 0 }}>Total: $20.000</p>
          </div>
          <button style={{
            background: '#f5c842',
            color: '#0c0e0f',
            border: 'none',
            borderRadius: 10,
            padding: '12px 22px',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            Comprar ahora →
          </button>
        </div>
      </section>
    </main>
  );
}