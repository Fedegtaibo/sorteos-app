import Link from 'next/link';

export default function PagoPendientePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          ⏳
        </div>

        <h1 className="text-2xl font-bold mb-2">Pago pendiente</h1>

        <p className="text-gray-500 mb-6">
          MercadoPago todavía está procesando tu pago. Cuando se confirme,
          tu participación se registrará automáticamente.
        </p>

        <div className="flex gap-3">
          <Link href="/dashboard/participaciones" className="btn-primary flex-1">
            Ver mis participaciones
          </Link>

          <Link href="/" className="btn-ghost flex-1">
            Ver sorteos
          </Link>
        </div>
      </div>
    </div>
  );
}