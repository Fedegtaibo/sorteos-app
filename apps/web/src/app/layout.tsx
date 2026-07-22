import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import PwaRegister from '../components/PwaRegister';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: 'Sortealo - Sorteos Verificados',
  description:
    'Participa en sorteos reales y transparentes. Compra numeros, segui los resultados y gana premios increibles.',

  manifest: '/manifest.json',
  applicationName: 'Sortealo',
  appleWebApp: {
    capable: true,
    title: 'Sortealo',
    statusBarStyle: 'black-translucent',
  },

  openGraph: {
    title: 'Sortealo',
    description:
      'La plataforma moderna para sorteos verificados y transparentes.',
    type: 'website',
  },

};


export const viewport: Viewport = {
  themeColor: '#09090b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${sora.variable} font-sans bg-zinc-950 text-zinc-100 antialiased`}>
        <PwaRegister />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
