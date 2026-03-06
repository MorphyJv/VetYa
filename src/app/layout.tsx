import { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeContext';

export const metadata: Metadata = {
  title: {
    template: '%s | VetYa',
    default: 'VetYa - Tu veterinario 24/7 de confianza',
  },
  description: 'Con conecta rápido con atención veterinaria. Historial médico, calendario de vacunas, chat con IA y emergencias SOS para tu mascota.',
  keywords: ['veterinario', 'mascotas', 'emergencia veterinaria', 'historial medico mascotas', 'IA veterinaria'],
  authors: [{ name: 'Antigravity' }],
  creator: 'VetYa Team',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://vetya.app',
    title: 'VetYa - Salud y cuidado para tu mascota',
    description: 'Gestión moderna para familias con mascotas. App integral con recordatorios, SOS y Asistente IA.',
    siteName: 'VetYa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VetYa - Tu veterinario 24/7',
    description: 'Cuidamos a los que más quieres. Gestiona la salud de tu mascota fácilmente.',
  },
};

import SplashScreen from "@/components/SplashScreen";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="font-sans">
      <body className="bg-[var(--background)] text-[var(--foreground)] min-h-screen antialiased selection:bg-[var(--vy-primary-200)] selection:text-[var(--vy-primary-900)]">
        <ThemeProvider>
          <SplashScreen>
            {children}
          </SplashScreen>
        </ThemeProvider>
      </body>
    </html>
  );
}
