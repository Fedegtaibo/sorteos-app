import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Sortealo - Sorteos Verificados',
  description:
    'Participá en sorteos reales y transparentes. Comprá números, seguí los resultados y ganá premios increíbles.',

  openGraph: {
    title: 'Sortealo',
    description:
      'La plataforma moderna para sorteos verificados y transparentes.',
    type: 'website',
  },

  themeColor: '#09090b',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-100 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
