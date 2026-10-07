// app/page.tsx
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Punto de Entrada Institucional y Redirección Perimetral

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  ArrowRight,
  Lock,
  Activity,
  FileText,
  Terminal,
  Scale,
  CheckCircle,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-radial from-[#0d1527] via-[#070b14] to-[#04070d]">
      <div className="max-w-4xl mx-auto text-center font-mono space-y-6 relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-b from-cyan-950 to-slate-950 border border-cyan-500/50 shadow-2xl mb-2">
          <Shield className="w-10 h-10 text-cyan-400" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[11px] text-cyan-300 font-bold tracking-wider">
          REPÚBLICA DE PANAMÁ • BURÓ CIBERNÉTICO DE INVESTIGACIÓN (CSI CYBER)
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          CIB-IMS FORENSIC INCIDENT MANAGEMENT
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans">
          Sistema Institucional de Gestión de Incidentes Forenses, Custodia Probatoria Inmutable y Repositorio Táctico de Ciberinvestigación.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-cyan-950/80 border border-cyan-400/40 transition-all"
          >
            <span>Acceder al Panel Táctico</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Terminal de Autenticación</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
