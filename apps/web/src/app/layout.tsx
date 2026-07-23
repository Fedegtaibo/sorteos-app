import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import PwaRegister from '../components/PwaRegister';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  title: 'ACTIVA | Campañas y beneficios',
  description:
    'Descubrí campañas de comercios, registrá tus participaciones y accedé a beneficios de forma clara y transparente.',

  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  applicationName: 'ACTIVA',
  appleWebApp: {
    capable: true,
    title: 'ACTIVA',
    statusBarStyle: 'black-translucent',
  },

  openGraph: {
    title: 'ACTIVA | Campañas y beneficios',
    description:
      'Campañas de comercios, participaciones registradas y beneficios en una experiencia clara y transparente.',
    type: 'website',
  },

};


export const viewport: Viewport = {
  themeColor: '#1A1D21',
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
