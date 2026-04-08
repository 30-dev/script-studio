import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Script Studio | Editor de Guiones para YouTube',
  description: 'Editor de guiones basado en nodos para flujos de producción de video en YouTube con integración de IA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
