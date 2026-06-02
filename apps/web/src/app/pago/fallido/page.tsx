import Link from 'next/link';
export default function PagoFallidoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✕</div>
        <h1 className="text-2xl font-bold mb-2">Pago no procesado</h1>
        <p className="text-gray-500 mb-6">No se realizó ningún cobro. Tu número sigue reservado unos minutos más.</p>
        <div className="flex gap-3">
          <Link href="/" className="btn-ghost flex-1">Volver</Link>
          <Link href="/" className="btn-primary flex-1">Reintentar</Link>
        </div>
      </div>
    </div>
  );
}
