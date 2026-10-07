import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { TacticalNavbar } from '@/components/TacticalNavbar';

export const metadata: Metadata = {
  title: 'CIB-IMS | Buró Cibernético de Investigación - República de Panamá',
  description:
    'Sistema de Gestión de Incidentes Forenses y Repositorio Táctico de Ciberinvestigación (CIB-IMS) de la República de Panamá.',
  openGraph: {
    title: 'CIB-IMS | Buró Cibernético de Investigación - República de Panamá',
    description:
      'Sistema de Gestión de Incidentes Forenses y Repositorio Táctico de Ciberinvestigación (CIB-IMS) de la República de Panamá.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIB-IMS | Buró Cibernético de Investigación - República de Panamá',
    description:
      'Sistema de Gestión de Incidentes Forenses y Repositorio Táctico de Ciberinvestigación (CIB-IMS) de la República de Panamá.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark bg-[#070b14] text-slate-100 antialiased">
      <body suppressHydrationWarning className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <AuthProvider>
          <TacticalNavbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <footer className="border-t border-cyan-950/60 bg-[#04070d] py-4 text-center text-xs font-mono text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span>BURÓ CIBERNÉTICO DE INVESTIGACIÓN (CIB) • REPÚBLICA DE PANAMÁ</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Cumplimiento estricto: Ley 81 de 2019 • Ley 51 de 2008 • Res. AIG 18-2026
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
