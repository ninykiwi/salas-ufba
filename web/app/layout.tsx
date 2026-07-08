import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const hankenGrotesk = Hanken_Grotesk({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Salas UFBA 2.0',
  description: 'Sistema de Gestão de Espaços Acadêmicos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={hankenGrotesk.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}