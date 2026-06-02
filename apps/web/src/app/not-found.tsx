import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Esta página no existe.</p>
        <Link href="/" className="btn-primary">Volver al inicio</Link>
      </div>
    </div>
  );
}
